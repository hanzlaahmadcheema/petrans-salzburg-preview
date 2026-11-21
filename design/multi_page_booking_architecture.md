# PETRANS Taxi & Tour Salzburg — Multi-Stage Page-by-Page Booking Structure & Workflow Specification
**Document ID:** `SPEC-PET-2026-BOOK-001`  
**Task Reference:** `TSK-PET-023` (Multi-Stage Page-by-Page Booking Structure & Workflow Specification)  
**Author:** UI/UX Design Specialist (`agent-71f645ad-ba24-419e-bdff-ee05809a4b0e`)  
**Project Owner / Decision Maker:** Hanzla Ahmad  
**Client / Operator:** Omer Farooq (+43 660 6416464, `farooqcheema64164@gmail.com`)  
**Target Codebase:** `/home/hanzlaahmad/OpenBot/Shared/PETRANS/website/`  
**Status:** Approved Architectural Specification & Engineering Directives  
**Date:** November 21, 2026  

---

## 1. Executive Summary & Architecture Vision

### 1.1 Rationale: Moving Beyond Single-Page Constraints
A high-ticket, private executive chauffeur and alpine tour service in Salzburg requires an effortless, reassuring, and transparent booking experience. Forcing a luxury booking journey into a cramped, monolithic single-page form introduces cognitive fatigue, increases form abandonment on mobile devices, and obscures critical decision points such as vehicle amenities, luggage limits, and legal cancellation terms.

This specification redesigns the PETRANS booking engine into a **modular, multi-stage, page-by-page customer journey**. Each stage is focused on a singular cognitive objective, supports dynamic entry points across the website, provides frictionless backward and forward navigation with full state preservation, and enables comprehensive in-line editing at the final review step.

```
+---------------------------------------------------------------------------------------------------+
|                                  SHARED BOOKING ENGINE ENTRY POINTS                                |
+-----------------------------------+-----------------------------------+---------------------------+
|          [ENTRY POINT 1]          |          [ENTRY POINT 2]          |      [ENTRY POINT 3]      |
|           Book by Car             |           Book by Tour            |       Book by Place       |
|    Homepage Fleet Card CTA        |      Tour Card / Detail CTA       |   Hero Quick Fare Engine  |
|   (Pre-selects E/V/Vito Class)    |    (Pre-selects 8h Day Tour)      | (Pre-selects Pickup/Drop) |
+-----------------------------------+-----------------------------------+---------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                 6-STAGE PROGRESSIVE BOOKING JOURNEY                               |
|                                                                                                   |
|  [STAGE 1]  ----->  [STAGE 2]  ----->  [STAGE 3]  ----->  [STAGE 4]  ----->  [STAGE 5]  -----> [STAGE 6] |
|   Journey            Vehicle            Trip Options       Customer           Final Review       Pending  |
|   Details            Selection          & Free Extras      Details            & In-Line Edit     Confirm  |
+---------------------------------------------------------------------------------------------------+
```

### 1.2 Core Architectural Principles
1. **Unified Shared Engine:** Multiple visual entry points on the website funnel into a single, cohesive booking engine. There is zero duplicate pricing or validation logic.
2. **Unlocked Selections (Zero Lock-In):** Pre-selected choices (such as clicking a vehicle or a tour) never trap the customer. Every parameter can be modified at any point in the flow, including directly inside the final review screen.
3. **Dynamic Real-Time Recalculation:** Any selection modification that affects pricing instantly updates the gross fare, net fare, and Austrian VAT breakdown across the entire application state.
4. **Safety & Confirmation Decoupling:** In compliance with Austrian commercial transport regulations (*Gewerbeberechtigung* and *FAGG § 8*), booking submission is strictly decoupled from payment capture. Bookings are submitted as `PENDING OWNER CONFIRMATION` and are verified by operator Omer Farooq before any financial transaction occurs.
5. **Rigorous Mobile Ergonomics:** Strict adherence to mobile-first constraints: minimum $44 \times 44\text{px}$ touch targets, $16\text{px}$ input font sizes (stopping iOS Safari viewport auto-zoom), zero horizontal scroll across 360px–428px devices, and native browser history integration.

---

## 2. Multiple Entry Point Integration (Shared Booking Engine)

The website features three distinct high-intent customer entry points that direct users into the shared booking flow. Each entry point hydrates the initial state payload while preserving the customer's freedom to change their choices.

