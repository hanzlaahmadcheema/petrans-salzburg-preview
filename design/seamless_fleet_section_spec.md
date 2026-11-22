# PETRANS Seamless Split Fleet Showcase: UI/UX Design Specification
**Document ID:** `SPEC-PET-2026-SEAMLESS-FLEET-001`  
**Task Reference:** `TSK-PET-041` (Seamless Split Fleet Showcase UI/UX Specification)  
**Author:** UI/UX Design Specialist (`agent-71f645ad-ba24-419e-bdff-ee05809a4b0e`)  
**Project Owner & Founder:** Hanzla Ahmad  
**Direct Handoff To:** Lead Technical Engineer (`agent-83113a2c-0243-469e-8242-ed86c887356c` / `TSK-PET-042`)  
**Target Codebase:** `/home/hanzlaahmad/Projects/OmerFarooq/website/` (`#fleet` Section)  
**Status:** Approved Design Specification & Engineering Blueprint  
**Date:** November 22, 2026  

---

## 1. Executive Summary & Founder Directive

### 1.1 Founder Feedback Analysis
Following review of the interactive fleet carousel implementation, Founder Hanzla Ahmad delivered clear, decisive critique:
> *"There should no seperate card / create a section, no card with border / and don't use full image / the detail should be on left and car should show on right, not full car just 40% of car front from side / same thing for mobile"*

### 1.2 Core Architectural Shifts
This specification fundamentally redesigns the homepage `#fleet` section to satisfy the Founder's vision:

| Previous Architecture (TSK-PET-029) | Redesigned Architecture (TSK-PET-041) |
| :--- | :--- |
| **Dual Bordered Cards:** A bordered `.fleet-stage-container` above, and a separate bordered glassmorphic `#fleet-spec-card` below. | **Zero Separate Cards:** 100% elimination of all outer card borders and separate glass cards. `#fleet` is a unified, seamless section on Deep Alpine Slate (`#0B0F19`). |
| **Centered Full Vehicle in a Box:** Car scaled down to fit entirely inside a 16:9 / 21:9 rectangular frame, looking like a boxed scale model. | **Dramatic 40% Front Profile Peek:** Car enters dynamically from the right edge of the screen/container, displaying strictly ~40% of its front profile from the side while the rear 60% flows off-canvas. |
| **Vertical Stacked Content:** Stage on top, specification card below. | **Asymmetric Split Showcase:** Editorial details on the left (tabs, category, title, rate lockup, amenities, slide controls, CTAs) and dramatic vehicle visual entering on the right. |
| **Mobile Standard Centered Stack:** Shrunk car in box, followed by card stack. | **"Same Thing for Mobile":** Asymmetric split/staggered layout on 375px–428px screens; vehicle enters from the right showing 40% front profile while details align left, with guaranteed 0px horizontal scrollbar breakout. |

```
+===================================================================================================================+
| DESKTOP VIEWPORT (1024px - 1440px+)                                                                               |
| Background: Deep Alpine Slate (#0B0F19) - No Card Borders - Continuous Section Flow                                |
+===================================================================================================================+
|                                                                                                                   |
|   LEFT COLUMN (Details & Actions - 55% Width)                  RIGHT COLUMN (Vehicle Peek - 45% Width)            |
|   -------------------------------------------                  ---------------------------------------            |
|   [ EXCLUSIVELY MERCEDES-BENZ FLEET ]                                                                             |
|   Our Handcrafted Alpine Fleet                                                            .-----.                 |
|   Rigorously serviced and climate-controlled.                                            /  .-.  \                |
|                                                                                         |  /   \  |               |
|   [ E-Class Sedan ] [ * V-Class Van * ] [ Vito 4MATIC ]                                 | |     | | [SCREEN EDGE] |
|                                                                                         |  \   /  |   (Rear 60%   |
|   EXECUTIVE CHAUFFEUR SEDAN                                                             \   `-'   /   off-canvas) |
|   Mercedes-Benz E-Class                                         ====== FRONT 40% ======  `-----'        |         |
|   Obsidian Black Metallic • W214 Series                         (Hood, Grille, Front Wheel,             |         |
|                                                                  Headlight, Windshield)                 |         |
|   €2.50 / km      Mandatory Base Floor: €45.00                                                          |         |
|   Tolls, Vignette & 20% Austrian VAT Included                                                           |         |
|                                                                  ~~~~~~~~ Floor Gold Glow ~~~~~~~~      |         |
|   +-----------------------+-----------------------+              ( Contact Shadow Plane )               |         |
|   | [Users] Max 3 Pax     | [Luggage] 2+2 Bags    |                                                     |         |
|   | [Shield] Child Seats  | [Snow] Free Ski Gear  |                                                     |         |
|   | [Wifi] High-Speed Wifi| [Coffee] Water Bottles|                                                     |         |
|   +-----------------------+-----------------------+                                                               |
|                                                                                                                   |
|   [ 01 / 03 • Mercedes E-Class ]   (< Prev)  (Next >)                                                             |
|                                                                                                                   |
|   [ BOOK THIS VEHICLE -> ]     [ Route Rates ]                                                                    |
|                                                                                                                   |
+===================================================================================================================+
```

