# PETRANS Taxi & Tour Salzburg

> Premium Mercedes-Benz Airport Transfers, Ski Shuttles, and 8-Hour Private Alpine Day Tours in Salzburg, Austria.

**Project Founder & Decision Maker:** Hanzla Ahmad  
**Operator:** Omer Farooq (+43 660 6416464, `farooqcheema64164@gmail.com`)  
**Repository:** [https://github.com/hanzlaahmadcheema/petrans-salzburg-preview](https://github.com/hanzlaahmadcheema/petrans-salzburg-preview)  

---

## 1. Overview & ExuroTrip Design System

PETRANS is engineered to benchmark European luxury chauffeur services (such as [ExuroTrip](https://exurotrip.com/)) while preserving Salzburg's alpine heritage and strictly enforcing Austrian commercial passenger transport standards (*WKO Gewerbeberechtigung*):

- **Quiet Luxury Dark Palette:** `#0B0F19` (Alpine Midnight Slate), `#161F30` (Frosted Card Surface), `#1E293B` (Elevated Wells), accented with `#CAA328` / `#C5A059` (Polished Champagne Gold).
- **Typography:** `Outfit` (contemporary geometric headings) + `Plus Jakarta Sans` (crystalline body and booking form UI) + `Cinzel` (brand crest) + `Space Grotesk` (tabular fares).
- **Iconify Integration:** Universal adoption of Iconify (`https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js`) using the `lucide:` collection with consistent 2px stroke and optical centering.
- **100% Zero Emojis:** Strictly emoji-free interface with typographic ISO language codes (`EN — English`, `DE — Deutsch`, `HI — हिन्दी`, `UR — اردو`).
- **Hero Salzburg Cityscape:** Features high-resolution Salzburg panorama with a multi-stop dark luxury gradient overlay scrim (`linear-gradient(180deg, rgba(11,15,25,0.75) 0%, rgba(11,15,25,0.85) 50%, #0B0F19 100%)`) with focal crop at `center 38%` guaranteeing WCAG AAA readability.
- **ExuroTrip 4-Pillar Trust Strip:**
  1. Flight Delay Monitoring (60 min complimentary airport waiting)
  2. Fixed Distance Fares (€2.80/km + €45 minimum base floor, tolls & VAT included)
  3. Licensed Austrian Chauffeurs (WKO Gewerbeberechtigung, alpine snow certified)
  4. Free Equipment Transport (€0 Child & Ski Gear)
- **3D Transparent Fleet Showcase:** High-end 3D PNG renders of Mercedes-Benz V-Class (Obsidian Dark Slate) and Vito Tourer (Brilliant Silver) presented on 16:9 podium containers with ambient radial ground shadow illumination and 6-point technical specification grids.
- **Mobile-First Touch Ergonomics:** Enforced $\ge 44 \times 44\text{px}$ touch targets on all buttons, quick chips, and counter steppers; 16px font sizes on form inputs preventing iOS Safari auto-zoom; mobile slide-over drawer navigation with hamburger toggle; and dynamic compact step counter for the 6-step booking flow.

---

## 2. Directory Structure

```
PETRANS/
├── GOVERNANCE.md            # Commercial and operational decision governance
├── README.md                # Project documentation and setup guide
├── architecture/            # Architecture specifications and technical blueprints
├── audit/                   # Independent compliance and phase audit reports
├── automation/              # Operational runbooks and notification pipelines
├── design/                  # UI/UX Design Compliance & ExuroTrip Design System specs
├── docs/                    # Master kickoff reports and executive summaries
├── research/                # Media asset sourcing and benchmark analysis reports
└── website/                 # Node.js Express full-stack web application
    ├── package.json         # Server dependencies (Express, CORS)
    ├── server.js            # Express application entry point (port 3000)
    └── public/              # Static frontend assets served by Express
        ├── index.html       # Single-page application markup (WCAG AAA compliant)
        ├── style.css        # Luxury alpine design tokens and mobile ergonomics
        ├── app.js           # Interactive fare engine, booking stepper & AI chat
        └── images/          # Mobile-optimized photographic and 3D vehicle assets
            ├── salzburg-hero.jpg
            ├── salzburg-hero-mobile.jpg
            ├── salzburg-hero.webp
            ├── mercedes-v-class.png
            ├── mercedes-v-class.webp
            ├── mercedes-vito.png
            └── mercedes-vito.webp
```

---

## 3. Local Development & Server Verification

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Execution
```bash
cd website
npm install
npm start # or node server.js
```

### Healthcheck Endpoints
- **Web Portal:** `http://localhost:3000`
- **System Health:** `http://localhost:3000/api/health` (Returns `HTTP 200 OK`)
- **Booking Dispatch API:** `POST http://localhost:3000/api/bookings`
- **AI Concierge API:** `POST http://localhost:3000/api/chat`

---

## 4. Git & Source Control Guidelines

- Author and committer identity is strictly enforced as Founder Hanzla Ahmad (`Hanzla Ahmad <hanzlaahmad100@gmail.com>`).
- No bots or AI co-author trailers are permitted in the commit history.
- Milestone commits reflect verified implementation states.
