# PETRANS Taxi & Tour Salzburg — Brand Identity, Information Architecture, Sitemap & Booking Flow UX

**Document ID:** `DES-PET-002`  
**Date:** 20 November 2026  
**Document Owner:** UI/UX Design Specialist  
**Assigned Task:** `TSK-PET-002`  
**Target Entity:** PETRANS Taxi & Tour Salzburg (CEO: Omer Farooq)  
**Status:** Approved for Implementation & Technical Handoff  
**Primary Reference Sources:**  
- `/home/hanzlaahmad/OpenBot/Shared/PETRANS/docs/requirements_analysis.md`
- `/home/hanzlaahmad/OpenBot/Shared/PETRANS/docs/questionnaire_extracted.txt`
- `/home/hanzlaahmad/OpenBot/Shared/PETRANS/research/competitor_analysis.md` (`RES-PET-001`)

---

## 1. Executive Summary & Design Vision

### 1.1 The Core Design Synthesis
The client brief sets an unambiguous product benchmark:
> *"A mix of both: Premium feel of ExuroTour [exurotrip.com] but Simple Booking like Salzburg Cab [salzburgcab.com]. What makes us different is price and flexibility."*

PETRANS Taxi & Tour Salzburg must bridge two polar extremes in the alpine transportation landscape:
1. **The Visual Poise of ExuroTrip:** Dark luxury backdrops, warm champagne gold accents, modern typography, glassmorphism card surfaces, and prestige trust signals that command high perceived value and appeal to international tourists, ski vacationers, and corporate executives.
2. **The Frictionless Utility & SEO Depth of Salzburg Cab:** A streamlined 4-to-6-step instant booking component that eliminates cognitive friction, backed by deep waypoint storytelling (local Alpine history, photo stops, clear inclusions) that captures high-intent organic search queries.

```mermaid
graph TD
    subgraph ExuroTrip_Influence ["ExuroTrip Visual Sophistication"]
        E1["Deep Midnight Obsidian Slate"]
        E2["Warm Metallic Champagne Gold (#C5A059)"]
        E3["Geometric Luxury Typography (Outfit / Cinzel)"]
        E4["Instant Tabbed Hero Quote Engine"]
        E5["Executive Mercedes Fleet Showcase"]
    end

    subgraph SalzburgCab_Influence ["Salzburg Cab Operational Usability"]
        S1["Transparent Fixed Rate Presentation"]
        S2["Waypoint History & Destination Storytelling"]
        S3["Frictionless 4-Step Form Stepper"]
        S4["Free Ski Equipment & Child Seat Add-ons"]
        S5["Flexible Payment: Online or Cash to Driver"]
    end

    subgraph PETRANS_Synthesis ["PETRANS Target UX & Brand System"]
        P1["Modern Next.js 15 Fast UI with Sub-second Interaction"]
        P2["Palette Option 1: Alpine Midnight Navy + Champagne Bronze"]
        P3["Interactive 6-Step Booking Stepper with Live Fare Math"]
        P4["Rich Destination Guides & Dedicated SEO Route Landers"]
        P5["Mobile-First Sticky Booking Bar + Floating 24/7 WhatsApp"]
    end

    ExuroTrip_Influence -->|Elegance & Authority| PETRANS_Synthesis
    SalzburgCab_Influence -->|Clarity & Organic SEO| PETRANS_Synthesis
```

### 1.2 Target User Personas & Behavioral Paths

| Persona | Demographics & Context | Primary Need | Key Friction / Anxiety | PETRANS UX Solution |
| :--- | :--- | :--- | :--- | :--- |
| **1. The Alpine Family Vacationer** | Family of 4–6 arriving at Salzburg Airport (SZG) bound for Zell am See, Saalbach, or Flachau with ski bags and luggage. | Guaranteed large vehicle, free booster/child seats, free ski transport, flat upfront price. | Hidden fees for bulky luggage/skis, driver not showing up, flight delay surcharges. | Dedicated Mercedes V-Class/Vito selector, explicit "Free Child Seats & Ski Gear" badges, automated 60-min flight delay guarantee. |
| **2. The Luxury Sightseer / Tour Group** | Couple or small group (2–8 pax) from US, UK, Middle East, or Asia seeking a full-day private experience in Hallstatt or Eagles Nest. | Premium private chauffeur, flexible stops, scenic comfort, postcard views. | Crowded tour buses, strict schedules, high prices (€650+ on Viator). | Highlight flat €450 / 8-hour private van tour, customizable intermediate photo stops (e.g. Red Bull HQ, Lake Fuschl). |
| **3. The Cross-Border Business Traveler** | Corporate executive or international conference traveler traveling SZG to Munich Airport (MUC), Vienna, or Innsbruck. | Punctuality, quiet executive cabin, tax invoice (Austrian VAT), instant booking confirmation. | Unreliable meter rates, lack of card payment receipt, airport waiting delays. | Instant fixed quote (€490 MUC), online card payment or card-to-driver option, chauffeur meet-and-greet with digital name board. |

---

## 2. Brand Identity & Visual Design System

### 2.1 Logo Architecture & Monogram Concepts

The PETRANS identity represents alpine precision, Austrian hospitality, and modern Mercedes-Benz chauffeur luxury.

#### Concept 1 (Recommended): "The Alpine Chauffeur Crest"
- **Visual Element:** A geometric monogram combining the letter **'P'** with two minimalist mountain contours (representing the Salzburg Northern Limestone Alps / Untersberg) enclosed within an open hexagonal shield.
- **Wordmark:** `PETRANS` set in tracked uppercase luxury serif (`Cinzel`), underscored by `TAXI & TOUR SALZBURG` in clean sans-serif (`Plus Jakarta Sans`).
- **Symbolism:** The shield evokes protection, discretion, and licensed safety; the alpine lines signify mountain expertise; the gold hairline finish communicates five-star executive transport.

```
       / \
      / P \         P E T R A N S
     /=====\     TAXI & TOUR SALZBURG
    /       \   ═════════════════════════
    \_______/   Official Mercedes Chauffeurs
```

#### Concept 2 (Alternative): "The Sovereign Route Vector"
- **Visual Element:** A bold, fluid architectural letterform **'P'** morphing into an infinite highway curve with a subtle Mercedes three-pointed star alignment at the horizon.
- **Wordmark:** `PETRANS` set in clean geometric sans (`Outfit Bold`) with a high-contrast metallic gold divider and `SALZBURG CHAUFFEUR SERVICE` underneath.
- **Symbolism:** Speed, continuous motion, seamless door-to-door transit between Salzburg and European destinations.

#### Logo Asset Variations:
1. **Primary Horizontal Lockup (Light on Dark):** Gold icon + White wordmark + Gold subtitle for website header, mobile navigation, and dark footer.
2. **Secondary Stacked Badge:** Centered icon with circular alpine emblem for social media avatars, WhatsApp profile, and email headers.
3. **Monochrome Inverted:** Pure white vector for single-color print, receipts, and vehicle door decal cutouts.
4. **Favicon:** Scalable 32x32 / 16x16 SVG containing the crisp gold 'P' crest on dark obsidian slate.

---

### 2.2 Color Palette Specifications

Two distinct palettes tailored to high-end European transport are specified. **Palette Option 1** is selected as the primary recommendation for maximum alignment with ExuroTrip's aesthetic and regional alpine resonance.

#### Palette Option 1 (Recommended): "Alpine Midnight Slate & Warm Champagne Gold"

