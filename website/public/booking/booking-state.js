/**
 * PETRANS Taxi & Tour Salzburg — Multi-Page Booking State Manager
 * Handles shared booking state, URL synchronization, session persistence,
 * and centralized pricing calculation across dedicated step pages.
 * Fully compliant with Zero Unicode Emojis Policy and Austrian FAGG § 8.
 */

const ROUTES_DB = {
  'hallstatt': { name: 'Hallstatt Lahn Terminal', distance: 73, duration: '1h 15m', hero: '/images/destinations/hallstatt-hero.webp' },
  'zell-am-see': { name: 'Zell am See / Kaprun', distance: 85, duration: '1h 30m', hero: '/images/destinations/zell-am-see-hero.webp' },
  'munich-airport': { name: 'Munich Airport (MUC)', distance: 175, duration: '1h 50m', hero: '/images/destinations/munich-airport-hero.webp' },
  'innsbruck': { name: 'Innsbruck Highlights', distance: 185, duration: '2h 00m', hero: '/images/destinations/innsbruck-hero.webp' },
  'bad-gastein': { name: 'Bad Gastein Valley', distance: 100, duration: '1h 30m', hero: '/images/destinations/bad-gastein-hero.webp' },
  'eagles-nest': { name: 'Eagles Nest / Berchtesgaden', distance: 30, duration: '35m', hero: '/images/destinations/eagles-nest-hero.webp' },
  'saalbach': { name: 'Saalbach-Hinterglemm', distance: 92, duration: '1h 35m', hero: '/images/destinations/zell-am-see-hero.webp' },
  'vienna': { name: 'Vienna City Center / VIE', distance: 300, duration: '3h 15m', hero: '/images/destinations/vienna-hero.webp' },
  'prague': { name: 'Prague Cross-Border', distance: 375, duration: '4h 15m', hero: '/images/destinations/prague-hero.webp' },
  'werfen-ice-caves': { name: 'Werfen Ice Caves & Fortress', distance: 55, duration: '50m', hero: '/images/destinations/werfen-ice-caves-hero.webp' },
  'swarovski-crystal-worlds': { name: 'Swarovski Crystal Worlds (Wattens)', distance: 165, duration: '1h 45m', hero: '/images/destinations/swarovski-crystal-worlds-hero.webp' },
  'salzburg-old-town': { name: 'Salzburg City Center / Old Town', distance: 5.5, duration: '18m', hero: '/images/salzburg-hero.jpg' }
};

const TOURS_DB = {
  'hallstatt': { title: 'Hallstatt & Salzkammergut Lakes (8 Hours)', price: 450.0, hero: '/images/destinations/hallstatt-hero.webp', distance: 160 },
  'eagles-nest': { title: 'Eagles Nest & Berchtesgaden (6-8 Hours)', price: 450.0, hero: '/images/destinations/eagles-nest-hero.webp', distance: 80 },
  'werfen-ice-caves': { title: 'Werfen Ice Caves & Fortress (8 Hours)', price: 450.0, hero: '/images/destinations/werfen-ice-caves-hero.webp', distance: 110 },
  'zell-am-see': { title: 'Zell am See & Kaprun Alpine Glacier (8 Hours)', price: 450.0, hero: '/images/destinations/zell-am-see-hero.webp', distance: 190 },
  'bad-gastein': { title: 'Bad Gastein Thermal & Waterfall (8 Hours)', price: 450.0, hero: '/images/destinations/bad-gastein-hero.webp', distance: 210 },
  'swarovski-crystal-worlds': { title: 'Swarovski Crystal Worlds & Hall in Tirol (8 Hours)', price: 550.0, hero: '/images/destinations/swarovski-crystal-worlds-hero.webp', distance: 340 },
  'innsbruck': { title: 'Innsbruck & Tyrolean Alps Highlights (8-9 Hours)', price: 650.0, hero: '/images/destinations/innsbruck-hero.webp', distance: 380 }
};

const VEHICLES_DB = {
  'E_CLASS': {
    slug: 'e-class',
    name: 'Mercedes-Benz E-Class',
    badge: 'Executive Chauffeur Sedan',
    subtitle: 'Obsidian Black Metallic • W214 Series',
    ratePerKm: 2.50,
    baseFloor: 45.00,
    maxPax: 3,
    maxLuggage: 2,
    maxCabin: 2,
    image: '/images/mercedes-e-class.png',
    peek: '/images/mercedes-e-class-peek.webp',
    description: 'Executive sedan in Obsidian Black Metallic for solo travelers, couples & corporate executives.'
  },
  'V_CLASS': {
    slug: 'v-class',
    name: 'Mercedes-Benz V-Class',
    badge: 'Exclusive VIP Chauffeur',
    subtitle: 'Obsidian Black Metallic • W447 Exclusive',
    ratePerKm: 2.60,
    baseFloor: 45.00,
    maxPax: 8,
    maxLuggage: 8,
    maxCabin: 8,
    image: '/images/mercedes-v-class.png',
    peek: '/images/mercedes-v-class-peek.webp',
    description: 'VIP flagship luxury minivan in Obsidian Black Metallic with nappa leather seating.'
  },
  'VITO': {
    slug: 'vito',
    name: 'Mercedes-Benz Vito Tourer',
    badge: 'Alpine 4MATIC Specialist',
    subtitle: 'Obsidian Black Metallic • 4MATIC All-Wheel',
    ratePerKm: 2.60,
    baseFloor: 45.00,
    maxPax: 8,
    maxLuggage: 8,
    maxCabin: 8,
    image: '/images/mercedes-vito.png',
    peek: '/images/mercedes-vito-peek.webp',
    description: 'Obsidian Black 4MATIC all-wheel drive minivan for alpine ski transport and large groups.'
  }
};

