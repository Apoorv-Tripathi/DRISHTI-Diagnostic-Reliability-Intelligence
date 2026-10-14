import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Activity,
  PlayCircle,
  FileCheck,
  User,
  ExternalLink,
  ChevronRight,
  Cpu,
  Radio,
  Zap,
  CheckSquare
} from 'lucide-react';

export default function TechnicianDashboard({
  currentUser,
  workOrders = [],
  aircraftList = [],
  onStartInspection,
  onOpenAircraftDetail,
  onNavigate
}) {
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [filterTab, setFilterTab] = useState('ALL');

  // Filter jobs assigned to this technician
  const myJobs = workOrders.filter(w =>
    w.assignedTechnician?.toLowerCase().includes(currentUser.name?.toLowerCase()) ||
    w.assignedTechnicianId === currentUser.id
  );

  const pendingJobs = myJobs.filter(j => j.status === 'Assigned');
  const inProgressJobs = myJobs.filter(j => j.status === 'In Progress');
  const completedJobs = myJobs.filter(j => j.status === 'Completed');

  const displayedJobs = myJobs.filter(j => {
    if (filterTab === 'ALL') return true;
    return j.status === filterTab;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
      case 'Critical':
        return 'skyline-pill-red';
      case 'Medium':
        return 'skyline-pill-amber';
      default:
        return 'skyline-pill-dark';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'skyline-pill-green';
      case 'Pending Command Validation':
        return 'skyline-pill-amber';
      case 'Maintenance Directive Issued':
        return 'skyline-pill-dark';
      case 'In Progress':
        return 'skyline-pill-amber';
      default:
        return 'skyline-pill-red';
    }
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-3" style={{ maxWidth: '1440px' }}>
      
      {/* 1. Top Welcome & Mission Readiness Banner */}
      <div className="skyline-card p-4 mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.68rem', padding: '0.2rem 0.65rem' }}>
                TECHNICIAN WORKBENCH
              </span>
              <span className="skyline-pill skyline-pill-amber" style={{ fontSize: '0.68rem' }}>
                BASE: {currentUser.base || 'Ambala AFS'}
              </span>
              <span className="skyline-pill skyline-pill-green font-mono-tech" style={{ fontSize: '0.68rem' }}>
                LIVE GSE TELEMETRY TETHER ACTIVE
              </span>
            </div>
            <h3 className="fw-bold text-dark mb-0 font-mono-tech" style={{ letterSpacing: '-0.02em', fontSize: '1.5rem' }}>
              Welcome, {currentUser.name}
            </h3>
            <div className="text-muted font-mono-tech small mt-1" style={{ fontSize: '0.78rem' }}>
              {currentUser.title} • {currentUser.squadron || 'Maintenance Wing'} • D.R.I.S.H.T.I. Certified • Airframe Specialist
            </div>
          </div>

          {/* Quick Workload Summary Strip */}
          <div className="d-flex gap-2 text-center font-mono-tech">
            <div className="p-3 rounded-3" style={{ minWidth: '110px', background: '#F8F9FA', border: '1px solid #E5E7EB' }}>
              <span className="text-muted d-block mb-1" style={{ fontSize: '0.68rem' }}>PENDING</span>
              <span className="fs-3 fw-bold mb-0 text-dark">{pendingJobs.length}</span>
              <span className="d-block font-mono-tech" style={{ fontSize: '0.65rem', color: '#D32F1A' }}>● Action Req.</span>
            </div>
            <div className="p-3 rounded-3" style={{ minWidth: '110px', background: '#F8F9FA', border: '1px solid #E5E7EB' }}>
              <span className="text-muted d-block mb-1" style={{ fontSize: '0.68rem' }}>IN PROGRESS</span>
              <span className="fs-3 fw-bold mb-0 text-dark">{inProgressJobs.length}</span>
              <span className="d-block font-mono-tech" style={{ fontSize: '0.65rem', color: '#A85B00' }}>● Active Bay</span>
            </div>
            <div className="p-3 rounded-3" style={{ minWidth: '110px', background: '#F8F9FA', border: '1px solid #E5E7EB' }}>
              <span className="text-muted d-block mb-1" style={{ fontSize: '0.68rem' }}>COMPLETED</span>
              <span className="fs-3 fw-bold mb-0 text-dark">{completedJobs.length}</span>
              <span className="d-block font-mono-tech" style={{ fontSize: '0.65rem', color: '#0F8205' }}>● Released</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ASSIGNED WORK ORDERS & INSPECTIONS QUEUE (MAIN FOCUS) */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
          <span className="text-muted font-mono-tech" style={{ fontSize: '0.72rem' }}>ASSIGNED AIRFRAMES &amp; DIRECTIVES</span>
          <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.25rem' }}>Active Work Orders &amp; Job Directives</h4>
        </div>

        {/* Tab Filters */}
        <div className="d-flex gap-1 p-1 bg-white rounded-pill border" style={{ borderColor: '#E2E8F0' }}>
          {['ALL', 'Assigned', 'In Progress', 'Completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={filterTab === tab ? 'skyline-pill-tab active' : 'skyline-pill-tab'}
              style={{ fontSize: '0.74rem', padding: '0.35rem 0.9rem' }}
            >
              {tab.toUpperCase()} ({tab === 'ALL' ? myJobs.length : myJobs.filter(j => j.status === tab).length})
            </button>
          ))}
        </div>
      </div>

      {/* Assigned Jobs Grid */}
      {displayedJobs.length > 0 ? (
        <div className="row g-3">
          {displayedJobs.map(job => {
            const targetAircraft = aircraftList.find(a => a.aircraftId === job.aircraftId);

            return (
              <div key={job.orderId} className="col-12 col-lg-6">
                <div 
                  className="skyline-card p-4 h-100 d-flex flex-column justify-content-between cursor-pointer"
                  onClick={() => setSelectedJobForModal(job)}
                  style={{ transition: 'all 0.2s ease', border: '1px solid #E5E8EC' }}
                >
                  <div>
                    {/* Header Strip */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.68rem' }}>
                          {job.orderId}
                        </span>
                        <span className={`skyline-pill ${getStatusBadge(job.status)}`} style={{ fontSize: '0.68rem' }}>
                          {job.status.toUpperCase()}
                        </span>
                        <span className={`skyline-pill ${getPriorityBadge(job.priority)}`} style={{ fontSize: '0.68rem' }}>
                          {job.priority.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-muted font-mono-tech small" style={{ fontSize: '0.72rem' }}>
                        Station: {job.station || 'Bay 3'}
                      </span>
                    </div>

                    {/* Job Title & Aircraft */}
                    <h5 className="fw-bold text-dark mb-1 font-mono-tech" style={{ fontSize: '1.05rem' }}>
                      {job.aircraftId} — {job.jobType || job.title}
                    </h5>
                    <div className="text-secondary font-mono-tech small mb-3" style={{ fontSize: '0.78rem' }}>
                      Airframe: <strong className="text-dark">{job.aircraftId}</strong> ({targetAircraft?.type || job.aircraftType}) • Health Score: <strong style={{ color: (targetAircraft?.overallHealth || 74) < 75 ? '#D32F1A' : '#0F8205' }}>{targetAircraft?.overallHealth || 74}%</strong>
                    </div>

                    {/* Trigger Reason & Anomaly */}
                    <div className="p-3 rounded-3 mb-3 font-mono-tech" style={{ background: '#F8F9FA', border: '1px solid #E5E7EB', fontSize: '0.78rem' }}>
                      <div className="fw-bold mb-1" style={{ color: '#D32F1A', fontSize: '0.72rem' }}>TRIGGER REASON &amp; DIRECTIVE:</div>
                      <div className="text-dark">
                        {job.reason || 'Abnormal sensor drift detected during flight telemetry analysis.'}
                      </div>

                      {job.predictedRul && (
                        <div className="mt-2 pt-2 border-top d-flex justify-content-between text-muted" style={{ fontSize: '0.72rem' }}>
                          <span>PROJECTED RUL HORIZON:</span>
                          <span className="fw-bold" style={{ color: '#D32F1A' }}>{job.predictedRul}</span>
                        </div>
                      )}
                    </div>

                    {/* Sensor Readings Preview */}
                    {job.sensorReadings && (
                      <div className="mb-3 p-2 rounded-3 bg-white font-mono-tech" style={{ border: '1px solid #E5E7EB', fontSize: '0.72rem' }}>
                        <div className="text-muted fw-bold mb-1" style={{ fontSize: '0.68rem' }}>TELEMETRY ANOMALY READOUTS:</div>
                        <div className="row g-1 text-muted">
                          <div className="col-6">Vibration: <strong style={{ color: '#D32F1A' }}>{job.sensorReadings.vibration}</strong></div>
                          <div className="col-6">Temp: <strong style={{ color: '#A85B00' }}>{job.sensorReadings.temperature}</strong></div>
                          <div className="col-6">Pressure: <strong className="text-dark">{job.sensorReadings.pressure}</strong></div>
                          <div className="col-6">RPM: <strong className="text-dark">{job.sensorReadings.rpm}</strong></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-top d-flex justify-content-between align-items-center" onClick={(e) => e.stopPropagation()}>
                    <span className="text-muted font-mono-tech" style={{ fontSize: '0.72rem' }}>
                      Assigned by: {job.assignedBy || 'Air Command'}
                    </span>

                    <div className="d-flex gap-2">
                      <button
                        onClick={() => setSelectedJobForModal(job)}
                        className="skyline-btn-secondary"
                        style={{ fontSize: '0.76rem', padding: '0.4rem 0.85rem' }}
                      >
                        <ExternalLink size={12} />
                        <span>Job Specs</span>
                      </button>

                      {job.status === 'Pending Command Validation' ? (
                        <span className="skyline-pill skyline-pill-amber d-flex align-items-center gap-1" style={{ fontSize: '0.74rem' }}>
                          <Clock size={13} />
                          <span>REPORT AWAITING COMMAND ORDER</span>
                        </span>
                      ) : job.status === 'Maintenance Directive Issued' ? (
                        <span className="skyline-pill skyline-pill-dark d-flex align-items-center gap-1" style={{ fontSize: '0.74rem', color: '#FFA034' }}>
                          <Wrench size={13} color="#FFA034" />
                          <span>MAINTENANCE DIRECTIVE ISSUED</span>
                        </span>
                      ) : job.status === 'Completed' ? (
                        <span className="skyline-pill skyline-pill-green d-flex align-items-center gap-1" style={{ fontSize: '0.74rem' }}>
                          <CheckCircle2 size={13} />
                          <span>RELEASE SIGNED OFF</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onStartInspection(job)}
                          className="skyline-btn-dark d-flex align-items-center gap-1.5 shadow-sm"
                          style={{ fontSize: '0.78rem', padding: '0.45rem 1rem' }}
                        >
                          <Zap size={13} color="#10B981" />
                          <span>Connect Bus &amp; Start Inspection →</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="skyline-card p-5 text-center bg-white">
          <div className="p-3 rounded-circle d-inline-flex mb-3 text-muted" style={{ background: '#F8F9FA' }}>
            <CheckCircle2 size={36} color="#0F8205" />
          </div>
          <h5 className="fw-bold text-dark font-mono-tech">No Work Directives in Selected Filter</h5>
          <p className="text-muted small">You currently have no tasks matching this status.</p>
        </div>
      )}

      {/* "Open Job Specs" Modal */}
      {selectedJobForModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="modal-header p-3 px-4 border-bottom" style={{ background: '#333333', color: '#FFFFFF' }}>
                <div>
                  <span className="skyline-pill skyline-pill-amber" style={{ fontSize: '0.65rem' }}>JOB &amp; AIRFRAME DIRECTIVE</span>
                  <h5 className="modal-title fw-bold text-white mb-0 font-mono-tech mt-1" style={{ fontSize: '1.1rem' }}>
                    {selectedJobForModal.aircraftId} — {selectedJobForModal.jobType || selectedJobForModal.title}
                  </h5>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedJobForModal(null)}></button>
              </div>

              <div className="modal-body p-4" style={{ background: '#F2F2F2' }}>
                <div className="skyline-card p-3 mb-3">
                  <div className="row g-2 font-mono-tech" style={{ fontSize: '0.8rem' }}>
                    <div className="col-sm-6">
                      <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>AIRFRAME TAIL NUMBER:</span>
                      <strong className="d-block text-dark fs-6">{selectedJobForModal.aircraftId}</strong>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>ESTIMATED RUL:</span>
                      <strong className="d-block fs-6" style={{ color: '#D32F1A' }}>{selectedJobForModal.predictedRul || '~40 flight hours'}</strong>
                    </div>
                  </div>
                </div>

                <div className="skyline-card p-3 mb-3">
                  <span className="fw-bold mb-1 d-block" style={{ color: '#D32F1A', fontSize: '0.72rem' }}>TECHNICAL REASON &amp; DIAGNOSTIC DIRECTIVE:</span>
                  <div className="font-mono-tech text-dark small" style={{ lineHeight: 1.6 }}>
                    {selectedJobForModal.reason || 'Abnormal sensor vibration detected.'}
                  </div>
                </div>

                {selectedJobForModal.sparesRequired && selectedJobForModal.sparesRequired.length > 0 && (
                  <div className="skyline-card p-3 mb-3">
                    <span className="fw-bold text-dark mb-1 d-block" style={{ fontSize: '0.75rem' }}>REQUISITIONED REPLACEMENT SPARES:</span>
                    <ul className="list-unstyled mb-0 font-mono-tech small">
                      {selectedJobForModal.sparesRequired.map((sp, idx) => (
                        <li key={idx} className="text-secondary py-1 border-bottom d-flex justify-content-between">
                          <span><strong>{sp.partNumber}</strong> — {sp.partName} (Qty: {sp.quantity})</span>
                          <span className="skyline-pill skyline-pill-amber" style={{ fontSize: '0.65rem' }}>{sp.status}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="skyline-btn-secondary"
                    onClick={() => setSelectedJobForModal(null)}
                  >
                    Close
                  </button>

                  {selectedJobForModal.status !== 'Completed' && (
                    <button
                      type="button"
                      onClick={() => {
                        const jobToStart = selectedJobForModal;
                        setSelectedJobForModal(null);
                        onStartInspection(jobToStart);
                      }}
                      className="skyline-btn-dark px-4 d-flex align-items-center gap-2 shadow-sm"
                    >
                      <Zap size={14} color="#10B981" />
                      <span>Connect Bus &amp; Start Guided Inspection →</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
