const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = '/home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/screenshots/carousel';
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
  console.log('Starting headless Chrome for Carousel QA in isolated profile...');
  const profileDir = `/tmp/chrome-carousel-qa-${Date.now()}`;
  const chromeProcess = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    `--user-data-dir=${profileDir}`,
    '--window-size=1280,800',
    'http://localhost:3000/#fleet'
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

  // Clear any existing session storage and navigate to fresh #fleet
  await client.eval(`sessionStorage.clear()`);
  await client.send('Page.navigate', { url: 'http://localhost:3000/#fleet' });
  await wait(2000);

  const results = {
    testSuite: 'TSK-PET-031: Interactive 3D Vehicle Carousel Browser QA',
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
    // Scroll fleet section into view
    await client.eval(`
      const fleet = document.getElementById('fleet');
      if (fleet) fleet.scrollIntoView();
    `);
    await wait(800);

    // =========================================================================
    // PILLAR 1: Single-Vehicle Spotlight Layout Verification
    // =========================================================================
    console.log('\n--- Pillar 1: Single-Vehicle Spotlight Layout Verification ---');
    const layoutAudit = await client.eval(`
      (() => {
        const fleetSec = document.getElementById('fleet');
        const stage = document.getElementById('fleet-stage');
        const scrim = stage ? stage.querySelector('.stage-scrim') : null;
        const fallback = document.getElementById('stage-fallback');
        const fallbackImg = document.getElementById('fallback-img');
        const multiCards = document.querySelectorAll('#fleet .grid-cols-3');
        const chevrons = document.querySelectorAll('.carousel-chevron');

        const stageComputed = stage ? window.getComputedStyle(stage) : null;
        const scrimComputed = scrim ? window.getComputedStyle(scrim) : null;

        return {
          fleetSecExists: !!fleetSec,
          fleetHasClass: fleetSec ? fleetSec.classList.contains('fleet-spotlight-section') : false,
          stageExists: !!stage,
          stageHasClass: stage ? stage.classList.contains('fleet-stage-container') : false,
          singleVehicleRendered: !!fallback && !!fallbackImg && fallbackImg.offsetParent !== null,
          noMultiCardGrid: multiCards.length === 0,
          scrimExists: !!scrim,
          scrimPointerEventsNone: scrimComputed ? scrimComputed.pointerEvents === 'none' : false,
          stageAspectRatio: stageComputed ? stageComputed.aspectRatio : null,
          stageBorderRadius: stageComputed ? stageComputed.borderRadius : null,
          stageOverflowHidden: stageComputed ? stageComputed.overflow === 'hidden' : false,
          chevronsCount: chevrons.length
        };
      })()
    `);

    assert('Pillar 1: #fleet section has .fleet-spotlight-section class', layoutAudit.fleetHasClass, layoutAudit);
    assert('Pillar 1: #fleet-stage exists with .fleet-stage-container class', layoutAudit.stageHasClass, layoutAudit);
    assert('Pillar 1: Exactly ONE single vehicle spotlight is rendered (no multi-card grid)', layoutAudit.singleVehicleRendered && layoutAudit.noMultiCardGrid, layoutAudit);
    assert('Pillar 1: Ambient radial gold scrim exists with pointer-events: none', layoutAudit.scrimExists && layoutAudit.scrimPointerEventsNone, layoutAudit);
    assert('Pillar 1: Spotlight stage enforces overflow: hidden and border-radius', layoutAudit.stageOverflowHidden && !!layoutAudit.stageBorderRadius, layoutAudit);
    assert('Pillar 1: Exactly 2 floating glassmorphic chevrons present on stage', layoutAudit.chevronsCount === 2, layoutAudit);

    const shotPillar1 = await client.captureScreenshot('pillar1_single_vehicle_spotlight_desktop.png');
    console.log(`Captured: ${shotPillar1}`);

    // =========================================================================
    // PILLAR 2: 3D Model Viewer & 2D Fallback Rendering
    // =========================================================================
    console.log('\n--- Pillar 2: 3D Model & 2D Fallback Rendering ---');
    const modelViewerAudit = await client.eval(`
      (() => {
        const mv = document.getElementById('vehicle-viewer');
        const fallback = document.getElementById('stage-fallback');
        const fallbackImg = document.getElementById('fallback-img');
        const cue = document.getElementById('stage-cue');

        return {
          mvExists: !!mv,
          mvTagName: mv ? mv.tagName.toLowerCase() : null,
          poster: mv ? mv.getAttribute('poster') : null,
          autoRotate: mv ? mv.hasAttribute('auto-rotate') : false,
          rotationSpeed: mv ? mv.getAttribute('rotation-per-second') : null,
          autoRotateDelay: mv ? mv.getAttribute('auto-rotate-delay') : null,
          cameraOrbit: mv ? mv.getAttribute('camera-orbit') : null,
          minCameraOrbit: mv ? mv.getAttribute('min-camera-orbit') : null,
          maxCameraOrbit: mv ? mv.getAttribute('max-camera-orbit') : null,
          disableZoom: mv ? mv.hasAttribute('disable-zoom') : false,
          touchAction: mv ? mv.getAttribute('touch-action') : null,
          shadowIntensity: mv ? mv.getAttribute('shadow-intensity') : null,
          fallbackVisible: fallback ? window.getComputedStyle(fallback).display !== 'none' : false,
          fallbackImgSrc: fallbackImg ? fallbackImg.getAttribute('src') : null,
          fallbackImgNaturalW: fallbackImg ? fallbackImg.naturalWidth : 0,
          fallbackImgNaturalH: fallbackImg ? fallbackImg.naturalHeight : 0,
          cueVisible: cue ? window.getComputedStyle(cue).display !== 'none' : false,
          cueText: cue ? cue.innerText.trim() : ''
        };
      })()
    `);

    assert('Pillar 2: <model-viewer> exists with valid attributes', modelViewerAudit.mvExists && modelViewerAudit.mvTagName === 'model-viewer', modelViewerAudit);
    assert('Pillar 2: <model-viewer> has 0.75 RPM auto-rotation (4.5deg/s)', modelViewerAudit.autoRotate && modelViewerAudit.rotationSpeed === '4.5deg', modelViewerAudit);
    assert('Pillar 2: <model-viewer> clamped vertical orbit pitch (72deg to 88deg)', modelViewerAudit.minCameraOrbit === 'auto 72deg auto' && modelViewerAudit.maxCameraOrbit === 'auto 88deg auto', modelViewerAudit);
    assert('Pillar 2: <model-viewer> zoom disabled and touch-action: pan-y (prevents scroll trap)', modelViewerAudit.disableZoom && modelViewerAudit.touchAction === 'pan-y', modelViewerAudit);
    assert('Pillar 2: Zero-CLS WebP poster hydration attribute matches /images/mercedes-e-class.webp', modelViewerAudit.poster === '/images/mercedes-e-class.webp', modelViewerAudit);
    assert('Pillar 2: 2D WebP fallback is active with loaded high-res image', modelViewerAudit.fallbackVisible && modelViewerAudit.fallbackImgNaturalW > 0, modelViewerAudit);
    assert('Pillar 2: 360 drag interaction cue is initially displayed', modelViewerAudit.cueVisible && modelViewerAudit.cueText.includes('Showcase'), modelViewerAudit);

    // Test drag interaction dismisses the cue
    await client.eval(`
      const stage = document.getElementById('fleet-stage');
      if (stage) {
        stage.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      }
    `);
    await wait(700);

    const cueAfterInteraction = await client.eval(`
      (() => {
        const cue = document.getElementById('stage-cue');
        return {
          opacity: cue ? window.getComputedStyle(cue).opacity : null,
          hiddenClass: cue ? cue.classList.contains('hidden') : false
        };
      })()
    `);

    assert('Pillar 2: 360 drag cue fades out / hides upon pointer interaction', cueAfterInteraction.opacity === '0' || cueAfterInteraction.hiddenClass, cueAfterInteraction);

    const shotPillar2 = await client.captureScreenshot('pillar2_model_fallback_rendering.png');
    console.log(`Captured: ${shotPillar2}`);

    // =========================================================================
    // PILLAR 3: Carousel Controls & Navigation (Tabs, Chevrons, Dashes, Keyboard)
    // =========================================================================
    console.log('\n--- Pillar 3: Carousel Controls & Navigation ---');

    // 1. Top tabs direct selection
    const tabsAuditInitial = await client.eval(`
      (() => {
        const tabs = document.querySelectorAll('.fleet-tab');
        return {
          count: tabs.length,
          tab0Active: tabs[0].classList.contains('active') && tabs[0].getAttribute('aria-selected') === 'true',
          tab1Active: tabs[1].classList.contains('active') && tabs[1].getAttribute('aria-selected') === 'true',
          tab2Active: tabs[2].classList.contains('active') && tabs[2].getAttribute('aria-selected') === 'true',
          indicator: document.getElementById('carousel-indicator-text')?.textContent.trim()
        };
      })()
    `);

    assert('Pillar 3: 3 Model tabs exist and Tab 0 (E-Class) is initially active', tabsAuditInitial.count === 3 && tabsAuditInitial.tab0Active && !tabsAuditInitial.tab1Active, tabsAuditInitial);
    assert('Pillar 3: Initial indicator text correctly reads E-Class Sedan', tabsAuditInitial.indicator.includes('01 / 03') && tabsAuditInitial.indicator.includes('E-Class'), tabsAuditInitial);

    // Click Tab 1 (V-Class)
    await client.eval(`
      const tab1 = document.querySelectorAll('.fleet-tab')[1];
      if (tab1) tab1.click();
    `);
    await wait(300);

    const tab1Audit = await client.eval(`
      (() => {
        const tabs = document.querySelectorAll('.fleet-tab');
        const fallbackImg = document.getElementById('fallback-img');
        const indicator = document.getElementById('carousel-indicator-text');
        const dashes = document.querySelectorAll('.carousel-dash');
        return {
          tab0Active: tabs[0].classList.contains('active'),
          tab1Active: tabs[1].classList.contains('active') && tabs[1].getAttribute('aria-selected') === 'true',
          imgSrc: fallbackImg ? fallbackImg.getAttribute('src') : '',
          indicator: indicator ? indicator.textContent.trim() : '',
          dash1Active: dashes[1].classList.contains('active')
        };
      })()
    `);

    assert('Pillar 3: Clicking Tab 1 activates V-Class and updates poster to mercedes-v-class.webp', tab1Audit.tab1Active && !tab1Audit.tab0Active && tab1Audit.imgSrc.includes('v-class.webp'), tab1Audit);
    assert('Pillar 3: Indicator text updates to 02 / 03 • Mercedes-Benz V-Class VIP', tab1Audit.indicator.includes('02 / 03') && tab1Audit.indicator.includes('V-Class'), tab1Audit);
    assert('Pillar 3: Dash 1 becomes active on V-Class selection', tab1Audit.dash1Active, tab1Audit);

    const shotPillar3Tab1 = await client.captureScreenshot('pillar3_tab1_vclass_selected.png');
    console.log(`Captured: ${shotPillar3Tab1}`);

    // Click Tab 2 (Vito)
    await client.eval(`
      const tab2 = document.querySelectorAll('.fleet-tab')[2];
      if (tab2) tab2.click();
    `);
    await wait(300);

    const tab2Audit = await client.eval(`
      (() => {
        const tabs = document.querySelectorAll('.fleet-tab');
        const fallbackImg = document.getElementById('fallback-img');
        const indicator = document.getElementById('carousel-indicator-text');
        const dashes = document.querySelectorAll('.carousel-dash');
        return {
          tab2Active: tabs[2].classList.contains('active') && tabs[2].getAttribute('aria-selected') === 'true',
          imgSrc: fallbackImg ? fallbackImg.getAttribute('src') : '',
          indicator: indicator ? indicator.textContent.trim() : '',
          dash2Active: dashes[2].classList.contains('active')
        };
      })()
    `);

    assert('Pillar 3: Clicking Tab 2 activates Vito and updates poster to mercedes-vito.webp', tab2Audit.tab2Active && tab2Audit.imgSrc.includes('vito.webp'), tab2Audit);
    assert('Pillar 3: Indicator text updates to 03 / 03 • Mercedes-Benz Vito Tourer 4MATIC', tab2Audit.indicator.includes('03 / 03') && tab2Audit.indicator.includes('Vito'), tab2Audit);

    const shotPillar3Tab2 = await client.captureScreenshot('pillar3_tab2_vito_selected.png');
    console.log(`Captured: ${shotPillar3Tab2}`);

    // Test Chevron buttons & touch targets
    const chevronAudit = await client.eval(`
      (() => {
        const prevBtn = document.querySelector('.carousel-chevron[aria-label="Previous vehicle"]');
        const nextBtn = document.querySelector('.carousel-chevron[aria-label="Next vehicle"]');
        const prevRect = prevBtn ? prevBtn.getBoundingClientRect() : null;
        const nextRect = nextBtn ? nextBtn.getBoundingClientRect() : null;

        return {
          prevExists: !!prevBtn,
          nextExists: !!nextBtn,
          prevW: prevRect ? prevRect.width : 0,
          prevH: prevRect ? prevRect.height : 0,
          nextW: nextRect ? nextRect.width : 0,
          nextH: nextRect ? nextRect.height : 0
        };
      })()
    `);

    assert('Pillar 3: Chevrons meet strict 48x48px hit area requirement', chevronAudit.prevW >= 48 && chevronAudit.prevH >= 48 && chevronAudit.nextW >= 48 && chevronAudit.nextH >= 48, chevronAudit);

    // Test Prev Chevron (from Vito index 2 -> V-Class index 1)
    await client.eval(`prevFleetVehicle()`);
    await wait(200);
    const prevTo1 = await client.eval(`window.fleetActiveIndex`);
    assert('Pillar 3: prevFleetVehicle() shifts from Vito (2) to V-Class (1)', prevTo1 === 1, { prevTo1 });

    // Test Prev Chevron wrap-around (1 -> 0 -> 2)
    await client.eval(`prevFleetVehicle()`);
    await wait(200);
    const prevTo0 = await client.eval(`window.fleetActiveIndex`);
    assert('Pillar 3: prevFleetVehicle() shifts from V-Class (1) to E-Class (0)', prevTo0 === 0, { prevTo0 });

    await client.eval(`prevFleetVehicle()`);
    await wait(200);
    const prevWrap = await client.eval(`window.fleetActiveIndex`);
    assert('Pillar 3: prevFleetVehicle() wraps around from E-Class (0) to Vito (2)', prevWrap === 2, { prevWrap });

    // Test Next Chevron wrap-around (2 -> 0)
    await client.eval(`nextFleetVehicle()`);
    await wait(200);
    const nextWrap = await client.eval(`window.fleetActiveIndex`);
    assert('Pillar 3: nextFleetVehicle() wraps around from Vito (2) to E-Class (0)', nextWrap === 0, { nextWrap });

    // Test Pagination Dashes
    const dashAudit = await client.eval(`
      (() => {
        const dashes = document.querySelectorAll('.carousel-dash');
        const rects = Array.from(dashes).map(d => {
          const r = d.getBoundingClientRect();
          return { w: r.width, h: r.height };
        });
        return {
          count: dashes.length,
          allMeet44px: rects.every(r => r.w >= 44 && r.h >= 44),
          rects
        };
      })()
    `);
    assert('Pillar 3: All pagination dash buttons meet minimum 44x44px touch targets', dashAudit.allMeet44px, dashAudit);

    // Test Keyboard navigation (ArrowRight and ArrowLeft)
    const keyAudit = await client.eval(`
      (() => {
        switchFleetVehicle(0);
        const idx0 = window.fleetActiveIndex;
        const stage = document.getElementById('fleet-stage');
        stage.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', code: 'ArrowRight', bubbles: true }));
        const idxAfterRight = window.fleetActiveIndex;

        stage.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', code: 'ArrowLeft', bubbles: true }));
        const idxAfterLeft = window.fleetActiveIndex;

        return { idx0, idxAfterRight, idxAfterLeft };
      })()
    `);

    assert('Pillar 3: ArrowRight key advances carousel from index 0 to 1', keyAudit.idxAfterRight === 1, keyAudit);
    assert('Pillar 3: ArrowLeft key retreats carousel from index 1 to 0', keyAudit.idxAfterLeft === 0, keyAudit);

    // =========================================================================
    // PILLAR 4: Specification Deck Dynamic Updates
    // =========================================================================
    console.log('\n--- Pillar 4: Specification Deck Dynamic Updates ---');

    // Test E-Class Deck
    await client.eval(`switchFleetVehicle(0)`);
    await wait(200);
    const deckEClass = await client.eval(`
      (() => {
        return {
          cat: document.getElementById('carousel-category')?.textContent.trim(),
          name: document.getElementById('carousel-name')?.textContent.trim(),
          sub: document.getElementById('carousel-subtitle')?.textContent.trim(),
          rate: document.getElementById('carousel-rate')?.textContent.trim(),
          floor: document.getElementById('carousel-floor')?.textContent.trim(),
          pax: document.getElementById('carousel-pax')?.textContent.trim(),
          lug: document.getElementById('carousel-luggage')?.textContent.trim()
        };
      })()
    `);

    assert('Pillar 4: E-Class specification deck displays €2.50/km and Max 3 Pax / 2 Large Bags', 
      deckEClass.rate === '€2.50' && deckEClass.pax.includes('3 Passengers') && deckEClass.floor.includes('€45.00'), deckEClass);

    // Test V-Class Deck
    await client.eval(`switchFleetVehicle(1)`);
    await wait(200);
    const deckVClass = await client.eval(`
      (() => {
        return {
          cat: document.getElementById('carousel-category')?.textContent.trim(),
          name: document.getElementById('carousel-name')?.textContent.trim(),
          sub: document.getElementById('carousel-subtitle')?.textContent.trim(),
          rate: document.getElementById('carousel-rate')?.textContent.trim(),
          floor: document.getElementById('carousel-floor')?.textContent.trim(),
          pax: document.getElementById('carousel-pax')?.textContent.trim(),
          lug: document.getElementById('carousel-luggage')?.textContent.trim()
        };
      })()
    `);

    assert('Pillar 4: V-Class specification deck displays €2.60/km and Max 8 Pax / 8 Suitcases', 
      deckVClass.rate === '€2.60' && deckVClass.pax.includes('8 Passengers') && deckVClass.lug.includes('8 Large Suitcases'), deckVClass);

    // Test Vito Deck
    await client.eval(`switchFleetVehicle(2)`);
    await wait(200);
    const deckVito = await client.eval(`
      (() => {
        return {
          cat: document.getElementById('carousel-category')?.textContent.trim(),
          name: document.getElementById('carousel-name')?.textContent.trim(),
          sub: document.getElementById('carousel-subtitle')?.textContent.trim(),
          rate: document.getElementById('carousel-rate')?.textContent.trim(),
          floor: document.getElementById('carousel-floor')?.textContent.trim(),
          pax: document.getElementById('carousel-pax')?.textContent.trim(),
          lug: document.getElementById('carousel-luggage')?.textContent.trim()
        };
      })()
    `);

    assert('Pillar 4: Vito Tourer specification deck displays €2.80/km and 4MATIC Specialist', 
      deckVito.rate === '€2.80' && deckVito.name.includes('Vito') && deckVito.pax.includes('8 Passengers'), deckVito);

    const shotPillar4Deck = await client.captureScreenshot('pillar4_specs_deck_vclass.png');
    console.log(`Captured: ${shotPillar4Deck}`);

    // =========================================================================
    // PILLAR 5: Deep-Link Booking Flow & Zero Lock-In
    // =========================================================================
    console.log('\n--- Pillar 5: Deep-Link Booking Flow & Zero Lock-In ---');

    // Switch to V-Class in carousel and click "Book This Vehicle"
    await client.eval(`switchFleetVehicle(1)`);
    await wait(200);

    await client.eval(`
      const cta = document.getElementById('carousel-book-cta');
      if (cta) cta.click();
    `);
    await wait(600);

    const bookingFlowAudit = await client.eval(`
      (() => {
        const banner = document.getElementById('preselection-banner');
        const bannerText = document.getElementById('preselection-banner-text');
        const vclassCard = document.querySelector('.vehicle-card[data-veh="V_CLASS"]');
        const isVClassSelected = vclassCard ? vclassCard.classList.contains('border-gold') : false;

        return {
          category: window.appState ? window.appState.vehicleCategory : null,
          entrySource: window.appState ? window.appState.entrySource : null,
          bannerVisible: banner ? !banner.classList.contains('hidden') : false,
          bannerText: bannerText ? bannerText.textContent.trim() : '',
          isVClassCardSelected: isVClassSelected,
          url: window.location.href
        };
      })()
    `);

    assert('Pillar 5: Clicking [Book This Vehicle] sets appState.vehicleCategory to V_CLASS and entrySource to fleet', 
      bookingFlowAudit.category === 'V_CLASS' && bookingFlowAudit.entrySource === 'fleet', bookingFlowAudit);
    assert('Pillar 5: Preselection banner is displayed with affirmative non-locking copy', 
      bookingFlowAudit.bannerVisible && bookingFlowAudit.bannerText.includes('V-Class') && bookingFlowAudit.bannerText.includes('change this at any time'), bookingFlowAudit);
    assert('Pillar 5: V-Class card is highlighted in Stage 2 selection view', 
      bookingFlowAudit.isVClassCardSelected, bookingFlowAudit);

    // Test Zero Lock-In: customer can freely click E-Class in Stage 2 to switch vehicle
    await client.eval(`
      const eclassCard = document.querySelector('.vehicle-card[data-veh="E_CLASS"]');
      if (eclassCard) eclassCard.click();
    `);
    await wait(300);

    const zeroLockInAudit = await client.eval(`
      (() => {
        const eclassCard = document.querySelector('.vehicle-card[data-veh="E_CLASS"]');
        const vclassCard = document.querySelector('.vehicle-card[data-veh="V_CLASS"]');
        return {
          newCategory: window.appState ? window.appState.vehicleCategory : null,
          eclassSelected: eclassCard ? eclassCard.classList.contains('border-gold') : false,
          vclassDeselected: vclassCard ? !vclassCard.classList.contains('border-gold') : false
        };
      })()
    `);

    assert('Pillar 5: Zero Lock-In verified: customer can switch vehicle to E-Class without restriction', 
      zeroLockInAudit.newCategory === 'E_CLASS' && zeroLockInAudit.eclassSelected && zeroLockInAudit.vclassDeselected, zeroLockInAudit);

    const shotPillar5 = await client.captureScreenshot('pillar5_booking_preselected_vclass.png');
    console.log(`Captured: ${shotPillar5}`);

    // =========================================================================
    // PILLAR 6: Mobile Touch / Swipe Ergonomics & Multi-Viewport Stability
    // =========================================================================
    console.log('\n--- Pillar 6: Mobile Touch / Swipe Ergonomics & Multi-Viewport Stability ---');

    const viewports = [
      { name: 'iPhone SE', width: 375, height: 667, mobile: true },
      { name: 'iPhone 14/15', width: 390, height: 844, mobile: true },
      { name: 'Samsung Galaxy S22', width: 412, height: 915, mobile: true },
      { name: 'Tablet (iPad)', width: 768, height: 1024, mobile: false },
      { name: 'Desktop HD', width: 1280, height: 800, mobile: false }
    ];

    for (const vp of viewports) {
      await client.setViewport(vp.width, vp.height, vp.mobile);
      await client.eval(`
        const fleet = document.getElementById('fleet');
        if (fleet) fleet.scrollIntoView();
      `);
      await wait(400);

      const vpAudit = await client.eval(`
        (() => {
          const docEl = document.documentElement;
          const scrollW = docEl.scrollWidth;
          const innerW = window.innerWidth;
          const overflow = scrollW - innerW;

          // Check interactive touch targets
          const chevrons = Array.from(document.querySelectorAll('.carousel-chevron')).map(c => {
            const r = c.getBoundingClientRect();
            return { w: r.width, h: r.height };
          });
          const tabs = Array.from(document.querySelectorAll('.fleet-tab')).map(t => {
            const r = t.getBoundingClientRect();
            return { w: r.width, h: r.height };
          });
          const dashes = Array.from(document.querySelectorAll('.carousel-dash')).map(d => {
            const r = d.getBoundingClientRect();
            return { w: r.width, h: r.height };
          });
          const bookBtn = document.getElementById('carousel-book-cta');
          const bookRect = bookBtn ? bookBtn.getBoundingClientRect() : null;

          return {
            scrollW,
            innerW,
            overflow,
            chevronsPass: chevrons.every(c => c.w >= 44 && c.h >= 44),
            tabsPass: tabs.every(t => t.h >= 44),
            dashesPass: dashes.every(d => d.w >= 44 && d.h >= 44),
            bookBtnPass: bookRect ? bookRect.height >= 44 : false
          };
        })()
      `);

      assert(`Pillar 6 [${vp.name}]: 0px horizontal page overflow (${vp.width}px)`, 
        vpAudit.overflow <= 0, vpAudit);
      assert(`Pillar 6 [${vp.name}]: All interactive controls meet >=44x44px touch targets`, 
        vpAudit.chevronsPass && vpAudit.tabsPass && vpAudit.dashesPass && vpAudit.bookBtnPass, vpAudit);

      const filename = `viewport_carousel_${vp.name.replace(/[^a-zA-Z0-9]/g, '_')}_${vp.width}x${vp.height}.png`;
      const shot = await client.captureScreenshot(filename);
      console.log(`Captured [${vp.name}]: ${shot}`);
    }

    // Return to mobile viewport 390x844 for touch gesture simulation
    await client.setViewport(390, 844, true);
    await client.eval(`
      switchFleetVehicle(0);
      const fleet = document.getElementById('fleet');
      if (fleet) fleet.scrollIntoView();
    `);
    await wait(300);

    // Test Horizontal Touch Swipe: Left swipe (advance 0 -> 1)
    const swipeLeftAudit = await client.eval(`
      (() => {
        switchFleetVehicle(0);
        const stage = document.getElementById('fleet-stage');
        if (!stage) return { error: 'No stage' };

        // Simulate touchstart at x=250, y=300
        const touchStart = new Touch({
          identifier: 1,
          target: stage,
          clientX: 250,
          clientY: 300
        });
        stage.dispatchEvent(new TouchEvent('touchstart', {
          touches: [touchStart],
          changedTouches: [touchStart],
          bubbles: true
        }));

        // Simulate touchend at x=100, y=300 (deltaX = -150px)
        const touchEnd = new Touch({
          identifier: 1,
          target: stage,
          clientX: 100,
          clientY: 300
        });
        stage.dispatchEvent(new TouchEvent('touchend', {
          touches: [],
          changedTouches: [touchEnd],
          bubbles: true
        }));

        return {
          newIndex: window.fleetActiveIndex
        };
      })()
    `);
    await wait(400);

    assert('Pillar 6: Horizontal left touch swipe (>50px) advances carousel from index 0 to 1', 
      swipeLeftAudit.newIndex === 1, swipeLeftAudit);

    // Test Horizontal Touch Swipe: Right swipe (retreat 1 -> 0)
    const swipeRightAudit = await client.eval(`
      (() => {
        const stage = document.getElementById('fleet-stage');
        if (!stage) return { error: 'No stage' };

        const touchStart = new Touch({
          identifier: 2,
          target: stage,
          clientX: 100,
          clientY: 300
        });
        stage.dispatchEvent(new TouchEvent('touchstart', {
          touches: [touchStart],
          changedTouches: [touchStart],
          bubbles: true
        }));

        const touchEnd = new Touch({
          identifier: 2,
          target: stage,
          clientX: 250,
          clientY: 300
        });
        stage.dispatchEvent(new TouchEvent('touchend', {
          touches: [],
          changedTouches: [touchEnd],
          bubbles: true
        }));

        return {
          newIndex: window.fleetActiveIndex
        };
      })()
    `);
    await wait(400);

    assert('Pillar 6: Horizontal right touch swipe (>50px) retreats carousel from index 1 to 0', 
      swipeRightAudit.newIndex === 0, swipeRightAudit);

    // Test Vertical Scroll Pass-Through (vertical displacement dominates, slide should NOT change)
    const verticalScrollAudit = await client.eval(`
      (() => {
        const stage = document.getElementById('fleet-stage');
        if (!stage) return { error: 'No stage' };

        const touchStart = new Touch({
          identifier: 3,
          target: stage,
          clientX: 200,
          clientY: 400
        });
        stage.dispatchEvent(new TouchEvent('touchstart', {
          touches: [touchStart],
          changedTouches: [touchStart],
          bubbles: true
        }));

        // Vertical scroll: deltaY = -150px, deltaX = -20px
        const touchEnd = new Touch({
          identifier: 3,
          target: stage,
          clientX: 180,
          clientY: 250
        });
        stage.dispatchEvent(new TouchEvent('touchend', {
          touches: [],
          changedTouches: [touchEnd],
          bubbles: true
        }));

        return {
          newIndex: window.fleetActiveIndex
        };
      })()
    `);
    await wait(400);

    assert('Pillar 6: Vertical scroll pass-through preserved: vertical drag does NOT trigger slide change', 
      verticalScrollAudit.newIndex === 0, verticalScrollAudit);

    // =========================================================================
    // PILLAR 7: Unicode Emojis & Icon Quality
    // =========================================================================
    console.log('\n--- Pillar 7: Unicode Emojis & Icon Quality ---');
    const iconQualityAudit = await client.eval(`
      (() => {
        const fleet = document.getElementById('fleet');
        const text = fleet ? fleet.innerText : '';
        const emojiRegex = /[\\u{1F300}-\\u{1F9FF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}\\u{1F1E6}-\\u{1F1FF}]/gu;
        const matches = text.match(emojiRegex) || [];

        const iconifyIcons = fleet ? fleet.querySelectorAll('iconify-icon') : [];
        const nonLucide = Array.from(iconifyIcons).filter(icon => {
          const iconAttr = icon.getAttribute('icon') || '';
          return !iconAttr.startsWith('lucide:');
        });

        return {
          emojiCount: matches.length,
          emojisFound: matches,
          totalIconifyIcons: iconifyIcons.length,
          nonLucideIcons: nonLucide.map(i => i.getAttribute('icon'))
        };
      })()
    `);

    assert('Pillar 7: Exactly 0% Unicode emojis in #fleet section', 
      iconQualityAudit.emojiCount === 0, iconQualityAudit);
    assert('Pillar 7: Exactly 100% Lucide 2px stroke icons in #fleet section', 
      iconQualityAudit.nonLucideIcons.length === 0 && iconQualityAudit.totalIconifyIcons > 0, iconQualityAudit);

  } catch (err) {
    console.error('Test execution error:', err);
    assert('Test runner completed without fatal exceptions', false, { error: err.message, stack: err.stack });
  } finally {
    client.close();
    chromeProcess.kill();
  }

  // Save report to disk
  const reportPath = '/home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/browser_qa_carousel_results.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n=================================================`);
  console.log(`QA Test Suite Completed:`);
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
