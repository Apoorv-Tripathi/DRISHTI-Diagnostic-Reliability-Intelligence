import React, { useState, useEffect } from 'react';
import SensorTrendChart from './SensorTrendChart.jsx';
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ArrowRight,
  Shield,
  Clock,
  CheckSquare,
  FileText,
  Thermometer,
  Gauge,
  RotateCw,
  Cpu,
  ArrowLeft,
  Zap,
  Radio,
  Layers,
  Database,
  Check,
  Award
} from 'lucide-react';

export default function InspectionPortal({
  job,
  aircraft,
  telemetry,
  onCompleteInspection,
  onClose
}) {
  // 4-Stage Curated Pipeline:
  // 1: Physical Data Bus Interface & Harness Tethering
  // 2: Dual-Pane Telemetry & AI Baseline Discrepancy Analysis
  // 3: Guided Optical Boroscopy & Physical NDT Checklist
  // 4: Digital Airworthiness Certification & Fleet Sync
  const [activeStage, setActiveStage] = useState(1);

  // Stage 1: Bus Connection State
  const [busStatus, setBusStatus] = useState('disconnected'); // 'disconnected' | 'connecting' | 'extracting' | 'connected'
  const [busProgress, setBusProgress] = useState(0);
  const [busLogs, setBusLogs] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState('MIL-STD-1553B');

  // Stage 3 & 4: Inspection Findings & Checklist
  const [confirmedChecklist, setConfirmedChecklist] = useState({
    boroscopeCompleted: false,
    debrisInspected: false,
    spareReplaced: false,
    torqueCalibrated: false
  });

  const [findingsText, setFindingsText] = useState('');
  const [actionTakenText, setActionTakenText] = useState('');
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [recommendationChoice, setRecommendationChoice] = useState('MAINTENANCE_REQUIRED');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompletedSuccess, setIsCompletedSuccess] = useState(false);

  // Initialize specific engineering defaults based on the target aircraft
  useEffect(() => {
    if (!job) return;
    const acId = job.aircraftId || 'AF-04';

    if (acId === 'AF-04') {
      setFindingsText(
        'Video boroscope inspection through inspection port B-4 confirmed stage-2 high-pressure turbine bearing micro-spalling and initial fatigue pitting on the outer race. Magnetic chip detector confirmed ferrous particulate buildup in scavenge line.'
      );
      setActionTakenText(
        'Extracted compromised roller bearing assembly. Installed certified depot OEM bearing assembly (#ENG-BRG-7440) and new ceramic seals. Torqued retention flange to 142 Nm. Executed ground test run; vibration returned to 1.42 mm/s baseline nominal.'
      );
      setTechnicianNotes(
        'Turbine stage-2 bearing assembly requires depot-level dynamic balancing and race inspection before clearance. Recommend transfer to Base Heavy Maintenance Wing. Do not release for active combat sorties.'
      );
      setRecommendationChoice('MAINTENANCE_REQUIRED');
    } else if (acId === 'AF-02') {
      setFindingsText(
        'System B hydraulic pressure drop traced to micro-leakage in secondary servo-actuator seal during dynamic deflection testing.'
      );
      setActionTakenText(
        'Replaced secondary hydraulic valve pack (#HYD-VLV-2201). Flushed B-loop hydraulic fluid and bled trapped air. Pressure normalized to 3,000 PSI.'
      );
      setTechnicianNotes(
        'Hydraulic actuation field repair executed. Pressure holds 3,000 PSI. Quad-redundant flight control surfaces verified.'
      );
      setRecommendationChoice('FLIGHT_CLEARED');
    } else {
      setFindingsText(
        `Physical diagnostic bus analysis and inspection completed for ${acId}. Component anomalies verified against fleet baseline.`
      );
      setActionTakenText(
        'Replaced suspect LRU module from depot inventory, recalibrated bus transducers, and confirmed nominal telemetry parameters.'
      );
      setTechnicianNotes(
        'Subsystem certified airworthy. Telemetry within nominal envelope.'
      );
      setRecommendationChoice('MAINTENANCE_REQUIRED');
    }
  }, [job]);

  if (!job) return null;

  const acId = job.aircraftId || 'AF-04';

  // Physical Diagnostic Data Profiles
  const diagnosticProfiles = {
    'AF-04': {
      subsystemName: 'Turbofan Powerplant (E-01) High-Pressure Spool',
      portTarget: 'Inspection Port B-4 (HP Turbine Stage-2)',
      sparePart: 'ENG-BRG-7440 (Turbine Roller Bearing Pack)',
      liveTelemetry: {
        vibration: '5.21 mm/s',
        vibrationStatus: 'critical',
        temp: '118.4°C',
        tempStatus: 'warning',
        pressure: '44.2 PSI',
        pressureStatus: 'warning',
        rpm: '14,250 RPM',
        chipDetector: 'Ferrous Debris Flagged'
      },
      baselineTelemetry: {
        vibration: '1.42 mm/s',
        temp: '98.0°C',
        pressure: '48.5 PSI',
        rpm: '14,200 RPM',
        chipDetector: 'Zero Particles'
      },
      deviations: {
        vibrationDelta: '+267% Spike above baseline',
        tempDelta: '+20.4°C Thermal Drift',
        pressureDelta: '-8.8% Pressure Loss'
      },
      aiDiagnosis: {
        failureMode: 'Stage-2 High-Pressure Turbine Bearing Micro-Spalling & Outer Race Fatigue',
        confidence: '94.2%',
        rul: '38.4 Flight Hours',
        mechanism: 'Harmonic spectral analysis isolates 142.6 Hz frequency spike (2X spool order) confirming subsurface roller race micro-fissures.'
      }
    },
    'AF-02': {
      subsystemName: 'Hydraulic Flight Control & Secondary Actuation',
      portTarget: 'Hydraulic Test Manifold Bay 2',
      sparePart: 'HYD-VLV-2201 (Servo Actuator Valve Pack)',
      liveTelemetry: {
        vibration: '1.35 mm/s',
        vibrationStatus: 'nominal',
        temp: '82.0°C',
        tempStatus: 'nominal',
        pressure: '1,820 PSI',
        pressureStatus: 'critical',
        rpm: '14,180 RPM',
        chipDetector: 'Clean'
      },
      baselineTelemetry: {
        vibration: '1.20 mm/s',
        temp: '78.0°C',
        pressure: '3,000 PSI',
        rpm: '14,200 RPM',
        chipDetector: 'Zero Particles'
      },
      deviations: {
        vibrationDelta: 'Nominal',
        tempDelta: '+4.0°C Normal',
        pressureDelta: '-39.3% Pressure Drop'
      },
      aiDiagnosis: {
        failureMode: 'System B Main Return Manifold Pressure Drop & Internal By-pass Leakage',
        confidence: '91.8%',
        rul: '85.0 Flight Hours',
        mechanism: 'Pressure drop during actuator cycling indicates dynamic seal degradation on servo manifold.'
      }
    },
    'DEFAULT': {
      subsystemName: job.subsystem || 'Avionics & Mission Systems',
      portTarget: 'Main Diagnostic Umbilical Receptacle J14',
      sparePart: 'LRU-GEN-9900 (Modular Line Replaceable Unit)',
      liveTelemetry: {
        vibration: '3.10 mm/s',
        vibrationStatus: 'warning',
        temp: '105.0°C',
        tempStatus: 'warning',
        pressure: '46.0 PSI',
        pressureStatus: 'nominal',
        rpm: '14,210 RPM',
        chipDetector: 'Particle Trace'
      },
      baselineTelemetry: {
        vibration: '1.40 mm/s',
        temp: '95.0°C',
        pressure: '48.0 PSI',
        rpm: '14,200 RPM',
        chipDetector: 'Zero Particles'
      },
      deviations: {
        vibrationDelta: '+121% Deviation',
        tempDelta: '+10.0°C Thermal Rise',
        pressureDelta: 'Nominal'
      },
      aiDiagnosis: {
        failureMode: 'Subsystem Degradation Exceeding 4,200h Historical Fleet Nominal Bounds',
        confidence: '89.5%',
        rul: job.predictedRul || '60.0 Flight Hours',
        mechanism: 'Multivariate anomaly score indicates early mechanical or electrical wear.'
      }
    }
  };

  const activeDiag = diagnosticProfiles[acId] || diagnosticProfiles['DEFAULT'];

  // Handle Connecting the Physical Bus Harness
  const handleConnectBus = () => {
    setBusStatus('connecting');
    setBusProgress(15);
    setBusLogs([
      `[GSE-INIT] Initiating umbilical bus interface connection to ${acId}...`,
      `[PROT-SEL] Selected Protocol: ${selectedProtocol} (Dual-Redundant, 78-ohm termination verified)`
    ]);

    setTimeout(() => {
      setBusProgress(45);
      setBusLogs(prev => [
        ...prev,
        `[HW-SHAKE] Bus Controller -> Remote Terminal Address 0x04 Handshake: ACK RECEIVED`,
        `[SYNC-1553B] Command Word 0x2084 transmitted. Subaddress 4, 32 data words synchronized.`
      ]);
    }, 700);

    setTimeout(() => {
      setBusStatus('extracting');
      setBusProgress(75);
      setBusLogs(prev => [
        ...prev,
        `[ARINC-429] Sampling 32-bit BCD/BNR Words: Label 270 (Vib) & Label 324 (Pitch) verified.`,
        `[SSFDR-STREAM] Ingesting Solid-State Flight Data Recorder stream... 14,250 frames decoded.`
      ]);
    }, 1500);

    setTimeout(() => {
      setBusStatus('connected');
      setBusProgress(100);
      setBusLogs(prev => [
        ...prev,
        `[PARITY-CHK] Bit parity: 100% VALID. Error counter: 0.`,
        `[AI-BASELINE] Cross-referencing against 4,200h Fleet Baseline model... DATA MATED.`,
        `[STATUS] PHYSICAL AVIONICS BUS HARNESS FULLY SYNCHRONIZED.`
      ]);
    }, 2200);
  };

  const handleCheckboxChange = (key) => {
    setConfirmedChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecksConfirmed = Object.values(confirmedChecklist).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onCompleteInspection(job.orderId, {
      findings: findingsText,
      actionTaken: actionTakenText,
      technicianNotes: technicianNotes,
      technicianRecommendation: recommendationChoice,
      aiRecommendation: `${activeDiag.aiDiagnosis.failureMode}. ${activeDiag.aiDiagnosis.mechanism} Model Recommendation: ${recommendationChoice === 'MAINTENANCE_REQUIRED' ? 'CRITICAL: TRANSFER TO BASE HEAVY MAINTENANCE WING' : 'FIELD CLEARANCE RECOMMENDED'}`,
      status: 'Pending Command Validation',
      sensorReadings: {
        vibration: activeDiag.liveTelemetry.vibration,
        temperature: activeDiag.liveTelemetry.temp,
        pressure: activeDiag.liveTelemetry.pressure,
        rpm: activeDiag.liveTelemetry.rpm
      }
    });
    setIsSubmitting(false);
    setIsCompletedSuccess(true);
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-3" style={{ maxWidth: '1440px', minHeight: '85vh' }}>
      <div className="skyline-card border shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden', background: '#FFFFFF' }}>
        
        {/* TOP COMMAND HEADER */}
        <div className="p-3 px-4 border-bottom d-flex justify-content-between align-items-center" style={{ background: '#333333', color: '#FFFFFF' }}>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '42px', height: '42px', background: 'rgba(255, 160, 52, 0.2)', color: '#FFA034' }}>
              <Wrench size={22} strokeWidth={2.4} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="skyline-pill skyline-pill-amber" style={{ fontSize: '0.65rem' }}>
                  CENTRALISED TECHNICIAN INSPECTION CONSOLE
                </span>
                <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.65rem' }}>
                  ORDER: {job.orderId}
                </span>
              </div>
              <h4 className="fw-bold text-white mb-0 font-mono-tech mt-1" style={{ fontSize: '1.25rem' }}>
                {job.aircraftId} — {job.jobType || job.title}
              </h4>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className={`skyline-pill ${job.priority === 'High' ? 'skyline-pill-red' : 'skyline-pill-amber'}`} style={{ fontSize: '0.72rem' }}>
              PRIORITY: {job.priority.toUpperCase()}
            </span>
            <button 
              type="button" 
              className="skyline-btn-secondary py-1.5 px-3 d-flex align-items-center gap-2" 
              onClick={onClose}
              style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <span>✕ Close Console</span>
            </button>
          </div>
        </div>

        {/* 4-STAGE LINEAR STEPPER NAVIGATION */}
        <div className="bg-white px-4 py-2 border-bottom d-flex flex-wrap justify-content-between align-items-center font-mono-tech" style={{ fontSize: '0.78rem' }}>
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className={activeStage === 1 ? 'skyline-pill-tab active' : 'skyline-pill-tab'}
              onClick={() => setActiveStage(1)}
              style={{ fontSize: '0.74rem' }}
            >
              {busStatus === 'connected' ? '✓ 1. PHYSICAL BUS TETHER' : '1. PHYSICAL BUS TETHER'}
            </button>

            <button
              type="button"
              className={activeStage === 2 ? 'skyline-pill-tab active' : 'skyline-pill-tab'}
              onClick={() => busStatus === 'connected' && setActiveStage(2)}
              disabled={busStatus !== 'connected'}
              style={{ fontSize: '0.74rem', opacity: busStatus !== 'connected' ? 0.5 : 1 }}
            >
              2. DUAL-PANE &amp; AI BASELINE
            </button>

            <button
              type="button"
              className={activeStage === 3 ? 'skyline-pill-tab active' : 'skyline-pill-tab'}
              onClick={() => busStatus === 'connected' && setActiveStage(3)}
              disabled={busStatus !== 'connected'}
              style={{ fontSize: '0.74rem', opacity: busStatus !== 'connected' ? 0.5 : 1 }}
            >
              3. GUIDED BOROSCOPY CHECKLIST
            </button>

            <button
              type="button"
              className={activeStage === 4 ? 'skyline-pill-tab active' : 'skyline-pill-tab'}
              onClick={() => allChecksConfirmed && setActiveStage(4)}
              disabled={!allChecksConfirmed}
              style={{ fontSize: '0.74rem', opacity: !allChecksConfirmed ? 0.5 : 1 }}
            >
              4. AI SYNTHESIS &amp; COMMAND REPORT
            </button>
          </div>

          <span className="text-secondary d-none d-lg-inline" style={{ fontSize: '0.74rem' }}>
            ASSIGNED TECHNICIAN: <strong className="text-dark">{job.assignedTechnician || 'Rahul Sharma'}</strong>
          </span>
        </div>

        {/* CONSOLE MAIN BODY */}
        <div className="p-4" style={{ background: '#F2F2F2' }}>
          
          {/* SUCCESS BANNER WHEN REPORT SUBMITTED TO COMMAND */}
          {isCompletedSuccess ? (
            <div className="skyline-card p-5 text-center bg-white shadow-sm" style={{ borderRadius: '20px' }}>
              <div className="p-3 rounded-circle d-inline-flex mb-3" style={{ background: recommendationChoice === 'MAINTENANCE_REQUIRED' ? 'rgba(255, 160, 52, 0.15)' : 'rgba(29, 195, 10, 0.15)', color: recommendationChoice === 'MAINTENANCE_REQUIRED' ? '#FFA034' : '#1DC30A' }}>
                {recommendationChoice === 'MAINTENANCE_REQUIRED' ? <Wrench size={52} strokeWidth={2.2} /> : <CheckCircle2 size={52} strokeWidth={2.2} />}
              </div>
              <h3 className="fw-bold text-dark mb-1 font-mono-tech">
                {recommendationChoice === 'MAINTENANCE_REQUIRED' ? 'TECHNICAL REPORT SUBMITTED — HEAVY MAINTENANCE RECOMMENDED' : 'AIRWORTHINESS INSPECTION REPORT SUBMITTED TO COMMAND'}
              </h3>
              <p className="text-muted small mb-4 font-mono-tech" style={{ maxWidth: '640px', margin: '0 auto', fontSize: '0.86rem', lineHeight: 1.6 }}>
                Work Order <strong>{job.orderId}</strong> for airframe <strong>{job.aircraftId}</strong> has been successfully submitted by <strong>{job.assignedTechnician || 'Rahul Sharma'}</strong>. 
                The full physical inspection findings, avionics bus telemetry discrepancies, and technician recommendation have been transmitted to <strong>Base Air Command (Fleet Administrator: Arjun Mehta)</strong> for formal passing order validation.
              </p>

              <div className="p-3 rounded-3 mb-4 mx-auto font-mono-tech text-start" style={{ maxWidth: '640px', background: '#F8F9FA', border: '1px solid #E5E7EB', fontSize: '0.78rem' }}>
                <div className="row g-2">
                  <div className="col-sm-6">TARGET AIRFRAME: <strong className="text-dark">{job.aircraftId} ({aircraft?.type || 'Combat Fighter'})</strong></div>
                  <div className="col-sm-6">COMPLETION TIMESTAMP: <strong className="text-dark">{new Date().toUTCString()}</strong></div>
                  <div className="col-sm-6">TECHNICIAN DISPOSITION: <strong style={{ color: recommendationChoice === 'MAINTENANCE_REQUIRED' ? '#D32F1A' : '#0F8205' }}>{recommendationChoice === 'MAINTENANCE_REQUIRED' ? 'TRANSFER TO HEAVY MAINTENANCE WING' : 'FIELD CLEARANCE RECOMMENDED'}</strong></div>
                  <div className="col-sm-6">COMMAND WORKFLOW: <strong style={{ color: '#A85B00' }}>PENDING FLEET ADMIN VALIDATION (ARJUN MEHTA)</strong></div>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button
                  onClick={onClose}
                  className="skyline-btn-dark px-5 py-2.5"
                  style={{ fontSize: '0.88rem' }}
                >
                  Return to Technician Workbench
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* AIRFRAME METADATA STRIP (LOCKED TO CURRENT JOB) */}
              <div className="skyline-card p-3 mb-3 bg-white">
                <div className="row g-3 font-mono-tech" style={{ fontSize: '0.8rem' }}>
                  <div className="col-6 col-md-3">
                    <span className="text-muted d-block" style={{ fontSize: '0.68rem' }}>AIRFRAME TAIL ID:</span>
                    <strong className="text-dark fs-6 font-mono-tech">{job.aircraftId}</strong>
                    <div className="text-muted small">{aircraft?.type || 'Combat Fighter'} • {aircraft?.base || 'Ambala AFS'}</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <span className="text-muted d-block" style={{ fontSize: '0.68rem' }}>SUBSYSTEM TARGET:</span>
                    <strong className="text-dark">{activeDiag.subsystemName}</strong>
                    <div className="text-muted small">Target: {activeDiag.portTarget}</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <span className="text-muted d-block" style={{ fontSize: '0.68rem' }}>CURRENT HEALTH SCORE:</span>
                    <strong className="fs-6 font-mono-tech" style={{ color: '#D32F1A' }}>
                      {aircraft?.overallHealth || 74}% [ANOMALY FLAGGED]
                    </strong>
                    <div className="text-muted small">Base Status: Under Inspection</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <span className="text-muted d-block" style={{ fontSize: '0.68rem' }}>ESTIMATED RUL HORIZON:</span>
                    <strong className="fs-6 font-mono-tech" style={{ color: '#D32F1A' }}>
                      {activeDiag.aiDiagnosis.rul}
                    </strong>
                    <div className="text-muted small">Critical fatigue threshold</div>
                  </div>
                </div>
              </div>

              {/* ============================================================== */}
              {/* STAGE 1: PHYSICAL AVIONICS BUS TETHERING                       */}
              {/* ============================================================== */}
              {activeStage === 1 && (
                <div className="skyline-card p-4 bg-white shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <span className="skyline-pill skyline-pill-amber" style={{ fontSize: '0.65rem' }}>STAGE 1 OF 4</span>
                      <h5 className="fw-bold text-dark mb-0 font-mono-tech mt-1" style={{ fontSize: '1.15rem' }}>
                        Physical Ground Support Equipment (GSE) Bus Tethering
                      </h5>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted font-mono-tech small">BUS PROTOCOL:</span>
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className={selectedProtocol === 'MIL-STD-1553B' ? 'btn btn-dark active' : 'btn btn-outline-secondary'}
                          onClick={() => setSelectedProtocol('MIL-STD-1553B')}
                          disabled={busStatus === 'connected' || busStatus === 'connecting'}
                          style={{ fontSize: '0.72rem' }}
                        >
                          MIL-STD-1553B
                        </button>
                        <button
                          type="button"
                          className={selectedProtocol === 'ARINC-429' ? 'btn btn-dark active' : 'btn btn-outline-secondary'}
                          onClick={() => setSelectedProtocol('ARINC-429')}
                          disabled={busStatus === 'connected' || busStatus === 'connecting'}
                          style={{ fontSize: '0.72rem' }}
                        >
                          ARINC-429
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted small font-mono-tech mb-4" style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
                    Before live telemetry can be reviewed or airworthiness certified, the flight-line technician must physically connect the Ground Support Equipment (GSE) diagnostic test harness to aircraft <strong>{job.aircraftId}</strong>'s external umbilical test receptacle (Port J14) to extract unbuffered Solid-State Flight Data Recorder (SSFDR) telemetry.
                  </p>

                  {/* Physical Mating Visual Interface */}
                  <div className="p-4 rounded-3 mb-4 text-center position-relative" style={{ background: '#F8F9FA', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
                    <div className="d-flex justify-content-center align-items-center gap-4 mb-3">
                      {/* GSE Terminal */}
                      <div className="p-3 bg-white rounded-3 border text-center shadow-sm" style={{ width: '190px', borderColor: '#E5E8EC' }}>
                        <Cpu size={28} className="text-dark mb-1" />
                        <div className="fw-bold font-mono-tech text-dark" style={{ fontSize: '0.8rem' }}>GSE TEST CONSOLE</div>
                        <span className="text-muted font-mono-tech" style={{ fontSize: '0.68rem' }}>Station Bay 3 Bench</span>
                      </div>

                      {/* Cable Animation / Status */}
                      <div className="text-center" style={{ width: '180px' }}>
                        <div className="d-flex align-items-center justify-content-center mb-1">
                          <Zap size={22} color={busStatus === 'connected' ? '#0F8205' : busStatus === 'connecting' ? '#A85B00' : '#64748B'} />
                        </div>
                        <div className="font-mono-tech fw-bold" style={{ fontSize: '0.75rem', color: busStatus === 'connected' ? '#0F8205' : busStatus === 'connecting' ? '#A85B00' : '#64748B' }}>
                          {busStatus === 'connected' ? 'HARNESS MATED' : busStatus === 'connecting' ? 'SYNCING BUS...' : 'DISCONNECTED'}
                        </div>
                      </div>

                      {/* Aircraft Receptacle */}
                      <div className="p-3 bg-white rounded-3 border text-center shadow-sm" style={{ width: '190px', borderColor: '#E5E8EC' }}>
                        <Radio size={28} className="text-dark mb-1" />
                        <div className="fw-bold font-mono-tech text-dark" style={{ fontSize: '0.8rem' }}>AIRFRAME {job.aircraftId}</div>
                        <span className="text-muted font-mono-tech" style={{ fontSize: '0.68rem' }}>Umbilical Port J14</span>
                      </div>
                    </div>

                    {/* Progress Bar (if connecting) */}
                    {busStatus !== 'disconnected' && (
                      <div className="mb-3 mx-auto" style={{ maxWidth: '480px' }}>
                        <div className="progress" style={{ height: '8px', background: '#E2E8F0' }}>
                          <div
                            className={`progress-bar progress-bar-striped progress-bar-animated ${busStatus === 'connected' ? 'bg-success' : 'bg-warning'}`}
                            role="progressbar"
                            style={{ width: `${busProgress}%` }}
                          ></div>
                        </div>
                        <div className="d-flex justify-content-between font-mono-tech text-muted mt-1" style={{ fontSize: '0.68rem' }}>
                          <span>BUS HANDSHAKE: {busProgress}%</span>
                          <span>{busStatus === 'connected' ? 'COMPLETED (14,250 FRAMES)' : 'EXTRACTING SSFDR...'}</span>
                        </div>
                      </div>
                    )}

                    {/* Terminal Extraction Log - Skyline Light Technical UI */}
                    {busLogs.length > 0 && (
                      <div className="p-3 rounded-2 text-start font-mono-tech mx-auto" style={{ maxWidth: '640px', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#1E293B', fontSize: '0.72rem', height: '110px', overflowY: 'auto' }}>
                        {busLogs.map((log, i) => (
                          <div key={i} className="py-0.5 border-bottom border-light">{log}</div>
                        ))}
                      </div>
                    )}

                    {/* Connection Button */}
                    <div className="mt-3">
                      {busStatus === 'disconnected' && (
                        <button
                          type="button"
                          onClick={handleConnectBus}
                          className="skyline-btn-dark px-4 py-2.5 d-inline-flex align-items-center gap-2 shadow"
                          style={{ fontSize: '0.88rem' }}
                        >
                          <Zap size={16} color="#FFA034" />
                          <span>🔌 Connect Diagnostic Bus Harness (MIL-STD-1553B / ARINC-429)</span>
                        </button>
                      )}

                      {busStatus === 'connecting' && (
                        <button type="button" disabled className="btn btn-secondary px-4 py-2 font-mono-tech" style={{ fontSize: '0.84rem' }}>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          ESTABLISHING TERMINAL HANDSHAKE...
                        </button>
                      )}

                      {busStatus === 'connected' && (
                        <div className="d-flex justify-content-center align-items-center gap-3">
                          <span className="skyline-pill skyline-pill-green py-2 px-3 d-inline-flex align-items-center gap-1 font-mono-tech" style={{ fontSize: '0.8rem' }}>
                            <CheckCircle2 size={16} />
                            <span>PHYSICAL AVIONICS BUS CONNECTED &amp; SYNCHRONIZED</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => setActiveStage(2)}
                            className="skyline-btn-dark px-4 py-2 d-inline-flex align-items-center gap-2"
                            style={{ fontSize: '0.84rem' }}
                          >
                            <span>Proceed to Live Telemetry &amp; AI Baseline Analysis</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STAGE 2: DUAL-PANE TELEMETRY & AI BASELINE COMPARISON          */}
              {/* ============================================================== */}
              {activeStage === 2 && (() => {
                const resolvedTelemetry = telemetry?.history?.length ? telemetry : {
                  history: [
                    { flightHour: 10, vibration: 1.42, anomaly: false },
                    { flightHour: 20, vibration: 1.55, anomaly: false },
                    { flightHour: 30, vibration: 1.62, anomaly: false },
                    { flightHour: 40, vibration: 1.80, anomaly: false },
                    { flightHour: 50, vibration: 2.15, anomaly: false },
                    { flightHour: 60, vibration: 2.70, anomaly: true },
                    { flightHour: 70, vibration: 3.85, anomaly: true },
                    { flightHour: 75, vibration: parseFloat(activeDiag.liveTelemetry.vibration) || 5.21, anomaly: true }
                  ],
                  projection: [
                    { flightHour: 80, predictedVibration: 5.85 },
                    { flightHour: 90, predictedVibration: 6.70 },
                    { flightHour: 100, predictedVibration: 7.90 }
                  ]
                };

                return (
                  <div>
                    <div className="skyline-card p-3 mb-3 bg-white" style={{ border: '1px solid #E5E8EC' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="skyline-pill skyline-pill-amber" style={{ fontSize: '0.65rem' }}>STAGE 2 OF 4</span>
                          <h5 className="fw-bold text-dark mb-0 font-mono-tech mt-1" style={{ fontSize: '1.15rem' }}>
                            Avionics Telemetry Analysis: Live SSFDR Stream vs. 4,200h Fleet Baseline
                          </h5>
                        </div>
                        <span className="skyline-pill skyline-pill-green font-mono-tech" style={{ fontSize: '0.72rem' }}>
                          ● BUS SYNCHRONIZED: {selectedProtocol}
                        </span>
                      </div>
                    </div>

                    {/* Subsystem Transducers Comparison Grid (Dual-Box Comparator Model) */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2 px-1">
                        <div className="d-flex align-items-center gap-2">
                          <Cpu size={16} className="text-dark" />
                          <span className="fw-bold text-dark font-mono-tech" style={{ fontSize: '0.86rem' }}>
                            Physical Transducer Comparison: Live SSFDR Bus vs. 4,200h Fleet Baseline
                          </span>
                        </div>
                        <span className="text-muted font-mono-tech small">
                          Airframe: <strong className="text-dark">{job.aircraftId}</strong> • Umbilical Port J14
                        </span>
                      </div>

                      <div className="row g-3 font-mono-tech">
                        {/* Box 1: Vibration Spectrum */}
                        <div className="col-12 col-md-6">
                          <div className="bg-white p-3 h-100" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div>
                                <span className="fw-bold text-dark d-block" style={{ fontSize: '0.86rem' }}>
                                  Vibration Spectrum (RMS)
                                </span>
                                <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                                  High-Pressure Spool Accelerometer
                                </span>
                              </div>
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 600,
                                  color: activeDiag.liveTelemetry.vibrationStatus === 'critical' ? '#B91C1C' : '#15803D'
                                }}
                              >
                                {activeDiag.liveTelemetry.vibrationStatus === 'critical' ? '● CRITICAL EXCEEDANCE' : '● NOMINAL'}
                              </span>
                            </div>

                            <div className="row g-2 my-1">
                              <div className="col-6">
                                <div className="p-2.5 rounded-1 text-center h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>LIVE SSFDR STREAM</span>
                                  <div
                                    className="fs-4 fw-bold my-1 font-mono-tech"
                                    style={{ color: activeDiag.liveTelemetry.vibrationStatus === 'critical' ? '#DC2626' : '#0F172A' }}
                                  >
                                    {activeDiag.liveTelemetry.vibration}
                                  </div>
                                  <small className="text-muted" style={{ fontSize: '0.65rem' }}>Current Telemetry</small>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="p-2.5 rounded-1 text-center h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>4,200h FLEET BASELINE</span>
                                  <div className="fs-4 fw-bold my-1 font-mono-tech text-dark">
                                    {activeDiag.baselineTelemetry.vibration}
                                  </div>
                                  <small className="text-muted" style={{ fontSize: '0.65rem' }}>&lt; 2.5 mm/s Nominal Band</small>
                                </div>
                              </div>
                            </div>

                            <div
                              className="p-2 rounded-1 d-flex justify-content-between align-items-center mt-2"
                              style={{
                                background: activeDiag.liveTelemetry.vibrationStatus === 'critical' ? '#FEF2F2' : '#F0FDF4',
                                border: `1px solid ${activeDiag.liveTelemetry.vibrationStatus === 'critical' ? '#FECACA' : '#BBF7D0'}`,
                                fontSize: '0.72rem'
                              }}
                            >
                              <span className="fw-bold" style={{ color: activeDiag.liveTelemetry.vibrationStatus === 'critical' ? '#B91C1C' : '#15803D' }}>
                                {activeDiag.deviations.vibrationDelta}
                              </span>
                              <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                                142.6 Hz 2X Harmonic Peak
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Box 2: Scavenge Oil Temperature */}
                        <div className="col-12 col-md-6">
                          <div className="bg-white p-3 h-100" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div>
                                <span className="fw-bold text-dark d-block" style={{ fontSize: '0.86rem' }}>
                                  Scavenge Oil Temperature
                                </span>
                                <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                                  Return Line RTD Thermal Sensor
                                </span>
                              </div>
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 600,
                                  color: activeDiag.liveTelemetry.tempStatus === 'warning' ? '#B45309' : '#15803D'
                                }}
                              >
                                {activeDiag.liveTelemetry.tempStatus === 'warning' ? '● THERMAL ADVISORY' : '● NOMINAL'}
                              </span>
                            </div>

                            <div className="row g-2 my-1">
                              <div className="col-6">
                                <div className="p-2.5 rounded-1 text-center h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>LIVE SSFDR STREAM</span>
                                  <div
                                    className="fs-4 fw-bold my-1 font-mono-tech"
                                    style={{ color: activeDiag.liveTelemetry.tempStatus === 'warning' ? '#D97706' : '#0F172A' }}
                                  >
                                    {activeDiag.liveTelemetry.temp}
                                  </div>
                                  <small className="text-muted" style={{ fontSize: '0.65rem' }}>Current Telemetry</small>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="p-2.5 rounded-1 text-center h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>4,200h FLEET BASELINE</span>
                                  <div className="fs-4 fw-bold my-1 font-mono-tech text-dark">
                                    {activeDiag.baselineTelemetry.temp}
                                  </div>
                                  <small className="text-muted" style={{ fontSize: '0.65rem' }}>&lt; 100°C Max Continuous</small>
                                </div>
                              </div>
                            </div>

                            <div
                              className="p-2 rounded-1 d-flex justify-content-between align-items-center mt-2"
                              style={{
                                background: activeDiag.liveTelemetry.tempStatus === 'warning' ? '#FFFBEB' : '#F0FDF4',
                                border: `1px solid ${activeDiag.liveTelemetry.tempStatus === 'warning' ? '#FDE68A' : '#BBF7D0'}`,
                                fontSize: '0.72rem'
                              }}
                            >
                              <span className="fw-bold" style={{ color: activeDiag.liveTelemetry.tempStatus === 'warning' ? '#B45309' : '#15803D' }}>
                                {activeDiag.deviations.tempDelta}
                              </span>
                              <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                                Thermal dissipation degradation
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Box 3: Main Subsystem Pressure */}
                        <div className="col-12 col-md-6">
                          <div className="bg-white p-3 h-100" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div>
                                <span className="fw-bold text-dark d-block" style={{ fontSize: '0.86rem' }}>
                                  Main Subsystem Pressure
                                </span>
                                <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                                  Digital Pressure Transducer
                                </span>
                              </div>
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 600,
                                  color: activeDiag.liveTelemetry.pressureStatus === 'critical' ? '#B91C1C' : '#15803D'
                                }}
                              >
                                {activeDiag.liveTelemetry.pressureStatus === 'critical' ? '● CRITICAL DROP' : '● OPERATIONAL'}
                              </span>
                            </div>

                            <div className="row g-2 my-1">
                              <div className="col-6">
                                <div className="p-2.5 rounded-1 text-center h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>LIVE SSFDR STREAM</span>
                                  <div className="fs-4 fw-bold my-1 font-mono-tech text-dark">
                                    {activeDiag.liveTelemetry.pressure}
                                  </div>
                                  <small className="text-muted" style={{ fontSize: '0.65rem' }}>Current Telemetry</small>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="p-2.5 rounded-1 text-center h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>4,200h FLEET BASELINE</span>
                                  <div className="fs-4 fw-bold my-1 font-mono-tech text-dark">
                                    {activeDiag.baselineTelemetry.pressure}
                                  </div>
                                  <small className="text-muted" style={{ fontSize: '0.65rem' }}>Calibrated Operating Envelope</small>
                                </div>
                              </div>
                            </div>

                            <div
                              className="p-2 rounded-1 d-flex justify-content-between align-items-center mt-2"
                              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.72rem' }}
                            >
                              <span className="text-secondary fw-semibold">
                                {activeDiag.deviations.pressureDelta}
                              </span>
                              <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                                Within operational safety limit
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Box 4: Core Spool Operating Speed */}
                        <div className="col-12 col-md-6">
                          <div className="bg-white p-3 h-100" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div>
                                <span className="fw-bold text-dark d-block" style={{ fontSize: '0.86rem' }}>
                                  Core Spool Operating Speed
                                </span>
                                <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                                  FADEC Optical Tachometer
                                </span>
                              </div>
                              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#15803D' }}>
                                ● NOMINAL RATED
                              </span>
                            </div>

                            <div className="row g-2 my-1">
                              <div className="col-6">
                                <div className="p-2.5 rounded-1 text-center h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>LIVE SSFDR STREAM</span>
                                  <div className="fs-4 fw-bold my-1 font-mono-tech text-dark">
                                    {activeDiag.liveTelemetry.rpm}
                                  </div>
                                  <small className="text-muted" style={{ fontSize: '0.65rem' }}>Current Telemetry</small>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="p-2.5 rounded-1 text-center h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>4,200h FLEET BASELINE</span>
                                  <div className="fs-4 fw-bold my-1 font-mono-tech text-dark">
                                    {activeDiag.baselineTelemetry.rpm}
                                  </div>
                                  <small className="text-muted" style={{ fontSize: '0.65rem' }}>100% Rated Thrust Spool</small>
                                </div>
                              </div>
                            </div>

                            <div
                              className="p-2 rounded-1 d-flex justify-content-between align-items-center mt-2"
                              style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: '0.72rem' }}
                            >
                              <span className="text-success fw-bold">Nominal Tracking (±0.3%)</span>
                              <span className="text-muted" style={{ fontSize: '0.68rem' }}>Zero spool governor lag</span>
                            </div>
                          </div>
                        </div>

                        {/* Box 5: Magnetic Chip Particle Sensor (Full Width) */}
                        <div className="col-12">
                          <div className="bg-white p-3" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div>
                                <span className="fw-bold text-dark d-block" style={{ fontSize: '0.86rem' }}>
                                  Magnetic Chip Particle Sensor
                                </span>
                                <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                                  Scavenge Manifold Debris Detector
                                </span>
                              </div>
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 600,
                                  color: activeDiag.liveTelemetry.chipDetector?.includes('Ferrous') ? '#B91C1C' : '#15803D'
                                }}
                              >
                                {activeDiag.liveTelemetry.chipDetector?.includes('Ferrous') ? '● CONTAMINATION FLAGGED' : '● NOMINAL'}
                              </span>
                            </div>

                            <div className="row g-2 my-1">
                              <div className="col-6">
                                <div className="p-2.5 rounded-1 text-center h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>LIVE SSFDR STREAM</span>
                                  <div
                                    className="fs-5 fw-bold my-1 font-mono-tech"
                                    style={{ color: activeDiag.liveTelemetry.chipDetector?.includes('Ferrous') ? '#DC2626' : '#15803D' }}
                                  >
                                    {activeDiag.liveTelemetry.chipDetector}
                                  </div>
                                  <small className="text-muted" style={{ fontSize: '0.65rem' }}>Ferrous particulate detected</small>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="p-2.5 rounded-1 text-center h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                  <span className="text-muted d-block" style={{ fontSize: '0.65rem' }}>4,200h FLEET BASELINE</span>
                                  <div className="fs-5 fw-bold my-1 font-mono-tech text-dark">
                                    {activeDiag.baselineTelemetry.chipDetector}
                                  </div>
                                  <small className="text-muted" style={{ fontSize: '0.65rem' }}>Zero particles threshold</small>
                                </div>
                              </div>
                            </div>

                            <div
                              className="p-2 rounded-1 d-flex justify-content-between align-items-center mt-2"
                              style={{
                                background: activeDiag.liveTelemetry.chipDetector?.includes('Ferrous') ? '#FEF2F2' : '#F0FDF4',
                                border: `1px solid ${activeDiag.liveTelemetry.chipDetector?.includes('Ferrous') ? '#FECACA' : '#BBF7D0'}`,
                                fontSize: '0.72rem'
                              }}
                            >
                              <span className="fw-bold" style={{ color: activeDiag.liveTelemetry.chipDetector?.includes('Ferrous') ? '#B91C1C' : '#15803D' }}>
                                {activeDiag.liveTelemetry.chipDetector?.includes('Ferrous') ? 'Ferrous debris buildup logged' : 'Manifold clear'}
                              </span>
                              <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                                Spalling wear indication on outer race
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Prognosis & Discrepancy Directive Banner */}
                    <div className="skyline-card p-3 mb-3 bg-white" style={{ border: '1px solid #E5E8EC' }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="d-flex align-items-center gap-2">
                          <AlertTriangle size={16} color="#A85B00" />
                          <span className="fw-bold text-dark font-mono-tech" style={{ fontSize: '0.82rem' }}>
                            AI PROGNOSIS &amp; DISCREPANCY ANALYSIS: {activeDiag.aiDiagnosis.failureMode}
                          </span>
                        </div>
                        <span className="skyline-pill skyline-pill-red" style={{ fontSize: '0.68rem' }}>
                          CONFIDENCE: {activeDiag.aiDiagnosis.confidence}
                        </span>
                      </div>
                      <div className="text-dark small font-mono-tech mb-2" style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>
                        {activeDiag.aiDiagnosis.mechanism}
                      </div>
                      <div className="d-flex flex-wrap justify-content-between align-items-center font-mono-tech pt-2 border-top text-muted" style={{ fontSize: '0.72rem' }}>
                        <span className="text-danger">● DEVIATION: {activeDiag.deviations.vibrationDelta} ({activeDiag.deviations.tempDelta})</span>
                        <span className="text-dark">● ACTION DIRECTIVE: Proceed immediately to physical boroscopy on <strong>{activeDiag.portTarget}</strong>.</span>
                      </div>
                    </div>

                    {/* Sensor Harmonic Trend Graph */}
                    <div className="skyline-card p-3 mb-3 bg-white" style={{ border: '1px solid #E5E8EC' }}>
                      <SensorTrendChart
                        telemetryData={resolvedTelemetry}
                        title={`${job.aircraftId} — Sensor Harmonic Frequency Drift & Baseline Envelope`}
                      />
                    </div>

                    {/* Navigation Buttons */}
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        onClick={() => setActiveStage(1)}
                        className="skyline-btn-secondary"
                        style={{ fontSize: '0.82rem' }}
                      >
                        <ArrowLeft size={14} />
                        <span>Back to Bus Connection</span>
                      </button>

                      <button
                        onClick={() => setActiveStage(3)}
                        className="skyline-btn-dark px-4 py-2"
                        style={{ fontSize: '0.82rem' }}
                      >
                        <span>Proceed to Guided Boroscopy Protocol</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* ============================================================== */}
              {/* STAGE 3: GUIDED OPTICAL BOROSCOPY & NDT CHECKLIST               */}
              {/* ============================================================== */}
              {activeStage === 3 && (
                <div className="skyline-card p-4 bg-white shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <span className="skyline-pill skyline-pill-amber" style={{ fontSize: '0.65rem' }}>STAGE 3 OF 4</span>
                      <h5 className="fw-bold text-dark mb-0 font-mono-tech mt-1" style={{ fontSize: '1.15rem' }}>
                        Guided Optical Boroscopy &amp; NDT Verification Checklist
                      </h5>
                    </div>
                    <span className="skyline-pill skyline-pill-dark font-mono-tech" style={{ fontSize: '0.68rem' }}>
                      IAF TO 1F-AF04 / ASR 33B COMPLIANT
                    </span>
                  </div>

                  <p className="text-muted small font-mono-tech mb-3" style={{ fontSize: '0.78rem' }}>
                    Follow official aeronautical maintenance technical orders for <strong>{job.aircraftId}</strong>. 
                    Verify every physical inspection point before proceeding to airworthiness sign-off.
                  </p>

                  {/* Visual Cutaway HUD */}
                  <div className="p-3 mb-3 rounded-3" style={{ background: '#F8F9FA', border: '1px solid #E5E8EC' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2 font-mono-tech" style={{ fontSize: '0.72rem' }}>
                      <span className="text-muted">OPTICAL BOROSCOPY GUIDE • TARGET: {activeDiag.portTarget}</span>
                      <span className="skyline-pill skyline-pill-red" style={{ fontSize: '0.62rem' }}>CRITICAL ANOMALY LOCATION</span>
                    </div>
                    <div className="text-center p-2 rounded-2 bg-white border position-relative" style={{ borderColor: '#E5E8EC' }}>
                      <img 
                        src="/images/cad/cad-sub-cutaway-engine.png" 
                        alt="Component Cutaway" 
                        className="img-fluid"
                        style={{ maxHeight: '140px', objectFit: 'contain' }}
                      />
                      <div 
                        className="position-absolute d-flex align-items-center gap-1 font-mono-tech bg-dark text-white rounded-pill px-2 py-0.5" 
                        style={{ bottom: '8px', right: '12px', fontSize: '0.62rem' }}
                      >
                        <span>●</span>
                        <span>TARGET: {activeDiag.portTarget}</span>
                      </div>
                    </div>
                  </div>

                  {/* Requisitioned Spare Part Notice */}
                  <div className="p-3 rounded-3 mb-3 d-flex justify-content-between align-items-center font-mono-tech" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', fontSize: '0.78rem' }}>
                    <div>
                      <span className="text-muted d-block" style={{ fontSize: '0.68rem' }}>PRE-REQUISITIONED REPLACEMENT LRU SPARE:</span>
                      <strong className="text-dark">{activeDiag.sparePart}</strong>
                    </div>
                    <span className="skyline-pill skyline-pill-green" style={{ fontSize: '0.7rem' }}>
                      RESERVED IN BAY 3 INVENTORY
                    </span>
                  </div>

                  {/* Interactive Checklist */}
                  <div className="d-flex flex-column gap-2 font-mono-tech mb-4" style={{ fontSize: '0.82rem' }}>
                    <label className="p-3 rounded-3 d-flex align-items-center gap-3 cursor-pointer" style={{ background: '#F8F9FA', border: '1px solid #E5E7EB' }}>
                      <input
                        type="checkbox"
                        checked={confirmedChecklist.boroscopeCompleted}
                        onChange={() => handleCheckboxChange('boroscopeCompleted')}
                        className="form-check-input mt-0"
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span>1. Insert video boroscope probe via {activeDiag.portTarget} and examine contact surface for micro-spalling or fatigue pitting.</span>
                    </label>

                    <label className="p-3 rounded-3 d-flex align-items-center gap-3 cursor-pointer" style={{ background: '#F8F9FA', border: '1px solid #E5E7EB' }}>
                      <input
                        type="checkbox"
                        checked={confirmedChecklist.debrisInspected}
                        onChange={() => handleCheckboxChange('debrisInspected')}
                        className="form-check-input mt-0"
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span>2. Extract and inspect magnetic chip detector plug; clean metallic particles and verify zero ferrous debris remaining.</span>
                    </label>

                    <label className="p-3 rounded-3 d-flex align-items-center gap-3 cursor-pointer" style={{ background: '#F8F9FA', border: '1px solid #E5E7EB' }}>
                      <input
                        type="checkbox"
                        checked={confirmedChecklist.spareReplaced}
                        onChange={() => handleCheckboxChange('spareReplaced')}
                        className="form-check-input mt-0"
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span>3. Confirm replacement LRU spare kit ({activeDiag.sparePart}) batch number and QA certificate.</span>
                    </label>

                    <label className="p-3 rounded-3 d-flex align-items-center gap-3 cursor-pointer" style={{ background: '#F8F9FA', border: '1px solid #E5E7EB' }}>
                      <input
                        type="checkbox"
                        checked={confirmedChecklist.torqueCalibrated}
                        onChange={() => handleCheckboxChange('torqueCalibrated')}
                        className="form-check-input mt-0"
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span>4. Calibrate torque wrench and verify retention flange bolts torqued to 142 Nm specification.</span>
                    </label>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="d-flex justify-content-between">
                    <button
                      onClick={() => setActiveStage(2)}
                      className="skyline-btn-secondary"
                      style={{ fontSize: '0.82rem' }}
                    >
                      <ArrowLeft size={14} />
                      <span>Back to Telemetry Review</span>
                    </button>

                    <button
                      onClick={() => setActiveStage(4)}
                      disabled={!allChecksConfirmed}
                      className={allChecksConfirmed ? 'skyline-btn-dark px-4 py-2' : 'skyline-btn-secondary px-4 py-2 opacity-50'}
                      style={{ fontSize: '0.82rem' }}
                    >
                      <span>Proceed to Airworthiness Certification</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STAGE 4: AI SYNTHESIS, DISPOSITION & COMMAND SUBMISSION       */}
              {/* ============================================================== */}
              {activeStage === 4 && (
                <div className="bg-white p-4 shadow-sm" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                  {/* Stage Header */}
                  <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom font-mono-tech">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="px-2 py-0.5" style={{ fontSize: '0.68rem', backgroundColor: '#0F172A', color: '#FFFFFF', borderRadius: '4px' }}>
                          STAGE 4 OF 4
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                          FINAL AIRWORTHINESS DISPOSITION &amp; COMMAND SUBMISSION
                        </span>
                      </div>
                      <h5 className="fw-bold text-dark mb-0 font-sans" style={{ fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
                        Technician Maintenance Certification &amp; Base Command Dispatch
                      </h5>
                    </div>
                    <div className="text-end font-mono-tech text-muted" style={{ fontSize: '0.72rem' }}>
                      <span>DEF-STAN 00-970 / IAF AIRWORTHINESS</span>
                      <div className="text-dark fw-bold">BASE COMMAND: ARJUN MEHTA</div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* SECTION 1: AI/ML PROGNOSTIC VERDICT HERO PANEL */}
                    <div
                      className="p-3 mb-3 font-mono-tech"
                      style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                        <div className="d-flex align-items-center gap-2">
                          <Cpu size={16} className="text-primary" />
                          <strong className="text-dark" style={{ fontSize: '0.84rem' }}>
                            AI / ML PROGNOSTIC SYNTHESIS &amp; FLEET HEALTH VERDICT
                          </strong>
                        </div>
                        <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                          MODEL CONFIDENCE: <strong className="text-dark">{activeDiag.aiDiagnosis.confidence}</strong>
                        </span>
                      </div>

                      <div className="row g-3 align-items-center">
                        <div className="col-12 col-md-4 border-end">
                          <span className="text-muted d-block" style={{ fontSize: '0.68rem' }}>
                            CALCULATED REMAINING USEFUL LIFE (RUL):
                          </span>
                          <div className="fs-3 fw-bold font-mono-tech text-danger my-1">
                            {activeDiag.aiDiagnosis.rul}
                          </div>
                          <span className="text-muted small" style={{ fontSize: '0.68rem' }}>
                            Critical fatigue threshold (ISO-13374)
                          </span>
                        </div>

                        <div className="col-12 col-md-8">
                          <div className="text-secondary mb-2" style={{ fontSize: '0.76rem', lineHeight: 1.5 }}>
                            <strong className="text-dark">Detected Failure Mode:</strong> {activeDiag.aiDiagnosis.failureMode}. {activeDiag.aiDiagnosis.mechanism}
                          </div>

                          <div
                            className="p-2 rounded-1 d-flex align-items-center gap-2"
                            style={{
                              background: recommendationChoice === 'MAINTENANCE_REQUIRED' ? '#FEF2F2' : '#F0FDF4',
                              border: `1px solid ${recommendationChoice === 'MAINTENANCE_REQUIRED' ? '#FECACA' : '#BBF7D0'}`,
                              color: recommendationChoice === 'MAINTENANCE_REQUIRED' ? '#991B1B' : '#166534',
                              fontSize: '0.74rem'
                            }}
                          >
                            <AlertTriangle size={15} className="flex-shrink-0" />
                            <span>
                              <strong>MODEL GUIDANCE:</strong>{' '}
                              {activeDiag.aiDiagnosis.rul.includes('38')
                                ? 'Critical wear threshold exceeded. Airframe should be grounded for heavy maintenance.'
                                : 'Nominal tolerance bounds maintained. Field sortie clearance is permissible.'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: TECHNICIAN AIRWORTHINESS DISPOSITION (THE OPERATIONAL DECISION) */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2 font-mono-tech">
                        <strong className="text-dark" style={{ fontSize: '0.84rem' }}>
                          TECHNICIAN AIRWORTHINESS DISPOSITION (OPERATIONAL CLEARANCE DECISION)
                        </strong>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                          SELECT AIRWORTHINESS DIRECTIVE FOR {job.aircraftId}
                        </span>
                      </div>

                      <div className="row g-3 font-mono-tech">
                        {/* Option A: Recommend Heavy Maintenance */}
                        <div className="col-12 col-md-6">
                          <div
                            onClick={() => setRecommendationChoice('MAINTENANCE_REQUIRED')}
                            className="p-3 h-100 cursor-pointer transition-all"
                            style={{
                              background: recommendationChoice === 'MAINTENANCE_REQUIRED' ? '#FEF2F2' : '#FFFFFF',
                              border: recommendationChoice === 'MAINTENANCE_REQUIRED' ? '2px solid #DC2626' : '1px solid #E2E8F0',
                              borderRadius: '8px',
                              cursor: 'pointer'
                            }}
                          >
                            <div className="d-flex align-items-start gap-2.5">
                              <input
                                type="radio"
                                name="techRecommendation"
                                value="MAINTENANCE_REQUIRED"
                                checked={recommendationChoice === 'MAINTENANCE_REQUIRED'}
                                onChange={() => setRecommendationChoice('MAINTENANCE_REQUIRED')}
                                className="form-check-input mt-1"
                                style={{ width: '17px', height: '17px', accentColor: '#DC2626', cursor: 'pointer' }}
                              />
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <strong style={{ color: '#DC2626', fontSize: '0.88rem' }}>
                                    Ground &amp; Route to Heavy Maintenance Wing
                                  </strong>
                                  <span className="px-1.5 py-0.5" style={{ fontSize: '0.64rem', background: '#DC2626', color: '#FFFFFF', borderRadius: '3px' }}>
                                    DEPOT REPAIR
                                  </span>
                                </div>
                                <p className="text-secondary mb-0" style={{ fontSize: '0.74rem', lineHeight: 1.45 }}>
                                  Ground airframe immediately before next combat sortie. Route work order to Base Heavy Maintenance Wing for deep propulsion overhaul and dynamic balancing.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Option B: Field Repair Completed / Clearance */}
                        <div className="col-12 col-md-6">
                          <div
                            onClick={() => setRecommendationChoice('FLIGHT_CLEARED')}
                            className="p-3 h-100 cursor-pointer transition-all"
                            style={{
                              background: recommendationChoice === 'FLIGHT_CLEARED' ? '#F0FDF4' : '#FFFFFF',
                              border: recommendationChoice === 'FLIGHT_CLEARED' ? '2px solid #16A34A' : '1px solid #E2E8F0',
                              borderRadius: '8px',
                              cursor: 'pointer'
                            }}
                          >
                            <div className="d-flex align-items-start gap-2.5">
                              <input
                                type="radio"
                                name="techRecommendation"
                                value="FLIGHT_CLEARED"
                                checked={recommendationChoice === 'FLIGHT_CLEARED'}
                                onChange={() => setRecommendationChoice('FLIGHT_CLEARED')}
                                className="form-check-input mt-1"
                                style={{ width: '17px', height: '17px', accentColor: '#16A34A', cursor: 'pointer' }}
                              />
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <strong style={{ color: '#16A34A', fontSize: '0.88rem' }}>
                                    Field Repair Complete — Recommend Sortie Clearance
                                  </strong>
                                  <span className="px-1.5 py-0.5" style={{ fontSize: '0.64rem', background: '#16A34A', color: '#FFFFFF', borderRadius: '3px' }}>
                                    SORTIE READY
                                  </span>
                                </div>
                                <p className="text-secondary mb-0" style={{ fontSize: '0.74rem', lineHeight: 1.45 }}>
                                  Component replacement verified, transducers calibrated within nominal baseline bounds. Recommend Base Commander issue operational flight clearance.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: INSPECTION LOG & SIGN-OFF DOSSIER */}
                    <div className="row g-3 mb-3 font-mono-tech">
                      {/* Physical Findings */}
                      <div className="col-12 col-md-6">
                        <div className="bg-white p-3 h-100" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                          <div className="d-flex justify-content-between align-items-center mb-1.5">
                            <span className="fw-bold text-dark" style={{ fontSize: '0.78rem' }}>
                              PHYSICAL &amp; BOROSCOPY FINDINGS
                            </span>
                            <span className="text-muted" style={{ fontSize: '0.68rem' }}>PORT {activeDiag.portTarget}</span>
                          </div>
                          <textarea
                            rows={3}
                            className="form-control font-mono-tech"
                            value={findingsText}
                            onChange={(e) => setFindingsText(e.target.value)}
                            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.76rem', resize: 'vertical' }}
                            required
                          ></textarea>
                        </div>
                      </div>

                      {/* Technician Remarks */}
                      <div className="col-12 col-md-6">
                        <div className="bg-white p-3 h-100" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                          <div className="d-flex justify-content-between align-items-center mb-1.5">
                            <span className="fw-bold text-dark" style={{ fontSize: '0.78rem' }}>
                              CERTIFYING TECHNICIAN REMARKS &amp; RATIONALE
                            </span>
                            <span className="text-muted" style={{ fontSize: '0.68rem' }}>CERT-TECH SIGN-OFF</span>
                          </div>
                          <textarea
                            rows={3}
                            className="form-control font-mono-tech"
                            value={technicianNotes}
                            onChange={(e) => setTechnicianNotes(e.target.value)}
                            placeholder="State rationale for your recommendation, specific component observations..."
                            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.76rem', resize: 'vertical' }}
                            required
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Command Protocol Alert Strip */}
                    <div
                      className="p-2.5 px-3 mb-3 d-flex justify-content-between align-items-center font-mono-tech"
                      style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.72rem' }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <Shield size={14} className="text-dark flex-shrink-0" />
                        <span className="text-dark">
                          <strong>COMMAND DISPATCH PROTOCOL:</strong> Transmitting report to Base Command (Arjun Mehta). Airframe status remains pending until official Passing Order is validated.
                        </span>
                      </div>
                      <span className="text-muted d-none d-md-inline">[MIL-STD-1553B VERIFIED]</span>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                      <button
                        type="button"
                        onClick={() => setActiveStage(3)}
                        className="skyline-btn-secondary px-3 py-2 font-mono-tech"
                        style={{ fontSize: '0.8rem' }}
                      >
                        <ArrowLeft size={14} />
                        <span>Back to Checklist</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="font-mono-tech px-4 py-2.5 d-flex align-items-center gap-2 text-white shadow-sm"
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          backgroundColor: '#0F172A',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            <span>DISPATCHING REPORT TO BASE COMMAND...</span>
                          </>
                        ) : (
                          <>
                            <FileText size={15} color="#F59E0B" />
                            <span>Dispatch Inspection Report to Base Command (Arjun Mehta)</span>
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
