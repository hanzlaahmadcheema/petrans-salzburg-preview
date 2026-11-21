# PETRANS Multi-Page Architecture, SEO Metadata & Destination Content Specification
**Document Reference:** `PET-ARCH-SEO-033`  
**Task ID:** `TSK-PET-033`  
**Author:** Hanzla Ahmad <hanzlaahmad100@gmail.com>  
**Status:** Approved / Specification Document  
**Target Release:** PETRANS Multi-Page Web Platform 2.0  
**Domain Baseline:** `https://petrans-salzburg.at`

---

## 1. Executive Summary & Information Architecture Blueprint

### 1.1 Purpose
This specification establishes the structural, content, SEO, and deep-linking architecture for the multi-page evolution of PETRANS Taxi & Tour Salzburg. To satisfy the mandate of 95% mobile traffic optimization, the monolithic single-page experience is partitioned into a high-speed minimal landing page, a dedicated distraction-free booking engine, and indexable, search-optimized destination and tour landing pages.

### 1.2 Canonical URL Tree & Page Taxonomy

```
petrans-salzburg.at/
├── index.html                           [Minimal Homepage & 3-Way Booking Entry]
├── booking.html                         [Shared 6-Stage Dedicated Booking Engine]
├── tours.html                           [Private Day Tours Master Directory]
├── tours/
│   ├── hallstatt.html                   [Hallstatt & Salzkammergut Alpine Lakes]
│   ├── eagles-nest.html                 [Eagle's Nest & Berchtesgaden Alps]
│   ├── zell-am-see.html                 [Zell am See & Kaprun Glacier Tour]
│   └── innsbruck.html                   [Innsbruck & Tyrolean Alps Cultural Tour]
└── destinations/
    ├── munich-airport.html              [Munich Airport MUC VIP Chauffeur Transfer]
    └── vienna.html                      [Salzburg to Vienna Executive Chauffeur]
```

### 1.3 Architectural Principles
1. **Zero Monolithic Bloat:** The homepage (`/index.html`) eliminates the multi-stage embedded booking form, serving strictly as a high-conversion introductory portal with an instant 3-option quick-entry module (`Book by Tour`, `Book by Place`, `Book by Car`).
2. **Dedicated Booking Engine (`/booking.html`):** A standalone, distraction-free environment that ingests state-carrying URL parameters and persists progress in `sessionStorage` without locking customers into pre-selected parameters.
3. **High-Intent Organic Ingestion:** Dedicated tour and destination pages capture high-value German, Austrian, British, and American search queries (e.g. *"private tour salzburg to hallstatt"*, *"chauffeur transfer salzburg to munich airport"*).
4. **Visual Decluttering:** Sights, route itineraries, duration, and imagery are unified into cohesive, horizontal cards rather than fragmented across multiple disconnected visual elements.

---

## 2. Canonical SEO Metadata & OpenGraph Matrix

All title tags are strictly calibrated under 60 characters to prevent SERP truncation. All meta descriptions are calibrated under 155 characters with clear commercial intent and call-to-action prompts.