const DEFAULT_STATE = {
  serviceType: 'ONE_WAY', // ONE_WAY | RETURN | TOUR
  vehicleCategory: 'E_CLASS',
  pickupAddress: 'Salzburg Airport W. A. Mozart (SZG)',
  dropoffAddress: 'Hallstatt Lahn Terminal',
  routeKey: 'hallstatt',
  distanceKm: 73.0,
  durationText: '1h 15m',
  tourKey: 'hallstatt',
  tourHours: 8,
  pickupDate: '',
  pickupTime: '14:30',
  returnDate: '',
  returnTime: '10:00',
  flightNumber: '',
  passengerCount: 2,
  largeLuggageCount: 2,
  cabinBagsCount: 2,
  childSeats: 0,
  boosterSeats: 0,
  skiEquipment: 0,
  wheelchair: false,
  specialRequests: '',
  customer: {
    fullName: '',
    email: '',
    phoneNumber: ''
  },
  paymentMethod: 'PAY_TO_DRIVER_CARD'
};

const STORAGE_KEY = 'petrans_booking_state';

class BookingStateManager {
  constructor() {
    this.state = Object.assign({}, DEFAULT_STATE);
    this.init();
  }

  init() {
    this.loadFromSession();
    this.hydrateFromUrl();
    this.ensureDates();
  }

