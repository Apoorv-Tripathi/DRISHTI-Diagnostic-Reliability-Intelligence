// Realistic Synthetic Aerospace Dataset for SIH 2026 PS 26249
// Organization: Ministry of Defence (MoD) / Defence Services Staff College
// Role-Based Architecture: Fleet Admin + Specialized Maintenance Technicians

export const demoUsers = [
  {
    id: "admin-1",
    username: "arjun.mehta",
    name: "Arjun Mehta",
    role: "Admin",
    title: "Fleet Maintenance Administrator",
    department: "Directorate of Aerospace Maintenance (MoD / DSSC)",
    avatar: "AM"
  },
  {
    id: "tech-1",
    username: "rahul.sharma",
    name: "Rahul Sharma",
    role: "Technician",
    title: "Airframe & Powerplant Specialist",
    specialization: "Engine Turbofan & Powerplant",
    squadron: "No. 7 'Battleaxes' Maintenance Wing",
    base: "Ambala AFS",
    avatar: "RS"
  },
  {
    id: "tech-2",
    username: "vikram.singh",
    name: "Vikram Singh",
    role: "Technician",
    title: "Hydraulics & Flight Systems Specialist",
    specialization: "Hydraulic Systems & Actuators",
    squadron: "No. 45 'Flying Daggers' Maintenance Unit",
    base: "Sulur AFS",
    avatar: "VS"
  },
  {
    id: "tech-3",
    username: "aditya.verma",
    name: "Aditya Verma",
    role: "Technician",
    title: "Avionics & Radar Specialist",
    specialization: "Avionics, Radar & Mission Computers",
    squadron: "No. 1 'Tigers' Radar Maintenance Bay",
    base: "Gwalior AFS",
    avatar: "AV"
  },
  {
    id: "tech-4",
    username: "karan.gupta",
    name: "Karan Gupta",
    role: "Technician",
    title: "Fuel Systems & Propulsion Specialist",
    specialization: "Fuel Distribution & ECS Management",
    squadron: "No. 20 'Lightnings' Propulsion Flight",
    base: "Pune AFS",
    avatar: "KG"
  }
];

