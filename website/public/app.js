// PETRANS Taxi & Tour Salzburg — Full Client Application Logic & Multi-Entry Booking Engine

// Known Route Distances (km)
const ROUTES_DB = {
  'hallstatt': { name: 'Hallstatt Lahn Terminal', distance: 73, duration: '1h 15m' },
  'zell-am-see': { name: 'Zell am See / Kaprun', distance: 85, duration: '1h 30m' },
  'munich-airport': { name: 'Munich Airport MUC', distance: 175, duration: '1h 50m' },
  'innsbruck': { name: 'Innsbruck Highlights', distance: 185, duration: '2h 00m' },
  'bad-gastein': { name: 'Bad Gastein Valley', distance: 100, duration: '1h 30m' },
  'eagles-nest': { name: 'Eagles Nest / Berchtesgaden', distance: 30, duration: '35m' },
  'saalbach': { name: 'Saalbach-Hinterglemm', distance: 92, duration: '1h 35m' },
  'vienna': { name: 'Vienna City Center / VIE', distance: 300, duration: '3h 15m' },
  'prague': { name: 'Prague Cross-Border', distance: 375, duration: '4h 15m' },
  'werfen-ice-caves': { name: 'Werfen Ice Caves & Fortress', distance: 50, duration: '45m' },
  'swarovski-crystal-worlds': { name: 'Swarovski Crystal Worlds (Wattens)', distance: 165, duration: '1h 55m' },
  'salzburg-old-town': { name: 'Salzburg City Center / Old Town', distance: 5.5, duration: '18m' }
};

const TOURS_DB = {
  'hallstatt': { title: 'Hallstatt & Salzkammergut Lakes (8 Hours)', price: 450.0, tier: 2 },
  'eagles-nest': { title: 'Eagles Nest & Berchtesgaden (6-8 Hours)', price: 450.0, tier: 1 },
  'werfen-ice-caves': { title: 'Werfen Ice Caves & Fortress (8 Hours)', price: 450.0, tier: 1 },
  'zell-am-see': { title: 'Zell am See & Kaprun Alpine Glacier (8 Hours)', price: 450.0, tier: 2 },
  'bad-gastein': { title: 'Bad Gastein Thermal & Waterfall (8 Hours)', price: 450.0, tier: 2 },
  'swarovski-crystal-worlds': { title: 'Swarovski Crystal Worlds & Hall in Tirol (8 Hours)', price: 550.0, tier: 2 },
  'innsbruck': { title: 'Innsbruck & Tyrolean Alps Highlights (8-9 Hours)', price: 650.0, tier: 3 }
};

const VEHICLE_META = {
  'E_CLASS': {
    name: 'Mercedes-Benz E-Class',
    subtitle: 'Executive Chauffeur Sedan',
    ratePerKm: 2.50,
    maxPax: 3,
    maxLuggage: 2,
    maxCabin: 2
  },
  'V_CLASS': {
    name: 'Mercedes-Benz V-Class',
    subtitle: 'VIP Chauffeur Minivan',
    ratePerKm: 2.60,
    maxPax: 8,
    maxLuggage: 8,
    maxCabin: 8
  },
  'VITO': {
    name: 'Mercedes-Benz Vito Tourer',
    subtitle: '4MATIC Winter Specialist',
    ratePerKm: 2.60,
    maxPax: 8,
    maxLuggage: 8,
    maxCabin: 8
  }
};

// Global Application State
const appState = {
  currentStep: 1,
  entrySource: 'direct', // fleet | tour | calc | direct
  serviceType: 'ONE_WAY', // ONE_WAY | RETURN | TOUR
  pickupAddress: 'Salzburg Airport W. A. Mozart (SZG)',
  dropoffAddress: 'Hallstatt Lahn Terminal',
  distanceKm: 73.0,
  durationText: '1h 15m',
  tourKey: 'hallstatt',
  tourHours: 8,
  intermediateStops: 0,
  pickupDate: '',
  pickupTime: '14:30',
  flightNumber: '',
  returnDate: '',
  returnTime: '10:00',
  vehicleCategory: 'V_CLASS', // E_CLASS | V_CLASS | VITO
  passengerCount: 4,
  largeLuggageCount: 4,
  cabinBagsCount: 2,
  childSeats: { baby: 0, child: 0, booster: 0 },
  skiEquipment: 0,
  wheelchair: false,
  hospitality: { water: 'STILL', temp: 'STANDARD' },
  customer: {
    fullName: '',
    email: '',
    phoneNumber: '',
    commChannel: 'WHATSAPP_EMAIL',
    language: 'en',
    isCompanyInvoice: false,
    companyName: '',
    taxNumber: '',
    billingStreet: '',
    specialRequests: ''
  },
  paymentMethod: 'PAY_TO_DRIVER_CARD',
  currentQuote: null
};

window.appState = appState;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initDateDefaults();
  parseUrlQueryParameters();
  restoreSessionState();
  setupEventListeners();
  initFleetCarousel();
  updateHeroCalculation();
  checkCapacityWarning();
  initScrollAnimations();
  initSpotlightCards();
});

// Default dates
function initDateDefaults() {
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('step1-date');
  if (dateInput && !dateInput.value) {
    dateInput.value = today;
    dateInput.min = today;
    appState.pickupDate = today;
  }
  const returnInput = document.getElementById('step1-return-date');
  if (returnInput && !returnInput.value) {
    returnInput.value = today;
    returnInput.min = today;
    appState.returnDate = today;
  }
}

// Session state hydration
function restoreSessionState() {
  try {
    const saved = sessionStorage.getItem('petrans_booking_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        // Merge safe fields
        if (parsed.vehicleCategory && VEHICLE_META[parsed.vehicleCategory]) {
          appState.vehicleCategory = parsed.vehicleCategory;
        }
        if (parsed.passengerCount) appState.passengerCount = parsed.passengerCount;
        if (parsed.largeLuggageCount !== undefined) appState.largeLuggageCount = parsed.largeLuggageCount;
        if (parsed.pickupAddress) appState.pickupAddress = parsed.pickupAddress;
        if (parsed.dropoffAddress) appState.dropoffAddress = parsed.dropoffAddress;
        if (parsed.distanceKm) appState.distanceKm = parsed.distanceKm;
        if (parsed.serviceType) appState.serviceType = parsed.serviceType;
      }
    }
  } catch (e) {
    console.warn('Session restoration skipped:', e);
  }
}

// Deep-linking Query Parameter Parser (Unified Multi-Entry Engine)
function parseUrlQueryParameters() {
  const params = new URLSearchParams(window.location.search);
  let preselectedNote = '';

  // 1. Vehicle param (?vehicle=E_CLASS | V_CLASS | VITO or e-class | v-class)
  const vehParam = params.get('vehicle');
  if (vehParam) {
    const key = vehParam.toUpperCase().replace('-', '_');
    if (VEHICLE_META[key]) {
      appState.vehicleCategory = key;
      appState.entrySource = params.get('entry') || 'fleet';
      const meta = VEHICLE_META[key];
      preselectedNote = `Vehicle Pre-selected: ${meta.name}. You can change this at any time.`;
    }
  }

  // 2. Service param (?service=ONE_WAY | RETURN | TOUR or one-way | return | tour)
  const serviceParam = params.get('service');
  if (serviceParam) {
    const sKey = serviceParam.toUpperCase().replace('-', '_');
    if (['ONE_WAY', 'RETURN', 'TOUR'].includes(sKey)) {
      appState.serviceType = sKey;
    }
  }

  // 3. Tour param (?tour=hallstatt | eagles-nest | ...)
  const tourParam = params.get('tour');
  if (tourParam && TOURS_DB[tourParam.toLowerCase()]) {
    appState.serviceType = 'TOUR';
    appState.tourKey = tourParam.toLowerCase();
    appState.entrySource = params.get('entry') || 'tour';
    const tour = TOURS_DB[appState.tourKey];
    preselectedNote = `Tour Pre-selected: ${tour.title} (€${tour.price.toFixed(2)}). You can customize your schedule or change services at any time.`;
  }

  // 4. Route params (?origin=... &dest=... or ?pickup=... &dropoff=...)
  const pickupParam = params.get('origin') || params.get('pickup');
  if (pickupParam) {
    appState.pickupAddress = decodeURIComponent(pickupParam);
    const pickupEl = document.getElementById('step1-pickup');
    if (pickupEl) pickupEl.value = appState.pickupAddress;
  }

  const dropoffParam = params.get('dest') || params.get('dropoff');
  if (dropoffParam) {
    const rawDest = decodeURIComponent(dropoffParam);
    const route = ROUTES_DB[rawDest.toLowerCase()] || { name: rawDest, distance: 73, duration: '1h 15m' };
    appState.dropoffAddress = route.name;
    appState.distanceKm = route.distance;
    appState.durationText = route.duration;
    const dropoffEl = document.getElementById('step1-dropoff');
    if (dropoffEl) dropoffEl.value = route.name;
  }

  // 5. Party size (?pax=... &bags=...)
  const paxParam = parseInt(params.get('pax'));
  if (!isNaN(paxParam) && paxParam >= 1 && paxParam <= 8) {
    appState.passengerCount = paxParam;
  }
  const bagsParam = parseInt(params.get('bags'));
  if (!isNaN(bagsParam) && bagsParam >= 0 && bagsParam <= 8) {
    appState.largeLuggageCount = bagsParam;
  }

  // Show affirmative banner if pre-populated
  if (preselectedNote) {
    showPreselectionBanner(preselectedNote);
  }
}