| Page Path | Canonical URL | `<title>` (Max 60 chars) | `<meta name="description">` (Max 155 chars) | Primary Keywords |
| :--- | :--- | :--- | :--- | :--- |
| `/index.html` | `https://petrans-salzburg.at/` | PETRANS Salzburg \| Luxury Chauffeur & Day Tours | Premium private chauffeur, airport transfers & Alpine day tours in Salzburg. 100% Mercedes fleet. Transparent fixed rates. Book online. | salzburg chauffeur, private taxi salzburg, alpine tours salzburg |
| `/booking.html` | `https://petrans-salzburg.at/booking.html` | Book Chauffeur & Alpine Tours \| PETRANS Salzburg | Reserve your private Mercedes chauffeur or private Alpine day tour from Salzburg. Fixed rates, zero deposit, free cancellation. | book salzburg transfer, book alpine tour, chauffeur reservation |
| `/tours.html` | `https://petrans-salzburg.at/tours.html` | Private Alpine Day Tours from Salzburg \| PETRANS | Explore Hallstatt, Eagle's Nest, Zell am See & Innsbruck with a private Mercedes chauffeur. Fixed 8h rates from €450. Max 8 guests. | private day tours salzburg, salzburg sightseeing chauffeur |
| `/tours/hallstatt.html` | `https://petrans-salzburg.at/tours/hallstatt.html` | Hallstatt Private Day Tour from Salzburg \| PETRANS | Private 8h luxury tour to Hallstatt & Salzkammergut lakes. UNESCO Skywalk, Dachstein views. Fixed €450 for up to 8 guests. Book now. | private tour hallstatt, salzburg to hallstatt tour, salzkammergut tour |
| `/tours/eagles-nest.html` | `https://petrans-salzburg.at/tours/eagles-nest.html` | Eagle's Nest & Berchtesgaden Tour \| PETRANS Salzburg | Private 8h day tour to Eagle's Nest & Lake Königssee. Historic mountain elevator, Bavarian Alps. Fixed €450 for up to 8 guests. | eagles nest tour salzburg, berchtesgaden private tour, kehlsteinhaus |
| `/tours/zell-am-see.html` | `https://petrans-salzburg.at/tours/zell-am-see.html` | Zell am See & Kaprun Glacier Private Tour \| PETRANS | Private 8h tour from Salzburg to Zell am See & Kitzsteinhorn Glacier. Alpine reservoir views. Fixed €450 for up to 8 guests. | zell am see tour, kaprun private tour, kitzsteinhorn tour salzburg |
| `/tours/innsbruck.html` | `https://petrans-salzburg.at/tours/innsbruck.html` | Innsbruck & Tyrolean Alps Private Tour \| PETRANS | Private 8h luxury day tour to Innsbruck & Swarovski Kristallwelten. Golden Roof, Nordkette views. Fixed €650 for up to 8 guests. | innsbruck private tour, salzburg to innsbruck tour, swarovski tour |
| `/destinations/munich-airport.html` | `https://petrans-salzburg.at/destinations/munich-airport.html` | Salzburg to Munich Airport Transfer \| PETRANS VIP | Reliable private chauffeur transfer between Salzburg and Munich Airport (MUC). Fixed €490 rate, flight tracking, meet & greet included. | salzburg to munich airport transfer, muc chauffeur salzburg |
| `/destinations/vienna.html` | `https://petrans-salzburg.at/destinations/vienna.html` | Salzburg to Vienna VIP Chauffeur Transfer \| PETRANS | Door-to-door private Mercedes transfer between Salzburg and Vienna. Optional Wachau Valley stop. Fixed distance rates, pure comfort. | salzburg to vienna transfer, private chauffeur vienna salzburg |

### 2.1 Standard OpenGraph & Twitter Card Template
Every page must incorporate matching social meta tags:
```html
<meta property="og:site_name" content="PETRANS Taxi & Tour Salzburg" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://petrans-salzburg.at/tours/hallstatt.html" />
<meta property="og:title" content="Hallstatt Private Day Tour from Salzburg | PETRANS" />
<meta property="og:description" content="Private 8h luxury tour to Hallstatt & Salzkammergut lakes. UNESCO Skywalk, Dachstein views. Fixed €450 for up to 8 guests." />
<meta property="og:image" content="https://petrans-salzburg.at/images/destinations/hallstatt-hero.webp" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="en_AT" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Hallstatt Private Day Tour from Salzburg | PETRANS" />
<meta name="twitter:description" content="Private 8h luxury tour to Hallstatt & Salzkammergut lakes. UNESCO Skywalk, Dachstein views. Fixed €450 for up to 8 guests." />
<meta name="twitter:image" content="https://petrans-salzburg.at/images/destinations/hallstatt-hero.webp" />
```

---

## 3. Structured Data Specifications (Schema.org JSON-LD)