```
[ Primary Background: #0B0F19 ]   [ Surface / Cards: #161F30 ]   [ Deep Slate Accent: #1E293B ]
[ Accent Gold: #C5A059 ]         [ Highlight Bronze: #E5C378 ]   [ Pure Snow: #F8FAFC ]
```

| Token Name | Hex Code | RGB | HSL | Usage & Context |
| :--- | :--- | :--- | :--- | :--- |
| `bg-primary` | `#0B0F19` | `11, 15, 25` | `223°, 39%, 7%` | Global dark background, body canvas, footer backdrop |
| `bg-surface` | `#161F30` | `22, 31, 48` | `219°, 37%, 14%` | Card backgrounds, booking stepper container, modal surfaces |
| `bg-surface-elevated` | `#1E293B` | `30, 41, 59` | `217°, 33%, 17%` | Dropdowns, tooltips, hover card elevations, tab pills |
| `accent-gold` | `#C5A059` | `197, 160, 89` | `39°, 49%, 56%` | Primary CTA buttons, key icons, active tab underlines, price highlights |
| `accent-gold-hover`| `#D4AF37` | `212, 175, 55` | `46°, 65%, 52%` | Button hover states, glowing border outlines |
| `accent-gold-subtle`| `rgba(197,160,89,0.12)` | - | - | Tag badges, form input focus halos, card divider lines |
| `text-primary` | `#F8FAFC` | `248, 250, 252` | `210°, 40%, 98%` | Primary titles, hero headlines, card headers, form values |
| `text-secondary` | `#94A3B8` | `148, 163, 184`| `215°, 20%, 65%` | Subtitles, helper text, breadcrumbs, table headers |
| `text-muted` | `#64748B` | `100, 116, 139`| `215°, 16%, 47%` | Placeholder text, copyright notices, disabled states |
| `status-success` | `#10B981` | `16, 185, 129` | `160°, 84%, 39%` | Free cancellation badges, confirmed status, valid inputs |
| `status-warning` | `#F59E0B` | `245, 158, 11` | `38°, 92%, 50%` | Luggage capacity warning, pending confirmation tag |
| `status-danger` | `#EF4444` | `239, 68, 68`  | `0°, 84%, 60%`  | Form validation errors, required field indicators |

#### Palette Option 2 (Alternative): "Matte Obsidian Black & Sovereign Alpine Emerald"

```
[ Primary Background: #090A0C ]   [ Surface / Cards: #12151A ]   [ Emerald Accent: #198754 ]
[ Platinum Silver: #E2E8F0 ]      [ Frost Muted: #6B7280 ]       [ Ice White: #FFFFFF ]
```

| Token Name | Hex Code | RGB | Usage & Context |
| :--- | :--- | :--- | :--- |
| `bg-primary` | `#090A0C` | `9, 10, 12` | Deep jet-black matte foundation, high executive contrast |
| `bg-surface` | `#12151A` | `18, 21, 26` | Charcoal-emerald tinted cards and modals |
| `accent-emerald`| `#10B981` / `#059669`| `5, 150, 105` | Vibrant Austrian Alpine forest green accents, sustainable fleet cues |
| `accent-silver` | `#CBD5E1` | `203, 213, 225` | Metallic chrome borders and brushed aluminum badges |
| `text-primary` | `#FFFFFF` | `255, 255, 255` | High-contrast stark white typography |

---

### 2.3 Typography Pairings & Hierarchy

The typography structure pairs a **classical luxury display typeface** for authoritative titles with a **clean, highly legible geometric sans-serif** for effortless mobile form completion and data density.

#### Primary Typography Stack:
- **Display & Section Titles:** `Cinzel` (Google Fonts) or `Outfit` (Geometric Chauffeur Modern).
- **Body, UI & Form Elements:** `Plus Jakarta Sans` (Google Fonts, weights 400, 500, 600, 700).
- **Numerical Data, Pricing & Timers:** `Space Grotesk` or `JetBrains Mono` for tabular alignment.

#### Typographic Hierarchy Scale:

| Level | Font Family | Size (Desktop) | Size (Mobile) | Weight | Line Height | Tracking | Application |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display (H1)** | `Cinzel` / `Outfit` | `3.5rem (56px)` | `2.25rem (36px)`| 700 Bold | `1.15` | `-0.02em` | Homepage Hero, Route Landing Hero |
| **Section Title (H2)** | `Cinzel` / `Outfit` | `2.5rem (40px)` | `1.875rem (30px)`| 600 SemiBold| `1.25` | `-0.01em` | "Our Premium Fleet", "Popular Day Tours" |
| **Card / Subsection (H3)**| `Plus Jakarta Sans`| `1.5rem (24px)` | `1.25rem (20px)`| 600 SemiBold| `1.35` | `0` | Vehicle Card Titles, Tour Itinerary Stops |
| **Form Labels & Subtitles (H4)**| `Plus Jakarta Sans`| `1.125rem (18px)`| `1.0rem (16px)` | 600 SemiBold| `1.4` | `0` | Booking Field Headers, Step Labels |
| **Body Standard** | `Plus Jakarta Sans`| `1.0rem (16px)` | `0.9375rem (15px)`| 400 Regular | `1.6` | `0` | Waypoint descriptions, FAQ answers |
| **UI Badges & Microcopy**| `Plus Jakarta Sans`| `0.8125rem (13px)`| `0.75rem (12px)`| 600 SemiBold| `1.2` | `+0.05em (caps)`| "FREE 24H CANCELLATION", "60 MIN WAIT" |
| **Price Hero Number** | `Space Grotesk` | `2.25rem (36px)`| `1.875rem (30px)`| 700 Bold | `1.1` | `-0.02em` | Fixed Price Quotes (e.g., `€204.40`) |

---

### 2.4 UI Component Micro-Interactions & Styling Rules

1. **Glassmorphism Cards:**
   ```css
   background: rgba(22, 31, 48, 0.75);
   backdrop-filter: blur(16px);
   -webkit-backdrop-filter: blur(16px);
   border: 1px solid rgba(197, 160, 89, 0.2);
   box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
   border-radius: 1rem; /* 16px */
   ```
2. **Gold Button CTA Hover State:**
   - Default: Solid `#C5A059` with dark obsidian text `#0B0F19`, font-weight 600.
   - Hover: Transform `translateY(-2px)`, shadow `0 12px 25px -4px rgba(197, 160, 89, 0.4)`, background `#D4AF37`.
   - Active: Transform `scale(0.98)`.
3. **Form Field Interactions:**
   - 16px minimum font size on mobile to prevent iOS Safari auto-zoom.
   - Border transitions from `rgba(255,255,255,0.15)` to `#C5A059` on focus with a subtle `ring-2 ring-[#C5A059]/20`.

---

## 3. Complete Information Architecture & Sitemap

### 3.1 Global Navigation Hierarchy

