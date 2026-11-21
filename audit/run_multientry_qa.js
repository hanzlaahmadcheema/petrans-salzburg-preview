const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = '/home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/screenshots/multientry';
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
  let target = targets.find(t => t.type === 'page' && t.url.includes('localhost:3000')) || targets[0];

  const client = new CDPClient(target.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('DOM.enable');
  await client.send('Runtime.enable');

  await wait(1500);

  const report = {
    testDate: new Date().toISOString(),
    entryPoints: {},
    eClassAudit: {},
    capacityAndUpgrade: {},
    stage5InlineEditing: {},
    historyAndMobile: {},
    faggSafetyAndBooking: {}
  };

  // ==========================================
  // PILLAR 1: MULTI-ENTRY POINT VERIFICATION
  // ==========================================
  console.log('Pillar 1: Testing Multi-Entry Points...');

  // 1A: Entry 1 - Book by Car (Clicking button in #fleet)
  const entry1Fleet = await client.eval(`
    (() => {
      // Find button in #fleet for E-Class
      const btn = document.querySelector('#fleet button[onclick*="E_CLASS"]');
      const textBefore = btn ? btn.innerText.trim() : '';
      if (btn) btn.click();
      
      const banner = document.getElementById('preselection-banner');
      const bannerText = document.getElementById('preselection-banner-text');
      const isVisible = banner && !banner.classList.contains('hidden');
      const url = window.location.href;
      
      return {
        buttonFound: !!btn,
        buttonText: textBefore,
        bannerVisible: isVisible,
        bannerContent: bannerText ? bannerText.innerText.trim() : '',
        url,
        currentStep: appState.currentStep,
        vehicleCategory: appState.vehicleCategory,
        ratePerKm: VEHICLE_META[appState.vehicleCategory]?.ratePerKm
      };
    })()
  `);
  report.entryPoints.entry1_bookByCar_click = entry1Fleet;
  await client.captureScreenshot('entry1_fleet_eclass_selected.png');

  // 1B: Entry 1 - Direct deep link (?vehicle=e-class)
  await client.send('Page.navigate', { url: 'http://localhost:3000/?vehicle=e-class' });
  await wait(1200);
  const entry1DeepLink = await client.eval(`
    (() => {
      const banner = document.getElementById('preselection-banner');
      const bannerText = document.getElementById('preselection-banner-text');
      return {
        url: window.location.href,
        bannerVisible: banner && !banner.classList.contains('hidden'),
        bannerContent: bannerText ? bannerText.innerText.trim() : '',
        vehicleCategory: appState.vehicleCategory,
        currentStep: appState.currentStep
      };
    })()
  `);
  report.entryPoints.entry1_deepLink_eclass = entry1DeepLink;

  // 1C: Entry 2 - Book by Tour (Clicking Hallstatt tour card)
  const entry2Click = await client.eval(`
    (() => {
      const tourBtn = document.querySelector('button[onclick*="hallstatt"]');
      const textBefore = tourBtn ? tourBtn.innerText.trim() : '';
      if (tourBtn) tourBtn.click();

      const banner = document.getElementById('preselection-banner');
      const bannerText = document.getElementById('preselection-banner-text');
      return {
        buttonFound: !!tourBtn,
        buttonText: textBefore,
        serviceType: appState.serviceType,
        tourKey: appState.tourKey,
        bannerVisible: banner && !banner.classList.contains('hidden'),
        bannerContent: bannerText ? bannerText.innerText.trim() : '',
        url: window.location.href,
        currentStep: appState.currentStep,
        flatRate: TOURS_DB[appState.tourKey]?.price
      };
    })()
  `);
  report.entryPoints.entry2_bookByTour_click = entry2Click;
  await client.captureScreenshot('entry2_tour_hallstatt_selected.png');

  // 1D: Entry 2 - Direct deep link (?service=tour&tour=hallstatt)
  await client.send('Page.navigate', { url: 'http://localhost:3000/?service=tour&tour=hallstatt' });
  await wait(1200);
  const entry2DeepLink = await client.eval(`
    (() => {
      const banner = document.getElementById('preselection-banner');
      const bannerText = document.getElementById('preselection-banner-text');
      return {
        url: window.location.href,
        serviceType: appState.serviceType,
        tourKey: appState.tourKey,
        bannerVisible: banner && !banner.classList.contains('hidden'),
        bannerContent: bannerText ? bannerText.innerText.trim() : '',
        flatRate: TOURS_DB[appState.tourKey]?.price,
        currentStep: appState.currentStep
      };
    })()
  `);
  report.entryPoints.entry2_deepLink_tour = entry2DeepLink;

  // 1E: Entry 3 - Book by Place / Hero Calculator
  await client.send('Page.navigate', { url: 'http://localhost:3000/' });
  await wait(1200);
  const entry3Place = await client.eval(`
    (() => {
      // Set hero calculator to Zell am See
      const originSelect = document.getElementById('calc-origin');
      const destSelect = document.getElementById('calc-dest');
      if (destSelect) {
        destSelect.value = 'zell-am-see';
        destSelect.dispatchEvent(new Event('change'));
      }
      const priceDisplay = document.getElementById('calc-price-display')?.innerText;
      const statDisplay = document.getElementById('calc-stat-distance')?.innerText;

      // Click "Configure & Book This Ride"
      const heroBookBtn = document.getElementById('btn-hero-book');
      if (heroBookBtn) heroBookBtn.click();

      return {
        calcPrice: priceDisplay,
        calcStat: statDisplay,
        step1Pickup: document.getElementById('step1-pickup')?.value,
        step1Dropoff: document.getElementById('step1-dropoff')?.value,
        distanceKm: appState.distanceKm,
        durationText: appState.durationText,
        currentStep: appState.currentStep
      };
    })()
  `);
  report.entryPoints.entry3_bookByPlace_hero = entry3Place;
  await client.captureScreenshot('entry3_hero_calc_carried.png');

  // ==========================================
  // PILLAR 2: MERCEDES-BENZ E-CLASS AUDIT
  // ==========================================
  console.log('Pillar 2: Testing Mercedes-Benz E-Class Visual & Rate...');
  const eClassVisual = await client.eval(`
    (async () => {
      const fleetSec = document.getElementById('fleet');
      if (fleetSec) fleetSec.scrollIntoView();
      await new Promise(r => setTimeout(r, 600));

      const fleetImg = document.querySelector('#fleet img[src*="mercedes-e-class"]');
      const stage2Img = document.querySelector('.vehicle-card[data-veh="E_CLASS"] img');
      const eClassMeta = VEHICLE_META['E_CLASS'];

      return {
        metaName: eClassMeta.name,
        metaRate: eClassMeta.ratePerKm,
        maxPax: eClassMeta.maxPax,
        maxLuggage: eClassMeta.maxLuggage,
        fleetImg: {
          src: fleetImg ? fleetImg.src : null,
          naturalWidth: fleetImg ? fleetImg.naturalWidth : 0,
          naturalHeight: fleetImg ? fleetImg.naturalHeight : 0,
          complete: fleetImg ? fleetImg.complete : false
        },
        stage2Img: {
          src: stage2Img ? stage2Img.src : null,
          naturalWidth: stage2Img ? stage2Img.naturalWidth : 0,
          naturalHeight: stage2Img ? stage2Img.naturalHeight : 0,
          complete: stage2Img ? stage2Img.complete : false
        }
      };
    })()
  `);
  report.eClassAudit = eClassVisual;
  await client.captureScreenshot('pillar2_fleet_eclass_render.png');

  // ==========================================
  // PILLAR 3: DYNAMIC CAPACITY & 1-CLICK UPGRADE
  // ==========================================
  console.log('Pillar 3: Testing Dynamic Capacity Enforcement & Upgrade...');
  const capacityTest = await client.eval(`
    (() => {
      // Switch vehicle to E_CLASS
      appState.vehicleCategory = 'E_CLASS';
      syncVehicleCardSelection();
      goToStep(2);

      // Party of 4 pax (exceeds max 3)
      appState.passengerCount = 4;
      appState.largeLuggageCount = 3;
      checkCapacityWarning();

      const warningBanner = document.getElementById('eclass-warning-banner');
      const isWarningVisible = warningBanner && !warningBanner.classList.contains('hidden');
      const warningText = warningBanner ? warningBanner.innerText.trim() : '';

      // Test 1-click Upgrade
      const upgradeBtn = warningBanner ? warningBanner.querySelector('button') : null;
      const upgradeBtnText = upgradeBtn ? upgradeBtn.innerText.trim() : '';
      if (upgradeBtn) upgradeBtn.click();

      // Check after upgrade
      const isWarningHiddenAfter = warningBanner && warningBanner.classList.contains('hidden');
      const newCategory = appState.vehicleCategory;
      const newRate = VEHICLE_META[newCategory]?.ratePerKm;

      return {
        warningVisibleBefore: isWarningVisible,
        warningText,
        upgradeBtnText,
        warningHiddenAfter: isWarningHiddenAfter,
        vehicleAfterUpgrade: newCategory,
        rateAfterUpgrade: newRate,
        reactiveRecalc: appState.currentQuote
      };
    })()
  `);
  report.capacityAndUpgrade = capacityTest;
  await client.captureScreenshot('pillar3_capacity_upgrade_test.png');

  // ==========================================
  // PILLAR 4: STAGE 5 IN-LINE REVIEW EDITING
  // ==========================================
  console.log('Pillar 4: Testing Stage 5 In-Line Review Editing...');
  const stage5Test = await client.eval(`
    (() => {
      // Step 1: Set route
      goToStep(1);
      appState.serviceType = 'ONE_WAY';
      appState.pickupAddress = 'Salzburg Airport W. A. Mozart (SZG)';
      appState.dropoffAddress = 'Hallstatt Lahn Terminal';
      appState.distanceKm = 73;

      // Step 2: Vehicle
      goToStep(2);
      appState.vehicleCategory = 'V_CLASS';
      syncVehicleCardSelection();

      // Step 3: Options
      goToStep(3);
      appState.pickupDate = '2026-11-25';
      appState.pickupTime = '15:00';
      appState.flightNumber = 'OS 265';
      appState.childSeats.baby = 1;
      appState.skiEquipment = 2;

      // Step 4: Passenger Info
      goToStep(4);
      document.getElementById('cust-name').value = 'Dr. Alexander von Salzburg';
      document.getElementById('cust-email').value = 'alexander.salzburg@luxury-travel.at';
      document.getElementById('cust-phone').value = '+436606416464';
      document.getElementById('cust-notes').value = 'VIP Chauffeur meet with luggage assistance.';

      // Advance to Stage 5
      goToStep(5);

      const initialSummary = {
        route: document.getElementById('sum-route')?.innerText,
        vehicle: document.getElementById('sum-vehicle')?.innerText,
        rateKm: document.getElementById('sum-rate-km')?.innerText,
        pax: document.getElementById('sum-pax')?.innerText,
        total: document.getElementById('sum-total-price')?.innerText,
        customerName: document.getElementById('sum-name')?.innerText,
        customerEmail: document.getElementById('sum-email')?.innerText
      };

      // Test In-Line Edit 1: [Change Vehicle] -> switch to E_CLASS
      toggleInlineEdit('vehicle');
      const vehicleEditorVisible = !document.getElementById('inline-edit-vehicle')?.classList.contains('hidden');
      setInlineVehicle('E_CLASS');
      const priceAfterEClass = document.getElementById('sum-total-price')?.innerText;
      const vehicleAfterEClass = document.getElementById('sum-vehicle')?.innerText;
      toggleInlineEdit('vehicle'); // close

      // Test In-Line Edit 2: [Change Vehicle] -> switch to VITO
      toggleInlineEdit('vehicle');
      setInlineVehicle('VITO');
      const priceAfterVito = document.getElementById('sum-total-price')?.innerText;
      const vehicleAfterVito = document.getElementById('sum-vehicle')?.innerText;
      toggleInlineEdit('vehicle'); // close

      // Test In-Line Edit 3: [Edit Route]
      toggleInlineEdit('route');
      const routeEditorVisible = !document.getElementById('inline-edit-route')?.classList.contains('hidden');
      document.getElementById('inline-dropoff').value = 'Zell am See / Kaprun';
      applyInlineRoute();
      const routeAfterEdit = document.getElementById('sum-route')?.innerText;
      const priceAfterRoute = document.getElementById('sum-total-price')?.innerText;
      toggleInlineEdit('route');

      // Test In-Line Edit 4: [Modify Extras]
      toggleInlineEdit('extras');
      const extrasEditorVisible = !document.getElementById('inline-edit-extras')?.classList.contains('hidden');
      adjustAddon('baby', 1);
      const babySeatsAfter = document.getElementById('sum-child-seats')?.innerText;
      toggleInlineEdit('extras');

      // Test In-Line Edit 5: [Edit Contact]
      toggleInlineEdit('contact');
      const contactEditorVisible = !document.getElementById('inline-edit-contact')?.classList.contains('hidden');
      document.getElementById('inline-cust-name').value = 'Dr. Alexander von Salzburg (Edited)';
      applyInlineContact();
      const nameAfterEdit = document.getElementById('sum-name')?.innerText;
      toggleInlineEdit('contact');

      // Confirm passenger details were NOT wiped out
      const retainedEmail = appState.customer.email;
      const retainedPhone = appState.customer.phoneNumber;

      return {
        initialSummary,
        vehicleEditorVisible,
        priceAfterEClass,
        vehicleAfterEClass,
        priceAfterVito,
        vehicleAfterVito,
        routeEditorVisible,
        routeAfterEdit,
        priceAfterRoute,
        extrasEditorVisible,
        babySeatsAfter,
        contactEditorVisible,
        nameAfterEdit,
        retainedEmail,
        retainedPhone
      };
    })()
  `);
  report.stage5InlineEditing = stage5Test;
  await client.captureScreenshot('pillar4_stage5_inline_editing.png');

  // ==========================================
  // PILLAR 5: MOBILE NAVIGATION & HISTORY RESILIENCE
  // ==========================================
  console.log('Pillar 5: Testing Mobile Navigation, Viewports & History...');

  // History popstate test
  const historyTest = await client.eval(`
    (() => {
      const historyStack = [];
      goToStep(1);
      historyStack.push({ step: 1, hash: window.location.hash });
      goToStep(2);
      historyStack.push({ step: 2, hash: window.location.hash });
      goToStep(3);
      historyStack.push({ step: 3, hash: window.location.hash });

      // Trigger popstate
      window.dispatchEvent(new PopStateEvent('popstate', { state: { stage: 2 } }));
      const stepAfterBack = appState.currentStep;

      window.dispatchEvent(new PopStateEvent('popstate', { state: { stage: 1 } }));
      const stepAfterBack2 = appState.currentStep;

      // Forward
      window.dispatchEvent(new PopStateEvent('popstate', { state: { stage: 5 } }));
      const stepAfterForward = appState.currentStep;

      return {
        historyStack,
        stepAfterBack,
        stepAfterBack2,
        stepAfterForward,
        customerDataPreserved: appState.customer.email.length > 0
      };
    })()
  `);
  report.historyAndMobile.historyNavigation = historyTest;

  // Viewports responsive audit
  const viewports = [
    { name: 'iPhone_SE_375x667', width: 375, height: 667, dsf: 2 },
    { name: 'iPhone_14_15_390x844', width: 390, height: 844, dsf: 3 },
    { name: 'Samsung_S22_412x915', width: 412, height: 915, dsf: 2.625 }
  ];

  report.historyAndMobile.viewports = {};

  for (const vp of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dsf,
      mobile: true
    });
    await wait(600);

    const vpAudit = await client.eval(`
      (() => {
        const docEl = document.documentElement;
        const innerW = window.innerWidth;
        const scrollW = docEl.scrollWidth;

        // Measure interactive elements
        function measure(sel) {
          return Array.from(document.querySelectorAll(sel))
            .filter(el => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0)
            .map(el => {
              const r = el.getBoundingClientRect();
              return {
                text: (el.innerText || el.getAttribute('aria-label') || el.id).trim().slice(0, 20),
                width: Math.round(r.width * 10) / 10,
                height: Math.round(r.height * 10) / 10,
                passed: r.width >= 43.5 && r.height >= 43.5
              };
            });
        }

        const goldBtns = measure('.btn-gold');
        const outlineBtns = measure('.btn-outline-gold');
        const counterBtns = measure('.counter-btn');

        // Check input font sizes
        const inputs = Array.from(document.querySelectorAll('#booking-stepper input, #booking-stepper select, #booking-stepper textarea'))
          .filter(el => el.type !== 'checkbox' && el.type !== 'radio')
          .map(el => ({
            id: el.id,
            fontSize: window.getComputedStyle(el).fontSize,
            meets16px: parseFloat(window.getComputedStyle(el).fontSize) >= 16
          }));

        return {
          innerWidth: innerW,
          scrollWidth: scrollW,
          hasHorizontalOverflow: scrollW > innerW,
          touchTargetsPassed: goldBtns.every(b => b.passed) && counterBtns.every(b => b.passed),
          allInputs16px: inputs.every(i => i.meets16px),
          inputsCount: inputs.length
        };
      })()
    `);

    report.historyAndMobile.viewports[vp.name] = vpAudit;
    await client.captureScreenshot(`viewport_${vp.name}.png`);
  }

  // ==========================================
  // PILLAR 6: BOOKING SAFETY & FAGG § 8
  // ==========================================
  console.log('Pillar 6: Testing Booking Safety & FAGG § 8 Submission...');
  // Reset window size for desktop
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false
  });
  await wait(500);

  const faggTest = await client.eval(`
    (() => {
      goToStep(5);
      const nextBtn = document.getElementById('btn-step-next');
      const buttonText = nextBtn ? nextBtn.innerText.trim() : '';

      // Check for credit card capture fields
      const ccInputs = document.querySelectorAll('input[name*="card"], input[name*="cvv"], input[name*="exp"], #stripe-elements, iframe[src*="stripe"]');

      return {
        step5ButtonText: buttonText,
        matchesExactCopy: buttonText.includes('Request Booking Confirmation') && buttonText.includes('Pay After Approval'),
        creditCardFieldsFound: ccInputs.length
      };
    })()
  `);
  report.faggSafetyAndBooking.buttonAndFieldsAudit = faggTest;

  // Execute Booking Submission
  const submissionTest = await client.eval(`
    (async () => {
      // Ensure customer data is valid
      document.getElementById('cust-name').value = 'Dr. Alexander von Salzburg';
      document.getElementById('cust-email').value = 'alexander.salzburg@luxury-travel.at';
      document.getElementById('cust-phone').value = '+436606416464';

      // Submit booking
      await submitBooking();

      // Check Stage 6 DOM
      const step6Pane = document.getElementById('step-pane-6');
      const isStep6Visible = step6Pane && !step6Pane.classList.contains('hidden');
      const ref = document.getElementById('conf-ref')?.innerText;
      const statusBanner = step6Pane ? step6Pane.querySelector('.rounded-full')?.innerText : '';

      return {
        step6Visible: isStep6Visible,
        bookingReference: ref,
        statusText: statusBanner,
        isPendingOwnerConfirmation: statusBanner.includes('PENDING OWNER CONFIRMATION')
      };
    })()
  `);
  report.faggSafetyAndBooking.submissionResult = submissionTest;
  await client.captureScreenshot('pillar6_booking_confirmation_stage6.png');

  const jsonReportPath = '/home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/browser_qa_multientry_results.json';
  fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));
  console.log(`Results successfully saved to ${jsonReportPath}`);

  client.close();
  chromeProcess.kill();
}

main().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