function showPreselectionBanner(text) {
  const banner = document.getElementById('preselection-banner');
  const bannerText = document.getElementById('preselection-banner-text');
  if (banner && bannerText) {
    bannerText.textContent = text;
    banner.classList.remove('hidden');
  }
}

function dismissPreselectionBanner() {
  const banner = document.getElementById('preselection-banner');
  if (banner) banner.classList.add('hidden');
}

// ============================================================
// PETRANS INTERACTIVE VEHICLE SPOTLIGHT CAROUSEL CONTROLLER
// ============================================================
const FLEET_VEHICLES = [
  {
    category: 'E_CLASS',
    slug: 'e-class',
    badge: 'Executive Chauffeur Sedan',
    name: 'Mercedes-Benz E-Class',
    subtitle: 'Obsidian Black Metallic • W214 Series',
    ratePerKm: 2.50,
    baseFloor: 45.00,
    pax: 'Max 3 Passengers',
    luggage: '2 Large + 2 Cabin Bags',
    amenity3: { icon: 'lucide:shield-check', text: 'Free Child Seats' },
    amenity4: { icon: 'lucide:snowflake', text: 'Free Ski Equipment', sky: true },
    amenity5: { icon: 'lucide:wifi', text: 'High-Speed Wi-Fi' },
    amenity6: { icon: 'lucide:coffee', text: 'Bottled Water' },
    poster: '/images/mercedes-e-class-peek.webp',
    pngFallback: '/images/mercedes-e-class-peek.png',
    indicator: '01 / 03 • Mercedes-Benz E-Class Sedan'
  },
  {
    category: 'V_CLASS',
    slug: 'v-class',
    badge: 'Exclusive VIP Chauffeur',
    name: 'Mercedes-Benz V-Class',
    subtitle: 'Obsidian Black Metallic • W447 Exclusive',
    ratePerKm: 2.60,
    baseFloor: 45.00,
    pax: 'Max 8 Passengers',
    luggage: '8 Large Suitcases',
    amenity3: { icon: 'lucide:shield-check', text: 'Free Child Seats' },
    amenity4: { icon: 'lucide:snowflake', text: 'Free Ski Equipment', sky: true },
    amenity5: { icon: 'lucide:wifi', text: 'High-Speed Wi-Fi' },
    amenity6: { icon: 'lucide:coffee', text: 'Bottled Water' },
    poster: '/images/mercedes-v-class-peek.webp',
    pngFallback: '/images/mercedes-v-class-peek.png',
    indicator: '02 / 03 • Mercedes-Benz V-Class VIP'
  },
  {
    category: 'VITO',
    slug: 'vito',
    badge: 'Alpine 4MATIC Specialist',
    name: 'Mercedes-Benz Vito Tourer',
    subtitle: 'Obsidian Black Metallic • 4MATIC All-Wheel',
    ratePerKm: 2.60,
    baseFloor: 45.00,
    pax: 'Max 8 Passengers',
    luggage: '8 Large Suitcases',
    amenity3: { icon: 'lucide:mountain', text: '4MATIC All-Wheel' },
    amenity4: { icon: 'lucide:snowflake', text: 'Free Ski Equipment', sky: true },
    amenity5: { icon: 'lucide:zap', text: 'USB Fast Power' },
    amenity6: { icon: 'lucide:users', text: 'Group Expedition' },
    poster: '/images/mercedes-vito-peek.webp',
    pngFallback: '/images/mercedes-vito-peek.png',
    indicator: '03 / 03 • Mercedes-Benz Vito Tourer 4MATIC'
  }
];

let fleetActiveIndex = 0;
let hasInteractedWithStage = false;
window.fleetActiveIndex = 0;

function initFleetCarousel() {
  const params = new URLSearchParams(window.location.search);
  const vehParam = params.get('vehicle');
  if (vehParam) {
    const key = vehParam.toUpperCase().replace('-', '_');
    const idx = FLEET_VEHICLES.findIndex(v => v.category === key);
    if (idx !== -1) fleetActiveIndex = idx;
  } else {
    fleetActiveIndex = 0;
  }
  window.fleetActiveIndex = fleetActiveIndex;

  const stage = document.getElementById('fleet-stage');

  if (stage) {
    // Touch gesture navigation (horizontal swipe)
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    stage.addEventListener('touchstart', (e) => {
      if (!e.touches || e.touches.length === 0) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      const duration = Date.now() - touchStartTime;

      // Preserve natural vertical scrolling if vertical displacement dominates
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;

      // Swipe detection: displacement > 50px
      if (Math.abs(deltaX) > 50 && (duration < 400 || Math.abs(deltaX) > 120)) {
        if (deltaX < 0) {
          nextFleetVehicle();
        } else {
          prevFleetVehicle();
        }
      }
    }, { passive: true });

    // Keyboard navigation
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevFleetVehicle();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextFleetVehicle();
      }
    });
  }

  renderFleetCarousel();
}

function switchFleetVehicle(index) {
  fleetActiveIndex = (index + FLEET_VEHICLES.length) % FLEET_VEHICLES.length;
  window.fleetActiveIndex = fleetActiveIndex;
  renderFleetCarousel();
}

function nextFleetVehicle() {
  switchFleetVehicle(fleetActiveIndex + 1);
}

function prevFleetVehicle() {
  switchFleetVehicle(fleetActiveIndex - 1);
}

window.switchFleetVehicle = switchFleetVehicle;
window.nextFleetVehicle = nextFleetVehicle;
window.prevFleetVehicle = prevFleetVehicle;