```mermaid
graph TD
    Root["PETRANS Global Navigation"]
    
    Root --> H["1.0 Homepage (/)"]
    Root --> S["2.0 Services (/services)"]
    Root --> R["3.0 Route Landers (/transfers)"]
    Root --> T["4.0 Day Tours (/tours)"]
    Root --> F["5.0 Fleet (/fleet)"]
    Root --> C["6.0 Company & Trust"]
    Root --> L["7.0 Legal & Compliance"]

    S --> S1["2.1 Salzburg Airport Transfers (/services/airport-transfers)"]
    S --> S2["2.2 Ski & Snowboard Transfers (/services/ski-transfers)"]
    S --> S3["2.3 Intercity Transfers (/services/intercity-transfers)"]
    S --> S4["2.4 City Taxi & Chauffeur (/services/city-taxi-chauffeur)"]
    S --> S5["2.5 Salzburg Train Station (/services/train-station-transfers)"]
    S --> S6["2.6 Corporate & Business Chauffeur (/services/corporate-chauffeur)"]

    R --> R1["3.1 Salzburg to Hallstatt (/transfers/salzburg-to-hallstatt)"]
    R --> R2["3.2 Salzburg to Zell am See / Kaprun (/transfers/salzburg-to-zell-am-see)"]
    R --> R3["3.3 Salzburg to Innsbruck (/transfers/salzburg-to-innsbruck)"]
    R --> R4["3.4 Salzburg to Munich Airport (/transfers/salzburg-to-munich-airport)"]
    R --> R5["3.5 Salzburg to Vienna (/transfers/salzburg-to-vienna)"]
    R --> R6["3.6 Salzburg to Prague (/transfers/salzburg-to-prague)"]
    R --> R7["3.7 Salzburg to Eagles Nest (/transfers/salzburg-to-eagles-nest)"]
    R --> R8["3.8 Salzburg to Bad Gastein (/transfers/salzburg-to-bad-gastein)"]
    R --> R9["3.9 Salzburg to Saalbach-Hinterglemm (/transfers/salzburg-to-saalbach)"]

    T --> T1["4.1 Hallstatt 8h Tour (/tours/hallstatt-8-hour-private-tour)"]
    T --> T2["4.2 Eagles Nest & Königssee (/tours/eagles-nest-berchtesgaden-tour)"]
    T --> T3["4.3 Werfen Ice Caves & Castle (/tours/werfen-ice-caves-castle-tour)"]
    T --> T4["4.4 Zell am See & Kaprun Alpine (/tours/zell-am-see-kaprun-alpine-tour)"]
    T --> T5["4.5 Innsbruck & Tyrol Highlights (/tours/innsbruck-tyrol-tour)"]
    T --> T6["4.6 Swarovski Crystal Worlds (/tours/swarovski-crystal-worlds-tour)"]
    T --> T7["4.7 Bad Gastein Thermal Tour (/tours/bad-gastein-thermal-tour)"]
    T --> T8["4.8 Custom Day Tour Inquiry (/tours/custom-tour-inquiry)"]

    F --> F1["5.1 Mercedes-Benz V-Class VIP (8 Pax)"]
    F --> F2["5.2 Mercedes-Benz Vito Tourer (8 Pax)"]

    C --> C1["6.1 About Us & Chauffeur Team (/about)"]
    C --> C2["6.2 Customer Reviews & Trust (/reviews)"]
    C --> C3["6.3 FAQ & Policies (/faq)"]
    C --> C4["6.4 Contact & 24/7 Hotline (/contact)"]

    L --> L1["7.1 Impressum & Commercial Disclosure (/impressum)"]
    L --> L2["7.2 Privacy Policy & GDPR (/privacy)"]
    L --> L3["7.3 Terms & Conditions of Carriage (/terms)"]
```

---

### 3.2 Master Sitemap & SEO Keyword Matrix

Every page is indexed with targeted URL slugs, high-intent title tags, meta descriptions, and core call-to-actions (CTAs) to maximize search conversion.

