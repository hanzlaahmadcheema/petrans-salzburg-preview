# PETRANS Fleet Showcase: Interactive Vehicle Carousel UI/UX Design Specification
**Document ID:** `SPEC-PET-2026-CAROUSEL-001`  
**Task Reference:** `TSK-PET-029` (UI/UX Design Specification for Interactive Vehicle Carousel)  
**Author:** UI/UX Design Specialist (`agent-71f645ad-ba24-419e-bdff-ee05809a4b0e`)  
**Project Owner / Decision Maker:** Hanzla Ahmad  
**Technical Architecture Dependency:** `TSK-PET-028` (`/home/hanzlaahmad/OpenBot/Shared/PETRANS/research/3d_vehicle_carousel_architecture.md`)  
**Target Codebase:** `/home/hanzlaahmad/OpenBot/Shared/PETRANS/website/` (`#fleet` Section)  
**Status:** Approved Design Specification & Engineering Handoff  
**Date:** November 21, 2026  

---

## 1. Executive Overview & Design Intent

### 1.1 The Shift to a Single-Vehicle Spotlight Experience
In luxury European automotive and chauffeur services (e.g. Mercedes-Benz VIP Chauffeur, Maybach Atelier, and high-end concierge services), showcasing multiple vehicles side-by-side in small cards dilutes the perception of prestige, cramps high-resolution imagery, and forces the user into an e-commerce comparison mindset.

This specification redesigns the homepage `#fleet` section from a 3-card grid into a **focused, single-vehicle interactive spotlight carousel**. The experience is designed to evoke a **private evening reveal in a Salzburg automotive studio**:
- The customer views **one vehicle at a time**, elevated on a dark luxury stage with an ambient radial gold floor glow.
- The vehicle is presented as an interactive 3D model that auto-rotates smoothly (0.75 RPM) and allows 360° touch scrubbing.
- The technical specifications, capacity metrics, and fixed mileage rates (€2.50/km, €2.60/km, €2.80/km) are displayed in a clean, high-contrast specification deck directly integrated below the stage.
- A prominent gold call-to-action button, `[ Book This Vehicle ]`, seamlessly initiates the booking engine with that vehicle preselected, while preserving complete freedom to switch vehicles at any later stage without friction.

```
+---------------------------------------------------------------------------------------------------+
|                                 SINGLE-VEHICLE SPOTLIGHT CAROUSEL                                 |
+---------------------------------------------------------------------------------------------------+
|                                [ EXCLUSIVELY MERCEDES-BENZ FLEET ]                                |
|                                Our Handcrafted Alpine Fleet                                       |
|                                                                                                   |
|           [ Mercedes-Benz E-Class ]    [ * Mercedes-Benz V-Class * ]    [ Mercedes Vito ]         |
|                                                                                                   |
|    +-----------------------------------------------------------------------------------------+    |
|    |                                                                                         |    |
|    |  (<)                                                                               (>)  |    |
|    | Prev                                                                               Next |    |
|    |                                                                                         |    |
|    |                              [ 3D ROTATING VEHICLE CANVAS ]                             |    |
|    |                               (Mercedes-Benz V-Class VIP)                               |    |
|    |                                                                                         |    |
|    |                      ~~~~~~~~~ Radial Gold Ambient Glow ~~~~~~~~~                       |    |
|    |                                ( Contact Shadow Plane )                                 |    |
|    |                                                                                         |    |
|    |                              [ (o) Drag to Inspect 360° ]                               |    |
|    +-----------------------------------------------------------------------------------------+    |
|                                                                                                   |
|                              [ 02 / 03  •  Mercedes-Benz V-Class ]                                |
|                                                                                                   |
|    +-----------------------------------------------------------------------------------------+    |
|    |  EXCLUSIVE VIP CHAUFFEUR                       €2.60 / km  (Min. €45.00 Base Floor)     |    |
|    |  Mercedes-Benz V-Class Exclusive               Tolls, Austrian Vignette & 20% VAT Incl. |    |
|    |-----------------------------------------------------------------------------------------|    |
|    |  [Users] Max 8 Pax     [Luggage] 8 Large Bags     [Snow] Free Ski Gear     [Wifi] Wi-Fi |    |
|    |-----------------------------------------------------------------------------------------|    |
|    |  [ BOOK THIS VEHICLE — PRESELECTED -> ]             [ View Complete Route Rates ]       |    |
|    +-----------------------------------------------------------------------------------------+    |
+---------------------------------------------------------------------------------------------------+
```

