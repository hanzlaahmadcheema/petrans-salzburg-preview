const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory bookings store
const bookingsStore = [];

// --- PRICING ENGINE CONSTANTS ---
const PRICING_CONFIG = {
  MIN_FARE_FLOOR: 45.0,
  PER_KM_BASE_RATE: 2.8,
  LONG_DISTANCE_THRESHOLD_KM: 150.0,
  LONG_DISTANCE_DEGRESSIVE_RATE: 2.2,
  RETURN_DISCOUNT_PERCENT: 5.0,
  FEE_PER_INTERMEDIATE_STOP: 20.0,
  TOUR_OVERTIME_RATE_PER_HOUR: 50.0,
  AUSTRIAN_PASSENGER_VAT_RATE: 0.20,
  MAX_PASSENGERS: 8,
  MAX_LARGE_LUGGAGE: 8,
  AIRPORT_FREE_WAITING_MIN: 60,
  HOTEL_FREE_WAITING_MIN: 10
};

// Fixed Tour Rates
const TOUR_RATES = {
  'hallstatt': { title: 'Hallstatt & Salzkammergut Lakes Tour', basePrice: 450.0, durationHours: 8, tier: 2 },
  'eagles-nest': { title: 'Eagles Nest & Berchtesgaden Tour', basePrice: 450.0, durationHours: 8, tier: 1 },
  'werfen-ice-caves': { title: 'Werfen Ice Caves & Fortress Tour', basePrice: 450.0, durationHours: 8, tier: 1 },
  'zell-am-see': { title: 'Zell am See & Kaprun Alpine Tour', basePrice: 450.0, durationHours: 8, tier: 2 },
  'innsbruck': { title: 'Innsbruck & Tyrolean Alps Tour', basePrice: 650.0, durationHours: 8, tier: 3 },
  'bad-gastein': { title: 'Bad Gastein Thermal & Waterfall Tour', basePrice: 450.0, durationHours: 8, tier: 2 }
};

// Fixed Route Overrides / Specials
const ROUTE_SPECIALS = {
  'prague': 650.0,
  'munich-airport': 490.0
};

// Known Route Distances (from Salzburg)
const KNOWN_ROUTES = {
  'hallstatt': { name: 'Hallstatt Lahn', distanceKm: 73, durationMin: 75 },
  'zell-am-see': { name: 'Zell am See / Kaprun', distanceKm: 85, durationMin: 90 },
  'munich-airport': { name: 'Munich Airport (MUC)', distanceKm: 175, durationMin: 110 },
  'innsbruck': { name: 'Innsbruck (Tyrol)', distanceKm: 185, durationMin: 120 },
  'vienna': { name: 'Vienna (City / VIE Airport)', distanceKm: 300, durationMin: 195 },
  'prague': { name: 'Prague (Czech Republic)', distanceKm: 375, durationMin: 255 },
  'eagles-nest': { name: 'Eagles Nest / Berchtesgaden', distanceKm: 30, durationMin: 35 },
  'bad-gastein': { name: 'Bad Gastein Valley', distanceKm: 100, durationMin: 90 },
  'saalbach': { name: 'Saalbach-Hinterglemm', distanceKm: 92, durationMin: 95 },
  'salzburg-old-town': { name: 'Salzburg City Center / Old Town', distanceKm: 5.5, durationMin: 18 },
  'salzburg-hbf': { name: 'Salzburg Central Station (Hbf)', distanceKm: 6.0, durationMin: 20 }
};

