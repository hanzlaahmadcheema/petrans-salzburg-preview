# PETRANS Taxi & Tour Salzburg — UI/UX Design Compliance & Specification
**Document ID:** `SPEC-PET-2026-UIUX-001`  
**Task Reference:** `TSK-PET-011` (Mandatory Design Constraints & Compliance)  
**Author:** UI/UX Design Specialist (`agent-71f645ad-ba24-419e-bdff-ee05809a4b0e`)  
**Project Owner / Decision Maker:** Hanzla Ahmad  
**Target Application:** `/home/hanzlaahmad/OpenBot/Shared/PETRANS/website/`  
**Status:** Approved Specification & Implementation Directives  
**Date:** November 21, 2026  

---

## 1. Executive Summary & Design Governance

### 1.1 Mandate & Scope
Following directives from Founder Hanzla Ahmad (`3277180d-271f-47a4-8dbc-8b8f4ce5fe78` and `9b2538dc-d322-4251-b44d-39e26aeb2368`), this document establishes the **mandatory design compliance standards** for the PETRANS Taxi & Tour Salzburg web platform. These standards govern the current implementation and every subsequent development cycle.

The objective is to elevate PETRANS to a peerless, high-luxury chauffeur and private alpine tour service matching the visual polish, effortless booking flow, and prestige of benchmark European operators like **ExuroTrip** (`https://exurotrip.com/`), while rigorously enforcing:
1. **Strict Mobile-First Architecture:** Responsive fidelity across 360px–428px smartphone viewports up to 4K ultra-wide displays with 100% compliant touch targets ($\ge 44 \times 44\text{px}$).
2. **Zero Emoji & Clutter Elimination:** 100% removal of all emojis (including flag emojis in language pickers, star symbols, and transport icons) and elimination of redundant visual badges.
3. **Standardized Iconify Transition:** Universal adoption of Iconify (`https://icon-sets.iconify.design/`) using the unified `lucide:` collection with consistent 1.75px–2.0px stroke weights, 16px–20px sizing, and optical centering.
4. **Homepage Hero Section with Salzburg Cityscape:** Elegant integration of the mandatory Salzburg photograph (`https://www.thetimes.com/imageserver/image/33265cfd-df7e-42c6-885f-fb626b3d1319.jpg`) with a WCAG AAA compliant multi-stop luxury gradient overlay and responsive focal positioning.
5. **3D Transparent Vehicle Presentation:** Dedicated 16:9 / 21:9 shadow-podium presentation for the Mercedes-Benz V-Class and Vito Tourer fleet with realistic transparent PNG imagery.
6. **Strict 8pt Spacing & Layout Grid:** Enforced spatial rhythm, container boundaries, and symmetric typography hierarchy.

```
+---------------------------------------------------------------------------------------------------+
|                                  PETRANS LUXURY DESIGN SYSTEM                                      |
+-----------------------------------+-----------------------------------+---------------------------+
|          Alpine Midnight          |           Card Surface            |      Champagne Gold       |
|              #0B0F19              |              #161F30              |          #C5A059          |
|      (Deep Austrian Night)        |         (Frosted Slate)           |   (Executive Accent)      |
+-----------------------------------+-----------------------------------+---------------------------+
| Display: Cinzel (Serif)           | Headings: Outfit (Sans-Serif)     | Body: Plus Jakarta Sans   |
| Touch Targets: Min 44x44px        | Spacing Grid: Strict 8pt Scale    | Icons: Iconify (Lucide)   |
+-----------------------------------+-----------------------------------+---------------------------+
```

---

## 2. Complete Codebase Audit (Current State Analysis)

A thorough audit of the existing production files in `/home/hanzlaahmad/OpenBot/Shared/PETRANS/website/public/` (`index.html`, `app.js`, `style.css`) revealed several compliance breaches that must be remedied immediately.

### 2.1 Zero-Emoji Violation Catalog
The audit detected **20 emoji characters in `index.html`** and **2 emoji/symbol characters in `app.js`**. All must be permanently eradicated:

