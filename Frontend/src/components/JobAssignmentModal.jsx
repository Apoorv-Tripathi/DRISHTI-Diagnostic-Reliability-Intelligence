import React, { useState } from 'react';
import { demoUsers } from '../data/initialDataClient.js';
import { UserCheck, Wrench, AlertTriangle, Shield } from 'lucide-react';

export default function JobAssignmentModal({
  isOpen,
  onClose,
  aircraftList = [],
  usersList = [],
  onSubmitAssign
}) {
  if (!isOpen) return null;

  const allUsers = usersList && usersList.length > 0 ? usersList : demoUsers;
  const technicians = allUsers.filter(u => u.role === 'Technician');

  const [formData, setFormData] = useState({
    aircraftId: 'AF-04',
    jobType: 'Engine Health Inspection',
    title: 'Engine Health Inspection',
    assignedTechnician: 'Rahul Sharma',
    assignedTechnicianId: 'tech-1',
    priority: 'High',
    reason: 'Abnormal engine vibration detected (4.62 mm/s at 142.6 Hz) with scavenge oil temperature elevation',
    predictedRul: '~40 flight hours',
    station: 'Ambala AFS - Bay 3',
    subsystem: 'Engine Powerplant',
    componentName: 'High-Pressure Turbine Bearing Assembly',
    sparesRequired: [
      { partNumber: 'ENG-BRG-7440', partName: 'HP Turbine Roller Bearing Assembly Mk II', quantity: 1, status: 'Staged at Bay' }
    ]
  });

  const handleTechnicianChange = (e) => {
    const techName = e.target.value;
    const techObj = technicians.find(t => t.name === techName);
    setFormData(prev => ({
      ...prev,
      assignedTechnician: techName,
      assignedTechnicianId: techObj?.id || 'tech-1'
    }));
  };

  const handleAircraftChange = (e) => {
    const acId = e.target.value;
    const acObj = aircraftList.find(a => a.aircraftId === acId);
    let defaultJob = 'Engine Health Inspection';
    let defaultReason = 'Abnormal engine vibration detected';
    let defaultRul = '~40 flight hours';
    let defaultSubsystem = 'Engine Powerplant';

    if (acId === 'AF-02') {
      defaultJob = 'Hydraulic System Check';
      defaultReason = 'Circuit-B return manifold pressure transient drop';
      defaultRul = '~110 flight hours';
      defaultSubsystem = 'Dual-Circuit Hydraulic System';
    } else if (acId === 'AF-03') {
      defaultJob = 'Fuel System Inspection';
      defaultReason = 'Fuel transfer pump transient pressure drop';
      defaultRul = '~75 flight hours';
      defaultSubsystem = 'Fuel Management & ECS';
    } else if (acId === 'AF-05') {
      defaultJob = 'Avionics Inspection';
      defaultReason = 'Scheduled radar calibration and frequency test';
      defaultRul = '~240 flight hours';
      defaultSubsystem = 'Mission Avionics & Radar Rack';
    }

    setFormData(prev => ({
      ...prev,
      aircraftId: acId,
      jobType: defaultJob,
      title: defaultJob,
      reason: defaultReason,
      predictedRul: defaultRul,
      subsystem: defaultSubsystem
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitAssign(formData);
    onClose();
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          {/* Header */}
          <div className="modal-header p-3 px-4 border-bottom" style={{ background: '#333333', color: '#FFFFFF' }}>
            <div className="d-flex align-items-center gap-2">
              <UserCheck size={20} color="#FFA034" />
              <div>
                <span className="skyline-pill skyline-pill-amber" style={{ fontSize: '0.65rem' }}>
                  ADMIN DISPATCH &amp; DIRECTIVE SYSTEM
                </span>
                <h5 className="modal-title fw-bold text-white mb-0 font-mono-tech mt-1" style={{ fontSize: '1.05rem' }}>
                  Assign Aircraft Maintenance Job to Technician
                </h5>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4" style={{ background: '#F2F2F2' }}>
              <div className="p-3 rounded-3 mb-3 d-flex align-items-center gap-2 font-mono-tech" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', fontSize: '0.78rem' }}>
                <Shield size={16} color="#1DC30A" />
                <span>
                  Admin: <strong className="text-dark">Arjun Mehta (Fleet Administrator)</strong> | Dispatch will immediately route to the technician's dedicated workbench.
                </span>
              </div>

              {/* Row 1: Target Aircraft & Technician */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="text-muted font-mono-tech d-block mb-1" style={{ fontSize: '0.72rem' }}>SELECT TARGET AIRCRAFT</label>
                  <select
                    className="form-select font-mono-tech"
                    value={formData.aircraftId}
                    onChange={handleAircraftChange}
                    required
                    style={{ fontSize: '0.82rem', borderRadius: '12px' }}
                  >
                    {aircraftList.map(a => (
                      <option key={a.aircraftId} value={a.aircraftId}>
                        {a.aircraftId} ({a.callsign}) — Health: {a.overallHealth}% [{a.status}]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="text-muted font-mono-tech d-block mb-1" style={{ fontSize: '0.72rem' }}>ASSIGN TO TECHNICIAN</label>
                  <select
                    className="form-select font-mono-tech"
                    value={formData.assignedTechnician}
                    onChange={handleTechnicianChange}
                    required
                    style={{ fontSize: '0.82rem', borderRadius: '12px' }}
                  >
                    {technicians.map(t => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.title}) — {t.base}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Job Type & Priority */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="text-muted font-mono-tech d-block mb-1" style={{ fontSize: '0.72rem' }}>INSPECTION / JOB TYPE</label>
                  <input
                    type="text"
                    className="form-control font-mono-tech"
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value, title: e.target.value })}
                    required
                    style={{ fontSize: '0.82rem', borderRadius: '12px' }}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="text-muted font-mono-tech d-block mb-1" style={{ fontSize: '0.72rem' }}>PRIORITY LEVEL</label>
                  <select
                    className="form-select font-mono-tech"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={{ fontSize: '0.82rem', borderRadius: '12px' }}
                  >
                    <option value="High">High (Immediate Turnaround)</option>
                    <option value="Medium">Medium (Scheduled Next Check)</option>
                    <option value="Low">Low (Routine Phase Check)</option>
                    <option value="Critical">Critical (AOG Risk)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Diagnostic Reason */}
              <div className="mb-3">
                <label className="text-muted font-mono-tech d-block mb-1" style={{ fontSize: '0.72rem' }}>DIRECTIVE REASON / DIAGNOSTIC ANOMALY</label>
                <textarea
                  className="form-control font-mono-tech"
                  rows="2"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  style={{ fontSize: '0.82rem', borderRadius: '12px' }}
                ></textarea>
              </div>

              {/* Row 4: Predicted RUL & Station */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="text-muted font-mono-tech d-block mb-1" style={{ fontSize: '0.72rem' }}>PREDICTED RUL HORIZON</label>
                  <input
                    type="text"
                    className="form-control font-mono-tech fw-bold"
                    style={{ color: '#FF4F34', fontSize: '0.82rem', borderRadius: '12px' }}
                    value={formData.predictedRul}
                    onChange={(e) => setFormData({ ...formData, predictedRul: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="text-muted font-mono-tech d-block mb-1" style={{ fontSize: '0.72rem' }}>MAINTENANCE BAY / STATION</label>
                  <input
                    type="text"
                    className="form-control font-mono-tech"
                    value={formData.station}
                    onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                    required
                    style={{ fontSize: '0.82rem', borderRadius: '12px' }}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer bg-white border-top p-3 px-4 d-flex justify-content-end gap-2">
              <button type="button" className="skyline-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="skyline-btn-dark px-4">
                <UserCheck size={14} />
                <span>Confirm Job Assignment</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