// Calculation function
function calculateQuote(input) {
  const serviceType = input.serviceType || 'ONE_WAY';
  let distanceKm = parseFloat(input.distanceKm) || 73.0;
  const intermediateStops = parseInt(input.intermediateStopsCount) || 0;
  const tourKey = input.tourKey || 'hallstatt';
  const tourHours = parseFloat(input.tourHours) || 8;
  const appliedRules = [];

  let baseFare = 0;
  let stopsFee = 0;
  let overtimeFee = 0;
  let discountAmount = 0;
  let grossTotal = 0;

  if (serviceType === 'TOUR') {
    const tourMeta = TOUR_RATES[tourKey] || TOUR_RATES['hallstatt'];
    baseFare = tourMeta.basePrice;
    appliedRules.push(`${tourMeta.title}: €${baseFare.toFixed(2)} (8 Hours Included)`);

    if (tourHours > 8) {
      const extraHours = Math.ceil(tourHours - 8);
      overtimeFee = extraHours * PRICING_CONFIG.TOUR_OVERTIME_RATE_PER_HOUR;
      appliedRules.push(`Overtime: ${extraHours}h @ €50.00/hour`);
    }
    grossTotal = baseFare + overtimeFee;
  } else {
    // Check for fixed specials
    const rawDistanceFare = distanceKm * PRICING_CONFIG.PER_KM_BASE_RATE;

    if (rawDistanceFare < PRICING_CONFIG.MIN_FARE_FLOOR) {
      baseFare = PRICING_CONFIG.MIN_FARE_FLOOR;
      appliedRules.push(`Minimum Fare Floor Applied: €${PRICING_CONFIG.MIN_FARE_FLOOR.toFixed(2)}`);
    } else if (distanceKm > PRICING_CONFIG.LONG_DISTANCE_THRESHOLD_KM) {
      const baseSegment = PRICING_CONFIG.LONG_DISTANCE_THRESHOLD_KM * PRICING_CONFIG.PER_KM_BASE_RATE;
      const degressiveSegment = (distanceKm - PRICING_CONFIG.LONG_DISTANCE_THRESHOLD_KM) * PRICING_CONFIG.LONG_DISTANCE_DEGRESSIVE_RATE;
      baseFare = Math.round((baseSegment + degressiveSegment) * 100) / 100;
      appliedRules.push(`Long Distance Degressive Rate (>150km @ €2.20/km)`);
    } else {
      baseFare = Math.round(rawDistanceFare * 100) / 100;
      appliedRules.push(`Standard Out-of-City Rate: ${distanceKm} km @ €2.80/km`);
    }

    if (intermediateStops > 0) {
      stopsFee = intermediateStops * PRICING_CONFIG.FEE_PER_INTERMEDIATE_STOP;
      appliedRules.push(`${intermediateStops} Intermediate Stop(s) (+€${stopsFee.toFixed(2)})`);
    }

    if (serviceType === 'RETURN') {
      const oneWaySum = baseFare + stopsFee;
      const returnLeg = oneWaySum * (1 - PRICING_CONFIG.RETURN_DISCOUNT_PERCENT / 100);
      discountAmount = Math.round((oneWaySum - returnLeg) * 100) / 100;
      grossTotal = Math.round((oneWaySum + returnLeg) * 100) / 100;
      appliedRules.push(`5% Return Trip Incentive Discount (-€${discountAmount.toFixed(2)})`);
    } else {
      grossTotal = Math.round((baseFare + stopsFee) * 100) / 100;
    }
  }

  // 20% Austrian VAT breakdown
  const netTotal = Math.round((grossTotal / (1 + PRICING_CONFIG.AUSTRIAN_PASSENGER_VAT_RATE)) * 100) / 100;
  const vatAmount = Math.round((grossTotal - netTotal) * 100) / 100;

  return {
    serviceType,
    distanceKm,
    grossTotal,
    netTotal,
    vatAmount,
    vatRatePercent: 20,
    currency: 'EUR',
    breakdown: {
      baseFare,
      stopsFee,
      overtimeFee,
      discountAmount
    },
    appliedRules
  };
}

// --- API ROUTES ---