---

## 2. Visual Hierarchy & Composition Specifications

### 2.1 The Seamless Canvas (Eliminating All Boxed Cards)
1. **Background Integrity:** The entire `#fleet` section rests on `#0B0F19` (Deep Alpine Slate). No inner wrapper may carry a distinct container background (such as `#161F30`) or a container border (`border border-gold/20` or `border-slate-800`).
2. **Boundary-Free Flow:** Remove `.fleet-stage-container` and `#fleet-spec-card` bounding boxes. The stage and the specification deck merge into a unified CSS grid container (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`).
3. **Theatrical Ambient Floor Glow:** Instead of a circular spotlight inside a box, an unconstrained radial gradient spans the floor beneath the right-side vehicle entrance:
   ```css
   .fleet-floor-glow {
     position: absolute;
     right: -10%;
     bottom: 5%;
     width: 70%;
     height: 50%;
     background: radial-gradient(
       ellipse 65% 40% at 60% 70%,
       rgba(197, 160, 89, 0.14) 0%,
       rgba(22, 31, 48, 0.35) 45%,
       rgba(11, 15, 25, 0.0) 75%
     );
     pointer-events: none;
     z-index: 1;
   }
   ```

### 2.2 Right Column: 40% Front Profile Side Peek Geometry
1. **The Visual Concept:** Chauffeur clients do not judge luxury by seeing a small car trapped inside a frame; they judge it by seeing the imposing, immaculate front quarter of an executive Mercedes-Benz arriving to receive them.
2. **Cropping & Positioning Math:**
   - The vehicle container on desktop occupies `col-span-5` or `col-span-6` (`flex-1` / `w-full relative`).
   - The vehicle image (`img#fallback-img`) has an intrinsic horizontal translation:
     * `width: 135% to 150%` of its parent column.
     * `transform: translateX(18%)` to `translateX(28%)` (or `right: -25%` to `-35%`).
     * `object-fit: contain; object-position: right center;`.
   - Result: Exactly the front ~40% (bumper, headlights, star emblem, hood, front alloy wheel, front wheel arch, side mirror, and driver door window) is visible inside the section. The remaining ~60% (rear doors, rear quarter, rear wheels, and tail) extends naturally off the right margin.
   - **Section Level Clip:** `#fleet` has `overflow: hidden; position: relative; width: 100%; max-width: 100vw;`. This completely clips the rear off-canvas portion without causing a single pixel of horizontal overflow.
3. **Contact Shadow & Ambient Grounding:**
   - Multi-layer drop shadow: `filter: drop-shadow(0 25px 35px rgba(0, 0, 0, 0.85)) drop-shadow(0 10px 15px rgba(0, 0, 0, 0.6));`.
   - Soft tire contact shadow grounded to the floor line, eliminating any "floating car" effect.

### 2.3 Left Column: Information & Actions Deck
The left column (`col-span-7` or `col-span-6` on desktop) organizes the operational, financial, and booking information with razor-sharp editorial rhythm:
1. **Eyebrow & Section Title:**
   - Pill: `[ Exclusively Mercedes-Benz Fleet ]` (`text-gold bg-gold/10 border border-gold/25 text-xs font-bold uppercase tracking-wider`).
   - Title: `Our Handcrafted Alpine Fleet` (Font: `Outfit`, bold, text color: `#F8FAFC`, size: `text-3xl sm:text-4xl lg:text-5xl`).
2. **Model Selector Tabs (Direct Access):**
   - Sleek horizontal segmented bar: `[ E-Class Sedan ]`, `[ V-Class Van ]`, `[ Vito 4MATIC ]`.
   - Active tab: Champagne Gold gradient (`bg-gradient-to-r from-gold via-amber-200 to-gold text-midnight font-bold shadow-lg shadow-gold/25`).
   - Inactive tabs: Subtle slate (`text-slate-400 hover:text-snow bg-slate-900/60 hover:bg-slate-800/80`).
   - Touch targets strictly $\ge 44 \times 44\text{px}$.
3. **Vehicle Headline & Metadata:**
   - Category Badge: `Executive Chauffeur Sedan` / `Flagship VIP Chauffeur` / `Alpine 4MATIC Minivan`.
   - Vehicle Name: `Mercedes-Benz E-Class` (Font: `Outfit`, size: `text-2xl sm:text-3xl font-extrabold text-snow`).
   - Subtitle: `Obsidian Black Metallic • W214 Series` (`text-xs text-slate-400 font-sans tracking-wide`).
4. **Transparent Pricing Lockup:**
   - Rate: Large font `€2.50 / km` (`text-3xl sm:text-4xl font-extrabold font-mono text-gold`).
   - Floor: `Mandatory Base Floor: €45.00` (`text-xs font-semibold text-slate-400`).
   - Inclusions: `Tolls, Vignette & 20% Austrian VAT Included` (`text-xs font-medium text-emerald-400`).
5. **Technical Amenities Grid (6-Pill Symmetrical Matrix):**
   - 0% emojis. Strictly 2px stroke Lucide SVG icons.
   - Badges styled with subtle border and frosted backdrop (`bg-slate-900/50 border border-slate-800/80 rounded-xl p-2.5 text-xs text-slate-300`).
   - Icons: `lucide:users`, `lucide:briefcase`, `lucide:shield-check`, `lucide:snowflake`, `lucide:wifi`, `lucide:coffee`.
6. **Navigation Controls & Slide Indicators:**
   - Numeric Indicator: `01 / 03 • Mercedes-Benz E-Class Sedan` (`font-mono text-xs font-bold text-slate-400`).
   - Chevrons: Circular 44x44px glass buttons (`<` and `>`) placed inline with the indicator, allowing quick cycling.
7. **Action CTAs:**
   - Primary: `[ Book This Vehicle -> ]` (`btn-gold text-sm py-3 px-7 font-bold shadow-lg shadow-gold/25 min-h-[44px]`). Deep-links to `/booking.html?vehicle=e-class` (or current active vehicle slug).
   - Secondary: `[ Route Rates ]` (`btn-outline-gold text-xs py-3 px-5 font-semibold min-h-[44px]`). Smooth scrolls to `#routes`.

---

## 3. "Same Thing for Mobile" — Mobile Architecture (375px–428px)

### 3.1 Mobile Layout Challenge & Solution
On small screens (iPhone SE at 375px, iPhone 14/15 at 390px, Samsung S22 at 412px), placing details side-by-side with a full car causes severe cramping. However, the Founder explicitly commanded:
> *"same thing for mobile"*

This means mobile must NOT revert to a centered boxed thumbnail. It must embody the **same split/peek concept**:
1. **Asymmetric Staggered Peek Composition:**
   - Left side contains the core textual identity and price.
   - Right side allows the front 40% of the vehicle to enter dramatically from the right edge of the screen.
   - The vehicle image bleeds off the right viewport edge (`transform: translateX(30%)` or `right: -25%`).
   - Zero horizontal scrollbar breakout (`0px` overflow).
2. **Vertical Rhythm on Mobile:**
   - **Block 1: Section Header & Switcher Tabs:** Compact centered header, horizontal tab pills with full touch targets ($44\text{px}$).
   - **Block 2: The Mobile Split Showcase:**
     * Left Column / Area (~55% width): Category pill, Vehicle Name, Base Rate (`€2.50/km`), Floor notice.
     * Right Column / Area (~45% width, extending off-canvas): The vehicle entering from the right, showing front bumper, grille, headlight, and front alloy wheel.
   - **Block 3: Amenities Matrix:** 2-column clean grid directly beneath the split hero.
   - **Block 4: Slide Controls & CTAs:** Chevron controls, slide counter `01 / 03`, and prominent full-width action buttons.

```
+===================================================+
| MOBILE VIEWPORT (375px - 428px)                   |
| Background: #0B0F19 | 0px Horizontal Overflow     |
+===================================================+
|                                                   |
|   [ EXCLUSIVELY MERCEDES-BENZ ]                   |
|   Our Handcrafted Alpine Fleet                    |
|                                                   |
|   [ E-Class ]   [ * V-Class * ]   [ Vito ]        |
|                                                   |
|   +--------------------------+-----------------+  |
|   | EXECUTIVE SEDAN          |                 |  |
|   | Mercedes E-Class         |     .----.      |  |
|   | W214 Series              |    /  .-. \     |  |
|   |                          |   |  /   \ | -> [RIGHT SCREEN EDGE]
|   | €2.50 / km               |   | |     ||    |  (Rear 60% clipped)
|   | Floor: €45.00            |    \ `---' /    |  |
|   | VAT & Tolls Included     |     `-----'     |  |
|   +--------------------------+-----------------+  |
|                                                   |
|   +-----------------------+-------------------+   |
|   | [Users] Max 3 Pax     | [Bags] 2+2 Bags   |   |
|   | [Shield] Child Seats  | [Snow] Ski Gear   |   |
|   | [Wifi] High-Speed Wifi| [Coffee] Water    |   |
|   +-----------------------+-------------------+   |
|                                                   |
|          (<)   01 / 03 • E-Class Sedan   (>)      |
|                                                   |
|   [ BOOK THIS VEHICLE — PRESELECTED -> ]          |
|   [ View Route Rates & Fixed Fares ]              |
|                                                   |
+===================================================+
```

### 3.2 Mobile Touch & Overflow Technical Guardrails
1. **0px Horizontal Scrollbar Constraint:**
   - Container rule: `#fleet { overflow: hidden; width: 100%; position: relative; }`
   - Child wrapper rule: `.fleet-mobile-stage { position: relative; width: 100%; overflow: hidden; }`
   - The vehicle image is placed in an absolute or overflowing flex container with `pointer-events: none;`. It will never stretch the document body.
2. **Touch Targets:**
   - Tabs: `min-height: 44px; padding: 10px 14px;`
   - Chevrons: `min-width: 44px; min-height: 44px;`
   - CTAs: `min-height: 48px; width: 100%;`
3. **Swipe Gestures:**
   - Mobile touch listeners (`touchstart`, `touchend`) on the fleet showcase area trigger `nextFleetVehicle()` and `prevFleetVehicle()` when horizontal swipe displacement exceeds 50px, while preserving natural vertical page scrolling.

---

## 4. Vehicle Data & Fleet Parameter Registry

All data attributes and DOM elements must strictly preserve backwards compatibility with `website/public/pricing-config.js` and `website/public/app.js`:

```javascript
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
    poster: '/images/mercedes-e-class.webp',
    pngFallback: '/images/mercedes-e-class.png',
    indicator: '01 / 03 • Mercedes-Benz E-Class Sedan'
  },
  {
    category: 'V_CLASS',
    slug: 'v-class',
    badge: 'Flagship VIP Chauffeur',
    name: 'Mercedes-Benz V-Class',
    subtitle: 'Extra-Long Luxury Edition • Ambient Chauffeur Lounge',
    ratePerKm: 2.60,
    baseFloor: 45.00,
    pax: 'Max 8 Passengers',
    luggage: '8 Large Suitcases',
    amenity3: { icon: 'lucide:shield-check', text: 'Free Child Seats' },
    amenity4: { icon: 'lucide:snowflake', text: 'Free Ski Equipment', sky: true },
    amenity5: { icon: 'lucide:wifi', text: 'High-Speed Wi-Fi' },
    amenity6: { icon: 'lucide:coffee', text: 'Bottled Water' },
    poster: '/images/mercedes-v-class.webp',
    pngFallback: '/images/mercedes-v-class.png',
    indicator: '02 / 03 • Mercedes-Benz V-Class Van'
  },
  {
    category: 'VITO',
    slug: 'vito',
    badge: 'Alpine 4MATIC Minivan',
    name: 'Mercedes-Benz Vito Tourer',
    subtitle: 'Permanent All-Wheel Drive • Ski & Mountain Ready',
    ratePerKm: 2.80,
    baseFloor: 45.00,
    pax: 'Max 8 Passengers',
    luggage: '8 Large Suitcases',
    amenity3: { icon: 'lucide:mountain', text: '4MATIC All-Wheel' },
    amenity4: { icon: 'lucide:snowflake', text: 'Free Ski Equipment', sky: true },
    amenity5: { icon: 'lucide:zap', text: 'USB Fast Power' },
    amenity6: { icon: 'lucide:users', text: 'Group Expedition' },
    poster: '/images/mercedes-vito.webp',
    pngFallback: '/images/mercedes-vito.png',
    indicator: '03 / 03 • Mercedes-Benz Vito Tourer 4MATIC'
  }
];
```

---

## 5. Engineering Blueprint: HTML Markup Architecture

The following markup replaces lines 525–713 in `/home/hanzlaahmad/Projects/OmerFarooq/website/public/index.html`. It completely eliminates `.fleet-stage-container` and `#fleet-spec-card`, replacing them with a seamless split layout:

```html
<!-- ======================================================================= -->
<!-- 5. SEAMLESS SPLIT MERCEDES-BENZ FLEET SHOWCASE (TSK-PET-041 COMPLIANT) -->
<!-- ======================================================================= -->
<section id="fleet" class="py-16 sm:py-24 bg-midnight relative overflow-hidden" role="region" aria-roledescription="carousel" aria-label="Mercedes-Benz Alpine Fleet">

  <!-- Theatrical Floor Ambient Glow (Grounding Right-Side Vehicle Entrance) -->
  <div class="fleet-floor-glow" aria-hidden="true"></div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

    <!-- Section Header & Model Selector Tabs -->
    <div class="max-w-3xl mb-8 sm:mb-12">
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-bold uppercase tracking-wider mb-3">
        <iconify-icon icon="lucide:car" width="14" height="14"></iconify-icon>
        <span>Exclusively Mercedes-Benz Fleet</span>
      </div>
      <h2 class="text-3xl sm:text-5xl font-bold font-outfit text-snow mb-3 leading-tight">
        Our Handcrafted Alpine Fleet
      </h2>
      <p class="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
        Every journey across Salzburg and the Austrian Alps is conducted in an immaculate, climate-controlled Mercedes-Benz. Transparent distance pricing, zero upfront payment, and licensed Austrian chauffeurs.
      </p>

      <!-- Model Selector Tabs (Symmetrical 3-Tab Bar, No Outer Box Borders) -->
      <div class="flex items-center gap-2 mt-6 p-1 bg-surface/80 backdrop-blur-md rounded-2xl border border-slate-800/80 max-w-lg shadow-xl" role="tablist" aria-label="Select Mercedes-Benz Vehicle">
        <button type="button" class="fleet-tab active flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold font-outfit transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px]" role="tab" aria-selected="true" data-index="0" data-vehicle="e-class" onclick="switchFleetVehicle(0)">
          <iconify-icon icon="lucide:car" width="16" height="16"></iconify-icon>
          <span>E-Class Sedan</span>
        </button>

        <button type="button" class="fleet-tab flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold font-outfit text-slate-300 hover:text-gold transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px]" role="tab" aria-selected="false" data-index="1" data-vehicle="v-class" onclick="switchFleetVehicle(1)">
          <iconify-icon icon="lucide:car" width="16" height="16"></iconify-icon>
          <span>V-Class Van</span>
        </button>

        <button type="button" class="fleet-tab flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold font-outfit text-slate-300 hover:text-gold transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px]" role="tab" aria-selected="false" data-index="2" data-vehicle="vito" onclick="switchFleetVehicle(2)">
          <iconify-icon icon="lucide:car" width="16" height="16"></iconify-icon>
          <span>Vito 4MATIC</span>
        </button>
      </div>
    </div>

    <!-- Main Asymmetric Showcase Layout (Split: Details Left, 40% Front Profile Right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center" id="fleet-stage" tabindex="0" aria-label="Interactive Mercedes-Benz Fleet Showcase">

      <!-- LEFT COLUMN: Vehicle Details, Rates, Amenities, Controls & CTAs (7 Columns Desktop) -->
      <div class="lg:col-span-7 xl:col-span-6 flex flex-col justify-center z-10">

        <!-- Category, Name & Subtitle -->
        <div class="mb-5">
          <span class="inline-block px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-[11px] font-bold uppercase tracking-wider mb-2" id="carousel-category">
            Executive Chauffeur Sedan
          </span>
          <h3 class="text-3xl sm:text-4xl xl:text-5xl font-extrabold font-outfit text-snow leading-tight tracking-tight" id="carousel-name">
            Mercedes-Benz E-Class
          </h3>
          <p class="text-xs sm:text-sm text-slate-400 mt-1 font-sans" id="carousel-subtitle">
            Obsidian Black Metallic • W214 Series
          </p>
        </div>

        <!-- Transparent Rate Lockup (No Inner Card Border, Seamless Flow) -->
        <div class="py-4 border-y border-slate-800/80 mb-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <div class="flex items-baseline gap-1.5">
            <span class="text-3xl sm:text-4xl xl:text-5xl font-extrabold font-mono text-gold" id="carousel-rate">€2.50</span>
            <span class="text-sm font-bold text-slate-400 font-sans">/ km</span>
          </div>
          <div class="space-y-0.5">
            <span class="text-xs font-semibold text-slate-300 block" id="carousel-floor">
              Mandatory Base Floor: €45.00
            </span>
            <span class="text-[11px] text-emerald-400 font-medium block">
              Tolls, Vignette & 20% Austrian VAT Included
            </span>
          </div>
        </div>

        <!-- Technical Amenities (6-Pill Symmetrical Grid) -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-8 text-xs font-medium text-slate-300">
          <div class="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface/60 border border-slate-800/80">
            <iconify-icon icon="lucide:users" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
            <span id="carousel-pax">Max 3 Passengers</span>
          </div>
          <div class="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface/60 border border-slate-800/80">
            <iconify-icon icon="lucide:briefcase" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
            <span id="carousel-luggage">2 Large + 2 Cabin Bags</span>
          </div>
          <div class="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface/60 border border-slate-800/80">
            <iconify-icon id="carousel-amenity-3-icon" icon="lucide:shield-check" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
            <span id="carousel-amenity-3-text">Free Child Seats</span>
          </div>
          <div class="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface/60 border border-slate-800/80">
            <iconify-icon id="carousel-amenity-4-icon" icon="lucide:snowflake" width="16" height="16" class="text-sky-400 flex-shrink-0"></iconify-icon>
            <span id="carousel-amenity-4-text">Free Ski Equipment</span>
          </div>
          <div class="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface/60 border border-slate-800/80">
            <iconify-icon id="carousel-amenity-5-icon" icon="lucide:wifi" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
            <span id="carousel-amenity-5-text">High-Speed Wi-Fi</span>
          </div>
          <div class="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface/60 border border-slate-800/80">
            <iconify-icon id="carousel-amenity-6-icon" icon="lucide:coffee" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
            <span id="carousel-amenity-6-text">Bottled Water</span>
          </div>
        </div>

        <!-- Slide Controls (Chevrons + Numeric Indicator) & CTAs -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
          
          <!-- Slide Counter & Chevron Navigation -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <button type="button" class="fleet-chevron-btn min-w-[44px] min-h-[44px]" aria-label="Previous vehicle" onclick="prevFleetVehicle()">
                <iconify-icon icon="lucide:chevron-left" width="20" height="20"></iconify-icon>
              </button>
              <button type="button" class="fleet-chevron-btn min-w-[44px] min-h-[44px]" aria-label="Next vehicle" onclick="nextFleetVehicle()">
                <iconify-icon icon="lucide:chevron-right" width="20" height="20"></iconify-icon>
              </button>
            </div>
            <span class="text-xs sm:text-sm font-mono tracking-wider text-slate-300 font-semibold" id="carousel-indicator-text">
              01 / 03 • Mercedes-Benz E-Class Sedan
            </span>
          </div>

          <!-- Action CTA Buttons -->
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <a href="#routes" class="btn-outline-gold text-xs py-3 px-4 flex-1 sm:flex-none text-center min-h-[44px]">
              Route Rates
            </a>
            <button type="button" onclick="bookCurrentFleetVehicle()" class="btn-gold text-sm py-3 px-6 flex-1 sm:flex-none text-center min-h-[44px] shadow-lg shadow-gold/25" id="carousel-book-cta">
              <span>Book This Vehicle</span>
              <iconify-icon icon="lucide:arrow-right" width="16" height="16" class="ml-1.5"></iconify-icon>
            </button>
          </div>

        </div>

      </div>

      <!-- RIGHT COLUMN: 40% Front Profile Vehicle Showcase (Entering from Right Screen Edge) -->
      <div class="lg:col-span-5 xl:col-span-6 relative flex items-center justify-end select-none pointer-events-none mt-6 lg:mt-0">
        <div class="fleet-vehicle-peek-wrapper">
          <img 
            id="fallback-img" 
            src="/images/mercedes-e-class.webp" 
            alt="Mercedes-Benz E-Class Executive Sedan" 
            class="fleet-peek-image"
            loading="eager"
          />
        </div>
      </div>

    </div>

  </div>
</section>
```

---

## 6. Engineering Blueprint: CSS Stylesheet Specifications

The following CSS rules replace lines 408–520 in `/home/hanzlaahmad/Projects/OmerFarooq/website/public/style.css`:

```css
/* ============================================================
   PETRANS SEAMLESS SPLIT FLEET SHOWCASE STYLES (TSK-PET-041)
   ============================================================ */

/* 1. Root Section: Seamless Alpine Slate Background, Strict Overflow Guard */
#fleet {
  position: relative;
  background-color: #0B0F19; /* Midnight Deep Slate */
  overflow: hidden; /* Clips the rear 60% of the vehicle cleanly with 0px window scroll */
  width: 100%;
}

/* 2. Theatrical Ambient Floor Glow (Spans beneath vehicle entrance) */
.fleet-floor-glow {
  position: absolute;
  right: -5%;
  bottom: 0;
  width: 65%;
  height: 60%;
  background: radial-gradient(
    ellipse 70% 45% at 65% 75%,
    rgba(197, 160, 89, 0.16) 0%,
    rgba(22, 31, 48, 0.35) 45%,
    rgba(11, 15, 25, 0) 80%
  );
  pointer-events: none;
  z-index: 1;
}

/* 3. Right Column Vehicle Peek Stage */
.fleet-vehicle-peek-wrapper {
  position: relative;
  width: 100%;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  pointer-events: none;
}

@media (min-width: 640px) {
  .fleet-vehicle-peek-wrapper {
    min-height: 380px;
  }
}

@media (min-width: 1024px) {
  .fleet-vehicle-peek-wrapper {
    min-height: 480px;
    width: 145%; /* Expands container to bleed beyond right margin */
    margin-right: -45%; /* Pulls vehicle to the extreme right edge */
  }
}

@media (min-width: 1280px) {
  .fleet-vehicle-peek-wrapper {
    width: 155%;
    margin-right: -55%;
  }
}

/* 4. Vehicle Peek Image: Front 40% Profile Visible, Rear 60% Bleeds Off-Canvas */
.fleet-peek-image {
  max-width: none;
  width: 125%;
  height: auto;
  object-fit: contain;
  object-position: right center;
  transform: translateX(20%); /* Positions the car so front 40% faces left into the viewport */
  filter: drop-shadow(0 25px 35px rgba(0, 0, 0, 0.85))
          drop-shadow(0 10px 15px rgba(0, 0, 0, 0.65));
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}

@media (min-width: 1024px) {
  .fleet-peek-image {
    width: 100%;
    transform: translateX(10%);
  }
}

/* 5. Mobile-Specific Adaptation ("Same Thing for Mobile" - 375px to 428px) */
@media (max-width: 1023px) {
  .fleet-vehicle-peek-wrapper {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    overflow: visible;
    width: 100%;
    justify-content: flex-end;
  }
  
  .fleet-peek-image {
    width: 135%;
    transform: translateX(28%); /* Front 40% enters from the right on mobile */
    filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.9));
  }
}

/* 6. Navigation Chevrons (Strict 44x44px Touch Targets, Frosted Glass) */
.fleet-chevron-btn {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 9999px;
  background: rgba(22, 31, 48, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #F8FAFC;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  touch-action: manipulation;
}

.fleet-chevron-btn:hover {
  border-color: #CAA328;
  color: #CAA328;
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(202, 163, 40, 0.25);
}

.fleet-chevron-btn:active {
  transform: scale(0.95);
}

/* 7. Direct Model Selector Tabs */
.fleet-tab {
  touch-action: manipulation;
}

.fleet-tab.active {
  background: linear-gradient(135deg, #CAA328 0%, #D4AF37 50%, #B89045 100%);
  color: #0B0F19;
  font-weight: 700;
  border: none;
  box-shadow: 0 4px 15px rgba(202, 163, 40, 0.35);
}
```

---

## 7. JavaScript Dynamic Switcher & State Synchronization

In `/home/hanzlaahmad/Projects/OmerFarooq/website/public/app.js`, the `renderFleetCarousel()` function updates text and triggers a refined cross-fade and subtle slide transition:

```javascript
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

  // 2. Animate Vehicle Visual Transition (Cross-fade & Slide)
  const peekImg = document.getElementById('fallback-img');
  if (peekImg) {
    peekImg.style.opacity = '0';
    peekImg.style.transform = 'translateX(35%) scale(0.98)';
    
    setTimeout(() => {
      peekImg.src = v.poster;
      peekImg.alt = v.name;
      peekImg.style.opacity = '1';
      peekImg.style.transform = window.innerWidth >= 1024 
        ? 'translateX(10%) scale(1)' 
        : 'translateX(28%) scale(1)';
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
  if (rateEl) rateEl.textContent = `€${v.ratePerKm.toFixed(2)}`;

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
```

---

## 8. Verification & QA Matrix

The Lead Technical Engineer (`TSK-PET-042`) and Browser QA Tester (`agent-49ce8d12-b37c-450c-bd4c-7fb6a9c0c8d1`) must verify the implementation against these criteria:

| Test ID | Verification Scope | Acceptance Criteria |
| :--- | :--- | :--- |
| **QA-FLT-001** | Zero Separate Bordered Cards | Neither `.fleet-stage-container` nor `#fleet-spec-card` exist in `#fleet`. Section background is continuous `#0B0F19` without outer borders. |
| **QA-FLT-002** | 40% Front Profile Peek (Desktop) | On viewports $\ge 1024\text{px}$, the vehicle enters from the right screen edge showing the front bumper, grille, headlight, and wheel, with the rear 60% clipped off-canvas. |
| **QA-FLT-003** | "Same Thing for Mobile" (375px–428px) | On mobile viewports (375px, 390px, 412px), vehicle enters from the right edge showing 40% front profile while details sit left. Horizontal scrollbar is strictly `0px` (`scrollWidth === clientWidth`). |
| **QA-FLT-004** | Touch Target Compliance | All interactive elements (`.fleet-tab`, `.fleet-chevron-btn`, `#carousel-book-cta`) have hit areas $\ge 44 \times 44\text{px}$. |
| **QA-FLT-005** | Zero Emojis Rule | Amenities and badges contain 0% emojis. 100% 2px stroke Lucide icons via Iconify. |
| **QA-FLT-006** | Financial Transparency | Fixed distance rates (€2.50/km, €2.60/km, €2.80/km), €45.00 base floor, and 20% Austrian VAT/tolls clearly visible. |
| **QA-FLT-007** | Preselected Booking Flow | Clicking `[ Book This Vehicle ]` navigates to `/booking.html?vehicle=<slug>`, successfully preselecting the vehicle in Stage 1 of the booking engine. |

---

## 9. Handoff & Implementation Sequence

This specification is complete and formally handed off to Lead Technical Engineer (`agent-83113a2c-0243-469e-8242-ed86c887356c`) for immediate execution under task `TSK-PET-042`:
1. **Markup Update:** Replace `#fleet` markup in `/home/hanzlaahmad/Projects/OmerFarooq/website/public/index.html`.
2. **Style Update:** Replace `.fleet-stage-container` and `#fleet-spec-card` styles in `/home/hanzlaahmad/Projects/OmerFarooq/website/public/style.css` with the seamless split rules.
3. **Script Refinement:** Update `renderFleetCarousel()` in `/home/hanzlaahmad/Projects/OmerFarooq/website/public/app.js` to drive the peek image transition.
4. **Automated Verification:** Execute Browser QA tests across 375px, 390px, 412px, 768px, 1280px viewports to verify zero horizontal overflow and seamless visual rendering.
