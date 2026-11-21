# Browser QA Verification Report: Interactive 3D Vehicle Carousel

**Task ID:** TSK-PET-031  
**Project:** PETRANS Taxi & Tour Salzburg Website  
**Target URL:** `http://localhost:3000/#fleet`  
**Auditor / Responsible Agent:** Browser QA Tester (`agent-49ce8d12-b37c-450c-bd4c-7fb6a9c0c8d1`)  
**Testing Framework:** Chrome DevTools Protocol (CDP) Automated Test Harness (`audit/run_carousel_qa.js`)  
**Execution Timestamp:** 2026-11-21T03:59:39Z  
**Verdict:** **PASSED (100% — 51 of 51 Assertions Passed)**

---

## 1. Executive Summary

This report delivers the comprehensive live browser verification of the newly engineered **Interactive 3D Single-Vehicle Spotlight Carousel** in the `#fleet` section on `http://localhost:3000`. The evaluation was conducted using automated headless Chrome sessions instrumented through direct Chrome DevTools Protocol (CDP) WebSocket sessions across desktop, tablet, and mobile viewports.

The interactive carousel replaces the legacy multi-card grid with a focused private-showroom stage that showcases exactly one Mercedes-Benz vehicle at a time, complete with model-viewer 3D component configuration, instant zero-CLS WebP studio cutout poster hydration, direct top model tabs, floating glassmorphic chevrons ($48 \times 48\text{px}$ hit areas), pagination dashes, hardware-accelerated mobile touch swipe gestures, dynamic 6-pill technical amenity decks, and smooth deep linking into the shared 6-step booking engine with affirmative zero lock-in.

