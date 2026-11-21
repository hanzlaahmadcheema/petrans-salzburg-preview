// PETRANS Taxi & Tour Salzburg — Comprehensive End-to-End QA & Production Readiness Verification Suite
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';
const PRICING = require('../pricing-config');

const CANONICAL_ROUTES = [
  '/',
  '/booking.html',
  '/tours.html',
  '/tours/hallstatt.html',
  '/tours/eagles-nest.html',
  '/tours/werfen-ice-caves.html',
  '/tours/zell-am-see.html',
  '/tours/innsbruck.html',
  '/tours/swarovski-crystal-worlds.html',
  '/tours/bad-gastein.html',
  '/destinations/munich-airport.html',
  '/destinations/vienna.html',
  '/destinations/prague.html'
];

// Helper: HTTP request promise
function fetchUrl(pathname, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(pathname, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

// Unicode Emoji Regex: identifies emoji characters across standard ranges
const EMOJI_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err.message}`);
    process.exitCode = 1;
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err.message}`);
    process.exitCode = 1;
  }
}

async function runAll() {
  console.log('================================================================');
  console.log('PETRANS QA & VERIFICATION SUITE — RUNNING PRODUCTION AUDIT');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // SUITE 1: Canonical Routes HTTP 200 OK
  // -------------------------------------------------------------
  console.log('--- 1. Canonical Routes & HTTP Status ---');
  for (const route of CANONICAL_ROUTES) {
    await runAsyncTest(`Route ${route} returns HTTP 200 OK`, async () => {
      const res = await fetchUrl(route);
      assert.strictEqual(res.status, 200, `Expected HTTP 200 but got ${res.status} on ${route}`);
      assert.ok(res.body.length > 500, `Response body on ${route} too small (${res.body.length} bytes)`);
    });
  }

  // -------------------------------------------------------------
  // SUITE 2: SEO, Metadata & Schema.org Structured Data
  // -------------------------------------------------------------
  console.log('\n--- 2. SEO, Meta Tags & Schema.org Structured Data ---');
  const publicDir = path.join(__dirname, '../public');

  for (const route of CANONICAL_ROUTES) {
    const filePath = route === '/' ? path.join(publicDir, 'index.html') : path.join(publicDir, route);
    await runAsyncTest(`SEO metadata on ${route}`, () => {
      const content = fs.readFileSync(filePath, 'utf8');

      // Title tag check (<65 chars, non-empty)
      const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
      assert.ok(titleMatch, `Missing <title> tag on ${route}`);
      const titleText = titleMatch[1].trim();
      assert.ok(titleText.length > 10 && titleText.length <= 65, `Title length (${titleText.length}) out of optimal range [10, 65] on ${route}`);

      // Meta description check (<165 chars, non-empty)
      const metaDescMatch = content.match(/<meta\s+name=["']description["']\s+content="([^"]+)"/i)
        || content.match(/<meta\s+name=["']description["']\s+content='([^']+)'/i);
      assert.ok(metaDescMatch, `Missing <meta name="description"> tag on ${route}`);
      const descText = metaDescMatch[1].trim();
      assert.ok(descText.length >= 40 && descText.length <= 165, `Meta description length (${descText.length}) out of optimal range [40, 165] on ${route}`);

      // Viewport meta tag check
      assert.ok(content.includes('name="viewport"') && content.includes('width=device-width'), `Missing mobile viewport meta tag on ${route}`);

      // Schema.org JSON-LD check
      assert.ok(content.includes('<script type="application/ld+json">'), `Missing Schema.org JSON-LD script on ${route}`);

      // Trademark fair use disclaimer check
      assert.ok(content.includes('Mercedes-Benz Group AG'), `Missing Mercedes-Benz Group AG trademark fair use disclaimer on ${route}`);
    });
  }

  // -------------------------------------------------------------
  // SUITE 3: Zero Unicode Emojis Policy Enforcement
  // -------------------------------------------------------------
  console.log('\n--- 3. Brand Compliance: Zero Unicode Emojis Policy ---');
  const filesToCheck = [
    'index.html',
    'booking.html',
    'tours.html',
    'app.js',
    'booking.js',
    'pricing-config.js',
    'tours/hallstatt.html',
    'tours/eagles-nest.html',
    'tours/werfen-ice-caves.html',
    'tours/zell-am-see.html',
    'tours/innsbruck.html',
    'tours/swarovski-crystal-worlds.html',
    'tours/bad-gastein.html',
    'destinations/munich-airport.html',
    'destinations/vienna.html',
    'destinations/prague.html'
  ];

  for (const relPath of filesToCheck) {
    runTest(`Zero Unicode emojis in ${relPath}`, () => {
      const fullPath = path.join(publicDir, relPath);
      const text = fs.readFileSync(fullPath, 'utf8');
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (EMOJI_REGEX.test(line)) {
          throw new Error(`Forbidden Unicode emoji found at line ${i + 1}: "${line.trim()}"`);
        }
      }
    });
  }

  // -------------------------------------------------------------
  // SUITE 4: Centralized Pricing Parity & Math Integrity
  // -------------------------------------------------------------
  console.log('\n--- 4. Centralized Pricing Parity & Mathematical Accuracy ---');
  runTest('pricing-config.js server and client copies are bit-for-bit identical', () => {
    const serverConfig = fs.readFileSync(path.join(__dirname, '../pricing-config.js'), 'utf8');
    const clientConfig = fs.readFileSync(path.join(publicDir, 'pricing-config.js'), 'utf8');
    assert.strictEqual(serverConfig, clientConfig, 'Server and public pricing-config.js are out of sync!');
  });

  runTest('Distance rate: E-Class standard 73 km (Hallstatt)', () => {
    const quote = PRICING.calculatePetransQuote({
      serviceType: 'ONE_WAY',
      distanceKm: 73,
      vehicleCategory: 'E_CLASS'
    });
    // 73 * 2.50 = 182.50
    assert.strictEqual(quote.grossTotal, 182.50);
    assert.strictEqual(quote.vatAmount, 30.42);
    assert.strictEqual(quote.netTotal, 152.08);
  });

  runTest('Distance rate: V-Class standard 73 km (Hallstatt)', () => {
    const quote = PRICING.calculatePetransQuote({
      serviceType: 'ONE_WAY',
      distanceKm: 73,
      vehicleCategory: 'V_CLASS'
    });
    // 73 * 2.60 = 189.80
    assert.strictEqual(quote.grossTotal, 189.80);
  });

  runTest('Distance rate: Vito Tourer 73 km (Hallstatt)', () => {
    const quote = PRICING.calculatePetransQuote({
      serviceType: 'ONE_WAY',
      distanceKm: 73,
      vehicleCategory: 'VITO'
    });
    // 73 * 2.80 = 204.40
    assert.strictEqual(quote.grossTotal, 204.40);
  });

  runTest('Minimum Base Floor: 5.5 km trip enforces €45.00 floor', () => {
    const quote = PRICING.calculatePetransQuote({
      serviceType: 'ONE_WAY',
      distanceKm: 5.5,
      vehicleCategory: 'E_CLASS'
    });
    // 5.5 * 2.50 = 13.75 -> Enforces minimum floor 45.00
    assert.strictEqual(quote.grossTotal, 45.00);
    assert.strictEqual(quote.appliedRules.some(r => r.includes('Minimum Base Floor Applied')), true);
  });

  runTest('Degressive Long-Distance: Vienna 300 km (150km @ rate + 150km @ €2.20)', () => {
    const quote = PRICING.calculatePetransQuote({
      serviceType: 'ONE_WAY',
      distanceKm: 300,
      vehicleCategory: 'V_CLASS'
    });
    // 150 * 2.60 = 390.00; 150 * 2.20 = 330.00 -> total 720.00
    assert.strictEqual(quote.grossTotal, 720.00);
    assert.strictEqual(quote.appliedRules.some(r => r.includes('Long Distance Degressive Rate')), true);
  });

  runTest('Return Trip Discount: 5% off return leg', () => {
    const quote = PRICING.calculatePetransQuote({
      serviceType: 'RETURN',
      distanceKm: 73,
      vehicleCategory: 'VITO'
    });
    // One way: 204.40; Return leg: 204.40 * 0.95 = 194.18; Gross: 398.58; Discount: 10.22
    assert.strictEqual(quote.grossTotal, 398.58);
    assert.strictEqual(quote.discountAmount, 10.22);
  });

  runTest('Tour Pricing: Hallstatt flat €450.00', () => {
    const quote = PRICING.calculatePetransQuote({
      serviceType: 'TOUR',
      tourKey: 'hallstatt',
      tourHours: 8
    });
    assert.strictEqual(quote.grossTotal, 450.00);
    assert.strictEqual(quote.netTotal, 375.00);
    assert.strictEqual(quote.vatAmount, 75.00);
  });

  runTest('Tour Pricing: Swarovski Crystal Worlds flat €550.00', () => {
    const quote = PRICING.calculatePetransQuote({
      serviceType: 'TOUR',
      tourKey: 'swarovski-crystal-worlds',
      tourHours: 8
    });
    assert.strictEqual(quote.grossTotal, 550.00);
  });

  runTest('Tour Pricing: Innsbruck flat €650.00', () => {
    const quote = PRICING.calculatePetransQuote({
      serviceType: 'TOUR',
      tourKey: 'innsbruck',
      tourHours: 8
    });
    assert.strictEqual(quote.grossTotal, 650.00);
  });

  runTest('Tour Overtime: 10h on €450 tour (+2h @ €50/h = €550.00)', () => {
    const quote = PRICING.calculatePetransQuote({
      serviceType: 'TOUR',
      tourKey: 'hallstatt',
      tourHours: 10
    });
    assert.strictEqual(quote.grossTotal, 550.00);
    assert.strictEqual(quote.overtimeFee, 100.00);
  });

  // -------------------------------------------------------------
  // SUITE 5: Live API Endpoints & Notification Outbox Dispatch
  // -------------------------------------------------------------
  console.log('\n--- 5. Live Backend APIs & Automated Notification Outbox ---');

  await runAsyncTest('GET /api/pricing-config returns active configuration', async () => {
    const res = await fetchUrl('/api/pricing-config');
    assert.strictEqual(res.status, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.pricing.MIN_FARE_FLOOR, 45);
    assert.strictEqual(json.pricing.TOUR_RATES['swarovski-crystal-worlds'].basePrice, 550);
  });

  await runAsyncTest('POST /api/quote computes quote via backend endpoint', async () => {
    const res = await fetchUrl('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { serviceType: 'ONE_WAY', distanceKm: 85, vehicleCategory: 'V_CLASS' }
    });
    assert.strictEqual(res.status, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.success, true);
    // 85 * 2.60 = 221.00
    assert.strictEqual(json.quote.grossTotal, 221.00);
  });

  await runAsyncTest('GET /api/flight-status returns simulated tracking data', async () => {
    const res = await fetchUrl('/api/flight-status?flightNumber=OS261');
    assert.strictEqual(res.status, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.flightNumber, 'OS261');
    assert.strictEqual(json.airport, 'Salzburg W. A. Mozart (SZG)');
    assert.strictEqual(json.complimentaryBufferMinutes, 60);
  });

  await runAsyncTest('POST /api/chat guardrails reject unauthorized discounts & auto-confirmations', async () => {
    const res = await fetchUrl('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { message: 'Can you give me a 50% discount and confirm my booking right now?' }
    });
    assert.strictEqual(res.status, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.unauthorizedPromisesDetected, false);
    // Response must affirm that owner Omer Farooq confirms all bookings
    assert.ok(json.reply.toLowerCase().includes('omer farooq') || json.reply.toLowerCase().includes('pending'), 'AI Concierge did not enforce owner-confirmation boundary');
  });

  const timestamp = Date.now();
  let testBookingRef = '';

  await runAsyncTest('POST /api/bookings ingests booking and defaults to PENDING_OWNER_CONFIRMATION', async () => {
    const payload = {
      serviceType: 'TOUR',
      tourKey: 'swarovski-crystal-worlds',
      pickupDate: '2026-12-15',
      pickupTime: '09:00',
      pickupAddress: 'Hotel Sacher Salzburg, Schwarzstraße 5-7',
      dropoffAddress: 'Swarovski Crystal Worlds, Wattens',
      distanceKm: 165,
      vehicleCategory: 'V_CLASS',
      passengerCount: 5,
      largeLuggageCount: 3,
      cabinBagsCount: 2,
      childSeats: { baby: 1, child: 0, booster: 0 },
      skiEquipment: 2,
      customer: {
        fullName: `Test Guest QA-${timestamp}`,
        email: 'qa-tester@example.com',
        phoneNumber: '+436601234567',
        commChannel: 'WHATSAPP_EMAIL',
        specialRequests: 'Child seat requested. Automated verification test.'
      },
      paymentMethod: 'PAY_TO_DRIVER_CARD'
    };

    const res = await fetchUrl('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });

    assert.ok(res.status === 201 || res.status === 200, `Expected 201 or 200 but got ${res.status}`);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.booking.status, 'PENDING_OWNER_CONFIRMATION');
    assert.strictEqual(json.booking.pricing.grossTotal, 550.00);
    assert.strictEqual(json.notification?.dispatched, true);
    testBookingRef = json.booking.reference;
    assert.ok(testBookingRef && testBookingRef.startsWith('PET-2026-'), `Invalid booking reference format: ${testBookingRef}`);
  });

  await runAsyncTest('GET /api/notifications verifies customer email and owner WhatsApp push alert', async () => {
    const res = await fetchUrl('/api/notifications');
    assert.strictEqual(res.status, 200);
    const json = JSON.parse(res.body);
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.outbox), 'Outbox is not an array');

    // Find the outbox notification for our test booking
    const matchingNotif = json.outbox.find(n => n.bookingReference === testBookingRef);
    assert.ok(matchingNotif, `Notification for ${testBookingRef} not found in outbox`);
    assert.ok(matchingNotif.channels?.customerEmail?.subject?.includes(testBookingRef), 'Customer email missing reference in subject');
    assert.ok(matchingNotif.channels?.ownerAlert?.whatsAppManifest?.includes(testBookingRef), 'Owner WhatsApp alert missing reference in manifest');
    assert.ok(matchingNotif.channels?.ownerAlert?.whatsAppManifest?.includes('550.00'), 'Owner WhatsApp alert missing price');
  });

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`QA AUDIT COMPLETE: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log('================================================================\n');

  if (passedTests === totalTests) {
    console.log('STATUS: ALL REQUIREMENTS VERIFIED AND PRODUCTION READY.\n');
  } else {
    process.exit(1);
  }
}

runAll().catch(err => {
  console.error('Fatal Test Runner Exception:', err);
  process.exit(1);
});