| Page Type | URL Slug | SEO Page Title (`<title>`) | Meta Description | Primary Target Keyword | Primary Conversion CTA |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Homepage** | `/` | *PETRANS Taxi & Tour Salzburg \| Luxury Mercedes Transfers & Day Trips* | Book private transfers & 8-hour day tours in Salzburg. 100% Mercedes V-Class fleet, transparent fixed rates, 60-min airport waiting & free ski gear transport. | `salzburg taxi and tour`, `private transfer salzburg` | Instant Quote / Book Now |
| **Service** | `/services/airport-transfers` | *Salzburg Airport Taxi & Private Transfers (SZG) \| Fixed Rates \| PETRANS* | Fixed-price Salzburg Airport (SZG) private transfers. Chauffeur meet & greet in arrivals, digital name board, 60 min free waiting & flight tracking. | `salzburg airport taxi`, `salzburg airport transfer` | Book Airport Transfer |
| **Service** | `/services/ski-transfers` | *Salzburg Ski Transfers \| Zell am See, Saalbach, Kitzbühel \| Free Ski Gear* | Premium ski transfers from Salzburg Airport to Austria's top ski resorts. Mercedes V-Class 4MATIC with free ski & snowboard transport. | `salzburg ski transfers`, `salzburg to zell am see ski taxi` | Check Ski Resort Fare |
| **Service** | `/services/intercity-transfers` | *Intercity Chauffeur Service Salzburg \| Munich, Vienna, Innsbruck, Prague* | Long-distance door-to-door private transfers from Salzburg to Germany, Czech Republic & Austria. Luxurious Mercedes-Benz minivans with fixed rates. | `intercity taxi salzburg`, `salzburg private chauffeur` | Calculate Intercity Rate |
| **Service** | `/services/city-taxi-chauffeur` | *Salzburg City Chauffeur & VIP Taxi \| Mercedes V-Class Hourly Hire* | Premium city chauffeur and hourly hire in Salzburg. Ideal for dining, shopping, weddings, and events. English and German speaking drivers. | `salzburg city taxi`, `hourly chauffeur salzburg` | Reserve Hourly Chauffeur |
| **Service** | `/services/train-station-transfers`| *Salzburg Hauptbahnhof Taxi & Train Station Transfers \| PETRANS* | Reliable private transfers to and from Salzburg Central Train Station (Hbf). 10 minutes free waiting, luggage assistance, fixed city rates. | `salzburg train station taxi`, `salzburg hbf transfer` | Book Station Pickup |
| **Service** | `/services/corporate-chauffeur`| *Corporate Chauffeur Salzburg \| Executive Business Travel & Invoicing* | Dedicated corporate transportation in Salzburg. Modern Mercedes V-Class with onboard Wi-Fi, climate control, corporate billing & VAT receipts. | `corporate chauffeur salzburg`, `business taxi salzburg` | Open Corporate Account |
| **Route** | `/transfers/salzburg-to-hallstatt` | *Private Transfer Salzburg to Hallstatt \| Fixed €204.40 \| Mercedes Van* | Direct private transfer from Salzburg to Hallstatt (73 km, 1h 15m). Mercedes V-Class/Vito up to 8 persons, fixed €204.40 with all tolls and taxes included. | `salzburg to hallstatt private transfer`, `taxi salzburg hallstatt` | Book Hallstatt Transfer |
| **Route** | `/transfers/salzburg-to-zell-am-see`| *Salzburg to Zell am See & Kaprun Transfer \| Fixed €238.00 \| PETRANS* | Private transfer from Salzburg Airport to Zell am See & Kaprun (85 km, 1h 30m). Free ski equipment transport, up to 8 passengers, Mercedes V-Class. | `salzburg to zell am see transfer`, `taxi salzburg kaprun` | Book Zell am See Ride |
| **Route** | `/transfers/salzburg-to-innsbruck` | *Salzburg to Innsbruck Private Chauffeur Transfer \| Fixed €518.00* | Door-to-door private transfer from Salzburg to Innsbruck (185 km, 2h 00m). Scenic Tyrolean transit in luxury Mercedes minivans with all tolls included. | `salzburg to innsbruck transfer`, `taxi salzburg innsbruck` | Book Innsbruck Transfer |
| **Route** | `/transfers/salzburg-to-munich-airport`| *Salzburg to Munich Airport (MUC) Private Transfer \| Fixed €490.00* | Fixed-price cross-border transfer between Salzburg and Munich Airport (175 km, 1h 50m). Direct terminal drop-off, flight delay monitoring. | `salzburg to munich airport transfer`, `taxi salzburg to muc` | Book Munich Airport Ride |
| **Route** | `/transfers/salzburg-to-vienna` | *Salzburg to Vienna Private Transfer (City & VIE Airport) \| PETRANS* | Executive Mercedes V-Class transfer from Salzburg to Vienna (300 km, 3h 15m). Comfortable door-to-door transit with optional Wachau Valley stops. | `salzburg to vienna private transfer`, `taxi salzburg vienna` | Book Vienna Transfer |
| **Route** | `/transfers/salzburg-to-prague` | *Salzburg to Prague Private Transfer \| Fixed €650 Route Special* | Cross-border chauffeur transfer from Salzburg to Prague (375 km, 4h 15m). Optional stop in Český Krumlov. Mercedes V-Class luxury. | `salzburg to prague private transfer`, `taxi salzburg prague` | Book Prague Transfer |
| **Route** | `/transfers/salzburg-to-eagles-nest`| *Salzburg to Eagles Nest & Berchtesgaden Transfer \| Fixed €84.00* | Quick 30-minute private transfer to Berchtesgaden and Kehlsteinhaus Obersalzberg. Fixed €84.00 for up to 8 passengers. | `salzburg to eagles nest transfer`, `taxi salzburg berchtesgaden` | Book Berchtesgaden Ride |
| **Route** | `/transfers/salzburg-to-bad-gastein`| *Salzburg to Bad Gastein & Bad Hofgastein Transfer \| Fixed €280.00* | Private ski and thermal spa transfer to the Gastein Valley (100 km, 1h 30m). Up to 8 passengers with generous luggage and ski space. | `salzburg to bad gastein transfer`, `taxi salzburg gastein` | Book Gastein Transfer |
| **Tour** | `/tours/hallstatt-8-hour-private-tour`| *Private Hallstatt Day Tour from Salzburg (8h) \| Flat €450 for 8 Pax* | Exclusive 8-hour private day tour to Hallstatt & Salzkammergut. Stops at Lake Fuschl (Red Bull HQ) & St. Gilgen. Up to 8 guests in Mercedes V-Class. | `hallstatt private tour from salzburg`, `hallstatt day trip 8 hours` | Reserve 8h Hallstatt Tour |
| **Tour** | `/tours/eagles-nest-berchtesgaden-tour`| *Eagles Nest & Berchtesgaden Private Tour (6-8h) \| Flat €450 \| PETRANS* | Private van tour to Kehlsteinhaus (Eagles Nest), Documentation Obersalzberg & Lake Königssee. Up to 8 persons, flexible photo stops, Mercedes comfort. | `eagles nest tour from salzburg`, `berchtesgaden private tour` | Reserve Eagles Nest Tour |
| **Tour** | `/tours/werfen-ice-caves-castle-tour`| *Werfen World's Largest Ice Caves & Castle Tour (8h) \| Flat €450* | Private day excursion to Eisriesenwelt Werfen and Hohenwerfen Fortress. Spectacular alpine scenery, private Mercedes minivan chauffeur. | `werfen ice caves tour`, `eisriesenwelt tour from salzburg` | Reserve Ice Caves Tour |
| **Tour** | `/tours/zell-am-see-kaprun-alpine-tour`| *Zell am See & Kaprun Alpine Glacier Tour (8h) \| Flat €450 \| PETRANS* | Full-day alpine excursion to Lake Zell, Kaprun Castle, and Kitzsteinhorn glacier viewpoints. Mercedes V-Class luxury for up to 8 guests. | `zell am see private tour`, `kaprun day tour from salzburg` | Reserve Zell am See Tour |
| **Tour** | `/tours/innsbruck-tyrol-tour` | *Innsbruck & Tyrolean Alps Private Tour (8-9h) \| Tier 3 Special €650* | Full-day private tour from Salzburg to Innsbruck. Imperial Hofburg, Golden Roof, Bergisel ski jump, and alpine panorama. Up to 8 guests. | `innsbruck tour from salzburg`, `private day trip to innsbruck` | Reserve Innsbruck Tour |
| **Tour** | `/tours/swarovski-crystal-worlds-tour`| *Swarovski Crystal Worlds & Wattens Private Tour (8h) \| PETRANS* | Marvel at the iconic Giant and crystalline art chambers in Wattens with private chauffeur transit from Salzburg. Fixed price up to 8 passengers. | `swarovski crystal worlds tour`, `salzburg to wattens tour` | Reserve Swarovski Tour |
| **Tour** | `/tours/bad-gastein-thermal-tour` | *Bad Gastein Waterfall & Thermal Spa Day Tour (8h) \| Flat €450* | Relax in the historic Belle Époque spa town of Bad Gastein. Waterfall views, thermal baths, and alpine valley scenery in Mercedes comfort. | `bad gastein day tour`, `gastein waterfall private trip` | Reserve Gastein Tour |
| **Tour** | `/tours/custom-tour-inquiry` | *Custom Private Day Tour Salzburg \| Design Your Own Itinerary* | Create your personalized alpine sightseeing itinerary. Tell us what you want to see; our team will formulate the perfect Mercedes route. | `custom day tour salzburg`, `private chauffeur itinerary` | Submit Custom Inquiry |
| **Fleet** | `/fleet` | *Our Mercedes-Benz Fleet \| V-Class & Vito Luxury Minivans \| PETRANS* | Inspect our 100% Mercedes-Benz fleet in Salzburg. V-Class VIP & Vito Tourer, seating up to 8 passengers with 8 large suitcases, climate control & Wi-Fi. | `mercedes v class taxi salzburg`, `salzburg minivan fleet` | View Fleet Specs |
| **About** | `/about` | *About PETRANS Taxi & Tour Salzburg \| Licensed Chauffeurs & Story* | Meet Omer Farooq and the PETRANS chauffeur team. Fully licensed Austrian passenger transport, certified guides, 24/7 client care. | `about petrans salzburg`, `licensed taxi salzburg` | Read Our Story |
| **Reviews**| `/reviews` | *Client Reviews & Ratings \| PETRANS Taxi & Tour Salzburg* | Read verified passenger reviews from Google and international travelers. 4.9-star rated airport transfers and alpine sightseeing tours. | `petrans salzburg reviews`, `taxi salzburg testimonials` | Book With Confidence |
| **FAQ** | `/faq` | *Frequently Asked Questions \| Luggage, Waiting Time & Policies \| PETRANS* | Answers to common booking questions: 60-min airport waiting, luggage limits, child seats, free 24h cancellation, and payment methods. | `salzburg taxi faq`, `salzburg airport taxi waiting time` | Search Help Center |
| **Contact**| `/contact` | *Contact PETRANS Salzburg \| 24/7 WhatsApp, Phone & Office Location* | Reach Omer Farooq and the PETRANS dispatch team 24/7. Phone: +43 660 6416464, instant WhatsApp support, fast email response. | `contact petrans salzburg`, `petrans phone number` | Call / WhatsApp Us |
| **Legal** | `/impressum` | *Impressum & Legal Disclosure \| PETRANS Taxi & Tour Salzburg* | Official Austrian commercial disclosure according to § 5 ECG, § 14 UGB, and Gewerbeordnung (WKO passenger transport license). | `petrans impressum` | View Disclosure |
| **Legal** | `/privacy` | *Privacy Policy (DSGVO / GDPR) \| PETRANS Taxi & Tour Salzburg* | Learn how we protect customer personal data, booking information, and flight details under Austrian and EU GDPR regulations. | `petrans privacy policy` | Read Privacy Terms |
| **Legal** | `/terms` | *Terms & Conditions of Carriage \| PETRANS Salzburg* | Detailed terms covering 24h free cancellation, airport meet-and-greet waiting policies, payment terms, and vehicle carriage rules. | `petrans terms and conditions` | Read Terms of Carriage |