export const initialAircraft = [
  {
    aircraftId: "AF-04",
    callsign: "Vajra-04",
    type: "Air Superiority Fighter Mk-I",
    squadron: "No. 7 'Battleaxes' Sqn",
    airbase: "Ambala AFS",
    status: "Under Inspection",
    overallHealth: 74,
    totalFlightHours: 1435.5,
    flightCycles: 982,
    lastInspectionDate: "2026-10-04T06:30:00Z",
    nextScheduledCheck: "2026-10-15T00:00:00Z",
    riskLevel: "High",
    rulHours: 40.0,
    activeAlertCount: 1,
    subsystems: {
      engine: {
        name: "Turbofan Powerplant",
        health: 68,
        status: "Warning",
        vibrationLevel: 4.62, // mm/s (Normal: < 2.5)
        scavengeTemp: 118.4,  // °C (Normal: < 100)
        oilPressure: 44.2,    // PSI (Normal: 45-60)
        egtMargin: 38.5,      // °C (Normal: > 50)
        rpm: 14250,           // RPM (HP Spool N2)
        chipCount: 14,        // particles/hr
        details: "Abnormal engine vibration detected at 142.6 Hz (HP Spool harmonic). Boroscope inspection recommended."
      },
      hydraulic: {
        name: "Dual-Circuit Hydraulic System",
        health: 91,
        status: "Healthy",
        sysAPressure: 2980,  // PSI (Normal: 3000)
        sysBPressure: 3010,  // PSI (Normal: 3000)
        returnTemp: 58.2,    // °C (Normal: < 75)
        details: "Pressure stability nominal; zero return leakage detected"
      },
      avionics: {
        name: "Mission Avionics & Radar Rack",
        health: 88,
        status: "Healthy",
        busVoltage: 28.1,    // VDC (Normal: 28.0)
        rackTemp: 41.5,      // °C (Normal: < 55)
        bitFaults: 0,
        details: "BITE checks complete; datalink synchronised"
      },
      flightControls: {
        name: "Fly-by-Wire Flight Control Actuators",
        health: 94,
        status: "Healthy",
        actuatorStrain: 14.2,// % elastic limit
        surfaceDeflection: 0.1, // deg deviation
        details: "Servo feedback linear across all control channels"
      },
      fuelAndEcs: {
        name: "Fuel Management & Environmental Control",
        health: 85,
        status: "Healthy",
        pumpPressure: 52.8,  // PSI
        ecsPackTemp: 18.4,   // °C
        details: "Cross-feed valving verified; ECS cooling nominal"
      }
    }
  },
  {
    aircraftId: "AF-02",
    callsign: "Tejas-02",
    type: "Light Combat Aircraft LCA",
    squadron: "No. 45 'Flying Daggers' Sqn",
    airbase: "Sulur AFS",
    status: "Under Inspection",
    overallHealth: 78,
    totalFlightHours: 814.2,
    flightCycles: 540,
    lastInspectionDate: "2026-10-02T10:00:00Z",
    nextScheduledCheck: "2026-10-20T00:00:00Z",
    riskLevel: "High",
    rulHours: 110.0,
    activeAlertCount: 1,
    subsystems: {
      engine: {
        name: "Turbofan Powerplant",
        health: 92,
        status: "Healthy",
        vibrationLevel: 1.45,
        scavengeTemp: 84.5,
        oilPressure: 52.0,
        egtMargin: 64.0,
        rpm: 13900,
        details: "Combustion efficiency optimal; vibration within nominal band"
      },
      hydraulic: {
        name: "Dual-Circuit Hydraulic System",
        health: 73,
        status: "Warning",
        sysAPressure: 2990,
        sysBPressure: 2720, // Drops under high duty cycle
        returnTemp: 72.5,   // Elevated
        details: "Circuit-B return flow restriction; pump case drain elevated"
      },
      avionics: {
        name: "Mission Avionics & Radar Rack",
        health: 95,
        status: "Healthy",
        busVoltage: 28.0,
        rackTemp: 38.0,
        bitFaults: 0,
        details: "All LRUs green; EW suite operational"
      },
      flightControls: {
        name: "Fly-by-Wire Flight Control Actuators",
        health: 82,
        status: "Warning",
        actuatorStrain: 20.8,
        surfaceDeflection: 0.18,
        details: "Elevon actuator response shows minor 15ms transient lag"
      },
      fuelAndEcs: {
        name: "Fuel Management & Environmental Control",
        health: 92,
        status: "Healthy",
        pumpPressure: 55.0,
        ecsPackTemp: 16.5,
        details: "Fuel inerting system operational"
      }
    }
  },
  {
    aircraftId: "AF-05",
    callsign: "Trishul-05",
    type: "Tactical Interceptor Mirage-2000",
    squadron: "No. 1 'Tigers' Sqn",
    airbase: "Gwalior AFS",
    status: "Mission Capable",
    overallHealth: 94,
    totalFlightHours: 2150.0,
    flightCycles: 1410,
    lastInspectionDate: "2026-10-06T08:00:00Z",
    nextScheduledCheck: "2026-11-15T00:00:00Z",
    riskLevel: "Low",
    rulHours: 240.0,
    activeAlertCount: 0,
    subsystems: {
      engine: {
        name: "Afterburning Turbofan",
        health: 94,
        status: "Healthy",
        vibrationLevel: 1.60,
        scavengeTemp: 82.0,
        oilPressure: 51.5,
        egtMargin: 59.0,
        rpm: 14100,
        details: "Powerplant parameters nominal"
      },
      hydraulic: {
        name: "Dual-Circuit Hydraulic System",
        health: 92,
        status: "Healthy",
        sysAPressure: 3010,
        sysBPressure: 3000,
        returnTemp: 54.0,
        details: "Accumulator pre-charge verified at 1800 PSI"
      },
      avionics: {
        name: "Mission Avionics & Radar Rack",
        health: 96,
        status: "Healthy",
        busVoltage: 28.1,
        rackTemp: 38.5,
        bitFaults: 0,
        details: "Avionics inspection completed by Aditya Verma. All diagnostic self-tests PASSED."
      },
      flightControls: {
        name: "Fly-by-Wire Flight Control Actuators",
        health: 93,
        status: "Healthy",
        actuatorStrain: 10.5,
        surfaceDeflection: 0.06,
        details: "Canard and elevon mixing unit calibrated"
      },
      fuelAndEcs: {
        name: "Fuel Management & Environmental Control",
        health: 91,
        status: "Healthy",
        pumpPressure: 53.0,
        ecsPackTemp: 18.0,
        details: "Cockpit pressurisation schedule verified"
      }
    }
  },
  {
    aircraftId: "AF-03",
    callsign: "Garuda-03",
    type: "Twin-Engine Multirole Su-30M",
    squadron: "No. 20 'Lightnings' Sqn",
    airbase: "Pune AFS",
    status: "Under Inspection",
    overallHealth: 79,
    totalFlightHours: 1940.8,
    flightCycles: 1260,
    lastInspectionDate: "2026-09-29T14:00:00Z",
    nextScheduledCheck: "2026-10-25T00:00:00Z",
    riskLevel: "High",
    rulHours: 75.0,
    activeAlertCount: 1,
    subsystems: {
      engine: {
        name: "Twin Turbofan Powerplant",
        health: 89,
        status: "Healthy",
        vibrationLevel: 1.95,
        scavengeTemp: 88.0,
        oilPressure: 49.5,
        egtMargin: 53.0,
        rpm: 14050,
        details: "Port & Starboard spools synchronized within 0.6%"
      },
      hydraulic: {
        name: "Dual-Circuit Hydraulic System",
        health: 88,
        status: "Healthy",
        sysAPressure: 2985,
        sysBPressure: 2990,
        returnTemp: 59.0,
        details: "Main circuit pressures nominal"
      },
      avionics: {
        name: "Mission Avionics & Radar Rack",
        health: 90,
        status: "Healthy",
        busVoltage: 28.0,
        rackTemp: 42.0,
        bitFaults: 0,
        details: "Phased array radar calibration valid"
      },
      flightControls: {
        name: "Fly-by-Wire Flight Control Actuators",
        health: 87,
        status: "Healthy",
        actuatorStrain: 12.0,
        surfaceDeflection: 0.08,
        details: "Surface feedback within nominal envelope"
      },
      fuelAndEcs: {
        name: "Fuel Management & Environmental Control",
        health: 78,
        status: "Warning",
        pumpPressure: 46.5, // Lower than ideal (Normal: 48-58 PSI)
        ecsPackTemp: 23.5,
        details: "Transfer pump B transient pressure drop detected; flow differential alert."
      }
    }
  },
  {
    aircraftId: "AF-01",
    callsign: "Varun-01",
    type: "Maritime Strike Fighter Mk-II",
    squadron: "No. 6 'Dragons' Sqn",
    airbase: "Jamnagar AFS",
    status: "Mission Capable",
    overallHealth: 96,
    totalFlightHours: 720.5,
    flightCycles: 412,
    lastInspectionDate: "2026-10-05T08:00:00Z",
    nextScheduledCheck: "2026-11-20T00:00:00Z",
    riskLevel: "Low",
    rulHours: 320.0,
    activeAlertCount: 0,
    subsystems: {
      engine: {
        name: "Marine-Hardened Turbofan",
        health: 96,
        status: "Healthy",
        vibrationLevel: 1.15,
        scavengeTemp: 81.0,
        oilPressure: 54.0,
        egtMargin: 68.2,
        rpm: 13800,
        details: "Anti-corrosion coating intact; compressor blades pristine"
      },
      hydraulic: {
        name: "Dual-Circuit Hydraulic System",
        health: 96,
        status: "Healthy",
        sysAPressure: 3020,
        sysBPressure: 3015,
        returnTemp: 49.5,
        details: "Wing fold hydraulic locks tested successfully"
      },
      avionics: {
        name: "Maritime Search Radar & Sonobuoy Link",
        health: 95,
        status: "Healthy",
        busVoltage: 28.2,
        rackTemp: 36.5,
        bitFaults: 0,
        details: "Maritime radar multi-target tracking validated"
      },
      flightControls: {
        name: "Fly-by-Wire Flight Control Actuators",
        health: 96,
        status: "Healthy",
        actuatorStrain: 8.4,
        surfaceDeflection: 0.04,
        details: "Tailhook arrestor damping verified"
      },
      fuelAndEcs: {
        name: "Fuel Management & Environmental Control",
        health: 95,
        status: "Healthy",
        pumpPressure: 56.0,
        ecsPackTemp: 15.0,
        details: "Aerial refuelling probe seal pressure tested"
      }
    }
  }
];