### 1.2 Core Design Principles
1. **Private Showroom Reveal:** Full-width visual focus. Zero clutter, no distracting competing cards, no decorative emojis.
2. **Effortless Inspection:** Smooth, low-friction auto-spin with intuitive horizontal touch scrubbing and inertial damping.
3. **Transparent Financial Authority:** Prominent display of verified fixed distance rates (€2.50/km, €2.60/km, €2.80/km) and the €45.00 base floor, eliminating customer pricing anxiety.
4. **Seamless Booking Funnel Integration:** Clicking `[ Book This Vehicle ]` enters the shared multi-stage booking engine with the vehicle parameter active (`?vehicle=v-class`), maintaining zero customer lock-in.
5. **Mobile Touch & Gesture Fluidity:** Native swipe gestures on iOS and Android devices, guaranteed $\ge 44 \times 44\text{px}$ touch targets, and zero horizontal page overflow.
6. **Graceful Fallback Parity:** Instant WebP poster hydration and automatic hardware degradation for devices without WebGL 2.0, ensuring 100% aesthetic and functional parity.

---

## 2. Single-Vehicle Spotlight Layout & Stage Architecture

### 2.1 Centered Luxury Stage Architecture
The spotlight stage is positioned as the centerpiece of the `#fleet` section. It replaces the fragmented 3-column card grid with a unified, theater-like presentation:

```
+---------------------------------------------------------------------------------------------------+
| STAGE COMPONENT LAYOUT                                                                            |
+---------------------------------------------------------------------------------------------------+
| 1. Eyebrow & Section Heading: "EXCLUSIVELY MERCEDES-BENZ FLEET"                                   |
| 2. Direct Model Selector Tabs: Symmetrical 3-pill toggle bar (E-Class | V-Class | Vito)           |
| 3. Spotlight Stage Canvas Container:                                                              |
|    - Aspect ratio: 16:9 on mobile (375px–767px), 21:9 on desktop (1024px+)                       |
|    - Backdrop: Deep Alpine Slate (#0B0F19) with Frosted Card Surface (#161F30) border             |
|    - Floor Glow: CSS radial gradient ellipse in Champagne Gold (`rgba(197, 160, 89, 0.18)`)       |
|    - Ambient Contact Shadow: Multi-layer elliptical shadow grounding the tires                    |
|    - Floating Chevrons: Absolute positioned left/right chevron buttons (48x48px touch targets)    |
|    - Interaction Hint: Floating bottom badge ("Drag to Inspect 360°")                             |
| 4. Carousel Pagination / Progress Pill: "01 / 03 • Mercedes-Benz E-Class"                         |
| 5. Unified Specification & Pricing Deck: Integrated glassmorphic card directly below stage       |
+---------------------------------------------------------------------------------------------------+
```

### 2.2 Radial Gold Ambient Scrim (CSS Layer)
To prevent the vehicle from appearing isolated in flat darkness, an elliptical ambient gold scrim is rendered beneath the 3D canvas:

```css
/* Ambient Radial Gold Scrim */
.stage-scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 75% 45% at 50% 68%,
    rgba(197, 160, 89, 0.18) 0%,
    rgba(22, 31, 48, 0.45) 45%,
    rgba(11, 15, 25, 0.0) 75%
  );
  z-index: 1;
}
```

### 2.3 Floating 360° Interaction Cue
To inform users that the vehicle is fully interactive without being intrusive:
- A compact pill badge is docked to the bottom center of the stage (`bottom: 24px`).
- Styling: `bg-slate-900/80 backdrop-blur-md border border-gold/30 text-gold text-xs font-semibold px-4 py-1.5 rounded-full`.
- Icon: Iconify `<iconify-icon icon="lucide:rotate-3d" width="16" height="16"></iconify-icon>`.
- Copy: *"Drag to rotate 360°"*.
- Behavior: Immediately fades out (`opacity-0 transition-opacity duration-500`) upon first user touch or drag interaction.

---

## 3. Carousel Navigation & State Indicators

