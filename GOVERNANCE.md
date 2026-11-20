# PETRANS Taxi & Tour Salzburg — Project Governance & Contribution Register

**Project Owner & Founder:** Hanzla Ahmad  
**Liaison / Founder WhatsApp:** Milo (+923266900001)  
**Project Director & Orchestrator:** Chief (`agent-011c3dcd-d75c-4e1b-b229-a9ebe562a33c`)  
**Target Launch Date:** 30 November 2026  
**Primary Repository / Shared Workspace:** `/home/hanzlaahmad/OpenBot/Shared/PETRANS`

---

## 1. Multi-Agent Roster & Standing Responsibilities

| Role | Agent Name | Agent ID | Assigned Scope |
| :--- | :--- | :--- | :--- |
| **Project Director & Orchestrator** | Chief | `agent-011c3dcd-d75c-4e1b-b229-a9ebe562a33c` | Planning, delegation, task tracking, integration, governance, milestone sign-off. |
| **Lead Technical Engineer** | Engineer | `agent-83113a2c-0243-469e-8242-ed86c887356c` | Architecture implementation, full-stack frontend/backend, pricing engine, database, API integrations. |
| **UI/UX Design Specialist** | UI/UX Design Specialist | `agent-71f645ad-ba24-419e-bdff-ee05809a4b0e` | Visual branding, design system, sitemap, wireframes, booking journey UX, responsive layouts. |
| **Market & Technical Researcher** | Researcher | `agent-2692ee44-7a2b-472c-bb74-727ef88d7cce` | Competitor analysis (ExuroTrip, Salzburg Cab), Salzburg tourism/taxi pricing, SEO keywords, tech feasibility. |
| **Automation & AI Engineer** | Automation Engineer | `agent-f6cdc612-11cc-4b4e-b274-ef4460b13892` | AI support assistant, booking email automations, flight tracking pipeline, WhatsApp notification routing. |
| **Quality & Security Auditor** | Auditor | `agent-155a4006-d652-4bed-813f-862abcd83fb7` | Independent verification, SRS compliance, security/privacy audit, risk register validation. |
| **Browser QA Tester** | Browser QA Tester | `agent-49ce8d12-b37c-450c-bd4c-7fb6a9c0c8d1` | End-to-end browser verification, responsive testing, booking journey testing via BrowserOS neo. |
| **Client Communication Liaison** | Milo | `agent-d86c1fd6-8dc3-4e5b-962c-9437ab9a230b` | High-priority milestone summaries, strategic owner decisions, WhatsApp reporting to Hanzla Ahmad. |

---

## 2. 6-Stage Execution Lifecycle
Every phase adheres strictly to:
$$\text{PLAN} \longrightarrow \text{DELEGATE} \longrightarrow \text{EXECUTE} \longrightarrow \text{VERIFY} \longrightarrow \text{INTEGRATE} \longrightarrow \text{NEXT TASK}$$

1. **PLAN:** Chief scopes tasks, defines deliverables, acceptance criteria, and dependencies.
2. **DELEGATE:** Chief formally issues concrete assignments to specialists using the mandatory task format.
3. **EXECUTE:** Specialists perform independent research, design, coding, or automation and save artifacts to `/home/hanzlaahmad/OpenBot/Shared/PETRANS/`.
4. **VERIFY:** Auditor conducts independent quality/security audits; Browser QA Tester conducts real browser tests.
5. **INTEGRATE:** Chief reviews deliverables against acceptance criteria, reconciles conflicts, and merges into the master project state.
6. **NEXT TASK:** Chief updates the contribution register, reports milestones to Founder via Milo, and initiates the next phase.

---

## 3. Live Contribution Register

| Task ID | Task Title | Assigned Agent | Status | Deliverables | Verification Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-PET-000** | Project Kickoff, Scope Framing & Requirements Analysis | Chief | **COMPLETED** | `docs/requirements_analysis.md`, `GOVERNANCE.md` | Extracted & audited against questionnaire PDF |
| **TSK-PET-001** | Competitor Benchmarking & Reference Site Research | Researcher | **COMPLETED** | `research/competitor_analysis.md` | Delivered by Researcher (35 KB report) |
| **TSK-PET-002** | Brand Identity, Sitemap & Booking Flow UX Design | UI/UX Design Specialist | **COMPLETED** | `design/sitemap_and_booking_ux.md` | Delivered by UI/UX Specialist (57 KB specification) |
| **TSK-PET-003** | System Architecture, Tech Stack & Pricing Engine Spec | Engineer | **COMPLETED** | `architecture/tech_stack_and_pricing_engine.md` | Delivered by Lead Technical Engineer (40 KB specification) |
| **TSK-PET-004** | AI Customer Support & Automation Architecture | Automation Engineer | **COMPLETED** | `automation/ai_and_notifications_spec.md` | Delivered by Automation Engineer (36 KB specification) |
| **TSK-PET-005** | Independent Audit of Phase 1 Deliverables & Risk Register | Auditor | **COMPLETED** | `audit/phase1_audit_report.md` | Delivered by Auditor (45 KB audit report & risk register) |
| **TSK-PET-006** | Consolidated Project Kickoff Master Deliverable & Roadmap | Chief | **COMPLETED** | `docs/PETRANS_Master_Kickoff_Report.md` | Delivered by Chief (Reference: DOC-PET-KICKOFF-MASTER-001) |
| **TSK-PET-007** | Founder WhatsApp Milestone Briefing via Milo | Milo | **COMPLETED** | `docs/founder_briefing_milo.md` | Delivered by Milo (WhatsApp Msg ID: true_173559762686119@lid_3EB08209A4FDFB56687169) |
| **TSK-PET-010** | Full-Stack Website Implementation & Dev Server Deployment | Engineer | **COMPLETED** | `website/` (Live at http://localhost:3000) | Verified HTTP 200 OK, full pricing engine, 6-step booking flow, fleet/tours, AI concierge |

---

## 4. Git & Release Guidelines
- **Identity:** All commits, git history, and releases must strictly use the Founder's identity:
  - Name: `Hanzla Ahmad`
  - Email: `hanzlaahmad100@gmail.com`
  - Username: `hanzlaahmadcheema`
- No AI or OpenBot co-authors allowed.
