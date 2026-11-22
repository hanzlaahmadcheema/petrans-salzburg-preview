/**
 * PETRANS Taxi & Tour Salzburg — Centralized Pricing Configuration
 * Single Source of Truth for Backend (server.js) & Frontend (booking.js, app.js, tours, destinations)
 * 
 * Rates are calibrated against client questionnaire and Austrian statutory standards.
 * All passenger fares are gross (Brutto) and include 20% Austrian VAT, Austrian highway vignettes, and road tolls.
 */

const PETRANS_PRICING = {
  // Vehicle Distance Rates (€/km)
  // Baseline rates: E-Class: €2.50/km, V-Class: €2.60/km, Vito Tourer: €2.80/km
  // Note: Owner clarification pending on alternative €3.55/km (E-Class) and €3.65/km (Fleet) rates.
  VEHICLE_RATES: {
    'E_CLASS': 2.50,
    'V_CLASS': 2.60,
    'VITO':    2.80
  },

  // Mandatory Minimum Fare Floor for short journeys (< 16-18 km)
  MIN_FARE_FLOOR: 45.0,

  // Default Distance Rate (V-Class baseline)
  DEFAULT_RATE_PER_KM: 2.60,

  // Degressive Distance Threshold & Rate (for long-distance transfers > 150 km)
  LONG_DISTANCE_THRESHOLD_KM: 150.0,
  LONG_DISTANCE_DEGRESSIVE_RATE: 2.20,

  // Return Journey Incentive Discount (applied to return leg)
  RETURN_DISCOUNT_PERCENT: 5.0,

  // Extra Stop Fee
  FEE_PER_INTERMEDIATE_STOP: 20.0,

  // Tour Overtime Rate (per hour beyond standard 8 hours)
  TOUR_OVERTIME_RATE_PER_HOUR: 50.0,

  // Hourly Chauffeur Hire Rates (As-Directed Service)
  HOURLY_RATES: {
    E_CLASS: 80.0,
    V_CLASS: 85.0,
    VITO: 85.0,
    minHours: 4,
    includedKmPerHour: 25,
    extraKmRate: 2.50
  },

  // Statutory Austrian Passenger Transport VAT Rate
  AUSTRIAN_PASSENGER_VAT_RATE: 0.20,

  // Maximum Capacities per Vehicle Category
  CAPACITIES: {
    'E_CLASS': {
      name: 'Mercedes-Benz E-Class',
      subtitle: 'Executive Chauffeur Sedan',
      badge: 'Executive Chauffeur Sedan',
      ratePerKm: 2.50,
      baseFloor: 45.0,
      maxPassengers: 3,
      maxLargeLuggage: 2,
      maxCabinBags: 2,
      slug: 'e-class'
    },
    'V_CLASS': {
      name: 'Mercedes-Benz V-Class',
      subtitle: 'Exclusive VIP Chauffeur',
      badge: 'Exclusive VIP Chauffeur',
      ratePerKm: 2.60,
      baseFloor: 45.0,
      maxPassengers: 8,
      maxLargeLuggage: 8,
      maxCabinBags: 8,
      slug: 'v-class'
    },
    'VITO': {
      name: 'Mercedes-Benz Vito Tourer',
      subtitle: '4MATIC Alpine Specialist',
      badge: 'Alpine 4MATIC Specialist',
      ratePerKm: 2.80,
      baseFloor: 45.0,
      maxPassengers: 8,
      maxLargeLuggage: 8,
      maxCabinBags: 8,
      slug: 'vito'
    }
  },

  // Waiting Time Policies (Minutes)
  AIRPORT_FREE_WAITING_MIN: 60,
  HOTEL_FREE_WAITING_MIN: 10,

  // Fixed 8-Hour Private Day Tours (Prices include vehicle, driver, fuel, tolls; exclude meals & entry tickets)
  TOUR_RATES: {
    'hallstatt': {
      title: 'Hallstatt & Salzkammergut Lakes Tour',
      basePrice: 450.0,
      durationHours: 8,
      distanceKm: 73,
      tier: 2,
      description: 'World Heritage Alpine lake village, Skywalk viewpoint, and Salzkammergut panorama.'
    },
    'eagles-nest': {
      title: "Eagle's Nest & Berchtesgaden Tour",
      basePrice: 450.0,
      durationHours: 8,
      distanceKm: 30,
      tier: 1,
      description: 'Historic Kehlsteinhaus summit, Königsee emerald fjord, and Bavarian alpine peaks.'
    },
    'werfen-ice-caves': {
      title: 'Werfen Ice Caves & Hohenwerfen Fortress Tour',
      basePrice: 450.0,
      durationHours: 8,
      distanceKm: 50,
      tier: 1,
      description: "World's largest ice cave (Eisriesenwelt) and 900-year-old medieval falconry fortress."
    },
    'zell-am-see': {
      title: 'Zell am See & Kaprun Alpine Glacier Tour',
      basePrice: 450.0,
      durationHours: 8,
      distanceKm: 85,
      tier: 2,
      description: 'Kitzsteinhorn 3,000m glacier, Zeller See lake promenade, and High Alpine reservoirs.'
    },
    'innsbruck': {
      title: 'Innsbruck & Tyrolean Alps Highlights Tour',
      basePrice: 650.0,
      durationHours: 8,
      distanceKm: 185,
      tier: 3,
      description: 'Imperial Hofburg palace, Golden Roof, Nordkette cable railway, and Tyrolean alpine vistas.'
    },
    'swarovski-crystal-worlds': {
      title: 'Swarovski Crystal Worlds & Hall in Tirol Tour',
      basePrice: 550.0,
      durationHours: 8,
      distanceKm: 165,
      tier: 2,
      description: 'Iconic André Heller Giant, Chamber of Wonders, and historic medieval mint town of Hall.'
    },
    'bad-gastein': {
      title: 'Bad Gastein & Bad Hofgastein Valley Tour',
      basePrice: 450.0,
      durationHours: 8,
      distanceKm: 100,
      tier: 2,
      description: 'Famous roaring town-center waterfall, Belle Époque architecture, and thermal alpine spas.'
    }
  },

  // Fixed Route Specials / Intercity Long-Distance Transfers
  ROUTE_SPECIALS: {
    'munich-airport': {
      title: 'Salzburg to Munich Airport (MUC)',
      basePrice: 490.0,
      distanceKm: 175,
      durationMin: 110
    },
    'vienna': {
      title: 'Salzburg to Vienna (City / VIE Airport)',
      basePrice: 660.0,
      distanceKm: 300,
      durationMin: 195
    },
    'prague': {
      title: 'Salzburg to Prague Cross-Border Transfer',
      basePrice: 650.0,
      distanceKm: 375,
      durationMin: 255
    }
  },

  // Known Geographic Route Distances (from Salzburg Center / Airport)
  KNOWN_ROUTES: {
    'hallstatt': { name: 'Hallstatt Lahn Terminal', distanceKm: 73, durationMin: 75, durationText: '1h 15m' },
    'zell-am-see': { name: 'Zell am See / Kaprun', distanceKm: 85, durationMin: 90, durationText: '1h 30m' },
    'werfen-ice-caves': { name: 'Werfen Ice Caves & Fortress', distanceKm: 50, durationMin: 45, durationText: '45m' },
    'bad-gastein': { name: 'Bad Gastein Valley', distanceKm: 100, durationMin: 90, durationText: '1h 30m' },
    'eagles-nest': { name: 'Eagles Nest / Berchtesgaden', distanceKm: 30, durationMin: 35, durationText: '35m' },
    'swarovski-crystal-worlds': { name: 'Swarovski Crystal Worlds (Wattens)', distanceKm: 165, durationMin: 115, durationText: '1h 55m' },
    'munich-airport': { name: 'Munich Airport (MUC)', distanceKm: 175, durationMin: 110, durationText: '1h 50m' },
    'munich': { name: 'Munich City Center', distanceKm: 145, durationMin: 105, durationText: '1h 45m' },
    'innsbruck': { name: 'Innsbruck (Tyrol)', distanceKm: 185, durationMin: 120, durationText: '2h 00m' },
    'vienna': { name: 'Vienna (City / VIE Airport)', distanceKm: 300, durationMin: 195, durationText: '3h 15m' },
    'prague': { name: 'Prague (Czech Republic)', distanceKm: 375, durationMin: 255, durationText: '4h 15m' },
    'saalbach': { name: 'Saalbach-Hinterglemm', distanceKm: 92, durationMin: 95, durationText: '1h 35m' },
    'salzburg-old-town': { name: 'Salzburg City Center / Old Town', distanceKm: 5.5, durationMin: 18, durationText: '18m' },
    'salzburg-hbf': { name: 'Salzburg Central Station (Hbf)', distanceKm: 6.0, durationMin: 20, durationText: '20m' }
  }
};