function renderFleetCarousel() {
  const v = FLEET_VEHICLES[fleetActiveIndex];
  if (!v) return;

  // 1. Update Tabs
  document.querySelectorAll('.fleet-tab').forEach((tab, idx) => {
    const isSelected = idx === fleetActiveIndex;
    tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    if (isSelected) {
      tab.classList.add('active');
      tab.classList.remove('text-slate-300');
    } else {
      tab.classList.remove('active');
      tab.classList.add('text-slate-300');
    }
  });

  // 2. Animate Vehicle Visual Transition (Automotive glide)
  const peekImg = document.getElementById('fallback-img');
  if (peekImg) {
    peekImg.classList.remove('fleet-glide-in');
    peekImg.classList.add('fleet-glide-out');

    setTimeout(() => {
      peekImg.src = v.poster;
      peekImg.alt = v.name;
      peekImg.classList.remove('fleet-glide-out');
      peekImg.classList.add('fleet-glide-in');
    }, 180);
  }

  // 3. Update Indicator Text
  const indText = document.getElementById('carousel-indicator-text');
  if (indText) {
    indText.textContent = v.indicator;
  }

  // 4. Update Vehicle Metadata & Typography
  const catEl = document.getElementById('carousel-category');
  if (catEl) catEl.textContent = v.badge;

  const nameEl = document.getElementById('carousel-name');
  if (nameEl) nameEl.textContent = v.name;

  const subEl = document.getElementById('carousel-subtitle');
  if (subEl) subEl.textContent = v.subtitle;

  const rateEl = document.getElementById('carousel-rate');
  if (rateEl) rateEl.textContent = 'Fixed Fare';

  const floorEl = document.getElementById('carousel-floor');
  if (floorEl) floorEl.textContent = `Mandatory Base Floor: €${v.baseFloor.toFixed(2)}`;

  // 5. Update Amenities
  const paxEl = document.getElementById('carousel-pax');
  if (paxEl) paxEl.textContent = v.pax;

  const lugEl = document.getElementById('carousel-luggage');
  if (lugEl) lugEl.textContent = v.luggage;

  const a3Icon = document.getElementById('carousel-amenity-3-icon');
  const a3Text = document.getElementById('carousel-amenity-3-text');
  if (a3Icon && v.amenity3) a3Icon.setAttribute('icon', v.amenity3.icon);
  if (a3Text && v.amenity3) a3Text.textContent = v.amenity3.text;

  const a4Icon = document.getElementById('carousel-amenity-4-icon');
  const a4Text = document.getElementById('carousel-amenity-4-text');
  if (a4Icon && v.amenity4) a4Icon.setAttribute('icon', v.amenity4.icon);
  if (a4Text && v.amenity4) a4Text.textContent = v.amenity4.text;

  const a5Icon = document.getElementById('carousel-amenity-5-icon');
  const a5Text = document.getElementById('carousel-amenity-5-text');
  if (a5Icon && v.amenity5) a5Icon.setAttribute('icon', v.amenity5.icon);
  if (a5Text && v.amenity5) a5Text.textContent = v.amenity5.text;

  const a6Icon = document.getElementById('carousel-amenity-6-icon');
  const a6Text = document.getElementById('carousel-amenity-6-text');
  if (a6Icon && v.amenity6) a6Icon.setAttribute('icon', v.amenity6.icon);
  if (a6Text && v.amenity6) a6Text.textContent = v.amenity6.text;

  // 6. Update CTA Button Deep Link
  const bookCta = document.getElementById('carousel-book-cta');
  if (bookCta && bookCta.tagName.toLowerCase() === 'a') {
    bookCta.href = `/booking.html?vehicle=${v.slug}`;
  }
}

function bookCurrentFleetVehicle() {
  const v = FLEET_VEHICLES[fleetActiveIndex];
  if (v) {
    window.location.href = `/booking.html?vehicle=${v.slug}`;
  }
}

// Multi-Entry Point Trigger 1: Book by Car (Homepage Fleet Cards)
function selectFleetVehicle(category) {
  if (!VEHICLE_META[category]) return;
  const slug = category.toLowerCase().replace('_', '-');
  window.location.href = `/booking.html?vehicle=${slug}`;
}

// Multi-Entry Point Trigger 2: Book by Tour (Homepage Tour Cards)
function selectTour(tourKey) {
  window.location.href = `/booking.html?service=tour&tour=${tourKey}`;
}

// Multi-Entry Point Trigger 3: Book by Place (Hero Calculator Submit)
function selectHeroBooking() {
  window.location.href = '/booking.html';
}