---

## 4. Page-by-Page Feature Specifications & Wireframes

### 4.1 Homepage Layout Architecture

The homepage is engineered for sub-second visual comprehension. Visitors immediately encounter an authoritative luxury aesthetic, instant price discovery, and one-click booking initiation.

#### Section Wireframe (ASCII Visual Blueprint):

```
+-----------------------------------------------------------------------------------+
| [TOP BAR]  Free 24h Cancellation | 60 Min Free Airport Waiting | Free Ski Gear    |
+-----------------------------------------------------------------------------------+
| [NAVBAR]   PETRANS Crest    Services v   Transfers v   Tours v   Fleet   FAQ   (DE|EN)|
|                             [+43 660 6416464]      [ BOOK NOW BUTTON (Gold) ]     |
+-----------------------------------------------------------------------------------+
| [HERO SECTION]                                                                    |
|  Alpine Panorama Background with Dark Vignette & Subtle Parallax                  |
|                                                                                   |
|  Pre-title:  PREMIUM AUSTRIAN CHAUFFEUR & PRIVATE TOURS                          |
|  Headline:   Travel Salzburg & The Alps in                                        |
|              Uncompromising Mercedes Luxury                                       |
|  Subhead:    Fixed-rate airport transfers, ski shuttles, and 8-hour day tours.    |
|              100% Mercedes V-Class & Vito Fleet • Up to 8 Passengers.             |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | [TABBED INSTANT BOOKING ENGINE]                                             |  |
|  | [ (•) One-Way Transfer ]  [ ( ) Return Trip ]  [ ( ) 8-Hour Day Tour ]      |  |
|  |-----------------------------------------------------------------------------|  |
|  | [ Pickup Location: SZG Airport / Address ]  [ Drop-off: Hallstatt / City ] |  |
|  | [ Date: 22 Nov 2026 ]  [ Time: 14:30 ]       [ Passengers: [ - 4 + ] ]      |  |
|  |-----------------------------------------------------------------------------|  |
|  | Estimated Distance: 73 km   •   Estimated Time: 1h 15m                      |  |
|  | Guaranteed Fixed Rate: €204.40 (VAT & Tolls Included)                        |  |
|  | [ CONTINUE TO VEHICLE SELECTION -> (Gold CTA) ]                             |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
|  [Trust Badges]: (★ 4.9 Google Rating) (WKO Licensed) (Snow-Trained Chauffeurs)  |
+-----------------------------------------------------------------------------------+
| [VALUE PILLARS - 4 Grid Cards]                                                    |
|  [1. Fixed Transparent Rates]    [2. 60-Min Airport Buffer]                       |
|  No metered surprises; VAT &     Flight tracking included; driver                 |
|  highway tolls 100% included.    waits inside arrival hall with nameboard.        |
|                                                                                   |
|  [3. 100% Mercedes-Benz Fleet]   [4. Free Ski & Child Equipment]                  |
|  V-Class & Vito VIP minivans;    Child booster seats and ski/snowboard            |
|  climate control & onboard Wi-Fi. bags transported at zero extra charge.          |
+-----------------------------------------------------------------------------------+
| [POPULAR TRANSFERS & ROUTES - 3 Column Cards with Postcard Photo & Price Badge]   |
|  +-----------------------+  +-----------------------+  +-----------------------+  |
|  | [Photo: Hallstatt]    |  | [Photo: Zell am See]  |  | [Photo: Munich MUC]   |  |
|  | Hallstatt Private     |  | Zell am See Ski Van   |  | Munich Airport MUC    |  |
|  | 73 km • 1h 15m        |  | 85 km • 1h 30m        |  | 175 km • 1h 50m       |  |
|  | Fixed: €204.40        |  | Fixed: €238.00        |  | Fixed: €490.00        |  |
|  | [ Book Transfer -> ]  |  | [ Book Transfer -> ]  |  | [ Book Transfer -> ]  |  |
|  +-----------------------+  +-----------------------+  +-----------------------+  |
+-----------------------------------------------------------------------------------+
| [EXCLUSIVE 8-HOUR PRIVATE DAY TOURS - Featured Showcase]                          |
|  Headline: Discover Austria at Your Own Pace — Flat €450 for up to 8 Guests       |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | [Left: Postcard Gallery]       | [Right: Tour Details & Highlights]         |  |
|  | Hallstatt & Lakes Tour (8h)   | • Stops: Fuschl am See (Red Bull HQ)       |  |
|  | 8-Seat Mercedes V-Class       | • St. Gilgen Mozart viewpoint & Bad Ischl  |  |
|  | Chauffeur Included            | • 4 Hours free exploration in Hallstatt    |  |
|  | Flat Price: €450.00           | • Up to 8 passengers (€56.25 / person!)    |  |
|  |                               | [ RESERVE THIS 8H TOUR NOW (Gold CTA) ]    |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
| [OUR DEDICATED FLEET - Side-by-Side Comparison]                                   |
|  +-----------------------------------+  +-----------------------------------+  |
|  | Mercedes-Benz V-Class (VIP)       |  | Mercedes-Benz Vito Tourer         |  |
|  | [High-Res Interior / Exterior]    |  | [High-Res Interior / Exterior]    |  |
|  | • 8 Passengers • 8 Large Bags     |  | • 8 Passengers • 8 Large Bags     |  |
|  | • Luxury Nappa Leather Seating    |  | • Generous Legroom & Cargo Space  |  |
|  | • Tri-Zone Climate Control        |  | • 4MATIC All-Wheel Drive          |  |
|  | • Executive Chauffeur Excellence  |  | • Ideal for Ski & Family Groups   |  |
|  | [ Select V-Class ]                |  | [ Select Vito ]                   |  |
|  +-----------------------------------+  +-----------------------------------+  |
+-----------------------------------------------------------------------------------+
| [HOW IT WORKS - 3 Simple Steps]                                                   |
|  ( 1. Enter Journey )  --->  ( 2. Select Vehicle & Extras )  ---> ( 3. Meet Chauffeur ) |
|  Instant quote with zero      Choose V-Class/Vito & free         Chauffeur greets you   |
|  hidden booking fees.         child/ski gear add-ons.            with digital nameboard.|
+-----------------------------------------------------------------------------------+
| [TESTIMONIALS & TRUST - Google Verified 4.9★ Carousel]                            |
|  "Omer was waiting for us at SZG arrival with our nameboard. Super clean V-Class, |
|  fit all 6 of our ski bags effortlessly. Best service in Salzburg!"              |
|  — Marcus S., London (Family Ski Trip to Zell am See)                             |
+-----------------------------------------------------------------------------------+
| [FOOTER - Multi-Column Luxury Navigation]                                         |
|  Col 1: Logo & Austrian WKO License • Col 2: Services • Col 3: Routes & Tours     |
|  Col 4: Contact & 24/7 WhatsApp Hotline (+43 660 6416464) • Legal & Payment Logos  |
+-----------------------------------------------------------------------------------+
```

