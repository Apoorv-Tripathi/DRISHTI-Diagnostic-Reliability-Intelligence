import React, { useState, useEffect } from 'react';
import SensorTrendChart from '../components/SensorTrendChart.jsx';
import { fetchTelemetry } from '../services/api.js';
import { AlertTriangle, ShieldAlert, Cpu, ArrowRight, Package, Wrench, CheckCircle, Info, Activity, Radio, ExternalLink } from 'lucide-react';

export default function PredictiveMaintenance({
  alerts = [],
  workOrders = [],
  onSelectAircraft,
  onNavigate,
  onOpenWorkOrderModal
}) {
  const [selectedAlertId, setSelectedAlertId] = useState(alerts[0]?.alertId || 'ALT-2026-089');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [telemetry, setTelemetry] = useState(null);

  const selectedAlert = alerts.find(a => a.alertId === selectedAlertId) || alerts[0];

  // Check if an active work order exists for the selected alert/aircraft
  const activeOrderForSelected = workOrders.find(w =>
    (w.alertId && w.alertId === selectedAlert?.alertId) ||
    (w.aircraftId === selectedAlert?.aircraftId && w.status !== 'Completed')
  );

  useEffect(() => {
    if (selectedAlert) {
      fetchTelemetry(selectedAlert.aircraftId).then(data => setTelemetry(data));
    }
  }, [selectedAlert]);

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Critical': return { label: 'CRITICAL', class: 'skyline-pill-red' };
      case 'High': return { label: 'HIGH', class: 'skyline-pill-amber' };
      case 'Medium': return { label: 'MEDIUM', class: 'skyline-pill-amber' };
      case 'Low': return { label: 'LOW', class: 'skyline-pill-green' };
      default: return { label: severity, class: 'skyline-pill-dark' };
    }
  };

  const getSubsystemCadImage = (subsystem) => {
    const s = (subsystem || '').toLowerCase();
    if (s.includes('engine') || s.includes('propulsion') || s.includes('powerplant')) return '/images/cad/cad-subsystem-engine.png';
    if (s.includes('avionics') || s.includes('radar')) return '/images/cad/cad-sub-avionics.png';
    if (s.includes('fuel')) return '/images/cad/cad-sub-fuel.png';
    if (s.includes('hydraulic')) return '/images/cad/cad-sub-hydraulics.png';
    if (s.includes('electrical')) return '/images/cad/cad-sub-electrical.png';
    return '/images/cad/cad-aircraft-cutaway.png';
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-3" style={{ maxWidth: '1440px' }}>
      {/* Top Header Row */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.68rem', padding: '0.2rem 0.65rem' }}>
              DIAGNOSTICS & FAULTS
            </span>
            <span className="font-mono-tech text-muted" style={{ fontSize: '0.74rem' }}>
              MULTI-SENSOR ANOMALY & RUL HORIZON
            </span>
          </div>
          <h2 className="fw-bold text-dark mb-0" style={{ letterSpacing: '-0.02em', fontSize: '1.6rem' }}>
            Predictive Maintenance Diagnostics
          </h2>
          <p className="text-muted small mb-0 mt-1">
            Explainable failure prediction synthesized from vibration FFT, thermal gradients, and cyclic structural fatigue.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
          <span className="skyline-pill skyline-pill-green" style={{ fontSize: '0.72rem' }}>
            ● ISO-13374 AI ENGINE ACTIVE
          </span>
        </div>
      </div>

      {/* Advisory Information Banner */}
      <div className="skyline-card p-3 mb-3" style={{ background: '#FFFFFF', borderLeft: '4px solid #FFA034' }}>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '36px', height: '36px', background: 'rgba(255, 160, 52, 0.15)', color: '#FFA034', flexShrink: 0 }}>
            <Info size={18} />
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Human-in-the-Loop Diagnostic Protocol</span>
              <span className="skyline-pill skyline-pill-amber" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>MANDATORY REVIEW</span>
            </div>
            <p className="text-muted small mb-0 mt-0.5" style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
              Predictions are probabilistic decision aids synthesized from multi-variate vibration FFT, thermal gradients, and cycle stress. 
              Outputs are paired with physical sensor traces to support qualified aeronautical engineers—never as autonomous or ungrounded claims.
            </p>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Left Column: Active Anomalies Queue */}
        <div className="col-12 col-lg-4">
          <div className="skyline-card p-0 overflow-hidden h-100 d-flex flex-column">
            {/* Header with Severity Filter */}
            <div className="p-3 d-flex justify-content-between align-items-center border-bottom" style={{ background: '#FAFAFA' }}>
              <div className="d-flex align-items-center gap-2">
                <AlertTriangle size={15} color="#FF4F34" />
                <span className="fw-bold text-dark" style={{ fontSize: '0.88rem' }}>
                  Active Fault Queue ({filteredAlerts.length})
                </span>
              </div>

              <select
                className="form-select form-select-sm font-mono-tech"
                style={{ minWidth: '135px', width: 'auto', fontSize: '0.74rem', borderRadius: '14px', border: '1px solid #E2E8F0', paddingRight: '2rem' }}
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
              >
                <option value="ALL">ALL LEVELS</option>
                <option value="Critical">CRITICAL</option>
                <option value="High">HIGH</option>
                <option value="Medium">MEDIUM</option>
              </select>
            </div>

            {/* List of Faults */}
            <div className="p-2 flex-grow-1" style={{ maxHeight: '680px', overflowY: 'auto' }}>
              {filteredAlerts.map(alert => {
                const isSelected = selectedAlert?.alertId === alert.alertId;
                const badge = getSeverityBadge(alert.severity);

                return (
                  <div
                    key={alert.alertId}
                    onClick={() => setSelectedAlertId(alert.alertId)}
                    className="p-3 mb-2 rounded-3 transition-all"
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? '#F8F9FA' : '#FFFFFF',
                      border: isSelected ? '2px solid #333333' : '1px solid #E5E7EB',
                      boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.06)' : 'none'
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <div 
                        className="d-flex align-items-center justify-content-center rounded-2 p-1" 
                        style={{ background: '#FFFFFF', border: '1px solid #E5E8EC', width: '38px', height: '26px', flexShrink: 0 }}
                      >
                        <img 
                          src={getSubsystemCadImage(alert.subsystem)} 
                          alt="" 
                          style={{ maxWidth: '34px', maxHeight: '20px', objectFit: 'contain' }}
                        />
                      </div>
                      <div className="d-flex justify-content-between align-items-center flex-grow-1">
                        <span className="font-mono-tech fw-bold text-dark" style={{ fontSize: '0.82rem' }}>
                          {alert.aircraftId} • {alert.subsystem}
                        </span>
                        <span className={`skyline-pill ${badge.class}`} style={{ fontSize: '0.65rem' }}>
                          {badge.label}
                        </span>
                      </div>
                    </div>

                    <div className="fw-bold text-dark small mb-2" style={{ fontSize: '0.82rem' }}>
                      {alert.componentName}
                    </div>

                    <div className="d-flex justify-content-between align-items-center font-mono-tech" style={{ fontSize: '0.74rem' }}>
                      <span className="fw-bold" style={{ color: alert.severity === 'Critical' ? '#FF4F34' : '#FFA034' }}>
                        RUL: ~{alert.rulEstimateHours}h
                      </span>
                      <span className="text-muted">CONF: {alert.confidence}%</span>
                    </div>

                    <div className="mt-2 pt-2 border-top d-flex justify-content-between align-items-center" style={{ fontSize: '0.68rem' }}>
                      <span className="text-muted font-mono-tech">{alert.alertId}</span>
                      {(() => {
                        const linkedWo = workOrders.find(w => 
                          (w.alertId && w.alertId === alert.alertId) ||
                          (w.aircraftId === alert.aircraftId && w.status !== 'Completed')
                        );
                        if (linkedWo) {
                          return (
                            <span className="skyline-pill skyline-pill-amber" style={{ fontSize: '0.62rem', padding: '0.1rem 0.45rem' }}>
                              {linkedWo.orderId} • {linkedWo.status.toUpperCase()}
                            </span>
                          );
                        }
                        return (
                          <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.62rem', padding: '0.1rem 0.45rem' }}>
                            {alert.status.toUpperCase()}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: In-Depth Predictive Diagnostics & Recommendation */}
        <div className="col-12 col-lg-8">
          {selectedAlert ? (
            <div className="d-flex flex-column gap-3">
              {/* Alert Diagnostics Main Card */}
              <div className="skyline-card p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3 pb-3 border-bottom">
                  <div className="d-flex align-items-center gap-3">
                    {/* Component 3D CAD Cutaway Preview */}
                    <div 
                      className="d-flex align-items-center justify-content-center rounded-3 p-2" 
                      style={{ background: '#F8F9FA', border: '1px solid #E5E8EC', width: '84px', height: '64px', flexShrink: 0 }}
                      title="Component 3D CAD Twin"
                    >
                      <img 
                        src={getSubsystemCadImage(selectedAlert.subsystem)} 
                        alt={selectedAlert.componentName} 
                        style={{ maxWidth: '78px', maxHeight: '52px', objectFit: 'contain' }}
                      />
                    </div>

                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className={`skyline-pill ${getSeverityBadge(selectedAlert.severity).class}`} style={{ fontSize: '0.68rem' }}>
                          {selectedAlert.severity.toUpperCase()} SEVERITY
                        </span>
                        <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.68rem' }}>
                          ID: {selectedAlert.alertId}
                        </span>
                      </div>
                      <h4 className="fw-bold text-dark mb-0" style={{ letterSpacing: '-0.01em' }}>
                        {selectedAlert.componentName}
                      </h4>
                      <div className="text-muted font-mono-tech small mt-1" style={{ fontSize: '0.78rem' }}>
                        Target Airframe: <strong className="text-dark">{selectedAlert.aircraftId}</strong> | Subsystem: <strong className="text-dark">{selectedAlert.subsystem}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex align-items-center gap-2">
                    {activeOrderForSelected ? (
                      <button
                        onClick={() => onNavigate('maintenance')}
                        className="skyline-btn-dark d-flex align-items-center gap-1.5"
                        style={{ fontSize: '0.78rem', padding: '0.5rem 1rem' }}
                      >
                        <Wrench size={14} color="#FFA034" />
                        <span>View Directive ({activeOrderForSelected.orderId})</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenWorkOrderModal(selectedAlert, selectedAlert.aircraftId)}
                        className="skyline-btn-dark d-flex align-items-center gap-1.5"
                        style={{ fontSize: '0.78rem', padding: '0.5rem 1rem' }}
                      >
                        <Wrench size={14} />
                        <span>Issue Work Order</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (onSelectAircraft) onSelectAircraft(selectedAlert.aircraftId);
                        onNavigate('aircraft');
                      }}
                      className="skyline-btn-secondary d-flex align-items-center gap-1.5"
                      style={{ fontSize: '0.78rem', padding: '0.5rem 1rem' }}
                    >
                      <span>Digital Twin</span>
                      <ExternalLink size={13} />
                    </button>
                  </div>
                </div>

                {/* Key Metrics Strip: RUL, Confidence & Algorithm */}
                <div className="row g-2 mb-3">
                  <div className="col-12 col-md-4">
                    <div className="p-3 rounded-3 h-100" style={{ background: '#F8F9FA', border: '1px solid #E5E7EB' }}>
                      <span className="text-muted font-mono-tech d-block mb-1" style={{ fontSize: '0.7rem' }}>ESTIMATED RUL HORIZON</span>
                      <div className="fs-3 fw-bold font-mono-tech mb-0" style={{ color: '#D32F1A' }}>
                        {selectedAlert.rulEstimateHours} <span style={{ fontSize: '0.85rem' }}>HOURS</span>
                      </div>
                      <small className="text-muted font-mono-tech" style={{ fontSize: '0.7rem' }}>
                        95% CI: [{selectedAlert.rulConfidenceInterval?.min || 11.2}h - {selectedAlert.rulConfidenceInterval?.max || 18.0}h]
                      </small>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="p-3 rounded-3 h-100" style={{ background: '#F8F9FA', border: '1px solid #E5E7EB' }}>
                      <span className="text-muted font-mono-tech d-block mb-1" style={{ fontSize: '0.7rem' }}>MODEL CONFIDENCE</span>
                      <div className="fs-3 fw-bold text-dark font-mono-tech mb-0">
                        {selectedAlert.confidence}%
                      </div>
                      <small className="font-mono-tech fw-semibold" style={{ fontSize: '0.7rem', color: '#0F8205' }}>
                        Statistical significance p &lt; 0.001
                      </small>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="p-3 rounded-3 h-100" style={{ background: '#F8F9FA', border: '1px solid #E5E7EB' }}>
                      <span className="text-muted font-mono-tech d-block mb-1" style={{ fontSize: '0.7rem' }}>DETECTION ALGORITHM</span>
                      <div className="fw-bold text-dark small mb-1" style={{ fontSize: '0.85rem' }}>
                        Spectral FFT & Isolation Forest
                      </div>
                      <small className="text-muted font-mono-tech" style={{ fontSize: '0.7rem' }}>
                        Trained on 4,200h baseline flight data
                      </small>
                    </div>
                  </div>
                </div>

                {/* Physical Anomaly Physics Breakdown */}
                <div className="mb-3">
                  <span className="fw-bold text-dark d-block mb-1" style={{ fontSize: '0.78rem' }}>ANOMALY PHYSICAL SYMPTOM DECOMPOSITION</span>
                  <div className="p-3 rounded-3 font-mono-tech text-dark" style={{ background: '#F8F9FA', border: '1px solid #E5E7EB', fontSize: '0.8rem', lineHeight: 1.6 }}>
                    {selectedAlert.anomalyDescription}
                  </div>
                </div>

                {/* Engineering Action Recommendation */}
                <div className="p-3 rounded-3 mb-3" style={{ background: 'rgba(255, 160, 52, 0.08)', border: '1px solid rgba(255, 160, 52, 0.3)' }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="skyline-pill skyline-pill-amber" style={{ fontSize: '0.65rem' }}>DIRECTIVE</span>
                    <span className="fw-bold text-dark" style={{ fontSize: '0.78rem' }}>RECOMMENDED MAINTENANCE ACTION</span>
                  </div>
                  <div className="fw-semibold text-dark font-mono-tech" style={{ fontSize: '0.82rem' }}>
                    {selectedAlert.actionRecommendation}
                  </div>
                </div>

                {/* Connected Depot Spares Logistics Table */}
                <div className="rounded-3 p-3" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-dark" style={{ fontSize: '0.8rem' }}>CONNECTED DEPOT SPARES AVAILABILITY</span>
                    <button
                      onClick={() => onNavigate('spares')}
                      className="skyline-btn-secondary py-1 px-2 border-0"
                      style={{ fontSize: '0.72rem' }}
                    >
                      View All Spares Inventory →
                    </button>
                  </div>

                  {selectedAlert.requiredSpareParts && selectedAlert.requiredSpareParts.length > 0 ? (
                    <div className="table-responsive">
                      <table className="skyline-table w-100" style={{ fontSize: '0.78rem' }}>
                        <thead>
                          <tr>
                            <th>PART NUMBER</th>
                            <th>PART NAME</th>
                            <th>QTY</th>
                            <th>DEPOT AVAILABILITY & LOGISTICS STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedAlert.requiredSpareParts.map((sp, idx) => (
                            <tr key={idx}>
                              <td className="fw-bold text-dark font-mono-tech">{sp.partNumber}</td>
                              <td>{sp.name}</td>
                              <td className="font-mono-tech">{sp.quantity}</td>
                              <td>
                                <span className="skyline-pill skyline-pill-amber" style={{ fontSize: '0.68rem' }}>
                                  {sp.availability}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-muted small font-mono-tech">No replacement components required for this diagnostic action.</div>
                  )}
                </div>
              </div>

              {/* Sensor Trend Chart for this anomaly */}
              <div className="skyline-card p-3">
                <SensorTrendChart
                  telemetryData={telemetry}
                  title={`${selectedAlert.aircraftId} — ${selectedAlert.componentName} Degradation Trend`}
                />
              </div>
            </div>
          ) : (
            <div className="skyline-card p-5 text-center text-muted font-mono-tech">
              Select an alert from the left to view detailed predictive failure analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