export const initialAlerts = [
  {
    alertId: "ALT-2026-089",
    aircraftId: "AF-04",
    subsystem: "Engine",
    componentId: "COMP-ENG-7440",
    componentName: "High-Pressure Turbine Roller Bearing Assembly (Stage 2)",
    severity: "High",
    timestamp: "2026-10-06T08:14:00Z",
    anomalyDescription: "Synchronous 2X harmonic vibration spike at 142.6 Hz (+3.4σ above baseline); Scavenge oil temperature elevated to 118.4°C (+18.4°C above baseline); Magnetic chip detector detected microscopic ferrometallic particulates (count: 14 particles/hr).",
    detectionAlgorithm: "Spectral FFT Harmonic Tracking & Isolation Forest Multivariate Model",
    confidence: 94.8,
    rulEstimateHours: 40.0,
    rulConfidenceInterval: { min: 32.0, max: 48.0 },
    actionRecommendation: "Immediate boroscope inspection of turbine bearing cage within 12 flight hours. Order Bearing Replacement Kit (Part #ENG-BRG-7440). Assigned to Rahul Sharma.",
    requiredSpareParts: [
      {
        partNumber: "ENG-BRG-7440",
        name: "HP Turbine Roller Bearing Assembly Mk II",
        quantity: 1,
        availability: "Available at Central Depot Pune (2 units); Requisition staged for Ambala."
      },
      {
        partNumber: "ENG-SEAL-114",
        name: "Ceramic Interstage Turbine Gas Seal Kit",
        quantity: 2,
        availability: "In Stock at Ambala Store (6 units)."
      }
    ],
    status: "Active",
    workOrderId: "WO-2026-004"
  },
  {
    alertId: "ALT-2026-092",
    aircraftId: "AF-02",
    subsystem: "Hydraulics",
    componentId: "COMP-HYD-201",
    componentName: "Hydraulic System B Variable Displacement Primary Pump",
    severity: "Medium",
    timestamp: "2026-10-05T16:22:00Z",
    anomalyDescription: "Circuit-B return manifold pressure transient drop to 2,720 PSI during high-G flight loads; return fluid temperature elevated to 72.5°C.",
    detectionAlgorithm: "Dynamic Pressure Response Wavelet Decomposition",
    confidence: 91.2,
    rulEstimateHours: 110.0,
    rulConfidenceInterval: { min: 95.0, max: 125.0 },
    actionRecommendation: "Inspect hydraulic pump case drain flow and replace differential pressure filter. Assigned to Vikram Singh.",
    requiredSpareParts: [
      {
        partNumber: "HYD-PUMP-201",
        name: "Hydraulic Dual-Stage Variable Displacement Pump",
        quantity: 1,
        availability: "In Stock at Sulur Depot (2 units)."
      }
    ],
    status: "Active",
    workOrderId: "WO-2026-002"
  },
  {
    alertId: "ALT-2026-095",
    aircraftId: "AF-03",
    subsystem: "Fuel & ECS",
    componentId: "COMP-FUL-310",
    componentName: "Main Centerline Fuel Transfer Boost Pump B",
    severity: "Medium",
    timestamp: "2026-10-06T06:10:00Z",
    anomalyDescription: "Transfer pump discharge pressure transient drop to 46.5 PSI (-15% lower than nominal). Fuel differential pressure warning logged.",
    detectionAlgorithm: "Fuel Flow Gradient Regressor",
    confidence: 89.4,
    rulEstimateHours: 75.0,
    rulConfidenceInterval: { min: 60.0, max: 90.0 },
    actionRecommendation: "Inspect internal impeller wear and electrical harness impedance. Assigned to Karan Gupta.",
    requiredSpareParts: [
      {
        partNumber: "ENG-SEAL-114",
        name: "Ceramic Interstage Turbine Gas Seal Kit",
        quantity: 1,
        availability: "In Stock at Pune Depot (4 units)."
      }
    ],
    status: "Active",
    workOrderId: "WO-2026-003"
  }
];

