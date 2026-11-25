// PETRANS Taxi & Tour Salzburg — Dedicated Booking Engine Controller
// Distraction-free 6-stage booking wizard with URL hydration and state persistence

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
  'salzburg-airport': { name: 'Salzburg Airport W. A. Mozart (SZG)', distance: 5.5, duration: '18m' },
  'salzburg-old-town': { name: 'Salzburg City Center / Old Town', distance: 5.5, duration: '18m' },
  'salzburg-hbf': { name: 'Salzburg Central Station (Hbf)', distance: 6.0, duration: '20m' }
};

const TOURS_DB = {
  'hallstatt': { title: 'Hallstatt & Salzkammergut Lakes (8 Hours)', price: 450.0, tier: 2 },
  'sound-of-music': { title: 'Sound of Music & Salzburg Lakes (8 Hours)', price: 450.0, tier: 2 },
  'salzburg-city': { title: 'Salzburg City Tour (From €70/hr • Min 3h)', price: 210.0, tier: 1 },
  'innsbruck-swarovski': { title: 'Innsbruck and Swarovski Day Tour (8-9 Hours)', price: 600.0, tier: 3 },
  'kaprun-zell-am-see': { title: 'Kaprun and Zell am See Day Tour (8 Hours)', price: 500.0, tier: 2 },
  'eagles-nest': { title: 'Eagles Nest & Berchtesgaden (6-8 Hours)', price: 450.0, tier: 1 },
  'grossglockner': { title: 'Grossglockner High Alpine Glacier Road (8-9 Hours)', price: 550.0, tier: 2 },
  'werfen-ice-caves': { title: 'Werfen Ice Caves & Fortress (8 Hours)', price: 450.0, tier: 1 },
  'zell-am-see': { title: 'Zell am See & Kaprun Alpine Glacier (8 Hours)', price: 500.0, tier: 2 },
  'bad-gastein': { title: 'Bad Gastein Thermal & Waterfall (8 Hours)', price: 450.0, tier: 2 },
  'swarovski-crystal-worlds': { title: 'Swarovski Crystal Worlds & Hall in Tirol (8 Hours)', price: 550.0, tier: 2 },
  'innsbruck': { title: 'Innsbruck & Tyrolean Alps Highlights (8-9 Hours)', price: 650.0, tier: 3 }
};

// Route Resolution Helper (Guarantees €45 floor on Airport ↔ City Center)
function resolveRouteInfo(pickup, dropoff) {
  const p = (pickup || '').trim().toLowerCase();
  const d = (dropoff || '').trim().toLowerCase();

  const isAirport = (str) => /airport|szg|flughafen|mozart|terminal/i.test(str);
  const isCity = (str) => /old town|altstadt|city center|city centre|zentrum|salzburg hotel|salzburg city|salzburg zentrum|salzburg mitte|salzburg/i.test(str);
  const isHbf = (str) => /hbf|hauptbahnhof|central train|main station/i.test(str);

  if ((isAirport(p) && isCity(d) && !d.includes('munich') && !d.includes('vienna')) ||
      (isAirport(d) && isCity(p) && !p.includes('munich') && !p.includes('vienna'))) {
    if (isHbf(p) || isHbf(d)) {
      return { name: 'Salzburg Airport (SZG) ↔ Salzburg Hbf Station', distance: 6.0, duration: '20m' };
    }
    return { name: 'Salzburg Airport (SZG) ↔ Salzburg City Center / Old Town', distance: 5.5, duration: '18m' };
  }

  const check = (str) => {
    if (!str) return null;
    if (str.includes('hallstatt')) return { name: 'Hallstatt Lahn Terminal', distance: 73, duration: '1h 15m' };
    if (str.includes('zell am see') || str.includes('kaprun')) return { name: 'Zell am See / Kaprun', distance: 85, duration: '1h 30m' };
    if (str.includes('munich airport') || str.includes('muc')) return { name: 'Munich Airport MUC', distance: 175, duration: '1h 50m' };
    if (str.includes('munich')) return { name: 'Munich City Center', distance: 145, duration: '1h 45m' };
    if (str.includes('innsbruck')) return { name: 'Innsbruck Highlights', distance: 185, duration: '2h 00m' };
    if (str.includes('bad gastein')) return { name: 'Bad Gastein Valley', distance: 100, duration: '1h 30m' };
    if (str.includes('eagles nest') || str.includes('berchtesgaden')) return { name: 'Eagles Nest / Berchtesgaden', distance: 30, duration: '35m' };
    if (str.includes('saalbach')) return { name: 'Saalbach-Hinterglemm', distance: 92, duration: '1h 35m' };
    if (str.includes('vienna')) return { name: 'Vienna City Center / VIE', distance: 300, duration: '3h 15m' };
    if (str.includes('prague')) return { name: 'Prague Cross-Border', distance: 375, duration: '4h 15m' };
    if (str.includes('werfen')) return { name: 'Werfen Ice Caves & Fortress', distance: 50, duration: '45m' };
    if (str.includes('swarovski') || str.includes('wattens')) return { name: 'Swarovski Crystal Worlds', distance: 165, duration: '1h 55m' };
    if (str.includes('old town') || str.includes('altstadt') || str.includes('city center')) return { name: 'Salzburg City Center / Old Town', distance: 5.5, duration: '18m' };
    if (isAirport(str)) return { name: 'Salzburg Airport (SZG)', distance: 5.5, duration: '18m' };
    return null;
  };

  return check(d) || check(p);
}

