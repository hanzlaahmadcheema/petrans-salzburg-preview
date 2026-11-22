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

async function runAudit() {
  console.log('================================================================');
  console.log('TSK-PET-051: HOMEPAGE 3-PATHWAY ARCHITECTURE & LUXURY HERO AUDIT');
  console.log('================================================================\n');

  const profileDir = `/tmp/chrome-pathways-audit-${Date.now()}`;
  const chromeProcess = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9225',
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
      const ver = await fetchJson('http://127.0.0.1:9225/json/version');
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

  const targets = await fetchJson('http://127.0.0.1:9225/json/list');
  const target = targets.find(t => t.type === 'page') || targets[0];
  const client = new CDPClient(target.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('DOM.enable');
  await client.send('CSS.enable');

  await client.send('Page.navigate', { url: 'http://localhost:3000/' });
  await wait(2500);

  let passedAssertions = 0;
  let totalAssertions = 0;

  function assertCheck(name, condition, extra = '') {
    totalAssertions++;
    if (condition) {
      console.log(`  ✓ ${name}${extra ? ' (' + extra + ')' : ''}`);
      passedAssertions++;
    } else {
      console.error(`  FAIL: ${name}${extra ? ' (' + extra + ')' : ''}`);
    }
  }

  try {
    console.log('--- 1. Hero Section & Calculator-Free Luxury Architecture ---');
    const heroQuickBookExists = await client.eval(`!!document.getElementById('hero-quick-book')`);
    assertCheck('Legacy #hero-quick-book is completely excised from DOM', !heroQuickBookExists);

    const heroSection = await client.eval(`(() => {
      const hero = document.getElementById('hero');
      if (!hero) return null;
      const img = hero.querySelector('.hero-salzburg-img');
      const scrim = hero.querySelector('.hero-gradient-scrim');
      const headline = hero.querySelector('h1')?.textContent.trim();
      const pills = Array.from(hero.querySelectorAll('.hero-pathway-pill')).map(p => ({
        text: p.textContent.trim(),
        href: p.getAttribute('href'),
        height: p.getBoundingClientRect().height
      }));
      return { hasHero: true, hasImg: !!img, hasScrim: !!scrim, headline, pills };
    })()`);

    assertCheck('Hero section (#hero) exists in DOM', heroSection && heroSection.hasHero);
    assertCheck('Hero background photograph and calibrated scrim are present', heroSection && heroSection.hasImg && heroSection.hasScrim);
    assertCheck('Authoritative headline rendered', heroSection && heroSection.headline.includes('Travel Salzburg & The Alps'));
    assertCheck('Hero contains exactly 3 anchor pathway pills', heroSection && heroSection.pills.length === 3);

    const expectedPills = [
      { text: '1. Book by Place', href: '#destinations' },
      { text: '2. Book by Car', href: '#fleet' },
      { text: '3. Book by Tour', href: '#tours' }
    ];
    expectedPills.forEach((exp, idx) => {
      const p = heroSection?.pills[idx];
      assertCheck(`Pill ${idx + 1}: ${exp.text} routes to ${exp.href}`, p && p.text.includes(exp.text) && p.href === exp.href);
      assertCheck(`Pill ${idx + 1} touch target >= 44px`, p && p.height >= 44, `height: ${p ? p.height : 0}px`);
    });

    console.log('\n--- 2. Pathway 1: Book by Place (#destinations) ---');
    const destSection = await client.eval(`(() => {
      const sec = document.getElementById('destinations');
      if (!sec) return null;
      const title = sec.querySelector('h2')?.textContent.trim();
      const cards = Array.from(sec.querySelectorAll('.glass-card')).map(c => {
        const h3 = c.querySelector('h3')?.textContent.trim();
        const price = c.querySelector('.font-mono.text-gold')?.textContent.trim();
        const btn = c.querySelector('a.btn-gold');
        return {
          title: h3,
          price,
          href: btn?.getAttribute('href'),
          btnHeight: btn?.getBoundingClientRect().height
        };
      });
      return { title, cardCount: cards.length, cards };
    })()`);

    assertCheck('Pathway 1 (#destinations) section exists', !!destSection);
    assertCheck('Pathway 1 has 6 canonical destination transfer cards', destSection && destSection.cardCount === 6);
    
    const canonicalDestinations = [
      { name: 'Salzburg Airport (SZG)', urlSnippet: 'Salzburg+Airport+SZG' },
      { name: 'Hallstatt Heritage', urlSnippet: 'Hallstatt+Lahn+Terminal' },
      { name: 'Zell am See / Kaprun', urlSnippet: 'Zell+am+See' },
      { name: 'Munich Airport (MUC)', urlSnippet: 'Munich+Airport+MUC' },
      { name: 'Vienna City / VIE', urlSnippet: 'Vienna+City' },
      { name: 'Kitzbühel Ski Arena', urlSnippet: 'Kitzbuehel' }
    ];

    canonicalDestinations.forEach(cd => {
      const card = destSection?.cards.find(c => c.title && c.title.includes(cd.name.split(' ')[0]));
      assertCheck(`Destination card [${cd.name}] rendered with deep-link`, card && card.href && card.href.includes(cd.urlSnippet));
      assertCheck(`Destination card [${cd.name}] CTA height >= 44px`, card && card.btnHeight >= 44, `height: ${card ? card.btnHeight : 0}px`);
    });

    console.log('\n--- 3. Pathway 2: Book by Car (#fleet) ---');
    const fleetSection = await client.eval(`(() => {
      const sec = document.getElementById('fleet');
      if (!sec) return null;
      const tabs = Array.from(sec.querySelectorAll('.fleet-tab')).map(t => ({
        label: t.textContent.trim(),
        vehicle: t.getAttribute('data-vehicle')
      }));
      const carImage = sec.querySelector('.fleet-peek-image, #fallback-img');
      const bookCta = sec.querySelector('#carousel-book-cta');
      return {
        hasSec: true,
        tabsCount: tabs.length,
        hasCarImage: !!carImage,
        ctaHeight: bookCta?.getBoundingClientRect().height
      };
    })()`);

    assertCheck('Pathway 2 (#fleet) exists with side peek presentation', fleetSection && fleetSection.hasSec && fleetSection.hasCarImage);
    assertCheck('Fleet section has 3 model selector tabs', fleetSection && fleetSection.tabsCount === 3);
    assertCheck('Fleet booking CTA touch target >= 48px', fleetSection && fleetSection.ctaHeight >= 48, `height: ${fleetSection ? fleetSection.ctaHeight : 0}px`);

    console.log('\n--- 4. Pathway 3: Book by Tour (#tours) ---');
    const toursSection = await client.eval(`(() => {
      const sec = document.getElementById('tours');
      if (!sec) return null;
      const title = sec.querySelector('h2')?.textContent.trim();
      const cards = Array.from(sec.querySelectorAll('.glass-card')).map(c => {
        const h3 = c.querySelector('h3')?.textContent.trim();
        const priceEl = Array.from(c.querySelectorAll('.font-mono')).find(el => el.textContent.trim().startsWith('€'));
        const price = priceEl?.textContent.trim();
        const bookBtn = c.querySelector('a.btn-gold');
        const itinBtn = c.querySelector('a.btn-outline-gold');
        return {
          title: h3,
          price,
          bookHref: bookBtn?.getAttribute('href'),
          itinHref: itinBtn?.getAttribute('href'),
          bookHeight: bookBtn?.getBoundingClientRect().height
        };
      });
      return { title, cardCount: cards.length, cards };
    })()`);

    assertCheck('Pathway 3 (#tours) section exists', !!toursSection);
    assertCheck('Pathway 3 contains exactly 4 signature tour cards', toursSection && toursSection.cardCount === 4);

    const signatureTours = [
      { name: 'Hallstatt', tourKey: 'hallstatt', rate: '€450.00' },
      { name: 'Sound of Music', tourKey: 'sound-of-music', rate: '€450.00' },
      { name: 'Eagle\'s Nest', tourKey: 'eagles-nest', rate: '€450.00' },
      { name: 'Grossglockner', tourKey: 'grossglockner', rate: '€550.00' }
    ];

    signatureTours.forEach(st => {
      const card = toursSection?.cards.find(c => c.title && c.title.toLowerCase().includes(st.name.toLowerCase().split(' ')[0]));
      assertCheck(`Signature tour [${st.name}] flat rate matches spec (${st.rate})`, card && card.price === st.rate);
      assertCheck(`Signature tour [${st.name}] deep-links with tour=${st.tourKey}`, card && card.bookHref && card.bookHref.includes(`tour=${st.tourKey}`));
      assertCheck(`Signature tour [${st.name}] CTA height >= 44px`, card && card.bookHeight >= 44, `height: ${card ? card.bookHeight : 0}px`);
    });

    console.log('\n--- 5. Auxiliary Sections & Testimonials ---');
    const auxSections = await client.eval(`(() => {
      return {
        hasTrust: !!document.getElementById('trust'),
        hasRoutes: !!document.getElementById('routes'),
        hasAirportGuide: !!document.getElementById('airport-guide'),
        hasTestimonials: !!document.getElementById('testimonials'),
        testimonialsCount: document.getElementById('testimonials')?.querySelectorAll('.glass-card').length || 0,
        hasFaq: !!document.getElementById('faq'),
        hasFooter: !!document.querySelector('footer')
      };
    })()`);

    assertCheck('4-Pillar Trust Strip (#trust) present', auxSections && auxSections.hasTrust);
    assertCheck('Top Transfer Routes matrix (#routes) present', auxSections && auxSections.hasRoutes);
    assertCheck('Salzburg Airport Guide (#airport-guide) present', auxSections && auxSections.hasAirportGuide);
    assertCheck('Verified Client Testimonials (#testimonials) present with 3 glass cards', auxSections && auxSections.hasTestimonials && auxSections.testimonialsCount === 3);
    assertCheck('Frequently Asked Questions (#faq) present', auxSections && auxSections.hasFaq);
    assertCheck('Austrian legal footer present', auxSections && auxSections.hasFooter);

    console.log('\n--- 6. Multi-Viewport Horizontal Breakout Audit (scrollWidth <= innerWidth) ---');
    const viewports = [
      { name: 'Mobile 320px (iPhone SE narrow)', w: 320, h: 640 },
      { name: 'Mobile 375px (iPhone SE standard)', w: 375, h: 667 },
      { name: 'Mobile 390px (iPhone 14/15)', w: 390, h: 844 },
      { name: 'Tablet 768px (iPad Mini/Air)', w: 768, h: 1024 },
      { name: 'Desktop 1280px (MacBook / HD)', w: 1280, h: 800 }
    ];

    for (const vp of viewports) {
      await client.setViewport(vp.w, vp.h, vp.w < 768);
      const metrics = await client.eval(`({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        overflow: document.documentElement.scrollWidth - window.innerWidth
      })`);
      assertCheck(`Viewport ${vp.name}: strictly 0px horizontal overflow`, metrics && metrics.scrollWidth <= metrics.innerWidth, `diff: ${metrics ? metrics.overflow : 'N/A'}px`);
      
      const ssPath = path.join(SCREENSHOTS_DIR, `homepage_${vp.w}px.png`);
      await client.captureScreenshot(ssPath);
    }

    console.log('\n--- 7. Parameter Pre-Hydration in /booking.html ---');
    // Test 1: Destination Transfer parameter hydration
    await client.send('Page.navigate', { url: 'http://localhost:3000/booking.html?pickup=Salzburg+City+Center&dest=Salzburg+Airport+SZG' });
    await wait(2000);
    const destHydration = await client.eval(`({
      pickupVal: document.getElementById('step1-pickup')?.value,
      dropoffVal: document.getElementById('step1-dropoff')?.value
    })`);
    assertCheck('Pathway 1 pre-hydrates Pickup & Destination in booking engine', 
      destHydration && destHydration.pickupVal === 'Salzburg City Center' && destHydration.dropoffVal === 'Salzburg Airport SZG',
      `dropoff: ${destHydration ? destHydration.dropoffVal : ''}`
    );

    // Test 2: Vehicle pre-selection hydration
    await client.send('Page.navigate', { url: 'http://localhost:3000/booking.html?vehicle=V_CLASS' });
    await wait(2000);
    const vehHydration = await client.eval(`({
      category: appState.vehicleCategory,
      badgeText: document.getElementById('preselected-vehicle-badge')?.textContent || ''
    })`);
    assertCheck('Pathway 2 pre-selects Mercedes V-Class vehicle category', 
      vehHydration && vehHydration.category === 'V_CLASS',
      `category: ${vehHydration ? vehHydration.category : ''}`
    );

    // Test 3: Tour pre-selection hydration
    await client.send('Page.navigate', { url: 'http://localhost:3000/booking.html?service=TOUR&tour=hallstatt' });
    await wait(2000);
    const tourHydration = await client.eval(`({
      serviceType: appState.serviceType,
      tourKey: appState.tourKey,
      tourSelectVal: document.getElementById('step1-tour-select')?.value
    })`);
    assertCheck('Pathway 3 pre-selects Tour service and Hallstatt option', 
      tourHydration && tourHydration.serviceType === 'TOUR' && tourHydration.tourKey === 'hallstatt' && tourHydration.tourSelectVal === 'hallstatt',
      `tourKey: ${tourHydration ? tourHydration.tourKey : ''}`
    );

    const bookingSsPath = path.join(SCREENSHOTS_DIR, 'booking_prehydrated_tour.png');
    await client.captureScreenshot(bookingSsPath);

    console.log('\n================================================================');
    console.log(`AUDIT FINISHED: ${passedAssertions} / ${totalAssertions} ASSERTIONS PASSED`);
    console.log('================================================================');

    if (passedAssertions !== totalAssertions) {
      console.error(`Verification failed: ${totalAssertions - passedAssertions} checks did not pass.`);
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('Audit execution error:', err);
    process.exitCode = 1;
  } finally {
    client.close();
    chromeProcess.kill('SIGKILL');
  }
}

runAudit();