export const initialWorkOrders = [
  {
    orderId: "WO-2026-004",
    aircraftId: "AF-04",
    aircraftType: "Air Superiority Fighter Mk-I",
    alertId: "ALT-2026-089",
    title: "Engine Health Inspection",
    jobType: "Engine Health Inspection",
    subsystem: "Engine Powerplant",
    componentName: "High-Pressure Turbine Roller Bearing Assembly (Stage 2)",
    priority: "High",
    status: "Assigned", // 'Assigned' | 'In Progress' | 'Completed'
    assignedTechnician: "Rahul Sharma",
    assignedTechnicianId: "tech-1",
    assignedBy: "Arjun Mehta (Fleet Administrator)",
    assignedDate: "2026-10-06T08:30:00Z",
    reason: "Abnormal engine vibration detected (4.62 mm/s at 142.6 Hz) with scavenge oil temperature elevation (118.4°C)",
    predictedRul: "~40 flight hours",
    station: "Ambala AFS - Bay 3",
    scheduledDate: "2026-10-06T09:00:00Z",
    completedDate: null,
    downtimeSavedEstimateHours: 48.0,
    sparesRequired: [
      { partNumber: "ENG-BRG-7440", partName: "HP Turbine Roller Bearing Assembly Mk II", quantity: 1, status: "Staged at Bay" },
      { partNumber: "ENG-SEAL-114", partName: "Ceramic Gas Seal Kit", quantity: 2, status: "Available" }
    ],
    sensorReadings: {
      vibration: "4.62 mm/s (Normal: < 2.5 mm/s)",
      temperature: "118.4°C (Normal: < 100°C)",
      pressure: "44.2 PSI (Normal: 45-60 PSI)",
      rpm: "14,250 RPM (98.2% N2 HP Spool)",
      egt: "608°C (Normal: 580°C)",
      chipDetector: "14 particles/hr (Alert threshold: 10)"
    },
    findings: "",
    actionTaken: "",
    technicianNotes: ""
  },
  {
    orderId: "WO-2026-002",
    aircraftId: "AF-02",
    aircraftType: "Light Combat Aircraft LCA",
    alertId: "ALT-2026-092",
    title: "Hydraulic System Check",
    jobType: "Hydraulic System Check",
    subsystem: "Dual-Circuit Hydraulic System",
    componentName: "Hydraulic System B Variable Displacement Pump",
    priority: "Medium",
    status: "In Progress",
    assignedTechnician: "Vikram Singh",
    assignedTechnicianId: "tech-2",
    assignedBy: "Arjun Mehta (Fleet Administrator)",
    assignedDate: "2026-10-05T17:00:00Z",
    reason: "Circuit-B return manifold pressure transient drop to 2,720 PSI under high load",
    predictedRul: "~110 flight hours",
    station: "Sulur AFS - Hangar 1",
    scheduledDate: "2026-10-06T07:30:00Z",
    completedDate: null,
    downtimeSavedEstimateHours: 24.0,
    sparesRequired: [
      { partNumber: "HYD-PUMP-201", partName: "Hydraulic Variable Displacement Pump", quantity: 1, status: "Available in Depot" }
    ],
    sensorReadings: {
      vibration: "1.45 mm/s (Nominal)",
      temperature: "72.5°C (Return Fluid Temp)",
      pressure: "2,720 PSI (Circuit B - Low)",
      rpm: "Nominal",
      egt: "580°C (Nominal)",
      chipDetector: "Clean"
    },
    findings: "Case drain flow benchmarked; filter differential pressure elevated.",
    actionTaken: "Purging circuit lines and preparing case drain filter swap.",
    technicianNotes: "Inspection in progress by Vikram Singh."
  },
  {
    orderId: "WO-2026-005",
    aircraftId: "AF-05",
    aircraftType: "Tactical Interceptor Mirage-2000",
    alertId: null,
    title: "Avionics Inspection",
    jobType: "Avionics Inspection",
    subsystem: "Mission Avionics & Radar Rack",
    componentName: "Radar Signal Processor & Transceiver LRU",
    priority: "Low",
    status: "Completed",
    assignedTechnician: "Aditya Verma",
    assignedTechnicianId: "tech-3",
    assignedBy: "Arjun Mehta (Fleet Administrator)",
    assignedDate: "2026-10-05T10:00:00Z",
    reason: "Scheduled 100-hour phase diagnostic and radar frequency synthesis check",
    predictedRul: "~240 flight hours",
    station: "Gwalior AFS - Avionics Bay 2",
    scheduledDate: "2026-10-06T06:00:00Z",
    completedDate: "2026-10-06T08:00:00Z",
    downtimeSavedEstimateHours: 18.0,
    sparesRequired: [],
    sensorReadings: {
      vibration: "1.60 mm/s (Nominal)",
      temperature: "38.5°C (Rack Temp - Optimal)",
      pressure: "Nominal",
      rpm: "Nominal",
      egt: "590°C (Nominal)",
      chipDetector: "Clean"
    },
    findings: "All LRU BITE diagnostic codes cleared. DC bus voltage stable at 28.1V. Zero radar transmitter RF power degradation.",
    actionTaken: "Executed full radar self-test, cleaned optical fiber junctions, and updated firmware to patch v4.2.1.",
    technicianNotes: "Inspection completed and certified. Aircraft declared Mission Capable by Aditya Verma."
  },
  {
    orderId: "WO-2026-003",
    aircraftId: "AF-03",
    aircraftType: "Twin-Engine Multirole Su-30M",
    alertId: "ALT-2026-095",
    title: "Fuel System Inspection",
    jobType: "Fuel System Inspection",
    subsystem: "Fuel Management & Environmental Control",
    componentName: "Main Centerline Fuel Transfer Boost Pump B",
    priority: "Medium",
    status: "Assigned",
    assignedTechnician: "Karan Gupta",
    assignedTechnicianId: "tech-4",
    assignedBy: "Arjun Mehta (Fleet Administrator)",
    assignedDate: "2026-10-06T07:00:00Z",
    reason: "Transfer pump discharge pressure transient drop to 46.5 PSI during fuel sequencing",
    predictedRul: "~75 flight hours",
    station: "Pune AFS - Bay 4",
    scheduledDate: "2026-10-06T11:00:00Z",
    completedDate: null,
    downtimeSavedEstimateHours: 20.0,
    sparesRequired: [
      { partNumber: "ENG-SEAL-114", partName: "Ceramic Gas Seal Kit", quantity: 1, status: "Available" }
    ],
    sensorReadings: {
      vibration: "1.95 mm/s (Nominal)",
      temperature: "23.5°C (ECS Pack)",
      pressure: "46.5 PSI (Transfer Pump - Low)",
      rpm: "Nominal",
      egt: "585°C (Nominal)",
      chipDetector: "Clean"
    },
    findings: "",
    actionTaken: "",
    technicianNotes: ""
  }
];

