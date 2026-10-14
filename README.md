# PROJECT D.R.I.S.H.T.I.
### Diagnostic & Reliability Intelligence with Sensor Health Tracking & Inspection
#### SIH 2026 — Problem Statement ID: 26249: Air Power — Predictive Maintenance & Fleet Availability
**Organization:** Ministry of Defence (MoD)  
**Department:** Defence Services Staff College (DSSC)  
**Category:** Software | **Theme:** Transportation & Logistics  

---

## 1. Executive Summary & Problem Context
Military aircraft and defence fleet availability is often severely constrained by fragmented and reactive maintenance practices. Aircraft health-monitoring telemetry, technical flight logs, depot spares inventories, and maintenance technician workflows are typically siloed. This delays early fault discovery, triggers avoidable Aircraft-on-Ground (AOG) downtime, and leads to sub-optimal utilization of critical air combat assets.

**Project D.R.I.S.H.T.I.** delivers a unified **Aircraft Predictive Maintenance & Fleet Availability Platform** built solely on the **MERN** stack (MongoDB, Express.js, React, Node.js, Bootstrap 5, HTML5/CSS3). Rooted in the concept of *Drishti (दृष्टि)*—predictive foresight, situational vigilance, and 360° health visibility—the system bridges telemetry and ground maintenance workflows.

### The Complete Operational Value Chain
```
Landing Page
     ↓
Authentication & Role Selection (Admin vs Technician)
     ↓
Admin Assigns Job (e.g. AF-04 Engine Anomaly → Rahul Sharma)
     ↓
Technician Dashboard (Role-Isolated View: Pending & Active Jobs)
     ↓
Open Job & View Aircraft Digital Twin Profile
     ↓
Start Inspection → Technician Inspection Portal
     ↓
Real-Time Telemetry & FFT Analysis (Vibration, Temp, Pressure, RPM)
     ↓
Degradation Trend & RUL Horizon Assessment (~40 Flight Hours)
     ↓
Boroscopic Physical Check & Finding Documentation
     ↓
Submit Airworthiness Sign-Off
     ↓
Fleet Availability Restored (75% → 85%+ Mission Ready)
```

> **Design Principle:** This platform is engineered as an aerospace operational tool for qualified military aeronautical officers and line technicians—not a generic SaaS tool or dark sci-fi HUD. Every screen provides explainable physical sensor telemetry, confidence intervals, and actionable engineering workflows.

---

## 2. Login & Role-Based Workflow Architecture

### 1. Application Entry Flow
* **Landing Page:** Professional aerospace landing page with blueprint schematics, operational readiness statistics, and prominent **"Login / Get Started"** buttons.
* **Login Page:** Clean, enterprise aerospace login screen featuring dedicated **1-Click Demo Logins** with realistic Indian Air Force / DSSC personnel personas:
  * **Fleet Administrator:** Arjun Mehta (*Fleet Maintenance Administrator*)
  * **Technicians (Specialized Trades):**
    * **Rahul Sharma** (*Propulsion & Powerplant Specialist*)
    * **Vikram Singh** (*Hydraulic & Actuation Systems Specialist*)
    * **Aditya Verma** (*Avionics & Radar Systems Specialist*)
    * **Karan Gupta** (*Fuel & Environmental Systems Specialist*)

---

### 2. Admin vs Technician Capabilities

| Feature / Action | Admin (`Arjun Mehta`) | Technicians (`Rahul`, `Vikram`, `Aditya`, `Karan`) |
| :--- | :---: | :---: |
| **Fleet Readiness Overview** | Full Fleet (All Airbases, Statuses, Readiness Rate) | Assigned Airframes & Components Only |
| **Tactical Tail Matrix** | All Tail Numbers (`AF-01` to `AF-05`) | Only aircraft assigned for current work order |
| **Job Assignment Modal** | Can assign any aircraft + job + priority to any technician | View-only of incoming assigned tasks |
| **Technician Roster Tracking** | Live visibility of all technician queues & progress | Personal queue only |
| **Inspection Portal** | Review completed logs and signed-off records | Interactive Boroscopic & Telemetry Inspection Portal |
| **Spares & Logistics** | Depot-wide inventory & predictive requisitions | Auto-requisitions parts during inspection |
| **Fleet Analytics** | Full availability curves & subsystem Pareto trends | Subsystem telemetry relevant to assigned job |