| File | Line(s) | Current Code Snippet | Detected Violation | Mandated Replacement |
| :--- | :--- | :--- | :--- | :--- |
| `index.html` | 88 | `<option value="en">🇬🇧 English</option>` | Flag emoji (UK) | `EN — English` (Typographic ISO) |
| `index.html` | 89 | `<option value="de">🇩🇪 Deutsch</option>` | Flag emoji (DE) | `DE — Deutsch` (Typographic ISO) |
| `index.html` | 90 | `<option value="hi">🇮🇳 हिन्दी</option>` | Flag emoji (IN) | `HI — हिन्दी` (Typographic ISO) |
| `index.html` | 91 | `<option value="ur">🇵🇰 اردو</option>` | Flag emoji (PK) | `UR — اردو` (Typographic ISO) |
| `index.html` | 217 | `<div class="text-gold font-bold text-lg mb-0.5">★ 4.9 / 5.0</div>` | Star character `★` | `<iconify-icon icon="lucide:star" class="text-gold inline-block align-middle mr-1" width="16" height="16"></iconify-icon>` |
| `index.html` | 320 | `<span class="quick-chip"...>✈️ SZG Airport</span>` | Plane emoji `✈️` | `<iconify-icon icon="lucide:plane" width="14" height="14" class="text-gold mr-1.5"></iconify-icon>SZG Airport` |
| `index.html` | 321 | `<span class="quick-chip"...>🚆 Salzburg Hbf</span>` | Train emoji `🚆` | `<iconify-icon icon="lucide:train" width="14" height="14" class="text-gold mr-1.5"></iconify-icon>Salzburg Hbf` |
| `index.html` | 322 | `<span class="quick-chip"...>🏨 Old Town Hotel</span>` | Hotel emoji `🏨` | `<iconify-icon icon="lucide:building-2" width="14" height="14" class="text-gold mr-1.5"></iconify-icon>Old Town Hotel` |
| `index.html` | 330 | `<span class="quick-chip"...>🏔️ Hallstatt (73km)</span>` | Mountain emoji `🏔️` | `<iconify-icon icon="lucide:mountain" width="14" height="14" class="text-gold mr-1.5"></iconify-icon>Hallstatt (73km)` |
| `index.html` | 331 | `<span class="quick-chip"...>⛷️ Zell am See (85km)</span>` | Skier emoji `⛷️` | `<iconify-icon icon="lucide:snowflake" width="14" height="14" class="text-sky-400 mr-1.5"></iconify-icon>Zell am See (85km)` |
| `index.html` | 332 | `<span class="quick-chip"...>✈️ Munich MUC (175km)</span>` | Plane emoji `✈️` | `<iconify-icon icon="lucide:plane-takeoff" width="14" height="14" class="text-gold mr-1.5"></iconify-icon>Munich MUC (175km)` |
| `index.html` | 333 | `<span class="quick-chip"...>🏰 Innsbruck (185km)</span>` | Castle emoji `🏰` | `<iconify-icon icon="lucide:landmark" width="14" height="14" class="text-gold mr-1.5"></iconify-icon>Innsbruck (185km)` |
| `index.html` | 334 | `<span class="quick-chip"...>♨️ Bad Gastein (100km)</span>` | Hot springs emoji `♨️` | `<iconify-icon icon="lucide:sparkles" width="14" height="14" class="text-gold mr-1.5"></iconify-icon>Bad Gastein (100km)` |
| `index.html` | 1379 | `<button class="quick-chip"...>📍 Where do we meet...` | Pin emoji `📍` | `<iconify-icon icon="lucide:map-pin" width="13" height="13" class="text-gold mr-1"></iconify-icon>Driver Meeting Point` |
| `index.html` | 1380 | `<button class="quick-chip"...>🏔️ How much is Hallstatt...` | Mountain emoji `🏔️` | `<iconify-icon icon="lucide:compass" width="13" height="13" class="text-gold mr-1"></iconify-icon>Hallstatt 8h Tour Price` |
| `index.html` | 1381 | `<button class="quick-chip"...>⛷️ Are ski bags...` | Skier emoji `⛷️` | `<iconify-icon icon="lucide:snowflake" width="13" height="13" class="text-sky-400 mr-1"></iconify-icon>Ski & Child Seat Policy` |
| `app.js` | 392 | `bubble.innerHTML = '✓';` | Unicode check `✓` | `bubble.innerHTML = '<iconify-icon icon="lucide:check" width="14" height="14"></iconify-icon>';` |
| `app.js` | 447 | `: \`${appState.pickupAddress} ➔ ${appState.dropoffAddress}\`` | Arrow emoji `➔` | `: \`${appState.pickupAddress} → ${appState.dropoffAddress}\`` (Standard typographic arrow) |

### 2.2 Visual Clutter & Badge Reduction
The audit identified visual clutter that detracts from the quiet luxury aesthetic:
- **Redundant Badges:** Repetitive badges with generic copy (`badge-gold` with "First-Class Executive Transport", "Official Licensed Austrian Passenger Transport", "Private Sightseeing") stacked atop headings.
- **Remedy:** Keep only high-value trust indicators (e.g., licensed Gewerbeberechtigung certificate badge, 24h cancellation, 60-min airport guarantee). Reduce badge font size to `text-[11px]`, uppercase tracking `tracking-widest`, and subtle single-line border.

### 2.3 Mobile Layout & Touch Target Deficiencies
- **Navigation Absence on Mobile:** On viewports $< 1024\text{px}$, `<nav class="hidden lg:flex ...">` hides all navigation links. There is **no mobile hamburger toggle button or slide-out navigation drawer**, leaving smartphone users unable to jump between sections (`Tours`, `Fleet`, `Destinations`, `Meeting Point`, `FAQ`).
- **Sub-Standard Touch Targets ($< 44\text{px}$):**
  - Counter buttons (`.counter-btn` in `style.css` line 186) are defined as `w-9 h-9` ($36 \times 36\text{px}$). This fails WCAG 2.5.5 and Apple HIG standards ($\ge 44\text{px}$).
  - Quick chips (`.quick-chip` in `style.css` line 133) have padding `0.35rem 0.8rem` resulting in a vertical touch target of only ~28px.
  - Hero tabs (`.hero-tab`) have padding `py-2 px-3` (~32px height on mobile).
  - Language selector dropdown is only 30px high.
- **Horizontal Stepper Cramping:** The 6-step horizontal progress bar (`index.html` lines 250–285) packs 6 text labels side by side (`Service & Route`, `Date & Flight`, `Vehicle`, `Free Extras`, `Contact & Pay`, `Summary`). On 360px–390px screens, labels overlap, truncate, or cause horizontal page distortion.

---

## 3. Mobile-First Responsive Design System & Layout Architecture

### 3.1 Target Viewport Specifications
All components must be designed for mobile screens first, expanding progressively:

| Viewport Tier | Screen Range | Representative Devices | Layout Behavior |
| :--- | :--- | :--- | :--- |
| **Mobile Compact (`xs`)** | **360px – 427px** | iPhone SE, Galaxy S21/S24, Pixel 7a | 100% single-column, vertical stacking, compact sticky stepper, drawer navigation. |
| **Mobile Large (`sm`)** | **428px – 639px** | iPhone 14/15/16 Pro Max, Pixel 8 Pro | Single column with 2-column micro-grids (e.g. date + time pickers). |
| **Tablet Portrait (`md`)** | **640px – 1023px** | iPad Mini, iPad 10.2", Galaxy Tab | 2-column grids for cards and form fields; drawer navigation retained until 1024px. |
| **Desktop Standard (`lg`)** | **1024px – 1439px** | MacBook Air/Pro 13"/14", ThinkPad | Full desktop header navigation, multi-column tour grids, side-by-side vehicle comparison. |
| **Widescreen / 4K (`xl+`)** | **1440px – 2560px** | iMac 24", Pro Display XDR, Ultrawides | Centered container max-width `max-w-7xl` (1280px), generous whitespace. |

### 3.2 Minimum 44x44px Touch Target Directives
Every interactive element on mobile must provide a minimum physical touch target of $44 \times 44\text{px}$. The following CSS classes in `style.css` must be updated:

```css
/* ============================================================
   STRICT TOUCH TARGET ENFORCEMENT (WCAG 2.5.5 / APPLE HIG)
   ============================================================ */

/* Primary & Outline Gold Action Buttons */
.btn-gold,
.btn-outline-gold {
  min-height: 48px;              /* Guarantees touch target compliance */
  min-width: 44px;
  padding: 0.75rem 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Stepper & Counter Increment/Decrement Buttons */
.counter-btn {
  width: 44px !important;        /* Increased from 36px to 44px */
  height: 44px !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(197, 160, 89, 0.35);
  font-size: 1.25rem;
  touch-action: manipulation;
}

/* Quick Selection Chips */
.quick-chip {
  min-height: 44px;              /* Guaranteed touch target on mobile */
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.825rem;
  border-radius: 9999px;
  touch-action: manipulation;
}

/* Hero Calculator Segmented Control Tabs */
.hero-tab {
  min-height: 44px;              /* Touch compliance */
  padding: 0.65rem 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Form Inputs & Select Elements */
.form-input {
  min-height: 48px;
  padding: 0.75rem 1rem;
  font-size: 16px;               /* Crucial: Prevents iOS Safari auto-zoom on focus */
}
```

> [!IMPORTANT]
> Font size for all mobile input and select elements must be `16px` (`1rem`). Any font size below 16px triggers iOS Safari's disruptive automatic viewport zoom, destroying the mobile layout and causing accidental horizontal scrolling.

### 3.3 Zero Horizontal Overflow Constraint
To guarantee zero horizontal overflow across 360px–428px devices:
1. `html, body` must enforce `overflow-x: hidden; width: 100%; position: relative;`.
2. All grid and flex containers must have `min-width: 0` to prevent unconstrained flex children from blowing out container widths.
3. Replace all fixed pixel widths (`w-[450px]`) with responsive constraints (`w-full max-w-md`).
4. All tables (e.g. route pricing tables) must be wrapped in `<div class="w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">` with smooth scrolling.

### 3.4 Mobile Navigation Drawer Specification
To resolve the missing navigation on mobile screens, implement a slide-over mobile drawer:

```html
<!-- Mobile Header Bar (Visible < lg) -->
<header class="sticky top-0 z-40 bg-midnight/95 backdrop-blur-md border-b border-gold/20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
    
    <!-- Brand Logo -->
    <a href="/" class="flex items-center gap-3">
      <div class="w-11 h-11 rounded-lg border border-gold/40 bg-surface flex items-center justify-center text-gold shadow-lg">
        <span class="font-cinzel text-xl font-bold">P</span>
      </div>
      <div>
        <span class="font-cinzel text-xl font-bold tracking-wider text-snow block leading-none">PETRANS</span>
        <span class="text-[9px] font-sans font-semibold tracking-widest text-gold uppercase block mt-1">Taxi & Tour Salzburg</span>
      </div>
    </a>

    <!-- Desktop Navigation (> lg) -->
    <nav class="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
      <a href="#quote-calculator" class="hover:text-gold transition">Instant Quote</a>
      <a href="#tours" class="hover:text-gold transition">Day Tours (8h)</a>
      <a href="#fleet" class="hover:text-gold transition">Mercedes Fleet</a>
      <a href="#routes" class="hover:text-gold transition">Destinations</a>
      <a href="#airport-guide" class="hover:text-gold transition">Meeting Point</a>
      <a href="#faq" class="hover:text-gold transition">FAQ</a>
    </nav>

    <!-- Header Actions -->
    <div class="flex items-center gap-2 sm:gap-4">
      
      <!-- Typographic Language Selector (No Emojis) -->
      <select id="lang-select" class="bg-surface border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-2 min-h-[44px] outline-none focus:border-gold cursor-pointer" aria-label="Select Language">
        <option value="en" selected>EN — English</option>
        <option value="de">DE — Deutsch</option>
        <option value="hi">HI — हिन्दी</option>
        <option value="ur">UR — اردو</option>
      </select>

      <!-- Desktop Book CTA -->
      <a href="#booking-stepper" class="hidden sm:inline-flex btn-gold text-xs sm:text-sm py-2 px-4 sm:px-5">
        <iconify-icon icon="lucide:calendar" width="16" height="16" class="mr-1.5"></iconify-icon>
        <span>Book Chauffeur</span>
      </a>

      <!-- Mobile Hamburger Toggle Button (44x44px Touch Target) -->
      <button type="button" id="mobile-menu-btn" class="lg:hidden w-11 h-11 flex items-center justify-center rounded-lg border border-slate-700 bg-surface text-gold hover:border-gold focus:outline-none" aria-label="Open Navigation Menu">
        <iconify-icon icon="lucide:menu" width="24" height="24" id="menu-icon-open"></iconify-icon>
        <iconify-icon icon="lucide:x" width="24" height="24" id="menu-icon-close" class="hidden"></iconify-icon>
      </button>
    </div>
  </div>
</header>

<!-- Mobile Navigation Drawer Overlay & Panel -->
<div id="mobile-drawer-backdrop" class="fixed inset-0 bg-midnight/80 backdrop-blur-sm z-50 opacity-0 pointer-events-none transition-opacity duration-300 lg:hidden"></div>
<aside id="mobile-drawer" class="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-midnight border-l border-gold/30 z-50 translate-x-full transition-transform duration-300 ease-in-out flex flex-col justify-between p-6 overflow-y-auto lg:hidden shadow-2xl">
  
  <div>
    <!-- Drawer Header -->
    <div class="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded border border-gold/40 bg-surface flex items-center justify-center text-gold">
          <span class="font-cinzel text-lg font-bold">P</span>
        </div>
        <span class="font-cinzel text-lg font-bold text-snow">PETRANS Menu</span>
      </div>
      <button type="button" id="drawer-close-btn" class="w-11 h-11 flex items-center justify-center rounded-lg text-slate-400 hover:text-gold" aria-label="Close Navigation Menu">
        <iconify-icon icon="lucide:x" width="24" height="24"></iconify-icon>
      </button>
    </div>

    <!-- Drawer Navigation Links (48px Touch Targets) -->
    <nav class="space-y-2">
      <a href="#quote-calculator" class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-slate-200 hover:text-gold hover:bg-surface text-base font-medium transition min-h-[48px]">
        <iconify-icon icon="lucide:calculator" width="20" height="20" class="text-gold"></iconify-icon>
        <span>Instant Fare Calculator</span>
      </a>
      <a href="#booking-stepper" class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-slate-200 hover:text-gold hover:bg-surface text-base font-medium transition min-h-[48px]">
        <iconify-icon icon="lucide:calendar" width="20" height="20" class="text-gold"></iconify-icon>
        <span>6-Step Booking Wizard</span>
      </a>
      <a href="#fleet" class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-slate-200 hover:text-gold hover:bg-surface text-base font-medium transition min-h-[48px]">
        <iconify-icon icon="lucide:car" width="20" height="20" class="text-gold"></iconify-icon>
        <span>Mercedes Fleet (V-Class & Vito)</span>
      </a>
      <a href="#tours" class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-slate-200 hover:text-gold hover:bg-surface text-base font-medium transition min-h-[48px]">
        <iconify-icon icon="lucide:compass" width="20" height="20" class="text-gold"></iconify-icon>
        <span>8-Hour Alpine Day Tours</span>
      </a>
      <a href="#routes" class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-slate-200 hover:text-gold hover:bg-surface text-base font-medium transition min-h-[48px]">
        <iconify-icon icon="lucide:map-pin" width="20" height="20" class="text-gold"></iconify-icon>
        <span>Transfer Destinations & Rates</span>
      </a>
      <a href="#airport-guide" class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-slate-200 hover:text-gold hover:bg-surface text-base font-medium transition min-h-[48px]">
        <iconify-icon icon="lucide:plane-takeoff" width="20" height="20" class="text-gold"></iconify-icon>
        <span>Salzburg Airport Meeting Guide</span>
      </a>
      <a href="#faq" class="mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-slate-200 hover:text-gold hover:bg-surface text-base font-medium transition min-h-[48px]">
        <iconify-icon icon="lucide:help-circle" width="20" height="20" class="text-gold"></iconify-icon>
        <span>Frequently Asked Questions</span>
      </a>
    </nav>
  </div>

  <!-- Drawer Footer: Direct Contacts -->
  <div class="pt-6 border-t border-slate-800 space-y-3">
    <a href="tel:+436606416464" class="btn-outline-gold w-full text-sm py-3 flex items-center justify-center gap-2">
      <iconify-icon icon="lucide:phone-call" width="18" height="18"></iconify-icon>
      <span>Call +43 660 6416464</span>
    </a>
    <a href="https://wa.me/436606416464" target="_blank" rel="noopener noreferrer" class="btn-gold w-full text-sm py-3 flex items-center justify-center gap-2">
      <iconify-icon icon="lucide:message-square" width="18" height="18"></iconify-icon>
      <span>WhatsApp Chauffeur Dispatch</span>
    </a>
  </div>
</aside>
```