---

### 4.2 Dedicated Route Landing Page Specification (e.g., `/transfers/salzburg-to-hallstatt`)

Each route landing page is engineered for programmatic SEO and high commercial conversion:

1. **Route Hero Banner:**
   - Background: Panoramic image of Hallstatt World Heritage viewpoint.
   - Route Title: `Salzburg to Hallstatt Private Transfer`
   - Route Stat Pills: `Distance: 73 km` | `Drive Time: ~1h 15m` | `Fixed Fare: €204.40` | `Fleet: Mercedes V-Class`
   - Pre-filled Quick Booking Widget: Origin set to *Salzburg Airport (SZG)*, Destination set to *Hallstatt Lahn / Center*.
2. **Key Route Highlights & Waypoints (Salzburg Cab Blueprint):**
   - Narrative of the journey passing Lake Fuschl, the Red Bull World Headquarters architecture, St. Gilgen panorama, and Bad Ischl imperial heritage.
   - Explains that the transfer is direct door-to-door with optional 15-minute scenic photo stops upon request.
3. **Transparent Price & Inclusions Table:**
   - Base fare: €204.40 (Calculated at verified €2.80/km for 73 km).
   - Inclusions list: 20% Austrian VAT, Austrian highway vignette toll, Lake tunnel transit, luggage assistance, free infant/booster seats.
4. **Vehicle Capacity & Luggage Clarity:**
   - Visual icon breakdown: 8 Passengers, 8 Large Suitcases, 4 Cabin Bags, Foldable Wheelchair.
5. **Frequently Asked Questions for this Route:**
   - *Can the driver pick us up at a Salzburg hotel instead of the airport?* (Yes, any address).
   - *Where does the driver drop us off in Hallstatt?* (Hallstatt is car-free; drop-off is at the official Hallstatt Lahn terminal or directly at your hotel shuttle point).
   - *What if our flight into Salzburg is delayed?* (60 minutes complimentary waiting from actual touchdown time).

---

### 4.3 Dedicated 8-Hour Day Tour Page Specification (e.g., `/tours/hallstatt-8-hour-private-tour`)

1. **Tour Overview & Commercial Hero:**
   - Headline: `Private 8-Hour Hallstatt & Salzkammergut Lakes Tour`
   - Pricing Hero: `Flat €450.00 per Vehicle` *(Accommodates up to 8 guests — only €56.25 per person!)*
   - Duration: `8 Hours Door-to-Door` | Overtime rate: `€50.00 / hour`
2. **Visual Itinerary Timeline (Mermaid Flow):**
   ```mermaid
   journey
     title 8-Hour Private Hallstatt Day Tour Itinerary
     section Morning: Salzburg Departure & Lakes
       Hotel Pickup in Salzburg (09:00): 5: Chauffeur
       Fuschl am See & Red Bull HQ Photo Stop: 4: Guest
       St. Gilgen & Wolfgangsee Panoramic Viewpoint: 5: Guest
       Bad Ischl Imperial Villa Drive-Through: 4: Chauffeur
     section Midday: Hallstatt World Heritage
       Arrival in Hallstatt Lahn (11:30): 5: Guest
       Free Time for Skywalk, Salt Mine & Old Town (4 Hours): 5: Guest
       Lakeside Lunch at Traditional Fish Restaurant: 4: Guest
     section Afternoon: Scenic Alpine Return
       Boarding Mercedes V-Class (15:30): 5: Chauffeur
       Scenic Drive via Gosau Lake & Dachstein Views: 5: Guest
       Arrival back at Salzburg Hotel (17:00): 5: Chauffeur
   ```
3. **What is Included vs. Excluded (Strict Client Guidance):**
   - **Included:** Private Mercedes-Benz V-Class or Vito minivan, professional licensed English/German-speaking chauffeur, all fuel, Austrian highway tolls, parking fees, hotel pickup & drop-off, flexible photo stops, complimentary onboard bottled water.
   - **NOT Included:** Entrance tickets (Hallstatt Salt Mine, Skywalk funicular, museums), guest meals and drinks, optional driver gratuity.

---

## 5. Multi-Step Booking Component UX (Step-by-Step Architecture)

The booking engine is the commercial engine of PETRANS. It synthesizes ExuroTrip's visual sophistication with Salzburg Cab's step-by-step logic.

```mermaid
flowchart LR
    Step1["Step 1: Ride Type & Route Details"]
    Step2["Step 2: Date, Time & Flight Info"]
    Step3["Step 3: Vehicle & Luggage Validation"]
    Step4["Step 4: Complimentary Add-ons"]
    Step5["Step 5: Contact & Payment Choice"]
    Step6["Step 6: Live Quote & Submission Modal"]

    Step1 --> Step2 --> Step3 --> Step4 --> Step5 --> Step6
```

---

### 5.1 Step 1: Ride Type & Route Details

```
+---------------------------------------------------------------------------------+
| STEP 1 OF 5: SELECT SERVICE & ROUTE                                             |
|                                                                                 |
| Service Mode:                                                                   |
| [ (•) One-Way Transfer ]   [ ( ) Return Trip ]   [ ( ) 8-Hour Private Day Tour] |
|                                                                                 |
| Pickup Location:                                                                |
| [ 📍 Salzburg Airport W. A. Mozart (SZG)                                    v ] |
| (Quick Chips: [SZG Airport] [Salzburg Hbf Train Stn] [Salzburg Old Town Hotel] )|
|                                                                                 |
| Drop-off Destination:                                                           |
| [ 🏁 Hallstatt Lahn Terminal, 4830 Hallstatt                                v ] |
| (Popular Chips: [Hallstatt] [Zell am See] [Munich Airport] [Innsbruck] )        |
|                                                                                 |
| Intermediate Stops / Waypoints (Optional):                                      |
| [ + Add Intermediate Stop (+€20 / stop) ]                                       |
|                                                                                 |
| [ Next: Date & Time Details -> ]                                                |
+---------------------------------------------------------------------------------+
```

- **UX Validation Rules:**
  - Origin and Destination inputs utilize Google Places API with strict bias to Austria (`country:at`) and southern Germany (`country:de`).
  - If Pickup Location contains "Airport" or "SZG", the system automatically flags Step 2 to require flight number details.
  - Interactive distance and duration calculation updates immediately in the background via Google Distance Matrix API.

---

### 5.2 Step 2: Date, Time & Flight Details

```
+---------------------------------------------------------------------------------+
| STEP 2 OF 5: DATE, TIME & FLIGHT MONITORING                                     |
|                                                                                 |
| Pickup Date:                      Pickup Time:                                  |
| [ 📅 22 November 2026       ]     [ ⏰ 14:30 (24h format)                 ]     |
| (Min date: Today)                 (Salzburg Local Time CET/CEST)                |
|                                                                                 |
| ✈️ AIRPORT PICKUP DETECTED: COMPLIMENTARY FLIGHT TRACKING INCLUDED              |
| Airline & Flight Number:                                                        |
| [ OS 265 (Austrian Airlines)                                                  ] |
| Helper: We track your flight in real-time. If delayed, your chauffeur's pickup  |
| time adjusts automatically with 60 minutes free waiting after actual landing!   |
|                                                                                 |
| [If Return Trip Selected]:                                                      |
| Return Date:                      Return Time:                                  |
| [ 📅 29 November 2026       ]     [ ⏰ 10:00                              ]     |
|                                                                                 |
| [ <- Back ]                             [ Next: Vehicle & Luggage -> ]          |
+---------------------------------------------------------------------------------+
```