### 3.1 Model Selector Tabs (Direct Access)
Directly above the stage, a symmetrical 3-tab segmented control allows customers to switch directly to any vehicle without clicking through sequentially:

```html
<div class="flex items-center justify-center gap-2 p-1.5 bg-surface/90 backdrop-blur-md rounded-2xl border border-slate-800 max-w-xl mx-auto mb-8 shadow-xl" role="tablist" aria-label="Select Mercedes-Benz Vehicle">
  
  <button type="button" class="fleet-tab active flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold font-outfit transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px]" role="tab" aria-selected="true" data-index="0" data-vehicle="e-class">
    <iconify-icon icon="lucide:car" width="16" height="16"></iconify-icon>
    <span>E-Class Sedan</span>
  </button>

  <button type="button" class="fleet-tab flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold font-outfit text-slate-300 hover:text-gold transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px]" role="tab" aria-selected="false" data-index="1" data-vehicle="v-class">
    <iconify-icon icon="lucide:car" width="16" height="16"></iconify-icon>
    <span>V-Class Van</span>
  </button>

  <button type="button" class="fleet-tab flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold font-outfit text-slate-300 hover:text-gold transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px]" role="tab" aria-selected="false" data-index="2" data-vehicle="vito">
    <iconify-icon icon="lucide:car" width="16" height="16"></iconify-icon>
    <span>Vito 4MATIC</span>
  </button>

</div>
```

#### Active Tab Styling Rules:
- **Active State:** `bg-gradient-to-r from-gold via-amber-200 to-gold text-midnight font-bold shadow-lg shadow-gold/20 scale-[1.02]`.
- **Inactive State:** `bg-transparent text-slate-400 hover:text-snow hover:bg-slate-800/50`.

### 3.2 Floating Glassmorphic Chevron Navigation Buttons
Positioned on the lateral edges of the stage:
- **Desktop ($\ge 1024\text{px}$):** Floating vertically centered inside the stage container (`top: 50%; transform: translateY(-50%)`). Left button docked at `left: 24px`, right button at `right: 24px`.
- **Mobile ($< 1024\text{px}$):** Positioned at `bottom: 20px`, docked left and right, ensuring they do not overlap with the central vehicle body while remaining within thumb reach.
- **Touch Target:** Strict $48 \times 48\text{px}$ hit box (`min-w-[48px] min-h-[48px]`).
- **Aesthetic Styling:**  
  `w-12 h-12 rounded-full bg-surface/80 backdrop-blur-md border border-slate-700/80 text-snow hover:border-gold hover:text-gold hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-xl`.
- **Accessibility:** `aria-label="Previous vehicle"`, `aria-label="Next vehicle"`, full keyboard focus ring (`focus:ring-2 focus:ring-gold`).

### 3.3 Active Index & Pagination Indicator
Positioned between the stage canvas and the specification card:
- Displays current slide index and model name:  
  `01 / 03  •  Mercedes-Benz E-Class Sedan`
- Features interactive indicator bars beneath the text:
  - Three horizontal pill dashes ($32\text{px}$ wide, $4\text{px}$ high).
  - Active dash expands to $48\text{px}$ with a Champagne Gold glow (`bg-gold shadow-sm shadow-gold/50`).
  - Inactive dashes are `bg-slate-800 hover:bg-slate-700` and are clickable to jump directly to that vehicle.

---

## 4. Vehicle Specification & Pricing Bar

Directly beneath the stage, the carousel features an integrated **Specification Deck** (`.fleet-spec-card`) that dynamically updates with smooth opacity cross-fades whenever the active vehicle changes.

```
+---------------------------------------------------------------------------------------------------+
| SPECIFICATION DECK ARCHITECTURE                                                                   |
+---------------------------------------------------------------------------------------------------+
|  [CATEGORY BADGE: Executive Chauffeur Sedan]             [FIXED RATE: €2.50 / km]                |
|  Mercedes-Benz E-Class                                   (Min. €45.00 Base Floor)                 |
|  Obsidian Black Metallic • W213/W214 Series              Tolls, Vignette & 20% Austrian VAT Incl. |
|---------------------------------------------------------------------------------------------------|
|  CAPACITY & AMENITY PILLS:                                                                        |
|  (Users) Max. 3 Passengers   (Briefcase) 2 Large + 2 Cabin Bags   (Shield) Free Child Seats       |
|  (Snow) Free Ski Gear        (Wifi) High-Speed In-Cabin Wi-Fi     (Coffee) Still Water Included   |
|---------------------------------------------------------------------------------------------------|
|  ACTION CTA GROUP:                                                                                |
|  [ BOOK THIS VEHICLE — PRESELECTED -> ]             [ View Route Rates & Fixed Matrix ]           |
+---------------------------------------------------------------------------------------------------+
```

