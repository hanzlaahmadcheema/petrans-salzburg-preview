const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

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
      this.ws.on('message', (msg) => {
        const data = JSON.parse(msg);
        if (data.id && this.callbacks.has(data.id)) {
          const cb = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) cb.reject(new Error(data.error.message));
          else cb.resolve(data.result);
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
  async eval(expr) {
    const res = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) {
      console.error('Eval exception:', res.exceptionDetails);
    }
    return (res.result && res.result.value !== undefined) ? res.result.value : res.value;
  }
}

async function run() {
  const tmpDir = fs.mkdtempSync('/tmp/chrome-qa-');
  const chrome = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9333',
    '--user-data-dir=' + tmpDir,
    '--disable-extensions',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  const version = await fetchJson('http://localhost:9333/json/version');
  console.log('Chrome connected:', version.Browser);

  const pages = await fetchJson('http://localhost:9333/json/list');
  const targetPage = pages.find(p => p.type === 'page') || pages[0];
  const wsUrl = targetPage.webSocketDebuggerUrl;

  const client = new CDPClient(wsUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('DOM.enable');

  const viewports = [
    { name: 'desktop-1280', w: 1280, h: 800 },
    { name: 'desktop-1024', w: 1024, h: 768 },
    { name: 'tablet-768', w: 768, h: 1024 },
    { name: 'mobile-412', w: 412, h: 915 },
    { name: 'mobile-390', w: 390, h: 844 },
    { name: 'mobile-375', w: 375, h: 667 }
  ];

  await client.send('Page.navigate', { url: 'http://localhost:3000/' });
  await new Promise(r => setTimeout(r, 3000));

  const pageInfo = await client.eval(`({
    url: window.location.href,
    title: document.title,
    bodyLen: document.body ? document.body.innerHTML.length : 0,
    hasFleet: !!document.getElementById("fleet")
  })`);
  console.log('Page loaded info:', pageInfo);

  console.log('\n=== 1. VERIFY CARD REMOVAL ===');
  const cardChecks = await client.eval(`({
    hasStageContainer: !!document.querySelector(".fleet-stage-container"),
    hasSpecCard: !!document.querySelector("#fleet-spec-card"),
    fleetHasBorder: window.getComputedStyle(document.querySelector("#fleet")).borderWidth !== "0px",
    floorGlowExists: !!document.querySelector(".fleet-floor-glow"),
    peekWrapperExists: !!document.querySelector(".fleet-vehicle-peek-wrapper"),
    peekImgExists: !!document.querySelector(".fleet-peek-image")
  })`);
  console.log('Card checks:', JSON.stringify(cardChecks, null, 2));

  console.log('\n=== 2. VIEWPORT & OVERFLOW CHECKS ===');
  const overflowResults = [];
  for (const vp of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 1,
      mobile: vp.w < 1024
    });
    await new Promise(r => setTimeout(r, 400));

    const metrics = await client.eval(`({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      fleetScrollWidth: document.querySelector("#fleet").scrollWidth,
      fleetClientWidth: document.querySelector("#fleet").clientWidth
    })`);
    console.log(`[${vp.name}] viewport=${vp.w}px, clientWidth=${metrics.clientWidth}, scrollWidth=${metrics.scrollWidth}, hasOverflow=${metrics.hasOverflow}`);
    overflowResults.push({ viewport: vp.name, ...metrics });

    // Screenshot of fleet section
    const fleetBox = await client.eval(`(() => {
      const el = document.querySelector("#fleet");
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    })()`);

    if (fleetBox && fleetBox.height > 0) {
      const ss = await client.send('Page.captureScreenshot', {
        clip: { x: Math.max(0, fleetBox.x), y: Math.max(0, fleetBox.y), width: vp.w, height: Math.min(1000, fleetBox.height), scale: 1 }
      });
      const ssDir = '/home/hanzlaahmad/Projects/OmerFarooq/audit/screenshots/seamless_fleet';
      fs.mkdirSync(ssDir, { recursive: true });
      fs.writeFileSync(`${ssDir}/fleet_${vp.name}.png`, Buffer.from(ss.data, 'base64'));
    }
  }

  console.log('\n=== 3. CAROUSEL SWITCHING & INTERACTION CHECK ===');
  // Switch to V-Class (index 1)
  await client.eval('switchFleetVehicle(1)');
  await new Promise(r => setTimeout(r, 300));
  const vClassState = await client.eval(`({
    category: document.getElementById("carousel-category").textContent.trim(),
    name: document.getElementById("carousel-name").textContent.trim(),
    rate: document.getElementById("carousel-rate").textContent.trim(),
    floor: document.getElementById("carousel-floor").textContent.trim(),
    imgSrc: document.getElementById("fallback-img").getAttribute("src"),
    indicator: document.getElementById("carousel-indicator-text").textContent.trim(),
    pax: document.getElementById("carousel-pax").textContent.trim()
  })`);
  console.log('V-Class state:', JSON.stringify(vClassState, null, 2));

  // Switch to Vito (index 2)
  await client.eval('switchFleetVehicle(2)');
  await new Promise(r => setTimeout(r, 300));
  const vitoState = await client.eval(`({
    category: document.getElementById("carousel-category").textContent.trim(),
    name: document.getElementById("carousel-name").textContent.trim(),
    rate: document.getElementById("carousel-rate").textContent.trim(),
    floor: document.getElementById("carousel-floor").textContent.trim(),
    imgSrc: document.getElementById("fallback-img").getAttribute("src"),
    indicator: document.getElementById("carousel-indicator-text").textContent.trim(),
    pax: document.getElementById("carousel-pax").textContent.trim()
  })`);
  console.log('Vito state:', JSON.stringify(vitoState, null, 2));

  // Next chevron check
  await client.eval('nextFleetVehicle()');
  await new Promise(r => setTimeout(r, 300));
  const eClassBack = await client.eval(`({
    name: document.getElementById("carousel-name").textContent.trim(),
    imgSrc: document.getElementById("fallback-img").getAttribute("src")
  })`);
  console.log('Back to E-Class via next button:', JSON.stringify(eClassBack, null, 2));

  console.log('\n=== 4. TOUCH TARGETS VERIFICATION ===');
  const touchTargets = await client.eval(`(() => {
    const tabs = Array.from(document.querySelectorAll('#fleet .fleet-tab'));
    const chevrons = Array.from(document.querySelectorAll('#fleet .fleet-chevron-btn'));
    const cta = document.querySelector('#carousel-book-cta');
    const routesBtn = document.querySelector('#fleet a');
    const elements = [...tabs, ...chevrons, cta, routesBtn].filter(Boolean);

    return elements.map(el => {
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        text: el.textContent.trim().slice(0, 20),
        width: Math.round(r.width),
        height: Math.round(r.height),
        passes: r.width >= 43 && r.height >= 43
      };
    });
  })()`);
  console.log('Touch targets count:', touchTargets.length, 'All pass:', touchTargets.every(t => t.passes));

  chrome.kill();
  return { cardChecks, overflowResults, vClassState, vitoState, touchTargets };
}

run().then(res => {
  fs.writeFileSync('/home/hanzlaahmad/Projects/OmerFarooq/audit/seamless_fleet_qa_results.json', JSON.stringify(res, null, 2));
  console.log('\nQA Suite completed successfully. Results saved to audit/seamless_fleet_qa_results.json');
  process.exit(0);
}).catch(err => {
  console.error('QA Test failed:', err);
  process.exit(1);
});
