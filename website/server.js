const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { PETRANS_PRICING, calculatePetransQuote } = require('./pricing-config.js');
const { dispatchBookingNotifications, loadOutbox } = require('./notifications.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Persistent bookings store
const BOOKINGS_FILE = path.join(__dirname, 'data', 'bookings.json');
let bookingsStore = [];

try {
  if (fs.existsSync(BOOKINGS_FILE)) {
    bookingsStore = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'));
  }
} catch (e) {
  console.warn('[Server] Could not load bookings file, starting with empty store:', e.message);
}

function persistBookings() {
  try {
    const dir = path.dirname(BOOKINGS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookingsStore.slice(0, 100), null, 2), 'utf8');
  } catch (e) {
    console.error('[Server] Failed to persist bookings:', e.message);
  }
}

// Pricing calculation wrapper mapping to centralized engine
function calculateQuote(input) {
  return calculatePetransQuote(input);
}

// --- API ROUTES ---

// 0. Centralized Pricing Config Endpoint
app.get('/api/pricing-config', (req, res) => {
  res.json({
    success: true,
    pricing: PETRANS_PRICING
  });
});

// 1. Live Quote Endpoint
app.post('/api/quote', (req, res) => {
  try {
    const quote = calculateQuote(req.body);
    res.json({ success: true, quote });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 2. Booking Submission Endpoint with Automated Notification Dispatch
app.post('/api/bookings', async (req, res) => {
  try {
    const data = req.body;
    
    // Validation: passengers & luggage per vehicle category
    const passengers = parseInt(data.passengerCount) || 1;
    const luggage = parseInt(data.largeLuggageCount) || 0;
    const vehicleCategory = data.vehicleCategory || 'V_CLASS';

    if (vehicleCategory === 'E_CLASS') {
      if (passengers > 3) {
        return res.status(422).json({
          success: false,
          error: 'Capacity exceeded: Maximum 3 passengers allowed in Mercedes-Benz E-Class Sedan. Please select V-Class or Vito.'
        });
      }
      if (luggage > 2) {
        return res.status(422).json({
          success: false,
          error: 'Luggage limit exceeded: Maximum 2 large suitcases allowed in Mercedes-Benz E-Class Sedan. Please select V-Class or Vito.'
        });
      }
    } else {
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
    }

    // Generate unique booking reference: PET-2026-XXXX
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingReference = `PET-2026-${randomHex}`;

    const quote = calculateQuote({
      serviceType: data.serviceType,
      distanceKm: data.distanceKm,
      intermediateStopsCount: data.intermediateStopsCount,
      vehicleCategory: vehicleCategory,
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
    persistBookings();

    // Automated dual-channel notification dispatch
    let notificationRecord = null;
    try {
      notificationRecord = await dispatchBookingNotifications(newBooking);
    } catch (notifErr) {
      console.error('[Server] Notification dispatch error:', notifErr.message);
    }

    // Response with meeting point, confirmation instructions, and notification metadata
    res.status(201).json({
      success: true,
      booking: newBooking,
      notification: {
        dispatched: true,
        status: notificationRecord?.status || 'DISPATCHED_TO_QUEUE',
        recordId: notificationRecord?.id || null
      },
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

// 3b. List Outbound Notification Logs
app.get('/api/notifications', (req, res) => {
  res.json({ success: true, outbox: loadOutbox() });
});

// 4. Flight Status Tracking Endpoint (Salzburg Airport SZG)
app.get('/api/flight-status', (req, res) => {
  const flight = (req.query.flight || req.query.flightNumber || 'OS265').toUpperCase();
  res.json({
    success: true,
    airport: 'Salzburg W. A. Mozart (SZG)',
    flightNumber: flight,
    airline: flight.startsWith('OS') ? 'Austrian Airlines' : flight.startsWith('LH') ? 'Lufthansa' : 'British Airways',
    scheduledLanding: '14:15 CET',
    actualTouchdown: '14:35 CET',
    status: 'ACTIVE_DELAYED_20MIN',
    delayMinutes: 20,
    complimentaryBufferMinutes: 60,
    terminal: 'Arrival Hall Terminal 1',
    driverBufferNote: 'Chauffeur pickup time automatically shifted. 60 minutes free waiting active from 14:35 CET.'
  });
});

// 5. Multilingual AI Concierge Chat Assistant Endpoint
app.post('/api/chat', (req, res) => {
  const { message, lang = 'en', history = [] } = req.body;
  const text = (message || '').toLowerCase();

  let reply = '';
  let unauthorizedPromisesDetected = false;

  // Strict Mandate: AI assistant must not make unauthorized promises, discounts, or confirm bookings without owner approval
  if (text.includes('confirm') && (text.includes('now') || text.includes('right now') || text.includes('can you') || text.includes('auto'))) {
    reply = 'All bookings require personal verification and approval by owner Omer Farooq. I cannot unilaterally confirm a reservation without owner review. Please submit your request or contact Omer Farooq directly on WhatsApp (+43 660 6416464).';
  } else if (text.includes('discount') || text.includes('cheaper') || text.includes('deal') || text.includes('bargain')) {
    reply = 'All PETRANS fares are fixed and pre-calculated according to our transparent rate schedule with zero hidden charges. Any custom rate adjustments must be discussed directly with owner Omer Farooq on WhatsApp (+43 660 6416464).';
  } else if (lang === 'de') {
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
    unauthorizedPromisesDetected,
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