### 3.1 Organization & Local Business Schema (Global Header)
Placed on `/index.html` to establish domain entity identity:
```json
{
  "@context": "https://schema.org",
  "@type": "TaxiService",
  "name": "PETRANS Taxi & Tour Salzburg",
  "legalName": "PETRANS e.U.",
  "url": "https://petrans-salzburg.at",
  "logo": "https://petrans-salzburg.at/images/logo.png",
  "image": "https://petrans-salzburg.at/images/salzburg-hero.jpg",
  "description": "Executive chauffeur service, private Alpine day tours, and airport transfers operating from Salzburg, Austria.",
  "telephone": "+43 664 0000000",
  "email": "contact@petrans-salzburg.at",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Salzburg City Centre",
    "addressLocality": "Salzburg",
    "postalCode": "5020",
    "addressCountry": "AT"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 47.8095,
    "longitude": 13.0550
  },
  "areaServed": [
    { "@type": "City", "name": "Salzburg" },
    { "@type": "AdministrativeArea", "name": "Salzburger Land" },
    { "@type": "AdministrativeArea", "name": "Tyrol" },
    { "@type": "Country", "name": "Austria" },
    { "@type": "AdministrativeArea", "name": "Bavaria" }
  ],
  "priceRange": "€€",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  }
}
```

### 3.2 Tour Product Schema (`TouristTrip`)
Implemented on individual tour pages (`/tours/hallstatt.html`, etc.):
```json
{
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  "name": "Private Hallstatt & Salzkammergut Alpine Lakes Day Tour",
  "description": "Exclusive 8-hour private day tour from Salzburg through Lake Fuschl, St. Gilgen on Lake Wolfgang, the imperial town of Bad Ischl, and the UNESCO World Heritage village of Hallstatt.",
  "touristType": ["Families", "Couples", "Luxury Travelers", "Photographers"],
  "provider": {
    "@type": "TaxiService",
    "name": "PETRANS Taxi & Tour Salzburg",
    "url": "https://petrans-salzburg.at"
  },
  "offers": {
    "@type": "Offer",
    "price": "450.00",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "validFrom": "2026-01-01",
    "description": "Fixed private group rate for up to 8 passengers in Mercedes-Benz V-Class or Vito Tourer."
  },
  "itinerary": {
    "@type": "ItemList",
    "numberOfItems": 5,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Fuschlsee & Lake Wolfgang Viewpoint",
        "description": "Scenic photo stop overlooking St. Gilgen and the turquoise waters of Lake Wolfgang."
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Bad Ischl Imperial Spa Town",
        "description": "Historic stop at the summer residence of Emperor Franz Joseph and Café Zauner."
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Hallstatt UNESCO World Heritage Village",
        "description": "2.5 hours free time exploring the lakeside promenade, market square, and Beinhaus."
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Hallstatt World Heritage Skywalk",
        "description": "Elevated panorama point suspended 360 meters above Lake Hallstatt."
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Lake Gosau (Gosausee)",
        "description": "Majestic alpine lake reflecting the Dachstein Glacier."
      }
    ]
  }
}
```

