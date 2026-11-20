# PETRANS Taxi & Tour Salzburg — Requirements Analysis & Baseline Specification

**Date:** 20 November 2026  
**Document Owner:** Chief (Project Director)  
**Status:** Baseline Approved for Phase 1 Delegation  
**Primary Source:** Omer Farooq Client Questionnaire (`Omer_Farooq_requirements_questionnaire_9_0zpf.pdf`) & Kickoff Brief

---

## 1. Client & Business Profile

- **Client Name:** Omer Farooq (CEO)
- **Company Name:** PETRANS Taxi & Tour Salzburg
- **Location:** Salzburg, Austria
- **Phone / WhatsApp:** +43 660 6416464, +43 660 6464164
- **Private Email:** farooqcheema64164@gmail.com
- **Company Email:** Pending creation ("currently not to made, give you later")
- **Target Launch Date:** 30 November 2026
- **Starting Budget Acceptance:** €300 starting price left unanswered in questionnaire (Requires validation).

---

## 2. Confirmed Core Requirements

### 2.1 Services & Destinations
- **Services:**
  1. Airport Transfers (Salzburg Airport W. A. Mozart - SZG)
  2. City Taxi
  3. Train Station Transfers (Salzburg Hauptbahnhof)
  4. Intercity Transfers
  5. Ski Transfers
  6. Private Tours / Day Trips
  7. Corporate & Chauffeur Services
- **Primary Routes / Destinations:**
  - Hallstatt
  - Zell am See / Kaprun
  - Innsbruck
  - Munich (including Munich Airport MUC)
  - Vienna (including Vienna Airport VIE)
  - Prague
  - Eagles Nest (Kehlsteinhaus) + Königsee (Bavaria, Germany)
- **Dedicated Day Tours (Quoted at Flat €450 for 8 hours):**
  - Hallstatt Tour (8 hours)
  - Eagles Nest & Berchtesgaden
  - Werfen Ice Caves (Eisriesenwelt)
  - Zell am See / Kaprun Alpine Tour
  - Innsbruck & Tyrol
  - Swarovski Crystal Worlds (Wattens)
  - Bad Gastein / Bad Hofgastein Thermal & Alpine Tour
- **Tour Rules:**
  - Extra hours charged at flat €50/hour.
  - Intermediate stops included.
  - Driver included. Entry tickets and meals are explicitly excluded.

### 2.2 Fleet Specifications
- **Vehicles:** Mercedes-Benz V-Class, Mercedes-Benz Vito.
- **Capacity:** Up to 8 passengers, up to 8 standard large suitcases.
- **Oversized / Extra Luggage:** Customer must notify company in advance via booking form.
- **Child / Booster Seats:** Included free of charge on request.
- **Ski & Snowboard Equipment:** Transported free of charge on request.
- **Wheelchair Accessibility:** Indicated as "Yes" (Foldable wheelchair accommodation confirmed; mechanical lift/ramp status to be clarified).
- **Fleet Photos:** Client has actual fleet photos available for use on the website.

### 2.3 Pricing Framework
- **Model:** Fixed prices per route, not metered fares.
- **Out-of-City Transfers:** Calculated at **€2.80 per kilometer**.
- **Inclusions:** 20% Austrian VAT, Austrian/German highway tolls (Vignette), and tunnel fees included in the upfront displayed price.
- **Extra Charges:** Additional intermediate stops and waiting time beyond policy limits incur extra charges.
- **Currency:** EUR exclusively.

### 2.4 Booking Flow & Policies
- **Mandatory Form Fields:**
  - Pickup Location (Address / Airport / Train Station / Hotel)
  - Drop-off Destination
  - Date & Pickup Time
  - Number of Passengers (1–8)
  - Luggage Count (Standard Bags & Large Bags)
  - Flight Number (mandatory for airport pickups)
  - Return Journey toggle & details
  - Child / Booster Seat selection count
  - Ski / Snowboard Equipment indicator
  - Special Requests / Notes
- **Instant Calculator:** Display fixed fare estimate before final submission.
- **Payment Options:** Customer choice between Online Payment (Card) and Pay to Driver (Cash or Card on board).
- **Cancellation Policy:** Free cancellation up to 24 hours prior to scheduled pickup time.
- **Airport Waiting Policy:** 60 minutes complimentary waiting time starting from actual flight landing time.
- **Hotel / City Waiting Policy:** 10 minutes complimentary waiting time.
- **Airport Meeting Point:** Salzburg Airport Arrival Hall, driver holding digital/printed Name Board.
- **Confirmation Workflow:** Automatic email notifications sent to both customer and owner. Bookings are initially marked as **Pending Owner Confirmation** (owner manages via email/phone).

