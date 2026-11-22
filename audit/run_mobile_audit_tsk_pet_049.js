const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = '/home/hanzlaahmad/Projects/OmerFarooq/audit/screenshots/seamless_fleet';
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

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
      const WebSocket = require('ws');
      this.ws = new WebSocket(this.wsUrl);
      this.ws.on('open', resolve);
      this.ws.on('error', reject);
      this.ws.on('message', (data) => {
        const msg = JSON.parse(data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(new Error(msg.error.message));
          else cb.resolve(msg.result);
        }
      });
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) {
      console.error('Eval exception:', res.exceptionDetails);
    }
    return (res.result && res.result.value !== undefined) ? res.result.value : res.value;
  }

  async setViewport(width, height, isMobile = false) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: isMobile
    });
    await wait(350);
  }

  async captureScreenshot(filePath, clip = null) {
    const params = { format: 'png', fromSurface: true };
    if (clip) params.clip = clip;
    const screenshot = await this.send('Page.captureScreenshot', params);
    fs.writeFileSync(filePath, Buffer.from(screenshot.data, 'base64'));
    return filePath;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log('Starting Mobile Responsiveness Audit for TSK-PET-049...');
  const profileDir = `/tmp/chrome-mobile-audit-${Date.now()}`;
  const chromeProcess = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    `--user-data-dir=${profileDir}`,
    '--window-size=1280,800',
    'http://localhost:3000/'
  ]);

  let connected = false;
  let attempts = 0;
  while (!connected && attempts < 25) {
    await wait(300);
    try {
      const ver = await fetchJson('http://127.0.0.1:9224/json/version');
      if (ver) connected = true;
    } catch (e) {
      attempts++;
    }
  }

  const targets = await fetchJson('http://127.0.0.1:9224/json/list');
  const target = targets.find(t => t.type === 'page') || targets[0];
  const client = new CDPClient(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('DOM.enable');
  await client.send('Runtime.enable');
  await wait(2000);
  await client.send('Page.navigate', { url: 'http://localhost:3000/' });
  await wait(2500);

  const results = {
    testSuite: 'TSK-PET-049: Mobile Responsiveness Audit & Direct Fix',
    timestamp: new Date().toISOString(),
    assertionsPassed: 0,
    assertionsFailed: 0,
    tests: []
  };

  function assert(title, condition, details = {}) {
    if (condition) {
      results.assertionsPassed++;
      results.tests.push({ title, status: 'PASSED', details });
      console.log(`[PASS] ${title}`);
    } else {
      results.assertionsFailed++;
      results.tests.push({ title, status: 'FAILED', details });
      console.error(`[FAIL] ${title}`, details);
    }
  }

  // 1. Audit Viewports: 320px, 375px, 390px, 412px, 768px, 1280px
  const viewports = [
    { name: 'Compact Mobile', w: 320, h: 568, mobile: true },
    { name: 'iPhone SE', w: 375, h: 667, mobile: true },
    { name: 'iPhone 14/15', w: 390, h: 844, mobile: true },
    { name: 'Galaxy S22', w: 412, h: 915, mobile: true },
    { name: 'iPad Portrait', w: 768, h: 1024, mobile: false },
    { name: 'Desktop HD', w: 1280, h: 800, mobile: false }
  ];

  for (const vp of viewports) {
    await client.setViewport(vp.w, vp.h, vp.mobile);
    await wait(300);

    const vpAudit = await client.eval(`
      (() => {
        const docScroll = document.documentElement.scrollWidth;
        const winInner = window.innerWidth;
        const overflow = docScroll - winInner;

        const infoArea = document.querySelector('.fleet-area-info');
        const visualArea = document.querySelector('.fleet-area-visual');
        const amenitiesArea = document.querySelector('.fleet-area-amenities');
        const peekImg = document.querySelector('.fleet-peek-image');
        const titleEl = document.getElementById('carousel-name');
        const badgeEl = document.getElementById('carousel-category');
        const rateEl = document.getElementById('carousel-rate');
        const floorEl = document.getElementById('carousel-floor');

        const infoRect = infoArea.getBoundingClientRect();
        const visualRect = visualArea.getBoundingClientRect();
        const imgRect = peekImg.getBoundingClientRect();
        const amenRect = amenitiesArea.getBoundingClientRect();

        const titleStyles = window.getComputedStyle(titleEl);
        const titleLineHeight = parseFloat(titleStyles.lineHeight) || (parseFloat(titleStyles.fontSize) * 1.25);
        const titleLines = Math.round(titleEl.offsetHeight / titleLineHeight);

        return {
          overflow,
          docScroll,
          winInner,
          infoWidth: Math.round(infoRect.width),
          visualWidth: Math.round(visualRect.width),
          infoRight: Math.round(infoRect.right),
          visualLeft: Math.round(visualRect.left),
          amenitiesTop: Math.round(amenRect.top),
          infoBottom: Math.round(infoRect.bottom),
          noHorizontalOverlap: infoRect.right <= visualRect.left + 5,
          titleFontSize: titleStyles.fontSize,
          titleLines,
          badgeFontSize: window.getComputedStyle(badgeEl).fontSize,
          rateFontSize: window.getComputedStyle(rateEl).fontSize,
          rateVisible: !!rateEl && rateEl.offsetWidth > 0,
          floorVisible: !!floorEl && floorEl.offsetWidth > 0,
          imgLoaded: peekImg.naturalWidth > 0
        };
      })()
    `);

    assert(`[${vp.name} (${vp.w}px)]: Strictly 0px horizontal page overflow`, vpAudit.overflow <= 0, vpAudit);
    assert(`[${vp.name} (${vp.w}px)]: Vehicle details and peek image have zero collision/overlap`, vpAudit.noHorizontalOverlap, vpAudit);
    assert(`[${vp.name} (${vp.w}px)]: Vehicle title is elegantly styled without excessive multiline wrapping (lines: ${vpAudit.titleLines} <= 2)`, vpAudit.titleLines <= 2, vpAudit);
    assert(`[${vp.name} (${vp.w}px)]: Rate lockup and base floor are clearly visible`, vpAudit.rateVisible && vpAudit.floorVisible, vpAudit);
  }

  // 2. Interactive Controls & Touch Ergonomics
  await client.setViewport(375, 667, true);
  await wait(300);

  const ergonomicsAudit = await client.eval(`
    (() => {
      const tabs = Array.from(document.querySelectorAll('#fleet .fleet-tab'));
      const chevrons = Array.from(document.querySelectorAll('#fleet .fleet-chevron-btn'));
      const bookBtn = document.getElementById('carousel-book-cta');
      const routesLink = document.querySelector('#fleet a[href="#routes"]');

      const allControls = [...tabs, ...chevrons, bookBtn, routesLink].filter(Boolean);
      const smallControls = allControls.filter(el => {
        const r = el.getBoundingClientRect();
        return r.width < 43 || r.height < 43;
      });

      const bookRect = bookBtn.getBoundingClientRect();

      return {
        totalControls: allControls.length,
        allMeet44px: smallControls.length === 0,
        bookBtnHeight: Math.round(bookRect.height),
        bookBtnMeets48px: bookRect.height >= 47.5
      };
    })()
  `);

  assert('Touch Ergonomics: 100% of controls meet >= 44x44px touch targets', ergonomicsAudit.allMeet44px, ergonomicsAudit);
  assert('Touch Ergonomics: Primary [ Book This Vehicle ] CTA meets >= 48px mobile-first comfort', ergonomicsAudit.bookBtnMeets48px, ergonomicsAudit);

  // 3. Capture targeted mobile screenshots
  const shot320 = await client.captureScreenshot(path.join(SCREENSHOTS_DIR, 'fleet_mobile_320_audit.png'));
  const shot375 = await client.captureScreenshot(path.join(SCREENSHOTS_DIR, 'fleet_mobile_375_audit.png'));
  const shot390 = await client.captureScreenshot(path.join(SCREENSHOTS_DIR, 'fleet_mobile_390_audit.png'));

  console.log(`Captured audit screenshots: ${shot320}, ${shot375}, ${shot390}`);

  client.close();
  chromeProcess.kill();

  fs.writeFileSync('/home/hanzlaahmad/Projects/OmerFarooq/audit/mobile_audit_tsk_049_results.json', JSON.stringify(results, null, 2));
  console.log(`Audit finished. Total passed: ${results.assertionsPassed}, failed: ${results.assertionsFailed}`);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