// Event Listeners setup
function setupEventListeners() {
  // Mobile Navigation Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerBackdrop = document.getElementById('mobile-drawer-backdrop');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (mobileDrawerBackdrop) mobileDrawerBackdrop.classList.add('open');
    if (menuIconOpen) menuIconOpen.classList.add('hidden');
    if (menuIconClose) menuIconClose.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (mobileDrawerBackdrop) mobileDrawerBackdrop.classList.remove('open');
    if (menuIconOpen) menuIconOpen.classList.remove('hidden');
    if (menuIconClose) menuIconClose.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer && mobileDrawer.classList.contains('open');
      if (isOpen) closeDrawer();
      else openDrawer();
    });
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (mobileDrawerBackdrop) mobileDrawerBackdrop.addEventListener('click', closeDrawer);
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Sync Desktop & Mobile Language Selectors
  const langSelect = document.getElementById('lang-select');
  const mobileLangSelect = document.getElementById('mobile-lang-select');
  if (langSelect && mobileLangSelect) {
    langSelect.addEventListener('change', () => {
      mobileLangSelect.value = langSelect.value;
    });
    mobileLangSelect.addEventListener('change', () => {
      langSelect.value = mobileLangSelect.value;
    });
  }

  // 3-Option Quick Booking Module (Homepage Hero)
  let quickSelectedCar = 'v-class';
  const quickTabs = document.querySelectorAll('.quick-tab');
  quickTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      quickTabs.forEach(t => {
        t.classList.remove('active', 'bg-gold', 'text-midnight');
        t.classList.add('text-slate-300');
      });
      tab.classList.add('active', 'bg-gold', 'text-midnight');
      tab.classList.remove('text-slate-300');

      const mode = tab.getAttribute('data-mode');
      document.querySelectorAll('.quick-panel').forEach(p => p.classList.add('hidden'));
      const activePanel = document.getElementById(`mode-${mode}`);
      if (activePanel) activePanel.classList.remove('hidden');
    });
  });

  // Mode 1: Place / Transfer Calculator
  const heroPlaceDest = document.getElementById('hero-place-dest');
  const heroPlaceVehicle = document.getElementById('hero-place-vehicle');
  const heroPlacePrice = document.getElementById('hero-place-price');
  const heroPlaceMetrics = document.getElementById('hero-place-metrics');
  const btnHeroPlaceBook = document.getElementById('btn-hero-place-book');
  const btnAddHeroStop = document.getElementById('btn-add-hero-stop');
  const heroStopRow = document.getElementById('hero-stop-row');
  const heroStopInput = document.getElementById('hero-stop-input');
  const btnRemoveHeroStop = document.getElementById('btn-remove-hero-stop');
  let heroStopsCount = 0;

  if (btnAddHeroStop && heroStopRow) {
    btnAddHeroStop.addEventListener('click', () => {
      heroStopsCount = 1;
      heroStopRow.classList.remove('hidden');
      btnAddHeroStop.classList.add('hidden');
      updateHeroPlaceCalc();
    });
  }

  if (btnRemoveHeroStop && heroStopRow && btnAddHeroStop) {
    btnRemoveHeroStop.addEventListener('click', () => {
      heroStopsCount = 0;
      heroStopRow.classList.add('hidden');
      if (heroStopInput) heroStopInput.value = '';
      btnAddHeroStop.classList.remove('hidden');
      updateHeroPlaceCalc();
    });
  }

  function updateHeroPlaceCalc() {
    if (!heroPlaceDest || !heroPlaceVehicle || !heroPlacePrice) return;
    const opt = heroPlaceDest.selectedOptions[0];
    const km = parseFloat(opt?.getAttribute('data-km') || '73');
    const vehVal = heroPlaceVehicle.value || 'v-class';
    const vehKey = vehVal.toUpperCase().replace('-', '_');
    const destName = opt?.getAttribute('data-name') || '';

    // Route Specials and Centralized Pricing
    if (destName.includes('Prague') && heroStopsCount === 0) {
      heroPlacePrice.textContent = '€650.00';
    } else if (destName.includes('Munich Airport') && heroStopsCount === 0) {
      heroPlacePrice.textContent = '€490.00';
    } else if (typeof window.calculatePetransQuote === 'function') {
      const quote = window.calculatePetransQuote({
        serviceType: 'ONE_WAY',
        distanceKm: km,
        intermediateStopsCount: heroStopsCount,
        vehicleCategory: vehKey
      });
      heroPlacePrice.textContent = `€${quote.grossTotal.toFixed(2)}`;
    } else {
      const vehOpt = heroPlaceVehicle.selectedOptions[0];
      const rate = parseFloat(vehOpt?.getAttribute('data-rate') || '2.60');
      const fare = Math.max(45, (km * rate) + (heroStopsCount * 20));
      heroPlacePrice.textContent = `€${fare.toFixed(2)}`;
    }

    if (heroPlaceMetrics) {
      const approxHours = Math.floor(km / 65);
      const approxMins = Math.round((km % 65) * 60 / 65);
      const timeStr = approxHours > 0 ? `~${approxHours}h ${approxMins}m` : `~${approxMins}m`;
      const stopsText = heroStopsCount > 0 ? ` • +${heroStopsCount} Stop` : '';
      heroPlaceMetrics.textContent = `${km} km • ${timeStr}${stopsText}`;
    }
  }

  if (heroPlaceDest) heroPlaceDest.addEventListener('change', updateHeroPlaceCalc);
  if (heroPlaceVehicle) heroPlaceVehicle.addEventListener('change', updateHeroPlaceCalc);
  updateHeroPlaceCalc();

  if (btnHeroPlaceBook) {
    btnHeroPlaceBook.addEventListener('click', () => {
      const pickup = document.getElementById('hero-place-pickup')?.value || 'Salzburg';
      const destOpt = heroPlaceDest?.selectedOptions[0];
      const dest = destOpt?.getAttribute('data-name') || destOpt?.value || 'Hallstatt';
      const veh = heroPlaceVehicle?.value || 'v-class';
      const stopsQuery = heroStopsCount > 0 ? `&stops=${heroStopsCount}` : '';
      window.location.href = `/booking.html?service=one-way&pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dest)}&vehicle=${veh}${stopsQuery}`;
    });
  }

  // Mode 2: Hourly Chauffeur (As-Directed)
  const heroHourlyDuration = document.getElementById('hero-hourly-duration');
  const heroHourlyVehicle = document.getElementById('hero-hourly-vehicle');
  const heroHourlyPrice = document.getElementById('hero-hourly-price');
  const heroHourlyMetrics = document.getElementById('hero-hourly-metrics');
  const btnHeroHourlyBook = document.getElementById('btn-hero-hourly-book');

  function updateHeroHourlyCalc() {
    if (!heroHourlyDuration || !heroHourlyPrice) return;
    const hours = parseInt(heroHourlyDuration.value) || 4;
    const veh = heroHourlyVehicle ? heroHourlyVehicle.value : 'v-class';
    const vehKey = veh.toUpperCase().replace('-', '_');
    const quote = typeof window.calculatePetransQuote === 'function' ? window.calculatePetransQuote({
      serviceType: 'HOURLY',
      hourlyHours: hours,
      vehicleCategory: vehKey
    }) : { grossTotal: hours * 85.0 };

    heroHourlyPrice.textContent = `€${quote.grossTotal.toFixed(2)}`;
    if (heroHourlyMetrics) {
      heroHourlyMetrics.textContent = `${hours} Hours • ${hours * 25} km fuel & highway tolls included`;
    }
  }

  if (heroHourlyDuration) heroHourlyDuration.addEventListener('change', updateHeroHourlyCalc);
  if (heroHourlyVehicle) heroHourlyVehicle.addEventListener('change', updateHeroHourlyCalc);
  updateHeroHourlyCalc();

  if (btnHeroHourlyBook) {
    btnHeroHourlyBook.addEventListener('click', () => {
      const pickup = document.getElementById('hero-hourly-pickup')?.value || 'Salzburg City Center';
      const hours = heroHourlyDuration?.value || '4';
      const veh = heroHourlyVehicle?.value || 'v-class';
      window.location.href = `/booking.html?service=hourly&hours=${hours}&pickup=${encodeURIComponent(pickup)}&vehicle=${veh}`;
    });
  }

  // Mode 3: Tour Selector
  const heroTourSelect = document.getElementById('hero-tour-select');
  const heroTourPrice = document.getElementById('hero-tour-price');
  const heroTourDetailsLink = document.getElementById('hero-tour-details-link');
  const btnHeroTourBook = document.getElementById('btn-hero-tour-book');

  if (heroTourSelect) {
    heroTourSelect.addEventListener('change', () => {
      const val = heroTourSelect.value;
      const tourPrice = window.PETRANS_PRICING?.TOUR_RATES[val]?.basePrice 
        || (val === 'innsbruck' ? 650.0 : (val === 'swarovski-crystal-worlds' ? 550.0 : 450.0));
      if (heroTourPrice) heroTourPrice.textContent = `€${tourPrice.toFixed(2)}`;
      if (heroTourDetailsLink) {
        heroTourDetailsLink.href = `/tours/${val}.html`;
      }
    });
  }

  if (btnHeroTourBook) {
    btnHeroTourBook.addEventListener('click', () => {
      const tourVal = heroTourSelect?.value || 'hallstatt';
      window.location.href = `/booking.html?service=tour&tour=${tourVal}`;
    });
  }

  // Mode 4: Car Selector Cards
  const carCards = document.querySelectorAll('.car-quick-card');
  carCards.forEach(c => {
    c.addEventListener('click', () => {
      carCards.forEach(card => card.classList.remove('active'));
      c.classList.add('active');
      quickSelectedCar = c.getAttribute('data-vehicle') || 'v-class';
    });
  });

  const btnHeroCarBook = document.getElementById('btn-hero-car-book');
  if (btnHeroCarBook) {
    btnHeroCarBook.addEventListener('click', () => {
      window.location.href = `/booking.html?vehicle=${quickSelectedCar}`;
    });
  }

  // Interactive FAQ Accordion Trigger
  document.querySelectorAll('.faq-item').forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(other => other.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });

  // Hero Book CTA
  const heroBookBtn = document.getElementById('btn-hero-book');
  if (heroBookBtn) {
    heroBookBtn.addEventListener('click', selectHeroBooking);
  }

  // Stepper Service Type Buttons (Stage 1)
  document.querySelectorAll('.service-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.service-opt-btn').forEach(b => {
        b.classList.remove('active', 'border-gold', 'bg-gold/15', 'text-gold');
        b.classList.add('border-slate-700', 'bg-midnight', 'text-slate-300');
      });
      btn.classList.add('active', 'border-gold', 'bg-gold/15', 'text-gold');
      btn.classList.remove('border-slate-700', 'bg-midnight', 'text-slate-300');

      const val = btn.getAttribute('data-val');
      appState.serviceType = val;

      const transferFields = document.getElementById('step1-transfer-fields');
      const tourFields = document.getElementById('step1-tour-fields');
      const returnBox = document.getElementById('step1-return-box');

      if (val === 'TOUR') {
        if (transferFields) transferFields.classList.add('hidden');
        if (tourFields) tourFields.classList.remove('hidden');
        if (returnBox) returnBox.classList.add('hidden');
      } else {
        if (transferFields) transferFields.classList.remove('hidden');
        if (tourFields) tourFields.classList.add('hidden');
        if (returnBox) {
          if (val === 'RETURN') returnBox.classList.remove('hidden');
          else returnBox.classList.add('hidden');
        }
      }

      updateHeroCalculation();
    });
  });

  // Tour Select in Stage 1
  const step1TourSelect = document.getElementById('step1-tour-select');
  if (step1TourSelect) {
    step1TourSelect.addEventListener('change', (e) => {
      appState.tourKey = e.target.value;
      updateHeroCalculation();
    });
  }

  // Vehicle Selection Cards in Stage 2
  document.querySelectorAll('.vehicle-card').forEach(card => {
    card.addEventListener('click', () => {
      const veh = card.getAttribute('data-veh');
      appState.vehicleCategory = veh;
      syncVehicleCardSelection();
      checkCapacityWarning();
      updateHeroCalculation();
    });
  });

  // Hospitality Options in Stage 3
  document.querySelectorAll('.water-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.water-opt-btn').forEach(b => {
        b.classList.remove('active', 'border-gold', 'bg-gold/15', 'text-gold');
        b.classList.add('border-slate-700', 'bg-midnight', 'text-slate-300');
      });
      btn.classList.add('active', 'border-gold', 'bg-gold/15', 'text-gold');
      btn.classList.remove('border-slate-700', 'bg-midnight', 'text-slate-300');
      appState.hospitality.water = btn.getAttribute('data-water');
    });
  });

  document.querySelectorAll('.temp-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.temp-opt-btn').forEach(b => {
        b.classList.remove('active', 'border-gold', 'bg-gold/15', 'text-gold');
        b.classList.add('border-slate-700', 'bg-midnight', 'text-slate-300');
      });
      btn.classList.add('active', 'border-gold', 'bg-gold/15', 'text-gold');
      btn.classList.remove('border-slate-700', 'bg-midnight', 'text-slate-300');
      appState.hospitality.temp = btn.getAttribute('data-temp');
    });
  });

  // Payment Preference Cards
  document.querySelectorAll('.payment-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.payment-card').forEach(c => {
        c.classList.remove('active', 'border-gold', 'bg-gold/10');
        c.classList.add('border-slate-700', 'bg-midnight');
      });
      card.classList.add('active', 'border-gold', 'bg-gold/10');
      card.classList.remove('border-slate-700', 'bg-midnight');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        appState.paymentMethod = radio.value;
      }
    });
  });

  // Next and Prev Step Buttons
  const nextBtn = document.getElementById('btn-step-next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (appState.currentStep === 5) {
        submitBooking();
      } else {
        goToStep(appState.currentStep + 1);
      }
    });
  }

  const prevBtn = document.getElementById('btn-step-prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToStep(appState.currentStep - 1);
    });
  }

  // Browser History & Popstate synchronization
  window.addEventListener('popstate', (e) => {
    if (e.state && typeof e.state.stage === 'number') {
      goToStep(e.state.stage, false);
    }
  });

  // AI Chat Toggle & Close
  const chatToggle = document.getElementById('ai-chat-toggle');
  const chatWindow = document.getElementById('ai-chat-window');
  const chatClose = document.getElementById('ai-chat-close');

  if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => chatWindow.classList.toggle('hidden'));
  }
  if (chatClose && chatWindow) {
    chatClose.addEventListener('click', () => chatWindow.classList.add('hidden'));
  }

  const chatSend = document.getElementById('ai-chat-send');
  const chatInput = document.getElementById('ai-chat-input');
  if (chatSend && chatInput) {
    chatSend.addEventListener('click', () => sendAiMessage());
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendAiMessage();
    });
  }
}