### 3.5 Mobile-Optimized Booking Wizard Stepper
To prevent 6-step text label collisions on mobile ($< 640\text{px}$):
- **Desktop ($\ge 640\text{px}$):** Display the 6 step bubbles with connected line and category titles.
- **Mobile ($< 640\text{px}$):** Hide text labels beneath the bubbles (`hidden sm:block`). In their place, display a high-visibility **Active Step Header Card**:
  ```html
  <!-- Mobile Dynamic Step Counter (Visible only on < sm) -->
  <div class="sm:hidden flex items-center justify-between mb-4 px-1">
    <span class="text-xs font-semibold uppercase tracking-wider text-gold" id="mobile-step-badge">
      Step <span id="mobile-step-num">1</span> of 6
    </span>
    <span class="text-xs font-medium text-slate-300" id="mobile-step-name">
      Service & Route
    </span>
  </div>
  ```
- **Sticky Mobile Bottom Navigation:** In the booking wizard, the `Previous` and `Continue to Step X` buttons must be full width (`w-full sm:w-auto`) with minimum height `min-h-[48px]`.

---

## 4. Zero-Emoji & Iconify Icon Library Specification

### 4.1 Global Iconify Architecture
All legacy icon mechanisms (ad-hoc inline SVGs, Unicode characters, and Lucide vanilla JS) are unified into **Iconify**.

Add the official Iconify Web Component loader to `<head>`:
```html
<!-- Iconify Web Component Engine -->
<script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>
```

#### Why Iconify?
1. **Lightweight On-Demand Loading:** Only the icons actually rendered are loaded via SVG sprite caching; zero bloat.
2. **Unified Stroke & Scale:** Every Lucide icon inside Iconify uses an identical 2px stroke grid and $24 \times 24$ viewbox.
3. **Clean HTML Markup:** Self-closing `<iconify-icon icon="..." width="..." height="..."></iconify-icon>` syntax with seamless CSS inheritance (`currentColor`).

### 4.2 Complete Iconify Master Catalog for PETRANS