---

### 3. Technician Inspection Portal

When a technician clicks **"Start Inspection"** from their dashboard or job detail view, the dedicated aerospace **Inspection Portal** modal activates:

1. **Airframe & Job Header:** Displays Tail Number (e.g., `AF-04`), Aircraft Type (`Multirole Fighter`), Assigned Technician, Priority (`High`), Reason (`Abnormal engine vibration detected`), and RUL (`~40 flight hours`).
2. **Real-Time Measured Telemetry Gauges:**
   * **Spool Vibration:** `4.62 mm/s` (Threshold: `4.50 mm/s` — *Critical Spike*)
   * **Scavenge Oil Temp:** `118.4 °C` (Threshold: `110.0 °C` — *Warning Level*)
   * **Fuel/Oil Pressure:** `44.2 PSI` (Normal Operating Band: `35 - 55 PSI`)
   * **Core Spool RPM:** `14,250 RPM` (Optimal Range: `12,000 - 15,500 RPM`)
3. **Harmonic FFT & Degradation Trend Chart:** Interactive Chart.js graph tracking baseline harmonics vs recent elevated vibration drift across flight hours.
4. **AI/ML RUL Prediction & Recommendation:** High-confidence prognosis indicating stage-2 bearing micro-spalling with direct recommendation to perform optical boroscopic inspection and bearing pack replacement.
5. **Physical Inspection Checklist:** Interactive verification steps (Boroscope inspection, casing bolt torquing, chip detector clearance, oil filter inspection).
6. **Findings Entry & Airworthiness Release:** Technicians enter physical findings, corrective actions taken, and click **"Submit Inspection & Sign Off Airworthiness"**.
7. **Automated Closed-Loop Sync:**
   * The work order status transitions from `In Progress` → `Completed`.
   * Aircraft status transitions from `Under Inspection` / `Unscheduled Maintenance` → **`Mission Capable (95% Health)`**.
   * Associated predictive risk alerts are automatically resolved.
   * Admin dashboard reflects the updated availability rate in real time!

---

## 3. Prototype Demo Data Roster

### Aircraft Fleet:
* **AF-01:** Sukhoi Su-30MKI / Multirole Fighter — *Mission Capable* (94% Health, Ambala Airbase)
* **AF-02:** Mirage 2000 / Interceptor — *In Progress: Hydraulic System Check* (Assigned to **Vikram Singh**)
* **AF-03:** Tejas LCA Mk1 / Light Fighter — *Assigned: Fuel System Inspection* (Assigned to **Karan Gupta**)
* **AF-04:** Rafale DH / Strike Fighter — *Assigned: Engine Health Inspection* (Assigned to **Rahul Sharma**, High Priority Anomaly)
* **AF-05:** MiG-29UPG / Air Superiority — *Completed: Avionics Inspection* (Inspected by **Aditya Verma**)

### Initial Job Assignments:
| Aircraft | Job Type | Technician | Priority | Status | RUL Horizon | Reason |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **AF-04** | Engine Health Inspection | Rahul Sharma | **High** | `Assigned` | ~40 Flight Hours | Abnormal engine vibration detected (4.62 mm/s) |
| **AF-02** | Hydraulic System Check | Vikram Singh | **Medium** | `In Progress` | ~85 Flight Hours | System B pressure drop during actuator cycling |
| **AF-05** | Avionics Inspection | Aditya Verma | **Low** | `Completed` | ~210 Flight Hours | Periodic INS calibration and BITE self-test check |
| **AF-03** | Fuel System Inspection | Karan Gupta | **Medium** | `Assigned` | ~110 Flight Hours | Fuel transfer valve micro-fluctuation during climb |

---

## 4. Technology Stack