Across all 7 verification pillars, the implementation demonstrated **100% adherence** to the technical architecture specification ([3d_vehicle_carousel_architecture.md](file:///home/hanzlaahmad/OpenBot/Shared/PETRANS/research/3d_vehicle_carousel_architecture.md)) and UI/UX design specifications ([interactive_vehicle_carousel_spec.md](file:///home/hanzlaahmad/OpenBot/Shared/PETRANS/design/interactive_vehicle_carousel_spec.md)).

---

## 2. Verification Matrix Across 7 Core Pillars

| Pillar | Test Scope | Assertions Tested | Passed | Status |
| :--- | :--- | :---: | :---: | :---: |
| **Pillar 1** | Single-Vehicle Spotlight Layout & Luxury Staging | 6 | 6 | **PASSED** |
| **Pillar 2** | 3D Model Viewer & 2D Progressive WebP Fallback | 8 | 8 | **PASSED** |
| **Pillar 3** | Carousel Controls & Multi-Modal Navigation | 13 | 13 | **PASSED** |
| **Pillar 4** | Specification Deck & Calibrated Rate Synchronization | 3 | 3 | **PASSED** |
| **Pillar 5** | Deep-Link Booking Flow & Zero Lock-In Resilience | 4 | 4 | **PASSED** |
| **Pillar 6** | Mobile Touch/Swipe Ergonomics & Multi-Viewport Stability | 15 | 15 | **PASSED** |
| **Pillar 7** | Brand Compliance & Zero Unicode Emojis | 2 | 2 | **PASSED** |
| **Total** | **Comprehensive Automated Browser QA Suite** | **51** | **51** | **100% PASS** |

---

## 3. Detailed Pillar Findings & Browser Assertions

### Pillar 1: Single-Vehicle Spotlight Layout & Luxury Staging
- **Single-Vehicle Focus:** Verified that the legacy 3-card grid (`.grid-cols-3`) in `#fleet` has been completely eliminated. Exactly one vehicle spotlight is rendered at any time.
- **Stage Staging:** The spotlight stage container (`#fleet-stage`) is configured with class `.fleet-stage-container`, enforcing:
  - 16:9 aspect ratio on mobile viewports (<1024px) expanding to 21:9 on desktop viewports ($\ge 1024\text{px}$).
  - `overflow: hidden` and `border-radius: 1.5rem` (24px).
  - Background radial gradient (`radial-gradient(circle at 50% 50%, #161F30 0%, #0B0F19 100%)`).
  - Subtle gold border perimeter (`rgba(197, 160, 89, 0.20)`).
- **Ambient Lighting Scrim:** `.stage-scrim` element is positioned absolutely across the stage with an elliptical champagne gold radial gradient (`rgba(197, 160, 89, 0.18)`) and verified `pointer-events: none` to ensure uninterrupted user interaction.
- **Floating Controls:** Exactly 2 floating glassmorphic navigation chevrons are mounted within the stage boundaries.

### Pillar 2: 3D Model Viewer & 2D Progressive WebP Fallback
- **Web Component Integration:** `<model-viewer id="vehicle-viewer">` is present in the DOM with full luxury showroom calibration:
  - `auto-rotate` enabled with `rotation-per-second="4.5deg"` (strictly calibrated to 0.75 RPM).
  - `auto-rotate-delay="3000"` (3.0-second user-idle snapback).
  - Clamped vertical camera pitch: `min-camera-orbit="auto 72deg auto"` to `max-camera-orbit="auto 88deg auto"` (prevents awkward bird's-eye and low-angle clipping).
  - `camera-orbit="45deg 78deg 105%"`.
  - `disable-zoom` enabled to completely eliminate mobile scroll trapping.
  - `touch-action="pan-y"` ensuring vertical page gestures pass through freely to the browser.
  - Lighting configuration: `shadow-intensity="1.2"`, `shadow-softness="0.8"`, `exposure="1.0"`.
- **Instant Zero-CLS WebP Poster Hydration:** `poster` attribute points directly to `/images/mercedes-e-class.webp`.
- **2D Graceful Degradation:** `#stage-fallback` displays the high-resolution transparent WebP cutout (`#fallback-img`) on the luxury dark podium. Image loaded eagerly with verified dimensions ($1200 \times 465\text{px}$ native asset, CLS 0.00).
- **360° Interaction Cue:** Floating badge `#stage-cue` ("Interactive Showcase") displays upon initial render and smoothly transitions opacity to `0` and adds `.hidden` upon pointer interaction (`pointerdown` / `touchstart`).

### Pillar 3: Carousel Controls & Multi-Modal Navigation
- **Top 3-Tab Segmented Control:**
  - Symmetrical 3-tab selector (`E-Class Sedan`, `V-Class Van`, `Vito 4MATIC`) with `role="tablist"` and `aria-selected` attributes.
  - Direct tab clicks seamlessly update `fleetActiveIndex`, switch the stage poster, update the indicator readout, and activate the corresponding tab with gold gradient styling (`.fleet-tab.active`).
- **Floating Glassmorphic Chevrons:**
  - Bounding box measurement: Width $48.0\text{px} \times$ Height $48.0\text{px}$ (strict $\ge 48 \times 48\text{px}$ compliance).
  - Previous Chevron: Verified stepping backward (Vito $\to$ V-Class $\to$ E-Class) with infinite wrap-around (E-Class $\to$ Vito).
  - Next Chevron: Verified stepping forward (Vito $\to$ E-Class $\to$ V-Class) with infinite wrap-around.
- **Centered Index Readout & Interactive Dashes:**
  - Readout text synchronizes dynamically:
    - Slide 0: `01 / 03 • Mercedes-Benz E-Class Sedan`
    - Slide 1: `02 / 03 • Mercedes-Benz V-Class VIP`
    - Slide 2: `03 / 03 • Mercedes-Benz Vito Tourer 4MATIC`
  - All 3 pagination dash buttons measure $\ge 44 \times 44\text{px}$ in touch area. The active dash smoothly expands to $48\text{px}$ (3rem) with gold glow (`rgba(202, 163, 40, 0.5)`).
- **Keyboard Navigation:**
  - Focusing `#fleet-stage` and dispatching `ArrowRight` advances the carousel.
  - Dispatching `ArrowLeft` reverses the carousel.

### Pillar 4: Specification Deck Dynamic Updates
The glassmorphic specification card (`#fleet-spec-card`) reactively recalculates upon vehicle switch with a 150ms opacity transition:
- **Mercedes-Benz E-Class (Index 0):**
  - Category Badge: `Executive Chauffeur Sedan`
  - Name & Subtitle: `Mercedes-Benz E-Class` • `Obsidian Black Metallic • W214 Series`
  - Distance Rate: `€2.50 / km` (Mandatory Base Floor: `€45.00`)
  - Capacity: `Max 3 Passengers` • `2 Large + 2 Cabin Bags`
  - Amenities: Free Child Seats, Free Ski Equipment, High-Speed Wi-Fi, Bottled Water
- **Mercedes-Benz V-Class (Index 1):**
  - Category Badge: `Exclusive VIP Chauffeur`
  - Name & Subtitle: `Mercedes-Benz V-Class` • `Obsidian Black Metallic • W447 Exclusive`
  - Distance Rate: `€2.60 / km` (Mandatory Base Floor: `€45.00`)
  - Capacity: `Max 8 Passengers` • `8 Large Suitcases`
  - Amenities: Free Child Seats, Free Ski Equipment, High-Speed Wi-Fi, Bottled Water
- **Mercedes-Benz Vito Tourer (Index 2):**
  - Category Badge: `Alpine 4MATIC Specialist`
  - Name & Subtitle: `Mercedes-Benz Vito Tourer` • `Brilliant Silver • 4MATIC All-Wheel`
  - Distance Rate: `€2.80 / km` (Mandatory Base Floor: `€45.00`)
  - Capacity: `Max 8 Passengers` • `8 Large Suitcases`
  - Amenities: 4MATIC All-Wheel, Free Ski Equipment, USB Fast Power, Group Expedition

### Pillar 5: Deep-Link Booking Flow & Zero Lock-In
- **CTA Deep-Linking:**
  - With V-Class active in the carousel, clicking `#carousel-book-cta` (`[ Book This Vehicle ]`) smoothly navigates to `#booking-stepper` and updates the URL to `?vehicle=v-class#booking-stepper`.
  - Application state updates immediately: `appState.vehicleCategory === 'V_CLASS'`, `appState.entrySource === 'fleet'`.
- **Preselection Reassurance Banner:**
  - `#preselection-banner` displays prominently:
    *"Vehicle Pre-selected: Mercedes-Benz V-Class (€2.60/km). You can change this at any time."*
- **Stage 2 Selection Synchronization:**
  - In Stage 2, the V-Class card (`.vehicle-card[data-veh="V_CLASS"]`) is highlighted with `.border-gold`, `.bg-gold/10`, and `lucide:check-circle`.
- **Zero Lock-In Verification:**
  - The customer is never locked into their initial vehicle choice. Clicking the E-Class card in Stage 2 seamlessly updates `appState.vehicleCategory` to `E_CLASS`, adjusts party size limits, and recalculates the quote in real time without error.

### Pillar 6: Mobile Touch/Swipe Ergonomics & Multi-Viewport Stability
- **Horizontal Overflow:** Verified **0px horizontal overflow** across all 5 standard viewport profiles:
  - iPhone SE ($375 \times 667$): `scrollWidth = 375px`, `innerWidth = 375px` (0px overflow)
  - iPhone 14/15 ($390 \times 844$): `scrollWidth = 390px`, `innerWidth = 390px` (0px overflow)
  - Samsung Galaxy S22 ($412 \times 915$): `scrollWidth = 412px`, `innerWidth = 412px` (0px overflow)
  - iPad / Tablet ($768 \times 1024$): `scrollWidth = 768px`, `innerWidth = 768px` (0px overflow)
  - Desktop HD ($1280 \times 800$): `scrollWidth = 1280px`, `innerWidth = 1280px` (0px overflow)
- **Touch Target Ergonomics:**
  - Navigation Chevrons: $48 \times 48\text{px}$ ($\ge 44\text{px}$ requirement satisfied).
  - Model Tabs: Height $44\text{px}$ to $48\text{px}$ across all breakpoints.
  - Pagination Dash Buttons: Touch wrapper enforces minimum $44 \times 44\text{px}$ target area.
  - CTA Button: Height $48\text{px}$ on mobile ($\ge 44\text{px}$ requirement satisfied).
- **Touch Swipe Gesture Handling:**
  - **Horizontal Left Swipe:** Swiping left with displacement $\Delta x = -150\text{px}$ ($> 50\text{px}$ threshold) smoothly advances the carousel from index 0 to 1.
  - **Horizontal Right Swipe:** Swiping right with displacement $\Delta x = +150\text{px}$ ($> 50\text{px}$ threshold) smoothly reverses the carousel from index 1 to 0.
  - **Vertical Scroll Pass-Through:** Swiping with vertical displacement $|\Delta y| = 150\text{px} > |\Delta x| = 20\text{px}$ does **NOT** trigger a slide transition. Natural page scrolling remains completely unblocked.

### Pillar 7: Brand Compliance & Zero Unicode Emojis
- **Zero Unicode Emojis:** Verified 0 occurrences of Unicode emoji glyphs within the `#fleet` section.
- **Icon Standards:** 100% of interactive icons rendered using `<iconify-icon icon="lucide:...">` with uniform 2px stroke.

---

## 4. Multi-Viewport Measurement Matrix

| Viewport Profile | Resolution | Scroll Width | Inner Width | Overflow | Touch Targets ($\ge 44\text{px}$) | Swipe Handlers | Screenshot Artifact |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **iPhone SE** | $375 \times 667$ | 375px | 375px | **0px** | **PASS** | **PASS** | `viewport_carousel_iPhone_SE_375x667.png` |
| **iPhone 14/15** | $390 \times 844$ | 390px | 390px | **0px** | **PASS** | **PASS** | `viewport_carousel_iPhone_14_15_390x844.png` |
| **Samsung Galaxy S22** | $412 \times 915$ | 412px | 412px | **0px** | **PASS** | **PASS** | `viewport_carousel_Samsung_Galaxy_S22_412x915.png` |
| **iPad / Tablet** | $768 \times 1024$ | 768px | 768px | **0px** | **PASS** | **PASS** | `viewport_carousel_Tablet__iPad__768x1024.png` |
| **Desktop HD** | $1280 \times 800$ | 1280px | 1280px | **0px** | **PASS** | **PASS** | `viewport_carousel_Desktop_HD_1280x800.png` |

---

## 5. Visual Evidence Catalog

The following high-resolution screenshot artifacts were captured during automated execution and are archived in `audit/screenshots/carousel/`:

1. [pillar1_single_vehicle_spotlight_desktop.png](file:///home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/screenshots/carousel/pillar1_single_vehicle_spotlight_desktop.png) — Single-vehicle spotlight stage with ambient radial gold scrim and floating chevrons on desktop ($1280 \times 800$).
2. [pillar2_model_fallback_rendering.png](file:///home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/screenshots/carousel/pillar2_model_fallback_rendering.png) — 2D WebP fallback cutout rendering with 360° interaction cue.
3. [pillar3_tab1_vclass_selected.png](file:///home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/screenshots/carousel/pillar3_tab1_vclass_selected.png) — V-Class selection via model tab, updating image, indicator text, and active dash.
4. [pillar3_tab2_vito_selected.png](file:///home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/screenshots/carousel/pillar3_tab2_vito_selected.png) — Vito 4MATIC selection via model tab, updating image and indicator text.
5. [pillar4_specs_deck_vclass.png](file:///home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/screenshots/carousel/pillar4_specs_deck_vclass.png) — Synchronized specification deck showing €2.60/km rate, 8 pax, and 8 bags.
6. [pillar5_booking_preselected_vclass.png](file:///home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/screenshots/carousel/pillar5_booking_preselected_vclass.png) — Deep-link transition to `#booking-stepper` with affirmative preselection banner and highlighted card.
7. [viewport_carousel_iPhone_SE_375x667.png](file:///home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/screenshots/carousel/viewport_carousel_iPhone_SE_375x667.png) — Mobile viewport audit on iPhone SE (375px width, 0px overflow).
8. [viewport_carousel_iPhone_14_15_390x844.png](file:///home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/screenshots/carousel/viewport_carousel_iPhone_14_15_390x844.png) — Mobile viewport audit on iPhone 14/15 (390px width, 0px overflow).
9. [viewport_carousel_Samsung_Galaxy_S22_412x915.png](file:///home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/screenshots/carousel/viewport_carousel_Samsung_Galaxy_S22_412x915.png) — Mobile viewport audit on Samsung Galaxy S22 (412px width, 0px overflow).
10. [viewport_carousel_Tablet__iPad__768x1024.png](file:///home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/screenshots/carousel/viewport_carousel_Tablet__iPad__768x1024.png) — Tablet viewport audit on iPad (768px width, 0px overflow).
11. [viewport_carousel_Desktop_HD_1280x800.png](file:///home/hanzlaahmad/OpenBot/Shared/PETRANS/audit/screenshots/carousel/viewport_carousel_Desktop_HD_1280x800.png) — Desktop HD viewport audit (1280px width, 21:9 aspect ratio).

---

## 6. Formal Certification & Next Actions

### Formal QA Certification
The Interactive 3D Vehicle Spotlight Carousel has passed all functional, visual, responsive, and ergonomic checks with a **100% test pass rate (51/51 assertions passed)**. The implementation is certified production-ready, exhibiting zero layout shifts, smooth gesture interaction, and flawless deep linking into the PETRANS booking engine.

### Recommended Next Actions
- Hand over to **Auditor (`agent-155a4006-d652-4bed-813f-862abcd83fb7`)** for final legal compliance audit under `TSK-PET-032` (Austrian *Markenschutzgesetz § 10(3)* and *FAGG § 8* verification).
- Proceed with repository commit and documentation synchronization on GitHub `main`.
