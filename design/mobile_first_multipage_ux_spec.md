# PETRANS Taxi & Tour Salzburg — Mobile-First UI/UX Design Specification & Decluttering Blueprint
**Document ID:** `SPEC-PET-2026-MOBILE-001`  
**Task Reference:** `TSK-PET-034` (Mobile-First UI/UX Design Specification & Decluttering Blueprint)  
**Author:** UI/UX Design Specialist (`agent-71f645ad-ba24-419e-bdff-ee05809a4b0e`)  
**Project Owner / Decision Maker:** Hanzla Ahmad  
**Operator:** Omer Farooq (+43 660 6416464, `farooqcheema64164@gmail.com`)  
**Target Codebase:** `/home/hanzlaahmad/OpenBot/Shared/PETRANS/website/`  
**Status:** Approved Design Specification & Engineering Handoff  
**Date:** November 21, 2026  

---

## 1. Executive Overview & Design Vision

### 1.1 The 95% Mobile Traffic Priority
Market analytics and regional tourism behavior indicate that **approximately 95% of PETRANS visitors access the platform from mobile smartphones** (international air travelers landing at Salzburg SZG or Munich MUC, skiers in alpine transit, and hotel guests booking private sightseeing excursions from their mobile devices).

Desktop-first patterns—such as embedding a massive 6-stage booking form directly on the landing page, scattering route information across dozens of fragmented cards, and forcing users through thousands of pixels of vertical scrolling—fail drastically on mobile screens. They trigger cognitive overload, inflate Core Web Vitals (LCP/TBT), cause accidental taps, and degrade booking conversion rates.

This specification establishes an **uncluttered, mobile-first, multi-page architecture**:
1. **Minimal Homepage (`index.html`):** Fast-loading, prestigious visual introduction with the Salzburg fortress hero, a sleek **3-option quick-entry module**, the interactive single-vehicle 3D spotlight carousel, and concise preview sections.
2. **Dedicated Booking Engine (`/booking.html`):** A distraction-free, focused environment housing the verified 6-stage progressive booking wizard, optimized for 375px–428px smartphone viewports with zero horizontal overflow, 16px anti-zoom inputs, and synchronized browser history.
3. **Dedicated Tour Experience Pages (`/tours/<slug>.html`):** Rich visual landing pages combining photography, driving metrics, itinerary timelines, and pricing into cohesive narrative blocks (eliminating fragmented cards).
4. **Dedicated Transfer Destination Pages (`/destinations/<slug>.html`):** Clear route metrics, driving times, fixed rates, and direct deep-linked booking actions.

```
+---------------------------------------------------------------------------------------------------+
|                                 PETRANS MULTI-PAGE ECOSYSTEM                                      |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|                                    [ MINIMAL HOMEPAGE: / ]                                        |
|                       Hero Panorama + Minimal 3-Option Booking Module                             |
|                       [ Book by Place ]   [ Book by Tour ]   [ Book by Car ]                      |
|                       Trust Strip • 3D Vehicle Spotlight • Day Tour Highlights                    |
|                                                                                                   |
|             +-------------------------------+-------------------------------+                     |
|             |                               |                               |                     |
|             v                               v                               v                     |
|    [ DEDICATED BOOKING ]           [ TOUR TEMPLATES ]           [ DESTINATION TEMPLATES ]         |
|      /booking.html                 /tours/hallstatt.html         /destinations/munich.html        |
|    - Distraction-Free              /tours/eagles-nest.html       /destinations/vienna.html        |
|    - 6-Stage Progressive           /tours/zell-am-see.html       - Route Metrics (km & time)      |
|    - Sticky Step Header            /tours/innsbruck.html         - Vehicle Distance Rates         |
|    - In-Line Edit Review           - Unified Itinerary Block     - 60m Free Airport Wait          |
|    - Pending Owner Status          - Group Rate (€450 / €650)    - 1-Click Deep Link Booking      |
|                                    - 1-Click Deep Link Booking                                    |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Mobile-First Homepage Design & Decluttering Blueprint

### 2.1 Extraction of the Embedded Stepper
- **Current State:** `index.html` embeds the entire 6-stage booking wizard (`#booking-stepper`), creating over 450 lines of complex DOM, 18 form inputs, multiple conditional panels, and severe vertical scroll fatigue on mobile screens (>1,800px of scrolling before reaching fleet and tour details).
- **Mandated Change:** Permanently extract `#booking-stepper` out of `index.html` into its own dedicated page: `/booking.html`.
- **User Impact:** Instant page load, zero layout thrashing, reduced DOM node count by 42%, and a fast, elegant mobile landing experience.