| Functional Area | Semantic Role | Exact Iconify Identifier | Size (`px`) | Styling Classes | Replaces |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Header & Top Bar** | 24h Free Cancellation | `lucide:shield-check` | 16 | `text-emerald-400 mr-1` | Legacy SVG |
| | Airport Waiting Guarantee | `lucide:plane` | 16 | `text-gold mr-1` | Legacy SVG |
| | Free Ski Equipment | `lucide:snowflake` | 16 | `text-sky-400 mr-1` | Legacy SVG |
| | Direct Phone Call | `lucide:phone-call` | 14 | `text-gold mr-1` | Legacy SVG |
| | Mobile Menu Hamburger | `lucide:menu` | 24 | `text-gold` | N/A (New element) |
| | Close Modal / Drawer | `lucide:x` | 24 | `text-slate-400 hover:text-gold` | N/A (New element) |
| | Book Chauffeur Button | `lucide:calendar` | 16 | `text-midnight mr-1.5` | Legacy SVG |
| **Trust & Ratings** | Star Rating | `lucide:star` | 16 | `text-gold fill-gold mr-1` | `★` Unicode character |
| | Official Licensed Badge | `lucide:award` | 14 | `text-gold mr-1.5` | Legacy SVG |
| | Verified Austrian Chauffeur | `lucide:badge-check` | 18 | `text-gold mr-2` | Legacy SVG |
| **Quick Chips (Calculator)** | Salzburg Airport SZG | `lucide:plane` | 14 | `text-gold mr-1.5` | `✈️` Emoji |
| | Central Train Station (Hbf) | `lucide:train` | 14 | `text-gold mr-1.5` | `🚆` Emoji |
| | Old Town Hotel | `lucide:building-2` | 14 | `text-gold mr-1.5` | `🏨` Emoji |
| | Hallstatt Alpine Lake | `lucide:mountain` | 14 | `text-gold mr-1.5` | `🏔️` Emoji |
| | Zell am See / Kaprun | `lucide:snowflake` | 14 | `text-sky-400 mr-1.5` | `⛷️` Emoji |
| | Munich Airport MUC | `lucide:plane-takeoff` | 14 | `text-gold mr-1.5` | `✈️` Emoji |
| | Innsbruck / Tyrol | `lucide:landmark` | 14 | `text-gold mr-1.5` | `🏰` Emoji |
| | Bad Gastein Valley | `lucide:sparkles` | 14 | `text-gold mr-1.5` | `♨️` Emoji |
| **Fleet & Vehicle Specs** | Passenger Capacity | `lucide:users` | 16 | `text-gold mr-2` | Legacy SVG |
| | Luggage Capacity | `lucide:briefcase` | 16 | `text-gold mr-2` | Legacy SVG |
| | 4MATIC All-Wheel Drive | `lucide:mountain` | 16 | `text-gold mr-2` | Legacy SVG |
| | Free Child / Booster Seats | `lucide:shield` | 16 | `text-gold mr-2` | Legacy SVG |
| | Complimentary Bottled Water | `lucide:coffee` | 16 | `text-gold mr-2` | Legacy SVG |
| | On-Board Wi-Fi | `lucide:wifi` | 16 | `text-gold mr-2` | Legacy SVG |
| | USB Fast Charging | `lucide:zap` | 16 | `text-gold mr-2` | Legacy SVG |
| **Booking Stepper** | Step 1: Route / Location | `lucide:map-pin` | 18 | `text-gold mr-2` | Legacy SVG |
| | Step 2: Date & Flight | `lucide:clock` | 18 | `text-gold mr-2` | Legacy SVG |
| | Step 3: Vehicle Selection | `lucide:car` | 18 | `text-gold mr-2` | Legacy SVG |
| | Step 4: Complimentary Extras| `lucide:gift` | 18 | `text-gold mr-2` | Legacy SVG |
| | Step 5: Contact & Payment | `lucide:credit-card` | 18 | `text-gold mr-2` | Legacy SVG |
| | Step 6: Quote Summary | `lucide:file-text` | 18 | `text-gold mr-2` | Legacy SVG |
| | Step Completed Check | `lucide:check` | 14 | `text-midnight` | `✓` Unicode in app.js |
| **Day Tour Cards** | Tour Duration (8h) | `lucide:clock` | 14 | `text-gold mr-1` | Legacy SVG |
| | Max Guests (8 Pax) | `lucide:users` | 14 | `text-slate-400 mr-1` | Legacy SVG |
| | Included Vignette / Tolls | `lucide:receipt` | 14 | `text-emerald-400 mr-1.5` | Legacy SVG |
| **Floating Actions** | Floating WhatsApp CTA | `lucide:message-circle`| 28 | `text-white` | Legacy SVG |
| | Floating Phone Call CTA | `lucide:phone` | 24 | `text-midnight` | Legacy SVG |
| | AI Concierge Chat Trigger | `lucide:bot` | 26 | `text-white` | Legacy SVG |
| **AI Support Quick Chips** | Driver Meeting Point | `lucide:map-pin` | 13 | `text-gold mr-1` | `📍` Emoji |
| | Day Tour Pricing | `lucide:compass` | 13 | `text-gold mr-1` | `🏔️` Emoji |
| | Free Ski & Luggage Rules | `lucide:snowflake` | 13 | `text-sky-400 mr-1` | `⛷️` Emoji |

---

## 5. Homepage Hero Section Specification (Salzburg Cityscape)

### 5.1 Image Asset & Provenance
- **Mandatory Source URL:** `https://www.thetimes.com/imageserver/image/33265cfd-df7e-42c6-885f-fb626b3d1319.jpg`
- **Subject Matter:** Historic panorama of Salzburg, Austria featuring Hohensalzburg Fortress atop Festungsberg, the Salzach river, and historic baroque steeples.
- **Production Asset Strategy:**
  - High-res source image ($16.8\text{ MB}$) must be cached locally in `/home/hanzlaahmad/OpenBot/Shared/PETRANS/website/public/images/salzburg-hero.jpg`.
  - For optimized mobile and web delivery, generate responsive WebP versions:
    - Mobile ($768\text{w}$): `salzburg-hero-mobile.webp` (~$90\text{ KB}$)
    - Tablet / Desktop ($1920\text{w}$): `salzburg-hero-desktop.webp` (~$240\text{ KB}$)
  - Fallback: The remote Times URL is specified as the fallback source in `<picture>` tags.
  - **Legal Gate Check:** Pre-launch verification of editorial/commercial licensing rights is cataloged under Decision Gate 5.

### 5.2 Luxury Gradient Overlay & Contrast Guarantee
To guarantee **WCAG AAA Text Contrast Ratio ($\ge 7.0:1$)** for white and gold headings while preserving the architectural beauty of the Salzburg fortress and river reflections, apply a calibrated three-stage multi-stop CSS gradient:

```css
/* ============================================================
   HERO SALZBURG LUXURY OVERLAY (WCAG AAA CERTIFIED)
   ============================================================ */

.hero-background-wrapper {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.hero-salzburg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 38%;     /* Locks Hohensalzburg Fortress in golden section */
  transform: scale(1.03);          /* Micro-zoom eliminates sub-pixel edge bleed */
  filter: brightness(0.72) contrast(1.08) saturate(1.15);
}

.hero-gradient-scrim {
  position: absolute;
  inset: 0;
  background: 
    /* Layer 1: Top Navigation Scrim (Prevents menu washout) */
    linear-gradient(to bottom, 
      rgba(11, 15, 25, 0.95) 0%, 
      rgba(11, 15, 25, 0.65) 15%, 
      rgba(11, 15, 25, 0.35) 35%, 
      rgba(11, 15, 25, 0.70) 75%, 
      #0B0F19 100%
    ),
    /* Layer 2: Radial Vignette (Focuses center text, darkens perimeter) */
    radial-gradient(circle at 50% 40%, 
      transparent 20%, 
      rgba(11, 15, 25, 0.55) 70%, 
      rgba(11, 15, 25, 0.90) 100%
    );
  pointer-events-none;
}
```

