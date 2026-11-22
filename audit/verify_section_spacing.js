const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

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
    return (res.result && res.result.value !== undefined) ? res.result.value : res.value;
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
  const profileDir = `/tmp/chrome-spacing-qa-${Date.now()}`;
  const chromeProcess = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9223',
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
      const ver = await fetchJson('http://127.0.0.1:9223/json/version');
      if (ver) connected = true;
    } catch (e) {
      attempts++;
    }
  }

  const targets = await fetchJson('http://127.0.0.1:9223/json/list');
  const target = targets.find(t => t.type === 'page') || targets[0];
  const client = new CDPClient(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('DOM.enable');
  await client.send('Runtime.enable');
  await wait(2000);

  const viewports = [
    { name: 'Desktop (1280px)', w: 1280, h: 800, mobile: false },
    { name: 'Tablet (768px)', w: 768, h: 1024, mobile: false },
    { name: 'Mobile (375px)', w: 375, h: 667, mobile: true }
  ];

  const results = [];

  for (const vp of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 2,
      mobile: vp.mobile
    });
    await wait(400);

    const metrics = await client.eval(`
      (() => {
        const trustSection = document.querySelector('section.relative.z-20');
        const bookingSection = document.querySelector('section.bg-surface\\\\/40');
        const fleetSection = document.getElementById('fleet');

        const trustRect = trustSection ? trustSection.getBoundingClientRect() : null;
        const bookingRect = bookingSection ? bookingSection.getBoundingClientRect() : null;
        const fleetRect = fleetSection ? fleetSection.getBoundingClientRect() : null;

        const trustStyles = trustSection ? window.getComputedStyle(trustSection) : null;
        const bookingStyles = bookingSection ? window.getComputedStyle(bookingSection) : null;

        // Gap between bottom of trust section and top of booking banner
        const gapTrustToBooking = bookingRect && trustRect ? Math.round(bookingRect.top - trustRect.bottom) : null;
        // Gap between bottom of booking banner and top of fleet section
        const gapBookingToFleet = fleetRect && bookingRect ? Math.round(fleetRect.top - bookingRect.bottom) : null;

        return {
          trustMarginBottom: trustStyles ? trustStyles.marginBottom : null,
          bookingPaddingTop: bookingStyles ? bookingStyles.paddingTop : null,
          bookingPaddingBottom: bookingStyles ? bookingStyles.paddingBottom : null,
          gapTrustToBooking,
          gapBookingToFleet,
          collisionResolved: gapTrustToBooking >= 60
        };
      })()
    `);

    results.push({ viewport: vp.name, ...metrics });
    console.log(`[${vp.name}] Gap Trust->Booking: ${metrics.gapTrustToBooking}px (Margin-Bottom: ${metrics.trustMarginBottom}), Collision Resolved: ${metrics.collisionResolved}`);
  }

  // Capture screenshot of the resolved boundary
  const shotPath = '/home/hanzlaahmad/Projects/OmerFarooq/audit/screenshots/seamless_fleet/trust_strip_booking_banner_gap.png';
  await client.captureScreenshot(shotPath);
  console.log(`Captured screenshot: ${shotPath}`);

  client.close();
  chromeProcess.kill();

  fs.writeFileSync('/home/hanzlaahmad/Projects/OmerFarooq/audit/section_spacing_results.json', JSON.stringify(results, null, 2));
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
