import React, { useState } from 'react';

export default function WorkOrderModal({
  isOpen,
  onClose,
  initialAlert = null,
  initialAircraftId = 'AF-04',
  existingOrder = null,
  onSubmitCreate,
  onSubmitComplete,
  onSubmitOrder
}) {
  if (!isOpen) return null;

  const isCompleting = Boolean(existingOrder);

  // Form states for creation
  const [formData, setFormData] = useState({
    title: initialAlert ? `Rectification: ${initialAlert.componentName}` : 'Scheduled Maintenance Inspection',
    aircraftId: initialAlert ? initialAlert.aircraftId : initialAircraftId,
    alertId: initialAlert ? initialAlert.alertId : '',
    priority: initialAlert ? initialAlert.severity : 'Medium',
    assignedEngineer: 'Flight Lt. R. Sharma (Chief Maintenance Officer)',
    station: 'Ambala AFS - Bay 3',
    technicianNotes: initialAlert ? initialAlert.actionRecommendation : 'Routine maintenance phase check.'
  });

  // Form states for completion
  const [outcomeData, setOutcomeData] = useState({
    findings: existingOrder?.findings || 'Boroscope confirmed micro-spalling on stage-2 bearing inner race. Part replaced.',
    actionTaken: existingOrder?.actionTaken || 'Removed defective bearing assembly. Installed new part #ENG-BRG-7440. Run-up vibration tested nominal (1.4 mm/s).',
    technicianNotes: 'Aircraft inspected, certified airworthy, and released to active squadron flight schedule.'
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (onSubmitCreate) onSubmitCreate(formData);
    else if (onSubmitOrder) onSubmitOrder(formData);
    onClose();
  };

  const handleCompleteSubmit = (e) => {
    e.preventDefault();
    if (onSubmitComplete) onSubmitComplete(existingOrder.orderId, outcomeData);
    else if (onSubmitOrder) onSubmitOrder(outcomeData);
    onClose();
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          {/* Modal Header */}
          <div className="modal-header p-3 px-4 border-bottom" style={{ background: '#333333', color: '#FFFFFF' }}>
            <div>
              <div className="skyline-pill skyline-pill-amber" style={{ fontSize: '0.65rem' }}>
                {isCompleting ? 'MAINTENANCE WORK ORDER COMPLETION & CERTIFICATION' : 'NEW MAINTENANCE WORK ORDER REQUISITION'}
              </div>
              <h5 className="modal-title fw-bold text-white mb-0 font-mono-tech mt-1" style={{ fontSize: '1.05rem' }}>
                {isCompleting ? `Close Order ${existingOrder.orderId} [${existingOrder.aircraftId}]` : `Issue Technical Work Order [${formData.aircraftId}]`}
              </h5>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4" style={{ background: '#F2F2F2' }}>
            {isCompleting ? (
              <form onSubmit={handleCompleteSubmit}>
                <div className="skyline-card p-3 mb-3">
                  <div className="row g-2 font-mono-tech" style={{ fontSize: '0.82rem' }}>
                    <div className="col-sm-6">
                      <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>WORK ORDER ID:</span> <strong className="text-dark">{existingOrder.orderId}</strong>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>AIRCRAFT:</span> <strong className="text-dark">{existingOrder.aircraftId}</strong>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>TYPE:</span> <strong className="text-dark">{existingOrder.type || existingOrder.jobType}</strong>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>ASSIGNED:</span> <strong className="text-dark">{existingOrder.assignedEngineer || existingOrder.assignedTechnician}</strong>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-muted font-mono-tech d-block mb-1" style={{ fontSize: '0.72rem' }}>PHYSICAL INSPECTION FINDINGS</label>
                  <textarea
                    className="form-control font-mono-tech"
                    rows="3"
                    value={outcomeData.findings}
                    onChange={(e) => setOutcomeData({ ...outcomeData, findings: e.target.value })}
                    required
                    style={{ fontSize: '0.82rem', borderRadius: '12px' }}
                  ></textarea>
                  <small className="text-muted font-mono-tech mt-1 d-block" style={{ fontSize: '0.7rem' }}>Record physical measurement deviations, crack or chip presence.</small>
                </div>

                <div className="mb-3">
                  <label className="text-muted font-mono-tech d-block mb-1" style={{ fontSize: '0.72rem' }}>ENGINEERING ACTION TAKEN &amp; SPARES REPLACED</label>
                  <textarea
                    className="form-control font-mono-tech"
                    rows="3"
                    value={outcomeData.actionTaken}
                    onChange={(e) => setOutcomeData({ ...outcomeData, actionTaken: e.target.value })}
                    required
                    style={{ fontSize: '0.82rem', borderRadius: '12px' }}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="text-muted font-mono-tech d-block mb-1" style={{ fontSize: '0.72rem' }}>RELEASE CERTIFICATION &amp; NOTES</label>
                  <input
                    type="text"
                    className="form-control font-mono-tech"
                    value={outcomeData.technicianNotes}
                    onChange={(e) => setOutcomeData({ ...outcomeData, technicianNotes: e.target.value })}
                    style={{ fontSize: '0.82rem', borderRadius: '12px' }}
                  />
                </div>

                <div className="p-3 rounded-3 mb-0 font-mono-tech" style={{ background: '#FFFFFF', border: '1px solid #1DC30A', fontSize: '0.78rem' }}>
                  <span className="fw-bold text-dark">Release Protocol:</span> Completing this order will certify {existingOrder.aircraftId} as Mission Capable and resolve linked predictive alerts.
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" className="skyline-btn-secondary" onClick={onClose}>Cancel</button>
                  <button type="submit" className="skyline-btn-dark px-4" style={{ background: '#1DC30A', color: '#FFFFFF', border: 'none' }}>
                    Sign-Off &amp; Restore Aircraft
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateSubmit}>
                {initialAlert && (
                  <div className="p-2 px-3 rounded-3 mb-3 d-flex align-items-center gap-2 font-mono-tech" style={{ background: '#FFFFFF', border: '1px solid #FFA034', fontSize: '0.78rem' }}>
                    <strong className="text-dark">Linked Alert:</strong> {initialAlert.alertId} — {initialAlert.anomalyDescription.slice(0, 80)}...
                  </div>
                )}

                <div className="mb-3">
                  <label className="text-muted font-mono-tech d-block mb-1" style={{ fontSize: '0.72rem' }}>WORK ORDER TITLE</label>
                  <input
                    type="text"
                    className="form-control font-mono-tech fw-semibold"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    style={{ fontSize: '0.85rem', borderRadius: '12px' }}
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="text-muted font-mono-tech d-block mb-1" style={{ fontSize: '0.72rem' }}>AIRCRAFT TAIL NUMBER</label>
                    <input
                      type="text"
                      className="form-control font-mono-tech"
                      value={formData.aircraftId}
                      readOnly
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
                      <option value="Critical">Critical (Immediate AOG Prevention)</option>
                      <option value="High">High (Requires Turnaround &lt; 24h)</option>
                      <option value="Medium">Medium (Scheduled Next Check)</option>
                      <option value="Routine">Routine Inspection</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="text-muted font-mono-tech d-block mb-1" style={{ fontSize: '0.72rem' }}>ASSIGNED ENGINEERING OFFICER</label>
                    <input
                      type="text"
                      className="form-control font-mono-tech"
                      value={formData.assignedEngineer}
                      onChange={(e) => setFormData({ ...formData, assignedEngineer: e.target.value })}
                      required
                      style={{ fontSize: '0.82rem', borderRadius: '12px' }}
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

                <div className="mb-3">
                  <label className="text-muted font-mono-tech d-block mb-1" style={{ fontSize: '0.72rem' }}>DECISION SUPPORT DIRECTIVES &amp; TASK INSTRUCTIONS</label>
                  <textarea
                    className="form-control font-mono-tech"
                    rows="3"
                    value={formData.technicianNotes}
                    onChange={(e) => setFormData({ ...formData, technicianNotes: e.target.value })}
                    style={{ fontSize: '0.82rem', borderRadius: '12px' }}
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" className="skyline-btn-secondary" onClick={onClose}>Cancel</button>
                  <button type="submit" className="skyline-btn-dark px-4">Generate Work Order</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