/**
 * Universal Quote Calculator Function
 * Implements strict Austrian consumer transparency and pricing business logic.
 */
function calculatePetransQuote(input) {
  const serviceType = input.serviceType || 'ONE_WAY';
  let distanceKm = parseFloat(input.distanceKm) || 73.0;
  const intermediateStops = parseInt(input.intermediateStopsCount) || 0;
  const tourKey = (input.tourKey || 'hallstatt').toLowerCase();
  const tourHours = parseFloat(input.tourHours) || 8;
  const vehicleCategory = input.vehicleCategory || 'V_CLASS';
  const ratePerKm = PETRANS_PRICING.VEHICLE_RATES[vehicleCategory] || PETRANS_PRICING.DEFAULT_RATE_PER_KM;
  const appliedRules = [];

  let baseFare = 0;
  let stopsFee = 0;
  let overtimeFee = 0;
  let discountAmount = 0;
  let grossTotal = 0;

  if (serviceType === 'HOURLY') {
    const hours = Math.max(4, parseInt(input.hourlyHours || input.hours || input.durationHours) || 4);
    const hourlyRate = PETRANS_PRICING.HOURLY_RATES[vehicleCategory] || PETRANS_PRICING.HOURLY_RATES.V_CLASS;
    baseFare = hours * hourlyRate;
    appliedRules.push(`Hourly Chauffeur (${vehicleCategory}): ${hours} Hours @ €${hourlyRate.toFixed(2)}/hour (${hours * 25} km included)`);
    grossTotal = baseFare;
  } else if (serviceType === 'TOUR') {
    const tourMeta = PETRANS_PRICING.TOUR_RATES[tourKey] || PETRANS_PRICING.TOUR_RATES['hallstatt'];
    baseFare = tourMeta.basePrice;
    appliedRules.push(`${tourMeta.title}: €${baseFare.toFixed(2)} (8 Hours Included)`);

    if (tourHours > 8) {
      const extraHours = Math.ceil(tourHours - 8);
      overtimeFee = extraHours * PETRANS_PRICING.TOUR_OVERTIME_RATE_PER_HOUR;
      appliedRules.push(`Overtime: ${extraHours}h @ €50.00/hour (+€${overtimeFee.toFixed(2)})`);
    }
    grossTotal = baseFare + overtimeFee;
  } else {
    const rawDistanceFare = distanceKm * ratePerKm;

    if (rawDistanceFare < PETRANS_PRICING.MIN_FARE_FLOOR) {
      baseFare = PETRANS_PRICING.MIN_FARE_FLOOR;
      appliedRules.push(`Minimum Base Floor Applied: €${PETRANS_PRICING.MIN_FARE_FLOOR.toFixed(2)}`);
    } else if (distanceKm > PETRANS_PRICING.LONG_DISTANCE_THRESHOLD_KM) {
      const baseSegment = PETRANS_PRICING.LONG_DISTANCE_THRESHOLD_KM * ratePerKm;
      const degressiveSegment = (distanceKm - PETRANS_PRICING.LONG_DISTANCE_THRESHOLD_KM) * PETRANS_PRICING.LONG_DISTANCE_DEGRESSIVE_RATE;
      baseFare = Math.round((baseSegment + degressiveSegment) * 100) / 100;
      appliedRules.push(`Long Distance Degressive Rate (>150km @ €${PETRANS_PRICING.LONG_DISTANCE_DEGRESSIVE_RATE.toFixed(2)}/km)`);
    } else {
      baseFare = Math.round(rawDistanceFare * 100) / 100;
      appliedRules.push(`Distance Rate (${vehicleCategory}): ${distanceKm} km @ €${ratePerKm.toFixed(2)}/km`);
    }

    if (intermediateStops > 0) {
      stopsFee = intermediateStops * PETRANS_PRICING.FEE_PER_INTERMEDIATE_STOP;
      appliedRules.push(`${intermediateStops} Intermediate Stop(s) (+€${stopsFee.toFixed(2)})`);
    }

    if (serviceType === 'RETURN') {
      const oneWaySum = baseFare + stopsFee;
      const returnLeg = oneWaySum * (1 - PETRANS_PRICING.RETURN_DISCOUNT_PERCENT / 100);
      discountAmount = Math.round((oneWaySum - returnLeg) * 100) / 100;
      grossTotal = Math.round((oneWaySum + returnLeg) * 100) / 100;
      appliedRules.push(`5% Return Trip Incentive Discount (-€${discountAmount.toFixed(2)})`);
    } else {
      grossTotal = Math.round((baseFare + stopsFee) * 100) / 100;
    }
  }

  // 20% Austrian VAT Breakdown (Gross / 1.20 = Net)
  const netTotal = Math.round((grossTotal / (1 + PETRANS_PRICING.AUSTRIAN_PASSENGER_VAT_RATE)) * 100) / 100;
  const vatAmount = Math.round((grossTotal - netTotal) * 100) / 100;

  return {
    serviceType,
    distanceKm,
    ratePerKm,
    grossTotal,
    netTotal,
    vatAmount,
    vatRatePercent: 20,
    currency: 'EUR',
    discountAmount,
    overtimeFee,
    breakdown: {
      baseFare,
      stopsFee,
      overtimeFee,
      discountAmount
    },
    appliedRules
  };
}

// Universal Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PETRANS_PRICING,
    calculatePetransQuote
  };
}

if (typeof window !== 'undefined') {
  window.PETRANS_PRICING = PETRANS_PRICING;
  window.calculatePetransQuote = calculatePetransQuote;
}