export const initialSpares = [
  {
    partNumber: "ENG-BRG-7440",
    name: "HP Turbine Roller Bearing Assembly Mk II",
    subsystem: "Engine",
    compatibleAircraft: ["AF-04", "AF-01", "AF-02"],
    criticality: "A - Mission Critical",
    depotStock: {
      centralDepotPune: 2,
      ambalaStore: 1,
      bareillyStore: 1,
      sulurStore: 0
    },
    totalAvailable: 4,
    minThreshold: 2,
    leadTimeDays: 1,
    unitCostINR: 1850000,
    requisitionStatus: "In Stock at Ambala",
    supplier: "HAL Engine Division / Koraput OEM"
  },
  {
    partNumber: "ENG-SEAL-114",
    name: "Ceramic Interstage Turbine Gas Seal Kit",
    subsystem: "Engine",
    compatibleAircraft: ["AF-04", "AF-02", "AF-03", "AF-01"],
    criticality: "B - Operational Essential",
    depotStock: {
      centralDepotPune: 12,
      ambalaStore: 6,
      bareillyStore: 4,
      sulurStore: 5
    },
    totalAvailable: 27,
    minThreshold: 10,
    leadTimeDays: 3,
    unitCostINR: 240000,
    requisitionStatus: "In Stock",
    supplier: "Aero Turbine Composites Ltd."
  },
  {
    partNumber: "HYD-PUMP-201",
    name: "Hydraulic Dual-Stage Variable Displacement Pump",
    subsystem: "Hydraulics",
    compatibleAircraft: ["AF-02", "AF-01"],
    criticality: "A - Mission Critical",
    depotStock: {
      centralDepotPune: 4,
      puneStore: 1,
      bareillyStore: 2,
      ambalaStore: 1
    },
    totalAvailable: 8,
    minThreshold: 4,
    leadTimeDays: 2,
    unitCostINR: 1420000,
    requisitionStatus: "In Stock",
    supplier: "FluidPower Aerospace Systems"
  },
  {
    partNumber: "AVN-HEX-510",
    name: "Radar Liquid Cooling Heat Exchanger Unit",
    subsystem: "Avionics",
    compatibleAircraft: ["AF-05", "AF-03"],
    criticality: "A - Mission Critical",
    depotStock: {
      centralDepotPune: 2,
      ambalaStore: 1,
      bareillyStore: 0,
      sulurStore: 0
    },
    totalAvailable: 3,
    minThreshold: 2,
    leadTimeDays: 5,
    unitCostINR: 2150000,
    requisitionStatus: "In Stock",
    supplier: "BEL Aerospace Electronics"
  },
  {
    partNumber: "ACT-SRV-908",
    name: "Primary Surface Electro-Hydraulic Servo Valve",
    subsystem: "Flight Controls",
    compatibleAircraft: ["AF-04", "AF-02", "AF-05"],
    criticality: "B - Operational Essential",
    depotStock: {
      centralDepotPune: 8,
      bidarStore: 4,
      ambalaStore: 2,
      sulurStore: 3
    },
    totalAvailable: 17,
    minThreshold: 6,
    leadTimeDays: 4,
    unitCostINR: 680000,
    requisitionStatus: "In Stock",
    supplier: "Precision Servo Actuation Ltd."
  },
  {
    partNumber: "FLT-SNSR-332",
    name: "Pitot-Static Multi-Function Air Data Sensor Probe",
    subsystem: "Avionics",
    compatibleAircraft: ["AF-04", "AF-02", "AF-03", "AF-05", "AF-01"],
    criticality: "B - Operational Essential",
    depotStock: {
      centralDepotPune: 6,
      ambalaStore: 3,
      sulurStore: 2,
      bareillyStore: 2
    },
    totalAvailable: 13,
    minThreshold: 5,
    leadTimeDays: 3,
    unitCostINR: 420000,
    requisitionStatus: "In Stock",
    supplier: "AeroSensor Dynamic Instruments"
  }
];

