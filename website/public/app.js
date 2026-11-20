// PETRANS Taxi & Tour Salzburg — Full Client Application Logic

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
  'salzburg-old-town': { name: 'Salzburg City Center / Old Town', distance: 5.5, duration: '18m' }
};

const TOURS_DB = {
  'hallstatt': { title: 'Hallstatt & Salzkammergut Lakes (8 Hours)', price: 450.0, tier: 2 },
  'eagles-nest': { title: 'Eagles Nest & Berchtesgaden (6-8 Hours)', price: 450.0, tier: 1 },
  'werfen-ice-caves': { title: 'Werfen Ice Caves & Fortress (8 Hours)', price: 450.0, tier: 1 },
  'zell-am-see': { title: 'Zell am See & Kaprun Alpine Glacier (8 Hours)', price: 450.0, tier: 2 },
  'bad-gastein': { title: 'Bad Gastein Thermal & Waterfall (8 Hours)', price: 450.0, tier: 2 },
  'innsbruck': { title: 'Innsbruck & Tyrolean Alps Highlights (8-9 Hours)', price: 650.0, tier: 3 }
};

// Global State
const appState = {
  currentStep: 1,
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
  vehicleCategory: 'V_CLASS', // V_CLASS | VITO
  passengerCount: 4,
  largeLuggageCount: 4,
  cabinBagsCount: 2,
  childSeats: { baby: 0, booster: 0 },
  skiEquipment: 0,
  wheelchair: false,
  customer: {
    fullName: '',
    email: '',
    phoneNumber: '',
    preferredLanguage: 'en',
    specialRequests: ''
  },
  paymentMethod: 'PAY_TO_DRIVER_CARD',
  currentQuote: null
};

// Initialize today's date
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('step2-date');
  if (dateInput) {
    dateInput.value = today;
    dateInput.min = today;
  }
  const returnInput = document.getElementById('step2-return-date');
  if (returnInput) {
    returnInput.value = today;
    returnInput.min = today;
  }

  setupEventListeners();
  updateHeroCalculation();
  updateStepperQuote();
});