* **Frontend:** React 18, Bootstrap 5.3, Lucide Aerospace Icons, Chart.js & `react-chartjs-2`, Custom Aerospace CSS Design Tokens.
* **Backend:** Node.js (v20+), Express.js (REST API), CORS, dotenv.
* **Database & Fallback Engine:** MongoDB via Mongoose Models (`Aircraft`, `Alert`, `Spare`, `WorkOrder`, `User`) with automatic seamless fallback to an in-memory/JSON-persisted data store (`Backend/data/store.js`) if MongoDB is not running locally.
* **Build System:** Vite 5.

---

## 5. Visual Theme & Restraints Adherence

Per the official SIH 2026 development brief:
* **Palette:** Restrained light industrial theme using off-white/light grey background (`#f4f6f9`), charcoal/near-black structure (`#12161f`), industrial yellow/amber accents (`#d97706`), muted green for mission-capable (`#15803d`), muted amber for warnings (`#d97706`), and muted red for critical alerts (`#dc2626`).
* **Strict Avoidance:** No purple-heavy "AI SaaS" themes, no neon glows, no generic gaming HUDs, and no generic chatbot widgets.
* **Typography:** Professional clean sans-serif paired with crisp monospace (`JetBrains Mono`) for all tail numbers, sensor telemetry, and serial identifiers.

---

## 6. Environment Configuration (.env)

The platform includes ready-to-use `.env` and `.env.example` files configured with demo placeholder strings. You can replace them with your actual MongoDB Atlas or production credentials at any time.

### Server & Root `.env` Variables:
```env
# Server Port & Mode
PORT=5001
NODE_ENV=development

# Database Connection (MongoDB Atlas Cloud or Local MongoDB)
# Demo connection string placeholder provided:
MONGODB_URI=mongodb+srv://demo_admin:demo_password_secure123@cluster0.drishti.mongodb.net/drishti_maintenance?retryWrites=true&w=majority
# Or Local:
# MONGODB_URI=mongodb://127.0.0.1:27017/drishti_maintenance

# Authentication & Session Keys
JWT_SECRET=drishti_super_secret_aerospace_key_2026_sih_mod_secure_jwt
JWT_EXPIRES_IN=7d
SESSION_SECRET=drishti_session_secret_ps26249_secure_dev

# Networking CORS Allowed Origins
CLIENT_ORIGIN=http://localhost:5173,http://localhost:5001,http://127.0.0.1:5173,http://127.0.0.1:5001

# Telemetry & AI Model Parameters
TELEMETRY_REFRESH_RATE_MS=3000
AI_INFERENCE_CONFIDENCE_THRESHOLD=0.85
VIBRATION_CRITICAL_THRESHOLD_MMS=4.50
EGT_TEMP_CRITICAL_THRESHOLD_C=115.0
```

### Frontend `.env` Variables:
```env
# API Base URL (relative '/api' works for Vite proxy & Express SPA)
VITE_API_BASE_URL=/api

# Application Display Info
VITE_APP_TITLE=PROJECT D.R.I.S.H.T.I.
VITE_APP_ACRONYM_EXPANSION=Diagnostic & Reliability Intelligence with Sensor Health Tracking & Inspection
```

> **Resilient Fallback Guarantee:** If your MongoDB URI is invalid, offline, or unreachable, the system automatically falls back to its embedded in-memory database with the full dataset loaded, ensuring the presentation demo never crashes.

---

## 7. Getting Started & Running the Platform

### Prerequisites
* Node.js (v18 or higher)
* npm (v9 or higher)
* *(Optional)* MongoDB running locally or on Atlas.

### Quick Launch (Unified Server)
The production frontend build is already pre-compiled into `Frontend/dist`. The Express backend serves both the REST API and the React SPA on port `5001`.

```bash
# 1. From the project root, start the server:
npm start

# 2. Open in your browser:
http://localhost:5001
```

### Development Mode (Concurrent Live Reload)
To run frontend and backend in active development mode:

```bash
# Terminal 1: Backend API Server
cd Backend
npm start
# Listening on http://localhost:5001

# Terminal 2: Frontend Vite Dev Server
cd Frontend
npm run dev
# Listening on http://localhost:5173 (proxies /api to 5001)
```

---

## 8. Step-by-Step Verification & Demo Walkthrough

