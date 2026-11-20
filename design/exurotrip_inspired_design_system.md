# PETRANS Taxi & Tour Salzburg — ExuroTrip-Inspired Design System & UI Specification
**Document ID:** `SPEC-PET-2026-EXURO-001`  
**Task Reference:** `TSK-PET-017` (ExuroTrip-Inspired UI Design System & Specification)  
**Author:** UI/UX Design Specialist (`agent-71f645ad-ba24-419e-bdff-ee05809a4b0e`)  
**Project Owner / Decision Maker:** Hanzla Ahmad  
**Design Reference:** `https://exurotrip.com/` (Salzburg Luxury Chauffeur Benchmark)  
**Target Codebase:** `/home/hanzlaahmad/OpenBot/Shared/PETRANS/website/`  
**Status:** Approved Specification & Implementation Directives  
**Date:** November 21, 2026  

---

## 1. Executive Overview & Design Philosophy

### 1.1 The ExuroTrip Benchmark & Translation Philosophy
Per Founder Hanzla Ahmad's directive (`9b2538dc-d322-4251-b44d-39e26aeb2368`), the client was genuinely impressed by the aesthetic elegance, visual hierarchy, and effortless booking simplicity of **ExuroTrip** (`https://exurotrip.com/`). 

This specification translates ExuroTrip's core strengths into an **original, bespoke visual identity for PETRANS Taxi & Tour Salzburg**. Rather than blindly cloning the benchmark, PETRANS synthesizes ExuroTrip's quiet luxury atmosphere with Salzburg's authentic alpine heritage, strict Austrian commercial transport regulations, and verified business pricing rules.

```
+---------------------------------------------------------------------------------------------------+
|                            PETRANS CORE DESIGN PHILOSOPHY                                         |
+-----------------------------------+-----------------------------------+---------------------------+
|          1. Quiet Luxury          |       2. Effortless Utility       |   3. Absolute Transparency|
| Deep Alpine Slate & Champagne Gold| Clean 6-step booking flow,        | Fixed €2.80/km + €45 floor|
| surfaces with subtle micro-borders| 44px touch targets, zero friction | Gross pricing with VAT    |
+-----------------------------------+-----------------------------------+---------------------------+
|          4. Zero Clutter          |      5. 100% Mobile-First         |   6. Standardized Icons   |
| Zero emojis, no cartoon badges,   | Fluid 360px–428px ergonomics,     | Universal Iconify library |
| disciplined 8pt grid alignment    | zero horizontal overflow          | (Lucide set, 2px stroke)  |
+-----------------------------------+-----------------------------------+---------------------------+
```

### 1.2 Mandatory Constraints Integrated into This Specification
Every layout, component, and token in this specification strictly obeys the mandatory project rules:
1. **Mobile-First Responsive Layout:** Full ergonomic support for 360px–428px viewports up to desktop, minimum 44px touch targets, zero horizontal scrolling, and a dedicated mobile slide-over navigation drawer.
2. **100% Zero Emojis:** Elimination of all flag emojis in language pickers, transport emojis, star symbols, and text emoticons.
3. **Universal Iconify Library:** Adoption of `iconify-icon` web components using the unified `lucide:` collection with consistent 2px stroke weight and optical alignment.
4. **Salzburg Hero Section:** Mandatory photograph integration (`/images/salzburg-hero.jpg` from `thetimes.com`) with a calibrated WCAG AAA gradient scrim and `center 38%` focal lock.
5. **Realistic 3D Transparent Vehicle Cards:** Standardized 16:9 podium containers with ambient ground occlusion shadows for the Mercedes-Benz V-Class and Vito Tourer.
6. **Strict 8pt Spatial Rhythm:** Systematic padding, margin, and layout bounds based on an 8pt grid.

---

## 2. Complete Design Tokens System

### 2.1 Color Architecture (Tailwind CSS Mappings)
The color system creates a prestigious nocturnal atmosphere reminiscent of a private Mercedes cabin traveling through the snow-capped Austrian Alps at dusk:

```css
:root {
  /* Surface & Background Hierarchy */
  --bg-midnight: #0B0F19;         /* Deep Alpine Slate: Primary body background */
  --bg-surface: #161F30;          /* Frosted Slate: Cards, inputs, and container surfaces */
  --bg-elevated: #1E293B;         /* Elevated Slate: Modals, dropdowns, and counter controls */
  --bg-subdued: #0F172A;          /* Subdued Slate: Inner wells, code blocks, and table headers */

  /* Champagne Gold Accent Hierarchy */
  --accent-gold: #CAA328;         /* Polished Champagne Gold: Primary action buttons and badges */
  --accent-gold-hover: #D4AF37;   /* Rich Lustre Gold: Button hover and focus rings */
  --accent-gold-subtle: rgba(202, 163, 40, 0.12); /* Subtle Gold Wash: Chip backgrounds */
  --border-gold-subtle: rgba(202, 163, 40, 0.20); /* Micro-Border: Card and input resting borders */
  --border-gold-strong: rgba(202, 163, 40, 0.50); /* Active/Selected Card Borders */

  /* Typographic Contrast Hierarchy */
  --text-snow: #F8FAFC;           /* Pure Snow: Primary headings and active labels (Contrast 14.8:1) */
  --text-slate: #94A3B8;          /* Muted Slate: Secondary descriptions and metadata (Contrast 7.2:1) */
  --text-platinum: #64748B;       /* Platinum: Helper text, placeholders, and inactive steppers */
  --text-inverse: #0B0F19;        /* Midnight: Text on Gold buttons and active chips */

  /* Functional Status Accents */
  --status-emerald: #10B981;      /* Alpine Fir Green: Free cancellation, verified badges */
  --status-sky: #38BDF8;          /* Glacier Blue: Flight monitoring, ski equipment */
  --status-amber: #F59E0B;        /* Amber Warning: Capacity caps, airport waiting rules */
}
```

