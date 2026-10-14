import React, { useState } from 'react';
import { ArrowRight, Activity, Shield, Cpu, RefreshCw, Layers, CheckCircle2, AlertOctagon, Plane, ArrowUpRight, BarChart2, Radio, Wrench, Clock, Database } from 'lucide-react';

export default function LandingPage({ onNavigate, aircraftList = [], alerts = [] }) {
  const [schematicView, setSchematicView] = useState('exterior');
  const criticalAlert = alerts.find(a => a.severity === 'Critical');
  const activeAlertsCount = alerts.filter(a => a.status === 'Active').length;

  return (
    <div className="pb-5" style={{ background: '#F2F2F2' }}>
      
      {/* 1. Live Telemetry Status Bar */}
      <section className="border-bottom" style={{ background: '#FFFFFF', borderColor: '#E5E8EC' }}>
        <div className="container py-2" style={{ maxWidth: '1280px' }}>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.65rem' }}>
                SIH 2026 • PS 26249
              </span>
              <span className="font-mono-tech text-secondary" style={{ fontSize: '0.74rem' }}>
                MINISTRY OF DEFENCE (MoD) • DEFENCE SERVICES STAFF COLLEGE
              </span>
            </div>

            <div className="d-flex align-items-center gap-4 font-mono-tech" style={{ fontSize: '0.74rem' }}>
              <div className="d-flex align-items-center gap-2">
                <span className="badge rounded-circle p-1 pulse-live" style={{ backgroundColor: '#1DC30A', width: '8px', height: '8px', display: 'inline-block' }}></span>
                <span className="text-muted">TELEMETRY BUS:</span>
                <strong className="text-dark">20Hz SYNC</strong>
              </div>
              <div className="d-none d-md-flex align-items-center gap-2">
                <span className="text-muted">ACTIVE ANOMALIES:</span>
                <strong style={{ color: activeAlertsCount > 0 ? '#FF4F34' : '#1DC30A' }}>
                  {activeAlertsCount} FLAGGED
                </strong>
              </div>
              <div className="d-none d-lg-flex align-items-center gap-2">
                <span className="text-muted">AIRBASE NETWORK:</span>
                <strong className="text-dark">AMBALA • SULUR • GWALIOR • PUNE</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hero Section with Aviation Engineering Aesthetic */}
      <section className="py-5 px-3">
        <div className="container py-2" style={{ maxWidth: '1280px' }}>
          <div className="row align-items-center g-4">
            
            {/* Left Hero Column */}
            <div className="col-lg-7">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.72rem' }}>
                  PROJECT D.R.I.S.H.T.I.
                </span>
                <span className="skyline-pill skyline-pill-green" style={{ fontSize: '0.72rem' }}>
                  FLEET READINESS SUITE
                </span>
              </div>

              <h1 className="fw-bold text-dark mb-3" style={{ letterSpacing: '-0.03em', lineHeight: 1.15, fontSize: '2.65rem' }}>
                Diagnostic &amp; Reliability Intelligence. <br />
                <span className="text-dark">Keep the Combat Fleet Ready.</span>
              </h1>

              <div className="font-mono-tech text-secondary mb-3 fw-semibold" style={{ fontSize: '0.88rem', letterSpacing: '0.01em' }}>
                Diagnostic &amp; Reliability Intelligence with Sensor Health Tracking &amp; Inspection
              </div>

              <p className="text-secondary mb-4" style={{ fontSize: '0.98rem', maxWidth: '620px', lineHeight: 1.65 }}>
                A qualified aeronautical engineering decision-support platform uniting fragmented 
                avionics telemetry, vibration acoustics, physical digital twins, and depot spares logistics 
                to transform reactive grounding into predictive operational availability.
              </p>

              {/* Real Operational Metrics Cards */}
              <div className="row g-2 mb-4" style={{ maxWidth: '640px' }}>
                <div className="col-4">
                  <div className="p-3 bg-white rounded-3 border" style={{ borderColor: '#E5E8EC' }}>
                    <div className="text-muted font-mono-tech mb-1" style={{ fontSize: '0.68rem' }}>READINESS RATE</div>
                    <div className="fs-4 fw-bold font-mono-tech text-dark">82.4%</div>
                    <div className="font-mono-tech fw-semibold" style={{ fontSize: '0.68rem', color: '#0F8205' }}>● +6.8% Target Gain</div>
                  </div>
                </div>

                <div className="col-4">
                  <div className="p-3 bg-white rounded-3 border" style={{ borderColor: '#E5E8EC' }}>
                    <div className="text-muted font-mono-tech mb-1" style={{ fontSize: '0.68rem' }}>AOG TIME SAVED</div>
                    <div className="fs-4 fw-bold font-mono-tech text-dark">142.5h</div>
                    <div className="font-mono-tech text-muted" style={{ fontSize: '0.68rem' }}>Last 90 Days</div>
                  </div>
                </div>

                <div className="col-4">
                  <div className="p-3 bg-white rounded-3 border" style={{ borderColor: '#E5E8EC' }}>
                    <div className="text-muted font-mono-tech mb-1" style={{ fontSize: '0.68rem' }}>DECISION ACCURACY</div>
                    <div className="fs-4 fw-bold font-mono-tech text-dark">94.2%</div>
                    <div className="font-mono-tech fw-semibold" style={{ fontSize: '0.68rem', color: '#0F8205' }}>● Physical Boroscopy</div>
                  </div>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="d-flex flex-wrap gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="skyline-btn-dark px-4 py-2"
                  style={{ fontSize: '0.88rem' }}
                >
                  <Shield size={16} />
                  <span>Login / Select Persona</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={() => onNavigate('fleet')}
                  className="skyline-btn-secondary px-4 py-2"
                  style={{ fontSize: '0.88rem' }}
                >
                  <span>Open Tactical Fleet</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

            {/* Right Hero Column: Tactical Blueprint Schematic */}
            <div className="col-lg-5 text-center">
              <div className="skyline-card p-4 shadow-sm" style={{ background: '#FFFFFF' }}>
                <div className="d-flex justify-content-between align-items-center mb-3 font-mono-tech" style={{ fontSize: '0.7rem' }}>
                  <span className="text-muted">SCHEMATIC: COMBAT AIRFRAME TWIN</span>
                  <div className="d-flex align-items-center gap-1 p-0.5 bg-light rounded-pill border" style={{ borderColor: '#E5E8EC' }}>
                    <button
                      onClick={() => setSchematicView('exterior')}
                      className={`border-0 rounded-pill px-2 py-0.5 font-mono-tech ${schematicView === 'exterior' ? 'bg-dark text-white fw-bold' : 'text-muted'}`}
                      style={{ fontSize: '0.65rem' }}
                    >
                      3D Shell
                    </button>
                    <button
                      onClick={() => setSchematicView('cutaway')}
                      className={`border-0 rounded-pill px-2 py-0.5 font-mono-tech ${schematicView === 'cutaway' ? 'bg-dark text-white fw-bold' : 'text-muted'}`}
                      style={{ fontSize: '0.65rem' }}
                    >
                      Cutaway Organs
                    </button>
                  </div>
                </div>

                {/* High-Resolution Clean 3D CAD Combat Aircraft Model (100% Unobstructed View) */}
                <div className="p-2 position-relative rounded-3 overflow-hidden d-flex align-items-center justify-content-center" style={{ background: '#FBFBFC', border: '1px solid #E5E8EC', minHeight: '190px' }}>
                  <img 
                    src={schematicView === 'cutaway' ? '/images/cad/cad-aircraft-cutaway-hd.png' : '/images/cad/cad-aircraft-exterior-hd.png'} 
                    alt="AF-04 3D CAD Aircraft" 
                    className="img-fluid"
                    style={{ maxHeight: '175px', objectFit: 'contain' }}
                  />

                  {/* Clean 360° Rotation Indicator Pill at Bottom */}
                  <div 
                    className="position-absolute d-flex align-items-center gap-2 bg-white rounded-pill px-2 py-0 shadow-sm border font-mono-tech"
                    style={{ bottom: '8px', left: '50%', transform: 'translateX(-50%)', borderColor: '#E5E8EC', fontSize: '0.66rem', color: '#333333' }}
                  >
                    <span className="text-muted fw-bold">360°</span>
                    <span style={{ fontSize: '0.75rem', color: '#828894' }}>‹ ›</span>
                    <span className="text-secondary" style={{ fontSize: '0.62rem' }}>
                      {schematicView === 'cutaway' ? 'INTERNAL CAD ORGANS' : '3D AIRFRAME TWIN'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-top font-mono-tech d-flex flex-wrap justify-content-between align-items-center text-muted gap-2" style={{ fontSize: '0.72rem' }}>
                  <div>
                    <span>AIRFRAME: </span>
                    <strong className="text-dark">AF-04 (Vajra-04)</strong>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted">SUBSYSTEM:</span>
                    <span className="skyline-pill skyline-pill-red" style={{ fontSize: '0.65rem' }}>
                      E-01 DRIFT [68%]
                    </span>
                    <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.65rem' }}>
                      RUL: ~40h
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Operational Mandates & Decision Support Foundation */}
      <section className="container mt-4" style={{ maxWidth: '1280px' }}>
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <div className="skyline-card h-100 p-4">
              <div className="d-flex align-items-center gap-2 mb-2 text-dark">
                <AlertOctagon size={20} color="#FF4F34" />
                <h6 className="fw-bold mb-0">The Current Challenge</h6>
              </div>
              <p className="text-secondary small mb-0" style={{ lineHeight: 1.6, fontSize: '0.84rem' }}>
                Combat aircraft availability is impaired by fragmented, reactive maintenance protocols. 
                Health-monitoring streams, flight logs, and depot spares systems operate in isolation, 
                leading to late fault discovery and avoidable grounding.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="skyline-card h-100 p-4">
              <div className="d-flex align-items-center gap-2 mb-2 text-dark">
                <Cpu size={20} color="#FFA034" />
                <h6 className="fw-bold mb-0">Predictive Intelligence</h6>
              </div>
              <p className="text-secondary small mb-0" style={{ lineHeight: 1.6, fontSize: '0.84rem' }}>
                Machine learning-driven Remaining Useful Life (RUL) estimation, IoT health monitoring, 
                physics-informed digital twins, and integrated depot logistics synthesize real-time sensor streams into 
                actionable maintenance schedules.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="skyline-card h-100 p-4">
              <div className="d-flex align-items-center gap-2 mb-2 text-dark">
                <Shield size={20} color="#1DC30A" />
                <h6 className="fw-bold mb-0">Decision Support System</h6>
              </div>
              <p className="text-secondary small mb-0" style={{ lineHeight: 1.6, fontSize: '0.84rem' }}>
                Engineered exclusively as a qualified decision-support system. Presents explainable 
                failure physics, sensor harmonic shifts, and confidence intervals—never unexplained 
                "black-box" predictions.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Interactive Maintenance Decision Flow (5-Step Interactive Pipeline) */}
        <div className="skyline-card mt-4 p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <div>
              <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.65rem' }}>PROTOTYPE INTERACTION PIPELINE</span>
              <h5 className="fw-bold mb-0 text-dark mt-1" style={{ fontSize: '1.15rem' }}>Interactive Maintenance Decision Flow</h5>
            </div>
            <span className="skyline-pill skyline-pill-green" style={{ fontSize: '0.7rem' }}>5-STEP VALIDATED WORKFLOW</span>
          </div>

          <div className="row g-2 text-center">
            {[
              { step: '01', title: 'Role Gateway', desc: '1-click login for Fleet Admin & Specialized Technicians.', page: 'login', tag: 'SECURITY' },
              { step: '02', title: 'Fleet Overview', desc: 'Inspect fleet availability, readiness distribution, and airbases.', page: 'fleet', tag: 'DASHBOARD' },
              { step: '03', title: 'Digital Twin', desc: 'Select AF-04 / AF-02 and inspect subsystem telemetry.', page: 'aircraft', tag: 'SUBSYSTEMS' },
              { step: '04', title: 'Sensor Telemetry', desc: 'Analyse harmonic vibration drift, RUL, and confidence.', page: 'aircraft', tag: 'ANOMALIES' },
              { step: '05', title: 'Inspection Portal', desc: 'Technician boroscopic checks, sensor analysis & sign-off.', page: 'technician-dashboard', tag: 'WORK ORDERS' }
            ].map((s, idx) => (
              <div key={idx} className="col-12 col-md">
                <div 
                  className="p-3 rounded-3 h-100 d-flex flex-column justify-content-between transition-all"
                  style={{ cursor: 'pointer', background: '#F8F9FA', border: '1px solid #E5E7EB' }}
                  onClick={() => onNavigate(s.page)}
                >
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold font-mono-tech" style={{ color: '#333333', fontSize: '0.9rem' }}>{s.step}</span>
                      <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.58rem', padding: '0.1rem 0.4rem' }}>{s.tag}</span>
                    </div>
                    <div className="fw-bold small mb-1 text-dark text-start">{s.title}</div>
                    <div className="text-secondary font-mono-tech text-start" style={{ fontSize: '0.72rem', lineHeight: 1.4 }}>{s.desc}</div>
                  </div>
                  <button className="skyline-btn-secondary mt-3 w-100 py-1" style={{ fontSize: '0.74rem' }}>
                    Open View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