### Step 1: Landing Page & Authentication
1. Open `http://localhost:5001`. You will see the aerospace landing page.
2. Click **"Login / Get Started"** or **"Enterprise Login"** in the navigation bar.
3. On the Login Page, notice the two role sections:
   * **Fleet Maintenance Administrator**
   * **Certified Maintenance Technicians**

### Step 2: Log In as Technician (Rahul Sharma)
1. Click **"Continue as Rahul Sharma (Powerplant)"**.
2. Notice you are redirected to the dedicated **Technician Dashboard** (`/technician-dashboard`).
3. Rahul sees his assigned task card:
   * **Aircraft:** `AF-04` — Strike Fighter
   * **Job:** `Engine Health Inspection`
   * **Priority:** `HIGH`
   * **RUL:** `~40 flight hours`
   * **Reason:** `Abnormal engine vibration detected`
4. Click **"Open Job"** to inspect the job details, or click **"Start Inspection"** directly.

### Step 3: Execute Inspection in the Inspection Portal
1. The **Technician Inspection Portal** modal opens.
2. Review the live sensor telemetry:
   * **Vibration:** `4.62 mm/s` (Alert Flagged)
   * **Scavenge Temp:** `118.4 °C`
   * **Pressure:** `44.2 PSI`
   * **RPM:** `14,250`
3. Review the **Vibration Harmonic Trend Chart** showing degradation across flight hours.
4. Review the AI/ML prognosis: *Stage-2 HP bearing micro-spalling suspected*.
5. Complete the checklist items:
   * Boroscope inspection of stage-2 bearing cavity
   * Check magnetic chip detector
   * Replaced damaged bearing ring with depot spare `ENG-BRG-7440`
6. Click **"Submit Inspection & Sign Off Airworthiness"**.
7. The portal confirms the inspection is submitted! Rahul's dashboard updates to show **0 Pending Jobs** and **1 Completed Job**.

### Step 4: Switch to Admin (Arjun Mehta) & Verify Fleet Restoration
1. Use the fast role switcher in the top navigation or click **Logout** and choose **"Continue as Admin (Arjun Mehta)"**.
2. Notice the Admin Dashboard:
   * `AF-04` has been dynamically restored to **Mission Capable (95% Health)**.
   * The fleet availability rate is updated.
   * Under **Maintenance History**, the job record is marked `Completed` by technician *Rahul Sharma*.

### Step 5: Admin Assigns a New Job
1. In the top navigation bar, click the yellow **"+ Assign Job"** button.
2. Select:
   * **Aircraft:** `AF-01`
   * **Technician:** `Vikram Singh`
   * **Job Type:** `Hydraulic Actuator Calibration`
   * **Priority:** `Medium`
   * **Reason:** `Scheduled pre-flight pressure check`
3. Click **"Confirm & Assign Job"**.
4. Switch to **Vikram Singh** using the top navigation profile switcher. Notice his dashboard immediately displays the newly assigned task for `AF-01`!

---

## 9. Backend API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users` | Returns list of demo users (Admin & Technicians) |
| `GET` | `/api/aircraft` | Returns tactical fleet matrix & sensor metrics |
| `GET` | `/api/aircraft/:id` | Returns digital twin profile for a specific airframe |
| `GET` | `/api/alerts` | Returns active predictive anomaly alerts |
| `GET` | `/api/maintenance` | Returns full maintenance history and active work orders |
| `GET` | `/api/maintenance/technician/:techId` | Returns work orders filtered by technician |
| `POST` | `/api/maintenance` | Creates and assigns a new maintenance work order |
| `PATCH` | `/api/maintenance/:orderId/start` | Updates work order status to `In Progress` |
| `POST` | `/api/maintenance/:orderId/complete`| Submits inspection findings, signs off airworthiness, restores airframe |
| `GET` | `/api/spares` | Returns depot spare parts inventory & predictive demand flags |
| `GET` | `/api/analytics` | Returns fleet availability trajectory and reliability metrics |

---
*Developed for Smart India Hackathon 2026 — Defence Services Staff College (DSSC), Ministry of Defence.*