#### Tailwind Configuration Mapping (`tailwind.config.js`)
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        midnight: '#0B0F19',
        surface: '#161F30',
        elevated: '#1E293B',
        subdued: '#0F172A',
        gold: {
          DEFAULT: '#CAA328',
          hover: '#D4AF37',
          subtle: 'rgba(202, 163, 40, 0.12)',
          border: 'rgba(202, 163, 40, 0.20)'
        },
        snow: '#F8FAFC',
        slate: {
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B'
        }
      }
    }
  }
}
```

### 2.2 Typography System & Pairing
PETRANS adopts a sophisticated modern European font pairing:
- **Headings & Display:** `Outfit` (sans-serif, weights 600, 700, 800) provides contemporary geometric authority, clean character terminals, and high readability—mirroring ExuroTrip's sharp visual presence.
- **Body & Form UI:** `Plus Jakarta Sans` (weights 400, 500, 600) ensures crystalline legibility across high-density booking inputs, route descriptions, and technical specifications.
- **Numerical & Financial Data:** `Space Grotesk` or tabular numerals (`tabular-nums`) for distances, flight numbers, and fixed prices.

```
+---------------------------------------------------------------------------------------------------+
|                                  TYPOGRAPHY SCALE SPECIFICATION                                   |
+-------------------+-------------------+-------------------+-------------------+-------------------+
| Style             | Font Family       | Size / Line-Height| Weight / Tracking | Use Case          |
+-------------------+-------------------+-------------------+-------------------+-------------------+
| Hero Display (H1) | Outfit            | 48px–60px / 1.15  | 800 / -0.025em    | Homepage Hero     |
| Section Title (H2)| Outfit            | 32px–40px / 1.20  | 700 / -0.020em    | Main Sections     |
| Card Title (H3)   | Outfit            | 22px–24px / 1.30  | 600 / -0.010em    | Vehicles & Tours  |
| Sub-heading (H4)  | Outfit            | 18px–20px / 1.40  | 600 / 0.000em     | Step Panes        |
| Body Large        | Plus Jakarta Sans | 16px–18px / 1.60  | 400 / 0.000em     | Intro Paragraphs  |
| Body Regular      | Plus Jakarta Sans | 15px / 1.50       | 400 / 0.000em     | General Copy      |
| UI Label / Input  | Plus Jakarta Sans | 16px / 1.00       | 600 / 0.020em     | Form Inputs (iOS) |
| Small / Badge     | Plus Jakarta Sans | 11px–12px / 1.40  | 700 / 0.060em     | Badges & Chips    |
| Financial / Price | Space Grotesk     | 24px–32px / 1.00  | 700 / -0.030em    | Fare Displays     |
+-------------------+-------------------+-------------------+-------------------+-------------------+
```

### 2.3 Strict 8pt Spatial Scale & Container Boundaries
All margins, paddings, and component gaps must be exact multiples of 8px (with 4px reserved exclusively for micro-gaps):

$$\text{Scale Token} \in \{4\text{px}, 8\text{px}, 16\text{px}, 24\text{px}, 32\text{px}, 40\text{px}, 48\text{px}, 64\text{px}, 80\text{px}, 96\text{px}\}$$

- **Global Container Constraint:** `max-w-7xl` ($1280\text{px}$), centered with `mx-auto`.
- **Horizontal Viewport Padding:**
  - Smartphone ($360\text{px} - 639\text{px}$): `px-4` ($16\text{px}$).
  - Tablet ($640\text{px} - 1023\text{px}$): `px-6` ($24\text{px}$).
  - Desktop ($\ge 1024\text{px}$): `px-8` ($32\text{px}$).
- **Vertical Section Rhythm:**
  - Mobile: `py-12` ($48\text{px}$) to `py-16` ($64\text{px}$).
  - Desktop: `py-20` ($80\text{px}$) to `py-24` ($96\text{px}$).

---

## 3. Global Layout Architecture & Visual Rhythm

ExuroTrip's conversion-driven layout structure is adapted for PETRANS into a seamless 12-stage visual journey:

```
[1] Top Announcement Bar (24h Free Cancellation | 60m Airport Wait | +43 660 6416464)
                          |
[2] Sticky Glass Header & Navigation (Brand Logo | Links | Typographic Lang | Book CTA | Mobile Menu)
                          |
[3] Hero Section with Salzburg Fortress Image & Tabbed Quick Fare Calculator
                          |
[4] Sleek 4-Pillar Trust Grid (Flight Tracking | Fixed €2.80/km | Licensed Drivers | Free Ski Gear)
                          |
[5] Mercedes Fleet Showcase (3D Transparent V-Class VIP & Vito Tourer 4MATIC Podium Cards)
                          |