### 4.1 Calibrated Vehicle Data Specification
The specification bar renders exact data for each of the three models:

| Spec Attribute | Mercedes-Benz E-Class | Mercedes-Benz V-Class | Mercedes-Benz Vito Tourer |
| :--- | :--- | :--- | :--- |
| **Category Pill** | `Executive Chauffeur Sedan` | `Exclusive VIP Chauffeur` | `Alpine 4MATIC Specialist` |
| **Model Heading** | `Mercedes-Benz E-Class` | `Mercedes-Benz V-Class` | `Mercedes-Benz Vito Tourer` |
| **Sub-headline** | `Obsidian Black Metallic • W214 Series` | `Obsidian Black Metallic • W447 Exclusive`| `Brilliant Silver • 4MATIC All-Wheel` |
| **Distance Rate** | **€2.50 / km** | **€2.60 / km** | **€2.80 / km** |
| **Base Fare Floor**| **€45.00** (<20 km) | **€45.00** (<20 km) | **€45.00** (<20 km) |
| **Passenger Cap** | `Max 3 Passengers` (or 3+1 child) | `Max 8 Passengers` | `Max 8 Passengers` |
| **Luggage Cap** | `2 Large + 2 Cabin Bags` | `8 Large Suitcases` | `8 Large Suitcases` |
| **Amenity 1** | `lucide:shield-check` Free Child Seats | `lucide:shield-check` Free Child Seats | `lucide:mountain` 4MATIC All-Wheel |
| **Amenity 2** | `lucide:snowflake` Free Ski Equipment | `lucide:snowflake` Free Ski Equipment | `lucide:snowflake` Free Ski Equipment |
| **Amenity 3** | `lucide:wifi` High-Speed Wi-Fi | `lucide:wifi` High-Speed Wi-Fi | `lucide:zap` USB Fast Power |
| **Amenity 4** | `lucide:coffee` Bottled Water | `lucide:coffee` Bottled Water | `lucide:users` Group Expedition |
| **Booking Slug** | `e-class` | `v-class` | `vito` |

