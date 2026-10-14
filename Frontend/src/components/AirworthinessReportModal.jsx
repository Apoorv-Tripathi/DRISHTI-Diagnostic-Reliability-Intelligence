import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Wrench,
  Cpu,
  Clock,
  User,
  Zap,
  ArrowRight,
  Check,
  CheckSquare,
  Award,
  AlertOctagon,
  CornerDownRight
} from 'lucide-react';

export default function AirworthinessReportModal({
  order,
  aircraft,
  onClose,
  onValidate
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successDirective, setSuccessDirective] = useState(null);

  if (!order) return null;

  const acId = order.aircraftId || 'AF-04';
  const isMaintenanceRecommended = order.technicianRecommendation !== 'FLIGHT_CLEARED';

  // Handle Admin Passing Order Actions
  const handleApproveMaintenance = async () => {
    setIsSubmitting(true);
    const directiveText = `COMMAND PASSING ORDER: Airframe ${acId} is transferred to Base Heavy Maintenance Wing for depot overhaul and bearing replacement. Rectification mandated prior to subsequent combat flight sorties.`;
    await onValidate(order.orderId, {
      adminDecision: 'approveMaintenance',
      directiveText,
      reviewedBy: 'Arjun Mehta (Fleet Administrator)'
    });
    setIsSubmitting(false);
    setSuccessDirective({
      type: 'maintenance',
      title: 'MAINTENANCE PASSING DIRECTIVE ISSUED',
      message: `The technical request from ${order.assignedTechnician || 'Technician'} has been APPROVED by Base Air Command. Airframe ${acId} has been transferred to the Heavy Maintenance Wing. The issue will be completely rectified prior to next scheduled flight.`
    });
  };

  const handleReleaseFlight = async () => {
    setIsSubmitting(true);
    const directiveText = `COMMAND CLEARANCE ORDER: Airframe ${acId} technical inspection findings validated. Certified airworthy and released to active squadron combat sortie schedule.`;
    await onValidate(order.orderId, {
      adminDecision: 'releaseFlight',
      directiveText,
      reviewedBy: 'Arjun Mehta (Fleet Administrator)'
    });
    setIsSubmitting(false);
    setSuccessDirective({
      type: 'flight',
      title: 'AIRWORTHINESS SORTIE CLEARANCE ISSUED',
      message: `Technical report for airframe ${acId} validated. Aircraft has been certified airworthy and restored to Mission Capable (95% Health) status in the tactical fleet roster.`
    });
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          
          {/* MODAL HEADER */}
          <div className="p-3 px-4 border-bottom d-flex justify-content-between align-items-center" style={{ background: '#333333', color: '#FFFFFF' }}>
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '40px', height: '40px', background: 'rgba(255, 160, 52, 0.2)', color: '#FFA034' }}>
                <FileText size={20} />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <span className="skyline-pill skyline-pill-amber" style={{ fontSize: '0.65rem' }}>
                    INDIAN AIR FORCE TECHNICAL INSPECTION REPORT
                  </span>
                  <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.65rem' }}>
                    ORDER: {order.orderId}
                  </span>
                </div>
                <h5 className="modal-title fw-bold text-white mb-0 font-mono-tech mt-1" style={{ fontSize: '1.2rem' }}>
                  {order.aircraftId} — {order.jobType || order.title}
                </h5>
              </div>
            </div>

            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* MODAL BODY */}
          <div className="modal-body p-4" style={{ background: '#F2F2F2', maxHeight: '80vh', overflowY: 'auto' }}>
            
            {/* SUCCESS DIRECTIVE BANNER */}
            {successDirective ? (
              <div className="skyline-card p-5 text-center bg-white shadow-sm mb-0">
                <div className="p-3 rounded-circle d-inline-flex mb-3" style={{ background: successDirective.type === 'maintenance' ? 'rgba(255, 160, 52, 0.15)' : 'rgba(29, 195, 10, 0.15)', color: successDirective.type === 'maintenance' ? '#FFA034' : '#1DC30A' }}>
                  {successDirective.type === 'maintenance' ? <Wrench size={48} /> : <CheckCircle2 size={48} />}
                </div>
                <h4 className="fw-bold text-dark mb-2 font-mono-tech">{successDirective.title}</h4>
                <p className="text-secondary font-mono-tech small mb-4 mx-auto" style={{ maxWidth: '640px', fontSize: '0.86rem', lineHeight: 1.6 }}>
                  {successDirective.message}
                </p>

                <div className="p-3 rounded-3 mb-4 mx-auto font-mono-tech text-start" style={{ maxWidth: '600px', background: '#F8F9FA', border: '1px solid #E5E7EB', fontSize: '0.78rem' }}>
                  <div className="row g-2">
                    <div className="col-sm-6">TARGET AIRFRAME: <strong className="text-dark">{acId}</strong></div>
                    <div className="col-sm-6">VALIDATED BY: <strong className="text-dark">Arjun Mehta (Admin)</strong></div>
                    <div className="col-sm-6">TIMESTAMP: <strong className="text-dark">{new Date().toUTCString()}</strong></div>
                    <div className="col-sm-6">STATUS: <strong style={{ color: successDirective.type === 'maintenance' ? '#A85B00' : '#0F8205' }}>DIRECTIVE EXECUTED</strong></div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="skyline-btn-dark px-5 py-2"
                  style={{ fontSize: '0.88rem' }}
                >
                  Return to Work Orders Roster
                </button>
              </div>
            ) : (
              <>
                {/* 1. Airframe & Work Directive Metadata Strip */}
                <div className="skyline-card p-3 mb-3 bg-white">
                  <div className="row g-3 font-mono-tech" style={{ fontSize: '0.8rem' }}>
                    <div className="col-6 col-md-3">
                      <span className="text-muted d-block" style={{ fontSize: '0.68rem' }}>AIRFRAME &amp; BASE:</span>
                      <strong className="text-dark fs-6">{acId}</strong>
                      <div className="text-muted small">{aircraft?.type || 'Combat Fighter'} • {aircraft?.base || 'Ambala AFS'}</div>
                    </div>
                    <div className="col-6 col-md-3">
                      <span className="text-muted d-block" style={{ fontSize: '0.68rem' }}>INSPECTING SPECIALIST:</span>
                      <strong className="text-dark">{order.assignedTechnician || 'Rahul Sharma'}</strong>
                      <div className="text-muted small">D.R.I.S.H.T.I. Certified</div>
                    </div>
                    <div className="col-6 col-md-3">
                      <span className="text-muted d-block" style={{ fontSize: '0.68rem' }}>DIRECTIVE PRIORITY:</span>
                      <span className={`skyline-pill ${order.priority === 'High' ? 'skyline-pill-red' : 'skyline-pill-amber'}`} style={{ fontSize: '0.68rem' }}>
                        {order.priority?.toUpperCase()} PRIORITY
                      </span>
                      <div className="text-muted small mt-1">Station: {order.station || 'Bay 3'}</div>
                    </div>
                    <div className="col-6 col-md-3">
                      <span className="text-muted d-block" style={{ fontSize: '0.68rem' }}>REPORT STATUS:</span>
                      <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.68rem' }}>
                        {order.status?.toUpperCase() || 'SUBMITTED'}
                      </span>
                      <div className="text-muted small mt-1">Awaiting Command Validation</div>
                    </div>
                  </div>
                </div>

                {/* 2. Physical Ground Support Equipment (GSE) Bus Ingestion Results */}
                <div className="skyline-card p-3 mb-3 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <Cpu size={16} className="text-dark" />
                      <span className="fw-bold text-dark font-mono-tech" style={{ fontSize: '0.86rem' }}>
                        1. Physical Avionics Bus Telemetry Ingestion (MIL-STD-1553B / ARINC-429)
                      </span>
                    </div>
                    <span className="skyline-pill skyline-pill-green font-mono-tech" style={{ fontSize: '0.68rem' }}>
                      ✓ HARNESS MATED • PARITY 100%
                    </span>
                  </div>

                  <div className="p-3 rounded-3 font-mono-tech mb-2" style={{ background: '#F8F9FA', border: '1px solid #E5E7EB', fontSize: '0.78rem' }}>
                    <div className="row g-2 text-muted">
                      <div className="col-6 col-md-3">
                        VIBRATION SPECTRUM: <strong style={{ color: '#D32F1A' }}>{order.sensorReadings?.vibration || '5.21 mm/s (CRITICAL)'}</strong>
                        <div className="small text-danger">+267% Spike above 1.42 mm/s baseline</div>
                      </div>
                      <div className="col-6 col-md-3">
                        SCAVENGE OIL TEMP: <strong style={{ color: '#A85B00' }}>{order.sensorReadings?.temperature || '118.4°C (WARNING)'}</strong>
                        <div className="small text-warning">+20.4°C thermal drift</div>
                      </div>
                      <div className="col-6 col-md-3">
                        OIL PRESSURE: <strong className="text-dark">{order.sensorReadings?.pressure || '44.2 PSI'}</strong>
                        <div className="small text-muted">Nominal: 48.5 PSI</div>
                      </div>
                      <div className="col-6 col-md-3">
                        HP SPOOL SPEED: <strong className="text-dark">{order.sensorReadings?.rpm || '14,250 RPM'}</strong>
                        <div className="small text-success">Power output rated</div>
                      </div>
                    </div>
                  </div>
                  <div className="font-mono-tech text-secondary" style={{ fontSize: '0.72rem' }}>
                    Solid-State Flight Data Recorder stream decoded: 14,250 frames analyzed with zero frame loss.
                  </div>
                </div>

                {/* 3. Optical Boroscopy & NDT Verification Findings */}
                <div className="skyline-card p-3 mb-3 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <Wrench size={16} className="text-dark" />
                      <span className="fw-bold text-dark font-mono-tech" style={{ fontSize: '0.86rem' }}>
                        2. Optical Boroscopy &amp; NDT Physical Checklist (IAF TO 1F-AF04 Compliance)
                      </span>
                    </div>
                    <span className="skyline-pill skyline-pill-dark font-mono-tech" style={{ fontSize: '0.68rem' }}>
                      4/4 CHECKS VERIFIED
                    </span>
                  </div>

                  <div className="row g-2 mb-3 font-mono-tech" style={{ fontSize: '0.76rem' }}>
                    <div className="col-md-6">
                      <div className="p-2 rounded-2 bg-light border d-flex align-items-center gap-2">
                        <CheckCircle2 size={14} color="#0F8205" />
                        <span>Port B-4 Video Boroscopy: Stage-2 Bearing Cavity Inspected</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-2 rounded-2 bg-light border d-flex align-items-center gap-2">
                        <CheckCircle2 size={14} color="#0F8205" />
                        <span>Magnetic Chip Detector: Ferrous Swarf Flushed &amp; Cleaned</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-2 rounded-2 bg-light border d-flex align-items-center gap-2">
                        <CheckCircle2 size={14} color="#0F8205" />
                        <span>Depot Replacement Part: Bearing Assembly ENG-BRG-7440 Allocated</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-2 rounded-2 bg-light border d-flex align-items-center gap-2">
                        <CheckCircle2 size={14} color="#0F8205" />
                        <span>Retention Flange: Calibrated &amp; Torqued to 142 Nm Specification</span>
                      </div>
                    </div>
                  </div>

                  {/* Written Findings & Action Taken */}
                  <div className="p-3 rounded-3 font-mono-tech mb-2" style={{ background: '#F8F9FA', border: '1px solid #E5E7EB', fontSize: '0.78rem' }}>
                    <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.74rem' }}>TECHNICIAN PHYSICAL FINDINGS:</div>
                    <div className="text-secondary mb-2" style={{ lineHeight: 1.5 }}>
                      {order.findings || 'Video boroscope inspection through inspection port B-4 confirmed stage-2 high-pressure turbine bearing micro-spalling and initial fatigue pitting on the outer race. Magnetic chip detector confirmed ferrous particulate buildup in scavenge line.'}
                    </div>

                    <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.74rem' }}>FIELD ACTION TAKEN &amp; REPAIR LOG:</div>
                    <div className="text-secondary" style={{ lineHeight: 1.5 }}>
                      {order.actionTaken || 'Extracted compromised roller bearing assembly. Installed certified depot OEM bearing assembly (#ENG-BRG-7440) and new ceramic seals. Torqued retention flange to 142 Nm. Executed ground test run; vibration returned to 1.42 mm/s baseline nominal.'}
                    </div>
                  </div>
                </div>

                {/* 4. AI/ML Synthesis & Technician Maintenance Recommendation */}
                <div className="skyline-card p-3 mb-4 bg-white" style={{ borderLeft: isMaintenanceRecommended ? '4px solid #FFA034' : '4px solid #1DC30A' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <AlertTriangle size={16} color={isMaintenanceRecommended ? '#A85B00' : '#0F8205'} />
                      <span className="fw-bold text-dark font-mono-tech" style={{ fontSize: '0.86rem' }}>
                        3. AI Synthesis &amp; Technician Disposition Recommendation
                      </span>
                    </div>
                    <span className="skyline-pill skyline-pill-amber font-mono-tech" style={{ fontSize: '0.68rem' }}>
                      RUL HORIZON: {order.predictedRul || '~38.4h'}
                    </span>
                  </div>

                  <div className="p-3 rounded-3 font-mono-tech mb-3" style={{ background: isMaintenanceRecommended ? '#FFFDF5' : '#F0FDF4', border: isMaintenanceRecommended ? '1px solid #FEEBC8' : '1px solid #DCFCE7', fontSize: '0.78rem' }}>
                    <div className="fw-bold mb-1" style={{ color: isMaintenanceRecommended ? '#A85B00' : '#0F8205', fontSize: '0.74rem' }}>
                      AI/ML PROGNOSIS SYNTHESIS:
                    </div>
                    <div className="text-dark mb-2" style={{ lineHeight: 1.5 }}>
                      {order.aiRecommendation || 'CRITICAL MECHANICAL FATIGUE: High-pressure turbine stage-2 bearing exhibits subsurface micro-spalling with RUL ~38.4 hours. Significant risk of uncontained catastrophic engine seizure during high-G flight sorties.'}
                    </div>

                    <div className="pt-2 border-top d-flex flex-wrap justify-content-between align-items-center">
                      <div>
                        <span className="text-muted small">TECHNICIAN RECOMMENDATION:</span>
                        <div className="fw-bold fs-6 mt-1" style={{ color: isMaintenanceRecommended ? '#D32F1A' : '#0F8205' }}>
                          {isMaintenanceRecommended 
                            ? '🚨 MANDATORY TRANSFER TO BASE HEAVY MAINTENANCE WING' 
                            : '✓ FIELD RECTIFICATION COMPLETED — FLIGHT RELEASE RECOMMENDED'}
                        </div>
                      </div>
                      <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.7rem' }}>
                        By: {order.assignedTechnician}
                      </span>
                    </div>
                  </div>

                  {/* Notes from technician */}
                  <div className="font-mono-tech text-secondary small" style={{ fontSize: '0.74rem' }}>
                    <strong>Specialist Notes:</strong> {order.technicianNotes || 'Propulsion subsystem requires depot bench dynamic balancing and secondary race torquing before release to combat sortie schedule.'}
                  </div>
                </div>

                {/* 5. ADMIN COMMAND ACTIONS (PASSING ORDER) */}
                <div className="p-3 rounded-3 bg-white border shadow-sm">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Shield size={18} className="text-dark" />
                    <span className="fw-bold text-dark font-mono-tech" style={{ fontSize: '0.88rem' }}>
                      Fleet Administrator Passing Directive Authorization
                    </span>
                  </div>
                  <p className="text-muted small font-mono-tech mb-3" style={{ fontSize: '0.76rem' }}>
                    As Fleet Maintenance Administrator (Arjun Mehta), you must validate this technician inspection report and issue the official passing order before the aircraft status is transitioned in base air command.
                  </p>

                  <div className="d-flex flex-wrap justify-content-end align-items-center gap-2">
                    <button
                      type="button"
                      className="skyline-btn-secondary"
                      onClick={onClose}
                      style={{ fontSize: '0.8rem' }}
                    >
                      Close Window
                    </button>

                    {isMaintenanceRecommended ? (
                      <>
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={handleReleaseFlight}
                          className="skyline-btn-secondary"
                          style={{ fontSize: '0.8rem', border: '1px solid #CBD5E1' }}
                          title="Override technician recommendation and clear for sortie"
                        >
                          <span>Command Override: Clear for Flight Sortie</span>
                        </button>

                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={handleApproveMaintenance}
                          className="skyline-btn-dark d-flex align-items-center gap-2 shadow-sm"
                          style={{ fontSize: '0.82rem', padding: '0.5rem 1.25rem' }}
                        >
                          {isSubmitting ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            <Wrench size={15} color="#FFA034" />
                          )}
                          <span>Approve &amp; Issue Order: Send Aircraft to Maintenance Wing</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleReleaseFlight}
                        className="skyline-btn-dark d-flex align-items-center gap-2 shadow-sm"
                        style={{ fontSize: '0.82rem', padding: '0.5rem 1.25rem' }}
                      >
                        {isSubmitting ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          <CheckCircle2 size={15} color="#1DC30A" />
                        )}
                        <span>Validate Report &amp; Release to Active Flight Ops</span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