// Pricing Formula Calculation (Calibrated 3-Tier Fleet Engine)
function calculateClientPrice(serviceType, distanceKm, stopsCount, vehicleCategory, tourKey, tourHours) {
  const MIN_FARE = 45.0; // Mandatory base floor
  const VEHICLE_RATES = {
    'E_CLASS': 2.50, // Mercedes E-Class Sedan
    'V_CLASS': 2.60, // Mercedes V-Class VIP Van
    'VITO':    2.60  // Mercedes Vito Tourer 4MATIC
  };

  const ratePerKm = VEHICLE_RATES[vehicleCategory] || 2.60;
  let baseFare = 0;
  let stopsFee = (stopsCount || 0) * 20.0;
  let overtimeFee = 0;
  let discountAmount = 0;
  let grossTotal = 0;

  if (serviceType === 'TOUR') {
    const tour = TOURS_DB[tourKey] || TOURS_DB['hallstatt'];
    baseFare = tour.price;
    if (tourHours > 8) {
      overtimeFee = (tourHours - 8) * 50.0;
    }
    grossTotal = baseFare + overtimeFee;
  } else {
    // Point-to-Point Distance Calculation
    const raw = distanceKm * ratePerKm;
    if (raw < MIN_FARE) {
      baseFare = MIN_FARE;
    } else if (distanceKm > 150) {
      // Degressive rate for long-distance (>150km @ €2.20/km)
      baseFare = (150 * ratePerKm) + ((distanceKm - 150) * 2.20);
    } else {
      baseFare = raw;
    }

    const oneWay = baseFare + stopsFee;

    if (serviceType === 'RETURN') {
      const returnLeg = oneWay * 0.95; // 5% return discount
      discountAmount = oneWay - returnLeg;
      grossTotal = oneWay + returnLeg;
    } else {
      grossTotal = oneWay;
    }
  }

  grossTotal = Math.round(grossTotal * 100) / 100;
  const netTotal = Math.round((grossTotal / 1.20) * 100) / 100;
  const vatAmount = Math.round((grossTotal - netTotal) * 100) / 100;

  return {
    grossTotal,
    netTotal,
    vatAmount,
    baseFare: Math.round(baseFare * 100) / 100,
    stopsFee,
    overtimeFee,
    discountAmount: Math.round(discountAmount * 100) / 100,
    ratePerKm
  };
}

// Update Hero Calculator display
function updateHeroCalculation() {
  const quote = calculateClientPrice(
    appState.serviceType,
    appState.distanceKm,
    appState.intermediateStops,
    appState.vehicleCategory,
    appState.tourKey,
    appState.tourHours
  );

  const priceEl = document.getElementById('calc-price-display');
  const vatEl = document.getElementById('calc-vat-display');
  const statEl = document.getElementById('calc-stat-distance');

  if (priceEl) priceEl.textContent = `€${quote.grossTotal.toFixed(2)}`;
  if (vatEl) vatEl.textContent = `Net: €${quote.netTotal.toFixed(2)} | 20% VAT: €${quote.vatAmount.toFixed(2)}`;
  if (statEl) {
    if (appState.serviceType === 'TOUR') {
      statEl.textContent = '8 Hours Door-to-Door • Stops Included';
    } else {
      statEl.textContent = `${appState.distanceKm} km • ~${appState.durationText}`;
    }
  }
}

// Synchronize vehicle card styling in Stage 2
function syncVehicleCardSelection() {
  document.querySelectorAll('.vehicle-card').forEach(card => {
    const veh = card.getAttribute('data-veh');
    const check = card.querySelector('.veh-check');
    if (veh === appState.vehicleCategory) {
      card.classList.add('active', 'border-gold', 'bg-gold/10');
      card.classList.remove('border-slate-700', 'bg-midnight');
      if (check) {
        check.setAttribute('icon', 'lucide:check-circle');
        check.className = 'text-gold veh-check';
      }
    } else {
      card.classList.remove('active', 'border-gold', 'bg-gold/10');
      card.classList.add('border-slate-700', 'bg-midnight');
      if (check) {
        check.setAttribute('icon', 'lucide:circle');
        check.className = 'text-slate-500 veh-check';
      }
    }
  });

  // Sync inline editor buttons in Stage 5
  const btnE = document.getElementById('inline-btn-eclass');
  const btnV = document.getElementById('inline-btn-vclass');
  const btnVito = document.getElementById('inline-btn-vito');
  [btnE, btnV, btnVito].forEach(b => {
    if (b) {
      b.className = 'p-2 rounded border border-slate-700 bg-surface/80 text-xs font-semibold text-center text-slate-300 min-h-[44px] hover:border-gold/40 transition';
    }
  });
  if (appState.vehicleCategory === 'E_CLASS' && btnE) {
    btnE.className = 'p-2 rounded border border-gold bg-gold text-midnight font-bold text-xs text-center min-h-[44px] shadow-sm';
  } else if (appState.vehicleCategory === 'V_CLASS' && btnV) {
    btnV.className = 'p-2 rounded border border-gold bg-gold text-midnight font-bold text-xs text-center min-h-[44px] shadow-sm';
  } else if (appState.vehicleCategory === 'VITO' && btnVito) {
    btnVito.className = 'p-2 rounded border border-gold bg-gold text-midnight font-bold text-xs text-center min-h-[44px] shadow-sm';
  }
}

