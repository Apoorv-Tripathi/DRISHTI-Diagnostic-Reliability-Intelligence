import React, { useState } from 'react';
import {
  Cpu,
  Radio,
  RefreshCw,
  Zap,
  Database,
  PlayCircle,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Layers,
  ArrowRight,
  Shield,
  FileText,
  Sliders,
  CheckSquare
} from 'lucide-react';

export default function AvionicsBusDiagnostics({
  currentUser,
  workOrders = [],
  aircraftList = [],
  onStartInspection,
  onNavigate
}) {
  const [selectedAirframe, setSelectedAirframe] = useState('AF-04');
  const [busState, setBusState] = useState('disconnected'); // 'disconnected' | 'connecting' | 'extracting' | 'analyzing' | 'complete'
  const [extractProgress, setExtractProgress] = useState(0);
  const [extractionLog, setExtractionLog] = useState('');
  const [framesExtracted, setFramesExtracted] = useState(0);
  const [autoCompleteDone, setAutoCompleteDone] = useState(false);

  // Hardware Diagnostic Profiles for Airframes
  const airframeDiagnostics = {
    'AF-04': {
      name: 'Vajra-04 (Su-30MKI / Mirage Variant)',
      subsystem: 'Turbofan Powerplant (E-01) High-Pressure Spool',
      cadImg: '/images/cad/cad-subsystem-engine.png',
      currentFlight: {
        vibration: '5.21 mm/s',
        vibrationStatus: 'critical',
        egt: '642°C',
        egtStatus: 'warning',
        oilPressure: '1.82 bar',
        oilStatus: 'warning',
        coreRpm: '14,240 RPM',
        chipDetector: 'Ferrous Debris Flagged'
      },
      baselinePastData: {
        vibration: '1.42 mm/s',
        egt: '580°C',
        oilPressure: '2.15 bar',
        coreRpm: '14,200 RPM',
        chipDetector: 'Zero Particles'
      },
      deviations: {
        vibrationDelta: '+267% Spike',
        egtDelta: '+10.7% Thermal Rise',
        oilDelta: '-15.3% Drop'
      },
      aiDiagnosis: {
        failureMode: 'High-Pressure Stage 2 Turbine Bearing Micro-Spalling & Outer Race Fatigue',
        confidence: 94.2,
        rulEstimate: '38.4 Flight Hours',
        rulConfidenceRange: '32h – 44h',
        severity: 'Critical',
        physicalMechanism: 'Harmonic vibration spectral analysis isolates 142Hz harmonic frequency signature characteristic of roller race subsurface micro-fissures under afterburner thermal cycles.',
        directive: 'Mandatory physical optical boroscopy through inspection port B-4. Requisition OEM bearing assembly ENG-BRG-7440 before next sortie.'
      }
    },
    'AF-02': {
      name: 'Tejas Mk1 (LCA Tactical Wing)',
      subsystem: 'Hydraulic Flight Control & Quad-Redundant Actuators',
      cadImg: '/images/cad/cad-sub-hydraulics.png',
      currentFlight: {
        vibration: '1.18 mm/s',
        vibrationStatus: 'healthy',
        egt: '575°C',
        egtStatus: 'healthy',
        oilPressure: '2.08 bar',
        oilStatus: 'healthy',
        coreRpm: '14,180 RPM',
        chipDetector: 'Nominal Clean'
      },
      baselinePastData: {
        vibration: '1.20 mm/s',
        egt: '578°C',
        oilPressure: '2.10 bar',
        coreRpm: '14,200 RPM',
        chipDetector: 'Clean'
      },
      deviations: {
        vibrationDelta: 'Nominal (±1.6%)',
        egtDelta: 'Nominal (±0.5%)',
        oilDelta: 'Nominal (±0.9%)'
      },
      aiDiagnosis: {
        failureMode: 'System Operating within Nominal Combat Availability Tolerances',
        confidence: 98.1,
        rulEstimate: '> 220 Flight Hours',
        rulConfidenceRange: '200h – 250h',
        severity: 'Healthy',
        physicalMechanism: 'All 4 hydraulic line transducers report 280-bar loop pressures without cavitational noise or transient accumulator pressure drop.',
        directive: 'Aircraft cleared for scheduled turnaround and active squadron sortie allocation.'
      }
    },
    'AF-05': {
      name: 'Vajra-05 (AESA Tactical Combat)',
      subsystem: 'RBE2 AESA Radar & SPECTRA Digital Avionics Bus',
      cadImg: '/images/cad/cad-sub-avionics.png',
      currentFlight: {
        vibration: '1.30 mm/s',
        vibrationStatus: 'healthy',
        egt: '582°C',
        egtStatus: 'healthy',
        oilPressure: '2.12 bar',
        oilStatus: 'healthy',
        coreRpm: '14,190 RPM',
        chipDetector: 'Clean'
      },
      baselinePastData: {
        vibration: '1.25 mm/s',
        egt: '580°C',
        oilPressure: '2.14 bar',
        coreRpm: '14,200 RPM',
        chipDetector: 'Clean'
      },
      deviations: {
        vibrationDelta: 'Nominal (±4%)',
        egtDelta: 'Nominal (±0.3%)',
        oilDelta: 'Nominal (±0.8%)'
      },
      aiDiagnosis: {
        failureMode: 'AESA Radar Phase Shifter Drift Advisory',
        confidence: 89.6,
        rulEstimate: '~85 Flight Hours',
        rulConfidenceRange: '75h – 95h',
        severity: 'Warning',
        physicalMechanism: 'Transmit/Receive module tile 4 reports micro-voltage ripple during continuous track-while-scan radar modes.',
        directive: 'Perform calibration test via bus diagnostic console prior to night-strike configuration.'
      }
    }
  };

  const currentDiagnostic = airframeDiagnostics[selectedAirframe] || airframeDiagnostics['AF-04'];

  // Matching work orders for this airframe
  const matchingWorkOrders = workOrders.filter(w => w.aircraftId === selectedAirframe);
  const activeMatchingOrder = matchingWorkOrders.find(w => w.status !== 'Completed') || matchingWorkOrders[0];

  // Handle Physical GSE Bus Connection
  const handleConnectBus = () => {
    setBusState('connecting');
    setExtractProgress(15);
    setExtractionLog('Locking GSE harness onto MIL-STD-1553B avionics interface port...');
    setAutoCompleteDone(false);

    setTimeout(() => {
      setBusState('extracting');
      setExtractProgress(35);
      setExtractionLog('Hardware handshake confirmed. Reading Solid-State Flight Recorder (SSFDR) & HUMS buffer...');

      const interval = setInterval(() => {
        setExtractProgress(prev => {
          if (prev >= 85) {
            clearInterval(interval);
            setBusState('analyzing');
            setExtractionLog('Executing Spectral FFT harmonic decomposition & past fleet baseline isolation...');
            setTimeout(() => {
              setExtractProgress(100);
              setFramesExtracted(14820);
              setBusState('complete');
              setExtractionLog('Telemetry sync complete. Anomaly harmonics cross-referenced with fleet norm.');
            }, 1200);
            return 90;
          }
          setFramesExtracted(Math.min(14820, Math.floor((prev / 90) * 14820)));
          return prev + 15;
        });
      }, 300);
    }, 1100);
  };

  const handleDisconnectBus = () => {
    setBusState('disconnected');
    setExtractProgress(0);
    setFramesExtracted(0);
    setExtractionLog('');
    setAutoCompleteDone(false);
  };

  // Launch inspection and link to matching job card
  const handleLaunchDiagnosisInspection = () => {
    if (activeMatchingOrder) {
      onStartInspection(activeMatchingOrder);
    } else {
      onStartInspection({
        orderId: `WO-DIAG-${selectedAirframe}`,
        aircraftId: selectedAirframe,
        title: currentDiagnostic.aiDiagnosis.failureMode,
        jobType: 'GSE Diagnostic Inspection',
        subsystem: currentDiagnostic.subsystem,
        priority: currentDiagnostic.aiDiagnosis.severity === 'Critical' ? 'High' : 'Medium',
        reason: currentDiagnostic.aiDiagnosis.directive,
        predictedRul: currentDiagnostic.aiDiagnosis.rulEstimate,
        status: 'In Progress'
      });
    }
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-3" style={{ maxWidth: '1440px' }}>
      
      {/* 1. Header & Dedicated Avionics Bus Banner */}
      <div className="skyline-card p-4 mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.68rem', padding: '0.2rem 0.65rem' }}>
                HARDWARE GSE TEST FACILITY
              </span>
              <span className="skyline-pill skyline-pill-amber" style={{ fontSize: '0.68rem' }}>
                BASE: {currentUser?.base || 'Ambala AFS'}
              </span>
            </div>
            <h3 className="fw-bold text-dark mb-1 font-mono-tech" style={{ letterSpacing: '-0.02em', fontSize: '1.45rem' }}>
              Avionics Bus &amp; GSE Diagnostic Terminal
            </h3>
            <p className="text-muted font-mono-tech small mb-0" style={{ fontSize: '0.8rem' }}>
              Physical MIL-STD-1553B / ARINC-429 telemetry harness ingestion, Solid-State Flight Data Recorder (SSFDR) decoding, and comparative fleet baseline matching.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => onNavigate('technician-dashboard')}
              className="skyline-btn-secondary py-2 px-3 d-flex align-items-center gap-2"
              style={{ fontSize: '0.82rem' }}
            >
              <span>← Back to My Assigned Work</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. PHYSICAL BUS HARNESS TERMINAL */}
      <div className="skyline-card p-4 mb-4 border shadow-sm" style={{ background: '#FFFFFF', borderColor: '#E5E8EC' }}>
        
        {/* Terminal Header & Controls */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-3 border-bottom gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="skyline-pill skyline-pill-solid-dark" style={{ fontSize: '0.66rem' }}>
                GSE HARNESS MK-IV
              </span>
              <span className="font-mono-tech text-muted" style={{ fontSize: '0.74rem' }}>
                PHYSICAL CONNECTOR: INTERFACE PORT B-4 (BAY FLANK)
              </span>
            </div>
            <h4 className="fw-bold text-dark mb-0 font-mono-tech" style={{ fontSize: '1.25rem' }}>
              Airframe Avionics Ingestion &amp; AI Delta Analysis
            </h4>
          </div>

          {/* Airframe Selection & Harness Button */}
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted font-mono-tech" style={{ fontSize: '0.72rem' }}>TARGET AIRFRAME:</span>
              <select
                className="form-select form-select-sm font-mono-tech fw-bold"
                style={{ width: '160px', fontSize: '0.8rem', borderRadius: '14px', border: '1px solid #D1D5DB' }}
                value={selectedAirframe}
                onChange={(e) => {
                  setSelectedAirframe(e.target.value);
                  handleDisconnectBus();
                }}
                disabled={busState === 'connecting' || busState === 'extracting' || busState === 'analyzing'}
              >
                <option value="AF-04">AF-04 (Vajra-04)</option>
                <option value="AF-02">AF-02 (Tejas Mk1)</option>
                <option value="AF-05">AF-05 (Mirage-2000)</option>
              </select>
            </div>

            {busState === 'disconnected' ? (
              <button
                onClick={handleConnectBus}
                className="skyline-btn-dark py-1.5 px-3 d-flex align-items-center gap-2"
                style={{ fontSize: '0.82rem' }}
              >
                <Zap size={14} />
                <span>Connect Physical Data Bus</span>
              </button>
            ) : busState === 'complete' ? (
              <button
                onClick={handleDisconnectBus}
                className="skyline-btn-secondary py-1.5 px-3 d-flex align-items-center gap-2 text-danger"
                style={{ fontSize: '0.82rem' }}
              >
                <RefreshCw size={13} />
                <span>Disconnect Harness</span>
              </button>
            ) : (
              <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-light border font-mono-tech text-muted" style={{ fontSize: '0.78rem' }}>
                <RefreshCw size={13} className="spin text-primary" />
                <span>Connecting Harness...</span>
              </div>
            )}
          </div>
        </div>

        {/* State A: DISCONNECTED STATE */}
        {busState === 'disconnected' && (
          <div className="p-5 rounded-3 text-center" style={{ background: '#F8F9FA', border: '1px dashed #CBD5E1' }}>
            <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: '#FFFFFF', border: '1px solid #E5E8EC', color: '#64748B' }}>
              <Radio size={32} />
            </div>
            <h5 className="fw-bold text-dark font-mono-tech mb-1" style={{ fontSize: '1.05rem' }}>
              Physical Diagnostic Harness Disconnected
            </h5>
            <p className="text-muted small mb-4 font-mono-tech" style={{ maxWidth: '560px', margin: '0 auto', fontSize: '0.8rem' }}>
              Attach Ground Support Equipment (GSE) diagnostic harness to airframe <strong>{selectedAirframe}</strong> via MIL-STD-1553B / ARINC-429 interface port. 
              Click <strong>"Connect Physical Data Bus"</strong> above to perform hardware pin handshake and dump solid-state telemetry buffers.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3 font-mono-tech text-muted small" style={{ fontSize: '0.72rem' }}>
              <span>● HARNESS: MIL-STD-1553B DUAL-BUS</span>
              <span>● BAUD: 1.0 Mbps</span>
              <span>● SAMPLING RATE: 20Hz / 1000Hz BURST</span>
              <span>● VOLTAGE: 28V DC NOMINAL</span>
            </div>
          </div>
        )}

        {/* State B: CONNECTING / EXTRACTING BUFFER ANIMATION */}
        {(busState === 'connecting' || busState === 'extracting' || busState === 'analyzing') && (
          <div className="p-4 rounded-3" style={{ background: '#F8F9FA', border: '1px solid #E5E7EB' }}>
            <div className="d-flex justify-content-between align-items-center mb-2 font-mono-tech" style={{ fontSize: '0.78rem' }}>
              <div className="d-flex align-items-center gap-2">
                <span className="badge rounded-circle p-1 pulse-live" style={{ backgroundColor: '#FFA034', width: '8px', height: '8px', display: 'inline-block' }}></span>
                <strong className="text-dark">
                  {busState === 'connecting' && 'INITIALIZING HARNESS PIN HANDSHAKE...'}
                  {busState === 'extracting' && `EXTRACTING TELEMETRY BUFFER (${framesExtracted.toLocaleString()} FRAMES)...`}
                  {busState === 'analyzing' && 'AI ENGINE MATCHING PAST FLEET BASELINE...'}
                </strong>
              </div>
              <span className="fw-bold text-dark">{extractProgress}%</span>
            </div>

            <div className="progress mb-3" style={{ height: '8px', borderRadius: '4px', background: '#E2E8F0' }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                style={{
                  width: `${extractProgress}%`,
                  backgroundColor: busState === 'analyzing' ? '#FFA034' : '#1DC30A',
                  transition: 'width 0.3s ease'
                }}
              ></div>
            </div>

            <div className="d-flex justify-content-between align-items-center font-mono-tech text-muted small" style={{ fontSize: '0.72rem' }}>
              <span>{extractionLog}</span>
              <span>CHANNEL: DUAL-REDUNDANT BUS A/B [LOCKED]</span>
            </div>
          </div>
        )}

        {/* State C: COMPLETE STATE — SIDE-BY-SIDE TELEMETRY COMPARISON & AI SUMMARY */}
        {busState === 'complete' && (
          <div>
            {/* Status bar */}
            <div className="p-2 px-3 rounded-3 mb-3 d-flex flex-wrap justify-content-between align-items-center font-mono-tech" style={{ background: '#F0FDF4', border: '1px solid rgba(29, 195, 10, 0.25)', fontSize: '0.74rem' }}>
              <div className="d-flex align-items-center gap-2">
                <span className="badge rounded-circle p-1" style={{ backgroundColor: '#1DC30A', width: '8px', height: '8px', display: 'inline-block' }}></span>
                <strong style={{ color: '#0F8205' }}>PHYSICAL BUS LINK SYNCHRONIZED:</strong>
                <span className="text-dark">14,820 SENSOR FRAMES DECODED &amp; ALIGNED</span>
              </div>
              <span className="text-muted">
                INGESTION TIMESTAMP: {new Date().toLocaleTimeString()} UTC • BUS: MIL-1553B
              </span>
            </div>

            {/* Side-by-Side Comparison Columns */}
            <div className="row g-3 mb-3">
              
              {/* SIDE A: Fresh Ingested Aircraft Telemetry */}
              <div className="col-12 col-lg-6">
                <div className="p-3 rounded-3 h-100" style={{ background: '#F8F9FA', border: '1px solid #E2E8F0' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <Cpu size={16} color="#333333" />
                      <span className="fw-bold text-dark font-mono-tech" style={{ fontSize: '0.85rem' }}>
                        1. INGESTED FLIGHT DATA ({selectedAirframe})
                      </span>
                    </div>
                    <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.62rem' }}>
                      SOLID-STATE DUMP
                    </span>
                  </div>

                  <div className="font-mono-tech small mb-2 text-muted" style={{ fontSize: '0.72rem' }}>
                    Target Component: <strong className="text-dark">{currentDiagnostic.subsystem}</strong>
                  </div>

                  <div className="d-flex flex-column gap-2 font-mono-tech">
                    <div className="d-flex justify-content-between align-items-center p-2 rounded-2 bg-white border" style={{ borderColor: '#E5E7EB' }}>
                      <span className="text-muted" style={{ fontSize: '0.74rem' }}>Turbine Vibration (Stage 2)</span>
                      <strong style={{ fontSize: '0.88rem', color: currentDiagnostic.currentFlight.vibrationStatus === 'critical' ? '#D32F1A' : '#0F8205' }}>
                        {currentDiagnostic.currentFlight.vibration}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between align-items-center p-2 rounded-2 bg-white border" style={{ borderColor: '#E5E7EB' }}>
                      <span className="text-muted" style={{ fontSize: '0.74rem' }}>Exhaust Gas Temperature (EGT)</span>
                      <strong style={{ fontSize: '0.88rem', color: currentDiagnostic.currentFlight.egtStatus === 'warning' ? '#A85B00' : '#0F8205' }}>
                        {currentDiagnostic.currentFlight.egt}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between align-items-center p-2 rounded-2 bg-white border" style={{ borderColor: '#E5E7EB' }}>
                      <span className="text-muted" style={{ fontSize: '0.74rem' }}>Lubricating Oil Pressure</span>
                      <strong style={{ fontSize: '0.88rem', color: currentDiagnostic.currentFlight.oilStatus === 'warning' ? '#A85B00' : '#0F8205' }}>
                        {currentDiagnostic.currentFlight.oilPressure}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between align-items-center p-2 rounded-2 bg-white border" style={{ borderColor: '#E5E7EB' }}>
                      <span className="text-muted" style={{ fontSize: '0.74rem' }}>High-Pressure Spool Core RPM</span>
                      <strong className="text-dark" style={{ fontSize: '0.88rem' }}>
                        {currentDiagnostic.currentFlight.coreRpm}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between align-items-center p-2 rounded-2 bg-white border" style={{ borderColor: '#E5E7EB' }}>
                      <span className="text-muted" style={{ fontSize: '0.74rem' }}>Magnetic Chip Detector</span>
                      <span className={`skyline-pill ${currentDiagnostic.currentFlight.chipDetector.includes('Debris') ? 'skyline-pill-red' : 'skyline-pill-green'}`} style={{ fontSize: '0.64rem' }}>
                        {currentDiagnostic.currentFlight.chipDetector}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SIDE B: AI / ML Baseline Historical Data */}
              <div className="col-12 col-lg-6">
                <div className="p-3 rounded-3 h-100" style={{ background: '#F8F9FA', border: '1px solid #E2E8F0' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <Database size={16} color="#333333" />
                      <span className="fw-bold text-dark font-mono-tech" style={{ fontSize: '0.85rem' }}>
                        2. AI BASELINE &amp; HISTORICAL FLEET NORM
                      </span>
                    </div>
                    <span className="skyline-pill skyline-pill-green" style={{ fontSize: '0.62rem' }}>
                      4,200h FLEET MODEL
                    </span>
                  </div>

                  <div className="font-mono-tech small mb-2 text-muted" style={{ fontSize: '0.72rem' }}>
                    Algorithm: <strong>Spectral FFT &amp; Multi-Variate Isolation Forest</strong>
                  </div>

                  <div className="d-flex flex-column gap-2 font-mono-tech">
                    <div className="d-flex justify-content-between align-items-center p-2 rounded-2 bg-white border" style={{ borderColor: '#E5E7EB' }}>
                      <div>
                        <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Nominal Baseline</span>
                        <strong className="text-dark" style={{ fontSize: '0.84rem' }}>{currentDiagnostic.baselinePastData.vibration}</strong>
                      </div>
                      <div className="text-end">
                        <span className="text-muted d-block" style={{ fontSize: '0.68rem' }}>OBSERVED VARIANCE</span>
                        <span className="fw-bold" style={{ fontSize: '0.82rem', color: currentDiagnostic.deviations.vibrationDelta.includes('+267%') ? '#D32F1A' : '#0F8205' }}>
                          {currentDiagnostic.deviations.vibrationDelta}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center p-2 rounded-2 bg-white border" style={{ borderColor: '#E5E7EB' }}>
                      <div>
                        <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Nominal Baseline</span>
                        <strong className="text-dark" style={{ fontSize: '0.84rem' }}>{currentDiagnostic.baselinePastData.egt}</strong>
                      </div>
                      <div className="text-end">
                        <span className="text-muted d-block" style={{ fontSize: '0.68rem' }}>OBSERVED VARIANCE</span>
                        <span className="fw-bold" style={{ fontSize: '0.82rem', color: currentDiagnostic.deviations.egtDelta.includes('+10.7%') ? '#A85B00' : '#0F8205' }}>
                          {currentDiagnostic.deviations.egtDelta}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center p-2 rounded-2 bg-white border" style={{ borderColor: '#E5E7EB' }}>
                      <div>
                        <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Nominal Baseline</span>
                        <strong className="text-dark" style={{ fontSize: '0.84rem' }}>{currentDiagnostic.baselinePastData.oilPressure}</strong>
                      </div>
                      <div className="text-end">
                        <span className="text-muted d-block" style={{ fontSize: '0.68rem' }}>OBSERVED VARIANCE</span>
                        <span className="fw-bold" style={{ fontSize: '0.82rem', color: currentDiagnostic.deviations.oilDelta.includes('-15.3%') ? '#A85B00' : '#0F8205' }}>
                          {currentDiagnostic.deviations.oilDelta}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center p-2 rounded-2 bg-white border" style={{ borderColor: '#E5E7EB' }}>
                      <div>
                        <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Nominal Baseline</span>
                        <strong className="text-dark" style={{ fontSize: '0.84rem' }}>{currentDiagnostic.baselinePastData.coreRpm}</strong>
                      </div>
                      <div className="text-end">
                        <span className="text-muted d-block" style={{ fontSize: '0.68rem' }}>OBSERVED VARIANCE</span>
                        <span className="fw-bold text-dark" style={{ fontSize: '0.82rem' }}>Nominal (±0.2%)</span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center p-2 rounded-2 bg-white border" style={{ borderColor: '#E5E7EB' }}>
                      <div>
                        <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Nominal Baseline</span>
                        <strong className="text-dark" style={{ fontSize: '0.84rem' }}>{currentDiagnostic.baselinePastData.chipDetector}</strong>
                      </div>
                      <div className="text-end">
                        <span className="text-muted d-block" style={{ fontSize: '0.68rem' }}>STATUS</span>
                        <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.62rem' }}>CALIBRATED</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI DIAGNOSIS SUMMARY & DIRECT ACTION CARD */}
            <div className="p-3 rounded-3" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-2 pb-2 border-bottom gap-2">
                <div className="d-flex align-items-center gap-2">
                  <span className={`skyline-pill ${currentDiagnostic.aiDiagnosis.severity === 'Critical' ? 'skyline-pill-red' : currentDiagnostic.aiDiagnosis.severity === 'Warning' ? 'skyline-pill-amber' : 'skyline-pill-green'}`} style={{ fontSize: '0.68rem' }}>
                    {currentDiagnostic.aiDiagnosis.severity.toUpperCase()} DIAGNOSIS
                  </span>
                  <h6 className="fw-bold text-dark mb-0 font-mono-tech" style={{ fontSize: '0.98rem' }}>
                    {currentDiagnostic.aiDiagnosis.failureMode}
                  </h6>
                </div>

                <div className="d-flex align-items-center gap-2 font-mono-tech">
                  <span className="text-muted" style={{ fontSize: '0.74rem' }}>PROJECTED RUL:</span>
                  <strong style={{ fontSize: '0.86rem', color: currentDiagnostic.aiDiagnosis.severity === 'Critical' ? '#D32F1A' : '#0F8205' }}>
                    {currentDiagnostic.aiDiagnosis.rulEstimate}
                  </strong>
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                    (CI: {currentDiagnostic.aiDiagnosis.rulConfidenceRange})
                  </span>
                </div>
              </div>

              {/* Physical Anomaly Mechanism */}
              <div className="p-2.5 rounded-2 bg-light mb-3 font-mono-tech text-dark small" style={{ fontSize: '0.78rem', lineHeight: 1.55 }}>
                <strong className="text-secondary d-block mb-0.5">PHYSICAL ANOMALY MECHANISM:</strong>
                {currentDiagnostic.aiDiagnosis.physicalMechanism}
              </div>

              {/* Action Directive & Linked Job Card Integration */}
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div className="font-mono-tech" style={{ fontSize: '0.78rem' }}>
                  <strong className="text-secondary d-block">TECHNICAL ACTION DIRECTIVE:</strong>
                  <span className="text-dark fw-semibold">{currentDiagnostic.aiDiagnosis.directive}</span>
                  {activeMatchingOrder && (
                    <div className="mt-1 d-flex align-items-center gap-1.5" style={{ fontSize: '0.72rem' }}>
                      <span className="text-muted">Linked Job Card:</span>
                      <strong className="text-primary">{activeMatchingOrder.orderId}</strong>
                      <span className="badge bg-light text-dark border py-0 px-1">{activeMatchingOrder.title}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLaunchDiagnosisInspection}
                  className="skyline-btn-dark py-2 px-3 d-flex align-items-center gap-2"
                  style={{ fontSize: '0.82rem' }}
                >
                  <PlayCircle size={15} />
                  <span>Launch Inspection Portal for {selectedAirframe} →</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