  loadFromSession() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = Object.assign({}, this.state, parsed);
      }
    } catch (e) {
      console.warn('Session load error:', e);
    }
  }

  save() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Session save error:', e);
    }
  }

  ensureDates() {
    const today = new Date().toISOString().split('T')[0];
    if (!this.state.pickupDate) {
      this.state.pickupDate = today;
    }
    if (!this.state.returnDate) {
      this.state.returnDate = today;
    }
  }

  hydrateFromUrl() {
    const params = new URLSearchParams(window.location.search);

    // Vehicle
    const vParam = params.get('vehicle') || params.get('car');
    if (vParam) {
      const clean = vParam.toLowerCase().replace('-', '_');
      if (clean === 'e_class' || clean === 'eclass') this.state.vehicleCategory = 'E_CLASS';
      else if (clean === 'v_class' || clean === 'vclass') this.state.vehicleCategory = 'V_CLASS';
      else if (clean === 'vito' || clean === 'vito_tourer') this.state.vehicleCategory = 'VITO';
    }

    // Service Type
    const service = params.get('service');
    if (service) {
      if (service.toLowerCase().includes('return')) this.state.serviceType = 'RETURN';
      else if (service.toLowerCase().includes('tour')) this.state.serviceType = 'TOUR';
      else this.state.serviceType = 'ONE_WAY';
    }

    // Tour
    const tour = params.get('tour');
    if (tour && TOURS_DB[tour]) {
      this.state.tourKey = tour;
      this.state.serviceType = 'TOUR';
      this.state.dropoffAddress = TOURS_DB[tour].title;
      this.state.distanceKm = TOURS_DB[tour].distance || 160;
    }

    // Destination / Route
    const dest = params.get('destination') || params.get('route');
    if (dest && ROUTES_DB[dest]) {
      this.state.routeKey = dest;
      this.state.dropoffAddress = ROUTES_DB[dest].name;
      this.state.distanceKm = ROUTES_DB[dest].distance;
      this.state.durationText = ROUTES_DB[dest].duration;
    }

    // Pickup & Dropoff
    const p = params.get('pickup');
    if (p) this.state.pickupAddress = p;
    const d = params.get('dropoff');
    if (d) this.state.dropoffAddress = d;

    // Direct distance
    const dist = params.get('distance') || params.get('km');
    if (dist && !isNaN(parseFloat(dist))) {
      this.state.distanceKm = parseFloat(dist);
    }

    // Check pax & luggage
    const pax = params.get('pax');
    if (pax && !isNaN(parseInt(pax))) this.state.passengerCount = parseInt(pax);
    const lug = params.get('luggage');
    if (lug && !isNaN(parseInt(lug))) this.state.largeLuggageCount = parseInt(lug);

    this.save();
  }

  setVehicle(category) {
    if (VEHICLES_DB[category]) {
      this.state.vehicleCategory = category;
      // Cap capacities if switching to E-Class
      if (category === 'E_CLASS') {
        if (this.state.passengerCount > 3) this.state.passengerCount = 3;
        if (this.state.largeLuggageCount > 2) this.state.largeLuggageCount = 2;
        if (this.state.cabinBagsCount > 2) this.state.cabinBagsCount = 2;
      }
      this.save();
    }
  }

  setPlace(pickup, dropoff, distanceKm = 73, durationText = '1h 15m', serviceType = 'ONE_WAY', routeKey = '') {
    this.state.pickupAddress = pickup;
    this.state.dropoffAddress = dropoff;
    this.state.distanceKm = distanceKm;
    this.state.durationText = durationText;
    this.state.serviceType = serviceType;
    if (routeKey) this.state.routeKey = routeKey;
    this.save();
  }

  setTour(tourKey) {
    if (TOURS_DB[tourKey]) {
      this.state.serviceType = 'TOUR';
      this.state.tourKey = tourKey;
      this.state.dropoffAddress = TOURS_DB[tourKey].title;
      this.state.distanceKm = TOURS_DB[tourKey].distance;
      this.save();
    }
  }

  setDetails(details) {
    Object.assign(this.state, details);
    this.save();
  }

  setCustomer(customer) {
    Object.assign(this.state.customer, customer);
    this.save();
  }

  // Centralized Quote Calculation
  calculateQuote() {
    const veh = VEHICLES_DB[this.state.vehicleCategory] || VEHICLES_DB['E_CLASS'];
    
    if (this.state.serviceType === 'TOUR') {
      const tour = TOURS_DB[this.state.tourKey] || TOURS_DB['hallstatt'];
      let baseTourRate = tour.price;
      const extraHours = Math.max(0, (this.state.tourHours || 8) - 8);
      const overtimeCharge = extraHours * 50.00;
      const total = baseTourRate + overtimeCharge;
      return {
        serviceType: 'TOUR',
        tourTitle: tour.title,
        baseRate: baseTourRate,
        overtimeCharge,
        grossTotal: total,
        depositRequired: 0.00,
        balanceDue: total,
        formattedTotal: `€${total.toFixed(2)}`,
        vehicleName: veh.name,
        currency: 'EUR'
      };
    }

    const dist = Math.max(0, this.state.distanceKm || 5.5);
    let oneWayFare = 0;

    if (dist <= 150) {
      oneWayFare = dist * veh.ratePerKm;
    } else {
      oneWayFare = (150 * veh.ratePerKm) + ((dist - 150) * 2.20);
    }

    // Apply minimum base floor €45.00
    if (oneWayFare < veh.baseFloor) {
      oneWayFare = veh.baseFloor;
    }

    let total = oneWayFare;
    let returnFare = 0;
    if (this.state.serviceType === 'RETURN') {
      returnFare = oneWayFare * 0.95; // 5% discount on return leg
      total = oneWayFare + returnFare;
    }

    // Rounding to 2 decimal places
    total = Math.round(total * 100) / 100;

    return {
      serviceType: this.state.serviceType,
      distanceKm: dist,
      durationText: this.state.durationText,
      oneWayFare: Math.round(oneWayFare * 100) / 100,
      returnFare: Math.round(returnFare * 100) / 100,
      grossTotal: total,
      depositRequired: 0.00,
      balanceDue: total,
      formattedTotal: `€${total.toFixed(2)}`,
      vehicleName: veh.name,
      currency: 'EUR'
    };
  }

  getUrlParams() {
    const v = VEHICLES_DB[this.state.vehicleCategory];
    const p = new URLSearchParams();
    if (v) p.set('vehicle', v.slug);
    if (this.state.serviceType === 'TOUR') {
      p.set('service', 'tour');
      p.set('tour', this.state.tourKey);
    } else {
      p.set('service', this.state.serviceType.toLowerCase());
      p.set('pickup', this.state.pickupAddress);
      p.set('dropoff', this.state.dropoffAddress);
      p.set('km', this.state.distanceKm);
    }
    return p.toString();
  }

  // Get current active hero background for place/tour
  getDestinationHero() {
    if (this.state.serviceType === 'TOUR' && TOURS_DB[this.state.tourKey]) {
      return TOURS_DB[this.state.tourKey].hero;
    }
    if (this.state.routeKey && ROUTES_DB[this.state.routeKey]) {
      return ROUTES_DB[this.state.routeKey].hero;
    }
    const dropLower = (this.state.dropoffAddress || '').toLowerCase();
    for (const [key, item] of Object.entries(ROUTES_DB)) {
      if (dropLower.includes(key.replace('-', ' ')) || dropLower.includes(key)) {
        return item.hero;
      }
    }
    return '/images/salzburg-hero.jpg';
  }

  // Get current vehicle image
  getVehicleAsset() {
    const v = VEHICLES_DB[this.state.vehicleCategory] || VEHICLES_DB['E_CLASS'];
    return v;
  }
}

window.bookingManager = new BookingStateManager();