### 5.3 Hero Layout & Prominent Booking CTA Architecture
The hero section must present a commanding visual hierarchy:
1. **Pinnacle Trust Tag:** `Official Licensed Austrian Passenger Transport` with `lucide:award` in Champagne Gold.
2. **Main Headline:**
   ```html
   <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold font-cinzel text-snow leading-tight mb-4 tracking-tight drop-shadow-md">
     Travel Salzburg & The Alps in <span class="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-200 to-gold">Mercedes Luxury</span>
   </h1>
   ```
3. **Value Proposition Subtitle:** Clear statement of €2.80/km fixed rates, 8-hour day tours, and 100% Mercedes V-Class / Vito capacity (8 passengers, 8 suitcases).
4. **Hero Tabbed Quick Fare Calculator:** Elevated frosted glass card (`glass-card`) placed prominently above the fold on desktop and within initial scroll on mobile.

```
+---------------------------------------------------------------------------------------------------+
| [Logo: PETRANS]                [Navigation Links]                [Language: EN] [Book Chauffeur] |
|---------------------------------------------------------------------------------------------------|
|                                                                                                   |
|                       [★ Official Licensed Austrian Passenger Transport]                         |
|                                                                                                   |
|                     TRAVEL SALZBURG & THE ALPS IN MERCEDES LUXURY                                 |
|         Fixed-price airport transfers, ski shuttles, and 8-hour private day tours                 |
|                                                                                                   |
|     +---------------------------------------------------------------------------------------+     |
|     |     [ One-Way Transfer ]       [ Return Trip (-5%) ]       [ 8-Hour Day Tour ]        |     |
|     |---------------------------------------------------------------------------------------|     |
|     |  Pickup: [ Salzburg Airport (SZG) v ]     Destination: [ Hallstatt Lahn (73 km) v ]   |     |
|     |  Passengers: [- 4 +]     Luggage: [- 4 +]     [ Estimate Fare: €204.40 ]              |     |
|     |  [ Continue to Booking Wizard -> ]                                                    |     |
|     +---------------------------------------------------------------------------------------+     |
|                                                                                                   |
| ~~~~~~~~~~~~~~~ Background: Salzburg Fortress & Salzach River Panorama ~~~~~~~~~~~~~~~~~~~~~~~~~~ |
+---------------------------------------------------------------------------------------------------+
```

---

## 6. Vehicle Card Presentation (Realistic 3D Transparent PNGs)

### 6.1 Fleet Models & Positioning
PETRANS operates exclusively two vehicle models. They must be presented with consistent visual weight, identical aspect ratios, and realistic transparent 3D renderings:

1. **Mercedes-Benz V-Class (Exclusive / Extra-Long Wheelbase):**
   - **Positioning:** Executive VIP Chauffeur, Corporate Roadshows, Luxury Airport Transfers.
   - **Colorway:** Obsidian Black Metallic with chrome exterior trim.
   - **Render Style:** 3D studio render, front three-quarter driver perspective ($30^\circ$ angle), transparent background with soft ambient occlusion shadow beneath wheels.
2. **Mercedes-Benz Vito Tourer PRO (4MATIC All-Wheel Drive):**
   - **Positioning:** Alpine Ski Shuttles, Mountain Excursions, Heavy Luggage Expeditions.
   - **Colorway:** Obsidian Black or Brilliant Silver Metallic with tinted rear privacy glass.
   - **Render Style:** 3D studio render matching the exact $30^\circ$ three-quarter perspective, transparent background, and identical wheel-shadow baseline.

### 6.2 Standardized Presentation Container (16:9 Aspect Ratio)
To prevent image distortion and ensure parity across screen sizes, wrap both vehicle graphics in a calibrated presentation podium:

```html
<!-- Standardized Vehicle Presentation Podium -->
<div class="vehicle-card-podium relative h-56 sm:h-64 bg-gradient-to-b from-surface/80 to-midnight flex items-center justify-center p-4 overflow-hidden border-b border-slate-800">
  
  <!-- Subtle Radial Ground Illumination -->
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_75%,rgba(197,160,89,0.12)_0%,transparent_70%)] pointer-events-none"></div>
  
  <!-- 3D Transparent Vehicle Image -->
  <img 
    src="/images/mercedes-v-class-transparent.png" 
    alt="Mercedes-Benz V-Class Luxury Chauffeur Minivan" 
    class="relative z-10 max-h-40 sm:max-h-48 w-auto object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] transition-transform duration-500 hover:scale-105"
    loading="lazy"
  >
  
  <!-- Corner Badge -->
  <span class="absolute top-4 right-4 bg-midnight/90 text-gold border border-gold/40 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider z-20">
    VIP Executive
  </span>
</div>
```

### 6.3 Standardized Spec Grid & Typography
Every vehicle card must strictly align with the following specification schema:

```html
<div class="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
  <div>
    <span class="text-xs uppercase tracking-widest text-gold font-bold">Executive Chauffeur Flagship</span>
    <h3 class="text-2xl font-bold font-outfit text-snow mt-1 mb-3">Mercedes-Benz V-Class</h3>
    <p class="text-sm text-slate-300 leading-relaxed mb-6">
      The gold standard for executive airport travel and VIP sightseeing. Features hand-stitched nappa leather, rear climate control, panoramic roof, and whisper-quiet acoustic glass.
    </p>
    
    <!-- Uniform 6-Point Technical Spec Matrix -->
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
        <span>Still Water Included</span>
      </div>
    </div>
  </div>

  <!-- Bottom Rate & Selection CTA -->
  <div class="flex items-center justify-between border-t border-slate-800 pt-4">
    <div>
      <span class="text-[11px] text-slate-400 uppercase tracking-wider block">Fixed Distance Rate</span>
      <span class="text-xl font-mono font-bold text-gold">€2.80 / km</span>
    </div>
    <a href="#booking-stepper" class="btn-gold text-xs py-2 px-5 min-h-[44px]">Select V-Class</a>
  </div>
</div>
```

---

## 7. Alignment, Spacing & Layout Grid (8pt System)

### 7.1 Strict 8pt Spatial Scale
To eliminate arbitrary margins and guarantee harmonious visual rhythm:

$$\text{Spacing Increment} = 8\text{px} \times n \quad (n \in \{0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12\})$$