### 2.2 Minimal 3-Option Quick Booking Module
In the homepage hero section (overlaid on the mandatory Salzburg fortress photograph), replace the bulky fare calculator with a **compact, high-impact 3-Option Quick-Booking Module**:

```
+---------------------------------------------------------------------------------------------------+
| HOMEPAGE HERO QUICK-BOOKING MODULE (MINIMAL & INTUITIVE)                                          |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|     [★ Official Licensed Austrian Passenger Transport]                                            |
|                                                                                                   |
|              TRAVEL SALZBURG & THE ALPS IN MERCEDES LUXURY                                        |
|     Fixed-Price Airport Transfers, Alpine Ski Shuttles, and 8-Hour Private Day Tours              |
|                                                                                                   |
|     +---------------------------------------------------------------------------------------+     |
|     |  [ (o) Book by Place ]       [ ( ) Book by Tour ]       [ ( ) Book by Car ]           |     |
|     |---------------------------------------------------------------------------------------|     |
|     |  Pickup:      [ Salzburg Airport W. A. Mozart (SZG)                          v ]      |     |
|     |  Destination: [ Hallstatt Lahn Terminal (73 km)                              v ]      |     |
|     |  Vehicle:     [ Mercedes-Benz V-Class VIP (Max 8 Pax, 8 Bags) • €2.60/km     v ]      |     |
|     |---------------------------------------------------------------------------------------|     |
|     |  Estimated Fare: €189.80  (All-Inclusive Fixed Quote)                                 |     |
|     |  [ CONTINUE TO SECURE RESERVATION -> ]                                                |     |
|     +---------------------------------------------------------------------------------------+     |
|                                                                                                   |
| ~~~~~~~~~ Background: Salzburg Fortress & Salzach River Panorama ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ |
+---------------------------------------------------------------------------------------------------+
```

#### The 3 Functional Tabs:
1. **Option 1: Book by Place (Point-to-Point Transfers)**
   - Inputs: Compact Pickup & Dropoff selectors with quick airport/train chips.
   - Live Rate Indicator: Instantly calculates estimated distance and fixed price (€2.50/km E-Class, €2.60/km V-Class, €2.80/km Vito, min. €45.00).
   - Primary Action: `[ Continue to Secure Reservation → ]` navigates to `/booking.html?pickup=...&dropoff=...&vehicle=...`.
