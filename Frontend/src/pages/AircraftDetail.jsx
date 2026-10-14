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
  UserCheck
} from 'lucide-react';

export default function AircraftDetail({
  aircraft,
  alerts = [],
  workOrders = [],
  onNavigate,
  onOpenWorkOrderModal
}) {
  const [selectedSubsystem, setSelectedSubsystem] = useState('engine');
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    if (aircraft) {
      fetchTelemetry(aircraft.aircraftId).then(data => setTelemetry(data));
    }
  }, [aircraft]);

  if (!aircraft) {
    return (
      <div className="container py-5 text-center text-muted font-mono-tech">
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
        ? 'GROUNDED — Under Flight-Line Inspection'
        : aircraft.status === 'Under Maintenance'
          ? 'GROUNDED — Heavy Maintenance Depot'
          : 'RESTRICTED — Unresolved Subsystem Anomaly';

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
      temp: aircraft.subsystems?.engine?.scavengeTemp ? `${aircraft.subsystems.engine.scavengeTemp}°C` : '118.4°C',
      pressure: aircraft.subsystems?.engine?.oilPressure ? `${aircraft.subsystems.engine.oilPressure} PSI` : '44.2 PSI',
      rpm: aircraft.subsystems?.engine?.rpm ? `${aircraft.subsystems.engine.rpm.toLocaleString()} RPM` : '14,250 RPM',
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
      temp: `${aircraft.subsystems?.hydraulic?.returnTemp || 58.2}°C`,
      pressure: `${aircraft.subsystems?.hydraulic?.sysAPressure || 2980} PSI`,
      rpm: 'Nominal',
      spares: 'Hydraulic Variable Displacement Pump (Part #HYD-PUMP-201)',
      spareStatus: 'In Stock at Depot'
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
      temp: `${aircraft.subsystems?.avionics?.rackTemp || 41.5}°C`,
      pressure: 'Nominal',
      rpm: `${aircraft.subsystems?.avionics?.busVoltage || 28.1} VDC`,
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
      temp: `${aircraft.subsystems?.fuelAndEcs?.ecsPackTemp || 18.4}°C`,
      pressure: `${aircraft.subsystems?.fuelAndEcs?.pumpPressure || 52.8} PSI`,
      rpm: 'Nominal',
      spares: 'Centerline Fuel Transfer Pump (Part #FUEL-VALVE-302)',
      spareStatus: 'Available'
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
      temp: '48.0°C',
      pressure: '28.2 VDC',
      rpm: '400 Hz / 115 VAC',
      spares: 'Brushless Alternator Rotor (Part #ELEC-GEN-102)',
      spareStatus: 'In Stock'
    }
  };

  const activeSub = subsystemCatalog[selectedSubsystem] || subsystemCatalog.engine;

  return (
    <div className="container-fluid px-3 px-md-4 py-3" style={{ maxWidth: '1440px' }}>
      
      {/* 1. TOP HEADER ROW */}
      <div className="skyline-card p-3 mb-3" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          {/* Left: Back Arrow + Aircraft Title */}
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={() => onNavigate('fleet')}
              className="skyline-icon-btn d-flex align-items-center justify-content-center"
              title="Back to Fleet Overview"
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F1F5F9', border: '1px solid #E2E8F0' }}
            >
              <ArrowLeft size={16} />
            </button>

            <div>
              <div className="d-flex align-items-center gap-2 mb-0.5">
                <span className="skyline-pill skyline-pill-dark font-mono-tech" style={{ fontSize: '0.65rem' }}>
                  {aircraft.aircraftId}
                </span>
                <span className="text-secondary small font-sans fw-semibold" style={{ fontSize: '0.78rem' }}>
                  {aircraft.squadron} • {aircraft.airbase}
                </span>
              </div>
              <h3 className="fw-bold mb-0 text-dark font-sans" style={{ letterSpacing: '-0.02em', fontSize: '1.45rem' }}>
                {aircraft.callsign ? `${aircraft.callsign} — ${aircraft.type}` : aircraft.type}
              </h3>
            </div>
          </div>

          {/* Right: Operational Status Pill + Work Order Trigger */}
          <div className="d-flex flex-wrap align-items-center gap-3">
            <div className="text-end font-mono-tech d-none d-md-block">
              <span className="text-muted d-block" style={{ fontSize: '0.66rem' }}>OPERATIONAL STATUS:</span>
              <span 
                className="fw-bold px-2.5 py-1 rounded-pill d-inline-block"
                style={{ 
                  fontSize: '0.74rem',
                  background: aircraft.status === 'Mission Capable' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: aircraft.status === 'Mission Capable' ? '#059669' : '#DC2626',
                  border: `1px solid ${aircraft.status === 'Mission Capable' ? '#10B981' : '#EF4444'}`
                }}
              >
                ● {aircraft.status.toUpperCase()}
              </span>
            </div>

            <button
              onClick={() => onOpenWorkOrderModal(null, aircraft.aircraftId)}
              className="skyline-btn-dark d-flex align-items-center gap-1.5 shadow-sm"
              style={{ fontSize: '0.8rem', padding: '0.5rem 1.1rem' }}
            >
              <Wrench size={14} />
              <span>{isRestricted ? 'Issue Directives / Work Order' : 'Schedule Inspection'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME FLIGHT ENVIRONMENT & DIAGNOSTIC MODE STRIP */}
      <div className="skyline-card p-2.5 px-3 mb-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.76rem' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 font-mono-tech">
          <div className="d-flex align-items-center gap-2">
            <span className="badge rounded-circle p-1" style={{ backgroundColor: isRestricted ? '#DC2626' : '#10B981', width: '8px', height: '8px' }}></span>
            <span className="text-muted">DIAGNOSTIC TELEMETRY:</span>
            <strong className="text-dark">
              {isRestricted ? 'GROUND TEST / HANGAR DIAGNOSTICS [20Hz]' : 'AIRBORNE SORTIE READY [20Hz]'}
            </strong>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-4 text-secondary">
            <div>
              <span className="text-muted">ALTITUDE:</span> <strong className="text-dark">28,000 ft</strong>
            </div>
            <div>
              <span className="text-muted">AIRSPEED:</span> <strong className="text-dark">420 kts</strong>
            </div>
            <div>
              <span className="text-muted">G-LOAD:</span> <strong className="text-dark">+2.4 G</strong>
            </div>
            <div className="d-none d-lg-inline">
              <span className="text-muted">GRID:</span> <strong className="text-dark">28.6139° N, 77.2090° E (HDG 092°)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. UPPER SECTION: 3D CAD Twin (8 cols) + Aircraft Profile & Certification (4 cols) */}
      <div className="row g-3 mb-3">
        {/* Left: Streamlined 3D CAD Digital Twin */}
        <div className="col-12 col-lg-8">
          <AircraftSilhouette
            aircraft={aircraft}
            selectedSubsystem={selectedSubsystem}
            onSelectSubsystem={(id) => setSelectedSubsystem(id)}
          />
        </div>

        {/* Right: Aircraft Profile Ledger & Airworthiness Dispatch */}
        <div className="col-12 col-lg-4">
          <div className="skyline-card p-3 h-100 d-flex flex-column justify-content-between" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                <span className="skyline-pill skyline-pill-dark font-mono-tech" style={{ fontSize: '0.66rem' }}>
                  AIRFRAME TECHNICAL LEDGER
                </span>
                <span className="text-muted font-mono-tech small" style={{ fontSize: '0.68rem' }}>
                  MoD / DSSC
                </span>
              </div>

              {/* Aero Profile Thumbnail */}
              <div className="text-center p-2 mb-2 rounded-2" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <img 
                  src="/images/cad/cad-aircraft-top-tally-vert.jpg" 
                  alt="Aero Planform" 
                  className="img-fluid rounded"
                  style={{ maxHeight: '110px', objectFit: 'contain' }}
                />
                <div className="mt-1 font-mono-tech text-muted" style={{ fontSize: '0.64rem' }}>
                  TOP AERO WING GEOMETRY &amp; TALLY COMPASS GRID
                </div>
              </div>

              {/* Specs Grid */}
              <div className="row g-2 font-mono-tech mb-3" style={{ fontSize: '0.76rem' }}>
                <div className="col-6">
                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>MANUFACTURER:</span>
                  <strong className="text-dark">HAL / IAF Koraput</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>VARIANT:</span>
                  <strong className="text-dark">{aircraft.type}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>TOTAL FLIGHT HOURS:</span>
                  <strong className="text-dark">{aircraft.totalFlightHours} FH</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>SORTIE CYCLES:</span>
                  <strong className="text-dark">{aircraft.flightCycles} Sorties</strong>
                </div>
              </div>

              {/* Dispatch Recommendation Box */}
              <div 
                className="p-3 rounded-2 mb-2 font-mono-tech" 
                style={{ 
                  background: isRestricted ? '#FEF2F2' : '#F0FDF4', 
                  border: `1px solid ${isRestricted ? '#FCA5A5' : '#86EFAC'}` 
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold" style={{ fontSize: '0.72rem', color: isRestricted ? '#991B1B' : '#166534' }}>
                    COMMAND DISPATCH DIRECTIVE
                  </span>
                  <span className="fw-bold" style={{ fontSize: '0.72rem', color: isRestricted ? '#DC2626' : '#059669' }}>
                    {aircraft.overallHealth}% Health
                  </span>
                </div>
                <div className="fw-bold mb-1" style={{ fontSize: '0.84rem', color: isRestricted ? '#DC2626' : '#059669' }}>
                  {dispatchRec}
                </div>
                <small className="text-secondary d-block" style={{ fontSize: '0.7rem', lineHeight: 1.35 }}>
                  {isRestricted 
                    ? 'Flight sortie authorization withheld pending qualified engineering sign-off on open work order.' 
                    : 'All subsystems within nominal operational envelope. Cleared for flight line mission release.'}
                </small>
              </div>
            </div>

            {/* Quick Link to Work Orders */}
            <div className="pt-2 border-top">
              <button
                onClick={() => onNavigate('maintenance')}
                className="skyline-btn-secondary w-100 py-1.5 d-flex align-items-center justify-content-center gap-1.5"
                style={{ fontSize: '0.76rem' }}
              >
                <FileText size={13} />
                <span>View Squadron Work Orders ({aircraftWorkOrders.length}) →</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MIDDLE SECTION: Selected Subsystem Live Engineering Inspector */}
      <div className="skyline-card p-3 px-4 mb-3" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <span className="skyline-pill skyline-pill-dark font-mono-tech" style={{ fontSize: '0.65rem' }}>
              PHYSICAL SUBSYSTEM INSPECTOR
            </span>
            <h5 className="fw-bold mb-0 text-dark font-sans" style={{ fontSize: '1.05rem' }}>
              {activeSub.title}
            </h5>
            <span className="text-muted font-mono-tech d-none d-md-inline" style={{ fontSize: '0.74rem' }}>
              [{activeSub.spec}]
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span 
              className="font-mono-tech fw-semibold px-2 py-0.5 rounded-pill"
              style={{ 
                fontSize: '0.7rem',
                background: activeSub.status === 'Warning' || activeSub.status === 'Critical' ? '#FEF2F2' : '#F0FDF4',
                color: activeSub.status === 'Warning' || activeSub.status === 'Critical' ? '#DC2626' : '#059669',
                border: `1px solid ${activeSub.status === 'Warning' || activeSub.status === 'Critical' ? '#FCA5A5' : '#86EFAC'}`
              }}
            >
              ● {activeSub.status.toUpperCase()} ({activeSub.health}% Health)
            </span>
          </div>
        </div>

        <div className="row g-3 align-items-center">
          {/* Col 1: High-Definition 3D CAD Component Cutaway */}
          <div className="col-12 col-md-3 text-center">
            <div className="p-2 rounded-2 d-flex align-items-center justify-content-center position-relative" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', minHeight: '120px' }}>
              <img 
                src={activeSub.img} 
                alt={activeSub.title}
                className="img-fluid"
                style={{ maxHeight: '110px', objectFit: 'contain' }}
              />
              <span className="position-absolute font-mono-tech text-muted" style={{ bottom: '4px', right: '8px', fontSize: '0.62rem' }}>
                3D CAD TWIN
              </span>
            </div>
          </div>

          {/* Col 2: Live Physical Sensor Telemetry Readouts */}
          <div className="col-12 col-md-5">
            <div className="row g-2 font-mono-tech" style={{ fontSize: '0.75rem' }}>
              <div className="col-6">
                <div className="p-2 rounded-2 bg-light border" style={{ borderColor: '#E2E8F0' }}>
                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>VIBRATION LEVEL:</span>
                  <strong className={activeSub.vibration.includes('4.') || activeSub.vibration.includes('5.') ? 'text-danger' : 'text-dark'}>
                    {activeSub.vibration}
                  </strong>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 rounded-2 bg-light border" style={{ borderColor: '#E2E8F0' }}>
                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>TEMPERATURE:</span>
                  <strong className="text-dark">{activeSub.temp}</strong>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 rounded-2 bg-light border" style={{ borderColor: '#E2E8F0' }}>
                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>CORE PRESSURE / VOLT:</span>
                  <strong className="text-dark">{activeSub.pressure}</strong>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 rounded-2 bg-light border" style={{ borderColor: '#E2E8F0' }}>
                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>RPM / BUS FREQ:</span>
                  <strong className="text-dark">{activeSub.rpm}</strong>
                </div>
              </div>
            </div>

            <div className="mt-2 text-secondary font-mono-tech" style={{ fontSize: '0.72rem', lineHeight: 1.4 }}>
              <strong>DIAGNOSTIC STATUS:</strong> {activeSub.details}
            </div>
          </div>

          {/* Col 3: Connected Depot Spares Logistics */}
          <div className="col-12 col-md-4">
            <div className="p-3 rounded-2 h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="font-mono-tech fw-bold text-dark" style={{ fontSize: '0.74rem' }}>
                  CONNECTED DEPOT SPARES
                </span>
                <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.62rem' }}>LRU READY</span>
              </div>
              <div className="font-mono-tech fw-semibold text-dark small mb-1" style={{ fontSize: '0.76rem' }}>
                {activeSub.spares}
              </div>
              <div className="font-mono-tech text-secondary small" style={{ fontSize: '0.7rem' }}>
                ● {activeSub.spareStatus}
              </div>
              <div className="mt-2 pt-2 border-top d-flex justify-content-between align-items-center">
                <span className="text-muted font-mono-tech small" style={{ fontSize: '0.66rem' }}>Procurement Lead: 48h</span>
                <button
                  onClick={() => onNavigate('spares')}
                  className="btn btn-sm btn-link p-0 text-decoration-none font-mono-tech fw-semibold"
                  style={{ color: '#0F172A', fontSize: '0.72rem' }}
                >
                  View in Logistics →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. LOWER SECTION: Airframe Maintenance Orders (6 cols) + Real Harmonic Sensor Trend (6 cols) */}
      <div className="row g-3">
        {/* Left: Airframe Work Orders Roster */}
        <div className="col-12 col-lg-6">
          <div className="skyline-card p-3 h-100" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <Wrench size={15} color="#0F172A" />
                <h6 className="fw-bold text-dark mb-0 font-mono-tech" style={{ fontSize: '0.88rem' }}>
                  {aircraft.aircraftId} Maintenance Directives ({aircraftWorkOrders.length})
                </h6>
              </div>
              <button
                onClick={() => onOpenWorkOrderModal(null, aircraft.aircraftId)}
                className="skyline-btn-dark py-1 px-2.5"
                style={{ fontSize: '0.72rem' }}
              >
                + New Directive
              </button>
            </div>

            {aircraftWorkOrders.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {aircraftWorkOrders.map(wo => (
                  <div 
                    key={wo.orderId}
                    className="p-2.5 rounded-2 font-mono-tech d-flex justify-content-between align-items-center"
                    style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.76rem' }}
                  >
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-0.5">
                        <strong className="text-dark">{wo.orderId}</strong>
                        <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.62rem' }}>
                          {wo.priority?.toUpperCase()}
                        </span>
                        <span 
                          className="px-1.5 py-0.5 rounded-pill"
                          style={{
                            fontSize: '0.64rem',
                            background: wo.status === 'Completed' ? '#F0FDF4' : '#FFFBEB',
                            color: wo.status === 'Completed' ? '#059669' : '#D97706',
                            border: `1px solid ${wo.status === 'Completed' ? '#86EFAC' : '#FDE68A'}`
                          }}
                        >
                          {wo.status}
                        </span>
                      </div>
                      <div className="text-secondary small">
                        {wo.title || wo.jobType} • Specialist: <strong>{wo.assignedTechnician}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('maintenance')}
                      className="skyline-btn-secondary py-1 px-2.5"
                      style={{ fontSize: '0.72rem' }}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted font-mono-tech small">
                No active maintenance directives logged for this airframe.
              </div>
            )}
          </div>
        </div>

        {/* Right: Real Harmonic Sensor Degradation Trace */}
        <div className="col-12 col-lg-6">
          <div className="skyline-card p-3 h-100" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <Activity size={15} color="#0F172A" />
                <h6 className="fw-bold text-dark mb-0 font-mono-tech" style={{ fontSize: '0.88rem' }}>
                  {aircraft.aircraftId} Sensor Degradation Trace &amp; RUL
                </h6>
              </div>
              <span className="skyline-pill skyline-pill-dark font-mono-tech" style={{ fontSize: '0.64rem' }}>
                FFT HARMONIC TRACKING
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
              <div className="p-4 text-center text-muted font-mono-tech small">
                Connecting to 20Hz SSFDR sensor telemetry bus...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