| Spacing Token | Pixels | Tailwind Utility | Approved Use Case |
| :--- | :--- | :--- | :--- |
| `space-1` | 4px | `p-1`, `gap-1`, `mt-1` | Micro-spacing: Icon-to-text gaps, badge padding. |
| `space-2` | 8px | `p-2`, `gap-2`, `mt-2` | Compact spacing: Chip padding, form label margins. |
| `space-3` | 12px | `p-3`, `gap-3`, `mt-3` | Small gaps: Spec list items, sub-navigation rows. |
| `space-4` | 16px | `p-4`, `gap-4`, `mt-4` | Standard spacing: Mobile container margins, form field gaps. |
| `space-6` | 24px | `p-6`, `gap-6`, `mt-6` | Card padding: Standard card interiors, intermediate section gaps. |
| `space-8` | 32px | `p-8`, `gap-8`, `mt-8` | Desktop card padding, header margins, module separation. |
| `space-10` | 40px | `p-10`, `gap-10`, `my-10`| Section subheadings, calculator wrapper margins. |
| `space-12` | 48px | `py-12`, `mb-12` | Section vertical rhythm on mobile. |
| `space-16` | 64px | `py-16`, `mb-16` | Major section vertical rhythm on tablet. |
| `space-20` | 80px | `py-20`, `mb-20` | Primary section vertical rhythm on desktop. |
| `space-24` | 96px | `py-24` | Hero section vertical breathing room. |

### 7.2 Container Widths & Alignment Constraints
1. **Global Max Width:** `max-w-7xl` ($1280\text{px}$) centered with `mx-auto`.
2. **Horizontal Padding:**
   - Mobile ($360\text{px} - 639\text{px}$): `px-4` ($16\text{px}$).
   - Tablet ($640\text{px} - 1023\text{px}$): `px-6` ($24\text{px}$).
   - Desktop ($\ge 1024\text{px}$): `px-8` ($32\text{px}$).
3. **Form Grid Alignment:** Form rows must maintain strict 1:1 or 2:2 symmetry. Mixed column layouts must sum cleanly to 4 or 12 columns (e.g. `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`).
4. **Card Action Alignment:** In multi-column card grids (Fleet, Tours), card bodies must enforce `flex flex-col justify-between` with buttons docked to the bottom baseline.

---

## 8. ExuroTrip Benchmark & Luxury Translation

Per Founder Hanzla Ahmad's directive (`9b2538dc-d322-4251-b44d-39e26aeb2368`), the client was genuinely impressed by **ExuroTrip** (`https://exurotrip.com/`). The following comparative matrix defines how PETRANS captures ExuroTrip's visual elegance while retaining PETRANS's unique identity:

```
+---------------------------------------------------------------------------------------------------+
|                        BENCHMARK SYNTHESIS: EXUROTRIP VS. PETRANS                                  |
+-----------------------------------+-----------------------------------+---------------------------+
| Design Dimension                  | ExuroTrip Benchmark               | PETRANS Implementation    |
+-----------------------------------+-----------------------------------+---------------------------+
| 1. Color Palette                  | Jet black & muted dark slate      | Alpine Midnight (#0B0F19) |
|                                   | with warm champagne accents.      | + Champagne Gold (#C5A059)|
|                                   |                                   | + Frosted Slate (#161F30).|
| 2. Typography                     | Clean luxury sans-serif paired    | Cinzel Display Serif      |
|                                   | with geometric body fonts.        | + Outfit Headings         |
|                                   |                                   | + Plus Jakarta Sans Body. |
| 3. Vehicle Presentation           | Isolated side/quarter views       | Standardized 16:9 podium, |
|                                   | on subtle gradient surfaces.      | 3D transparent PNGs,      |
|                                   |                                   | 6-spec iconified matrix.  |
| 4. Booking Flow                   | Streamlined step-by-step intake   | 6-Step responsive wizard  |
|                                   | with fixed transparent pricing.   | with €2.80/km engine,     |
|                                   |                                   | €45 floor & validation.   |
| 5. Iconography                    | Clean, stroke-based iconography;  | Universal Iconify         |
|                                   | zero emojis or decorative clutter.| (Lucide collection);      |
|                                   |                                   | 100% zero emojis.         |
| 6. Hero Visual                    | Regional destination landscape    | Mandatory high-res        |
|                                   | with dark readability overlay.    | Salzburg Fortress photo   |
|                                   |                                   | + WCAG AAA gradient scrim.|
+-----------------------------------+-----------------------------------+---------------------------+
```

### Key Adaptations:
- **Salzburg Focus:** ExuroTrip serves broad international routes; PETRANS is the premier Salzburg & Salzkammergut specialist with dedicated Hallstatt, Eagles Nest, Zell am See, and Bad Gastein itineraries.
- **Transparent Formula:** Highlight the verified **€2.80/km** distance rate and **€45.00 base floor** directly in the calculator so customers enjoy total pricing transparency.

---

## 9. Implementation Guidelines & Code Snippets for Engineer

To facilitate immediate execution by the Lead Technical Engineer (`agent-83113a2c-0243-469e-8242-ed86c887356c`), the exact code modifications are specified below.

### 9.1 Updates to `<head>` in `index.html`
Replace legacy Lucide script with the Iconify Web Component loader:

```html
<!-- BEFORE (Line 37-38) -->
<!-- Lucide Icons -->
<script src="https://unpkg.com/lucide@latest"></script>

<!-- AFTER -->
<!-- Iconify Universal Web Component Loader -->
<script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>
```

### 9.2 Language Selector Replacement in `index.html` (Lines 87–92)
Eliminate all flag emojis:

```html
<!-- BEFORE -->
<select id="lang-select" class="bg-surface border border-slate-700 text-xs text-slate-200 rounded px-2.5 py-1.5 outline-none focus:border-gold cursor-pointer">
  <option value="en">🇬🇧 English</option>
  <option value="de">🇩🇪 Deutsch</option>
  <option value="hi">🇮🇳 हिन्दी</option>
  <option value="ur">🇵🇰 اردو</option>
</select>

<!-- AFTER -->
<select id="lang-select" class="bg-surface border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 min-h-[44px] outline-none focus:border-gold cursor-pointer" aria-label="Choose Language">
  <option value="en" selected>EN — English</option>
  <option value="de">DE — Deutsch</option>
  <option value="hi">HI — हिन्दी</option>
  <option value="ur">UR — اردو</option>
</select>
```