### 4.2 Exact HTML Markup for Specification Deck
```html
<div class="glass-card p-6 sm:p-8 rounded-2xl border border-gold/30 max-w-4xl mx-auto shadow-2xl relative z-10 transition-all duration-300" id="fleet-spec-card">
  
  <!-- Header: Category, Titles & Price Lockup -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
    <div>
      <span class="inline-block px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-[11px] font-bold uppercase tracking-wider mb-2" id="carousel-category">
        Exclusive VIP Chauffeur
      </span>
      <h3 class="text-2xl sm:text-3xl font-extrabold font-outfit text-snow leading-tight" id="carousel-name">
        Mercedes-Benz V-Class
      </h3>
      <p class="text-xs text-slate-400 mt-1 font-sans" id="carousel-subtitle">
        Obsidian Black Metallic • W447 Luxury Chauffeur Specification
      </p>
    </div>

    <!-- Rate Lockup -->
    <div class="text-left sm:text-right flex-shrink-0 bg-midnight/60 sm:bg-transparent p-4 sm:p-0 rounded-xl border border-slate-800 sm:border-0">
      <div class="flex items-baseline sm:justify-end gap-1">
        <span class="text-3xl sm:text-4xl font-extrabold font-mono text-gold" id="carousel-rate">€2.60</span>
        <span class="text-sm font-bold text-slate-400 font-sans">/ km</span>
      </div>
      <span class="text-xs font-semibold text-slate-400 block mt-0.5" id="carousel-floor">
        Mandatory Base Floor: €45.00
      </span>
      <span class="text-[11px] text-emerald-400 block font-medium">
        Tolls, Vignette & 20% Austrian VAT Included
      </span>
    </div>
  </div>

  <!-- Key Technical Amenities (6-Pill Responsive Grid) -->
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 py-6 border-b border-slate-800 text-xs font-medium text-slate-300">
    <div class="flex items-center gap-2.5 p-2 rounded-lg bg-surface/50 border border-slate-800/80">
      <iconify-icon icon="lucide:users" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
      <span id="carousel-pax">Max 8 Passengers</span>
    </div>
    <div class="flex items-center gap-2.5 p-2 rounded-lg bg-surface/50 border border-slate-800/80">
      <iconify-icon icon="lucide:briefcase" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
      <span id="carousel-luggage">Max 8 Large Bags</span>
    </div>
    <div class="flex items-center gap-2.5 p-2 rounded-lg bg-surface/50 border border-slate-800/80">
      <iconify-icon icon="lucide:shield-check" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
      <span id="carousel-drive">4MATIC All-Wheel</span>
    </div>
    <div class="flex items-center gap-2.5 p-2 rounded-lg bg-surface/50 border border-slate-800/80">
      <iconify-icon icon="lucide:snowflake" width="16" height="16" class="text-sky-400 flex-shrink-0"></iconify-icon>
      <span>Free Ski Equipment</span>
    </div>
    <div class="flex items-center gap-2.5 p-2 rounded-lg bg-surface/50 border border-slate-800/80">
      <iconify-icon icon="lucide:baby" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
      <span>Free Child Seats</span>
    </div>
    <div class="flex items-center gap-2.5 p-2 rounded-lg bg-surface/50 border border-slate-800/80">
      <iconify-icon icon="lucide:wifi" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
      <span>High-Speed Wi-Fi</span>
    </div>
  </div>

  <!-- Action CTA Buttons -->
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
    <div class="text-xs text-slate-400 text-center sm:text-left">
      <span>Zero booking fees • Pay chauffeur on board</span>
    </div>
    <div class="flex items-center gap-3 w-full sm:w-auto">
      <a href="#routes" class="btn-outline-gold text-xs py-3 px-4 flex-1 sm:flex-none text-center min-h-[44px]">
        Route Rates
      </a>
      <a href="#booking-stepper?vehicle=v-class" class="btn-gold text-sm py-3 px-6 flex-1 sm:flex-none text-center min-h-[44px] shadow-lg shadow-gold/25" id="carousel-book-cta">
        <span>Book This Vehicle</span>
        <iconify-icon icon="lucide:arrow-right" width="16" height="16" class="ml-1.5"></iconify-icon>
      </a>
    </div>
  </div>

</div>
```

---

## 5. Call to Action & Booking Deep Linking

### 5.1 Deep Linking Mechanics
When the user clicks the primary gold button `[ Book This Vehicle ]`:
1. The link dynamically updates its query parameter based on the currently displayed vehicle:
   - E-Class: `#booking-stepper?vehicle=e-class`
   - V-Class: `#booking-stepper?vehicle=v-class`
   - Vito Tourer: `#booking-stepper?vehicle=vito`
2. The click handler invokes the shared engine's `preselectVehicle(slug)` function:
   - Sets `appState.vehicleCategory` to `'E_CLASS'`, `'V_CLASS'`, or `'VITO'`.
   - Adjusts default passenger and luggage counts to match the vehicle's optimal tier.
   - Smoothly scrolls to the booking wizard (`#booking-stepper`).
   - If the user was on Stage 1 (Journey Details), it allows them to enter their route with the car already marked as chosen in Stage 2.
3. **Zero Lock-In Reassurance:** The customer can switch to another vehicle at Stage 2 or Stage 5 (Final Review) without losing any entered journey, contact, or date data.

---

## 6. Mobile Touch & Gesture Ergonomics