### 3.3 BreadcrumbList Schema (Subpages)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://petrans-salzburg.at/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tours",
      "item": "https://petrans-salzburg.at/tours.html"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Hallstatt & Salzkammergut",
      "item": "https://petrans-salzburg.at/tours/hallstatt.html"
    }
  ]
}
```

---

## 4. Destination & Day Tour Content Specifications

### 4.1 Tour 1: Hallstatt & Salzkammergut Alpine Lakes
* **URL:** `/tours/hallstatt.html`
* **Route Metrics:**
  * Total Round-Trip Distance: **165 km**
  * Total Pure Driving Time: **~2 hours 45 minutes**
  * Tour Duration: **8 Hours (Full Day)**
  * Typical Schedule: 09:00 Salzburg pickup -> 09:40 St. Gilgen overlook -> 10:30 Bad Ischl quick stop -> 11:30 Arrive Hallstatt (free time for lunch, village walk, Skywalk) -> 15:00 Depart for Lake Gosau photo stop -> 16:30 Return drive via Wiestal valley -> 17:00 Salzburg drop-off
* **Pricing Structure:**
  * Flat Group Rate: **€450.00** (Includes up to 8 passengers in Mercedes V-Class/Vito or 3 in E-Class)
  * Inclusions: Private Mercedes vehicle, dedicated local chauffeur, fuel, road tolls, parking fees, chilled bottled water, child seats (€0), flexible photo stops.
  * Exclusions: Entry tickets (Skywalk funicular, Salt Mine), meals and personal expenses.
* **Key Sights & Photo Stops:**
  1. *St. Gilgen Panoramic Viewpoint:* Overlooking Lake Wolfgang and the Schafberg railway.
  2. *Bad Ischl Imperial Villa & Café Zauner:* Traditional Austrian pastry stop.
  3. *Hallstatt Classic Postcard Viewpoint:* Gosaumühlstraße viewpoint capturing the iconic church steeple.
  4. *Hallstatt Skywalk "Welterbeblick":* Triangular viewing platform hovering 360m above the fjord-like lake.
  5. *Lake Gosau (Vorderer Gosausee):* Dramatic glacier mirror reflections framed by the Gosaukamm ridge.
* **Seasonal Recommendations:**
  * *Spring / Summer (May – September):* Ideal for lakeside walks, boat rentals, and the Salt Mine.
  * *Autumn (October – November):* Vibrant golden alpine foliage reflected in Salzkammergut lakes.
  * *Winter (December – March):* Fairytale snow-capped wooden roofs, winter village atmosphere, fewer crowds.
* **Booking Deep-Link URL:**
  `/booking.html?service=tour&tour=hallstatt`

---

### 4.2 Tour 2: Eagle's Nest & Berchtesgaden Alps
* **URL:** `/tours/eagles-nest.html`
* **Route Metrics:**
  * Total Round-Trip Distance: **95 km**
  * Total Pure Driving Time: **~1 hour 45 minutes**
  * Tour Duration: **8 Hours (Full Day)**
  * Typical Schedule: 08:45 Salzburg pickup -> 09:30 Obersalzberg bus terminal -> 10:00 Kehlsteinhaus summit & mountain elevator -> 12:30 Descend to Berchtesgaden historic center for lunch -> 14:00 Lake Königssee boat dock & Malerwinkel walk -> 16:15 Return drive via German Alpine Road -> 17:00 Salzburg drop-off
* **Pricing Structure:**
  * Flat Group Rate: **€450.00** (Up to 8 passengers)
  * Inclusions: Private Mercedes vehicle, dedicated chauffeur, Bavarian border tolls, fuel, bottled water, child booster seats.
  * Exclusions: Special Kehlstein mountain bus & elevator tickets, Lake Königssee electric boat tickets.
* **Key Sights & Photo Stops:**
  1. *Kehlsteinhaus (Eagle's Nest) Summit:* Historical building perched at 1,834 meters offering 360° views across Germany and Austria.
  2. *Mirror-Polished Brass Elevator:* Ascending 124 meters through solid rock inside Mount Kehlstein.
  3. *Lake Königssee (Malerwinkel):* Crystal-clear emerald fjord framed by the sheer 2,000m East Wall of Mount Watzmann.
  4. *Berchtesgaden Historic Market Square:* Pastel Bavarian frescoes and artisan woodcarving studios.
* **Seasonal & Weather Contingency:**
  * *May to October:* Eagle's Nest is open daily (weather permitting).
  * *Winter Alternate (November to April):* When the Kehlstein alpine road is closed for snow, the itinerary seamlessly transitions to the **Berchtesgaden Salt Mine (Salzbergwerk)**, **Rossfeld Panoramic High Alpine Toll Road**, and winter walks at Königssee.
* **Booking Deep-Link URL:**
  `/booking.html?service=tour&tour=eagles-nest`

---

### 4.3 Tour 3: Zell am See & Kaprun Alpine Glacier Tour
* **URL:** `/tours/zell-am-see.html`
* **Route Metrics:**
  * Total Round-Trip Distance: **195 km**
  * Total Pure Driving Time: **~2 hours 50 minutes**
  * Tour Duration: **8 Hours (Full Day)**
  * Typical Schedule: 08:30 Salzburg pickup -> 09:30 Pass Hohenwerfen Fortress -> 10:15 Arrive Zell am See lakefront & Grand Hotel esplanade -> 12:00 Kaprun alpine valley & lunch -> 13:30 Sigmund Thun Gorge or Kitzsteinhorn Glacier base -> 15:45 Scenic drive back through Saalfelden -> 17:00 Salzburg drop-off
* **Pricing Structure:**
  * Flat Group Rate: **€450.00** (Up to 8 passengers)
  * Inclusions: Private Mercedes van/sedan, chauffeur, all Austrian road tolls, bottled water, ski/snow equipment carriage (€0).
* **Key Sights & Photo Stops:**
  1. *Hohenwerfen Castle Viewpoint:* 900-year-old cliff-top fortress towering above the Salzach river valley.
  2. *Zell am See Promenade & Grand Hotel Peninsula:* Historic alpine lake with sweeping views of the Hohe Tauern peaks.
  3. *Sigmund Thun Gorge (Summer):* Wooden boardwalk through a 32-meter-deep roaring glacial canyon.
  4. *Kitzsteinhorn "Top of Salzburg" (3,029m):* Year-round snow and panoramic viewing platform into the High Tauern National Park.
* **Booking Deep-Link URL:**
  `/booking.html?service=tour&tour=zell-am-see`

---

### 4.4 Tour 4: Innsbruck & Tyrolean Alps Cultural Tour
* **URL:** `/tours/innsbruck.html`
* **Route Metrics:**
  * Total Round-Trip Distance: **380 km**
  * Total Pure Driving Time: **~4 hours 15 minutes**
  * Tour Duration: **8 to 9 Hours (Full Day)**
  * Typical Schedule: 08:00 Salzburg pickup -> 09:45 Kufstein Fortress roadside panorama -> 10:45 Swarovski Crystal Worlds (Wattens) -> 12:45 Innsbruck Old Town (Golden Roof, Hofburg, Maria-Theresien-Straße) -> 15:30 Bergisel Ski Jump panoramic viewpoint -> 16:30 Return drive via Inntal motorway -> 18:00 Salzburg drop-off
* **Pricing Structure:**
  * Flat Group Rate: **€650.00** (Calibrated for extended 380 km distance, Brenner corridor operations, and Tyrolean highway vignettes)
  * Inclusions: Private Mercedes-Benz vehicle, chauffeur, Austrian vignette, fuel, bottled water, phone chargers.
* **Key Sights & Photo Stops:**
  1. *Swarovski Crystal Worlds (Kristallwelten):* The iconic green Giant fountain and botanical crystal park.
  2. *The Golden Roof (Goldenes Dachl):* Emperor Maximilian I's 15th-century balcony decorated with 2,657 fire-gilded copper tiles.
  3. *Zaha Hadid Hungerburgbahn Stations:* World-renowned modern architecture curving like natural alpine ice formations.
  4. *Bergisel Ski Jump:* Olympic stadium with breathtaking vistas of the Nordkette mountain range.
* **Booking Deep-Link URL:**
  `/booking.html?service=tour&tour=innsbruck`

---

## 5. Dedicated Destination & Airport Transfer Specifications

### 5.1 Munich Airport (MUC) Chauffeur Transfer
* **URL:** `/destinations/munich-airport.html`
* **Route Logistics:**
  * Route: Salzburg City / Hotels -> A1 / A8 German Autobahn (via Walserberg border) -> Chiemsee -> Munich East Ring (A99) -> Franz Josef Strauss International Airport (MUC, Terminals 1 & 2).
  * Distance: **180 km** (one-way).
  * Driving Duration: **1 hour 50 minutes to 2 hours 15 minutes** (traffic-dependent).
* **Pricing Structure:**
  * Promotional Flat Rate: **€490.00** (Standard executive transfer).
  * Distance Calculation: 180 km × €2.20/km (long-distance rate) + cross-border allocation = €490.
* **Chauffeur Service Amenities:**
  * Live Flight Radar Monitoring: Drivers adjust pickup times dynamically for delays or early arrivals.
  * Inside Terminal Meet & Greet: Chauffeur waits at baggage exit holding an iPad display with client name.
  * 60 Minutes Complimentary Waiting Time for international arrivals.
  * Curbside luggage handling directly into Mercedes boot.
* **Booking Deep-Link URL:**
  `/booking.html?service=one-way&pickup=Salzburg&dropoff=Munich%20Airport%20(MUC)`

---

### 5.2 Salzburg to Vienna VIP Chauffeur Transfer
* **URL:** `/destinations/vienna.html`
* **Route Logistics:**
  * Route: Salzburg City / Airport -> Westautobahn (A1) -> Linz -> Melk Abbey (Wachau Valley) -> Vienna Ringstraße / Hotels / Vienna International Airport (VIE).
  * Distance: **300 km** (one-way).
  * Driving Duration: **3 hours to 3 hours 15 minutes**.
* **Pricing Structure:**
  * Fixed Distance Rate: 300 km × €2.20/km (long-distance discount tier) = **€660.00**.
  * Optional Sightseeing Stop: 45-minute stopover at the UNESCO Baroque Benedictine Melk Abbey available for +€40.
* **Chauffeur Service Amenities:**
  * Luxury high-speed motorway transit in Mercedes E-Class sedan (business travelers) or Mercedes V-Class / Vito (executives, families).
  * High-speed onboard Wi-Fi hotspot and device charging (USB-C).
  * Refreshment service (still/sparkling Austrian mineral water).
* **Booking Deep-Link URL:**
  `/booking.html?service=one-way&pickup=Salzburg&dropoff=Vienna`

---

## 6. Tourism Imagery & Photography Sourcing Specifications

To guarantee visual authority and avoid generic stock photography, every page specifies exact destination viewpoints, photographic lighting, and aspect ratios.

```
+---------------------------------------------------------------------------------------------------------+
| Target Page              | Image Filename              | Required Scene & Framing                      |
+---------------------------------------------------------------------------------------------------------+
| /tours/hallstatt.html    | hallstatt-hero.webp         | Classic postcard view from Gosaumühlstraße;   |
|                          |                             | Evangelical church steeple, lake & Dachstein  |
| /tours/eagles-nest.html  | eagles-nest-hero.webp       | Historic Kehlsteinhaus perched on ridge       |
|                          |                             | looking south towards Berchtesgaden Alps      |
| /tours/zell-am-see.html  | zell-am-see-hero.webp       | Grand Hotel peninsula jutting into Zeller See |
|                          |                             | with snow-capped Kitzsteinhorn in background  |
| /tours/innsbruck.html    | innsbruck-hero.webp         | Maria-Theresien-Straße framed by dramatic     |
|                          |                             | snow-covered Nordkette mountain peaks         |
| /destinations/munich.html| munich-airport-hero.webp    | Mercedes V-Class curbside at MUC Terminal 2   |
|                          |                             | VIP arrivals area or sleek terminal roofline  |
| /destinations/vienna.html| vienna-hero.webp            | Vienna Ringstraße / Hofburg Palace facade or  |
|                          |                             | Belvedere Palace reflections                  |
+---------------------------------------------------------------------------------------------------------+
```

### 6.1 Photographic Guidelines & Technical Standards
* **Aspect Ratios:**
  * Desktop Hero Banner: `16:9` (1920 × 1080 px) or `21:9` ultra-wide (2560 × 1080 px).
  * Mobile Hero Container: `4:3` (800 × 600 px) or `1:1` (600 × 600 px) centered on the primary subject.
  * Route Itinerary Thumbnails: `16:9` (640 × 360 px).
* **Format & Compression:**
  * Modern format: Progressive **WebP** (`q=82`), with progressive JPEG fallback.
  * File size targets: `< 180 KB` for desktop heroes, `< 65 KB` for mobile cards.
* **Atmospheric Tone:**
  * Golden hour or crisp daylight alpine atmosphere. Deep blue alpine skies, crystal water reflections, natural warm lighting.
  * Avoid over-saturated HDR or artificial lens flare. Must convey luxury, authenticity, and calm reliability.

---

## 7. Deep-Linking & State Persistence Schema for `/booking.html`

The booking engine at `/booking.html` is architected as a universal state machine. When a user arrives from an external page or landing link, URL query parameters pre-populate the initial booking state without customer lock-in.

### 7.1 Query Parameter Taxonomy

| Query Parameter | Valid Values | State Machine Mapping | Default If Omitted |
| :--- | :--- | :--- | :--- |
| `service` | `tour`, `one-way`, `hourly` | Sets `bookingState.serviceType` (Stage 1) | `one-way` |
| `tour` | `hallstatt`, `eagles-nest`, `zell-am-see`, `innsbruck` | Sets `bookingState.tourSlug` and locks base tour price | `null` |
| `pickup` | Free text string (e.g. `Salzburg`, `Salzburg Airport`) | Populates `#pickup-input` (Stage 2) | Empty |
| `dropoff` | Free text string (e.g. `Munich Airport (MUC)`, `Vienna`) | Populates `#dropoff-input` (Stage 2) | Empty |
| `vehicle` | `e-class`, `v-class`, `vito` | Pre-selects vehicle card in Stage 3 | `v-class` (default) |
| `passengers` | Integer `1` to `8` | Pre-selects passenger count badge | `2` |
| `luggage` | Integer `0` to `8` | Pre-selects luggage count badge | `2` |