// Telemetry history generator for any aircraft
export const generateTelemetryHistory = (aircraftId = "AF-04") => {
  const points = [];
  const baseHour = 1410.0;
  const numPoints = 26;

  for (let i = 0; i < numPoints; i++) {
    const flightHour = +(baseHour + i * 1.0).toFixed(1);
    const date = new Date(Date.now() - (numPoints - i) * 6 * 3600 * 1000).toISOString();
    
    let vibration, egt, oilTemp, oilPressure, anomaly = false, status = "Nominal";

    if (aircraftId === "AF-04" || aircraftId === "AF-104") {
      if (i < 13) {
        vibration = +(1.5 + Math.sin(i * 0.7) * 0.18 + (Math.random() * 0.08)).toFixed(2);
        egt = +(580 + (Math.random() * 8)).toFixed(1);
        oilTemp = +(82.0 + (Math.random() * 2.5)).toFixed(1);
        oilPressure = +(52.0 + (Math.random() * 1.5)).toFixed(1);
      } else if (i < 21) {
        const progress = (i - 13) / 8;
        vibration = +(1.8 + progress * 1.1 + (Math.random() * 0.12)).toFixed(2);
        egt = +(588 + progress * 12 + (Math.random() * 6)).toFixed(1);
        oilTemp = +(84.0 + progress * 14 + (Math.random() * 3)).toFixed(1);
        oilPressure = +(51.0 - progress * 4 + (Math.random() * 1)).toFixed(1);
        status = "Deviation Drift";
      } else {
        const progress = (i - 21) / 4;
        vibration = +(3.1 + progress * 1.5 + (Math.random() * 0.15)).toFixed(2);
        egt = +(604 + progress * 16).toFixed(1);
        oilTemp = +(102.0 + progress * 16.4).toFixed(1);
        oilPressure = +(46.5 - progress * 2.3).toFixed(1);
        anomaly = true;
        status = "ANOMALY FLAGGED";
      }
    } else {
      // Normal baseline for healthy aircraft
      vibration = +(1.4 + Math.sin(i * 0.5) * 0.15).toFixed(2);
      egt = +(580 + (Math.random() * 6)).toFixed(1);
      oilTemp = +(82.0 + (Math.random() * 2)).toFixed(1);
      oilPressure = +(52.0 + (Math.random() * 1)).toFixed(1);
    }

    points.push({
      index: i + 1,
      timestamp: date,
      flightHour,
      vibration,
      baselineUpperThreshold: 2.50,
      criticalThreshold: 5.50,
      egt,
      oilTemp,
      oilPressure,
      anomaly,
      status
    });
  }

  // Future 6 predicted points (RUL Projection)
  const lastPoint = points[points.length - 1];
  const futurePoints = [];
  for (let j = 1; j <= 6; j++) {
    const flightHour = +(lastPoint.flightHour + j * 2.5).toFixed(1);
    const predictedVibration = +(lastPoint.vibration + (aircraftId === "AF-04" ? j * 0.38 : 0.05)).toFixed(2);
    const confLower = +(predictedVibration - 0.25).toFixed(2);
    const confUpper = +(predictedVibration + 0.32).toFixed(2);
    futurePoints.push({
      flightHour,
      predictedVibration,
      confLower,
      confUpper,
      criticalThreshold: 5.50
    });
  }

  return { history: points, projection: futurePoints };
};