// Event Listeners setup
function setupEventListeners() {
    // Mobile Navigation Drawer Toggle & Close
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

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (mobileDrawerBackdrop) {
    mobileDrawerBackdrop.addEventListener('click', closeDrawer);
  }

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Hero Tab Switcher
  document.querySelectorAll('.hero-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.hero-tab').forEach(b => {
        b.classList.remove('active', 'bg-gold', 'text-midnight');
        b.classList.add('text-slate-300');
      });
      btn.classList.add('active', 'bg-gold', 'text-midnight');
      btn.classList.remove('text-slate-300');

      const tab = btn.getAttribute('data-tab');
      appState.serviceType = tab;

      const originContainer = document.getElementById('origin-container');
      const destContainer = document.getElementById('dest-container');
      const tourContainer = document.getElementById('tour-container');

      if (tab === 'TOUR') {
        originContainer.classList.add('hidden');
        destContainer.classList.add('hidden');
        tourContainer.classList.remove('hidden');
      } else {
        originContainer.classList.remove('hidden');
        destContainer.classList.remove('hidden');
        tourContainer.classList.add('hidden');
      }

      // Sync stepper buttons too
      document.querySelectorAll('.service-opt-btn').forEach(b => {
        if (b.getAttribute('data-val') === tab) {
          b.click();
        }
      });

      updateHeroCalculation();
    });
  });

  // Hero Dropdown Listeners
  const destSelect = document.getElementById('calc-dest');
  if (destSelect) {
    destSelect.addEventListener('change', (e) => {
      const route = ROUTES_DB[e.target.value] || { name: 'Custom Route', distance: 50, duration: '45m' };
      appState.dropoffAddress = route.name;
      appState.distanceKm = route.distance;
      appState.durationText = route.duration;
      document.getElementById('step1-dropoff').value = route.name;
      updateHeroCalculation();
      updateStepperQuote();
    });
  }

  const tourSelect = document.getElementById('calc-tour');
  if (tourSelect) {
    tourSelect.addEventListener('change', (e) => {
      appState.tourKey = e.target.value;
      document.getElementById('step1-tour-select').value = e.target.value;
      updateHeroCalculation();
      updateStepperQuote();
    });
  }

  // Hero Book Button
  const heroBookBtn = document.getElementById('btn-hero-book');
  if (heroBookBtn) {
    heroBookBtn.addEventListener('click', () => {
      const stepper = document.getElementById('booking-stepper');
      if (stepper) {
        stepper.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Stepper Service Type Buttons
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
      const returnBox = document.getElementById('step2-return-box');

      if (val === 'TOUR') {
        transferFields.classList.add('hidden');
        tourFields.classList.remove('hidden');
        if (returnBox) returnBox.classList.add('hidden');
      } else {
        transferFields.classList.remove('hidden');
        tourFields.classList.add('hidden');
        if (returnBox) {
          if (val === 'RETURN') returnBox.classList.remove('hidden');
          else returnBox.classList.add('hidden');
        }
      }

      updateHeroCalculation();
      updateStepperQuote();
    });
  });

  // Vehicle Cards
  document.querySelectorAll('.vehicle-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.vehicle-card').forEach(c => {
        c.classList.remove('active', 'border-gold', 'bg-gold/10');
        c.classList.add('border-slate-700', 'bg-midnight');
        const check = c.querySelector('.veh-check');
        if (check) check.setAttribute('icon', 'lucide:circle');
      });

      card.classList.add('active', 'border-gold', 'bg-gold/10');
      card.classList.remove('border-slate-700', 'bg-midnight');
      const check = card.querySelector('.veh-check');
      if (check) check.setAttribute('icon', 'lucide:check-circle');

      appState.vehicleCategory = card.getAttribute('data-veh');
      // Iconify handles icons natively
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
      if (appState.currentStep === 6) {
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

  // AI Chat Toggle & Close
  const chatToggle = document.getElementById('ai-chat-toggle');
  const chatWindow = document.getElementById('ai-chat-window');
  const chatClose = document.getElementById('ai-chat-close');

  if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => {
      chatWindow.classList.toggle('hidden');
    });
  }

  if (chatClose && chatWindow) {
    chatClose.addEventListener('click', () => {
      chatWindow.classList.add('hidden');
    });
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

// Pricing Formula Calculation (Client-Side Mirror)
function calculateClientPrice(serviceType, distanceKm, stopsCount, tourKey, tourHours) {
  const MIN_FARE = 45.0;
  const RATE_PER_KM = 2.80;
  let baseFare = 0;
  let stopsFee = 0;
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
    // Point-to-Point Transfer
    const raw = distanceKm * RATE_PER_KM;
    if (raw < MIN_FARE) {
      baseFare = MIN_FARE;
    } else if (distanceKm > 150) {
      baseFare = (150 * RATE_PER_KM) + ((distanceKm - 150) * 2.20);
    } else {
      baseFare = raw;
    }

    stopsFee = stopsCount * 20.0;
    const oneWay = baseFare + stopsFee;

    if (serviceType === 'RETURN') {
      const returnLeg = oneWay * 0.95;
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
    discountAmount: Math.round(discountAmount * 100) / 100
  };
}

// Update Hero Box
function updateHeroCalculation() {
  const quote = calculateClientPrice(
    appState.serviceType,
    appState.distanceKm,
    appState.intermediateStops,
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

// Step Navigation State Machine
function goToStep(step) {
  if (step < 1 || step > 6) return;

  // Validation before leaving Step 5
  if (step === 6 && appState.currentStep === 5) {
    const name = document.getElementById('cust-name').value.trim();
    const email = document.getElementById('cust-email').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();

    if (!name || !email || !phone) {
      alert('Please fill in your name, email, and phone number.');
      return;
    }

    appState.customer.fullName = name;
    appState.customer.email = email;
    appState.customer.phoneNumber = phone;
    appState.customer.preferredLanguage = document.getElementById('cust-lang').value;
    appState.customer.specialRequests = document.getElementById('cust-notes').value;
    updateStep6Summary();
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
    if (step > 1) prevBtn.classList.remove('invisible');
    else prevBtn.classList.add('invisible');
  }

  // Next Button Text
  const nextBtn = document.getElementById('btn-step-next');
  if (nextBtn) {
    if (step === 6) {
      nextBtn.innerHTML = `<span>Submit Booking Request</span> <iconify-icon icon="lucide:check" width="16" height="16"></iconify-icon>`;
    } else {
      nextBtn.innerHTML = `<span>Continue</span> <iconify-icon icon="lucide:arrow-right" width="16" height="16"></iconify-icon>`;
    }
  }

    // Mobile Dynamic Step Counter Update
  const stepNames = {
    1: 'Service & Route',
    2: 'Date & Flight',
    3: 'Vehicle & Capacity',
    4: 'Complimentary Extras',
    5: 'Contact & Payment',
    6: 'Quote Summary'
  };
  const mobStepNum = document.getElementById('mobile-step-num');
  const mobStepName = document.getElementById('mobile-step-name');
  if (mobStepNum) mobStepNum.textContent = step;
  if (mobStepName) mobStepName.textContent = stepNames[step] || '';

  appState.currentStep = step;
}

// Update Step 6 Summary Screen
function updateStep6Summary() {
  const quote = calculateClientPrice(
    appState.serviceType,
    appState.distanceKm,
    appState.intermediateStops,
    appState.tourKey,
    appState.tourHours
  );

  appState.currentQuote = quote;

  document.getElementById('sum-route').textContent =
    appState.serviceType === 'TOUR'
      ? (TOURS_DB[appState.tourKey]?.title || '8-Hour Day Tour')
      : `${appState.pickupAddress} → ${appState.dropoffAddress}`;

  document.getElementById('sum-service-badge').textContent =
    appState.serviceType === 'TOUR'
      ? '8-Hour Private Day Tour'
      : appState.serviceType === 'RETURN'
      ? 'Return Journey (-5%)'
      : 'One-Way Transfer';

  const dateVal = document.getElementById('step2-date').value || 'Selected Date';
  const timeVal = document.getElementById('step2-time').value || '14:30';
  document.getElementById('sum-datetime').textContent = `${dateVal} at ${timeVal}`;

  document.getElementById('sum-vehicle').textContent =
    appState.vehicleCategory === 'V_CLASS' ? 'Mercedes V-Class VIP' : 'Mercedes Vito Tourer';

  document.getElementById('sum-pax').textContent = `${appState.passengerCount} Passengers`;
  document.getElementById('sum-bags').textContent = `${appState.largeLuggageCount} Large Bags`;
  document.getElementById('sum-dist').textContent = appState.distanceKm;
  document.getElementById('sum-base-price').textContent = `€${quote.baseFare.toFixed(2)}`;
  document.getElementById('sum-stops-price').textContent = `€${quote.stopsFee.toFixed(2)}`;
  document.getElementById('sum-discount-price').textContent = `-€${quote.discountAmount.toFixed(2)}`;
  document.getElementById('sum-net-price').textContent = `€${quote.netTotal.toFixed(2)}`;
  document.getElementById('sum-vat-price').textContent = `€${quote.vatAmount.toFixed(2)}`;
  document.getElementById('sum-total-price').textContent = `€${quote.grossTotal.toFixed(2)}`;

  if (quote.discountAmount <= 0) {
    document.getElementById('sum-discount-row').classList.add('hidden');
  } else {
    document.getElementById('sum-discount-row').classList.remove('hidden');
  }
}

function updateStepperQuote() {
  if (appState.currentStep === 6) {
    updateStep6Summary();
  }
}

// Quick Chip Setters
function setPickup(addr) {
  document.getElementById('step1-pickup').value = addr;
  appState.pickupAddress = addr;
}

function setDropoff(addr, km) {
  document.getElementById('step1-dropoff').value = addr;
  appState.dropoffAddress = addr;
  appState.distanceKm = km;
  updateHeroCalculation();
  updateStepperQuote();
}

function setQuickRoute(destName, km) {
  setDropoff(destName, km);
  const stepper = document.getElementById('booking-stepper');
  if (stepper) stepper.scrollIntoView({ behavior: 'smooth' });
}

function selectTour(tourKey) {
  appState.serviceType = 'TOUR';
  appState.tourKey = tourKey;

  // Sync Tabs
  document.querySelectorAll('.hero-tab').forEach(b => {
    if (b.getAttribute('data-tab') === 'TOUR') b.click();
  });

  const stepper = document.getElementById('booking-stepper');
  if (stepper) stepper.scrollIntoView({ behavior: 'smooth' });
}

// Counter Controls
function adjustPax(delta) {
  const newVal = appState.passengerCount + delta;
  if (newVal >= 1 && newVal <= 8) {
    appState.passengerCount = newVal;
    document.getElementById('step3-pax-count').textContent = newVal;
  }
  checkCapacityWarning();
}

function adjustLuggage(delta) {
  const newVal = appState.largeLuggageCount + delta;
  if (newVal >= 0 && newVal <= 8) {
    appState.largeLuggageCount = newVal;
    document.getElementById('step3-luggage-count').textContent = newVal;
  }
  checkCapacityWarning();
}

function adjustCabin(delta) {
  const newVal = appState.cabinBagsCount + delta;
  if (newVal >= 0 && newVal <= 8) {
    appState.cabinBagsCount = newVal;
    document.getElementById('step3-cabin-count').textContent = newVal;
  }
}

function adjustStops(delta) {
  const newVal = appState.intermediateStops + delta;
  if (newVal >= 0 && newVal <= 5) {
    appState.intermediateStops = newVal;
    document.getElementById('step1-stops-count').textContent = newVal;
    updateHeroCalculation();
    updateStepperQuote();
  }
}

function adjustAddon(type, delta) {
  if (type === 'baby') {
    const newVal = Math.max(0, Math.min(4, appState.childSeats.baby + delta));
    appState.childSeats.baby = newVal;
    document.getElementById('addon-baby-count').textContent = newVal;
  } else if (type === 'booster') {
    const newVal = Math.max(0, Math.min(4, appState.childSeats.booster + delta));
    appState.childSeats.booster = newVal;
    document.getElementById('addon-booster-count').textContent = newVal;
  } else if (type === 'ski') {
    const newVal = Math.max(0, Math.min(8, appState.skiEquipment + delta));
    appState.skiEquipment = newVal;
    document.getElementById('addon-ski-count').textContent = newVal;
  }
}

function checkCapacityWarning() {
  const warn = document.getElementById('capacity-warning');
  if (appState.passengerCount === 8 || appState.largeLuggageCount === 8) {
    warn?.classList.remove('hidden');
  } else {
    warn?.classList.add('hidden');
  }
}

// Booking Submission
async function submitBooking() {
  const payload = {
    serviceType: appState.serviceType,
    pickupAddress: document.getElementById('step1-pickup')?.value || appState.pickupAddress,
    dropoffAddress: document.getElementById('step1-dropoff')?.value || appState.dropoffAddress,
    distanceKm: appState.distanceKm,
    intermediateStopsCount: appState.intermediateStops,
    tourKey: appState.tourKey,
    tourHours: appState.tourHours,
    pickupDateTime: `${document.getElementById('step2-date')?.value}T${document.getElementById('step2-time')?.value}:00`,
    flightNumber: document.getElementById('step2-flight')?.value || '',
    returnDateTime: appState.serviceType === 'RETURN' ? `${document.getElementById('step2-return-date')?.value}T${document.getElementById('step2-return-time')?.value}:00` : null,
    vehicleCategory: appState.vehicleCategory,
    passengerCount: appState.passengerCount,
    largeLuggageCount: appState.largeLuggageCount,
    cabinBagsCount: appState.cabinBagsCount,
    childSeatsCount: appState.childSeats.baby,
    boosterSeatsCount: appState.childSeats.booster,
    skiEquipmentCount: appState.skiEquipment,
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
      document.getElementById('modal-ref').textContent = data.booking.reference;
      document.getElementById('modal-status').textContent = data.booking.status;
      document.getElementById('modal-meeting').textContent = data.instructions.meetingPoint;
      document.getElementById('modal-total').textContent = `€${data.booking.pricing.grossTotal.toFixed(2)}`;
      
      const waMsg = encodeURIComponent(`Hello Omer, I submitted booking ${data.booking.reference} for ${data.booking.pickupAddress} on ${data.booking.pickupDateTime}. Total: €${data.booking.pricing.grossTotal.toFixed(2)}.`);
      document.getElementById('modal-wa-link').href = `https://wa.me/436606416464?text=${waMsg}`;

      document.getElementById('booking-modal').classList.remove('hidden');
    } else {
      alert(`Booking Error: ${data.error}`);
    }
  } catch (err) {
    alert(`Submission error: ${err.message}`);
  }
}

function closeModal() {
  document.getElementById('booking-modal').classList.add('hidden');
}

// AI Concierge Chat Logic
async function sendAiMessage(customText) {
  const inputEl = document.getElementById('ai-chat-input');
  const message = customText || inputEl.value.trim();
  if (!message) return;

  const msgContainer = document.getElementById('ai-chat-messages');

  // Append user bubble
  const userDiv = document.createElement('div');
  userDiv.className = 'bg-gold/15 border border-gold/30 p-2.5 rounded-xl text-snow ml-6 text-right';
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
    botDiv.className = 'bg-surface p-3 rounded-xl border border-slate-800 text-slate-200 mr-4';
    botDiv.textContent = data.reply;
    msgContainer.appendChild(botDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  } catch (err) {
    const errDiv = document.createElement('div');
    errDiv.className = 'bg-red-500/10 p-2 rounded text-red-300';
    errDiv.textContent = 'Could not reach AI Concierge. Please contact +43 660 6416464 directly.';
    msgContainer.appendChild(errDiv);
  }
}

function sendAiQuick(text) {
  sendAiMessage(text);
}