window.selectQuickPickup = function(address) {
  const pInput = document.getElementById('step1-pickup');
  if (pInput) pInput.value = address;
  appState.pickupAddress = address;
  const dInput = document.getElementById('step1-dropoff');
  const route = resolveRouteInfo(address, dInput ? dInput.value : '');
  if (route) {
    appState.distanceKm = route.distance;
    appState.durationText = route.duration;
  }
};

window.selectQuickDropoff = function(address, distance, duration) {
  const dInput = document.getElementById('step1-dropoff');
  if (dInput) dInput.value = address;
  appState.dropoffAddress = address;
  if (distance) {
    appState.distanceKm = distance;
    if (duration) appState.durationText = duration;
  } else {
    const pInput = document.getElementById('step1-pickup');
    const route = resolveRouteInfo(pInput ? pInput.value : '', address);
    if (route) {
      appState.distanceKm = route.distance;
      appState.durationText = route.duration;
    }
  }
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

const appState = {
  currentStep: 1,
  entrySource: 'direct',
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
  vehicleCategory: 'V_CLASS',
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
  setupBookingEventListeners();
  initDateDefaults();
  restoreSessionState();
  hydrateBookingFromUrl();
  checkCapacityWarning();
  initSpotlightCards();
  checkAndApplySavedCustomer();
  setupCustomerLookup();
  initAccessibilityMode();
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

// Session State Restoration
function restoreSessionState() {
  try {
    const raw = sessionStorage.getItem('petrans_booking_state');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
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

// URL Parameter Hydration with Affirmative Preselection
function hydrateBookingFromUrl() {
  const params = new URLSearchParams(window.location.search);
  let preselectedNote = '';

  // 1. Service param
  const serviceParam = params.get('service');
  if (serviceParam) {
    const sKey = serviceParam.toUpperCase().replace('-', '_');
    if (['ONE_WAY', 'RETURN', 'TOUR', 'HOURLY'].includes(sKey)) {
      appState.serviceType = sKey;
      if (sKey === 'HOURLY') {
        appState.tourHours = parseInt(params.get('hours')) || 4;
        preselectedNote = `Hourly As-Directed Chauffeur: ${appState.tourHours} Hours Pre-selected.`;
      }
      const optBtn = document.querySelector(`.service-opt-btn[data-val="${sKey}"]`);
      if (optBtn) optBtn.click();
    }
  }

  // 1b. Stops param
  const stopsParam = parseInt(params.get('stops'));
  if (!isNaN(stopsParam) && stopsParam >= 0 && stopsParam <= 5) {
    appState.intermediateStops = stopsParam;
    const sEl = document.getElementById('step1-stops-count');
    if (sEl) sEl.textContent = stopsParam;
  }

  // 2. Vehicle param
  const vehParam = params.get('vehicle');
  if (vehParam) {
    const key = vehParam.toUpperCase().replace('-', '_');
    if (VEHICLE_META[key]) {
      appState.vehicleCategory = key;
      const meta = VEHICLE_META[key];
      preselectedNote = `Vehicle Pre-selected: ${meta.name}. You can change this at any time.`;
      if (key === 'E_CLASS' && appState.passengerCount > 3) {
        appState.passengerCount = 3;
        if (appState.largeLuggageCount > 2) appState.largeLuggageCount = 2;
      }
    }
  }

  // 3. Tour param
  const tourParam = params.get('tour');
  if (tourParam && TOURS_DB[tourParam.toLowerCase()]) {
    appState.serviceType = 'TOUR';
    appState.tourKey = tourParam.toLowerCase();
    const tour = TOURS_DB[appState.tourKey];
    preselectedNote = `Tour Pre-selected: ${tour.title} (€${tour.price.toFixed(2)}). You can customize your schedule or change services at any time.`;
    const optBtn = document.querySelector('.service-opt-btn[data-val="TOUR"]');
    if (optBtn) optBtn.click();
    const tourSelect = document.getElementById('step1-tour-select');
    if (tourSelect) tourSelect.value = appState.tourKey;
    const transferFields = document.getElementById('step1-transfer-fields');
    const tourFields = document.getElementById('step1-tour-fields');
    const returnBox = document.getElementById('step1-return-box');
    if (transferFields) transferFields.classList.add('hidden');
    if (tourFields) tourFields.classList.remove('hidden');
    if (returnBox) returnBox.classList.add('hidden');
  }

  // 4. Pickup and Dropoff
  const pickupParam = params.get('pickup') || params.get('origin');
  const dropoffParam = params.get('dropoff') || params.get('dest');
  if (pickupParam) {
    appState.pickupAddress = pickupParam;
    const pInput = document.getElementById('step1-pickup');
    if (pInput) pInput.value = pickupParam;
  }
  if (dropoffParam) {
    appState.dropoffAddress = dropoffParam;
    const dInput = document.getElementById('step1-dropoff');
    if (dInput) dInput.value = dropoffParam;
  }
  const resolvedRoute = resolveRouteInfo(appState.pickupAddress, appState.dropoffAddress);
  if (resolvedRoute) {
    appState.distanceKm = resolvedRoute.distance;
    appState.durationText = resolvedRoute.duration;
  }

  // 5. Passengers and Luggage
  const paxParam = parseInt(params.get('passengers') || params.get('pax'));
  if (!isNaN(paxParam) && paxParam >= 1 && paxParam <= 8) {
    appState.passengerCount = paxParam;
    const pEl = document.getElementById('step2-pax-count');
    if (pEl) pEl.textContent = paxParam;
  }
  const lugParam = parseInt(params.get('luggage') || params.get('bags'));
  if (!isNaN(lugParam) && lugParam >= 0 && lugParam <= 8) {
    appState.largeLuggageCount = lugParam;
    const lEl = document.getElementById('step2-luggage-count');
    if (lEl) lEl.textContent = lugParam;
  }

  if (preselectedNote) {
    showPreselectionBanner(preselectedNote);
  }

  syncVehicleCardSelection();
}

function showPreselectionBanner(text) {
  const banner = document.getElementById('preselection-banner');
  const textEl = document.getElementById('preselection-banner-text');
  if (banner && textEl) {
    textEl.textContent = text;
    banner.classList.remove('hidden');
  }
}

function dismissPreselectionBanner() {
  const banner = document.getElementById('preselection-banner');
  if (banner) banner.classList.add('hidden');
}

// Pricing Formula Calculation (Calibrated Centralized Fleet Engine)
function calculateClientPrice(serviceType, distanceKm, stopsCount, vehicleCategory, tourKey, tourHours) {
  if (typeof window !== 'undefined' && typeof window.calculatePetransQuote === 'function') {
    const q = window.calculatePetransQuote({
      serviceType,
      distanceKm,
      intermediateStopsCount: stopsCount,
      vehicleCategory,
      tourKey,
      tourHours
    });
    return {
      grossTotal: q.grossTotal,
      netTotal: q.netTotal,
      vatAmount: q.vatAmount,
      baseFare: q.breakdown.baseFare,
      stopsFee: q.breakdown.stopsFee,
      overtimeFee: q.breakdown.overtimeFee,
      discountAmount: q.breakdown.discountAmount,
      ratePerKm: q.ratePerKm
    };
  }

  // Fallback if pricing-config.js is not loaded
  const MIN_FARE = 45.0; // Mandatory base floor
  const VEHICLE_RATES = {
    'E_CLASS': 2.50,
    'V_CLASS': 2.60,
    'VITO':    2.60
  };

  const ratePerKm = VEHICLE_RATES[vehicleCategory] || 2.60;
  let baseFare = 0;
  let stopsFee = (stopsCount || 0) * 20.0;
  let overtimeFee = 0;
  let discountAmount = 0;
  let grossTotal = 0;

  if (serviceType === 'TOUR') {
    if (tourKey === 'salzburg-city') {
      const cityHours = Math.max(3, parseFloat(tourHours) || 3);
      baseFare = cityHours * 70.0;
      grossTotal = baseFare;
    } else {
      const tour = TOURS_DB[tourKey] || TOURS_DB['hallstatt'];
      baseFare = tour.price;
      if (tourHours > 8) {
        overtimeFee = (tourHours - 8) * 50.0;
      }
      grossTotal = baseFare + overtimeFee;
    }
  } else {
    const raw = distanceKm * ratePerKm;
    if (raw < MIN_FARE) {
      baseFare = MIN_FARE;
    } else if (distanceKm > 150) {
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

// Event Listeners for Stepper
function setupBookingEventListeners() {
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
      updateHospitalityVisibility();
    });
  });

  // Pickup & Destination Live Input Listeners (Airport ↔ City Center €45 floor sync)
  const step1PickupInput = document.getElementById('step1-pickup');
  const step1DropoffInput = document.getElementById('step1-dropoff');
  const handleAddressChange = () => {
    const p = step1PickupInput?.value || '';
    const d = step1DropoffInput?.value || '';
    appState.pickupAddress = p;
    appState.dropoffAddress = d;
    const info = resolveRouteInfo(p, d);
    if (info) {
      appState.distanceKm = info.distance;
      appState.durationText = info.duration;
    }
  };
  if (step1PickupInput) {
    step1PickupInput.addEventListener('input', handleAddressChange);
    step1PickupInput.addEventListener('change', handleAddressChange);
  }
  if (step1DropoffInput) {
    step1DropoffInput.addEventListener('input', handleAddressChange);
    step1DropoffInput.addEventListener('change', handleAddressChange);
  }

  // Tour Select in Stage 1
  const step1TourSelect = document.getElementById('step1-tour-select');
  if (step1TourSelect) {
    step1TourSelect.addEventListener('change', (e) => {
      appState.tourKey = e.target.value;
    });
  }

  // Vehicle Selection Cards in Stage 2
  document.querySelectorAll('.vehicle-card').forEach(card => {
    card.addEventListener('click', () => {
      const veh = card.getAttribute('data-veh');
      appState.vehicleCategory = veh;
      syncVehicleCardSelection();
      checkCapacityWarning();
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
      const info = resolveRouteInfo(pickup, dropoff);
      if (info) {
        appState.distanceKm = info.distance;
        appState.durationText = info.duration;
      }
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
  if (step === 3) {
    updateHospitalityVisibility();
    if (appState.currentStep === 2) {
      if (appState.vehicleCategory === 'E_CLASS') {
        if (appState.passengerCount > 3 || appState.largeLuggageCount > 2) {
          alert('Mercedes-Benz E-Class is capped at max 3 passengers and 2 large suitcases. Please adjust party size or upgrade to V-Class.');
          return;
        }
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

    // Save profile to database and local storage for returning client autofill
    try {
      const customerProfile = {
        fullName: name,
        email: email,
        phoneNumber: phone,
        preferredLanguage: appState.customer.language,
        companyName: appState.customer.companyName,
        taxNumber: appState.customer.taxNumber,
        billingStreet: appState.customer.billingStreet
      };
      localStorage.setItem('petrans_saved_customer', JSON.stringify(customerProfile));
      fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerProfile)
      }).catch(() => {});
    } catch (e) {}

    updateStep5Summary();
  }

  if (step === 4) {
    checkAndApplySavedCustomer();
  }

  const previousStep = appState.currentStep;

  // Update step visibility with fluid spring slide
  for (let i = 1; i <= 6; i++) {
    const pane = document.getElementById(`step-pane-${i}`);
    if (pane) {
      if (i === step) {
        pane.classList.remove('hidden');
        pane.classList.remove('step-slide-forward', 'step-slide-backward');
        void pane.offsetWidth;
        if (step > previousStep) {
          pane.classList.add('step-slide-forward');
        } else if (step < previousStep) {
          pane.classList.add('step-slide-backward');
        }
      } else {
        pane.classList.add('hidden');
        pane.classList.remove('step-slide-forward', 'step-slide-backward');
      }
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

  // Mobile Sticky Header Step Update
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
  const mobStickyProgress = document.getElementById('mobile-sticky-progress-bar');
  if (mobStepNum) mobStepNum.textContent = step;
  if (mobStepName) mobStepName.textContent = stepNames[step] || '';
  if (mobStepInd) mobStepInd.textContent = `Step ${step} of 6`;
  if (mobStickyProgress) {
    const pct = ((step - 1) / 5) * 100;
    mobStickyProgress.style.width = `${pct}%`;
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
      nextBtn.className = 'btn-gold text-xs sm:text-sm py-3 px-6 shadow-xl w-full sm:w-auto';
    } else {
      nextBtn.innerHTML = `<span>Continue</span> <iconify-icon icon="lucide:arrow-right" width="16" height="16"></iconify-icon>`;
      nextBtn.className = 'btn-gold text-xs sm:text-sm py-2.5 px-6 min-h-[44px]';
    }
  }

  if (navFooter) {
    if (step === 6) navFooter.classList.add('hidden');
    else navFooter.classList.remove('hidden');
  }

  // History & Session persistence
  if (pushHistory) {
    window.history.pushState({ stage: step }, '', '#step-' + step);
  }
  try {
    sessionStorage.setItem('petrans_booking_state', JSON.stringify(appState));
  } catch (e) {}

  appState.currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Capacity Safeguard & Auto-Upgrade Logic
function updateHospitalityVisibility() {
  const waterBlock = document.getElementById('water-preference-block');
  if (waterBlock) {
    if (appState.serviceType === 'TOUR') {
      waterBlock.classList.remove('hidden');
    } else {
      waterBlock.classList.add('hidden');
    }
  }
}

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
  if (appState.currentStep === 5) {
    updateStep5Summary();
  }
}

// In-Line Editing UX in Stage 5
function toggleInlineEdit(section) {
  const editor = document.getElementById(`inline-edit-${section}`);
  if (!editor) return;

  const isHidden = editor.classList.contains('hidden');
  ['route', 'vehicle', 'extras', 'contact'].forEach(s => {
    const el = document.getElementById(`inline-edit-${s}`);
    if (el) el.classList.add('hidden');
  });

  if (isHidden) {
    editor.classList.remove('hidden');
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
}

function setInlineVehicle(cat) {
  if (!VEHICLE_META[cat]) return;
  appState.vehicleCategory = cat;
  syncVehicleCardSelection();
  checkCapacityWarning();
  updateStep5Summary();
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
  if (appState.flightNumber) {
    if (sumFlightRow) sumFlightRow.classList.remove('hidden');
    if (sumFlight) sumFlight.textContent = appState.flightNumber;
  } else {
    if (sumFlightRow) sumFlightRow.classList.add('hidden');
  }

  // Vehicle
  const sumVehName = document.getElementById('sum-vehicle-name');
  const sumVehSub = document.getElementById('sum-vehicle-sub');
  const sumCapacity = document.getElementById('sum-capacity');
  if (sumVehName) sumVehName.textContent = meta.name;
  if (sumVehSub) sumVehSub.textContent = meta.subtitle;
  if (sumCapacity) sumCapacity.textContent = `${appState.passengerCount} Passengers • ${appState.largeLuggageCount} Large Bags`;

  // Financial Breakdown
  const sumBase = document.getElementById('sum-base-fare');
  const sumVat = document.getElementById('sum-vat');
  const sumGross = document.getElementById('sum-gross-total');
  const sumRateNote = document.getElementById('sum-rate-note');

  if (sumBase) sumBase.textContent = `€${quote.baseFare.toFixed(2)}`;
  if (sumVat) sumVat.textContent = `€${quote.vatAmount.toFixed(2)}`;
  if (sumGross) sumGross.textContent = `€${quote.grossTotal.toFixed(2)}`;
  if (sumRateNote) {
    sumRateNote.textContent = appState.serviceType === 'TOUR'
      ? 'Fixed 8h Private Tour'
      : 'Fixed Guaranteed Fare (Base Floor: €45.00)';
  }

  // Contact Details
  const sumCustName = document.getElementById('sum-cust-name');
  const sumCustContact = document.getElementById('sum-cust-contact');
  if (sumCustName) sumCustName.textContent = appState.customer.fullName || 'Guest Chauffeur Client';
  if (sumCustContact) sumCustContact.textContent = `${appState.customer.email || 'email@example.com'} • ${appState.customer.phoneNumber || '+43...'}`;
}

// Counter Adjustments
function adjustPax(delta) {
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
      const confRef = document.getElementById('conf-ref');
      const confRoute = document.getElementById('conf-route');
      const confDateTime = document.getElementById('conf-datetime');
      const confVehicle = document.getElementById('conf-vehicle');
      const confTotal = document.getElementById('conf-total');
      const confWaBtn = document.getElementById('conf-wa-btn');

      const meta = VEHICLE_META[appState.vehicleCategory];
      const routeDisplay = appState.serviceType === 'TOUR'
        ? (TOURS_DB[appState.tourKey]?.title || '8-Hour Private Day Tour')
        : `${appState.pickupAddress} → ${appState.dropoffAddress}`;

      if (confRef) confRef.textContent = data.booking.reference;
      if (confRoute) confRoute.textContent = routeDisplay;
      if (confDateTime) confDateTime.textContent = `${appState.pickupDate} at ${appState.pickupTime} CET`;
      if (confVehicle) confVehicle.textContent = meta.name;
      if (confTotal) confTotal.textContent = `€${quote.grossTotal.toFixed(2)}`;

      const waText = encodeURIComponent(
        `Hello Omer, I have submitted booking request ${data.booking.reference} for ${routeDisplay} on ${appState.pickupDate} at ${appState.pickupTime}. Vehicle: ${meta.name}. Total: €${quote.grossTotal.toFixed(2)}.`
      );
      if (confWaBtn) confWaBtn.href = `https://wa.me/436606416464?text=${waText}`;

      goToStep(6);
    } else {
      alert(`Booking Submission Alert: ${data.error}`);
    }
  } catch (err) {
    alert(`Could not submit reservation. Please contact dispatch via WhatsApp at +43 660 6416464. Error: ${err.message}`);
  }
}

function resetBookingEngine() {
  appState.currentStep = 1;
  try {
    sessionStorage.removeItem('petrans_booking_state');
  } catch (e) {}
  goToStep(1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
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

// Returning Customer Auto-Persistence and Autofill
function checkAndApplySavedCustomer() {
  try {
    const raw = localStorage.getItem('petrans_saved_customer');
    if (!raw) return;
    const profile = JSON.parse(raw);
    if (!profile || typeof profile !== 'object') return;

    const nameInput = document.getElementById('cust-name');
    const emailInput = document.getElementById('cust-email');
    const phoneInput = document.getElementById('cust-phone');
    const langSelect = document.getElementById('cust-lang');
    const companyInput = document.getElementById('cust-company');
    const taxInput = document.getElementById('cust-tax');
    const streetInput = document.getElementById('cust-street');

    if (nameInput && !nameInput.value && profile.fullName) nameInput.value = profile.fullName;
    if (emailInput && !emailInput.value && profile.email) emailInput.value = profile.email;
    if (phoneInput && !phoneInput.value && profile.phoneNumber) phoneInput.value = profile.phoneNumber;
    if (langSelect && profile.preferredLanguage) langSelect.value = profile.preferredLanguage;
    if (companyInput && !companyInput.value && profile.companyName) companyInput.value = profile.companyName;
    if (taxInput && !taxInput.value && profile.taxNumber) taxInput.value = profile.taxNumber;
    if (streetInput && !streetInput.value && profile.billingStreet) streetInput.value = profile.billingStreet;

    const banner = document.getElementById('returning-customer-banner');
    const nameSpan = document.getElementById('returning-customer-name');
    if (banner) {
      banner.classList.remove('hidden');
      if (nameSpan && profile.fullName) {
        nameSpan.textContent = `Welcome back, ${profile.fullName}!`;
      }
    }
  } catch (e) {
    console.warn('Customer profile autofill skipped:', e);
  }
}

function clearSavedCustomerProfile() {
  try {
    localStorage.removeItem('petrans_saved_customer');
    const ids = ['cust-name', 'cust-email', 'cust-phone', 'cust-company', 'cust-tax', 'cust-street'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const banner = document.getElementById('returning-customer-banner');
    if (banner) banner.classList.add('hidden');
  } catch (e) {}
}

function setupCustomerLookup() {
  const emailInput = document.getElementById('cust-email');
  const phoneInput = document.getElementById('cust-phone');

  const handleLookup = async (query) => {
    if (!query || query.length < 5) return;
    try {
      const res = await fetch(`/api/customers/lookup?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data.found && data.customer) {
        const c = data.customer;
        const nameInput = document.getElementById('cust-name');
        const langSelect = document.getElementById('cust-lang');
        const companyInput = document.getElementById('cust-company');
        const taxInput = document.getElementById('cust-tax');
        const streetInput = document.getElementById('cust-street');

        if (nameInput && !nameInput.value && c.fullName) nameInput.value = c.fullName;
        if (langSelect && c.preferredLanguage) langSelect.value = c.preferredLanguage;
        if (companyInput && !companyInput.value && c.companyName) companyInput.value = c.companyName;
        if (taxInput && !taxInput.value && c.taxNumber) taxInput.value = c.taxNumber;
        if (streetInput && !streetInput.value && c.billingStreet) streetInput.value = c.billingStreet;

        const banner = document.getElementById('returning-customer-banner');
        const nameSpan = document.getElementById('returning-customer-name');
        if (banner) {
          banner.classList.remove('hidden');
          if (nameSpan) nameSpan.textContent = `Welcome back, ${c.fullName || 'Valued Client'}!`;
        }
        localStorage.setItem('petrans_saved_customer', JSON.stringify(c));
      }
    } catch (e) {}
  };

  if (emailInput) {
    emailInput.addEventListener('blur', () => handleLookup(emailInput.value));
  }
  if (phoneInput) {
    phoneInput.addEventListener('blur', () => handleLookup(phoneInput.value));
  }
}

// Senior / Low Vision Accessibility Mode Toggle
function toggleAccessibilityMode() {
  const isElderly = document.documentElement.classList.toggle('elderly-mode');
  try {
    localStorage.setItem('petrans_accessibility', isElderly ? '1' : '0');
  } catch (e) {}
  updateAccessibilityToggleBtn(isElderly);
}

function updateAccessibilityToggleBtn(isActive) {
  const btns = document.querySelectorAll('.accessibility-btn');
  btns.forEach(btn => {
    const textEl = btn.querySelector('.accessibility-text') || btn.querySelector('span');
    if (textEl) {
      textEl.textContent = isActive ? 'Aa- Standard Text' : 'Aa+ Large Text';
    }
  });
}

function initAccessibilityMode() {
  try {
    const saved = localStorage.getItem('petrans_accessibility');
    if (saved === '1') {
      document.documentElement.classList.add('elderly-mode');
      updateAccessibilityToggleBtn(true);
    }
  } catch (e) {}
}

if (typeof document !== 'undefined') {
  initAccessibilityMode();
}