// Step Navigation State Machine
function goToStep(step, pushHistory = true) {
  if (step < 1 || step > 6) return;

  // Validation rules before transitioning forward
  if (step === 2 && appState.currentStep === 1) {
    if (appState.serviceType !== 'TOUR') {
      const pickup = document.getElementById('step1-pickup')?.value.trim();
      const dropoff = document.getElementById('step1-dropoff')?.value.trim();
      if (!pickup || pickup.length < 3) {
        alert('Please enter a valid pickup location.');
        return;
      }
      if (!dropoff || dropoff.length < 3) {
        alert('Please enter a valid destination.');
        return;
      }
      appState.pickupAddress = pickup;
      appState.dropoffAddress = dropoff;
    }
    const date = document.getElementById('step1-date')?.value;
    if (!date) {
      alert('Please select a pickup date.');
      return;
    }
    appState.pickupDate = date;
    appState.pickupTime = document.getElementById('step1-time')?.value || '14:30';
    appState.flightNumber = document.getElementById('step1-flight')?.value.trim() || '';
    if (appState.serviceType === 'RETURN') {
      appState.returnDate = document.getElementById('step1-return-date')?.value || '';
      appState.returnTime = document.getElementById('step1-return-time')?.value || '10:00';
    }
  }

  // Validation before leaving Stage 2 (Vehicle & Capacity)
  if (step === 3 && appState.currentStep === 2) {
    if (appState.vehicleCategory === 'E_CLASS') {
      if (appState.passengerCount > 3 || appState.largeLuggageCount > 2) {
        alert('Mercedes-Benz E-Class is capped at max 3 passengers and 2 large suitcases. Please adjust party size or upgrade to V-Class.');
        return;
      }
    }
  }

  // Validation before entering Stage 5 (Review)
  if (step === 5 && appState.currentStep === 4) {
    const name = document.getElementById('cust-name')?.value.trim();
    const email = document.getElementById('cust-email')?.value.trim();
    const phone = document.getElementById('cust-phone')?.value.trim();

    if (!name || name.length < 3) {
      alert('Please enter your full name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!phone || phone.length < 7) {
      alert('Please enter a valid mobile number with country code.');
      return;
    }

    appState.customer.fullName = name;
    appState.customer.email = email;
    appState.customer.phoneNumber = phone;
    appState.customer.language = document.getElementById('cust-lang')?.value || 'en';
    const commRadio = document.querySelector('input[name="comm-channel"]:checked');
    if (commRadio) appState.customer.commChannel = commRadio.value;
    appState.customer.specialRequests = document.getElementById('cust-notes')?.value || '';

    // Invoicing
    appState.customer.companyName = document.getElementById('cust-company')?.value || '';
    appState.customer.taxNumber = document.getElementById('cust-tax')?.value || '';
    appState.customer.billingStreet = document.getElementById('cust-street')?.value || '';

    updateStep5Summary();
  }

  // Update step visibility
  for (let i = 1; i <= 6; i++) {
    const pane = document.getElementById(`step-pane-${i}`);
    if (pane) {
      if (i === step) pane.classList.remove('hidden');
      else pane.classList.add('hidden');
    }
  }

  // Update Progress Tracker Bubbles
  document.querySelectorAll('.step-indicator').forEach(ind => {
    const s = parseInt(ind.getAttribute('data-step'));
    const bubble = ind.querySelector('.step-bubble');
    const label = ind.querySelector('span');

    if (s < step) {
      bubble.className = 'step-bubble w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs shadow-lg';
      bubble.innerHTML = '<iconify-icon icon="lucide:check" width="14" height="14"></iconify-icon>';
      if (label) label.className = 'hidden sm:block text-[11px] font-semibold text-emerald-400';
    } else if (s === step) {
      bubble.className = 'step-bubble w-8 h-8 rounded-full bg-gold text-midnight font-bold flex items-center justify-center text-xs shadow-lg';
      bubble.innerHTML = s;
      if (label) label.className = 'hidden sm:block text-[11px] font-bold text-gold';
    } else {
      bubble.className = 'step-bubble w-8 h-8 rounded-full bg-elevated text-slate-400 font-bold flex items-center justify-center text-xs border border-slate-700';
      bubble.innerHTML = s;
      if (label) label.className = 'hidden sm:block text-[11px] font-medium text-slate-400';
    }
  });

  const progressBar = document.getElementById('step-progress-bar');
  if (progressBar) {
    const pct = ((step - 1) / 5) * 100;
    progressBar.style.width = `${pct}%`;
  }

  // Prev Button visibility
  const prevBtn = document.getElementById('btn-step-prev');
  if (prevBtn) {
    if (step > 1 && step < 6) prevBtn.classList.remove('invisible');
    else prevBtn.classList.add('invisible');
  }

  // Next Button Copy & Visibility
  const nextBtn = document.getElementById('btn-step-next');
  const navFooter = document.getElementById('stepper-nav-footer');
  if (nextBtn) {
    if (step === 5) {
      nextBtn.innerHTML = `<span>Request Booking Confirmation — Pay After Approval</span> <iconify-icon icon="lucide:shield-check" width="18" height="18"></iconify-icon>`;
      nextBtn.className = 'btn-gold text-xs sm:text-sm py-3 px-6 shadow-xl';
    } else {
      nextBtn.innerHTML = `<span>Continue</span> <iconify-icon icon="lucide:arrow-right" width="16" height="16"></iconify-icon>`;
      nextBtn.className = 'btn-gold text-xs sm:text-sm py-2.5 px-6';
    }
  }

  if (navFooter) {
    if (step === 6) navFooter.classList.add('hidden');
    else navFooter.classList.remove('hidden');
  }

  // Mobile Dynamic Step Counter Update
  const stepNames = {
    1: 'Service & Route',
    2: 'Vehicle Selection',
    3: 'Options & Extras',
    4: 'Passenger Info',
    5: 'Review & In-Line Edit',
    6: 'Confirmation'
  };
  const mobStepNum = document.getElementById('mobile-step-num');
  const mobStepName = document.getElementById('mobile-step-name');
  const mobStepInd = document.getElementById('mobile-step-indicator');
  if (mobStepNum) mobStepNum.textContent = step;
  if (mobStepName) mobStepName.textContent = stepNames[step] || '';
  if (mobStepInd) mobStepInd.textContent = `Step ${step} of 6`;

  // History & Session persistence
  if (pushHistory) {
    window.history.pushState({ stage: step }, '', '#book-step-' + step);
  }
  try {
    sessionStorage.setItem('petrans_booking_state', JSON.stringify(appState));
  } catch (e) {}

  appState.currentStep = step;
}

// Capacity Safeguard & Auto-Upgrade Logic
function checkCapacityWarning() {
  const eclassWarn = document.getElementById('eclass-warning-banner');
  const fleetMaxWarn = document.getElementById('fleet-max-warning');

  if (appState.vehicleCategory === 'E_CLASS') {
    if (appState.passengerCount > 3 || appState.largeLuggageCount > 2 || appState.cabinBagsCount > 2) {
      if (eclassWarn) eclassWarn.classList.remove('hidden');
    } else {
      if (eclassWarn) eclassWarn.classList.add('hidden');
    }
  } else {
    if (eclassWarn) eclassWarn.classList.add('hidden');
  }

  if (appState.passengerCount > 8 || appState.largeLuggageCount > 8) {
    if (fleetMaxWarn) fleetMaxWarn.classList.remove('hidden');
  } else {
    if (fleetMaxWarn) fleetMaxWarn.classList.add('hidden');
  }
}

function upgradeToVClass() {
  appState.vehicleCategory = 'V_CLASS';
  syncVehicleCardSelection();
  checkCapacityWarning();
  updateHeroCalculation();
  if (appState.currentStep === 5) {
    updateStep5Summary();
  }
}

// In-Line Editing UX in Stage 5
function toggleInlineEdit(section) {
  const editor = document.getElementById(`inline-edit-${section}`);
  if (!editor) return;

  const isHidden = editor.classList.contains('hidden');
  // Close any open inline editors
  ['route', 'vehicle', 'extras', 'contact'].forEach(s => {
    const el = document.getElementById(`inline-edit-${s}`);
    if (el) el.classList.add('hidden');
  });

  if (isHidden) {
    editor.classList.remove('hidden');
    // Pre-populate inline fields
    if (section === 'route') {
      const p = document.getElementById('inline-pickup');
      const d = document.getElementById('inline-dropoff');
      const dt = document.getElementById('inline-date');
      const t = document.getElementById('inline-time');
      if (p) p.value = appState.pickupAddress;
      if (d) d.value = appState.dropoffAddress;
      if (dt) dt.value = appState.pickupDate;
      if (t) t.value = appState.pickupTime;
    } else if (section === 'vehicle') {
      const paxEl = document.getElementById('inline-pax-count');
      const lugEl = document.getElementById('inline-luggage-count');
      if (paxEl) paxEl.textContent = appState.passengerCount;
      if (lugEl) lugEl.textContent = appState.largeLuggageCount;
      syncVehicleCardSelection();
    } else if (section === 'extras') {
      const baby = document.getElementById('inline-addon-baby');
      const child = document.getElementById('inline-addon-child');
      if (baby) baby.textContent = appState.childSeats.baby;
      if (child) child.textContent = appState.childSeats.child;
    } else if (section === 'contact') {
      const n = document.getElementById('inline-cust-name');
      const em = document.getElementById('inline-cust-email');
      const ph = document.getElementById('inline-cust-phone');
      if (n) n.value = appState.customer.fullName;
      if (em) em.value = appState.customer.email;
      if (ph) ph.value = appState.customer.phoneNumber;
    }
  }
}

function applyInlineRoute() {
  const p = document.getElementById('inline-pickup')?.value.trim();
  const d = document.getElementById('inline-dropoff')?.value.trim();
  const dt = document.getElementById('inline-date')?.value;
  const t = document.getElementById('inline-time')?.value;

  if (p) {
    appState.pickupAddress = p;
    const step1P = document.getElementById('step1-pickup');
    if (step1P) step1P.value = p;
  }
  if (d) {
    appState.dropoffAddress = d;
    const step1D = document.getElementById('step1-dropoff');
    if (step1D) step1D.value = d;
    // Check known routes for distance recalculation
    const route = ROUTES_DB[d.toLowerCase()];
    if (route) {
      appState.distanceKm = route.distance;
      appState.durationText = route.duration;
    }
  }
  if (dt) {
    appState.pickupDate = dt;
    const step1Dt = document.getElementById('step1-date');
    if (step1Dt) step1Dt.value = dt;
  }
  if (t) {
    appState.pickupTime = t;
    const step1T = document.getElementById('step1-time');
    if (step1T) step1T.value = t;
  }

  updateStep5Summary();
  updateHeroCalculation();
}

function setInlineVehicle(cat) {
  if (!VEHICLE_META[cat]) return;
  appState.vehicleCategory = cat;
  syncVehicleCardSelection();
  checkCapacityWarning();
  updateStep5Summary();
  updateHeroCalculation();
}

function applyInlineContact() {
  const n = document.getElementById('inline-cust-name')?.value.trim();
  const em = document.getElementById('inline-cust-email')?.value.trim();
  const ph = document.getElementById('inline-cust-phone')?.value.trim();

  if (n) {
    appState.customer.fullName = n;
    const step4N = document.getElementById('cust-name');
    if (step4N) step4N.value = n;
  }
  if (em) {
    appState.customer.email = em;
    const step4Em = document.getElementById('cust-email');
    if (step4Em) step4Em.value = em;
  }
  if (ph) {
    appState.customer.phoneNumber = ph;
    const step4Ph = document.getElementById('cust-phone');
    if (step4Ph) step4Ph.value = ph;
  }

  updateStep5Summary();
}

// Update Stage 5 Summary Screen
function updateStep5Summary() {
  const quote = calculateClientPrice(
    appState.serviceType,
    appState.distanceKm,
    appState.intermediateStops,
    appState.vehicleCategory,
    appState.tourKey,
    appState.tourHours
  );

  appState.currentQuote = quote;
  const meta = VEHICLE_META[appState.vehicleCategory] || VEHICLE_META['V_CLASS'];

  // Route & Service
  const sumRoute = document.getElementById('sum-route');
  if (sumRoute) {
    sumRoute.textContent = appState.serviceType === 'TOUR'
      ? (TOURS_DB[appState.tourKey]?.title || '8-Hour Day Tour')
      : `${appState.pickupAddress} → ${appState.dropoffAddress}`;
  }

  const sumBadge = document.getElementById('sum-service-badge');
  if (sumBadge) {
    sumBadge.textContent = appState.serviceType === 'TOUR'
      ? '8-Hour Private Day Tour'
      : appState.serviceType === 'RETURN'
      ? 'Return Journey (-5%)'
      : 'One-Way Transfer';
  }

  const sumDateTime = document.getElementById('sum-datetime');
  if (sumDateTime) {
    sumDateTime.textContent = `${appState.pickupDate || 'Selected Date'} at ${appState.pickupTime || '14:30'} CET`;
  }

  const sumFlightRow = document.getElementById('sum-flight-row');
  const sumFlight = document.getElementById('sum-flight');
  if (appState.flightNumber && sumFlight) {
    sumFlight.textContent = `${appState.flightNumber} (60 min free waiting)`;
    if (sumFlightRow) sumFlightRow.classList.remove('hidden');
  } else if (sumFlightRow) {
    sumFlightRow.classList.add('hidden');
  }

  // Vehicle & Pax
  const sumVehicle = document.getElementById('sum-vehicle');
  if (sumVehicle) sumVehicle.textContent = meta.name;

  const sumRateKm = document.getElementById('sum-rate-km');
  if (sumRateKm) sumRateKm.textContent = 'Guaranteed Fixed Fare';

  const sumPax = document.getElementById('sum-pax');
  if (sumPax) sumPax.textContent = `${appState.passengerCount} Passengers`;

  const sumBags = document.getElementById('sum-bags');
  if (sumBags) sumBags.textContent = `${appState.largeLuggageCount} Large Suitcases + ${appState.cabinBagsCount} Cabin Bags`;

  // Extras
  const sumChild = document.getElementById('sum-child-seats');
  if (sumChild) {
    const totalChild = (appState.childSeats.baby || 0) + (appState.childSeats.child || 0) + (appState.childSeats.booster || 0);
    sumChild.textContent = totalChild > 0 ? `${totalChild}x Seats Requested (€0.00)` : 'None Requested';
  }

  const sumSki = document.getElementById('sum-ski');
  if (sumSki) sumSki.textContent = `${appState.skiEquipment} Bags (€0.00)`;

  const sumWheel = document.getElementById('sum-wheelchair');
  if (sumWheel) sumWheel.textContent = appState.wheelchair ? 'Foldable Wheelchair Included' : 'No';

  // Contact
  const sumName = document.getElementById('sum-name');
  if (sumName) sumName.textContent = appState.customer.fullName || '-';

  const sumEmail = document.getElementById('sum-email');
  if (sumEmail) sumEmail.textContent = appState.customer.email || '-';

  const sumPhone = document.getElementById('sum-phone');
  if (sumPhone) sumPhone.textContent = appState.customer.phoneNumber || '-';

  // Financial Breakdown
  const sumDist = document.getElementById('sum-dist');
  if (sumDist) sumDist.textContent = appState.distanceKm;

  const sumUnitRate = document.getElementById('sum-unit-rate');
  if (sumUnitRate) sumUnitRate.textContent = 'Fixed Fare';

  const sumBasePrice = document.getElementById('sum-base-price');
  if (sumBasePrice) sumBasePrice.textContent = `€${quote.baseFare.toFixed(2)}`;

  const sumStopsCount = document.getElementById('sum-stops-count');
  if (sumStopsCount) sumStopsCount.textContent = appState.intermediateStops;

  const sumStopsPrice = document.getElementById('sum-stops-price');
  if (sumStopsPrice) sumStopsPrice.textContent = `€${quote.stopsFee.toFixed(2)}`;

  const sumDiscountRow = document.getElementById('sum-discount-row');
  const sumDiscountPrice = document.getElementById('sum-discount-price');
  if (quote.discountAmount > 0) {
    if (sumDiscountRow) sumDiscountRow.classList.remove('hidden');
    if (sumDiscountPrice) sumDiscountPrice.textContent = `-€${quote.discountAmount.toFixed(2)}`;
  } else if (sumDiscountRow) {
    sumDiscountRow.classList.add('hidden');
  }

  const sumNetPrice = document.getElementById('sum-net-price');
  if (sumNetPrice) sumNetPrice.textContent = `€${quote.netTotal.toFixed(2)}`;

  const sumVatPrice = document.getElementById('sum-vat-price');
  if (sumVatPrice) sumVatPrice.textContent = `€${quote.vatAmount.toFixed(2)}`;

  const sumTotalPrice = document.getElementById('sum-total-price');
  if (sumTotalPrice) sumTotalPrice.textContent = `€${quote.grossTotal.toFixed(2)}`;
}

// Quick Chip Setters
function setPickup(addr) {
  const p = document.getElementById('step1-pickup');
  if (p) p.value = addr;
  appState.pickupAddress = addr;
}

function setDropoff(addr, km) {
  const d = document.getElementById('step1-dropoff');
  if (d) d.value = addr;
  appState.dropoffAddress = addr;
  appState.distanceKm = km;
  updateHeroCalculation();
}

function setQuickRoute(destName, km) {
  window.location.href = `/booking.html?service=one-way&pickup=Salzburg&dropoff=${encodeURIComponent(destName)}`;
}

// Stepper Adjusters
function adjustPax(delta) {
  const max = appState.vehicleCategory === 'E_CLASS' ? 3 : 8;
  const newVal = appState.passengerCount + delta;
  if (newVal >= 1 && newVal <= 8) {
    appState.passengerCount = newVal;
    const countEl = document.getElementById('step2-pax-count');
    if (countEl) countEl.textContent = newVal;
    const inlinePax = document.getElementById('inline-pax-count');
    if (inlinePax) inlinePax.textContent = newVal;
  }
  checkCapacityWarning();
  if (appState.currentStep === 5) updateStep5Summary();
}

function adjustLuggage(delta) {
  const newVal = appState.largeLuggageCount + delta;
  if (newVal >= 0 && newVal <= 8) {
    appState.largeLuggageCount = newVal;
    const countEl = document.getElementById('step2-luggage-count');
    if (countEl) countEl.textContent = newVal;
    const inlineLug = document.getElementById('inline-luggage-count');
    if (inlineLug) inlineLug.textContent = newVal;
  }
  checkCapacityWarning();
  if (appState.currentStep === 5) updateStep5Summary();
}

function adjustCabin(delta) {
  const newVal = appState.cabinBagsCount + delta;
  if (newVal >= 0 && newVal <= 8) {
    appState.cabinBagsCount = newVal;
    const countEl = document.getElementById('step2-cabin-count');
    if (countEl) countEl.textContent = newVal;
  }
  checkCapacityWarning();
  if (appState.currentStep === 5) updateStep5Summary();
}

function adjustStops(delta) {
  const newVal = appState.intermediateStops + delta;
  if (newVal >= 0 && newVal <= 5) {
    appState.intermediateStops = newVal;
    const countEl = document.getElementById('step1-stops-count');
    if (countEl) countEl.textContent = newVal;
    updateHeroCalculation();
  }
}

function adjustAddon(type, delta) {
  if (type === 'baby') {
    const newVal = Math.max(0, Math.min(4, (appState.childSeats.baby || 0) + delta));
    appState.childSeats.baby = newVal;
    const el = document.getElementById('addon-baby-count');
    if (el) el.textContent = newVal;
    const inlineEl = document.getElementById('inline-addon-baby');
    if (inlineEl) inlineEl.textContent = newVal;
  } else if (type === 'child') {
    const newVal = Math.max(0, Math.min(4, (appState.childSeats.child || 0) + delta));
    appState.childSeats.child = newVal;
    const el = document.getElementById('addon-child-count');
    if (el) el.textContent = newVal;
    const inlineEl = document.getElementById('inline-addon-child');
    if (inlineEl) inlineEl.textContent = newVal;
  } else if (type === 'booster') {
    const newVal = Math.max(0, Math.min(4, (appState.childSeats.booster || 0) + delta));
    appState.childSeats.booster = newVal;
    const el = document.getElementById('addon-booster-count');
    if (el) el.textContent = newVal;
  } else if (type === 'ski') {
    const newVal = Math.max(0, Math.min(8, (appState.skiEquipment || 0) + delta));
    appState.skiEquipment = newVal;
    const el = document.getElementById('addon-ski-count');
    if (el) el.textContent = newVal;
  }
  if (appState.currentStep === 5) updateStep5Summary();
}

function toggleCompanyInvoice() {
  const fields = document.getElementById('invoice-fields');
  const chevron = document.getElementById('invoice-chevron');
  if (fields) {
    fields.classList.toggle('hidden');
    appState.customer.isCompanyInvoice = !fields.classList.contains('hidden');
  }
  if (chevron) {
    chevron.setAttribute('icon', fields && !fields.classList.contains('hidden') ? 'lucide:chevron-up' : 'lucide:chevron-down');
  }
}

// Stage 6: Booking Submission & Status Confirmation
async function submitBooking() {
  const quote = calculateClientPrice(
    appState.serviceType,
    appState.distanceKm,
    appState.intermediateStops,
    appState.vehicleCategory,
    appState.tourKey,
    appState.tourHours
  );

  const payload = {
    serviceType: appState.serviceType,
    pickupAddress: appState.pickupAddress,
    dropoffAddress: appState.dropoffAddress,
    distanceKm: appState.distanceKm,
    intermediateStopsCount: appState.intermediateStops,
    tourKey: appState.tourKey,
    tourHours: appState.tourHours,
    pickupDateTime: `${appState.pickupDate}T${appState.pickupTime}:00`,
    flightNumber: appState.flightNumber,
    returnDateTime: appState.serviceType === 'RETURN' ? `${appState.returnDate}T${appState.returnTime}:00` : null,
    vehicleCategory: appState.vehicleCategory,
    passengerCount: appState.passengerCount,
    largeLuggageCount: appState.largeLuggageCount,
    cabinBagsCount: appState.cabinBagsCount,
    childSeatsCount: (appState.childSeats.baby || 0) + (appState.childSeats.child || 0),
    boosterSeatsCount: appState.childSeats.booster || 0,
    skiEquipmentCount: appState.skiEquipment || 0,
    wheelchairAccommodated: document.getElementById('addon-wheelchair')?.checked || false,
    specialRequests: appState.customer.specialRequests,
    customer: appState.customer,
    paymentMethod: appState.paymentMethod
  };

  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      // Hydrate Stage 6 Confirmation Screen
      const confRef = document.getElementById('conf-ref');
      const confRoute = document.getElementById('conf-route');
      const confDateTime = document.getElementById('conf-datetime');
      const confVehicle = document.getElementById('conf-vehicle');
      const confTotal = document.getElementById('conf-total');
      const confWaBtn = document.getElementById('conf-wa-btn');

      const meta = VEHICLE_META[appState.vehicleCategory];

      if (confRef) confRef.textContent = data.booking.reference;
      if (confRoute) confRoute.textContent = `${appState.pickupAddress} → ${appState.dropoffAddress}`;
      if (confDateTime) confDateTime.textContent = `${appState.pickupDate} at ${appState.pickupTime} CET`;
      if (confVehicle) confVehicle.textContent = meta.name;
      if (confTotal) confTotal.textContent = `€${quote.grossTotal.toFixed(2)}`;

      const waText = encodeURIComponent(
        `Hello Omer, I have submitted booking request ${data.booking.reference} for ${appState.pickupAddress} on ${appState.pickupDate} at ${appState.pickupTime}. Vehicle: ${meta.name}. Total: €${quote.grossTotal.toFixed(2)}.`
      );
      if (confWaBtn) confWaBtn.href = `https://wa.me/436606416464?text=${waText}`;

      // Transition to Stage 6
      goToStep(6);
      const stepper = document.getElementById('booking-stepper');
      if (stepper) stepper.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert(`Booking Submission Alert: ${data.error}`);
    }
  } catch (err) {
    alert(`Could not submit reservation. Please contact dispatch via WhatsApp at +43 660 6416464. Error: ${err.message}`);
  }
}