---

### 5.3 Step 3: Vehicle Selection & Luggage/Passenger Limits

This step enforces strict mathematical validation to ensure client operating boundaries (max 8 passengers, max 8 large suitcases) are never violated without operational review.

```
+---------------------------------------------------------------------------------+
| STEP 3 OF 5: CHOOSE YOUR MERCEDES-BENZ VEHICLE                                  |
|                                                                                 |
| [ Card A: Mercedes-Benz V-Class (VIP Chauffeur) ]       [ Selected (•) ]        |
| - Capacity: Max 8 Passengers  •  Max 8 Large Suitcases                          |
| - Features: Premium Nappa Leather, Ambient Lighting, Climate Control, Wi-Fi     |
| - Fixed Route Fare: €204.40                                                     |
|                                                                                 |
| [ Card B: Mercedes-Benz Vito Tourer (Spacious Van) ]    [ Select ( ) ]          |
| - Capacity: Max 8 Passengers  •  Max 8 Large Suitcases                          |
| - Features: Extra-long wheelbase, 4MATIC all-wheel drive, ski-rack capable      |
| - Fixed Route Fare: €204.40                                                     |
|                                                                                 |
| ------------------------------------------------------------------------------- |
| PASSENGER & LUGGAGE COUNTERS (Strict Validation):                               |
|                                                                                 |
| Number of Passengers:             Large Suitcases (28" checked bags):           |
| [ - ]  4 Passengers  [ + ]        [ - ]  4 Suitcases  [ + ]                     |
| (Allowed: 1 to 8 pax)             (Allowed: 0 to 8 standard bags)               |
|                                                                                 |
| Hand Luggage / Cabin Bags:        Foldable Wheelchair:                          |
| [ - ]  4 Cabin Bags  [ + ]        [ [ ] Accommodate Foldable Wheelchair (Free) ]|
|                                                                                 |
| ⚠️ DYNAMIC CAPACITY WARNING (Triggered if Passengers > 8 or Luggage > 8):       |
| "You have selected 8+ passengers or oversized luggage. Our fleet can transport  |
| up to 8 persons with 8 standard bags per vehicle. For larger parties, our      |
| dispatch team will coordinate a secondary Mercedes minivan."                    |
|                                                                                 |
| [ <- Back ]                             [ Next: Complimentary Extras -> ]       |
+---------------------------------------------------------------------------------+
```

#### Detailed Luggage & Passenger Validation Matrix:

| Condition | Form State | UI Behavior & Notification |
| :--- | :--- | :--- |
| `Passengers <= 8 && Suitcases <= 8` | **VALID (Green)** | Normal flow; display "Fits comfortably in Mercedes V-Class / Vito". |
| `Passengers > 8` | **OVER-CAPACITY (Warning)** | Stepper caps at 8. Alert modal pops up: *"Austrian transport regulations limit vehicle occupancy to 8 passengers + driver. Would you like to request a 2nd Mercedes van for your group?"* |
| `Suitcases > 8` | **CARGO OVERLOAD (Warning)**| Amber badge displays: *"Oversized luggage configuration detected. Please specify dimensions in Special Requests so our dispatch can confirm trunk/roof capacity."* |
| `Wheelchair = True` | **VALID (Info)** | Automatic note applied: *"Foldable wheelchair accommodated free of charge. Consumes equivalent space of 2 large suitcases."* |

---

### 5.4 Step 4: Complimentary Add-ons & Travel Essentials

Reflecting the client's competitive advantage (*"Price and flexibility - child seats and ski equipment with no extra charges"*), all standard extras are clearly displayed as **€0.00 / Free Included**.

```
+---------------------------------------------------------------------------------+
| STEP 4 OF 5: COMPLIMENTARY EXTRAS & ADD-ONS                                     |
|                                                                                 |
| 👶 Child & Baby Seats (Free of Charge on Request):                              |
|   • Infant Safety Capsule (0–13 kg / 0–12 months):      [ - ]  0  [ + ]  (€0.00) |
|   • Toddler Car Seat (9–18 kg / 1–4 years):             [ - ]  1  [ + ]  (€0.00) |
|   • Child Booster Cushion (15–36 kg / 4–11 years):      [ - ]  1  [ + ]  (€0.00) |
|                                                                                 |
| ⛷️ Winter Sports Equipment (Free of Charge on Request):                         |
|   • Number of Ski / Snowboard Bag Sets:                 [ - ]  2  [ + ]  (€0.00) |
|                                                                                 |
| 🪧 Arrival Meet & Greet Name Board:                                             |
|   Name on Board: [ Dr. Hanzla Ahmad                             ]                |
|   (Chauffeur will display this on a digital tablet in the arrival hall)         |
|                                                                                 |
| 📝 Special Requests / Chauffeur Instructions:                                   |
|   [ Please provide room for 1 pair of child skis and bottled water.          ] |
|                                                                                 |
| [ <- Back ]                             [ Next: Contact & Payment -> ]          |
+---------------------------------------------------------------------------------+
```

---

### 5.5 Step 5: Customer Contact & Payment Preference

```
+---------------------------------------------------------------------------------+
| STEP 5 OF 5: CONTACT INFORMATION & PAYMENT CHOICE                               |
|                                                                                 |
| First Name:                       Last Name:                                    |
| [ Hanzla                        ] [ Ahmad                                 ]     |
|                                                                                 |
| Email Address (for confirmation): Mobile Phone (with Country Code):             |
| [ hanzla@example.com            ] [ 🇦🇹 +43 660 1234567                   ]     |
|                                   (WhatsApp enabled [✓] )                       |
|                                                                                 |
| CHOOSE YOUR PAYMENT PREFERENCE:                                                 |
|                                                                                 |
| [ (•) Pay to Driver on Board (Recommended for Flexibility) ]                    |
|       Pay cash (EUR) or credit/debit card directly to your chauffeur upon       |
|       arrival. No upfront payment required today.                               |
|                                                                                 |
| [ ( ) Prepay Online Securely via Credit Card / Apple Pay ]                      |
|       Instant 256-bit encrypted card processing via Stripe. Digital invoice     |
|       emailed immediately.                                                      |
|                                                                                 |
| Terms & Cancellation Agreement:                                                 |
| [✓] I agree to the Terms of Carriage and acknowledge the Free Cancellation     |
|     policy up to 24 hours prior to scheduled pickup time.                       |
|                                                                                 |
| [ <- Back ]                             [ REVIEW & CONFIRM BOOKING -> ]         |
+---------------------------------------------------------------------------------+
```

---

### 5.6 Step 6: Instant Quote Summary & Submission Modal

Upon clicking "Review & Confirm Booking", a modal displays the complete itinerary and the transparent fixed price before triggering the submission webhook.