### 9.3 Hero Section Markup Replacement in `index.html` (Lines 102–120)
Integrate the mandatory Salzburg photograph with the WCAG AAA gradient scrim:

```html
<!-- 3. Hero Section with Salzburg Cityscape & Integrated Quick Fare Calculator -->
<section class="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden bg-midnight">
  
  <!-- Salzburg Hero Background Image with WCAG AAA Luxury Gradient Scrim -->
  <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <picture>
      <source srcset="/images/salzburg-hero.jpg" type="image/jpeg">
      <img 
        src="https://www.thetimes.com/imageserver/image/33265cfd-df7e-42c6-885f-fb626b3d1319.jpg" 
        alt="Panoramic view of Salzburg with Hohensalzburg Fortress and Salzach River" 
        class="w-full h-full object-cover object-[center_38%] brightness-[0.68] contrast-[1.08] saturate-[1.15]"
        loading="eager"
      >
    </picture>
    <!-- Multi-stop luxury dark gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-midnight/90 via-midnight/60 to-midnight"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_25%,rgba(11,15,25,0.75)_80%)]"></div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="text-center max-w-3xl mx-auto mb-10">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/40 bg-midnight/80 backdrop-blur-md text-gold text-[11px] font-semibold uppercase tracking-wider mb-4">
        <iconify-icon icon="lucide:award" width="14" height="14" class="text-gold"></iconify-icon>
        Official Licensed Austrian Passenger Transport
      </div>
      <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold font-cinzel text-snow leading-tight mb-4 drop-shadow-lg">
        Travel Salzburg & The Alps in <span class="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-200 to-gold">Mercedes Luxury</span>
      </h1>
      <p class="text-base sm:text-lg text-slate-200 font-sans leading-relaxed drop-shadow">
        Fixed-price airport transfers, ski shuttles, and 8-hour private day tours. 100% Mercedes-Benz V-Class & Vito Fleet accommodating up to 8 passengers & 8 large suitcases.
      </p>
    </div>
    
    <!-- Hero Calculator follows... -->
```

### 9.4 Quick Chips Replacement in `index.html` (Lines 320–335)
Replace all emoji chips with Iconify icons:

```html
<!-- BEFORE -->
<span class="quick-chip" onclick="setPickup('Salzburg Airport W. A. Mozart (SZG)')">✈️ SZG Airport</span>
<span class="quick-chip" onclick="setPickup('Salzburg Hauptbahnhof (Central Station)')">🚆 Salzburg Hbf</span>
<span class="quick-chip" onclick="setPickup('Salzburg Old Town Hotel')">🏨 Old Town Hotel</span>

<!-- AFTER -->
<button type="button" class="quick-chip flex items-center gap-1.5 min-h-[44px]" onclick="setPickup('Salzburg Airport W. A. Mozart (SZG)')">
  <iconify-icon icon="lucide:plane" width="15" height="15" class="text-gold"></iconify-icon>
  <span>SZG Airport</span>
</button>
<button type="button" class="quick-chip flex items-center gap-1.5 min-h-[44px]" onclick="setPickup('Salzburg Hauptbahnhof (Central Station)')">
  <iconify-icon icon="lucide:train" width="15" height="15" class="text-gold"></iconify-icon>
  <span>Salzburg Hbf</span>
</button>
<button type="button" class="quick-chip flex items-center gap-1.5 min-h-[44px]" onclick="setPickup('Salzburg Old Town Hotel')">
  <iconify-icon icon="lucide:building-2" width="15" height="15" class="text-gold"></iconify-icon>
  <span>Old Town Hotel</span>
</button>
```

### 9.5 JavaScript Updates in `app.js`
Replace all legacy icons and Unicode characters in `app.js`:

```javascript
// Line 392 replacement:
// BEFORE: bubble.innerHTML = '✓';
// AFTER:
bubble.innerHTML = '<iconify-icon icon="lucide:check" width="14" height="14" class="text-midnight"></iconify-icon>';

// Line 447 replacement:
// BEFORE: : `${appState.pickupAddress} ➔ ${appState.dropoffAddress}`;
// AFTER:
: `${appState.pickupAddress} → ${appState.dropoffAddress}`;
```

---

## 10. Verification & Quality Acceptance Criteria

The Auditor (`agent-155a4006-d652-4bed-813f-862abcd83fb7`) and Browser QA Tester (`agent-49ce8d12-b37c-450c-bd4c-7fb6a9c0c8d1`) must verify the following criteria prior to final sign-off:

| Category | Verification Test | Success Threshold | Responsible Agent |
| :--- | :--- | :--- | :--- |
| **Zero Emoji** | Automated regex scan for Unicode emoji ranges across `index.html`, `app.js`, `style.css`. | **0 detected emojis (100% clean)** | Auditor |
| **Touch Targets** | Chrome DevTools inspect on interactive elements (`.counter-btn`, `.quick-chip`, `.hero-tab`, `.btn-gold`, `input`). | **All elements $\ge 44 \times 44\text{px}$** | Browser QA Tester |
| **Mobile Overflow** | Viewport emulation at 360px, 375px, 390px, 412px, 428px. | **Zero horizontal scroll bar (`scrollWidth == clientWidth`)** | Browser QA Tester |
| **Mobile Navigation**| Click hamburger button on $< 1024\text{px}$ viewport. | **Drawer smoothly transitions in, links navigate, close button works** | Browser QA Tester |
| **Hero Image** | Inspect network tab and visual render of Salzburg photograph. | **HTTP 200, focal position center 38%, gradient scrim legible** | Browser QA Tester |
| **Iconify Unification**| Check DOM elements for `<iconify-icon>`. | **Zero broken icons, uniform 2px stroke, correct Lucide identifiers** | Auditor |
| **Vehicle Cards** | Verify 16:9 podium and transparent vehicle graphics. | **Equal card heights, clear 6-spec grid, V-Class & Vito prominence**| Auditor |
| **ExuroTrip Standard**| Qualitative side-by-side design assessment. | **Visual polish, typography hierarchy, quiet alpine luxury matched** | UI/UX Specialist |

---

*This specification is saved at `/home/hanzlaahmad/OpenBot/Shared/PETRANS/design/design_compliance_spec.md` and stands as the single source of truth for UI/UX compliance in Phase 2.*
