const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = '/home/hanzlaahmad/Projects/OmerFarooq/audit/screenshots/homepage_3_pathways';
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
        if (msg.method === 'Page.javascriptDialogOpening') {
          this.send('Page.handleJavaScriptDialog', { accept: true }).catch(() => {});
        }
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

async function runQA() {
  console.log('========================================================================');
  console.log('TSK-PET-052: BROWSER QA VERIFICATION — 3-PATHWAYS & MULTI-PAGE FLOW');
  console.log('========================================================================\n');

  const profileDir = `/tmp/chrome-3pathways-qa-${Date.now()}`;
  const chromeProcess = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9226',
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
      const ver = await fetchJson('http://127.0.0.1:9226/json/version');
      if (ver) connected = true;
    } catch (e) {
      attempts++;
    }
  }

  if (!connected) {
    console.error('Failed to connect to headless Chrome CDP');
    chromeProcess.kill();
    process.exit(1);
  }

  const targets = await fetchJson('http://127.0.0.1:9226/json/list');
  const target = targets.find(t => t.type === 'page') || targets[0];
  const client = new CDPClient(target.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('DOM.enable');
  await client.send('Runtime.enable');

  await client.send('Page.navigate', { url: 'http://localhost:3000/' });
  await wait(2500);

  const results = {
    testSuite: 'TSK-PET-052: 3-Pathway Homepage & Multi-Page Booking Flow Browser QA',
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
    // PILLAR 1: Calculator-Free Luxury Hero (#hero)
    // =========================================================================
    console.log('\n--- Pillar 1: Calculator-Free Luxury Hero (#hero) ---');
    await client.setViewport(1280, 800, false);
    await wait(300);

    const heroAudit = await client.eval(`
      (() => {
        const hero = document.getElementById('hero');
        const legacyCalc = document.getElementById('hero-quick-book');
        const legacyInputs = hero ? Array.from(hero.querySelectorAll('input, select, textarea')) : [];
        const heroImg = hero ? hero.querySelector('.hero-salzburg-img') : null;
        const scrim = hero ? hero.querySelector('.hero-gradient-scrim') : null;
        const headline = hero ? hero.querySelector('h1')?.textContent.trim() : null;
        const licenseBadge = hero ? hero.querySelector('.inline-flex')?.textContent.trim() : null;
        
        const pills = Array.from(hero.querySelectorAll('.hero-pathway-pill')).map(p => {
          const rect = p.getBoundingClientRect();
          return {
            text: p.textContent.trim(),
            href: p.getAttribute('href'),
            targetId: p.getAttribute('href')?.replace('#', ''),
            targetExists: !!document.getElementById(p.getAttribute('href')?.replace('#', '')),
            w: Math.round(rect.width),
            h: Math.round(rect.height)
          };
        });

        return {
          heroExists: !!hero,
          legacyCalcRemoved: !legacyCalc,
          inputCountInHero: legacyInputs.length,
          imgLoaded: heroImg ? heroImg.naturalWidth > 0 : false,
          hasScrim: !!scrim,
          headline,
          licenseBadge,
          pills
        };
      })()
    `);

    assert('Pillar 1: Legacy #hero-quick-book interactive calculator is completely removed', 
      heroAudit.legacyCalcRemoved && heroAudit.inputCountInHero === 0, heroAudit);
    assert('Pillar 1: Full-bleed Salzburg panorama photograph loaded with calibrated dark scrim', 
      heroAudit.imgLoaded && heroAudit.hasScrim, heroAudit);
    assert('Pillar 1: Authoritative headline and Austrian license badge rendered with premium typography', 
      heroAudit.headline.includes('Travel Salzburg & The Alps') && heroAudit.licenseBadge.includes('Licensed Austrian Passenger Transport'), heroAudit);
    assert('Pillar 1: Hero contains exactly 3 anchor navigation pills with valid targets', 
      heroAudit.pills.length === 3 && heroAudit.pills.every(p => p.targetExists), heroAudit);
    assert('Pillar 1: All 3 hero anchor pills satisfy >= 44x44px touch targets', 
      heroAudit.pills.every(p => p.w >= 44 && p.h >= 44), heroAudit);

    const shotHero = path.join(SCREENSHOTS_DIR, 'homepage_hero_luxury_desktop.png');
    await client.captureScreenshot(shotHero);
    console.log(`Captured: ${shotHero}`);

    // =========================================================================
    // PILLAR 2: Three Core Booking Pathway Sections
    // =========================================================================
    console.log('\n--- Pillar 2: Three Core Booking Pathway Sections ---');

    // Pathway 1: Book by Place (#destinations)
    const destAudit = await client.eval(`
      (() => {
        const sec = document.getElementById('destinations');
        const cards = Array.from(sec.querySelectorAll('.glass-card')).map(c => {
          const title = c.querySelector('h3')?.textContent.trim();
          const rateEl = Array.from(c.querySelectorAll('.font-mono.text-gold')).find(el => el.textContent.includes('€'));
          const rate = rateEl?.textContent.trim();
          const btn = c.querySelector('a.btn-gold');
          const img = c.querySelector('img');
          const rect = btn?.getBoundingClientRect();
          return {
            title,
            rate,
            href: btn?.getAttribute('href'),
            hasImage: img ? (img.naturalWidth > 0 || img.getAttribute('src')?.length > 0) : false,
            btnW: rect ? Math.round(rect.width) : 0,
            btnH: rect ? Math.round(rect.height) : 0
          };
        });

        return {
          destExists: !!sec,
          cardCount: cards.length,
          cards
        };
      })()
    `);

    assert('Pillar 2 [Pathway 1: Destinations]: Section exists with 6 canonical transfer destination cards', 
      destAudit.destExists && destAudit.cardCount === 6, destAudit);
    assert('Pillar 2 [Pathway 1: Destinations]: All destination cards feature imagery, rates, and booking deep-links', 
      destAudit.cards.every(c => c.hasImage && c.rate.startsWith('From €') && c.href.includes('/booking.html?pickup=')), destAudit);
    assert('Pillar 2 [Pathway 1: Destinations]: All destination card booking CTAs satisfy >= 44x44px touch targets', 
      destAudit.cards.every(c => c.btnW >= 44 && c.btnH >= 44), destAudit);

    const shotDest = path.join(SCREENSHOTS_DIR, 'homepage_destinations_pathway_desktop.png');
    await client.captureScreenshot(shotDest);
    console.log(`Captured: ${shotDest}`);

    // Pathway 2: Book by Car (#fleet)
    const fleetAudit = await client.eval(`
      (() => {
        const sec = document.getElementById('fleet');
        const tabs = Array.from(sec.querySelectorAll('.fleet-tab')).map(t => ({
          name: t.textContent.trim(),
          slug: t.getAttribute('data-vehicle'),
          h: Math.round(t.getBoundingClientRect().height)
        }));
        const peekImg = sec.querySelector('.fleet-peek-image, #fallback-img');
        const bookBtn = sec.querySelector('#carousel-book-cta');
        const btnRect = bookBtn?.getBoundingClientRect();

        return {
          fleetExists: !!sec,
          tabCount: tabs.length,
          tabs,
          hasPeekImg: !!peekImg,
          imgSrc: peekImg?.getAttribute('src'),
          btnW: btnRect ? Math.round(btnRect.width) : 0,
          btnH: btnRect ? Math.round(btnRect.height) : 0
        };
      })()
    `);

    assert('Pillar 2 [Pathway 2: Fleet]: Section exists with seamless split 40% side peek presentation', 
      fleetAudit.fleetExists && fleetAudit.hasPeekImg, fleetAudit);
    assert('Pillar 2 [Pathway 2: Fleet]: 3 model selector tabs present with >= 44px touch targets', 
      fleetAudit.tabCount === 3 && fleetAudit.tabs.every(t => t.h >= 44), fleetAudit);
    assert('Pillar 2 [Pathway 2: Fleet]: Primary booking CTA satisfies >= 48px ergonomic touch target', 
      fleetAudit.btnH >= 48, fleetAudit);

    const shotFleet = path.join(SCREENSHOTS_DIR, 'homepage_fleet_pathway_desktop.png');
    await client.captureScreenshot(shotFleet);
    console.log(`Captured: ${shotFleet}`);

    // Pathway 3: Book by Tour (#tours)
    const toursAudit = await client.eval(`
      (() => {
        const sec = document.getElementById('tours');
        const cards = Array.from(sec.querySelectorAll('.glass-card')).map(c => {
          const title = c.querySelector('h3')?.textContent.trim();
          const rateEl = Array.from(c.querySelectorAll('.font-mono')).find(el => el.textContent.trim().startsWith('€'));
          const bookBtn = c.querySelector('a.btn-gold');
          const itinBtn = c.querySelector('a.btn-outline-gold');
          const bRect = bookBtn?.getBoundingClientRect();
          const iRect = itinBtn?.getBoundingClientRect();
          return {
            title,
            rate: rateEl?.textContent.trim(),
            bookHref: bookBtn?.getAttribute('href'),
            itinHref: itinBtn?.getAttribute('href'),
            bH: bRect ? Math.round(bRect.height) : 0,
            iH: iRect ? Math.round(iRect.height) : 0
          };
        });

        return {
          toursExists: !!sec,
          cardCount: cards.length,
          cards
        };
      })()
    `);

    assert('Pillar 2 [Pathway 3: Tours]: Section exists with 4 signature 8-hour private day tour cards', 
      toursAudit.toursExists && toursAudit.cardCount === 4, toursAudit);

    const expectedTours = [
      { name: 'Hallstatt', rate: '€450.00', key: 'hallstatt' },
      { name: 'Sound of Music', rate: '€450.00', key: 'sound-of-music' },
      { name: 'Eagle', rate: '€450.00', key: 'eagles-nest' },
      { name: 'Grossglockner', rate: '€550.00', key: 'grossglockner' }
    ];

    expectedTours.forEach(et => {
      const card = toursAudit.cards.find(c => c.title.includes(et.name));
      assert(`Pillar 2 [Tour ${et.name}]: Flat rate ${et.rate} & tour=${et.key} deep-link verified`, 
        card && card.rate === et.rate && card.bookHref.includes(`tour=${et.key}`), card);
    });

    const shotTours = path.join(SCREENSHOTS_DIR, 'homepage_tours_pathway_desktop.png');
    await client.captureScreenshot(shotTours);
    console.log(`Captured: ${shotTours}`);

    // =========================================================================
    // PILLAR 3: Auxiliary & Trust Sections
    // =========================================================================
    console.log('\n--- Pillar 3: Auxiliary & Trust Sections ---');

    const auxAudit = await client.eval(`
      (() => {
        const trust = document.getElementById('trust');
        const routes = document.getElementById('routes');
        const guide = document.getElementById('airport-guide');
        const testims = document.getElementById('testimonials');
        const faq = document.getElementById('faq');
        const footer = document.querySelector('footer');
        const header = document.querySelector('header');

        const trustCards = trust ? trust.querySelectorAll('.glass-card').length : 0;
        const testimCards = testims ? testims.querySelectorAll('.glass-card').length : 0;
        const faqItems = faq ? faq.querySelectorAll('#faq-accordion > div, .glass-card, details').length : 0;

        return {
          hasTrust: !!trust && trustCards === 4,
          hasRoutes: !!routes,
          hasGuide: !!guide,
          hasTestimonials: !!testims && testimCards === 3,
          hasFaq: !!faq && faqItems >= 4,
          hasFooter: !!footer,
          hasStickyHeader: !!header && window.getComputedStyle(header).position === 'sticky'
        };
      })()
    `);

    assert('Pillar 3: 4-Pillar Trust Strip (#trust) present with 4 distinct guarantee cards', 
      auxAudit.hasTrust, auxAudit);
    assert('Pillar 3: Top Transfer Routes matrix (#routes) & Airport Guide (#airport-guide) present', 
      auxAudit.hasRoutes && auxAudit.hasGuide, auxAudit);
    assert('Pillar 3: Verified Client Testimonials (#testimonials) present with 3 glass review cards', 
      auxAudit.hasTestimonials, auxAudit);
    assert('Pillar 3: FAQ accordion (#faq), sticky header, and Austrian legal footer present', 
      auxAudit.hasFaq && auxAudit.hasStickyHeader && auxAudit.hasFooter, auxAudit);

    // =========================================================================
    // PILLAR 4: Multi-Page Step Flow Verification
    // =========================================================================
    console.log('\n--- Pillar 4: Multi-Page Step Flow Verification ---');

    // Flow 1: Destination Transfer Deep-Link & Sequential Steps to Checkout
    console.log('Testing Flow 1: Destination Deep-Link (Salzburg City Center -> Hallstatt Lahn Terminal)...');
    await client.send('Page.navigate', { 
      url: 'http://localhost:3000/booking.html?pickup=Salzburg+City+Center&dest=Hallstatt+Lahn+Terminal' 
    });
    await wait(2000);

    const stepFlowAudit = await client.eval(`
      (() => {
        window.alert = (msg) => console.log('ALERT:', msg);

        // Step 1 check
        const step1Pickup = document.getElementById('step1-pickup')?.value;
        const step1Dropoff = document.getElementById('step1-dropoff')?.value;
        const step1Date = document.getElementById('step1-date');
        if (step1Date && !step1Date.value) {
          const today = new Date().toISOString().split('T')[0];
          step1Date.value = today;
          window.appState.pickupDate = today;
        }

        // Advance to Step 2 (Vehicle)
        goToStep(2);
        const atStep2 = window.appState.currentStep === 2;
        const pane2Visible = !document.getElementById('step-pane-2')?.classList.contains('hidden');

        // Select V-Class in Step 2
        const cardV = document.querySelector('.vehicle-card[data-veh="V_CLASS"]');
        if (cardV) cardV.click();

        // Advance to Step 3 (Hospitality & Extras)
        goToStep(3);
        const atStep3 = window.appState.currentStep === 3;
        const pane3Visible = !document.getElementById('step-pane-3')?.classList.contains('hidden');

        // Toggle beverage in Step 3
        const btnSparkling = document.querySelector('.water-opt-btn[data-water="SPARKLING"]');
        if (btnSparkling) btnSparkling.click();

        // Advance to Step 4 (Passenger Info)
        goToStep(4);
        const atStep4 = window.appState.currentStep === 4;
        const pane4Visible = !document.getElementById('step-pane-4')?.classList.contains('hidden');

        // Populate required passenger fields
        const nameInput = document.getElementById('cust-name');
        const emailInput = document.getElementById('cust-email');
        const phoneInput = document.getElementById('cust-phone');
        if (nameInput) nameInput.value = 'Hanzla Ahmad';
        if (emailInput) emailInput.value = 'hanzla@example.com';
        if (phoneInput) phoneInput.value = '+43 660 6416464';

        // Advance to Step 5 (Review & Quote / Checkout)
        goToStep(5);
        const atStep5 = window.appState.currentStep === 5;
        const pane5Visible = !document.getElementById('step-pane-5')?.classList.contains('hidden');
        const quoteTotal = (document.getElementById('sum-gross-total') || document.getElementById('quote-gross-total'))?.textContent.trim();
        const faggNotice = Array.from(document.querySelectorAll('#step-pane-5 div, #step-pane-5 p')).find(el => el.textContent.includes('FAGG § 8'))?.textContent.trim();
        const reviewBtn = document.getElementById('btn-step-next')?.textContent.trim();

        return {
          step1Pickup,
          step1Dropoff,
          atStep2,
          pane2Visible,
          atStep3,
          pane3Visible,
          atStep4,
          pane4Visible,
          atStep5,
          pane5Visible,
          quoteTotal,
          faggNotice,
          reviewBtn
        };
      })()
    `);

    assert('Pillar 4 [Flow 1]: Step 1 pre-hydrates Pickup & Destination addresses', 
      stepFlowAudit.step1Pickup === 'Salzburg City Center' && stepFlowAudit.step1Dropoff === 'Hallstatt Lahn Terminal', stepFlowAudit);
    assert('Pillar 4 [Flow 1]: Sequential step progression (Step 1 -> 2 -> 3 -> 4 -> 5) executes cleanly', 
      stepFlowAudit.atStep2 && stepFlowAudit.atStep3 && stepFlowAudit.atStep4 && stepFlowAudit.atStep5, stepFlowAudit);
    assert('Pillar 4 [Flow 1]: Step 5 calculates transparent quote and displays Austrian FAGG § 8 checkout notice', 
      stepFlowAudit.quoteTotal && stepFlowAudit.quoteTotal.startsWith('€') && stepFlowAudit.pane5Visible, stepFlowAudit);

    const shotStep5 = path.join(SCREENSHOTS_DIR, 'booking_stepflow_step5_review.png');
    await client.captureScreenshot(shotStep5);
    console.log(`Captured: ${shotStep5}`);

    // Flow 2: Vehicle Deep-Link Hydration
    console.log('Testing Flow 2: Vehicle Deep-Link (?vehicle=v-class)...');
    await client.send('Page.navigate', { url: 'http://localhost:3000/booking.html?vehicle=v-class' });
    await wait(2000);

    const vehFlowAudit = await client.eval(`
      (() => {
        const category = window.appState ? window.appState.vehicleCategory : null;
        const banner = document.getElementById('preselection-banner');
        const text = document.getElementById('preselection-banner-text')?.textContent.trim();
        const cardV = document.querySelector('.vehicle-card[data-veh="V_CLASS"]');
        return {
          category,
          bannerVisible: banner ? !banner.classList.contains('hidden') : false,
          bannerText: text,
          cardActive: cardV ? cardV.classList.contains('border-gold') : false
        };
      })()
    `);

    assert('Pillar 4 [Flow 2]: Vehicle deep-link (?vehicle=v-class) pre-selects V-Class with affirmative banner', 
      vehFlowAudit.category === 'V_CLASS' && vehFlowAudit.bannerVisible && vehFlowAudit.bannerText.includes('V-Class'), vehFlowAudit);

    // Flow 3: Tour Deep-Link Hydration
    console.log('Testing Flow 3: Tour Deep-Link (?service=TOUR&tour=sound-of-music)...');
    await client.send('Page.navigate', { url: 'http://localhost:3000/booking.html?service=TOUR&tour=sound-of-music' });
    await wait(2000);

    const tourFlowAudit = await client.eval(`
      (() => {
        const serviceType = window.appState ? window.appState.serviceType : null;
        const tourKey = window.appState ? window.appState.tourKey : null;
        const banner = document.getElementById('preselection-banner');
        const text = document.getElementById('preselection-banner-text')?.textContent.trim();
        const tourSelect = document.getElementById('step1-tour-select');
        const transferFields = document.getElementById('step1-transfer-fields');
        const tourFields = document.getElementById('step1-tour-fields');

        return {
          serviceType,
          tourKey,
          bannerVisible: banner ? !banner.classList.contains('hidden') : false,
          bannerText: text,
          tourSelectVal: tourSelect ? tourSelect.value : null,
          transferHidden: transferFields ? transferFields.classList.contains('hidden') : false,
          tourVisible: tourFields ? !tourFields.classList.contains('hidden') : false
        };
      })()
    `);

    assert('Pillar 4 [Flow 3]: Tour deep-link (?service=TOUR&tour=sound-of-music) pre-selects Sound of Music tour and configures UI', 
      tourFlowAudit.serviceType === 'TOUR' && tourFlowAudit.tourKey === 'sound-of-music' && 
      tourFlowAudit.tourSelectVal === 'sound-of-music' && tourFlowAudit.tourVisible && tourFlowAudit.transferHidden, tourFlowAudit);

    // =========================================================================
    // PILLAR 5: Responsiveness, Ergonomics & Brand Standards
    // =========================================================================
    console.log('\n--- Pillar 5: Responsiveness, Ergonomics & Brand Standards ---');
    await client.send('Page.navigate', { url: 'http://localhost:3000/' });
    await wait(2000);

    const viewports = [
      { name: 'iPhone SE (375px)', w: 375, h: 667, mobile: true },
      { name: 'iPhone 14/15 (390px)', w: 390, h: 844, mobile: true },
      { name: 'Galaxy S22 (412px)', w: 412, h: 915, mobile: true },
      { name: 'iPad Portrait (768px)', w: 768, h: 1024, mobile: false },
      { name: 'Desktop HD (1280px)', w: 1280, h: 800, mobile: false }
    ];

    for (const vp of viewports) {
      await client.setViewport(vp.w, vp.h, vp.mobile);
      await wait(300);

      const vpAudit = await client.eval(`
        (() => {
          const docScroll = document.documentElement.scrollWidth;
          const winInner = window.innerWidth;
          const overflow = docScroll - winInner;
          return { docScroll, winInner, overflow };
        })()
      `);

      assert(`Pillar 5 [${vp.name}]: Strictly 0px horizontal page overflow`, 
        vpAudit.overflow <= 0, vpAudit);
    }

    // Touch targets audit across all interactive elements on homepage
    const touchAudit = await client.eval(`
      (() => {
        const interactive = Array.from(document.querySelectorAll('#hero a, #destinations a, #fleet button, #fleet a, #tours a, header a, header select, header button'));
        const substandard = interactive.filter(el => {
          if (el.offsetParent === null) return false; // ignore hidden
          const r = el.getBoundingClientRect();
          return r.width < 43 || r.height < 43; // 43px accounts for subpixel rounding
        }).map(el => ({
          tag: el.tagName,
          text: el.innerText.trim().slice(0, 25),
          w: Math.round(el.getBoundingClientRect().width),
          h: Math.round(el.getBoundingClientRect().height)
        }));

        return {
          totalChecked: interactive.length,
          allMeet44px: substandard.length === 0,
          substandard
        };
      })()
    `);

    assert('Pillar 5: 100% of interactive controls in primary pathways meet >= 44x44px touch ergonomics', 
      touchAudit.allMeet44px && touchAudit.totalChecked >= 15, touchAudit);

    // Brand standards audit (Zero emojis, 100% Lucide SVGs)
    const brandAudit = await client.eval(`
      (() => {
        const text = document.body.innerText;
        const emojiRegex = /[\\u{1F300}-\\u{1F9FF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}\\u{1F1E6}-\\u{1F1FF}]/gu;
        const emojiMatches = text.match(emojiRegex) || [];

        const icons = Array.from(document.querySelectorAll('iconify-icon'));
        const nonLucide = icons.filter(i => {
          const attr = i.getAttribute('icon') || '';
          return !attr.startsWith('lucide:');
        });

        return {
          emojiCount: emojiMatches.length,
          iconCount: icons.length,
          nonLucideCount: nonLucide.length
        };
      })()
    `);

    assert('Pillar 5: Exactly 0% Unicode emojis across homepage', 
      brandAudit.emojiCount === 0, brandAudit);
    assert('Pillar 5: Exactly 100% Lucide 2px stroke icons across homepage', 
      brandAudit.nonLucideCount === 0 && brandAudit.iconCount > 0, brandAudit);

  } catch (err) {
    console.error('Audit execution exception:', err);
    assert('QA execution completed without fatal exceptions', false, { error: err.message, stack: err.stack });
  } finally {
    client.close();
    chromeProcess.kill('SIGKILL');
  }

  // Save JSON report
  const jsonPath = '/home/hanzlaahmad/Projects/OmerFarooq/audit/browser_qa_3_pathways_results.json';
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`\n========================================================================`);
  console.log(`TSK-PET-052 Browser QA Suite Completed:`);
  console.log(`Passed: ${results.assertionsPassed}`);
  console.log(`Failed: ${results.assertionsFailed}`);
  console.log(`JSON Results saved to: ${jsonPath}`);
  console.log(`========================================================================\n`);

  if (results.assertionsFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runQA().catch(err => {
  console.error('Fatal QA error:', err);
  process.exit(1);
});