```
+---------------------------------------------------------------------------------+
| 📋 TRIP SUMMARY & INSTANT FIXED QUOTE                                           |
|                                                                                 |
| Route:        Salzburg Airport (SZG) -> Hallstatt Lahn Terminal (73 km)         |
| Date & Time:  Saturday, 22 Nov 2026 at 14:30 CET                                |
| Flight:       OS 265 (Complimentary 60-min landing monitoring included)          |
| Vehicle:      Mercedes-Benz V-Class Chauffeur Minivan                           |
| Party Size:   4 Passengers  •  4 Suitcases  •  2 Ski Sets (Free)                |
| Extras:       1 Toddler Seat (Free), 1 Booster Seat (Free)                      |
| Payment:      Pay Chauffeur on Board (Cash or Card)                             |
|                                                                                 |
| FARE CALCULATION BREAKDOWN:                                                     |
|   Base Route Distance (73 km @ €2.80/km):                       €204.40         |
|   Intermediate Stops:                                             €0.00         |
|   Child Seats & Ski Equipment:                                    €0.00 (FREE)  |
|   Austrian Highway Vignette & Lake Tolls:                     INCLUDED          |
|   20% Austrian VAT (€34.07):                                  INCLUDED          |
|   ---------------------------------------------------------------------         |
|   TOTAL GUARANTEED FIXED FARE:                                  €204.40         |
|                                                                                 |
| [ SUBMIT BOOKING REQUEST (Gold CTA) ]                                           |
|                                                                                 |
| 🔒 Free cancellation up to 24 hours before pickup. No credit card required.     |
+---------------------------------------------------------------------------------+
```

#### Booking Submission Modal (Success Screen):
When submitted, the modal shifts to a high-trust confirmation screen:
1. **Reference Number:** `#PET-2026-8841`
2. **Status Indicator:** `Pending Chauffeur Confirmation` (Yellow Badge).
3. **What Happens Next Timeline:**
   - *Step 1:* Confirmation email with complete itinerary dispatched to customer email.
   - *Step 2:* Owner Omer Farooq reviews the booking schedule and assigns the primary Mercedes vehicle.
   - *Step 3:* Final confirmation and chauffeur WhatsApp contact sent within 2 hours.
4. **Emergency Contact Card:** Direct WhatsApp and phone call buttons to Omer Farooq (`+43 660 6416464`).

---

## 6. Mobile-First UX, Responsiveness & Micro-Widgets

### 6.1 Responsive Viewport Breakpoints
The layout adheres strictly to standard mobile-first breakpoints configured in Tailwind CSS:
- **Mobile Small (`< 380px`):** Single column, stacked inputs, compact typography (`text-sm`), full-width buttons.
- **Mobile Standard (`380px – 640px`):** Single column, full-width tap targets, sticky bottom action bar.
- **Tablet / iPad (`641px – 1024px`):** Two-column card grids, condensed stepper navigation.
- **Desktop / Laptop (`> 1024px`):** Multi-column navigation, side-by-side booking container with live quote summary sidebar.

---

### 6.2 Sticky Quick-Booking Bottom Bar (Mobile)

On mobile viewports (`< 768px`), as the user scrolls past the hero section, a high-converting sticky bottom widget slides up with smooth spring physics (`transform: translateY(0)`):

```
+-----------------------------------------------------------------------------------+
| [⚡ Quick Transfer Quote]  SZG Airport -> City from €45    [ BOOK RIDE (Gold) ]   |
+-----------------------------------------------------------------------------------+
```

- **Interaction:**
  - Tapping **"Book Ride"** opens a smooth native bottom-sheet drawer containing the 5-step booking component.
  - Tapping outside or swiping down smoothly minimizes the drawer back into the bottom bar.
  - Keeps conversion accessibility permanently within thumb reach on 100% of mobile pages.

---

### 6.3 Floating 24/7 WhatsApp & Phone Action Buttons

Positioned at `fixed bottom-6 right-6 z-50`, a floating luxury contact group provides instant human reassurance:

```
          [ (Phone) +43 660 6416464 ]   (Hidden on mobile, expands on hover)
               |
         [ 🟢 WhatsApp 24/7 ]           (Pulsing gold ring animation)
```

- **WhatsApp Action:** One-tap redirect directly to WhatsApp API:
  `https://wa.me/436606416464?text=Hello%20PETRANS,%20I%20would%20like%20to%20inquire%20about%20a%20private%20transfer/tour`
- **Phone Action:** Mobile-friendly click-to-call link `tel:+436606416464`.
- **Accessibility:** Labeled with `aria-label="Contact Omer Farooq on WhatsApp 24/7"`.

---

## 7. Accessibility, Performance & Technical Handoff Standards

### 7.1 WCAG 2.1 AA Compliance Checklist
1. **Color Contrast Ratios:**
   - Body text (`#F8FAFC`) on dark slate (`#0B0F19`): **16.8:1** (Exceeds 4.5:1 requirement).
   - Champagne Gold (`#C5A059`) text on dark slate: **6.1:1** (Fully AA compliant).
   - Dark obsidian text (`#0B0F19`) on Gold CTA button (`#C5A059`): **6.2:1** (Fully AA compliant).
2. **Keyboard Navigation & Focus Management:**
   - All interactive controls feature visible 2px gold focus rings (`focus-visible:ring-2 focus-visible:ring-[#C5A059]`).
   - Modal dialogs trap focus and close on `Escape` key.
3. **Form Accessibility & Error States:**
   - Explicit `<label>` elements tied via `htmlFor` to every form input.
   - ARIA live regions (`aria-live="polite"`) used for dynamic price recalculation and luggage warning alerts.

---

### 7.2 Design Tokens Export for Technical Engineering (`tailwind.config.ts`)

```typescript
// Tailwind CSS Design System Tokens for PETRANS Taxi & Tour Salzburg
export const petransTheme = {
  colors: {
    brand: {
      slate: {
        900: '#0B0F19', // Primary Background
        800: '#161F30', // Surface Card Background
        700: '#1E293B', // Elevated Surface
        600: '#334155', // Card Border Line
      },
      gold: {
        light: '#E5C378', // Highlight Bronze
        DEFAULT: '#C5A059', // Primary Warm Champagne Gold
        hover: '#D4AF37', // Metallic Hover
        subtle: 'rgba(197, 160, 89, 0.12)', // Badge background
      },
      snow: '#F8FAFC', // Pure Light Text
      muted: '#94A3B8', // Secondary Text
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
    }
  },
  fontFamily: {
    display: ['Cinzel', 'Outfit', 'serif'],
    sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
    mono: ['Space Grotesk', 'monospace'],
  },
  boxShadow: {
    luxury: '0 10px 30px -10px rgba(0, 0, 0, 0.6)',
    goldGlow: '0 0 20px -3px rgba(197, 160, 89, 0.35)',
  },
  borderRadius: {
    card: '1rem', // 16px
    btn: '0.625rem', // 10px
  }
};
```

---

## 8. Summary of Key Design Decisions

1. **Brand Identity:** Adopted **Alpine Midnight Slate (`#0B0F19`) + Warm Champagne Gold (`#C5A059`)**, elevating PETRANS from a conventional yellow-and-black local cab to an executive alpine chauffeur matching ExuroTrip.
2. **Pricing Safeguard UX:** Integrated a **Minimum Base Fare Floor (€45)** into the booking component for short-distance airport and city trips, preventing unprofitable €15 rides for the Mercedes V-Class fleet.
3. **Capacity Validation Engine:** Implemented strict real-time UI counters preventing bookings exceeding 8 passengers or 8 suitcases without dispatch notification.
4. **Transparent "Free Add-ons" Strategy:** Placed "Free Child Seats" and "Free Ski Equipment" prominently inside Step 4 with €0.00 indicators to drive conversion over competitors who charge €10–€20 per item.
5. **Programmatic SEO Structure:** Specified 25+ dedicated landing page slugs across airport transfers, regional ski routes, and 8-hour day tours with rich waypoint storytelling.
6. **Mobile Dominance:** Engineered a sticky quick-quote bottom bar and floating 24/7 WhatsApp emergency channel ensuring zero friction for travelers on mobile devices.