### 7.2 Zero Customer Lock-In Implementation Logic
When `/booking.html` parses deep-link parameters:
1. **Affirmative Pre-population:** The fields are highlighted with an unobtrusive amber indicator badge (e.g. *"Pre-selected: Hallstatt Alpine Tour"*).
2. **Total Customer Freedom:** Every input, radio button, and tab remains completely interactive. If a user arrived via `?tour=hallstatt` but decides to change to `zell-am-see` or switch to an hourly booking, clicking the options immediately updates the state machine and recalibrates the quote.
3. **Session Persistence:**
   ```javascript
   // Synchronize deep-link params into sessionStorage on initial load
   function hydrateBookingFromUrl() {
     const params = new URLSearchParams(window.location.search);
     const sessionData = JSON.parse(sessionStorage.getItem('petrans_booking_state') || '{}');
     
     if (params.has('service')) sessionData.serviceType = params.get('service');
     if (params.has('tour')) sessionData.tourSlug = params.get('tour');
     if (params.has('pickup')) sessionData.pickupLocation = params.get('pickup');
     if (params.has('dropoff')) sessionData.dropoffLocation = params.get('dropoff');
     if (params.has('vehicle')) sessionData.selectedVehicle = params.get('vehicle');

     sessionStorage.setItem('petrans_booking_state', JSON.stringify(sessionData));
     return sessionData;
   }
   ```
4. **Browser History Cleanliness:** Once hydrated, `/booking.html` uses `window.history.replaceState({}, document.title, window.location.pathname)` so that page refreshes or backwards navigation do not trap the user in stale query strings.

---

## 8. Implementation Checklist for Phase 5 (`TSK-PET-035`)

- [x] **Page Hierarchy Defined:** All 8 canonical paths documented with matching purpose and structure.
- [x] **SEO Metadata Generated:** Precise `<title>` (under 60 chars) and `<meta name="description">` (under 155 chars) written for every page.
- [x] **Schema.org JSON-LD Authored:** Validated schemas for `TaxiService`, `TouristTrip`, and `BreadcrumbList`.
- [x] **Tour Travel Metrics Calibrated:** Distances (95–380 km), schedules (8h), and rates (€450 / €650) accurately verified against business rules.
- [x] **Transfer Details Documented:** Route logistics for Munich Airport (€490) and Vienna (€660) detailed.
- [x] **Visual Decluttering Standards:** Sights, route maps, and schedules unified into consolidated component cards.
- [x] **Deep-Linking Schema Formulated:** State hydration logic specified with zero customer lock-in.
- [x] **Zero Emoji Constraint:** 100% compliant with zero Unicode emojis across all specifications.