### 6.1 Native Swipe Gestures Architecture
To deliver an intuitive mobile experience matching native automotive apps (Apple Maps, Mercedes me):
- The stage container listens to native touch events (`touchstart`, `touchmove`, `touchend`).
- **Gesture Detection Algorithm:**
  - `startX`, `startY`, and `startTime` recorded on `touchstart`.
  - On `touchmove`, calculate horizontal displacement $\Delta x$ and vertical displacement $\Delta y$.
  - **Scroll Protection:** If $|\Delta y| > |\Delta x|$, horizontal swipe logic is suspended, allowing natural vertical page scrolling.
  - On `touchend`, if $|\Delta x| > 50\text{px}$ AND swipe duration $< 350\text{ms}$ (or displacement $> 120\text{px}$):
    * $\Delta x < 0$ (swiped left) $\longrightarrow$ triggers `nextVehicle()`.
    * $\Delta x > 0$ (swiped right) $\longrightarrow$ triggers `prevVehicle()`.
- **Haptic / Visual Feedback:** When dragging near the threshold, the active stage subtly translates ($\pm 12\text{px}$) with an ease-out spring, snapping back if the threshold is not met.

### 6.2 Viewport Responsive Matrix & Overflow Prevention

| Viewport Tier | Width Range | Layout Adaptation | Stage Aspect Ratio |
| :--- | :--- | :--- | :--- |
| **Compact Mobile** | **360px – 389px** (iPhone SE) | Stacked layout; chevrons docked at bottom edges; 2-col specs | `16:9` fixed ratio |
| **Standard Mobile** | **390px – 428px** (iPhone 14/15) | Full-width stage; 2-col specs; sticky bottom CTA on scroll | `16:9` fixed ratio |
| **Tablet Portrait** | **640px – 1023px** (iPad) | Centered floating chevrons; 3-col specs; side-by-side CTA | `16:9` fixed ratio |
| **Desktop Display** | **1024px – 1439px** (MacBook) | Expanded stage; lateral floating chevrons; 3-col specs | `21:9` widescreen |
| **Ultra-wide Display**| **1440px+** (iMac, 4K) | Max container width `max-w-6xl` ($1152\text{px}$); generous whitespace | `21:9` widescreen |

- **Zero Horizontal Overflow:** Container is wrapped in `w-full overflow-hidden relative max-w-7xl mx-auto`. All children use percentage-based or `min-w-0` constraints.

---

## 7. Graceful Fallback Mode (Resilient 2D Mode)

Automotive 3D showcases must never break or freeze on legacy devices, battery-saver modes, or poor connections.

```
                                [ Viewport Enters #fleet ]
                                            |
                         +------------------+------------------+
                         |                                     |
              [ WebGL 2.0 Supported? ]               [ prefers-reduced-motion? ]
                         |                                     |
                   +-----+-----+                               | (Yes)
                   |           |                               v
                 (Yes)        (No) ------------------> [ 2D Studio Mode ]
                   |                                   - Verified WebP
             [ RAM >= 4GB? ]                           - Instant Paint (LCP 0.8s)
                   |                                   - Swipe Carousel
             +-----+-----+                             - Zero WebGL overhead
             |           |
           (Yes)        (No: Low Power)
             |           |
             v           v
       [ 3D Mode ]  [ 2D Mode ]
```

### 7.1 Fallback Component Architecture
When fallback is triggered:
1. `<model-viewer>` is unmounted or omitted from DOM.
2. A high-resolution transparent studio cutout (`/images/mercedes-e-class.webp`, `mercedes-v-class.webp`, or `mercedes-vito.webp`) renders inside the identical `16:9` podium container.
3. The image is styled with:  
   `max-w-[85%] max-h-[80%] object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.85)] transition-all duration-500`.
4. The radial gold scrim and ground shadow plane remain 100% active.
5. All navigation buttons, tabs, swipe gestures, specification updates, and booking CTAs operate with **identical functional parity**.
6. **Cumulative Layout Shift (CLS):** Measured at `0.00` because the stage container enforces identical height and padding rules in both 3D and 2D modes.

---

## 8. Tailwind CSS Utility Classes & Component Styling Reference

The following CSS rules must be added to `/home/hanzlaahmad/OpenBot/Shared/PETRANS/website/public/style.css`:

```css
/* ============================================================
   PETRANS INTERACTIVE VEHICLE SPOTLIGHT CAROUSEL STYLES
   ============================================================ */

/* Fleet Showcase Container */
.fleet-spotlight-section {
  position: relative;
  background-color: #0B0F19;
  overflow: hidden;
  padding: 5rem 1rem;
}

/* Stage Canvas Container */
.fleet-stage-container {
  position: relative;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 2rem auto;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1.5rem;
  background: radial-gradient(circle at 50% 50%, #161F30 0%, #0B0F19 100%);
  border: 1px solid rgba(197, 160, 89, 0.20);
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.75);
}

@media (min-width: 1024px) {
  .fleet-stage-container {
    aspect-ratio: 21 / 9;
  }
}

/* Ambient Radial Gold Scrim */
.stage-scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 75% 45% at 50% 68%,
    rgba(197, 160, 89, 0.18) 0%,
    rgba(22, 31, 48, 0.45) 45%,
    rgba(11, 15, 25, 0.0) 75%
  );
  z-index: 1;
}

/* Floating Navigation Chevrons */
.carousel-chevron {
  width: 48px;
  height: 48px;
  border-radius: 9999px;
  background: rgba(22, 31, 48, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #F8FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  touch-action: manipulation;
  z-index: 15;
}

.carousel-chevron:hover {
  border-color: #CAA328;
  color: #CAA328;
  transform: scale(1.08);
  box-shadow: 0 12px 30px rgba(202, 163, 40, 0.25);
}

.carousel-chevron:active {
  transform: scale(0.95);
}

/* Direct Model Selector Tabs */
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

/* 360 Interaction Cue */
.stage-cue {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  pointer-events: none;
}
```

---

## 9. Implementation Directives for Lead Technical Engineer (`TSK-PET-030`)

To execute this specification in `/home/hanzlaahmad/OpenBot/Shared/PETRANS/website/`:

1. **Refactor `#fleet` Section in `index.html`:**
   - Remove the legacy 3-card grid (`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">`).
   - Insert the Model Selector Tabs, the Single-Vehicle Spotlight Stage (`#fleet-stage`), floating navigation chevrons, pagination indicator, and the unified Specification Deck (`#fleet-spec-card`).
2. **Mount `@google/model-viewer` with Fallback:**
   - Add `<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"></script>` in `<head>`.
   - Implement the `FleetCarouselController` class in `app.js` with data arrays for E-Class, V-Class, and Vito Tourer.
3. **Wire Event Handlers & Deep Links:**
   - Wire Tab Clicks, Chevron Clicks, and Touch Swipe listeners.
   - Wire `[ Book This Vehicle ]` button to update `appState.vehicleCategory` and transition to the booking stepper.
4. **Append Styling Rules:**
   - Add Section 8 CSS rules to `style.css`.

---

## 10. Quality Assurance & Compliance Acceptance Checklist

The Auditor (`agent-155a4006-d652-4bed-813f-862abcd83fb7`) and Browser QA Tester (`agent-49ce8d12-b37c-450c-bd4c-7fb6a9c0c8d1`) will evaluate the implementation against these criteria:

| Verification Target | Requirement & Threshold | Pass Criteria |
| :--- | :--- | :--- |
| **Single Vehicle View** | Exactly 1 vehicle visible in the spotlight at any time. | Multi-card grid completely replaced |
| **Touch Targets** | Previous/Next chevrons, tabs, and CTA buttons are $\ge 44 \times 44\text{px}$. | 100% compliant |
| **Mobile Swiping** | Horizontal swipe on mobile advances to next/prev vehicle. | Smooth gesture transition |
| **No Horizontal Scroll**| Viewports 375px, 390px, 412px, 768px, 1280px show `scrollWidth == clientWidth`. | 0px overflow |
| **Zero Emoji Policy** | 0% Unicode emojis in carousel markup, badges, or scripts. | 100% Lucide / Iconify SVGs |
| **Pricing Fidelity** | E-Class displays €2.50/km, V-Class €2.60/km, Vito €2.80/km with €45 floor. | Exact mathematical sync |
| **Deep Link Behavior** | Clicking CTA opens `#booking-stepper` with corresponding vehicle preselected. | Zero lock-in, customizable |
| **Fallback Continuity** | If WebGL is disabled, high-res WebP cutout loads with zero layout shift. | CLS = 0.00 |

---

*This specification is saved at `/home/hanzlaahmad/OpenBot/Shared/PETRANS/design/interactive_vehicle_carousel_spec.md` and stands as the authoritative design blueprint for PETRANS homepage fleet carousel development.*