```
                                    +-----------------------+
                                    | Website Entry Points  |
                                    +-----------------------+
                                                |
               +--------------------------------+--------------------------------+
               |                                |                                |
               v                                v                                v
    +----------------------+         +----------------------+         +----------------------+
    |    1. Book by Car    |         |    2. Book by Tour   |         |   3. Book by Place   |
    | Fleet Cards on Home  |         | Tour Cards & Details |         | Hero Fare Calculator |
    |  - Select E-Class    |         |  - Hallstatt (€450)  |         |  - Pickup: SZG       |
    |  - Select V-Class    |         |  - Eagle's Nest (€450|         |  - Dropoff: Zell     |
    |  - Select Vito       |         |  - Innsbruck (€650)  |         |  - Service: ONE_WAY  |
    +----------------------+         +----------------------+         +----------------------+
               |                                |                                |
               v                                v                                v
       URL Param Scheme:                URL Param Scheme:                URL Param Scheme:
     /book?vehicle=E_CLASS            /book?service=TOUR               /book?origin=SZG
       &entry=fleet                     &tour=hallstatt&entry=tour       &dest=zell-am-see
               |                                |                                |
               +--------------------------------+--------------------------------+
                                                |
                                                v
                               +---------------------------------+
                               |    Shared App State Hydration   |
                               |  - Validates query params       |
                               |  - Prepopulates state payload   |
                               |  - Launches focused Stage 1     |
                               +---------------------------------+
```

### 2.1 Entry Point 1: Book by Car (Fleet Cards)
- **User Context:** The user is exploring the fleet showcase section (`#fleet`) or vehicle detail modals and is drawn to a specific vehicle class (e.g. executive solo traveler selecting the E-Class sedan, or a family selecting the V-Class VIP minivan).
- **CTA Buttons:** `Select E-Class`, `Select V-Class`, `Select Vito`.
- **Pre-Population Behavior:**
  - `appState.vehicleCategory` is immediately set to the selected vehicle (`E_CLASS`, `V_CLASS`, or `VITO`).
  - Passenger and luggage limits are set to the vehicle's default baseline.
  - The booking wizard scrolls smoothly or navigates to the booking view, displaying an affirmative banner:  
    *`Vehicle Pre-selected: Mercedes-Benz E-Class Sedan (€2.50/km). You can change this at any time.`*
  - The flow starts at **Stage 1 (Journey Details)** so the customer can enter their pickup and drop-off points. When they reach Stage 2 (Vehicle Selection), their chosen car is already highlighted.

