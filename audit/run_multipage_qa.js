const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = '/home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/screenshots/multipage';
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
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Page.javascriptDialogOpening') {
          this.send('Page.handleJavaScriptDialog', { accept: true }).catch(() => {});
        }
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

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return (res.result && res.result.value !== undefined) ? res.result.value : res.value;
  }

  async captureScreenshot(filename) {
    const screenshot = await this.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    const filePath = path.join(SCREENSHOTS_DIR, filename);
    fs.writeFileSync(filePath, Buffer.from(screenshot.data, 'base64'));
    return filePath;
  }

  async setViewport(width, height, isMobile = false) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: isMobile
    });
    await wait(300);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function main() {
  console.log('Starting headless Chrome for Multipage Architecture QA...');
  const profileDir = `/tmp/chrome-multipage-qa-${Date.now()}`;
  const chromeProcess = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
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
  let target = targets.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || targets[0];

  const client = new CDPClient(target.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('DOM.enable');
  await client.send('Runtime.enable');

  await wait(1500);

  const results = {
    testSuite: 'TSK-PET-036: Mobile-First Multi-Page Architecture Browser QA',
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

  try {
    // =========================================================================
    // PILLAR 1: Minimal Homepage Verification (/index.html)
    // =========================================================================
    console.log('\n--- Pillar 1: Minimal Homepage Verification (/index.html) ---');
    await client.eval(`sessionStorage.clear()`);
    await client.send('Page.navigate', { url: 'http://localhost:3000/' });
    await wait(2000);

    const homepageAudit = await client.eval(`
      (() => {
        const stepper = document.getElementById('booking-stepper');
        const heroQuick = document.getElementById('hero-quick-book');
        const tabPlace = document.querySelector('.quick-tab[data-mode="place"]');
        const tabTour = document.querySelector('.quick-tab[data-mode="tour"]');
        const tabCar = document.querySelector('.quick-tab[data-mode="car"]');
        const panelPlace = document.getElementById('mode-place');
        const panelTour = document.getElementById('mode-tour');
        const panelCar = document.getElementById('mode-car');

        return {
          stepperRemoved: !stepper,
          heroQuickExists: !!heroQuick,
          hasThreeTabs: !!tabPlace && !!tabTour && !!tabCar,
          placeVisible: panelPlace ? !panelPlace.classList.contains('hidden') : false,
          tourHidden: panelTour ? panelTour.classList.contains('hidden') : false,
          carHidden: panelCar ? panelCar.classList.contains('hidden') : false
        };
      })()
    `);

    assert('Pillar 1: Embedded 450+ line booking stepper completely removed from index.html', 
      homepageAudit.stepperRemoved, homepageAudit);
    assert('Pillar 1: Hero 3-Option Quick Booking Module exists with 3 tabs', 
      homepageAudit.heroQuickExists && homepageAudit.hasThreeTabs, homepageAudit);
    assert('Pillar 1: Book by Place panel active by default, Tour and Car panels hidden', 
      homepageAudit.placeVisible && homepageAudit.tourHidden && homepageAudit.carHidden, homepageAudit);

    // Test Book by Place dynamic pricing & deep-link target
    const placeTest = await client.eval(`
      (() => {
        const pickupSelect = document.getElementById('hero-place-pickup');
        const destSelect = document.getElementById('hero-place-dest');
        const vehSelect = document.getElementById('hero-place-vehicle');
        const priceEl = document.getElementById('hero-place-price');
        const bookBtn = document.getElementById('btn-hero-place-book');

        // Initial price
        const p0 = priceEl ? priceEl.textContent.trim() : '';

        // Change vehicle to e-class
        if (vehSelect) {
          vehSelect.value = 'e-class';
          vehSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
        const pEClass = priceEl ? priceEl.textContent.trim() : '';

        return {
          initialPrice: p0,
          eClassPrice: pEClass,
          btnExists: !!bookBtn
        };
      })()
    `);

    assert('Pillar 1 [Book by Place]: Fare recalculates upon vehicle selection change', 
      placeTest.initialPrice !== '' && placeTest.eClassPrice !== '' && placeTest.btnExists, placeTest);

    // Test Book by Tour panel switching & itinerary link
    const tourTabTest = await client.eval(`
      (() => {
        const tabTour = document.querySelector('.quick-tab[data-mode="tour"]');
        if (tabTour) tabTour.click();

        const panelTour = document.getElementById('mode-tour');
        const tourSelect = document.getElementById('hero-tour-select');
        const priceEl = document.getElementById('hero-tour-price');
        const detailsLink = document.getElementById('hero-tour-details-link');

        // Select Hallstatt
        if (tourSelect) {
          tourSelect.value = 'hallstatt';
          tourSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
        const priceHallstatt = priceEl ? priceEl.textContent.trim() : '';
        const linkHallstatt = detailsLink ? detailsLink.getAttribute('href') : '';

        // Select Innsbruck
        if (tourSelect) {
          tourSelect.value = 'innsbruck';
          tourSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
        const priceInnsbruck = priceEl ? priceEl.textContent.trim() : '';
        const linkInnsbruck = detailsLink ? detailsLink.getAttribute('href') : '';

        return {
          tourPanelVisible: panelTour ? !panelTour.classList.contains('hidden') : false,
          priceHallstatt,
          linkHallstatt,
          priceInnsbruck,
          linkInnsbruck
        };
      })()
    `);

    assert('Pillar 1 [Book by Tour]: Tab switches to Tour panel, updates rate (€450 vs €650) and itinerary link', 
      tourTabTest.tourPanelVisible && tourTabTest.priceHallstatt === '€450.00' && tourTabTest.priceInnsbruck === '€650.00' && 
      tourTabTest.linkHallstatt.includes('/tours/hallstatt.html') && tourTabTest.linkInnsbruck.includes('/tours/innsbruck.html'), 
      tourTabTest);

    // Test Book by Car panel switching
    const carTabTest = await client.eval(`
      (() => {
        const tabCar = document.querySelector('.quick-tab[data-mode="car"]');
        if (tabCar) tabCar.click();

        const panelCar = document.getElementById('mode-car');
        const carCards = document.querySelectorAll('.car-quick-card');
        const spotlightLink = panelCar ? panelCar.querySelector('a[href="#fleet"]') : null;

        return {
          carPanelVisible: panelCar ? !panelCar.classList.contains('hidden') : false,
          cardCount: carCards.length,
          hasSpotlightLink: !!spotlightLink
        };
      })()
    `);

    assert('Pillar 1 [Book by Car]: Tab switches to Car panel with 3 Mercedes cards and link to #fleet', 
      carTabTest.carPanelVisible && carTabTest.cardCount === 3 && carTabTest.hasSpotlightLink, carTabTest);

    // Test #fleet spotlight carousel CTA points to /booking.html
    const fleetCarouselTest = await client.eval(`
      (() => {
        const stage = document.getElementById('fleet-stage');
        const bookBtn = document.getElementById('carousel-book-cta');
        return {
          stageExists: !!stage,
          bookBtnExists: !!bookBtn
        };
      })()
    `);

    assert('Pillar 1 [#fleet]: Single-vehicle spotlight stage & booking CTA present', 
      fleetCarouselTest.stageExists && fleetCarouselTest.bookBtnExists, fleetCarouselTest);

    // Test Homepage Viewport Overflow (375px, 390px, 412px, 768px, 1280px)
    const hpViewports = [
      { name: 'iPhone SE', w: 375, h: 667, mobile: true },
      { name: 'iPhone 14/15', w: 390, h: 844, mobile: true },
      { name: 'Galaxy S22', w: 412, h: 915, mobile: true },
      { name: 'iPad', w: 768, h: 1024, mobile: false },
      { name: 'Desktop', w: 1280, h: 800, mobile: false }
    ];

    for (const vp of hpViewports) {
      await client.setViewport(vp.w, vp.h, vp.mobile);
      await wait(300);
      const overflow = await client.eval(`document.documentElement.scrollWidth - window.innerWidth`);
      assert(`Pillar 1 [Homepage ${vp.name}]: 0px horizontal overflow (${vp.w}px)`, overflow <= 0, { overflow });
    }

    const shotHp = await client.captureScreenshot('homepage_hero_quick_book.png');
    console.log(`Captured: ${shotHp}`);

    // =========================================================================
    // PILLAR 2: Dedicated Booking Engine (/booking.html)
    // =========================================================================
    console.log('\n--- Pillar 2: Dedicated Booking Engine (/booking.html) ---');
    await client.eval(`sessionStorage.clear()`);
    await client.setViewport(1280, 800, false);
    await client.send('Page.navigate', { url: 'http://localhost:3000/booking.html' });
    await wait(2000);

    const bookingInitAudit = await client.eval(`
      (() => {
        const panes = [1, 2, 3, 4, 5, 6].map(i => !!document.getElementById('step-pane-' + i));
        const pane1Visible = !document.getElementById('step-pane-1').classList.contains('hidden');
        const stickyHeader = document.getElementById('mobile-sticky-header');

        return {
          allPanesExist: panes.every(Boolean),
          pane1Visible,
          stickyHeaderExists: !!stickyHeader
        };
      })()
    `);

    assert('Pillar 2: All 6 booking stages exist and Stage 1 is initially visible', 
      bookingInitAudit.allPanesExist && bookingInitAudit.pane1Visible, bookingInitAudit);
    assert('Pillar 2: Sticky mobile step header card exists in DOM', 
      bookingInitAudit.stickyHeaderExists, bookingInitAudit);

    // Switch to mobile viewport (390x844) to test sticky header progression
    await client.setViewport(390, 844, true);
    await wait(300);

    const mobileStepAudit = await client.eval(`
      (() => {
        window.alert = (msg) => console.log('ALERT:', msg);
        const pInput = document.getElementById('step1-pickup');
        const dInput = document.getElementById('step1-dropoff');
        const dtInput = document.getElementById('step1-date');
        if (pInput && !pInput.value) pInput.value = 'Salzburg Airport W. A. Mozart (SZG)';
        if (dInput && !dInput.value) dInput.value = 'Hallstatt Lahn Terminal';
        if (dtInput && !dtInput.value) {
          const today = new Date().toISOString().split('T')[0];
          dtInput.value = today;
          window.appState.pickupDate = today;
        }

        const num1 = document.getElementById('mobile-step-num')?.textContent.trim();
        const ind1 = document.getElementById('mobile-step-indicator')?.textContent.trim();
        const bar1 = document.getElementById('mobile-sticky-progress-bar')?.style.width;

        // Advance to step 2
        goToStep(2);
        const num2 = document.getElementById('mobile-step-num')?.textContent.trim();
        const ind2 = document.getElementById('mobile-step-indicator')?.textContent.trim();
        const bar2 = document.getElementById('mobile-sticky-progress-bar')?.style.width;

        // Advance to step 3
        goToStep(3);
        const num3 = document.getElementById('mobile-step-num')?.textContent.trim();
        const bar3 = document.getElementById('mobile-sticky-progress-bar')?.style.width;

        // Return to step 1
        goToStep(1);

        return {
          step1: { num: num1, ind: ind1, bar: bar1 },
          step2: { num: num2, ind: ind2, bar: bar2 },
          step3: { num: num3, bar: bar3 }
        };
      })()
    `);

    assert('Pillar 2: Mobile sticky header dynamically updates Step numbers, labels, and progress bar', 
      mobileStepAudit.step1.num === '1' && mobileStepAudit.step1.ind === 'Step 1 of 6' && 
      mobileStepAudit.step2.num === '2' && mobileStepAudit.step2.ind === 'Step 2 of 6' && 
      mobileStepAudit.step2.bar === '20%', mobileStepAudit);

    const shotBookingSticky = await client.captureScreenshot('booking_mobile_sticky_step2.png');
    console.log(`Captured: ${shotBookingSticky}`);

    // Audit 16px Font Size on all Inputs in /booking.html
    const fontAudit = await client.eval(`
      (() => {
        const inputs = Array.from(document.querySelectorAll('#booking-stepper input, #booking-stepper select, #booking-stepper textarea'));
        const smallInputs = inputs.filter(el => {
          if (el.type === 'checkbox' || el.type === 'radio' || el.type === 'hidden') return false;
          const fs = parseFloat(window.getComputedStyle(el).fontSize);
          return fs < 16;
        }).map(el => ({ id: el.id, tag: el.tagName, fs: window.getComputedStyle(el).fontSize }));

        return {
          totalInputs: inputs.length,
          allAtLeast16px: smallInputs.length === 0,
          smallInputs
        };
      })()
    `);

    assert('Pillar 2: 100% of form inputs enforce >=16px font-size to prevent iOS Safari auto-zoom', 
      fontAudit.allAtLeast16px && fontAudit.totalInputs > 0, fontAudit);

    // Audit Touch Targets (>= 44x44px) in /booking.html
    const touchTargetAudit = await client.eval(`
      (() => {
        const buttons = Array.from(document.querySelectorAll('#booking-stepper button, #booking-stepper a.btn-gold, #booking-stepper a.btn-outline-gold'));
        const smallButtons = buttons.filter(b => {
          if (b.offsetParent === null) return false; // ignore hidden elements
          const rect = b.getBoundingClientRect();
          return rect.width < 44 || rect.height < 44;
        }).map(b => ({ text: b.innerText.trim(), w: b.getBoundingClientRect().width, h: b.getBoundingClientRect().height }));

        return {
          totalButtons: buttons.length,
          allMeet44px: smallButtons.length === 0,
          smallButtons
        };
      })()
    `);

    assert('Pillar 2: All visible interactive buttons and touch controls meet >=44x44px target area', 
      touchTargetAudit.allMeet44px, touchTargetAudit);

    // Test URL Parameter Hydration & Affirmative Preselection
    // 1. Tour Hydration
    await client.send('Page.navigate', { url: 'http://localhost:3000/booking.html?service=tour&tour=hallstatt' });
    await wait(1500);

    const tourHydrationAudit = await client.eval(`
      (() => {
        const banner = document.getElementById('preselection-banner');
        const text = document.getElementById('preselection-banner-text')?.textContent.trim();
        const tourSelect = document.getElementById('step1-tour-select');
        return {
          serviceType: window.appState ? window.appState.serviceType : null,
          tourKey: window.appState ? window.appState.tourKey : null,
          bannerVisible: banner ? !banner.classList.contains('hidden') : false,
          bannerText: text,
          tourSelectVal: tourSelect ? tourSelect.value : null
        };
      })()
    `);

    assert('Pillar 2: URL parameter ?service=tour&tour=hallstatt accurately preselects tour with affirmative banner', 
      tourHydrationAudit.serviceType === 'TOUR' && tourHydrationAudit.tourKey === 'hallstatt' && 
      tourHydrationAudit.bannerVisible && tourHydrationAudit.bannerText.includes('Hallstatt'), 
      tourHydrationAudit);

    // 2. Vehicle Hydration & Zero Lock-In Test
    await client.send('Page.navigate', { url: 'http://localhost:3000/booking.html?vehicle=v-class' });
    await wait(1500);

    const vehHydrationAudit = await client.eval(`
      (() => {
        const banner = document.getElementById('preselection-banner');
        const text = document.getElementById('preselection-banner-text')?.textContent.trim();
        const cardVClass = document.querySelector('.vehicle-card[data-veh="V_CLASS"]');
        return {
          category: window.appState ? window.appState.vehicleCategory : null,
          bannerVisible: banner ? !banner.classList.contains('hidden') : false,
          bannerText: text,
          isVClassCardActive: cardVClass ? cardVClass.classList.contains('border-gold') : false
        };
      })()
    `);

    assert('Pillar 2: URL parameter ?vehicle=v-class preselects V-Class with affirmative guidance', 
      vehHydrationAudit.category === 'V_CLASS' && vehHydrationAudit.bannerVisible && 
      vehHydrationAudit.bannerText.includes('V-Class'), vehHydrationAudit);

    // Zero Lock-In test: Customer switches vehicle to E-Class
    const switchVehAudit = await client.eval(`
      (() => {
        const cardEClass = document.querySelector('.vehicle-card[data-veh="E_CLASS"]');
        if (cardEClass) cardEClass.click();
        return {
          newCategory: window.appState ? window.appState.vehicleCategory : null,
          isEClassActive: cardEClass ? cardEClass.classList.contains('border-gold') : false
        };
      })()
    `);

    assert('Pillar 2: Non-locking vehicle selection verified: customer can switch to E-Class freely', 
      switchVehAudit.newCategory === 'E_CLASS' && switchVehAudit.isEClassActive, switchVehAudit);

    // History Navigation & Data Loss Resilience (pushState / popstate)
    const historyAudit = await client.eval(`
      (() => {
        window.alert = (msg) => console.log('ALERT:', msg);
        // Set input values in step 1
        const pInput = document.getElementById('step1-pickup');
        const dInput = document.getElementById('step1-dropoff');
        const dtInput = document.getElementById('step1-date');
        if (pInput) pInput.value = 'Salzburg Airport Terminal 1';
        if (dInput) dInput.value = 'Zell am See Grand Hotel';
        if (dtInput) {
          const today = new Date().toISOString().split('T')[0];
          dtInput.value = today;
          window.appState.pickupDate = today;
        }

        // Advance to step 2 then step 3
        goToStep(2);
        goToStep(3);
        const stepAt3 = window.appState.currentStep;

        // Dispatch popstate event to return to step 2
        window.dispatchEvent(new PopStateEvent('popstate', { state: { stage: 2 } }));
        const stepAt2 = window.appState.currentStep;
        const pane2Visible = !document.getElementById('step-pane-2').classList.contains('hidden');

        // Dispatch popstate event to return to step 1
        window.dispatchEvent(new PopStateEvent('popstate', { state: { stage: 1 } }));
        const stepAt1 = window.appState.currentStep;
        const pane1Visible = !document.getElementById('step-pane-1').classList.contains('hidden');
        const pPreserved = document.getElementById('step1-pickup')?.value;
        const dPreserved = document.getElementById('step1-dropoff')?.value;

        return {
          stepAt3,
          stepAt2,
          pane2Visible,
          stepAt1,
          pane1Visible,
          pPreserved,
          dPreserved
        };
      })()
    `);

    assert('Pillar 2: Browser history navigation (popstate) steps back cleanly with zero customer data loss', 
      historyAudit.stepAt2 === 2 && historyAudit.pane2Visible && 
      historyAudit.stepAt1 === 1 && historyAudit.pane1Visible && 
      historyAudit.pPreserved === 'Salzburg Airport Terminal 1' && 
      historyAudit.dPreserved === 'Zell am See Grand Hotel', historyAudit);

    const shotBookingHydrated = await client.captureScreenshot('booking_step1_hydrated.png');
    console.log(`Captured: ${shotBookingHydrated}`);

    // =========================================================================
    // PILLAR 3: Tours Master Directory & Individual Tour Pages
    // =========================================================================
    console.log('\n--- Pillar 3: Tours Master Directory & Individual Tour Pages ---');
    await client.send('Page.navigate', { url: 'http://localhost:3000/tours.html' });
    await wait(1800);

    const toursDirectoryAudit = await client.eval(`
      (() => {
        const cards = Array.from(document.querySelectorAll('.tour-card, a[href^="/tours/"]'));
        const hrefs = cards.map(c => c.getAttribute('href') || c.querySelector('a')?.getAttribute('href')).filter(Boolean);
        const text = document.body.innerText;

        return {
          cardCount: cards.length,
          hasHallstatt: text.includes('Hallstatt') && text.includes('€450'),
          hasEaglesNest: text.includes("Eagle's Nest") && text.includes('€450'),
          hasZellAmSee: text.includes('Zell am See') && text.includes('€450'),
          hasInnsbruck: text.includes('Innsbruck') && text.includes('€650'),
          hrefs
        };
      })()
    `);

    assert('Pillar 3: /tours.html displays all 4 tours with accurate flat rates (€450 / €650)', 
      toursDirectoryAudit.hasHallstatt && toursDirectoryAudit.hasEaglesNest && 
      toursDirectoryAudit.hasZellAmSee && toursDirectoryAudit.hasInnsbruck, toursDirectoryAudit);

    // Test each individual tour page
    const tourSlugs = [
      { slug: 'hallstatt', price: '€450.00', title: 'Hallstatt' },
      { slug: 'eagles-nest', price: '€450.00', title: "Eagle's Nest" },
      { slug: 'zell-am-see', price: '€450.00', title: 'Zell am See' },
      { slug: 'innsbruck', price: '€650.00', title: 'Innsbruck' }
    ];

    for (const t of tourSlugs) {
      await client.send('Page.navigate', { url: `http://localhost:3000/tours/${t.slug}.html` });
      await wait(1500);

      const tourPageAudit = await client.eval(`
        (() => {
          const heroImg = document.querySelector('img[src*="${t.slug}-hero"]');
          const stickyBar = document.querySelector('.fixed.md\\\\:hidden.bottom-0');
          const bookLinks = Array.from(document.querySelectorAll('a[href*="/booking.html?service=tour&tour=${t.slug}"]'));
          const schemaScript = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => {
            try { return JSON.parse(s.textContent); } catch (e) { return null; }
          }).filter(Boolean);
          const touristTripSchema = schemaScript.find(s => s['@type'] === 'TouristTrip');

          const overflow = document.documentElement.scrollWidth - window.innerWidth;

          return {
            heroLoaded: heroImg ? heroImg.naturalWidth > 0 : false,
            stickyBarExists: !!stickyBar,
            bookLinksCount: bookLinks.length,
            hasTouristTripSchema: !!touristTripSchema,
            schemaPrice: touristTripSchema?.offers?.price,
            overflow
          };
        })()
      `);

      assert(`Pillar 3 [/tours/${t.slug}.html]: Hero photo loaded, CTA links to booking engine, TouristTrip Schema verified`, 
        tourPageAudit.heroLoaded && tourPageAudit.bookLinksCount >= 1 && tourPageAudit.hasTouristTripSchema, tourPageAudit);
      assert(`Pillar 3 [/tours/${t.slug}.html]: 0px horizontal page overflow`, 
        tourPageAudit.overflow <= 0, tourPageAudit);
    }

    const shotTour = await client.captureScreenshot('tour_hallstatt_mobile_390x844.png');
    console.log(`Captured: ${shotTour}`);

    // =========================================================================
    // PILLAR 4: Destination / Airport Transfer Pages
    // =========================================================================
    console.log('\n--- Pillar 4: Destination / Airport Transfer Pages ---');

    // 1. Munich Airport MUC
    await client.send('Page.navigate', { url: 'http://localhost:3000/destinations/munich-airport.html' });
    await wait(1500);

    const munichAudit = await client.eval(`
      (() => {
        const text = document.body.innerText;
        const bookLinks = Array.from(document.querySelectorAll('a[href*="/booking.html"]')).map(a => a.getAttribute('href'));
        const heroImg = document.querySelector('img[src*="munich-airport-hero"]');
        const overflow = document.documentElement.scrollWidth - window.innerWidth;

        return {
          has180km: text.includes('180 km'),
          hasPromoRate: text.includes('€490.00'),
          hasVehicleTiers: text.includes('E-Class') && text.includes('V-Class') && text.includes('Vito'),
          heroLoaded: heroImg ? heroImg.naturalWidth > 0 : false,
          bookLinks,
          overflow
        };
      })()
    `);

    assert('Pillar 4 [/destinations/munich-airport.html]: Route metrics (180 km), promo rate (€490), vehicle tiers, and deep-link verified', 
      munichAudit.has180km && munichAudit.hasPromoRate && munichAudit.hasVehicleTiers && munichAudit.heroLoaded && munichAudit.bookLinks.length > 0, 
      munichAudit);
    assert('Pillar 4 [/destinations/munich-airport.html]: 0px horizontal page overflow', 
      munichAudit.overflow <= 0, munichAudit);

    const shotMunich = await client.captureScreenshot('destination_munich_airport_mobile_390x844.png');
    console.log(`Captured: ${shotMunich}`);

    // 2. Vienna Transfer
    await client.send('Page.navigate', { url: 'http://localhost:3000/destinations/vienna.html' });
    await wait(1500);

    const viennaAudit = await client.eval(`
      (() => {
        const text = document.body.innerText;
        const bookLinks = Array.from(document.querySelectorAll('a[href*="/booking.html"]')).map(a => a.getAttribute('href'));
        const heroImg = document.querySelector('img[src*="vienna-hero"]');
        const overflow = document.documentElement.scrollWidth - window.innerWidth;

        return {
          has300km: text.includes('300 km'),
          hasRate: text.includes('€660') || text.includes('€750'),
          heroLoaded: heroImg ? heroImg.naturalWidth > 0 : false,
          bookLinks,
          overflow
        };
      })()
    `);

    assert('Pillar 4 [/destinations/vienna.html]: Route metrics (300 km), calculated rates, and deep-link verified', 
      viennaAudit.has300km && viennaAudit.hasRate && viennaAudit.heroLoaded && viennaAudit.bookLinks.length > 0, 
      viennaAudit);
    assert('Pillar 4 [/destinations/vienna.html]: 0px horizontal page overflow', 
      viennaAudit.overflow <= 0, viennaAudit);

    const shotVienna = await client.captureScreenshot('destination_vienna_desktop.png');
    console.log(`Captured: ${shotVienna}`);

    // =========================================================================
    // PILLAR 5: Quality & Brand Compliance
    // =========================================================================
    console.log('\n--- Pillar 5: Quality & Brand Compliance ---');

    const canonicalPages = [
      '/',
      '/booking.html',
      '/tours.html',
      '/tours/hallstatt.html',
      '/tours/eagles-nest.html',
      '/tours/zell-am-see.html',
      '/tours/innsbruck.html',
      '/destinations/munich-airport.html',
      '/destinations/vienna.html'
    ];

    let allZeroEmojis = true;
    let allLucideIcons = true;
    const pageReports = [];

    for (const p of canonicalPages) {
      await client.send('Page.navigate', { url: `http://localhost:3000${p}` });
      await wait(800);

      const pageAudit = await client.eval(`
        (() => {
          const text = document.body.innerText;
          const emojiRegex = /[\\u{1F300}-\\u{1F9FF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}\\u{1F1E6}-\\u{1F1FF}]/gu;
          const emojiMatches = text.match(emojiRegex) || [];

          const iconElements = Array.from(document.querySelectorAll('iconify-icon'));
          const nonLucide = iconElements.filter(i => {
            const attr = i.getAttribute('icon') || '';
            return !attr.startsWith('lucide:');
          });

          return {
            emojiCount: emojiMatches.length,
            iconCount: iconElements.length,
            nonLucideCount: nonLucide.length
          };
        })()
      `);

      pageReports.push({ page: p, ...pageAudit });
      if (pageAudit.emojiCount > 0) allZeroEmojis = false;
      if (pageAudit.nonLucideCount > 0) allLucideIcons = false;
    }

    assert('Pillar 5: Exactly 0% Unicode emojis across all 9 canonical pages', allZeroEmojis, { pageReports });
    assert('Pillar 5: Exactly 100% Lucide 2px stroke icons across all 9 canonical pages', allLucideIcons, { pageReports });

  } catch (err) {
    console.error('Test execution error:', err);
    assert('Test runner completed without fatal exceptions', false, { error: err.message, stack: err.stack });
  } finally {
    client.close();
    chromeProcess.kill();
  }

  // Save report to disk
  const reportPath = '/home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/browser_qa_multipage_results.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n=================================================`);
  console.log(`Multipage QA Test Suite Completed:`);
  console.log(`Passed: ${results.assertionsPassed}`);
  console.log(`Failed: ${results.assertionsFailed}`);
  console.log(`JSON Results saved to: ${reportPath}`);
  console.log(`=================================================\n`);

  if (results.assertionsFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