// Reset booking wizard
function resetBookingEngine() {
  appState.currentStep = 1;
  try {
    sessionStorage.removeItem('petrans_booking_state');
  } catch (e) {}
  goToStep(1);
  const stepper = document.getElementById('booking-stepper');
  if (stepper) stepper.scrollIntoView({ behavior: 'smooth' });
}

// AI Concierge Chat Logic
async function sendAiMessage(customText) {
  const inputEl = document.getElementById('ai-chat-input');
  const message = customText || inputEl.value.trim();
  if (!message) return;

  const msgContainer = document.getElementById('ai-chat-messages');
  if (!msgContainer) return;

  // Append user message
  const userDiv = document.createElement('div');
  userDiv.className = 'bg-gold/15 border border-gold/30 p-2.5 rounded-xl text-snow ml-6 text-right text-xs';
  userDiv.textContent = message;
  msgContainer.appendChild(userDiv);

  if (!customText && inputEl) inputEl.value = '';
  msgContainer.scrollTop = msgContainer.scrollHeight;

  const currentLang = document.getElementById('lang-select')?.value || 'en';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, lang: currentLang })
    });

    const data = await res.json();
    const botDiv = document.createElement('div');
    botDiv.className = 'bg-surface p-3 rounded-xl border border-slate-800 text-slate-200 mr-4 text-xs';
    botDiv.textContent = data.reply;
    msgContainer.appendChild(botDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  } catch (err) {
    const errDiv = document.createElement('div');
    errDiv.className = 'bg-red-500/10 p-2 rounded text-red-300 text-xs';
    errDiv.textContent = 'Could not reach AI Concierge. Please contact +43 660 6416464 directly.';
    msgContainer.appendChild(errDiv);
  }
}

function sendAiQuick(text) {
  sendAiMessage(text);
}

// Bespoke Scroll Animation Controller
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-init');
  if (!elements.length) return;

  // Fallback if IntersectionObserver is not supported or user prefers reduced motion
  if (typeof IntersectionObserver === 'undefined' || 
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-delay');
        if (delay) {
          setTimeout(() => el.classList.add('is-revealed'), Number(delay));
        } else {
          el.classList.add('is-revealed');
        }
        obs.unobserve(el);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// Modern 2026 Spotlight Cards Cursor Tracker
function initSpotlightCards() {
  const cards = document.querySelectorAll('.spotlight-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }, { passive: true });
  });
}
