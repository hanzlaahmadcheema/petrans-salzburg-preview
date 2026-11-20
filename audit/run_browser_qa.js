const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = '/home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/screenshots';
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'iPhone_SE_375x667', width: 375, height: 667, dsf: 2, mobile: true },
  { name: 'iPhone_14_15_390x844', width: 390, height: 844, dsf: 3, mobile: true },
  { name: 'Samsung_S22_412x915', width: 412, height: 915, dsf: 2.625, mobile: true },
  { name: 'iPad_768x1024', width: 768, height: 1024, dsf: 2, mobile: true },
  { name: 'Desktop_1280x800', width: 1280, height: 800, dsf: 1, mobile: false }
];

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(new Error(msg.error.message));
          else cb.resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function main() {
  console.log('Starting headless Chrome on port 9222...');
  const chromeProcess = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:3000'
  ]);

  let connected = false;
  let attempts = 0;
  while (!connected && attempts < 20) {
    await wait(300);
    try {
      const ver = await fetchJson('http://127.0.0.1:9222/json/version');
      if (ver) connected = true;
    } catch (e) {
      attempts++;
    }
  }

  if (!connected) {
    console.error('Failed to connect to Chrome on port 9222');
    chromeProcess.kill();
    process.exit(1);
  }

  console.log('Connected to Chrome. Getting target list...');
  let targets = await fetchJson('http://127.0.0.1:9222/json/list');
  let target = targets.find(t => t.type === 'page' && t.url.includes('localhost:3000'));
  if (!target && targets.length > 0) target = targets[0];

  const client = new CDPClient(target.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('DOM.enable');
  await client.send('Runtime.enable');

  await wait(1500); // Wait for page scripts and Tailwind to load

  const report = {
    testDate: new Date().toISOString(),
    viewports: {},
    assetVerification: {},
    touchTargetsSummary: {},
    drawerVerification: {},
    bookingWizardVerification: {},
    emojiAndIconifySummary: {}
  };

  // 1. Asset HTTP Verification
  console.log('Verifying assets...');
  const assetsToVerify = [
    '/images/salzburg-hero.jpg',
    '/images/salzburg-hero-mobile.jpg',
    '/images/salzburg-hero.webp',
    '/images/mercedes-v-class.png',
    '/images/mercedes-vito.png'
  ];

  for (const asset of assetsToVerify) {
    await new Promise((resolve) => {
      http.get(`http://localhost:3000${asset}`, (res) => {
        report.assetVerification[asset] = {
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          contentLength: res.headers['content-length']
        };
        res.resume();
        resolve();
      }).on('error', (err) => {
        report.assetVerification[asset] = { error: err.message };
        resolve();
      });
    });
  }

  // 2. Viewport Loop
  for (const vp of VIEWPORTS) {
    console.log(`Testing viewport ${vp.name} (${vp.width}x${vp.height})...`);
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dsf,
      mobile: vp.mobile
    });
    await wait(800);

    const vpAuditRes = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollW = docEl.scrollWidth;
          const innerW = window.innerWidth;
          const hasHorizontalOverflow = scrollW > innerW;

          // Find any overflowing elements
          const overflowing = [];
          document.querySelectorAll('*').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.right > innerW + 1) {
              overflowing.push({
                tag: el.tagName,
                id: el.id,
                className: (el.className || '').toString().slice(0, 50),
                right: Math.round(r.right),
                width: Math.round(r.width)
              });
            }
          });

          // Touch target checks
          function checkTargets(selector) {
            return Array.from(document.querySelectorAll(selector))
              .filter(el => {
                const r = el.getBoundingClientRect();
                return r.width > 0 && r.height > 0 && window.getComputedStyle(el).display !== 'none';
              })
              .map(el => {
                const r = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                return {
                  text: (el.innerText || el.getAttribute('aria-label') || el.id || '').trim().slice(0, 25),
                  width: Math.round(r.width * 10) / 10,
                  height: Math.round(r.height * 10) / 10,
                  fontSize: style.fontSize,
                  passed: r.width >= 43.5 && r.height >= 43.5
                };
              });
          }

          const goldBtns = checkTargets('.btn-gold');
          const outlineBtns = checkTargets('.btn-outline-gold');
          const quickChips = checkTargets('.quick-chip');
          const counterBtns = checkTargets('.counter-btn');
          const langSelect = checkTargets('#lang-select');
          const hamburger = checkTargets('#mobile-menu-btn');

          // Form input font sizes
          const formInputs = Array.from(document.querySelectorAll('.form-input, #booking-stepper input, #booking-stepper select, #booking-stepper textarea'))
            .filter(el => el.type !== 'checkbox' && el.type !== 'radio')
            .map(el => ({
              id: el.id,
              tag: el.tagName,
              fontSize: window.getComputedStyle(el).fontSize,
              meets16px: parseFloat(window.getComputedStyle(el).fontSize) >= 16
            }));

          // Hero presentation
          const heroImg = document.querySelector('.hero-salzburg-img');
          const heroRect = heroImg ? heroImg.getBoundingClientRect() : null;
          const heroComputed = heroImg ? window.getComputedStyle(heroImg) : null;

          // Fleet 3D renders presentation
          const vClassImg = document.querySelector('img[src*="mercedes-v-class.png"]');
          const vitoImg = document.querySelector('img[src*="mercedes-vito.png"]');

          return {
            innerWidth: innerW,
            scrollWidth: scrollW,
            hasHorizontalOverflow,
            overflowingElementsCount: overflowing.length,
            overflowingElements: overflowing.slice(0, 5),
            touchTargets: {
              goldBtns,
              outlineBtns,
              quickChips,
              counterBtns,
              langSelect,
              hamburger
            },
            formInputs,
            hero: {
              width: heroRect ? Math.round(heroRect.width) : 0,
              height: heroRect ? Math.round(heroRect.height) : 0,
              objectFit: heroComputed ? heroComputed.objectFit : null,
              objectPosition: heroComputed ? heroComputed.objectPosition : null
            },
            fleet: {
              vClass: vClassImg ? { naturalW: vClassImg.naturalWidth, naturalH: vClassImg.naturalHeight, complete: vClassImg.complete } : null,
              vito: vitoImg ? { naturalW: vitoImg.naturalWidth, naturalH: vitoImg.naturalHeight, complete: vitoImg.complete } : null
            }
          };
        })()
      `,
      returnByValue: true
    });

    const val = (vpAuditRes.result && vpAuditRes.result.value !== undefined) ? vpAuditRes.result.value : vpAuditRes.value;
    report.viewports[vp.name] = val || {};

    // Capture screenshot
    const screenshot = await client.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    const screenshotPath = path.join(SCREENSHOTS_DIR, `${vp.name}.png`);
    fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'));
    report.viewports[vp.name].screenshotPath = screenshotPath;
  }

  // 3. Test Drawer specifically on Mobile (iPhone 14)
  console.log('Testing mobile navigation drawer...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true
  });
  await wait(500);

  const drawerTestRes = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const drawer = document.getElementById('mobile-drawer');
        const backdrop = document.getElementById('mobile-drawer-backdrop');
        const closeBtn = document.getElementById('drawer-close-btn');

        const stateBefore = {
          drawerHasOpen: drawer.classList.contains('open'),
          backdropHasOpen: backdrop.classList.contains('open')
        };

        menuBtn.click();
        const stateAfterOpen = {
          drawerHasOpen: drawer.classList.contains('open'),
          backdropHasOpen: backdrop.classList.contains('open'),
          bodyOverflow: document.body.style.overflow
        };

        closeBtn.click();
        const stateAfterClose = {
          drawerHasOpen: drawer.classList.contains('open'),
          backdropHasOpen: backdrop.classList.contains('open'),
          bodyOverflow: document.body.style.overflow
        };

        return { stateBefore, stateAfterOpen, stateAfterClose };
      })()
    `,
    returnByValue: true
  });
  report.drawerVerification = (drawerTestRes.result && drawerTestRes.result.value !== undefined) ? drawerTestRes.result.value : drawerTestRes.value;

  // 4. Test Booking Stepper End-to-End
  console.log('Testing 6-step booking flow...');
  const stepperTestRes = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const log = {};

        // Step 1
        goToStep(1);
        setQuickRoute('Hallstatt Lahn Terminal', 73);
        adjustStops(2);
        log.step1 = {
          pickup: document.getElementById('step1-pickup').value,
          dropoff: document.getElementById('step1-dropoff').value,
          distance: appState.distanceKm,
          stops: appState.intermediateStops
        };

        // Step 2
        goToStep(2);
        document.getElementById('step2-flight').value = 'OS 204';
        log.step2 = {
          date: document.getElementById('step2-date').value,
          time: document.getElementById('step2-time').value,
          flight: document.getElementById('step2-flight').value
        };

        // Step 3
        goToStep(3);
        // Boundaries test:
        for (let i = 0; i < 15; i++) adjustPax(1);
        const paxCapMax = appState.passengerCount;
        for (let i = 0; i < 20; i++) adjustPax(-1);
        const paxCapMin = appState.passengerCount;
        adjustPax(3); // 4 pax

        for (let i = 0; i < 15; i++) adjustLuggage(1);
        const lugCapMax = appState.largeLuggageCount;
        for (let i = 0; i < 20; i++) adjustLuggage(-1);
        const lugCapMin = appState.largeLuggageCount;
        adjustLuggage(4); // 4 bags

        // Select Vito Tourer
        const vitoCard = document.querySelector('.vehicle-card[data-veh="VITO"]');
        if (vitoCard) vitoCard.click();
        const vitoChosen = appState.vehicleCategory;

        // Re-select V-Class
        const vClassCard = document.querySelector('.vehicle-card[data-veh="V_CLASS"]');
        if (vClassCard) vClassCard.click();
        const vClassChosen = appState.vehicleCategory;

        log.step3 = {
          paxCapMin, paxCapMax, paxFinal: appState.passengerCount,
          lugCapMin, lugCapMax, lugFinal: appState.largeLuggageCount,
          vitoChosen, vClassChosen
        };

        // Step 4
        goToStep(4);
        adjustAddon('baby', 1);
        adjustAddon('booster', 2);
        adjustAddon('ski', 4);
        const wheelchair = document.getElementById('addon-wheelchair');
        if (wheelchair) wheelchair.checked = true;
        log.step4 = {
          baby: appState.childSeats.baby,
          booster: appState.childSeats.booster,
          ski: appState.skiEquipment,
          wheelchair: wheelchair ? wheelchair.checked : false
        };

        // Step 5
        goToStep(5);
        document.getElementById('cust-name').value = 'Chauffeur QA User';
        document.getElementById('cust-email').value = 'qa@petrans.at';
        document.getElementById('cust-phone').value = '+436606416464';
        document.getElementById('cust-notes').value = 'Night arrival terminal 1.';
        log.step5 = {
          name: document.getElementById('cust-name').value,
          email: document.getElementById('cust-email').value,
          phone: document.getElementById('cust-phone').value
        };

        // Step 6
        goToStep(6);
        log.step6 = {
          route: document.getElementById('sum-route').textContent,
          vehicle: document.getElementById('sum-vehicle').textContent,
          pax: document.getElementById('sum-pax').textContent,
          bags: document.getElementById('sum-bags').textContent,
          base: document.getElementById('sum-base-price').textContent,
          stops: document.getElementById('sum-stops-price').textContent,
          net: document.getElementById('sum-net-price').textContent,
          vat: document.getElementById('sum-vat-price').textContent,
          total: document.getElementById('sum-total-price').textContent
        };

        return log;
      })()
    `,
    returnByValue: true
  });
  report.bookingWizardVerification = (stepperTestRes.result && stepperTestRes.result.value !== undefined) ? stepperTestRes.result.value : stepperTestRes.value;

  // 5. Zero Emoji & Iconify Verification
  console.log('Auditing zero emojis and Iconify...');
  const iconAuditRes = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        // Non-alphanumeric pictographs excluding standard symbols
        const emojiMatches = text.match(/\\p{Extended_Pictographic}/gu) || [];
        const nonStandardEmojis = emojiMatches.filter(ch => ch !== '©' && ch !== '®');

        const icons = Array.from(document.querySelectorAll('iconify-icon'));
        const iconList = Array.from(new Set(icons.map(i => i.getAttribute('icon'))));

        const langPickerText = Array.from(document.querySelectorAll('#lang-select option')).map(o => o.text);

        return {
          totalEmojiCount: nonStandardEmojis.length,
          emojisFound: nonStandardEmojis,
          iconifyCount: icons.length,
          uniqueIcons: iconList,
          langPickerOptions: langPickerText
        };
      })()
    `,
    returnByValue: true
  });
  report.emojiAndIconifySummary = (iconAuditRes.result && iconAuditRes.result.value !== undefined) ? iconAuditRes.result.value : iconAuditRes.value;

  const jsonReportPath = '/home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/browser_qa_results.json';
  fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));
  console.log(`Report successfully written to ${jsonReportPath}`);

  client.close();
  chromeProcess.kill();
  console.log('Test completed successfully.');
}

main().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
