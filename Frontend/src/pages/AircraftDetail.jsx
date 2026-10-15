import React, { useState, useEffect } from 'react';
import AircraftSilhouette from '../components/AircraftSilhouette.jsx';
import SensorTrendChart from '../components/SensorTrendChart.jsx';
import { fetchTelemetry } from '../services/api.js';
import {
  ArrowLeft,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  Activity,
  FileText,
  Radio,
  ExternalLink,
  Layers,
  Cpu,
  Package,
  ArrowRight,
  ShieldAlert,
  Flame,
  UserCheck,
  Plane,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  Sliders,
  Check,
  Compass,
  Zap,
  RotateCcw
} from 'lucide-react';

export default function AircraftDetail({
  aircraft,
  aircraftList = [],
  onSelectAircraft,
  alerts = [],
  workOrders = [],
  onNavigate,
  onOpenWorkOrderModal
}) {
  const [selectedSubsystem, setSelectedSubsystem] = useState('engine');
  const [telemetry, setTelemetry] = useState(null);
  const [showTwinningGuide, setShowTwinningGuide] = useState(true);

  useEffect(() => {
    if (aircraft) {
      fetchTelemetry(aircraft.aircraftId).then(data => setTelemetry(data));
    }
  }, [aircraft]);

  if (!aircraft) {
    return (
      <div className="container py-5 text-center text-muted">
        Select an aircraft from the dashboard to inspect its profile and digital twin.
      </div>
    );
  }

  const activeAlerts = alerts.filter(a => a.aircraftId === aircraft.aircraftId && a.status === 'Active');
  const aircraftWorkOrders = workOrders.filter(w => w.aircraftId === aircraft.aircraftId);

  // Status checks
  const isRestricted = aircraft.status !== 'Mission Capable';
  const pendingOrders = aircraftWorkOrders.filter(w => w.status !== 'Completed');
  const isAwaitingValidation = aircraftWorkOrders.some(w => w.status === 'Pending Command Validation');

  const dispatchRec = !isRestricted && pendingOrders.length === 0 && activeAlerts.length === 0
    ? 'Cleared for Combat Sortie'
    : isAwaitingValidation
      ? 'Awaiting Command Passing Order'
      : aircraft.status === 'Under Inspection'
        ? 'Restricted · Under Flight-Line Inspection'
        : aircraft.status === 'Under Maintenance'
          ? 'Restricted · Heavy Maintenance Overhaul'
          : 'Restricted · Unresolved Subsystem Anomaly';

  // Subsystem detailed parameters linked to genuine aircraft state
  const subsystemCatalog = {
    engine: {
      id: 'engine',
      title: 'Turbofan Powerplant (E-01)',
      spec: 'High-Bypass Axial Afterburning Turbofan',
      img: '/images/cad/cad-subsystem-engine.png',
      health: aircraft.subsystems?.engine?.health || 68,
      status: aircraft.subsystems?.engine?.status || 'Warning',
      details: aircraft.subsystems?.engine?.details || 'Turbine vibration spectral drift detected at 142.6 Hz (HP Spool harmonic).',
      vibration: aircraft.subsystems?.engine?.vibrationLevel ? `${aircraft.subsystems.engine.vibrationLevel} mm/s` : '4.62 mm/s',
      vibrationBaseline: '< 2.5 mm/s',
      temp: aircraft.subsystems?.engine?.scavengeTemp ? `${aircraft.subsystems.engine.scavengeTemp}°C` : '118.4°C',
      tempBaseline: '< 100°C',
      pressure: aircraft.subsystems?.engine?.oilPressure ? `${aircraft.subsystems.engine.oilPressure} PSI` : '44.2 PSI',
      pressureBaseline: '45–60 PSI',
      rpm: aircraft.subsystems?.engine?.rpm ? `${aircraft.subsystems.engine.rpm.toLocaleString()} RPM` : '14,250 RPM',
      rpmBaseline: '98.2% N2 Spool',
      spares: 'HP Turbine Roller Bearing Assembly (Part #ENG-BRG-7440)',
      spareStatus: 'Available at Central Depot Pune (2 Units)'
    },
    hydraulic: {
      id: 'hydraulic',
      title: 'Dual-Circuit Hydraulic System',
      spec: 'Quad-Redundant Closed-Loop Fluid Circuit',
      img: '/images/cad/cad-sub-hydraulics.png',
      health: aircraft.subsystems?.hydraulic?.health || 91,
      status: aircraft.subsystems?.hydraulic?.status || 'Healthy',
      details: aircraft.subsystems?.hydraulic?.details || 'Hydraulic circuit pressures nominal; zero fluid return leakage detected.',
      vibration: '1.45 mm/s',
      vibrationBaseline: '< 2.5 mm/s',
      temp: `${aircraft.subsystems?.hydraulic?.returnTemp || 58.2}°C`,
      tempBaseline: '< 75°C',
      pressure: `${aircraft.subsystems?.hydraulic?.sysAPressure || 2980} PSI`,
      pressureBaseline: '3,000 PSI',
      rpm: 'Nominal',
      rpmBaseline: 'Continuous Loop',
      spares: 'Hydraulic Variable Displacement Pump (Part #HYD-PUMP-201)',
      spareStatus: 'In Stock at Depot (3 Units)'
    },
    avionics: {
      id: 'avionics',
      title: 'Mission Avionics & AESA Radar',
      spec: 'Active Electronically Scanned Array & Bus Controller',
      img: '/images/cad/cad-sub-avionics.png',
      health: aircraft.subsystems?.avionics?.health || 88,
      status: aircraft.subsystems?.avionics?.status || 'Healthy',
      details: aircraft.subsystems?.avionics?.details || 'MIL-STD-1553B digital databus synchronized. BITE diagnostics cleared.',
      vibration: 'Nominal',
      vibrationBaseline: '< 1.8 mm/s',
      temp: `${aircraft.subsystems?.avionics?.rackTemp || 41.5}°C`,
      tempBaseline: '< 55°C',
      pressure: 'Nominal',
      pressureBaseline: '1 ATM Pressurized',
      rpm: `${aircraft.subsystems?.avionics?.busVoltage || 28.1} VDC`,
      rpmBaseline: '28.0 VDC Regulated',
      spares: 'Radar Signal Processor LRU (Part #RADAR-TRX-04)',
      spareStatus: 'Stocked at Central Stores'
    },
    fuelAndEcs: {
      id: 'fuelAndEcs',
      title: 'Fuel Management & ECS Pack',
      spec: 'Cross-Feed Digital Valving & Cockpit Pressurization',
      img: '/images/cad/cad-sub-fuel.png',
      health: aircraft.subsystems?.fuelAndEcs?.health || 85,
      status: aircraft.subsystems?.fuelAndEcs?.status || 'Healthy',
      details: aircraft.subsystems?.fuelAndEcs?.details || 'Fuel inerting system operational. Boost pump delivery nominal.',
      vibration: 'Nominal',
      vibrationBaseline: '< 2.0 mm/s',
      temp: `${aircraft.subsystems?.fuelAndEcs?.ecsPackTemp || 18.4}°C`,
      tempBaseline: '< 25°C',
      pressure: `${aircraft.subsystems?.fuelAndEcs?.pumpPressure || 52.8} PSI`,
      pressureBaseline: '50–55 PSI',
      rpm: 'Nominal',
      rpmBaseline: 'Continuous Feed',
      spares: 'Centerline Fuel Transfer Pump (Part #FUEL-VALVE-302)',
      spareStatus: 'Available (4 Units)'
    },
    electrical: {
      id: 'electrical',
      title: 'Electrical Generation & APU',
      spec: 'Brushless Alternators & Auxiliary Power Unit',
      img: '/images/cad/cad-sub-electrical.png',
      health: 89,
      status: 'Healthy',
      details: 'Dual integrated drive generators synchronized. APU emergency starting ready.',
      vibration: 'Nominal',
      vibrationBaseline: '< 2.0 mm/s',
      temp: '48.0°C',
      tempBaseline: '< 65°C',
      pressure: '28.2 VDC',
      pressureBaseline: '28.0 VDC',
      rpm: '400 Hz / 115 VAC',
      rpmBaseline: 'Constant Frequency',
      spares: 'Brushless Alternator Rotor (Part #ELEC-GEN-102)',
      spareStatus: 'In Stock (2 Units)'
    }
  };

  const activeSub = subsystemCatalog[selectedSubsystem] || subsystemCatalog.engine;

  return (
    <div className="container-fluid px-3 px-md-4 py-3" style={{ maxWidth: '1400px' }}>

      {/* ── 1. Top Header Row & Airframe Selector ── */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3 pt-1">
        {/* Left: Back Button + Aircraft Identification */}
        <div className="d-flex align-items-center gap-3">
          <button
            onClick={() => onNavigate('fleet')}
            className="btn btn-sm d-flex align-items-center justify-content-center"
            title="Back to Fleet Overview"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              color: '#374151'
            }}
          >
            <ArrowLeft size={16} />
          </button>

          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                Fleet Operations / Airframe Twin
              </span>
              <span style={{ color: '#E5E7EB' }}>•</span>
              <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 500 }}>
                {aircraft.squadron} · {aircraft.airbase}
              </span>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-2">
              <h1 style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#111827',
                letterSpacing: '-0.025em',
                lineHeight: 1.25,
                margin: 0
              }}>
                {aircraft.callsign ? `${aircraft.callsign} — ${aircraft.type}` : aircraft.type}
              </h1>

              {/* Fast Fleet Airframe Switcher Dropdown */}
              {aircraftList.length > 0 && onSelectAircraft && (
                <div className="d-inline-flex align-items-center ms-md-2">
                  <select
                    value={aircraft.aircraftId}
                    onChange={(e) => onSelectAircraft(e.target.value)}
                    style={{
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      background: '#FFFFFF',
                      color: '#111827',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                    title="Switch Airframe Twin"
                  >
                    {aircraftList.map(ac => (
                      <option key={ac.aircraftId} value={ac.aircraftId}>
                        {ac.aircraftId} ({ac.callsign || ac.type})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Operational Status Pill + Work Order Trigger */}
        <div className="d-flex flex-wrap align-items-center gap-2">
          {/* Status Badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.76rem',
              fontWeight: 600,
              padding: '0.4rem 0.85rem',
              borderRadius: '999px',
              background: aircraft.status === 'Mission Capable' ? '#ECFDF5' : '#FEF2F2',
              color: aircraft.status === 'Mission Capable' ? '#065F46' : '#991B1B',
              border: `1px solid ${aircraft.status === 'Mission Capable' ? '#A7F3D0' : '#FECACA'}`
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: aircraft.status === 'Mission Capable' ? '#059669' : '#DC2626'
              }}
            ></span>
            <span>{aircraft.status}</span>
          </span>

          {/* Guide Toggle Button */}
          <button
            onClick={() => setShowTwinningGuide(!showTwinningGuide)}
            className="btn btn-sm d-flex align-items-center gap-1.5"
            style={{
              fontSize: '0.78rem',
              fontWeight: 500,
              padding: '0.42rem 0.85rem',
              borderRadius: '8px',
              background: showTwinningGuide ? '#F3F4F6' : '#FFFFFF',
              border: '1px solid #E5E7EB',
              color: '#374151'
            }}
          >
            <Info size={14} color="#6B7280" />
            <span>{showTwinningGuide ? 'Hide Guide' : 'Digital Twinning Guide'}</span>
          </button>

          {/* Issue Directive Button */}
          <button
            onClick={() => onOpenWorkOrderModal(null, aircraft.aircraftId)}
            className="btn btn-sm d-flex align-items-center gap-1.5 shadow-sm"
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              background: '#111827',
              border: 'none',
              color: '#FFFFFF'
            }}
          >
            <Wrench size={14} />
            <span>{isRestricted ? 'Issue Directives / Work Order' : 'Schedule Inspection'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. Comprehensive Educational & Operational Guide to Digital Twinning ── */}
      {showTwinningGuide && (
        <div
          className="mb-3 p-3.5 rounded-3"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <Sparkles size={16} color="#D97706" />
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#111827' }}>
                Airframe Digital Twinning: Architecture, Purpose &amp; Operational Instructions
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              Complies with ISO-13374 Condition Monitoring &amp; MIL-STD-1553B
            </span>
          </div>

          <div className="row g-3">
            {/* What is Digital Twinning? */}
            <div className="col-12 col-md-4">
              <div
                className="p-3 rounded-2 h-100"
                style={{ background: '#F9FAFB', border: '1px solid #F3F4F6' }}
              >
                <div className="d-flex align-items-center gap-2 mb-1.5">
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: '#111827',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}
                  >
                    1
                  </div>
                  <strong style={{ fontSize: '0.82rem', color: '#111827' }}>What is the Digital Twin?</strong>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#6B7280', margin: 0, lineHeight: 1.45 }}>
                  A high-fidelity computational model of airframe <strong style={{ color: '#111827' }}>{aircraft.aircraftId}</strong> continuously synchronized with real-time 20 Hz avionics databus packets, solid-state flight recorders (SSFDR), and structural strain sensors.
                </p>
              </div>
            </div>

            {/* Why Are We Doing This? */}
            <div className="col-12 col-md-4">
              <div
                className="p-3 rounded-2 h-100"
                style={{ background: '#F9FAFB', border: '1px solid #F3F4F6' }}
              >
                <div className="d-flex align-items-center gap-2 mb-1.5">
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: '#111827',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}
                  >
                    2
                  </div>
                  <strong style={{ fontSize: '0.82rem', color: '#111827' }}>Why Digital Twinning?</strong>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#6B7280', margin: 0, lineHeight: 1.45 }}>
                  To replace reactive maintenance with <strong>Condition-Based Maintenance (CBM+)</strong>. It forecasts micro-bearing wear, thermal drift, and aerodynamic fatigue long before physical failures, reducing unscheduled depot groundings by over 60%.
                </p>
              </div>
            </div>

            {/* How to Use It */}
            <div className="col-12 col-md-4">
              <div
                className="p-3 rounded-2 h-100"
                style={{ background: '#F9FAFB', border: '1px solid #F3F4F6' }}
              >
                <div className="d-flex align-items-center gap-2 mb-1.5">
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: '#111827',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}
                  >
                    3
                  </div>
                  <strong style={{ fontSize: '0.82rem', color: '#111827' }}>How to Use this Interface</strong>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#6B7280', margin: 0, lineHeight: 1.45 }}>
                  • Toggle <strong>3D Exterior</strong>, <strong>Cutaway</strong>, or <strong>FEA Heatmap</strong> views.<br />
                  • Click <strong>Subsystem Hotspots</strong> to isolate live sensor readings.<br />
                  • Click <strong>Run 20Hz Dynamics</strong> to test flight load harmonics.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Diagnostic Telemetry Ribbon ── */}
      <div
        className="p-2.5 px-3 mb-3 rounded-2 d-flex flex-wrap justify-content-between align-items-center gap-2"
        style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', fontSize: '0.76rem' }}
      >
        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isRestricted ? '#DC2626' : '#059669'
            }}
          ></span>
          <span style={{ color: '#9CA3AF' }}>Diagnostic Telemetry:</span>
          <strong style={{ color: '#111827' }}>
            {isRestricted ? 'Ground Test / Hangar Diagnostics (20 Hz Link)' : 'Airborne Sortie Ready (20 Hz Telemetry)'}
          </strong>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-4" style={{ color: '#6B7280' }}>
          <div>
            <span style={{ color: '#9CA3AF' }}>Altitude:</span> <strong style={{ color: '#111827', fontFamily: 'var(--font-mono)' }}>28,000 ft</strong>
          </div>
          <div>
            <span style={{ color: '#9CA3AF' }}>Airspeed:</span> <strong style={{ color: '#111827', fontFamily: 'var(--font-mono)' }}>420 kts</strong>
          </div>
          <div>
            <span style={{ color: '#9CA3AF' }}>G-Load:</span> <strong style={{ color: '#111827', fontFamily: 'var(--font-mono)' }}>+2.4 G</strong>
          </div>
          <div className="d-none d-lg-inline">
            <span style={{ color: '#9CA3AF' }}>Position:</span> <strong style={{ color: '#111827', fontFamily: 'var(--font-mono)' }}>28.6139° N, 77.2090° E (HDG 092°)</strong>
          </div>
        </div>
      </div>

      {/* ── 4. Upper Section: 3D CAD Twin (8 cols) + Aircraft Profile & Technical Ledger (4 cols) ── */}
      <div className="row g-3 mb-3">
        {/* Left: Enhanced 3D CAD Digital Twin */}
        <div className="col-12 col-lg-8">
          <AircraftSilhouette
            aircraft={aircraft}
            selectedSubsystem={selectedSubsystem}
            onSelectSubsystem={(id) => setSelectedSubsystem(id)}
          />
        </div>

        {/* Right: Aircraft Profile Ledger & Airworthiness Dispatch */}
        <div className="col-12 col-lg-4">
          <div
            className="p-3 h-100 d-flex flex-column justify-content-between rounded-3"
            style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
          >
            <div>
              {/* Card Header */}
              <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#111827' }}>
                  Airframe Technical Ledger
                </span>
                <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                  IAF DSSC · MoD Verified
                </span>
              </div>

              {/* Aero Profile Thumbnail */}
              <div
                className="text-center p-2 mb-3 rounded-2"
                style={{ background: '#F8FAFC', border: '1px solid #E5E7EB' }}
              >
                <img
                  src="/images/cad/cad-aircraft-top-tally-vert.jpg"
                  alt="Aero Planform"
                  className="img-fluid rounded"
                  style={{ maxHeight: '110px', objectFit: 'contain' }}
                />
                <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: '4px' }}>
                  Wing Geometry &amp; Sensor Coordinates
                </div>
              </div>

              {/* Specs Grid */}
              <div className="row g-2 mb-3" style={{ fontSize: '0.78rem' }}>
                <div className="col-6">
                  <span style={{ fontSize: '0.7rem', color: '#9CA3AF', display: 'block' }}>Manufacturer:</span>
                  <strong style={{ color: '#111827' }}>HAL / IAF Koraput</strong>
                </div>
                <div className="col-6">
                  <span style={{ fontSize: '0.7rem', color: '#9CA3AF', display: 'block' }}>Airframe Type:</span>
                  <strong style={{ color: '#111827' }}>{aircraft.type}</strong>
                </div>
                <div className="col-6">
                  <span style={{ fontSize: '0.7rem', color: '#9CA3AF', display: 'block' }}>Total Flight Hours:</span>
                  <strong style={{ color: '#111827', fontFamily: 'var(--font-mono)' }}>{aircraft.totalFlightHours} FH</strong>
                </div>
                <div className="col-6">
                  <span style={{ fontSize: '0.7rem', color: '#9CA3AF', display: 'block' }}>Sortie Cycles:</span>
                  <strong style={{ color: '#111827', fontFamily: 'var(--font-mono)' }}>{aircraft.flightCycles} Sorties</strong>
                </div>
              </div>

              {/* Dispatch Recommendation Box */}
              <div
                className="p-3 rounded-2 mb-2"
                style={{
                  background: isRestricted ? '#FEF2F2' : '#F0FDF4',
                  border: `1px solid ${isRestricted ? '#FECACA' : '#BBF7D0'}`
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: isRestricted ? '#991B1B' : '#166534' }}>
                    Air Command Dispatch Status
                  </span>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: isRestricted ? '#DC2626' : '#059669' }}>
                    {aircraft.overallHealth}% Health
                  </span>
                </div>
                <div style={{
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: isRestricted ? '#DC2626' : '#059669',
                  marginBottom: '4px'
                }}>
                  {dispatchRec}
                </div>
                <p style={{ fontSize: '0.72rem', color: '#6B7280', margin: 0, lineHeight: 1.4 }}>
                  {isRestricted
                    ? 'Flight sortie authorization withheld pending qualified engineering sign-off on open work order.'
                    : 'All subsystems within nominal operational envelope. Cleared for flight line mission release.'}
                </p>
              </div>
            </div>

            {/* Quick Link to Work Orders */}
            <div className="pt-2 border-top">
              <button
                onClick={() => onNavigate('maintenance')}
                className="btn btn-sm btn-light w-100 d-flex align-items-center justify-content-center gap-1.5 border"
                style={{ fontSize: '0.78rem', color: '#374151', padding: '0.45rem' }}
              >
                <FileText size={13} />
                <span>View Squadron Work Orders ({aircraftWorkOrders.length}) →</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Middle Section: Selected Subsystem Live Engineering Inspector ── */}
      <div
        className="p-3 px-4 mb-3 rounded-3"
        style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0 }}>
              {activeSub.title}
            </h4>
            <span style={{ fontSize: '0.76rem', color: '#9CA3AF' }}>
              [{activeSub.spec}]
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                background: activeSub.status === 'Warning' || activeSub.status === 'Critical' ? '#FEF2F2' : '#ECFDF5',
                color: activeSub.status === 'Warning' || activeSub.status === 'Critical' ? '#991B1B' : '#065F46',
                border: `1px solid ${activeSub.status === 'Warning' || activeSub.status === 'Critical' ? '#FECACA' : '#A7F3D0'}`
              }}
            >
              ● {activeSub.status} ({activeSub.health}% Health)
            </span>
          </div>
        </div>

        <div className="row g-3 align-items-center">
          {/* Col 1: High-Definition 3D CAD Component Cutaway */}
          <div className="col-12 col-md-3 text-center">
            <div
              className="p-2 rounded-2 d-flex align-items-center justify-content-center position-relative"
              style={{ background: '#F8FAFC', border: '1px solid #E5E7EB', minHeight: '120px' }}
            >
              <img
                src={activeSub.img}
                alt={activeSub.title}
                className="img-fluid"
                style={{ maxHeight: '110px', objectFit: 'contain' }}
              />
              <span
                className="position-absolute text-muted"
                style={{ bottom: '4px', right: '8px', fontSize: '0.64rem', fontFamily: 'var(--font-mono)' }}
              >
                3D CAD TWIN
              </span>
            </div>
          </div>

          {/* Col 2: Live Physical Sensor Telemetry Readouts */}
          <div className="col-12 col-md-5">
            <div className="row g-2" style={{ fontSize: '0.76rem' }}>
              <div className="col-6">
                <div className="p-2 rounded-2 border" style={{ background: '#F9FAFB', borderColor: '#E5E7EB' }}>
                  <div className="d-flex justify-content-between">
                    <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Vibration:</span>
                    <span style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>{activeSub.vibrationBaseline}</span>
                  </div>
                  <strong style={{
                    fontSize: '0.88rem',
                    fontFamily: 'var(--font-mono)',
                    color: activeSub.vibration.includes('4.') || activeSub.vibration.includes('5.') ? '#DC2626' : '#111827'
                  }}>
                    {activeSub.vibration}
                  </strong>
                </div>
              </div>

              <div className="col-6">
                <div className="p-2 rounded-2 border" style={{ background: '#F9FAFB', borderColor: '#E5E7EB' }}>
                  <div className="d-flex justify-content-between">
                    <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Temperature:</span>
                    <span style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>{activeSub.tempBaseline}</span>
                  </div>
                  <strong style={{ fontSize: '0.88rem', fontFamily: 'var(--font-mono)', color: '#111827' }}>
                    {activeSub.temp}
                  </strong>
                </div>
              </div>

              <div className="col-6">
                <div className="p-2 rounded-2 border" style={{ background: '#F9FAFB', borderColor: '#E5E7EB' }}>
                  <div className="d-flex justify-content-between">
                    <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Pressure / Bus:</span>
                    <span style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>{activeSub.pressureBaseline}</span>
                  </div>
                  <strong style={{ fontSize: '0.88rem', fontFamily: 'var(--font-mono)', color: '#111827' }}>
                    {activeSub.pressure}
                  </strong>
                </div>
              </div>

              <div className="col-6">
                <div className="p-2 rounded-2 border" style={{ background: '#F9FAFB', borderColor: '#E5E7EB' }}>
                  <div className="d-flex justify-content-between">
                    <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>RPM / Frequency:</span>
                    <span style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>{activeSub.rpmBaseline}</span>
                  </div>
                  <strong style={{ fontSize: '0.88rem', fontFamily: 'var(--font-mono)', color: '#111827' }}>
                    {activeSub.rpm}
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-2" style={{ fontSize: '0.74rem', color: '#6B7280', lineHeight: 1.45 }}>
              <strong style={{ color: '#374151' }}>Diagnostic Status:</strong> {activeSub.details}
            </div>
          </div>

          {/* Col 3: Connected Depot Spares Logistics */}
          <div className="col-12 col-md-4">
            <div className="p-3 rounded-2 h-100" style={{ background: '#F8FAFC', border: '1px solid #E5E7EB' }}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#111827' }}>
                  Connected Depot Spares
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    padding: '0.12rem 0.45rem',
                    borderRadius: '4px',
                    background: '#ECFDF5',
                    color: '#065F46',
                    border: '1px solid #A7F3D0'
                  }}
                >
                  LRU Ready
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>
                {activeSub.spares}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                ● {activeSub.spareStatus}
              </div>
              <div className="mt-2 pt-2 border-top d-flex justify-content-between align-items-center">
                <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Lead Time: 48h</span>
                <button
                  onClick={() => onNavigate('spares')}
                  className="btn btn-sm btn-link p-0 text-decoration-none fw-semibold"
                  style={{ color: '#111827', fontSize: '0.74rem' }}
                >
                  View in Logistics →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. Lower Section: Airframe Maintenance Orders (6 cols) + Real Harmonic Sensor Trend (6 cols) ── */}
      <div className="row g-3">
        {/* Left: Airframe Work Orders Roster */}
        <div className="col-12 col-lg-6">
          <div
            className="p-3 h-100 rounded-3"
            style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <Wrench size={15} color="#111827" />
                <h6 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                  {aircraft.aircraftId} Maintenance Directives ({aircraftWorkOrders.length})
                </h6>
              </div>
              <button
                onClick={() => onOpenWorkOrderModal(null, aircraft.aircraftId)}
                className="btn btn-sm btn-dark"
                style={{ fontSize: '0.74rem', padding: '0.28rem 0.75rem', borderRadius: '6px' }}
              >
                + New Directive
              </button>
            </div>

            {aircraftWorkOrders.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {aircraftWorkOrders.map(wo => (
                  <div
                    key={wo.orderId}
                    className="p-2.5 rounded-2 d-flex justify-content-between align-items-center"
                    style={{ background: '#F8FAFC', border: '1px solid #E5E7EB', fontSize: '0.76rem' }}
                  >
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-0.5">
                        <strong style={{ color: '#111827', fontFamily: 'var(--font-mono)' }}>{wo.orderId}</strong>
                        <span
                          style={{
                            fontSize: '0.64rem',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            background: wo.priority === 'High' ? '#FEF2F2' : '#F3F4F6',
                            color: wo.priority === 'High' ? '#991B1B' : '#374151',
                            fontWeight: 600
                          }}
                        >
                          {wo.priority}
                        </span>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            padding: '0.1rem 0.45rem',
                            borderRadius: '999px',
                            background: wo.status === 'Completed' ? '#ECFDF5' : '#FFFBEB',
                            color: wo.status === 'Completed' ? '#065F46' : '#92400E',
                            border: `1px solid ${wo.status === 'Completed' ? '#A7F3D0' : '#FDE68A'}`,
                            fontWeight: 600
                          }}
                        >
                          {wo.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                        {wo.title || wo.jobType} · Specialist: <strong style={{ color: '#374151' }}>{wo.assignedTechnician}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('maintenance')}
                      className="btn btn-sm btn-light border"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem', borderRadius: '4px' }}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted" style={{ fontSize: '0.78rem' }}>
                No active maintenance directives logged for this airframe.
              </div>
            )}
          </div>
        </div>

        {/* Right: Real Harmonic Sensor Degradation Trace */}
        <div className="col-12 col-lg-6">
          <div
            className="p-3 h-100 rounded-3"
            style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <Activity size={15} color="#111827" />
                <h6 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                  {aircraft.aircraftId} Sensor Degradation Trace &amp; RUL
                </h6>
              </div>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  padding: '0.12rem 0.45rem',
                  borderRadius: '4px',
                  background: '#F3F4F6',
                  color: '#374151'
                }}
              >
                FFT Harmonic Tracking
              </span>
            </div>

            {telemetry ? (
              <div style={{ height: '240px' }}>
                <SensorTrendChart
                  telemetryData={telemetry}
                  title={`${aircraft.aircraftId} Subsystem Sensor Harmonic Trend`}
                />
              </div>
            ) : (
              <div className="p-4 text-center text-muted" style={{ fontSize: '0.78rem' }}>
                Connecting to 20Hz SSFDR sensor telemetry bus...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