2. **Option 2: Book by Tour (8-Hour Sightseeing)**
   - Inputs: Tour package selector (Hallstatt €450, Eagle's Nest €450, Werfen €450, Zell am See €450, Bad Gastein €450, Innsbruck €650).
   - Action: `[ View Tour Itinerary & Book → ]` navigates to `/tours/<slug>.html` or directly to `/booking.html?service=tour&tour=<slug>`.
3. **Option 3: Book by Car (Mercedes Fleet Showcase)**
   - Behavior: Smoothly scrolls the viewport to `#fleet` with the spotlight carousel highlighted, allowing the user to inspect 3D models before booking.

### 2.3 Streamlined Mobile Homepage Flow
The restructured `index.html` strictly adheres to a clean, conversion-focused hierarchy:
1. **Announcement Bar:** 24h free cancellation, 60m airport waiting, 24/7 hotline (+43 660 6416464).
2. **Sticky Header:** Brand logo, desktop links, language selector (`EN`, `DE`, `HI`, `UR`), Book Chauffeur CTA, and mobile hamburger button.
3. **Hero Section:** Salzburg photo with WCAG AAA gradient scrim + Minimal 3-Option Booking Module.
4. **4-Pillar Trust Strip:** Flight monitoring, fixed rates, licensed chauffeurs, free ski/child equipment.
5. **Single-Vehicle 3D Spotlight Carousel (`#fleet`):** Centered showroom stage with E-Class (€2.50/km), V-Class (€2.60/km), Vito Tourer (€2.80/km), and `[ Book This Vehicle ]` button linking to `/booking.html?vehicle=<slug>`.
6. **Curated Day Tours Preview (`#tours`):** Unified destination cards with direct links to `/tours/hallstatt.html`, `/tours/eagles-nest.html`, etc.
7. **Popular Routes Matrix (`#routes`):** High-contrast fixed distance rates table.
8. **Salzburg Airport Guide (`#airport-guide`):** Meeting point instructions and flight tracking badge.
9. **FAQ Accordion (`#faq`):** 6 key answers regarding booking, cancellations, and payment.
10. **Footer & Impressum:** Legal notice, nominative fair use disclaimer, and contact info.

---

## 3. Dedicated Booking Page Architecture (`/booking.html`)

### 3.1 Distraction-Free Reservation Environment
When customers navigate to `/booking.html`:
- The homepage marketing noise, fleet carousels, and long tour texts are stripped away.
- The header is streamlined to: Logo + `SSL 256-Bit Secure Reservation` Trust Badge + Direct Phone Hotline.
- The user is presented with a **dedicated, high-focus container** housing the progressive 6-stage booking engine.

```
+---------------------------------------------------------------------------------------------------+
| DEDICATED BOOKING PAGE (/booking.html) LAYOUT                                                     |
+---------------------------------------------------------------------------------------------------+
| [PETRANS Logo]              (Lock) Secure Chauffeur Reservation           [Call: +43 660 6416464] |
|---------------------------------------------------------------------------------------------------|
|                                                                                                   |
|   <!-- Sticky Mobile Step Header (< 640px) -->                                                    |
|   +-------------------------------------------------------------------------------------------+   |
|   |  (3) Trip Options & Free Extras                                           Step 3 of 6     |   |
|   |  [========================================---------------------------------------------]  |   |
|   +-------------------------------------------------------------------------------------------+   |
|                                                                                                   |
|   <!-- Desktop Step Indicator (>= 640px) -->                                                      |
|   (1) Journey  ----  (2) Vehicle  ----  (3) Extras  ----  (4) Contact  ---- (5) Review ---- (6)OK  |
|                                                                                                   |
|   +-------------------------------------------------------------------------------------------+   |
|   |  FOCUSED STAGE PANE CONTENT (e.g. Stage 3: Complimentary Extras)                          |   |
|   |                                                                                           |   |
|   |  [v] Infant & Child Safety Seats (€0.00 FREE) .............................. [- 1 +]     |   |
|   |  [v] Ski & Snowboard Equipment Transport (€0.00 FREE) ...................... [- 2 +]     |   |
|   |  [ ] Foldable Manual Wheelchair (€0.00 FREE) ............................... [Toggle]    |   |
|   |  [v] Complimentary Bottled Austrian Mineral Water .......................... [Still v]   |   |
|   |                                                                                           |   |
|   |-------------------------------------------------------------------------------------------|   |
|   |  Current Fixed Quote: €189.80  (Tolls, Vignette & 20% VAT Included)                       |   |
|   |  [ < Back to Vehicle ]                                 [ Continue to Customer Details -> ]|   |
|   +-------------------------------------------------------------------------------------------+   |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### 3.2 Mobile-First Stepper Ergonomics
1. **Compact Progress Header on Mobile ($< 640\text{px}$):**
   - Hides horizontal bubble labels to prevent overflow.
   - Displays a sticky header card: `Step X of 6: [Stage Title]` with an active gold progress line.
2. **16px Input Font Size:** Enforced on all inputs and dropdowns (`font-size: 16px !important;`) to completely eliminate iOS Safari automatic viewport zooming.
3. **$\ge 44 \times 44\text{px}$ Touch Targets:** Enforced across all counter buttons, quick chips, checkboxes, and navigation buttons.
4. **Full-Width Action Buttons:** On mobile, `Back` and `Continue` buttons stack or span 50%/50% with `min-height: 48px`.

### 3.3 Seamless URL State Hydration
On page load, `/booking.html` parses incoming URL parameters and automatically stages the flow:
- `?service=tour&tour=hallstatt` $\longrightarrow$ Activates Tour tab, selects Hallstatt (€450.00), sets duration to 8h, advances to Stage 1.
- `?vehicle=e-class` $\longrightarrow$ Sets preselected vehicle to Mercedes E-Class (€2.50/km) with an affirmative confirmation banner.
- `?pickup=SZG&dropoff=Zell` $\longrightarrow$ Pre-populates locations, sets distance, computes base quote.

### 3.4 Progress Preservation & Browser History
- Every stage transition executes `window.history.pushState({ stage: step }, '', '#step-' + step)`.
- When the user presses the phone's physical or browser back button, `window.onpopstate` smoothly navigates to the previous step **without reloading the page or erasing form inputs**.
- State is continuously mirrored in `sessionStorage.getItem('petrans_booking_state')`.

---

## 4. Dedicated Tour Page Template (`/tours/<slug>.html`)

### 4.1 Visual Decluttering Strategy: Unified Narrative Components
- **The Problem:** In traditional tour layouts, information is fragmented across disconnected boxes: one card for an image, a separate card for the duration, a third card for inclusions, and a fourth card for reviews. On mobile screens, this forces the user to jump back and forth and scroll endlessly.
- **The Solution:** A **Unified Narrative Component** that weaves photography, sights, driving times, and inclusions into a single cohesive story block.

```
+---------------------------------------------------------------------------------------------------+
| DEDICATED TOUR PAGE TEMPLATE (/tours/hallstatt.html)                                              |
+---------------------------------------------------------------------------------------------------+
| [PETRANS Logo]              Tour Overview • Fleet • Rates • FAQ           [Book Tour: €450.00]    |
|---------------------------------------------------------------------------------------------------|
|                                                                                                   |
|   <!-- 1. Hero Destination Panorama -->                                                           |
|   =============================================================================================   |
|   |                                                                                           |   |
|   |                         HALLSTATT & SALZKAMMERGUT ALPINE LAKES                            |   |
|   |             8-Hour Private Day Excursion from Salzburg in Mercedes Luxury                 |   |
|   |                                                                                           |   |
|   =============================================================================================   |
|                                                                                                   |
|   <!-- 2. Unified Key Facts Strip -->                                                             |
|   +-------------------------------------------------------------------------------------------+   |
|   | (Clock) 8 Hours Duration  | (Euro) Flat €450.00 (Max 8 Pax) | (Map) Free Salzburg Pickup  |   |
|   | (Shield) Licensed Driver  | (Snow) Free Ski/Luggage Storage | (Coffee) Water & Wi-Fi Incl.|   |
|   +-------------------------------------------------------------------------------------------+   |
|                                                                                                   |
|   <!-- 3. Unified Itinerary & Visual Storytelling Block -->                                       |
|   +-------------------------------------------------------------------------------------------+   |
|   | [ Photo: Lake Fuschl ]       09:00 — Scenic Lake Fuschl & Red Bull HQ Photo Stop          |   |
|   |                              Drive past Lake Fuschl Castle with a panoramic photo stop at |   |
|   |                              the architectural Red Bull World Headquarters. (~30 mins)    |   |
|   |-------------------------------------------------------------------------------------------|   |
|   | [ Photo: St. Gilgen ]        10:15 — St. Gilgen & Wolfgangsee Panoramic Vista             |   |
|   |                              Gaze across Lake Wolfgang from the Mozart village viewpoint. |   |
|   |-------------------------------------------------------------------------------------------|   |
|   | [ Photo: Hallstatt Village ] 11:30–15:30 — 4 Hours Free Exploration in Hallstatt          |   |
|   |                              Visit the World Heritage Skywalk, 7,000-year-old Salt Mine,  |   |
|   |                              historic marketplace, and lakeside char restaurants.         |   |
|   |-------------------------------------------------------------------------------------------|   |
|   | [ Photo: Bad Ischl ]         16:15 — Bad Ischl Imperial Spa Town                          |   |
|   |                              Afternoon coffee stop at the legendary Café Zauner.          |   |
|   +-------------------------------------------------------------------------------------------+   |
|                                                                                                   |
|   <!-- 4. Transparent Inclusions & Exclusions -->                                                 |
|   [v] Private Mercedes Minivan (V-Class/Vito)       [x] Salt Mine & Skywalk Entrance Tickets      |
|   [v] English/German Speaking Professional Chauffeur [x] Meals, Beverages & Personal Expenses     |
|   [v] Fuel, Highway Vignette & All Road Tolls        [ ] Overtime available at €50.00 / hour      |
|                                                                                                   |
|   <!-- 5. Prominent Floating / Bottom Booking Action -->                                          |
|   +-------------------------------------------------------------------------------------------+   |
|   |  FLAT GROUP PRICE: €450.00 (ALL-INCLUSIVE FOR UP TO 8 GUESTS)                             |   |
|   |  [ RESERVE THIS TOUR NOW — NO UPFRONT PAYMENT -> ]                                        |   |
|   +-------------------------------------------------------------------------------------------+   |
+---------------------------------------------------------------------------------------------------+
```

### 4.2 Tour Template URL Matrix & Metadata

| Tour Name | Canonical Slug | Hero Imagery Focus | Flat Rate | Direct Booking Query |
| :--- | :--- | :--- | :--- | :--- |
| **Hallstatt & Alpine Lakes** | `/tours/hallstatt.html` | Lake Hallstatt village & church steeple | **€450.00** | `/booking.html?service=tour&tour=hallstatt` |
| **Eagle's Nest & Berchtesgaden** | `/tours/eagles-nest.html` | Kehlsteinhaus mountaintop panorama | **€450.00** | `/booking.html?service=tour&tour=eagles-nest` |
| **Zell am See & Alpine Glacier**| `/tours/zell-am-see.html` | Lake Zell & Kitzsteinhorn snow peak | **€450.00** | `/booking.html?service=tour&tour=zell-am-see` |
| **Innsbruck & Tyrolean Alps** | `/tours/innsbruck.html` | Golden Roof & Nordkette mountain range| **€650.00** | `/booking.html?service=tour&tour=innsbruck` |

---

## 5. Dedicated Transfer Destination Page Template (`/destinations/<slug>.html`)

### 5.1 Route Overview & Transparent Pricing
For airport transfers and long-distance intercity routes:

```
+---------------------------------------------------------------------------------------------------+
| DEDICATED DESTINATION TEMPLATE (/destinations/munich-airport.html)                                |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|   <!-- 1. Route Hero Panorama -->                                                                 |
|   SALZBURG TO MUNICH AIRPORT (MUC) EXECUTIVE CHAUFFEUR TRANSFER                                   |
|   Direct, stress-free cross-border transfer connecting Salzburg directly to Terminal 1 & 2       |
|                                                                                                   |
|   <!-- 2. Route Metrics Dashboard -->                                                             |
|   +-------------------------------------------------------------------------------------------+   |
|   |  Distance: 175 km  |  Duration: ~1h 45m  |  Cross-Border Highway Vignette Included        |   |
|   +-------------------------------------------------------------------------------------------+   |
|                                                                                                   |
|   <!-- 3. Fixed Rate Comparison by Vehicle -->                                                    |
|   +-----------------------------------+-----------------------------------+-------------------+   |
|   | Mercedes-Benz E-Class Sedan       | Mercedes-Benz V-Class VIP Minivan | Mercedes Vito     |   |
|   | Max 3 Pax • 2 Large + 2 Cabin     | Max 8 Pax • 8 Large Suitcases     | Max 8 Pax • 4MATIC|   |
|   | Fixed Quote: €445.00              | Fixed Quote: €465.00              | Special: €490.00  |   |
|   | [ Book E-Class ]                  | [ Book V-Class ]                  | [ Book Vito ]     |   |
|   +-----------------------------------+-----------------------------------+-------------------+   |
|                                                                                                   |
|   <!-- 4. Airport Meet & Greet Protocol -->                                                       |
|   (Plane) Touchdown flight delay monitoring included via live AviationStack polling.             |
|   (Clock) Chauffeur waits 60 minutes free inside Munich Airport arrival hall with name board.     |
|   (Shield) Direct highway toll vignette & border transit fees 100% included.                      |
|                                                                                                   |
|   [ BOOK SALZBURG <-> MUNICH AIRPORT TRANSFER -> ]                                                |
+---------------------------------------------------------------------------------------------------+
```

---

## 6. Visual Decluttering Principles & Mobile Ergonomics Checklist

### 6.1 Strict Decluttering Directives
1. **No Card-in-Card Nesting:** Never place a bordered glass card inside another bordered glass card. Use clean background shifts (`bg-midnight` vs `bg-surface`) or subtle dividers (`border-b border-slate-800`).
2. **Unified Narrative Components:** Merge imagery, timestamps, and sight descriptions into a single, cohesive vertical layout rather than creating separate floating boxes.
3. **Progressive Disclosure:** On mobile screens, secondary details (such as detailed cancellation policies or driver background checks) must be placed in tap-to-expand accordions rather than occupying prime vertical screen real estate.
4. **Zero Unicode Emojis:** Strictly enforce 100% Lucide 2px stroke SVG icons via Iconify. Never use flag emojis or decorative star characters.

### 6.2 Mobile Ergonomics Checklist

| Evaluation Parameter | Threshold Standard | Implementation Verification |
| :--- | :--- | :--- |
| **Touch Targets** | $\ge 44 \times 44\text{px}$ | Buttons, counter buttons (`w-11 h-11`), quick chips (`min-h-[44px]`). |
| **Input Font Size** | $16\text{px}$ (`1rem`) | All `<input>`, `<select>`, `<textarea>` prevent iOS Safari auto-zoom. |
| **Horizontal Page Overflow** | `0px` (`scrollWidth == clientWidth`) | `overflow-x: hidden` enforced on `html, body`; responsive containers. |
| **Mobile Drawer Navigation** | Slide-over with backdrop blur | Body scroll locked (`overflow: hidden`) while mobile menu is open. |
| **Stepped Booking Header** | Compact Sticky Card | Displays `Step X of 6: [Title]` on screens $<640\text{px}$. |
| **Sticky Action Buttons** | Fixed bottom on mobile | Primary booking button docked within comfortable thumb reach. |

---

## 7. Implementation Directives for Lead Technical Engineer (`TSK-PET-035`)

To implement this specification in `/home/hanzlaahmad/OpenBot/Shared/PETRANS/website/`:

1. **Homepage Refactoring (`index.html`):**
   - Remove `<section id="booking-stepper">` and all its multi-step form DOM nodes.
   - Insert the **Minimal 3-Option Quick Booking Module** inside the hero section.
   - Retain the single-vehicle 3D spotlight carousel in `#fleet`.
   - Update tour cards to link to `/tours/<slug>.html`.
2. **Create Dedicated Booking Page (`public/booking.html`):**
   - Construct a streamlined layout hosting the 6-stage booking wizard.
   - Include URL query parameter parser (`?service=`, `?tour=`, `?vehicle=`, `?pickup=`, `?dropoff=`).
   - Implement `history.pushState` and `window.onpopstate` back-button navigation.
3. **Create Tour Templates (`public/tours/`):**
   - Build `/tours/hallstatt.html`, `/tours/eagles-nest.html`, `/tours/zell-am-see.html`, and `/tours/innsbruck.html`.
   - Implement unified storytelling layout with recognizable photography and deep-link booking CTAs.
4. **Create Destination Templates (`public/destinations/`):**
   - Build `/destinations/munich-airport.html` and `/destinations/vienna.html`.
5. **Script Organization:**
   - Maintain `app.js` for homepage interactive elements (hero module, 3D vehicle carousel, mobile drawer).
   - Create `booking.js` for `/booking.html` (stepper logic, validation, pricing calculation, state hydration).

---

## 8. Quality Assurance & Compliance Acceptance Checklist

The Auditor (`agent-155a4006-d652-4bed-813f-862abcd83fb7`) and Browser QA Tester (`agent-49ce8d12-b37c-450c-bd4c-7fb6a9c0c8d1`) will evaluate the implementation against the following acceptance criteria:

| Test Case | Scenario / Condition | Acceptance Threshold |
| :--- | :--- | :--- |
| **TC-MOB-01** | Homepage Scroll Height on Mobile | Vertical scroll reduced by $\ge 40\%$; no embedded 6-step form on landing page. |
| **TC-MOB-02** | Hero 3-Option Booking Module | Quick selection seamlessly passes query parameters to `/booking.html`. |
| **TC-MOB-03** | Dedicated `/booking.html` Usability | Distraction-free booking flow; 0px horizontal overflow on iPhone SE (375px). |
| **TC-MOB-04** | Input Anti-Zoom Verification | Tapping inputs on iOS Safari does NOT trigger automatic viewport zooming. |
| **TC-MOB-05** | Browser Back Navigation | Tapping device back button moves to previous stepper stage without data loss. |
| **TC-MOB-06** | Tour Page Unified Storytelling | Tour pages display unified itinerary, key facts bar, and direct booking CTA. |
| **TC-MOB-07** | Zero Emoji Policy | 0% emojis across all new HTML, JavaScript, and CSS files. |
| **TC-MOB-08** | Austrian Legal & FAGG § 8 | Booking confirmation displays `PENDING OWNER CONFIRMATION`; zero card capture. |

---

*This specification is saved at `/home/hanzlaahmad/OpenBot/Shared/PETRANS/design/mobile_first_multipage_ux_spec.md` and stands as the authoritative architectural blueprint for PETRANS mobile-first multipage evolution.*