### 2.5 Design & UI/UX Directives
- **Look & Feel:** High-end, premium tourism aesthetic inspired by **exurotrip.com** (typography, rich color palette, clean modern booking component) blended with the clear, structured informational depth of **salzburgcab.com** (concise destination highlights, historical context, clear distance/duration data).
- **Language:** English at launch.
- **SEO Architecture:** Dedicated landing pages for every individual route and day tour to capture high-intent Google search traffic.
- **Direct Contact:** Prominent 24/7 WhatsApp floating button, click-to-call phone links, and contact forms.

### 2.6 AI Customer Support Assistant
- **Deployment Channels:** Website Live Chat widget and Email auto-responder. **No WhatsApp AI automation.**
- **Authorized Capabilities:**
  - Answering FAQs on services, routes, fleet, meeting points, baggage, and policies.
  - Calculating fixed route quotes using verified pricing engine rules.
  - Collecting booking intake details for owner confirmation.
  - Collecting booking modification and cancellation requests.
  - Explaining Salzburg Airport meeting procedures.
  - Tracking flight delays and providing flight status updates when backed by live flight data.
  - Collecting customer feedback, complaints, and lost-and-found reports.
  - Multilingual interaction in English, German, Hindi, and Urdu (Punjabi as driver spoken language).
- **Strict Guardrails & Prohibitions:**
  - **NEVER** issue refunds or promise financial compensation.
  - **NEVER** negotiate prices or apply unauthorized discounts.
  - **NEVER** independently modify approved rate cards.
  - **NEVER** auto-confirm bookings without verified availability or owner approval.
  - Immediate escalation of contentious complaints or ambiguous requests to Omer Farooq (+43 660 6416464 / farooqcheema64164@gmail.com).

---

## 3. Contradictions & Ambiguities to Resolve

1. **Tour Customization Contradiction:**
   - *Section 2, Q5:* "Do you offer customised day trips? Answer: No."
   - *Section 7, Q1:* "Customised Day Trip" is checked as one of the tour offerings.
   - *Working Assumption for Phase 1:* The website will feature standard fixed-itinerary day tours with an optional "Custom Tour Inquiry" form that routes directly to the owner for manual quotation.
2. **AI Operating Hours Contradiction:**
   - *Section 10, Q1:* "Do you want an AI assistant? Answer: Yes — 24/7."
   - *Section 10, Q7:* "When should the AI work? Answer: Only when you are busy — please specify the hours below (unspecified)."
   - *Working Assumption for Phase 1:* 24/7 AI availability on the website live chat, with automatic escalation and instant notification forwarding to the owner via WhatsApp and email.
3. **Tour Inclusions Syntax:**
   - *Section 7, Q2:* "Private driver, entry fees, meal is not included."
   - *Clarification Needed:* Whether "entry fees" are included or excluded. Working assumption: Private driver is included; entrance tickets to attractions (e.g. Werfen Ice Caves, Swarovski, Eagles Nest elevator) and guest meals are excluded unless booked as an add-on.
4. **In-City & Short Distance Transfer Pricing:**
   - Client specified €2.80/km for transfers outside the city. In-city minimum fare or standard flat rates (e.g., Airport to City Center, Train Station to Old Town) are not defined.
   - *Working Assumption:* Benchmark against Salzburg Cab and local taxi regulations; establish a minimum base fare (e.g., €35 - €45 for city/airport transfers) to prevent uneconomic short trips.

---

## 4. Key Missing Information & Dependencies

| Item | Impact | Mitigation / Working Assumption |
| :--- | :--- | :--- |
| **Official Domain Name** | Critical for deployment & email setup | Recommend options: `petrans-salzburg.at`, `petrans.at`, `petrans-transfers.com` |
| **Payment Gateway Account** | Required for online card processing | Design modular checkout supporting Stripe / PayPal with toggle for "Pay to Driver" |
| **Flight Tracking API** | Flight delay adjustment | Select AviationStack or FlightAware API with free/low-cost tier |
| **Tour High-Resolution Imagery** | Client has fleet photos but no tour photos | Curate high-quality licensed / Unsplash Salzburg & Alpine tourism media |
| **Company Legal Impressum** | Austrian legal compliance (WKO / ECG) | Draft compliant template requiring client's official WKO registration number and tax ID |