export const fleetAnalyticsSummary = {
  totalAircraft: 5,
  missionCapableCount: 3,
  partiallyMissionCapableCount: 1,
  underInspectionCount: 1,
  awaitingSparesCount: 0,
  fleetAvailabilityRate: 80.0,
  targetAvailabilityRate: 85.0,
  unplannedDowntimeReductionPercent: 32.4,
  totalDowntimeHoursSavedLast90Days: 182.5,
  proactiveInterventionSuccessRate: 94.2,
  mttrHours: 6.8,
  mtbmHours: 124.0,
  subsystemFailureDistribution: [
    { subsystem: "Engine Turbofan", percentage: 38, incidentCount: 12, avgTurnaroundHrs: 18.5 },
    { subsystem: "Hydraulics Circuit", percentage: 26, incidentCount: 8, avgTurnaroundHrs: 7.2 },
    { subsystem: "Avionics & Radar", percentage: 18, incidentCount: 6, avgTurnaroundHrs: 11.0 },
    { subsystem: "Flight Controls", percentage: 12, incidentCount: 4, avgTurnaroundHrs: 5.4 },
    { subsystem: "Fuel & ECS", percentage: 6, incidentCount: 2, avgTurnaroundHrs: 4.0 }
  ],
  monthlyAvailabilityTrend: [
    { month: "May 2026", availability: 72.2, unplannedSnags: 9, predictedPrevented: 4 },
    { month: "Jun 2026", availability: 74.5, unplannedSnags: 8, predictedPrevented: 6 },
    { month: "Jul 2026", availability: 76.8, unplannedSnags: 6, predictedPrevented: 8 },
    { month: "Aug 2026", availability: 78.2, unplannedSnags: 5, predictedPrevented: 11 },
    { month: "Sep 2026", availability: 79.6, unplannedSnags: 3, predictedPrevented: 13 },
    { month: "Oct 2026", availability: 80.0, unplannedSnags: 2, predictedPrevented: 15 }
  ]
};