[6] Curated 8-Hour Sightseeing Day Tours (Hallstatt, Eagle's Nest, Zell am See, Innsbruck)
                          |
[7] 6-Step Interactive Booking Wizard (Mobile-First Ergonomic Stepper & Validation)
                          |
[8] Popular Transfer Destinations & Fixed Distance Pricing Table
                          |
[9] Salzburg Airport Chauffeur Meeting Guide & Flight Arrival Protocol
                          |
[10] Frequently Asked Questions (Accordion Interface)
                          |
[11] Multilingual 24/7 AI Concierge Chat & Floating WhatsApp Action CTA
                          |
[12] Austrian Legal Footer (Impressum, Gewerbeberechtigung, WKO, Stripe & Cash Badges)
```

---

## 4. Component Deep Dives & Exact Specifications

### 4.1 Homepage Hero Section with Salzburg Panorama
The hero section delivers instant visual prestige, anchoring the user in Salzburg with the mandatory high-resolution photograph while ensuring the quick fare calculator sits prominently above the fold.

```
+---------------------------------------------------------------------------------------------------+
| [Official Licensed Austrian Passenger Transport]                                                 |
|                                                                                                   |
|                   ELEVATE YOUR SALZBURG JOURNEY IN MERCEDES LUXURY                                |
|   Fixed-Rate Airport Transfers, Alpine Ski Shuttles, and 8-Hour Private Sightseeing Tours         |
|                                                                                                   |
|   +-------------------------------------------------------------------------------------------+   |
|   |   [ One-Way Transfer ]         [ Return Trip (-5%) ]         [ 8-Hour Day Tour ]          |   |
|   |-------------------------------------------------------------------------------------------|   |
|   |  Pickup: [ Salzburg Airport (SZG) v ]       Destination: [ Hallstatt Lahn Terminal (73km) v ]|
|   |  Passengers: [- 4 +]       Luggage: [- 4 +]       Estimated Fare: €204.40                 |   |
|   |  [ Book Chauffeur Now -> ]                                                                |   |
|   +-------------------------------------------------------------------------------------------+   |
|                                                                                                   |
| ~~~~~~~~~ Background: Salzburg Fortress, Salzach River, & Baroque Steeples ~~~~~~~~~~~~~~~~~~~~~~ |
+---------------------------------------------------------------------------------------------------+
```

#### Exact HTML & CSS Implementation
```html
<!-- Hero Section -->
<section class="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden bg-midnight">
  
  <!-- Background Image & Calibrated WCAG AAA Scrim -->
  <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <picture>
      <source srcset="/images/salzburg-hero.jpg" type="image/jpeg">
      <img 
        src="https://www.thetimes.com/imageserver/image/33265cfd-df7e-42c6-885f-fb626b3d1319.jpg" 
        alt="Salzburg historic skyline featuring Hohensalzburg Fortress and Salzach river" 
        class="w-full h-full object-cover object-[center_38%] brightness-[0.70] contrast-[1.08] saturate-[1.12]"
        loading="eager"
      >
    </picture>
    
    <!-- Multi-stage dark gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-midnight/90 via-midnight/65 to-midnight"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_20%,rgba(11,15,25,0.80)_75%)]"></div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="text-center max-w-3xl mx-auto mb-10">
      
      <!-- Trust Pill Badge (Zero Emojis, Iconify Icon) -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/40 bg-midnight/80 backdrop-blur-md text-gold text-[11px] font-bold uppercase tracking-wider mb-4 shadow-lg">
        <iconify-icon icon="lucide:award" width="14" height="14" class="text-gold"></iconify-icon>
        <span>Official Licensed Austrian Passenger Transport</span>
      </div>

      <!-- Main Headline in Outfit -->
      <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-outfit text-snow leading-tight mb-4 tracking-tight drop-shadow-lg">
        Travel Salzburg & The Alps in <span class="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-200 to-gold">Mercedes Luxury</span>
      </h1>

      <p class="text-base sm:text-lg text-slate-300 font-sans leading-relaxed drop-shadow">
        Fixed-price airport transfers, private ski shuttles, and 8-hour sightseeing day tours. 100% Mercedes-Benz V-Class & Vito Fleet accommodating up to 8 passengers & 8 large suitcases.
      </p>
    </div>

    <!-- Hero Tabbed Quick Fare Calculator -->
    <div id="quote-calculator" class="max-w-4xl mx-auto glass-card p-6 sm:p-8 rounded-2xl border-gold/30 shadow-2xl">
      <!-- Calculator form with One-Way, Return, and Tour tabs... -->
    </div>
  </div>
</section>
```

---

### 4.2 Sleek 4-Pillar Trust Grid (ExuroTrip Style)
Directly below the hero section, replace fragmented feature lists with a unified, high-contrast **4-Pillar Trust Strip** that builds immediate credibility:

```
+---------------------------------------------------------------------------------------------------+
|  [Plane Icon]             [Euro Tag Icon]         [Shield Icon]           [Snowflake Icon]        |
|  FLIGHT MONITORING        FIXED TRANSPARENT FARES AUSTRIAN LICENSED       FREE GEAR & CHILD SEATS |
|  Touchdown delay sync     €2.80/km + €45 floor    Gewerbeberechtigung     €0 ski/snowboard bags   |
|  60 min free waiting      Zero hidden surcharges  Professional chauffeurs Certified safety seats  |
+---------------------------------------------------------------------------------------------------+
```

#### Exact HTML Implementation
```html
<!-- 4-Pillar Trust Grid -->
<section class="relative z-20 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    
    <!-- Pillar 1: Flight Delay Monitoring -->
    <div class="glass-card p-5 rounded-xl border border-slate-800 flex items-start gap-4 hover:border-gold/40 transition">
      <div class="w-11 h-11 rounded-lg bg-surface border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
        <iconify-icon icon="lucide:plane-takeoff" width="22" height="22"></iconify-icon>
      </div>
      <div>
        <h4 class="text-sm font-bold font-outfit text-snow uppercase tracking-wider">Flight Monitoring</h4>
        <p class="text-xs text-slate-300 mt-1 leading-relaxed">
          Real-time flight touchdown sync with <strong>60 minutes complimentary airport waiting</strong>.
        </p>
      </div>
    </div>

    <!-- Pillar 2: Fixed Transparent Fares -->
    <div class="glass-card p-5 rounded-xl border border-slate-800 flex items-start gap-4 hover:border-gold/40 transition">
      <div class="w-11 h-11 rounded-lg bg-surface border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
        <iconify-icon icon="lucide:calculator" width="22" height="22"></iconify-icon>
      </div>
      <div>
        <h4 class="text-sm font-bold font-outfit text-snow uppercase tracking-wider">Fixed Transparent Fares</h4>
        <p class="text-xs text-slate-300 mt-1 leading-relaxed">
          Predictable <strong>€2.80 / km</strong> distance rate with a €45 base floor. Tolls & VAT included.
        </p>
      </div>
    </div>

    <!-- Pillar 3: Austrian Licensed Chauffeurs -->
    <div class="glass-card p-5 rounded-xl border border-slate-800 flex items-start gap-4 hover:border-gold/40 transition">
      <div class="w-11 h-11 rounded-lg bg-surface border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
        <iconify-icon icon="lucide:shield-check" width="22" height="22"></iconify-icon>
      </div>
      <div>
        <h4 class="text-sm font-bold font-outfit text-snow uppercase tracking-wider">Licensed Chauffeurs</h4>
        <p class="text-xs text-slate-300 mt-1 leading-relaxed">
          WKO licensed Austrian chauffeurs with winter mountain driving certification and regional expertise.
        </p>
      </div>
    </div>

    <!-- Pillar 4: Free Ski & Child Equipment -->
    <div class="glass-card p-5 rounded-xl border border-slate-800 flex items-start gap-4 hover:border-gold/40 transition">
      <div class="w-11 h-11 rounded-lg bg-surface border border-sky-400/30 flex items-center justify-center text-sky-400 flex-shrink-0">
        <iconify-icon icon="lucide:snowflake" width="22" height="22"></iconify-icon>
      </div>
      <div>
        <h4 class="text-sm font-bold font-outfit text-snow uppercase tracking-wider">Free Ski & Child Gear</h4>
        <p class="text-xs text-slate-300 mt-1 leading-relaxed">
          <strong>€0.00 complimentary add-ons</strong>: Infant/child/booster seats and ski/snowboard equipment bags.
        </p>
      </div>
    </div>

  </div>
</section>
```

---

### 4.3 3D Transparent Vehicle Presentation Cards
ExuroTrip's vehicle display is celebrated for its sleek, floating car imagery. PETRANS implements this via a **16:9 podium presentation** with ambient radial ground illumination and transparent PNG cutouts for both fleet minivans:

```
+---------------------------------------------------------------------------------------------------+
|  +--------------------------------------------+  +--------------------------------------------+  |
|  | [VIP Executive Badge]                      |  | [4MATIC Winter Drive Badge]                |  |
|  |                                            |  |                                            |  |
|  |        [ 3D Mercedes V-Class PNG ]         |  |        [ 3D Mercedes Vito PNG ]            |  |
|  |     (Front 3/4 Perspective, Obsidian Black)|  |     (Front 3/4 Perspective, Obsidian Black)|  |
|  | ~~~~~~~ Ambient Radial Ground Shadow ~~~~~~|  | ~~~~~~~ Ambient Radial Ground Shadow ~~~~~~|  |
|  |--------------------------------------------|  |--------------------------------------------|  |
|  | MERCEDES-BENZ V-CLASS EXCLUSIVE            |  | MERCEDES-BENZ VITO TOURER PRO              |  |
|  | Executive VIP Flagship Minivan             |  | Alpine Ski & Mountain Specialist           |  |
|  |                                            |  |                                            |  |
|  | [Users] Max 8 Pax   [Briefcase] 8 Suitcases|  | [Users] Max 8 Pax   [Briefcase] 8 Suitcases|  |
|  | [Wifi] Free Wi-Fi   [Snow] Free Ski Gear   |  | [Mountain] 4MATIC   [Snow] Free Ski Gear   |  |
|  | [Shield] Child Seat [Water] Bottled Water  |  | [Shield] Snow Pro   [Plug] USB Ports       |  |
|  |                                            |  |                                            |  |
|  | Fixed Rate: €2.80 / km   [Select V-Class]  |  | Fixed Rate: €2.80 / km   [Select Vito]     |  |
|  +--------------------------------------------+  +--------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

#### Exact HTML & CSS Implementation
```html
<!-- Vehicle Presentation Section -->
<section id="fleet" class="py-20 bg-midnight relative">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <div class="text-center max-w-3xl mx-auto mb-16">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-surface text-gold text-xs font-bold uppercase tracking-wider mb-3">
        <iconify-icon icon="lucide:car" width="14" height="14"></iconify-icon>
        <span>Exclusively Mercedes-Benz Fleet</span>
      </div>
      <h2 class="text-3xl sm:text-5xl font-bold font-outfit text-snow mb-4">Our Premium Chauffeur Fleet</h2>
      <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
        We operate exclusively top-tier Mercedes-Benz passenger minivans, rigorously serviced, climate-controlled, and equipped for supreme comfort across Salzburg and the high Austrian Alps.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Card 1: Mercedes V-Class Exclusive -->
      <div class="glass-card rounded-2xl overflow-hidden border border-gold/30 flex flex-col justify-between hover:border-gold transition duration-300">
        
        <!-- Standardized 16:9 3D Vehicle Podium -->
        <div class="vehicle-podium relative h-60 sm:h-72 bg-gradient-to-b from-surface/80 to-midnight flex items-center justify-center p-6 border-b border-slate-800 overflow-hidden">
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_75%,rgba(202,163,40,0.14)_0%,transparent_70%)] pointer-events-none"></div>
          
          <img 
            src="/images/mercedes-v-class.png" 
            alt="Mercedes-Benz V-Class Luxury Chauffeur Minivan" 
            class="relative z-10 max-h-44 sm:max-h-56 w-auto object-contain filter drop-shadow-[0_16px_30px_rgba(0,0,0,0.9)] transition-transform duration-500 hover:scale-105"
            loading="lazy"
          >
          
          <span class="absolute top-4 right-4 bg-midnight/90 text-gold border border-gold/40 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-20">
            VIP Executive
          </span>
        </div>
        
        <!-- Card Specs & Actions -->
        <div class="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
          <div>
            <span class="text-xs uppercase tracking-widest text-gold font-bold">Executive Chauffeur Flagship</span>
            <h3 class="text-2xl font-bold font-outfit text-snow mt-1 mb-2">Mercedes-Benz V-Class</h3>
            <p class="text-sm text-slate-300 leading-relaxed mb-6">
              The gold standard for executive airport travel, diplomatic delegations, and luxury alpine sightseeing. Features nappa leather seating, individual rear climate zones, and whisper-quiet acoustic insulation.
            </p>
            
            <!-- 6-Point Spec Grid with Iconify Icons -->
            <div class="grid grid-cols-2 gap-3 text-xs text-slate-300 border-t border-slate-800 pt-4">
              <div class="flex items-center gap-2">
                <iconify-icon icon="lucide:users" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
                <span>Max 8 Passengers</span>
              </div>
              <div class="flex items-center gap-2">
                <iconify-icon icon="lucide:briefcase" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
                <span>8 Large Suitcases</span>
              </div>
              <div class="flex items-center gap-2">
                <iconify-icon icon="lucide:wifi" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
                <span>Complimentary Wi-Fi</span>
              </div>
              <div class="flex items-center gap-2">
                <iconify-icon icon="lucide:snowflake" width="16" height="16" class="text-sky-400 flex-shrink-0"></iconify-icon>
                <span>Free Ski Equipment</span>
              </div>
              <div class="flex items-center gap-2">
                <iconify-icon icon="lucide:shield" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
                <span>Free Child Seats</span>
              </div>
              <div class="flex items-center gap-2">
                <iconify-icon icon="lucide:coffee" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
                <span>Still Water On Board</span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between border-t border-slate-800 pt-4">
            <div>
              <span class="text-[11px] text-slate-400 uppercase tracking-wider block">Fixed Distance Rate</span>
              <span class="text-2xl font-mono font-bold text-gold">€2.80 <span class="text-xs text-slate-400 font-sans">/ km</span></span>
            </div>
            <a href="#booking-stepper" class="btn-gold text-xs py-2.5 px-5 min-h-[44px]">Select V-Class</a>
          </div>
        </div>
      </div>

      <!-- Card 2: Mercedes Vito Tourer PRO -->
      <div class="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between hover:border-gold/50 transition duration-300">
        
        <!-- Standardized 16:9 3D Vehicle Podium -->
        <div class="vehicle-podium relative h-60 sm:h-72 bg-gradient-to-b from-surface/80 to-midnight flex items-center justify-center p-6 border-b border-slate-800 overflow-hidden">
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_75%,rgba(202,163,40,0.10)_0%,transparent_70%)] pointer-events-none"></div>
          
          <img 
            src="/images/mercedes-vito.png" 
            alt="Mercedes-Benz Vito Tourer 4MATIC Passenger Van" 
            class="relative z-10 max-h-44 sm:max-h-56 w-auto object-contain filter drop-shadow-[0_16px_30px_rgba(0,0,0,0.9)] transition-transform duration-500 hover:scale-105"
            loading="lazy"
          >
          
          <span class="absolute top-4 right-4 bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-20">
            4MATIC Winter Drive
          </span>
        </div>
        
        <!-- Card Specs & Actions -->
        <div class="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
          <div>
            <span class="text-xs uppercase tracking-widest text-slate-400 font-bold">Ski & Mountain Specialist</span>
            <h3 class="text-2xl font-bold font-outfit text-snow mt-1 mb-2">Mercedes-Benz Vito Tourer</h3>
            <p class="text-sm text-slate-300 leading-relaxed mb-6">
              Engineered specifically for heavy luggage capacity and high alpine winter passes. Equipped with permanent 4MATIC all-wheel drive, generous passenger legroom, and cavernous ski transport bays.
            </p>
            
            <!-- 6-Point Spec Grid with Iconify Icons -->
            <div class="grid grid-cols-2 gap-3 text-xs text-slate-300 border-t border-slate-800 pt-4">
              <div class="flex items-center gap-2">
                <iconify-icon icon="lucide:users" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
                <span>Max 8 Passengers</span>
              </div>
              <div class="flex items-center gap-2">
                <iconify-icon icon="lucide:briefcase" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
                <span>8 Large Suitcases</span>
              </div>
              <div class="flex items-center gap-2">
                <iconify-icon icon="lucide:mountain" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
                <span>4MATIC All-Wheel</span>
              </div>
              <div class="flex items-center gap-2">
                <iconify-icon icon="lucide:snowflake" width="16" height="16" class="text-sky-400 flex-shrink-0"></iconify-icon>
                <span>Free Ski Equipment</span>
              </div>
              <div class="flex items-center gap-2">
                <iconify-icon icon="lucide:shield" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
                <span>Snow-Trained Chauffeurs</span>
              </div>
              <div class="flex items-center gap-2">
                <iconify-icon icon="lucide:zap" width="16" height="16" class="text-gold flex-shrink-0"></iconify-icon>
                <span>USB Power Outlets</span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between border-t border-slate-800 pt-4">
            <div>
              <span class="text-[11px] text-slate-400 uppercase tracking-wider block">Fixed Distance Rate</span>
              <span class="text-2xl font-mono font-bold text-gold">€2.80 <span class="text-xs text-slate-400 font-sans">/ km</span></span>
            </div>
            <a href="#booking-stepper" class="btn-outline-gold text-xs py-2.5 px-5 min-h-[44px]">Select Vito</a>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
```

---

### 4.4 Booking Wizard Ergonomics & Mobile-First Flow
ExuroTrip's booking wizard is renowned for its effortless, low-friction completion. PETRANS achieves this by refining the 6-step wizard:

#### 1. Responsive Stepper Header
- **Desktop ($\ge 640\text{px}$):** 6 circular bubbles connected with a dynamic gold progress bar, displaying step numbers and step labels.
- **Mobile ($< 640\text{px}$):** The horizontal label cluster is hidden to prevent horizontal blowout. It is replaced by a **Compact Mobile Status Header**:
  ```html
  <div class="sm:hidden flex items-center justify-between p-3 bg-surface rounded-xl border border-slate-800 mb-6">
    <div class="flex items-center gap-2">
      <span class="w-7 h-7 rounded-full bg-gold text-midnight font-bold text-xs flex items-center justify-center" id="mobile-step-num">1</span>
      <span class="text-xs font-bold text-snow uppercase tracking-wider" id="mobile-step-name">Service & Route</span>
    </div>
    <span class="text-[11px] font-semibold text-slate-400">Step <span id="mobile-curr-step">1</span> of 6</span>
  </div>
  ```

#### 2. Input Fields & Touch Targets
- All text inputs, time/date pickers, and `<select>` dropdowns are assigned `min-height: 48px; font-size: 16px;`.
- Passenger and luggage counters assign counter buttons (`counter-btn`) a minimum touch boundary of $44 \times 44\text{px}$.
- Quick chips are wrapped with `flex-wrap gap-2` with `min-height: 44px`.

#### 3. Step 3 Capacity Safeguard Cards
Vehicles within Step 3 display active validation states:
- If `passengers > 8` or `luggage > 8`, both vehicle cards show an amber warning card: *"Maximum capacity for a single Mercedes minivan is 8 passengers and 8 large suitcases. For larger groups, please contact dispatch for a multi-vehicle convoy."*

#### 4. Step 4 Complimentary Add-on Touch Targets
Add-ons (€0 child seats, €0 booster seats, €0 ski racks) are rendered as large clickable cards ($48\text{px}$ row height) with styled checkbox indicators rather than tiny browser checkboxes:

```html
<label class="flex items-center justify-between p-4 rounded-xl bg-midnight border border-slate-800 hover:border-gold/40 cursor-pointer min-h-[56px] transition">
  <div class="flex items-center gap-3">
    <input type="checkbox" id="addon-ski" class="w-5 h-5 accent-gold rounded">
    <div class="flex items-center gap-2">
      <iconify-icon icon="lucide:snowflake" width="18" height="18" class="text-sky-400"></iconify-icon>
      <span class="text-sm font-semibold text-snow">Ski & Snowboard Equipment Transport</span>
    </div>
  </div>
  <span class="text-xs font-bold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">FREE (€0.00)</span>
</label>
```

#### 5. Step 5 Transparent Payment Choice
Clear distinction between on-board payment and online prepayment:
- Card 1: *Pay to Driver on Board (Cash or Credit Card)* — Default selection; customer pays after arrival.
- Card 2: *Prepay Online Securely (Stripe Credit Card / Apple Pay)* — Instant digital receipt.

---

### 4.5 Mobile Navigation Drawer & Header
The mobile navigation header is rebuilt to ensure smartphone users can effortlessly reach every section without horizontal scrolling:

```html
<!-- Mobile Header Container -->
<header class="sticky top-0 z-40 bg-midnight/95 backdrop-blur-md border-b border-gold/20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
    
    <!-- Brand Logo -->
    <a href="/" class="flex items-center gap-3">
      <div class="w-11 h-11 rounded-lg border border-gold/40 bg-surface flex items-center justify-center text-gold shadow-lg">
        <span class="font-outfit text-2xl font-bold">P</span>
      </div>
      <div>
        <span class="font-outfit text-xl font-bold tracking-wider text-snow block leading-none">PETRANS</span>
        <span class="text-[9px] font-sans font-semibold tracking-widest text-gold uppercase block mt-1">Taxi & Tour Salzburg</span>
      </div>
    </a>

    <!-- Desktop Navigation Links (Hidden on < lg) -->
    <nav class="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
      <a href="#quote-calculator" class="hover:text-gold transition">Instant Quote</a>
      <a href="#fleet" class="hover:text-gold transition">Mercedes Fleet</a>
      <a href="#tours" class="hover:text-gold transition">Day Tours (8h)</a>
      <a href="#routes" class="hover:text-gold transition">Destinations</a>
      <a href="#airport-guide" class="hover:text-gold transition">Airport Guide</a>
      <a href="#faq" class="hover:text-gold transition">FAQ</a>
    </nav>

    <!-- Header Actions -->
    <div class="flex items-center gap-2 sm:gap-4">
      <!-- Typographic Language Selector (Zero Emojis) -->
      <select id="lang-select" class="bg-surface border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-2 min-h-[44px] outline-none focus:border-gold cursor-pointer" aria-label="Select Language">
        <option value="en" selected>EN — English</option>
        <option value="de">DE — Deutsch</option>
        <option value="hi">HI — हिन्दी</option>
        <option value="ur">UR — اردو</option>
      </select>

      <!-- Desktop Book Button -->
      <a href="#booking-stepper" class="hidden sm:inline-flex btn-gold text-xs sm:text-sm py-2.5 px-5">
        <iconify-icon icon="lucide:calendar" width="16" height="16" class="mr-1.5"></iconify-icon>
        <span>Book Chauffeur</span>
      </a>

      <!-- Mobile Hamburger Toggle (44x44px Touch Target) -->
      <button type="button" id="mobile-menu-btn" class="lg:hidden w-11 h-11 flex items-center justify-center rounded-lg border border-slate-700 bg-surface text-gold hover:border-gold focus:outline-none" aria-label="Toggle Mobile Menu">
        <iconify-icon icon="lucide:menu" width="24" height="24" id="menu-icon-open"></iconify-icon>
        <iconify-icon icon="lucide:x" width="24" height="24" id="menu-icon-close" class="hidden"></iconify-icon>
      </button>
    </div>

  </div>
</header>
```

---

## 5. Universal Iconify Icon Mapping Table

Every icon on the website is migrated to the `lucide:` Iconify collection, establishing uniform 2px stroke, optical balance, and zero external icon fonts:

| Element | Exact Iconify Identifier | Dimensions | Primary Color Class | Semantic Role |
| :--- | :--- | :--- | :--- | :--- |
| **Top Bar: Free Cancellation** | `lucide:shield-check` | $16 \times 16\text{px}$ | `text-emerald-400` | Trust Guarantee |
| **Top Bar: Airport Waiting** | `lucide:plane` | $16 \times 16\text{px}$ | `text-gold` | 60 Min Free Wait |
| **Top Bar: Free Ski Gear** | `lucide:snowflake` | $16 \times 16\text{px}$ | `text-sky-400` | Winter Travel Policy |
| **Top Bar: Direct Telephone** | `lucide:phone-call` | $14 \times 14\text{px}$ | `text-gold` | Immediate Dispatch |
| **Header: Book Chauffeur** | `lucide:calendar` | $16 \times 16\text{px}$ | `text-midnight` | Primary Action |
| **Header: Hamburger Menu** | `lucide:menu` | $24 \times 24\text{px}$ | `text-gold` | Mobile Navigation |
| **Header: Close Drawer** | `lucide:x` | $24 \times 24\text{px}$ | `text-slate-400` | Close Menu |
| **Hero: Licensed Badge** | `lucide:award` | $14 \times 14\text{px}$ | `text-gold` | Austrian Authority |
| **Calculator: Origin/Pickup** | `lucide:map-pin` | $18 \times 18\text{px}$ | `text-gold` | Location Coordinate |
| **Calculator: Destination** | `lucide:navigation` | $18 \times 18\text{px}$ | `text-gold` | Trip Route |
| **Chip: Salzburg Airport SZG** | `lucide:plane` | $14 \times 14\text{px}$ | `text-gold` | Transport Node |
| **Chip: Salzburg Central Station**| `lucide:train` | $14 \times 14\text{px}$ | `text-gold` | Rail Hub |
| **Chip: Old Town Center Hotel** | `lucide:building-2` | $14 \times 14\text{px}$ | `text-gold` | City Hotel |
| **Chip: Hallstatt Alpine Lake** | `lucide:mountain` | $14 \times 14\text{px}$ | `text-gold` | Destination |
| **Chip: Zell am See / Kaprun** | `lucide:snowflake` | $14 \times 14\text{px}$ | `text-sky-400` | Ski Resort |
| **Chip: Munich Airport MUC** | `lucide:plane-takeoff` | $14 \times 14\text{px}$ | `text-gold` | International Hub |
| **Chip: Innsbruck Highlights** | `lucide:landmark` | $14 \times 14\text{px}$ | `text-gold` | Tyrolean Capital |
| **Chip: Bad Gastein Valley** | `lucide:sparkles` | $14 \times 14\text{px}$ | `text-gold` | Thermal Spa |
| **Fleet: Passenger Capacity** | `lucide:users` | $16 \times 16\text{px}$ | `text-gold` | Max 8 Pax Cap |
| **Fleet: Luggage Capacity** | `lucide:briefcase` | $16 \times 16\text{px}$ | `text-gold` | Max 8 Bags Cap |
| **Fleet: 4MATIC All-Wheel** | `lucide:mountain` | $16 \times 16\text{px}$ | `text-gold` | Winter Traction |
| **Fleet: Complimentary Wi-Fi**| `lucide:wifi` | $16 \times 16\text{px}$ | `text-gold` | In-Cabin Connectivity |
| **Fleet: Complimentary Water**| `lucide:coffee` | $16 \times 16\text{px}$ | `text-gold` | VIP Hospitality |
| **Fleet: USB Charging** | `lucide:zap` | $16 \times 16\text{px}$ | `text-gold` | Mobile Power |
| **Stepper: Step 1 Route** | `lucide:map-pin` | $18 \times 18\text{px}$ | `text-gold` | Intake Phase |
| **Stepper: Step 2 Date/Flight**| `lucide:clock` | $18 \times 18\text{px}$ | `text-gold` | Timing Intake |
| **Stepper: Step 3 Vehicle** | `lucide:car` | $18 \times 18\text{px}$ | `text-gold` | Vehicle Choice |
| **Stepper: Step 4 Free Extras**| `lucide:gift` | $18 \times 18\text{px}$ | `text-gold` | Inclusions |
| **Stepper: Step 5 Payment** | `lucide:credit-card` | $18 \times 18\text{px}$ | `text-gold` | Checkout Mode |
| **Stepper: Step 6 Summary** | `lucide:file-text` | $18 \times 18\text{px}$ | `text-gold` | Booking Review |
| **Completed Step Indicator** | `lucide:check` | $14 \times 14\text{px}$ | `text-midnight` | Step Verified |
| **Floating WhatsApp** | `lucide:message-circle`| $28 \times 28\text{px}$ | `text-white` | Instant WhatsApp |
| **Floating Phone Dial** | `lucide:phone` | $24 \times 24\text{px}$ | `text-midnight` | Direct Call |
| **Floating AI Concierge** | `lucide:bot` | $26 \times 26\text{px}$ | `text-white` | 24/7 Virtual Chat |

---

## 6. Tailwind CSS Utility Classes & Component Styling Reference

The following CSS classes must be appended to `/home/hanzlaahmad/OpenBot/Shared/PETRANS/website/public/style.css` to implement the design system:

```css
/* ============================================================
   PETRANS EXUROTRIP-INSPIRED LUXURY DESIGN SYSTEM STYLES
   ============================================================ */

/* Typography */
body {
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #0B0F19;
  color: #F8FAFC;
  overflow-x: hidden;
  width: 100%;
}

h1, h2, h3, h4, .font-heading {
  font-family: 'Outfit', sans-serif;
}

/* Glassmorphism Cards */
.glass-card {
  background: rgba(22, 31, 48, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(202, 163, 40, 0.20);
  border-radius: 1rem;
  box-shadow: 0 10px 35px -5px rgba(0, 0, 0, 0.60);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  border-color: rgba(202, 163, 40, 0.45);
  box-shadow: 0 15px 40px -5px rgba(202, 163, 40, 0.15);
}

/* Luxury Gold Action Buttons */
.btn-gold {
  background: linear-gradient(135deg, #CAA328 0%, #D4AF37 50%, #B89045 100%);
  color: #0B0F19;
  font-weight: 700;
  font-family: 'Outfit', sans-serif;
  border: none;
  border-radius: 0.5rem;
  min-height: 48px;
  padding: 0.75rem 1.75rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.25s ease;
  box-shadow: 0 4px 15px rgba(202, 163, 40, 0.35);
  text-decoration: none;
  touch-action: manipulation;
}

.btn-gold:hover {
  background: linear-gradient(135deg, #D4AF37 0%, #E5C378 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
  color: #000000;
}

.btn-gold:active {
  transform: scale(0.98);
}

/* Gold Outline Buttons */
.btn-outline-gold {
  background: transparent;
  color: #CAA328;
  border: 1px solid #CAA328;
  font-weight: 600;
  border-radius: 0.5rem;
  min-height: 48px;
  padding: 0.65rem 1.5rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.25s ease;
  text-decoration: none;
  touch-action: manipulation;
}

.btn-outline-gold:hover {
  background: rgba(202, 163, 40, 0.12);
  border-color: #D4AF37;
  color: #D4AF37;
  transform: translateY(-1px);
}

/* Interactive Touch Target Enforcements */
.counter-btn {
  width: 44px !important;
  height: 44px !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(202, 163, 40, 0.35);
  color: #F8FAFC;
  border-radius: 0.5rem;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
}

.counter-btn:hover:not(:disabled) {
  background: #CAA328;
  color: #0B0F19;
  border-color: #CAA328;
}

.counter-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Quick Selection Chips */
.quick-chip {
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #94A3B8;
  min-height: 44px;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.825rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s ease;
  user-select: none;
  white-space: nowrap;
  touch-action: manipulation;
}

.quick-chip:hover {
  border-color: #CAA328;
  color: #F8FAFC;
  background: rgba(202, 163, 40, 0.15);
}

.quick-chip.active {
  background: #CAA328;
  color: #0B0F19;
  font-weight: 700;
  border-color: #CAA328;
}

/* Form Input Control (16px font to prevent Safari zoom) */
.form-input {
  width: 100%;
  background: rgba(11, 15, 25, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #F8FAFC;
  min-height: 48px;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 16px;
  transition: all 0.25s ease;
  outline: none;
}

.form-input:focus {
  border-color: #CAA328;
  box-shadow: 0 0 0 3px rgba(202, 163, 40, 0.2);
  background: rgba(11, 15, 25, 0.95);
}

.form-label {
  display: block;
  font-size: 0.825rem;
  font-weight: 700;
  color: #94A3B8;
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* 16:9 Vehicle Podium Ambient Glow */
.vehicle-podium {
  position: relative;
  background: linear-gradient(180deg, rgba(22, 31, 48, 0.8) 0%, #0B0F19 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## 7. Implementation Directives for Lead Technical Engineer

To execute this design system, the Lead Technical Engineer (`agent-83113a2c-0243-469e-8242-ed86c887356c`) must perform the following actions:

1. **Verify Asset Presence in `/home/hanzlaahmad/OpenBot/Shared/PETRANS/website/public/images/`:**
   - Confirm `salzburg-hero.jpg` is present (sourced from The Times URL).
   - Ensure transparent background renders for `mercedes-v-class.png` and `mercedes-vito.png` are placed in the directory.
2. **Update `<head>` in `index.html`:**
   - Replace legacy Lucide script with the Iconify Web Component loader:
     `<script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>`.
   - Update Google Fonts link to include `Outfit:wght@400;600;700;800` and `Plus+Jakarta+Sans:wght@400;500;600;700`.
3. **Execute 100% Emoji Eradication:**
   - Language selector dropdown: Remove all flag emojis (`🇬🇧`, `🇩🇪`, `🇮🇳`, `🇵🇰`) and replace with `EN — English`, `DE — Deutsch`, `HI — हिन्दी`, `UR — اردو`.
   - Remove star emoji `★` and replace with `<iconify-icon icon="lucide:star">`.
   - Replace chip and button emojis in `index.html` and `app.js` with corresponding Iconify icons.
4. **Deploy Mobile Navigation Drawer:**
   - Insert the hamburger button into the header and wire the drawer slide-out animation in `app.js`.
5. **Implement 4-Pillar Trust Grid:**
   - Add the trust grid directly underneath the hero section as specified in Section 4.2.
6. **Enforce Touch Target Classes:**
   - Append the updated CSS rules in Section 6 to `style.css` to guarantee all interactive targets are $\ge 44 \times 44\text{px}$.

---

## 8. Quality Assurance & Compliance Acceptance Checklist

The Auditor (`agent-155a4006-d652-4bed-813f-862abcd83fb7`) and Browser QA Tester (`agent-49ce8d12-b37c-450c-bd4c-7fb6a9c0c8d1`) will verify the application against the following criteria:

| Category | Verification Test | Target Metric |
| :--- | :--- | :--- |
| **Zero Emoji** | Run regex scan `[\U00010000-\U0010ffff]|[\u2600-\u27bf]` across all code. | **0 detected emojis** |
| **Touch Targets** | Inspect computed dimensions of buttons, chips, tabs, counters, inputs. | **Min $44 \times 44\text{px}$** |
| **No Horizontal Scroll** | Emulate 360px, 375px, 390px, 412px, 428px in Chrome DevTools. | **`scrollWidth == clientWidth`** |
| **Mobile Drawer** | Click hamburger on mobile viewport; verify drawer opens, links work, close works.| **100% Functional** |
| **Salzburg Hero** | Verify image loads with dark multi-stop gradient scrim; text is legible. | **WCAG AAA ($\ge 7:1$)** |
| **Iconify Uniformity**| Confirm all icons render as `<iconify-icon>` with uniform 2px stroke. | **0 broken icons** |
| **3D Vehicle Cards** | Check V-Class and Vito cards for 16:9 podium and transparent alpha cutouts. | **Symmetrical & high polish**|
| **ExuroTrip Standard**| Qualitative evaluation of visual cleanliness, hierarchy, and typography polish. | **Benchmarked parity achieved**|

---

*This specification is saved at `/home/hanzlaahmad/OpenBot/Shared/PETRANS/design/exurotrip_inspired_design_system.md` and stands as the authoritative design system guide for PETRANS Taxi & Tour Salzburg.*