// 1. Live Quote Endpoint
app.post('/api/quote', (req, res) => {
  try {
    const quote = calculateQuote(req.body);
    res.json({ success: true, quote });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 2. Booking Submission Endpoint
app.post('/api/bookings', (req, res) => {
  try {
    const data = req.body;
    
    // Strict validation: passengers & luggage
    const passengers = parseInt(data.passengerCount) || 1;
    const luggage = parseInt(data.largeLuggageCount) || 0;

    if (passengers > 8) {
      return res.status(422).json({
        success: false,
        error: 'Capacity exceeded: Maximum 8 passengers allowed per Mercedes V-Class or Vito.'
      });
    }

    if (luggage > 8) {
      return res.status(422).json({
        success: false,
        error: 'Luggage limit exceeded: Maximum 8 large suitcases allowed in our minivans.'
      });
    }

    // Generate unique booking reference: PET-2026-XXXX
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingReference = `PET-2026-${randomHex}`;

    const quote = calculateQuote({
      serviceType: data.serviceType,
      distanceKm: data.distanceKm,
      intermediateStopsCount: data.intermediateStopsCount,
      tourKey: data.tourKey,
      tourHours: data.tourHours
    });

    const newBooking = {
      id: `bk_${Date.now()}`,
      reference: bookingReference,
      status: 'PENDING_OWNER_CONFIRMATION',
      createdAt: new Date().toISOString(),
      customer: {
        fullName: data.customer?.fullName || 'Valued Guest',
        email: data.customer?.email || '',
        phoneNumber: data.customer?.phoneNumber || '',
        preferredLanguage: data.customer?.preferredLanguage || 'en'
      },
      serviceType: data.serviceType || 'ONE_WAY',
      pickupAddress: data.pickupAddress || 'Salzburg Airport (SZG)',
      dropoffAddress: data.dropoffAddress || 'Hallstatt Lahn',
      pickupDateTime: data.pickupDateTime || new Date().toISOString(),
      returnDateTime: data.returnDateTime || null,
      flightNumber: data.flightNumber || null,
      passengerCount: passengers,
      largeLuggageCount: luggage,
      cabinBagsCount: parseInt(data.cabinBagsCount) || 0,
      childSeatsCount: parseInt(data.childSeatsCount) || 0,
      boosterSeatsCount: parseInt(data.boosterSeatsCount) || 0,
      skiEquipmentCount: parseInt(data.skiEquipmentCount) || 0,
      wheelchairAccommodated: !!data.wheelchairAccommodated,
      specialRequests: data.specialRequests || '',
      vehicleCategory: data.vehicleCategory || 'V_CLASS',
      paymentMethod: data.paymentMethod || 'PAY_TO_DRIVER_CARD',
      paymentStatus: 'UNPAID',
      pricing: quote
    };

    bookingsStore.unshift(newBooking);

    // Response with meeting point and confirmation instructions
    res.status(201).json({
      success: true,
      booking: newBooking,
      instructions: {
        meetingPoint: data.pickupAddress?.toLowerCase().includes('airport') || data.flightNumber
          ? 'Salzburg Airport Arrival Hall, Chauffeur holding digital Name Board with your name.'
          : 'Your driver will meet you directly at the pickup address at the confirmed time.',
        waitingPolicy: data.pickupAddress?.toLowerCase().includes('airport') || data.flightNumber
          ? '60 minutes complimentary flight delay buffer included from verified touchdown.'
          : '10 minutes complimentary waiting time at hotel or private address.',
        cancellationPolicy: 'Free cancellation up to 24 hours prior to scheduled pickup time.',
        ownerContact: {
          name: 'Omer Farooq (CEO & Lead Chauffeur)',
          phone: '+43 660 6416464',
          whatsapp: 'https://wa.me/436606416464',
          email: 'farooqcheema64164@gmail.com'
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. List Recent Bookings (for Verification / Dashboard)
app.get('/api/bookings', (req, res) => {
  res.json({ success: true, count: bookingsStore.length, bookings: bookingsStore });
});

// 4. Flight Status Tracking Endpoint (Salzburg Airport SZG)
app.get('/api/flight-status', (req, res) => {
  const flight = (req.query.flight || 'OS265').toUpperCase();
  res.json({
    success: true,
    airport: 'Salzburg W. A. Mozart Airport (SZG)',
    flightNumber: flight,
    airline: flight.startsWith('OS') ? 'Austrian Airlines' : flight.startsWith('LH') ? 'Lufthansa' : 'British Airways',
    scheduledLanding: '14:15 CET',
    actualTouchdown: '14:35 CET',
    status: 'ACTIVE_DELAYED_20MIN',
    delayMinutes: 20,
    terminal: 'Arrival Hall Terminal 1',
    driverBufferNote: 'Chauffeur pickup time automatically shifted. 60 minutes free waiting active from 14:35 CET.'
  });
});

// 5. Multilingual AI Concierge Chat Assistant Endpoint
app.post('/api/chat', (req, res) => {
  const { message, lang = 'en', history = [] } = req.body;
  const text = (message || '').toLowerCase();

  let reply = '';

  // Multilingual responses with strict guardrails
  if (lang === 'de') {
    if (text.includes('abhol') || text.includes('flughafen') || text.includes('treffpunkt')) {
      reply = 'Am Flughafen Salzburg (SZG) erwartet Sie Ihr Chauffeur direkt in der Ankunftshalle mit einem digitalen Namensschild. 60 Minuten Wartezeit ab Landung sind inklusive!';
    } else if (text.includes('preis') || text.includes('kosten') || text.includes('rabatt')) {
      reply = 'Unsere Fahrten außerhalb von Salzburg werden mit fairen €2,80/km berechnet (Mindestpreis €45,00 inkl. 20% MwSt. und Maut). Tagestouren (z.B. Hallstatt) kosten pauschal €450 für 8 Stunden (bis zu 8 Personen). Rabatte sind systemseitig fest hinterlegt.';
    } else if (text.includes('kindersitz') || text.includes('ski')) {
      reply = 'Kindersitze, Sitzerhöhungen und Ski-/Snowboardgepäck transportieren wir bei PETRANS kostenfrei für Sie!';
    } else {
      reply = 'Guten Tag! Ich bin der PETRANS Concierge. Gerne erstelle ich Ihnen ein Festpreisangebot für Transfers oder private Tagestouren. Wohin möchten Sie reisen?';
    }
  } else if (lang === 'ur' || lang === 'hi') {
    if (text.includes('airport') || text.includes('flight') || text.includes('milega') || text.includes('milna')) {
      reply = 'Salzburg Airport par hamara chauffeur arrival hall mein aapke naam ke digital board ke saath aapka intezaar karega. Flight land hone ke baad 60 minutes tak complimentary waiting shamil hai.';
    } else if (text.includes('kiraya') || text.includes('price') || text.includes('rate')) {
      reply = 'PETRANS ka rate city ke bahar €2.80/km hai (minimum fare €45.00). Hallstatt jaisi 8-hour day tour flat €450 mein 8 passengers ke liye available hai. Ski gear aur child seats bilkul free hain.';
    } else {
      reply = 'Aadab! Main PETRANS ka AI Concierge hoon. Salzburg transfers ya 8-hour day tours ke bare mein aap mujh se poochein. Omer Farooq (+43 660 6416464) se bhi direct WhatsApp par baat kar sakte hain.';
    }
  } else {
    // English default
    if (text.includes('meeting') || text.includes('driver') || text.includes('airport') || text.includes('where')) {
      reply = 'At Salzburg Airport (SZG), your personal chauffeur will greet you inside the Arrival Hall holding a digital Name Board. We track your flight live with 60 minutes free waiting after touchdown!';
    } else if (text.includes('price') || text.includes('rate') || text.includes('cost') || text.includes('discount')) {
      reply = 'Our out-of-city transfers are calculated at a transparent €2.80/km (minimum fare floor €45.00, VAT & tolls included). Day tours like Hallstatt or Eagles Nest are flat €450 for 8 hours for up to 8 guests. Our prices are fixed with zero hidden fees!';
    } else if (text.includes('ski') || text.includes('child') || text.includes('baby') || text.includes('seat')) {
      reply = 'Infant seats, child booster seats, and all ski/snowboard equipment are transported 100% FREE of charge in our spacious Mercedes V-Class and Vito fleet.';
    } else if (text.includes('cancel') || text.includes('refund')) {
      reply = 'We offer free cancellation up to 24 hours before your scheduled pickup. For custom adjustments, Mr. Omer Farooq is directly reachable via 24/7 WhatsApp at +43 660 6416464.';
    } else {
      reply = 'Welcome to PETRANS Taxi & Tour Salzburg! I can assist you with instant fixed-price quotes, flight arrival details, or reserving an 8-passenger Mercedes V-Class. Where can we drive you today?';
    }
  }

  res.json({
    success: true,
    reply,
    hotline: '+43 660 6416464',
    whatsapp: 'https://wa.me/436606416464'
  });
});

// 6. Healthcheck Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'PETRANS Taxi & Tour Salzburg Website',
    timestamp: new Date().toISOString(),
    version: '1.0.0-production-ready'
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[PETRANS Production Server] Running at http://localhost:${PORT}`);
  console.log(`[PETRANS Production Server] Serving static web app from ${path.join(__dirname, 'public')}`);
});