### 2.2 Entry Point 2: Book by Tour (Sightseeing Showcases)
- **User Context:** The user is browsing 8-hour alpine excursions (`#tours`) and clicks on an itinerary (e.g., Hallstatt, Eagle's Nest, or Innsbruck).
- **CTA Buttons:** `Book Hallstatt Tour`, `Reserve 8-Hour Tour`.
- **Pre-Population Behavior:**
  - `appState.serviceType` is automatically switched to `'TOUR'`.
  - `appState.tourKey` is set to the selected itinerary (`hallstatt`, `eagles-nest`, `innsbruck`, etc.).
  - `appState.tourHours` defaults to `8`.
  - The fare is immediately locked to the approved fixed tour rate (€450 regional or €650 Innsbruck).
  - The booking flow opens directly at **Stage 1 (Journey Details)** with the Tour tab selected, allowing the user to customize their pickup hotel, preferred departure time, and stops.

### 2.3 Entry Point 3: Book by Place / Route (Hero Instant Calculator)
- **User Context:** The user uses the homepage hero calculator above the fold to get an instant estimate (e.g., Salzburg Airport to Zell am See, Return Trip, 4 passengers).
- **CTA Button:** `Continue to Booking Wizard →`.
- **Pre-Population Behavior:**
  - `appState.serviceType` ('ONE_WAY', 'RETURN', 'TOUR'), `pickupAddress`, `dropoffAddress`, `distanceKm`, `passengerCount`, and `largeLuggageCount` are transferred into the booking state.
  - The preliminary fare calculated in the hero is validated against the active rate engine.
  - The flow opens at **Stage 1 (Journey Details)** with all location and service fields pre-filled, allowing the user to simply verify their route and click `Continue to Vehicle Selection`.

### 2.4 State Hydration & URL Parameter Convention
To allow external links, email marketing, and deep-linking, the shared engine parses incoming URL query parameters on initial page load:

| Parameter Key | Permitted Values | Example | Target State Property |
| :--- | :--- | :--- | :--- |
| `entry` | `fleet`, `tour`, `calc`, `direct` | `?entry=fleet` | `appState.entrySource` |
| `vehicle` | `E_CLASS`, `V_CLASS`, `VITO` | `?vehicle=E_CLASS` | `appState.vehicleCategory` |
| `service` | `ONE_WAY`, `RETURN`, `TOUR` | `?service=RETURN` | `appState.serviceType` |
| `tour` | `hallstatt`, `eagles-nest`, `zell-am-see`, `innsbruck`, `werfen`, `bad-gastein` | `?tour=hallstatt` | `appState.tourKey` |
| `origin` | Address string or predefined key (`salzburg-airport`, `salzburg-hbf`, `hotel`) | `?origin=salzburg-airport` | `appState.pickupAddress` |
| `dest` | Destination string or predefined key | `?dest=hallstatt` | `appState.dropoffAddress` |
| `pax` | Integer `1` to `8` | `?pax=3` | `appState.passengerCount` |
| `bags` | Integer `0` to `8` | `?bags=2` | `appState.largeLuggageCount` |

---

## 3. Page-by-Page Booking Journey Architecture

The booking flow is structured into **6 clear, dedicated stages**. Every stage possesses a singular cognitive purpose, clear validation, and bidirectional state synchronization.

```
+---------------------------------------------------------------------------------------------------+
|                                  6-STAGE PROGRESSION OVERVIEW                                     |
+---------+--------------------------+-----------------------------------+--------------------------+
| Stage # | Stage Name               | Core User Goal                    | Primary Output / Payload |
+---------+--------------------------+-----------------------------------+--------------------------+
| Stage 1 | Journey Details & Route  | Define where, when, and how       | Route, Date, Time, Flight|
| Stage 2 | Vehicle Selection        | Choose optimal car & check caps   | Vehicle Class & Base Fare|
| Stage 3 | Options & Free Extras    | Select child seats, ski bags, etc.| Included Amenities List  |
| Stage 4 | Customer Contact         | Provide passenger contact details | Verified Contact Record  |
| Stage 5 | Final Review & In-Line   | Inspect entire trip & live-edit   | Approved Reservation     |
| Stage 6 | Confirmation & Status    | Receive reference & owner status  | Confirmed Pending Request|
+---------+--------------------------+-----------------------------------+--------------------------+
```

---

### 3.1 Stage 1: Journey Details & Route Selection

#### 1. Purpose & User Goal
Establish the physical and temporal coordinates of the journey: transfer type (One-Way, Return, or 8h Day Tour), pickup address, destination or tour package, intermediate waypoints, pickup date, pickup time, and flight details if arriving at an airport.

#### 2. Required Information & Selections
- **Service Type Toggle:** Segmented buttons: `One-Way Transfer`, `Return Trip (-5%)`, `8-Hour Day Tour`.
- **For Point-to-Point Transfers (One-Way / Return):**
  - Pickup Location (text input with auto-suggestions and quick chips for Salzburg Airport SZG, Hauptbahnhof Central Station, Old Town Hotel).
  - Drop-off Location (text input with quick chips for Hallstatt, Zell am See, Munich Airport MUC, Innsbruck, Bad Gastein, etc.).
  - Intermediate Stops counter (`0` to `3` stops; +€20.00 per stop).
- **For 8-Hour Day Tours:**
  - Tour Package Dropdown (Hallstatt €450, Eagle's Nest €450, Werfen €450, Zell am See €450, Bad Gastein €450, Innsbruck €650).
  - Tour Duration selector (default `8 hours`; overtime adjustable at €50.00/hour).
- **Date & Time Controls:**
  - Pickup Date (HTML5 date picker; minimum allowed date is today).
  - Pickup Time (CET time picker, default `14:30`).
  - Return Date & Return Time (displayed conditionally if `serviceType === 'RETURN'`).
- **Flight Delay Monitoring Card:**
  - Flight Number input (e.g., `OS265`, `BA682`, `LH1234`).
  - Clear reassurance badge: *Includes 60 minutes complimentary waiting from actual flight touchdown.*

#### 3. Available User Actions
- `Continue to Vehicle Selection →` (Primary gold button, triggers validation).
- `Select Service Type` (Tabs: One-Way, Return, Tour).
- `Tap Quick Location Chip` (Instantly sets address and distance).
- `Increment / Decrement Stops` (+ / - 44px counter buttons).

#### 4. Real-Time Validation Rules & Error States
- Pickup address must not be empty (minimum 3 characters).
- Drop-off address must not be empty (if Transfer service).
- Pickup date must be equal to or greater than today's date in Salzburg CET.
- Pickup time must be specified.
- If Return Trip is selected, return date/time must be strictly after the pickup date/time.
- **Error UI:** Clear red/amber inline text beneath invalid fields (`border-rose-500` and helper message). No blocking modal alerts.

#### 5. State Payload Carried Forward
```json
{
  "serviceType": "ONE_WAY",
  "pickupAddress": "Salzburg Airport W. A. Mozart (SZG)",
  "dropoffAddress": "Hallstatt Lahn Terminal",
  "distanceKm": 73.0,
  "durationText": "1h 15m",
  "intermediateStops": 0,
  "tourKey": null,
  "tourHours": 8,
  "pickupDate": "2026-11-25",
  "pickupTime": "14:30",
  "flightNumber": "OS265",
  "returnDate": null,
  "returnTime": null
}
```

---

### 3.2 Stage 2: Vehicle Selection & Fleet Hierarchy

#### 1. Purpose & User Goal
Allow the customer to select their preferred Mercedes-Benz vehicle model while inspecting realistic 3D imagery, passenger/luggage capacities, included amenities, and the exact calculated fare for each vehicle class.

#### 2. Fleet Options & Updated Rate Structure
PETRANS offers three distinct vehicle classes:

```
+---------------------------------------------------------------------------------------------------+
|                                  FLEET VEHICLE SPECIFICATIONS                                     |
+-------------------+-------------------+-------------------+-------------------+-------------------+
| Vehicle Model     | Category Code     | Distance Rate     | Capacity Limits   | Recommended For   |
+-------------------+-------------------+-------------------+-------------------+-------------------+
| Mercedes E-Class  | E_CLASS           | €2.50 / km        | Max 3 Passengers  | Executive Solo,   |
| Executive Sedan   |                   | (€45 base floor)  | 2 Large + 2 Cabin | Couples, Airport  |
+-------------------+-------------------+-------------------+-------------------+-------------------+
| Mercedes V-Class  | V_CLASS           | €2.60 / km        | Max 8 Passengers  | VIP Families,     |
| Exclusive Minivan |                   | (€45 base floor)  | 8 Large Suitcases | Delegations, Tours|
+-------------------+-------------------+-------------------+-------------------+-------------------+
| Mercedes Vito     | VITO              | €2.80 / km        | Max 8 Passengers  | Alpine Ski Groups,|
| 4MATIC Tourer     |                   | (€45 base floor)  | 8 Large Suitcases | Winter Luggage    |
+-------------------+-------------------+-------------------+-------------------+-------------------+
```

#### 3. Passenger & Luggage Counter Controls
At the top of Stage 2, customers confirm their party size:
- Passenger count stepper ($1$ to $8$ passengers).
- Large suitcase count stepper ($0$ to $8$ large check-in bags).
- Cabin bag count stepper ($0$ to $8$ carry-on bags).

#### 4. Capacity Safeguard & Auto-Upgrade Banners
Real-time capacity validation evaluates the entered party size against each vehicle:

- **E-Class Over-Capacity Rule:**  
  If `passengers > 3` OR `largeLuggage > 2` OR `cabinBags > 2`:
  - The E-Class card displays a prominent amber warning overlay:  
    *`Capacity Exceeded (Max 3 Pax / 2 Large Bags). Upgrade to V-Class for full party comfort.`*
  - The selection button is styled as: `[Party Size Exceeds E-Class]`.
  - A 1-click upgrade button is provided: `[Switch to Mercedes V-Class (+€0.10/km)]`.

- **Maximum Fleet Boundary Rule:**  
  If `passengers > 8` OR `largeLuggage > 8`:
  - An informational dispatch banner appears:  
    *`Parties over 8 passengers or 8 suitcases require a two-vehicle convoy. Please complete this reservation or click below for instant WhatsApp multi-vehicle dispatch.`*

#### 5. Real-Time Validation Rules & Error States
- Exactly one vehicle must be actively selected before continuing.
- The selected vehicle must be able to accommodate the specified passenger and luggage counts, or the user must acknowledge the capacity alert.

#### 6. State Payload Carried Forward
```json
{
  "vehicleCategory": "V_CLASS",
  "vehicleName": "Mercedes-Benz V-Class Exclusive",
  "ratePerKm": 2.60,
  "passengerCount": 4,
  "largeLuggageCount": 4,
  "cabinBagsCount": 2,
  "calculatedBaseFare": 189.80
}
```

---

### 3.3 Stage 3: Trip Options & Complimentary Extras

#### 1. Purpose & User Goal
Allow the customer to request safety, leisure, and comfort equipment at no extra cost, confirming PETRANS's premium service philosophy (€0.00 complimentary add-ons).

#### 2. Available Options & Touch Controls
All options are presented as large, high-contrast selectable cards with full $44\text{px}+$ touch boundaries:

1. **Child & Infant Safety Seats (€0.00 FREE):**
   - Baby Capsule / Infant Seat ($0 - 1\text{ year}$, up to $13\text{kg}$).
   - Child Safety Seat ($1 - 4\text{ years}$, $9 - 18\text{kg}$).
   - High-Back Booster Seat ($4 - 12\text{ years}$, $15 - 36\text{kg}$).
   - Interactive numerical steppers (+ / -) for each seat type.
2. **Ski & Winter Sports Equipment (€0.00 FREE):**
   - Toggle switch / counter for ski pairs and snowboard bags.
   - Information text: *Vehicles are outfitted with roof boxes or dedicated interior cargo bulkheads.*
3. **Foldable Wheelchair & Mobility Aids (€0.00 FREE):**
   - Checkbox for collapsible manual wheelchairs or walking frames.
   - Transparent policy note: *Accommodated in rear luggage bay. For motorized wheelchairs requiring an electric ramp, please contact dispatch.*
4. **On-Board Hospitality Preferences:**
   - Complimentary Austrian mineral water (Still vs. Sparkling preference).
   - Cabin Temperature preference (Warm $22^\circ\text{C}$, Standard $20^\circ\text{C}$, Cool $18^\circ\text{C}$).
5. **Special Chauffeur Instructions (Optional):**
   - Free-form text area for hotel room numbers, flight lead names, or landmark drop-off instructions.

#### 3. Real-Time Validation Rules
- Total number of child seats cannot exceed the total passenger count (`baby + child + booster <= passengerCount`).
- Maximum 4 child seats in an 8-passenger vehicle.

#### 4. State Payload Carried Forward
```json
{
  "childSeats": { "baby": 0, "child": 1, "booster": 1 },
  "skiEquipmentCount": 2,
  "foldableWheelchair": false,
  "hospitality": { "water": "STILL", "temp": "STANDARD" },
  "specialRequests": "Please meet at Terminal arrival gate with name board: DR. WEBER"
}
```

---

### 3.4 Stage 4: Customer Contact & Travel Identification

#### 1. Purpose & User Goal
Capture the lead passenger's contact details to enable flight monitoring notifications, chauffeur dispatch updates, and booking confirmation communications.

#### 2. Input Fields & Data Ergonomics
- **Full Name:** Text input (`autocomplete="name"`), placeholder: `e.g. Dr. Alexander Weber`.
- **Email Address:** Email input (`autocomplete="email"`), placeholder: `alexander.weber@example.com`.
- **Mobile Phone Number:** Tel input (`autocomplete="tel"`) paired with a country code picker (defaults to Austria `+43` or Germany `+49`), placeholder: `+43 660 1234567`.
- **Preferred Communication Channel:** Radio pills:
  - `WhatsApp & Email` (Recommended, 95% of guests choose this).
  - `Email Only`.
  - `SMS & Email`.
- **Language Preference:** Dropdown: `English`, `Deutsch`, `हिन्दी (Hindi)`, `اردو (Urdu)`.
- **Corporate Billing Address (Optional Accordion):**
  - Company Name, Tax / UID Number, Billing Street & Country (for itemized business expense invoices).

#### 3. Real-Time Validation Rules & Error States
- Full Name: At least two words (First + Last name), minimum 4 characters.
- Email Address: Valid RFC 5322 email regex pattern.
- Mobile Phone: Minimum 8 digits, valid E.164 country code format.
- **Instant Inline Validation:** Input borders turn `border-emerald-500` upon valid entry; errors trigger descriptive inline text (`"Please enter a valid mobile number with country code"`).

#### 4. State Payload Carried Forward
```json
{
  "customer": {
    "fullName": "Dr. Alexander Weber",
    "email": "alexander.weber@example.com",
    "phoneNumber": "+43 660 1234567",
    "commChannel": "WHATSAPP_EMAIL",
    "language": "en",
    "isCompanyInvoice": false
  }
}
```

---

### 3.5 Stage 5: Final Review & In-Line Editing UX

#### 1. Purpose & User Goal
The review stage is the **central trust anchor** of the entire booking workflow. Before submitting, the customer must be able to inspect all details of their journey on a single comprehensive summary card. 

**Crucially, the customer must NOT be forced to click browser back buttons to make changes.** Every section provides a direct **In-Line Edit Trigger** that opens an in-place editing sheet or expands an inline editor. Any change triggers immediate, reactive price recalculation.

```
+---------------------------------------------------------------------------------------------------+
|                                STAGE 5: COMPREHENSIVE TRIP REVIEW                                 |
+---------------------------------------------------------------------------------------------------+
|  [ROUTE & SCHEDULE]                                                         [Edit Schedule]       |
|  Service: One-Way Transfer                                                                        |
|  Pickup: Salzburg Airport (SZG)  -->  Dropoff: Hallstatt Lahn Terminal (73 km, ~1h 15m)          |
|  Date & Time: Nov 25, 2026 at 14:30 CET  |  Flight: OS265 (60 min free waiting included)          |
+---------------------------------------------------------------------------------------------------+
|  [VEHICLE & PASSENGERS]                                                     [Change Vehicle]      |
|  Selected: Mercedes-Benz V-Class VIP Minivan (€2.60/km)                                           |
|  Party Size: 4 Passengers  |  Luggage: 4 Large Suitcases + 2 Cabin Bags                           |
+---------------------------------------------------------------------------------------------------+
|  [COMPLIMENTARY EXTRAS]                                                     [Modify Extras]       |
|  Child Seats: 1x Child (1-4y), 1x Booster (4-12y) (€0.00)                                         |
|  Winter Gear: 2x Ski Equipment Bags (€0.00)  |  Hospitality: Still Mineral Water                  |
+---------------------------------------------------------------------------------------------------+
|  [PRIMARY PASSENGER]                                                        [Edit Contact]        |
|  Dr. Alexander Weber  |  +43 660 1234567  |  alexander.weber@example.com                          |
|  Dispatch Updates: WhatsApp & Email                                                               |
+---------------------------------------------------------------------------------------------------+
|  [TRANSPARENT PRICE SPECIFICATION]                                                                |
|  Distance Fare (73.0 km @ €2.60/km) ........................................ €189.80              |
|  Intermediate Stops (0) .................................................... €0.00                |
|  Complimentary Extras (Child seats, ski bags, airport waiting) .............. €0.00 (FREE)        |
|  Highway Vignette & Tunnel Tolls ........................................... INCLUDED             |
|  ------------------------------------------------------------------------------------------------ |
|  Net Service Amount: €158.17  |  Austrian VAT (20%): €31.63                                       |
|  TOTAL GROSS QUOTE (ALL INCLUSIVE):                                         €189.80               |
+---------------------------------------------------------------------------------------------------+
|  [PAYMENT PREFERENCE]                                                                             |
|  (o) Pay to Chauffeur on Board (Cash or Credit Card) - ZERO UPFRONT PAYMENT                        |
|  ( ) Prepay Online Securely via Stripe Link (Sent after owner confirms availability)              |
+---------------------------------------------------------------------------------------------------+
|  [ < Back to Contact ]                     [ SUBMIT BOOKING REQUEST (PENDING CONFIRMATION) -> ]   |
+---------------------------------------------------------------------------------------------------+
```

#### 2. In-Line Editing Interactions
Clicking any edit button opens a lightweight, in-context slide-down editor:

- **`[Edit Schedule]`:** Expands date/time pickers and route inputs directly within Stage 5. Updating the drop-off location recalculates distance and updates the fare immediately.
- **`[Change Vehicle]`:** Opens a responsive radio-selector showing E-Class (€2.50/km = €182.50), V-Class (€2.60/km = €189.80), and Vito (€2.80/km = €204.40). Selecting a different model immediately re-computes the summary and total price without navigating away.
- **`[Adjust Passengers/Bags]`:** Opens number counters. If the user reduces party size to 2 pax and 2 bags, a note appears: *“Eligible for Mercedes E-Class (€182.50). Click to switch.”*
- **`[Modify Extras]`:** Allows immediate toggling of child seats and ski equipment.

#### 3. Transparent Financial Breakdown Formula
The financial display itemizes every cent in strict compliance with Austrian fiscal law (*UStG § 11*):
$$\text{BaseFare} = \max(\text{MIN\_FARE}, \text{distanceKm} \times \text{ratePerKm})$$
$$\text{StopsFee} = \text{intermediateStops} \times 20.00$$
$$\text{OneWayTotal} = \text{BaseFare} + \text{StopsFee}$$
$$\text{GrossFare} = \begin{cases} 
\text{OneWayTotal} \times 1.95 & \text{if serviceType == 'RETURN'} \\
\text{tourPrice} + \text{overtimeFee} & \text{if serviceType == 'TOUR'} \\
\text{OneWayTotal} & \text{if serviceType == 'ONE\_WAY'}
\end{cases}$$
$$\text{NetFare} = \frac{\text{GrossFare}}{1.20}, \quad \text{VAT (20\%)} = \text{GrossFare} - \text{NetFare}$$

---

### 3.6 Stage 6: Submission & Status Confirmation

#### 1. Purpose & Booking Safety Assurance
Stage 6 eliminates customer anxiety, confirms successful transmission, and enforces the mandatory legal and operational distinction between **Booking Request** and **Confirmed Reservation**.

#### 2. Status Badge & Operator SLA Reassurance
- **Prominent Status Banner:**  
  ```html
  <div class="p-6 bg-surface border border-amber-500/40 rounded-2xl mb-6 flex items-start gap-4">
    <div class="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
      <iconify-icon icon="lucide:clock" width="26" height="26"></iconify-icon>
    </div>
    <div>
      <span class="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1">
        Status: Pending Owner Confirmation
      </span>
      <h3 class="text-xl font-bold font-outfit text-snow">Booking Request Received</h3>
      <p class="text-sm text-slate-300 mt-1 leading-relaxed">
        Your chauffeur request has been dispatched directly to our operations manager, <strong>Omer Farooq</strong>. We review vehicle scheduling and confirm within <strong>15 to 30 minutes</strong> via WhatsApp and Email.
      </p>
    </div>
  </div>
  ```

#### 3. Booking Identification & Zero Premature Charge Notice
- **Booking Reference Code:** Displayed prominently in monospace font (e.g., `PET-2026-8492`).
- **Zero Payment Reassurance:**  
  *`No payment has been charged. You selected 'Pay to Chauffeur on Board'. If you prefer digital prepayment, an official secure link will be provided in your confirmation message once vehicle availability is confirmed.`*
- **Action Buttons:**
  - `[Open WhatsApp Dispatch Chat]` (Links to `https://wa.me/436606416464?text=Hello%20Omer,%20I%20have%20submitted%20booking%20PET-2026-8492...`).
  - `[Download Reservation PDF]`.
  - `[Return to Homepage]`.

---

## 4. Fleet & Rate Updates

### 4.1 Updated Pricing Engine Specification
The shared pricing engine (`calculateClientPrice`) is updated to take the vehicle category as a primary parameter:

```javascript
/**
 * Unified PETRANS Pricing Engine
 * @param {string} serviceType - 'ONE_WAY' | 'RETURN' | 'TOUR'
 * @param {number} distanceKm - Route distance in kilometers
 * @param {number} stopsCount - Number of intermediate waypoints
 * @param {string} vehicleCategory - 'E_CLASS' | 'V_CLASS' | 'VITO'
 * @param {string} tourKey - Key of tour itinerary (if TOUR)
 * @param {number} tourHours - Duration of tour in hours
 */
function calculateClientPrice(serviceType, distanceKm, stopsCount, vehicleCategory, tourKey, tourHours) {
  const MIN_FARE = 45.0; // Mandatory base floor for short hops (< 20 km)
  
  // Rate mapping per vehicle class
  const VEHICLE_RATES = {
    'E_CLASS': 2.50, // Mercedes E-Class Sedan
    'V_CLASS': 2.60, // Mercedes V-Class VIP Van
    'VITO':    2.80  // Mercedes Vito Tourer 4MATIC
  };

  const ratePerKm = VEHICLE_RATES[vehicleCategory] || 2.60;
  let baseFare = 0;
  let stopsFee = stopsCount * 20.0;
  let overtimeFee = 0;
  let discountAmount = 0;
  let grossTotal = 0;

  if (serviceType === 'TOUR') {
    const TOURS_DB = {
      'hallstatt':        { price: 450.0, name: 'Hallstatt & Salzkammergut' },
      'eagles-nest':      { price: 450.0, name: 'Eagle\'s Nest & Berchtesgaden' },
      'werfen-ice-caves': { price: 450.0, name: 'Werfen Ice Caves & Fortress' },
      'zell-am-see':      { price: 450.0, name: 'Zell am See & Alpine Glacier' },
      'bad-gastein':      { price: 450.0, name: 'Bad Gastein Valley & Waterfalls' },
      'innsbruck':        { price: 650.0, name: 'Innsbruck & Tyrolean Alps' }
    };
    
    const tour = TOURS_DB[tourKey] || TOURS_DB['hallstatt'];
    baseFare = tour.price;
    if (tourHours > 8) {
      overtimeFee = (tourHours - 8) * 50.0;
    }
    grossTotal = baseFare + overtimeFee;
  } else {
    // Point-to-Point Distance Calculation
    const rawFare = distanceKm * ratePerKm;
    
    if (rawFare < MIN_FARE) {
      baseFare = MIN_FARE;
    } else if (distanceKm > 150) {
      // Long-distance tier: Standard rate for first 150km, €2.20/km thereafter
      baseFare = (150 * ratePerKm) + ((distanceKm - 150) * 2.20);
    } else {
      baseFare = rawFare;
    }

    const oneWayTotal = baseFare + stopsFee;

    if (serviceType === 'RETURN') {
      // Return leg receives a 5% discount (Total = OneWay * 1.95)
      const returnLeg = oneWayTotal * 0.95;
      discountAmount = oneWayTotal - returnLeg;
      grossTotal = oneWayTotal + returnLeg;
    } else {
      grossTotal = oneWayTotal;
    }
  }

  grossTotal = Math.round(grossTotal * 100) / 100;
  const netTotal = Math.round((grossTotal / 1.20) * 100) / 100;
  const vatAmount = Math.round((grossTotal - netTotal) * 100) / 100;

  return {
    grossTotal,
    netTotal,
    vatAmount,
    baseFare: Math.round(baseFare * 100) / 100,
    stopsFee,
    overtimeFee,
    discountAmount: Math.round(discountAmount * 100) / 100,
    ratePerKm
  };
}
```

---

## 5. Mobile Ergonomics & Progress Preservation

### 5.1 Browser History & URL State Synchronization
To prevent users from losing their entered data when tapping the smartphone's hardware or browser back button:
1. Every stage transition calls `window.history.pushState({ stage: step }, '', '#book-step-' + step)`.
2. A `window.onpopstate` event listener intercepts the back action:
   ```javascript
   window.addEventListener('popstate', (event) => {
     if (event.state && event.state.stage) {
       goToStage(event.state.stage, false); // Transitions without adding duplicate history
     }
   });
   ```
3. Form data is continuously persisted in `sessionStorage.setItem('petrans_booking_state', JSON.stringify(appState))`, allowing effortless recovery if the customer accidentally refreshes the page.

### 5.2 Mobile Header & Compact Progress Stepper
On smartphone screens ($< 640\text{px}$):
- Hide the horizontal text labels below the step bubbles.
- Present a sticky top progress banner:
  ```html
  <div class="sm:hidden flex items-center justify-between p-3 bg-surface/95 backdrop-blur-md rounded-xl border border-slate-800 mb-4 sticky top-20 z-30 shadow-lg">
    <div class="flex items-center gap-2">
      <span class="w-7 h-7 rounded-full bg-gold text-midnight font-bold text-xs flex items-center justify-center">
        3
      </span>
      <span class="text-xs font-bold text-snow uppercase tracking-wider">
        Trip Options & Extras
      </span>
    </div>
    <span class="text-[11px] font-semibold text-gold">Step 3 of 6</span>
  </div>
  ```

### 5.3 Touch Targets & Safari Anti-Zoom Guarantee
- Every interactive control (counter buttons, quick chips, segmented tabs, vehicle cards) is verified to have a minimum touch box of **$44 \times 44\text{px}$**.
- Form inputs enforce `font-size: 16px !important; min-height: 48px;` to stop iOS Safari from zooming in on input focus.
- The sticky bottom bar on mobile presents the current live quote and a full-width action button.

---

## 6. Implementation Directives & Acceptance Matrix

### 6.1 Action Checklist for Lead Technical Engineer (`agent-83113a2c-0243-469e-8242-ed86c887356c`)
1. **Update `appState` Object in `app.js`:**
   - Add `vehicleCategory: 'V_CLASS'` with support for `'E_CLASS'`, `'V_CLASS'`, and `'VITO'`.
   - Add state properties for entry point tracking (`entrySource`).
2. **Update `calculateClientPrice()`:**
   - Integrate `VEHICLE_RATES` (€2.50 for E-Class, €2.60 for V-Class, €2.80 for Vito).
3. **Refactor HTML Structure in `index.html`:**
   - Re-sequence the step panes to match the 6-stage architecture (Stage 1: Journey Details, Stage 2: Vehicle Selection, Stage 3: Options & Extras, Stage 4: Customer Info, Stage 5: Final Review, Stage 6: Pending Confirmation).
   - Add Mercedes E-Class card to Stage 2 with 3-passenger / 2-bag capacity locks.
   - Implement the in-line edit triggers and dynamic recalculation in Stage 5.
4. **Implement Browser History Sync:**
   - Integrate `history.pushState()` and `popstate` handlers.

### 6.2 Acceptance Criteria for Auditor (`agent-155a4006-d652-4bed-813f-862abcd83fb7`) & Browser QA (`agent-49ce8d12-b37c-450c-bd4c-7fb6a9c0c8d1`)

| Test Case | Scenario / Condition | Expected Result | Pass Criteria |
| :--- | :--- | :--- | :--- |
| **TC-BOOK-01** | Homepage Fleet Card Click (`Select E-Class`) | Opens Stage 1; vehicle pre-set to E-Class; Stage 2 shows E-Class active | Preselection verified |
| **TC-BOOK-02** | Tour Card Click (`Book Hallstatt Tour`) | Opens Stage 1 with Tour tab active, Hallstatt pre-selected, fare = €450 | Zero lock-in, customizable |
| **TC-BOOK-03** | Hero Calculator Submit | All route inputs carried into Stage 1 | Accurate state hydration |
| **TC-BOOK-04** | E-Class Capacity Overflow (>3 pax or >2 large bags)| Amber warning banner triggers; auto-upgrade prompt to V-Class appears | Capacity safeguard active |
| **TC-BOOK-05** | Stage 5 In-Line Vehicle Switch | Changing from V-Class to Vito updates fare from €2.60/km to €2.80/km | Instant recalculation |
| **TC-BOOK-06** | Stage 6 Confirmation Display | Status reads `PENDING OWNER CONFIRMATION`; reference code generated | Decoupled from payment |
| **TC-BOOK-07** | Browser Back Navigation | Tapping browser back button returns to prior stage without resetting data | 100% Data Preservation |
| **TC-BOOK-08** | Mobile Viewport Verification (360px–428px) | Zero horizontal overflow; touch targets $\ge 44\text{px}$; inputs 16px | 100% Mobile Ergonomics |

---

*This specification is saved at `/home/hanzlaahmad/OpenBot/Shared/PETRANS/design/multi_page_booking_architecture.md` and stands as the authoritative architectural blueprint for PETRANS booking engine development.*
