import React, { useState } from 'react';
import {
  Package,
  Truck,
  AlertTriangle,
  CheckCircle,
  Search,
  ExternalLink,
  ShieldCheck,
  Box,
  Clock,
  ArrowRight,
  X,
  Layers,
  Building,
  Plane
} from 'lucide-react';

export default function SparesInventory({
  spares = [],
  alerts = [],
  onRequisitionPart,
  onNavigate
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubsystem, setFilterSubsystem] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedSpareForModal, setSelectedSpareForModal] = useState(null);
  const [dispatchSuccessToast, setDispatchSuccessToast] = useState(null);

  // Form state for requisition modal
  const [targetBase, setTargetBase] = useState('Ambala AFS (Forward Store 1)');
  const [transitPriority, setTransitPriority] = useState('FLASH (Airlift 6h)');
  const [orderRemarks, setOrderRemarks] = useState('');

  // Check if a part is urgently needed by any active alert
  const getUrgentNeeds = (partNumber) => {
    return alerts.filter(a =>
      a.status === 'Active' &&
      a.requiredSpareParts &&
      a.requiredSpareParts.some(p => p.partNumber === partNumber)
    );
  };

  const filteredSpares = spares.filter(s => {
    const matchesSearch =
      s.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.supplier && s.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.subsystem && s.subsystem.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSub = filterSubsystem === 'ALL' || s.subsystem === filterSubsystem;

    let matchesStatus = true;
    const isUrgent = getUrgentNeeds(s.partNumber).length > 0;
    const isExpedited = s.requisitionStatus.toLowerCase().includes('requisition') || s.requisitionStatus.toLowerCase().includes('transit');
    const isCritA = s.criticality.startsWith('A');

    if (filterStatus === 'URGENT') matchesStatus = isUrgent;
    else if (filterStatus === 'CRITICAL_A') matchesStatus = isCritA;
    else if (filterStatus === 'EXPEDITED') matchesStatus = isExpedited;

    return matchesSearch && matchesSub && matchesStatus;
  });

  const urgentCount = spares.filter(s => getUrgentNeeds(s.partNumber).length > 0).length;
  const expeditedCount = spares.filter(s =>
    s.requisitionStatus.toLowerCase().includes('requisition') ||
    s.requisitionStatus.toLowerCase().includes('transit')
  ).length;

  const handleOpenRequisitionModal = (spare) => {
    const urgentAlerts = getUrgentNeeds(spare.partNumber);
    setSelectedSpareForModal(spare);
    if (urgentAlerts.length > 0) {
      setOrderRemarks(`Prognostic replacement for aircraft ${urgentAlerts.map(a => a.aircraftId).join(', ')} (${spare.subsystem})`);
    } else {
      setOrderRemarks(`Forward base buffer replenishment for ${spare.subsystem}`);
    }
  };

  const handleConfirmRequisition = () => {
    if (!selectedSpareForModal) return;

    onRequisitionPart(selectedSpareForModal.partNumber, {
      requisitionStatus: `Expedited to ${targetBase.split(' ')[0]} (ETA 18h)`
    });

    setDispatchSuccessToast(`Requisition order dispatched: Part #${selectedSpareForModal.partNumber} to ${targetBase}.`);
    setSelectedSpareForModal(null);

    setTimeout(() => {
      setDispatchSuccessToast(null);
    }, 4500);
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-3" style={{ maxWidth: '1440px' }}>
      {/* Toast Notification */}
      {dispatchSuccessToast && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1060, maxWidth: '440px' }}
        >
          <div
            className="p-3 shadow-sm d-flex align-items-center justify-content-between gap-3 text-white"
            style={{
              backgroundColor: '#0F172A',
              borderLeft: '4px solid #1DC30A',
              borderRadius: '6px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <CheckCircle size={18} color="#1DC30A" />
              <div style={{ fontSize: '0.82rem' }}>
                <strong className="d-block font-mono-tech">DISPATCH CONFIRMED</strong>
                <span>{dispatchSuccessToast}</span>
              </div>
            </div>
            <button
              onClick={() => setDispatchSuccessToast(null)}
              className="text-white-50 p-1"
              style={{ background: 'transparent', border: 'none' }}
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Top Header Row */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-3 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <span
              className="font-mono-tech px-2 py-0.5"
              style={{
                fontSize: '0.68rem',
                backgroundColor: '#0F172A',
                color: '#F8FAFC',
                borderRadius: '4px',
                letterSpacing: '0.04em'
              }}
            >
              AIR HQ LOGISTICS COMMAND
            </span>
            <span
              className="font-mono-tech text-muted px-2 py-0.5"
              style={{
                fontSize: '0.68rem',
                backgroundColor: '#F1F5F9',
                borderRadius: '4px',
                border: '1px solid #E2E8F0'
              }}
            >
              MIL-STD-1388-2B INTEGRATED LOGISTICS SUPPORT (ILS)
            </span>
          </div>
          <h2 className="fw-bold text-dark mb-0" style={{ letterSpacing: '-0.02em', fontSize: '1.5rem' }}>
            Depot Spares Inventory &amp; Forward Logistics
          </h2>
          <p className="text-muted small mb-0 mt-1">
            Real-time line replaceable unit (LRU) allocation, automated prognostic demand linking, and forward base stock levels.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 mt-3 mt-md-0 flex-wrap">
          <div
            className="d-flex align-items-center gap-2 px-3 py-1 bg-white font-mono-tech text-muted"
            style={{
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              fontSize: '0.74rem'
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>
            <span>CENTRAL DEPOT (PUNE) + 4 FORWARD STORES</span>
          </div>
        </div>
      </div>

      {/* Non-AI Human Aerospace Telemetry KPI Cards */}
      <div className="row g-3 mb-3">
        {/* Metric 1 */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="bg-white p-3 h-100" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
            <div className="d-flex justify-content-between align-items-center mb-2 font-mono-tech">
              <span className="text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                MONITORED LINE ITEMS (LRUs)
              </span>
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                [{spares.length} ITEMS]
              </span>
            </div>

            <div className="d-flex align-items-baseline gap-2 mb-2">
              <div className="fs-2 fw-bold font-mono-tech text-dark" style={{ letterSpacing: '-0.02em', lineHeight: 1 }}>
                {spares.length}
              </div>
              <span className="font-mono-tech text-muted" style={{ fontSize: '0.74rem' }}>
                Assemblies Catalogued
              </span>
            </div>

            <div
              className="p-2 rounded-1 font-mono-tech text-muted"
              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.68rem' }}
            >
              Engine • Hydraulics • Avionics • Controls
            </div>
            <div className="mt-2 font-mono-tech text-muted d-flex justify-content-between" style={{ fontSize: '0.66rem' }}>
              <span>Depot Network: Pune, Ambala, Bareilly, Sulur</span>
              <span className="text-success">● Synced</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="bg-white p-3 h-100" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
            <div className="d-flex justify-content-between align-items-center mb-2 font-mono-tech">
              <span className="text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                PROGNOSTIC DEMAND (AOG RISK)
              </span>
              <span style={{ fontSize: '0.7rem', color: urgentCount > 0 ? '#DC2626' : '#64748B' }}>
                [{urgentCount} LINKED]
              </span>
            </div>

            <div className="d-flex align-items-baseline gap-2 mb-2">
              <div className="fs-2 fw-bold font-mono-tech text-dark" style={{ letterSpacing: '-0.02em', lineHeight: 1 }}>
                {urgentCount}
              </div>
              <span className="font-mono-tech text-muted" style={{ fontSize: '0.74rem' }}>
                Active Snags
              </span>
            </div>

            <div
              className="p-2 rounded-1 font-mono-tech d-flex justify-content-between align-items-center"
              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.68rem' }}
            >
              <span className="text-dark">Pre-positioned before AOG:</span>
              <span className="text-danger fw-bold">{urgentCount} Tails</span>
            </div>
            <div className="mt-2 font-mono-tech text-muted d-flex justify-content-between" style={{ fontSize: '0.66rem' }}>
              <span>Linked to AF-04 &amp; AF-02</span>
              <span className="text-danger">● Priority Hold</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="bg-white p-3 h-100" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
            <div className="d-flex justify-content-between align-items-center mb-2 font-mono-tech">
              <span className="text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                IN TRANSIT &amp; EXPEDITED
              </span>
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                [{expeditedCount} ORDERS]
              </span>
            </div>

            <div className="d-flex align-items-baseline gap-2 mb-2">
              <div className="fs-2 fw-bold font-mono-tech text-dark" style={{ letterSpacing: '-0.02em', lineHeight: 1 }}>
                {expeditedCount}
              </div>
              <span className="font-mono-tech text-muted" style={{ fontSize: '0.74rem' }}>
                Active Dispatches
              </span>
            </div>

            <div
              className="p-2 rounded-1 font-mono-tech text-muted"
              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.68rem' }}
            >
              Forward Stores Priority Replenishment
            </div>
            <div className="mt-2 font-mono-tech text-muted d-flex justify-content-between" style={{ fontSize: '0.66rem' }}>
              <span>Mean Transit Turnaround: 18h</span>
              <span className="text-primary">● Airlift Active</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="bg-white p-3 h-100" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
            <div className="d-flex justify-content-between align-items-center mb-2 font-mono-tech">
              <span className="text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                SUPPLY CHAIN READINESS
              </span>
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                [ILS INDEX]
              </span>
            </div>

            <div className="d-flex align-items-baseline gap-2 mb-2">
              <div className="fs-2 fw-bold font-mono-tech text-dark" style={{ letterSpacing: '-0.02em', lineHeight: 1 }}>
                94.2%
              </div>
              <span className="font-mono-tech text-muted" style={{ fontSize: '0.74rem' }}>
                Fleet Stock Coverage
              </span>
            </div>

            <div
              className="p-2 rounded-1 font-mono-tech text-muted"
              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.68rem' }}
            >
              Forward Stores Buffer Above Critical Threshold
            </div>
            <div className="mt-2 font-mono-tech text-muted d-flex justify-content-between" style={{ fontSize: '0.66rem' }}>
              <span>Zero Depot Stockouts</span>
              <span className="text-success">● Fully Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clean, De-cluttered Filters Toolbar */}
      <div className="bg-white p-3 mb-3" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          {/* Search Box */}
          <div className="flex-grow-1" style={{ minWidth: '240px', maxWidth: '380px' }}>
            <div className="input-group input-group-sm">
              <span
                className="input-group-text bg-white border-end-0 text-muted"
                style={{ borderRadius: '6px 0 0 6px', border: '1px solid #E2E8F0' }}
              >
                <Search size={14} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 font-mono-tech"
                placeholder="Search part number, description, OEM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: '0.8rem', borderRadius: '0 6px 6px 0', border: '1px solid #E2E8F0' }}
              />
            </div>
          </div>

          {/* Subsystem Dropdown/Buttons */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted font-mono-tech" style={{ fontSize: '0.72rem' }}>
              SUBSYSTEM:
            </span>
            <select
              className="form-select form-select-sm font-mono-tech"
              value={filterSubsystem}
              onChange={(e) => setFilterSubsystem(e.target.value)}
              style={{ width: '180px', fontSize: '0.76rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}
            >
              <option value="ALL">ALL SUBSYSTEMS</option>
              <option value="Engine">Engine Powerplant</option>
              <option value="Hydraulics">Hydraulics</option>
              <option value="Avionics">Avionics &amp; Radar</option>
              <option value="Flight Controls">Flight Controls</option>
            </select>
          </div>

          {/* Status Buttons */}
          <div className="d-flex align-items-center gap-1">
            {[
              { id: 'ALL', label: 'ALL SPARES' },
              { id: 'URGENT', label: 'URGENT DEMAND' },
              { id: 'CRITICAL_A', label: 'CLASS A' },
              { id: 'EXPEDITED', label: 'IN TRANSIT' }
            ].map(tab => {
              const active = filterStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className="font-mono-tech px-2.5 py-1"
                  style={{
                    fontSize: '0.72rem',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: active ? '#0F172A' : '#E2E8F0',
                    backgroundColor: active ? '#0F172A' : '#FFFFFF',
                    color: active ? '#FFFFFF' : '#64748B',
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="text-muted font-mono-tech ms-auto" style={{ fontSize: '0.72rem' }}>
            PARTS: <strong>{filteredSpares.length}</strong> OF <strong>{spares.length}</strong>
          </div>
        </div>
      </div>

      {/* De-cluttered, Calm Logistics Ledger Table */}
      <div className="bg-white overflow-hidden mb-3" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
        <div
          className="p-3 d-flex justify-content-between align-items-center border-bottom"
          style={{ background: '#F8FAFC' }}
        >
          <div className="d-flex align-items-center gap-2">
            <Package size={15} color="#0F172A" />
            <span className="fw-bold text-dark font-mono-tech" style={{ fontSize: '0.84rem' }}>
              FORWARD STORES &amp; DEPOT LRU INVENTORY
            </span>
          </div>
          <span className="font-mono-tech text-muted" style={{ fontSize: '0.7rem' }}>
            MIL-STD-1553B / STANAG-4107 COMPLIANT
          </span>
        </div>

        <div className="table-responsive">
          <table className="table align-middle mb-0 font-sans" style={{ fontSize: '0.82rem' }}>
            <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <tr className="font-mono-tech text-muted" style={{ fontSize: '0.68rem' }}>
                <th className="py-2.5 px-3">PART NUMBER / LRU</th>
                <th className="py-2.5 px-3">DESCRIPTION &amp; OEM</th>
                <th className="py-2.5 px-3">CRITICALITY</th>
                <th className="py-2.5 px-3">DEPOT STOCK</th>
                <th className="py-2.5 px-3">LEAD TIME</th>
                <th className="py-2.5 px-3">PROGNOSTIC DEMAND LINK</th>
                <th className="py-2.5 px-3 text-end" style={{ minWidth: '130px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpares.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted font-mono-tech">
                    <Box size={28} className="mb-2 text-muted opacity-50 d-block mx-auto" />
                    No spares match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSpares.map((spare) => {
                  const urgentAlerts = getUrgentNeeds(spare.partNumber);
                  const isUrgent = urgentAlerts.length > 0;
                  const isExpedited =
                    spare.requisitionStatus.toLowerCase().includes('requisition') ||
                    spare.requisitionStatus.toLowerCase().includes('transit') ||
                    spare.requisitionStatus.toLowerCase().includes('expedited');

                  return (
                    <tr
                      key={spare.partNumber}
                      style={{
                        backgroundColor: isUrgent ? '#FFFDFD' : '#FFFFFF',
                        borderBottom: '1px solid #F1F5F9'
                      }}
                    >
                      {/* Part Number & Aircraft Compatibility */}
                      <td className="py-2.5 px-3">
                        <div className="d-flex align-items-center gap-1.5">
                          {isUrgent && (
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: '#DC2626',
                                display: 'inline-block'
                              }}
                              title="Active Snag Linked"
                            />
                          )}
                          <span className="font-mono-tech fw-bold text-dark" style={{ fontSize: '0.84rem' }}>
                            {spare.partNumber}
                          </span>
                        </div>
                        <div className="font-mono-tech text-muted mt-0.5" style={{ fontSize: '0.68rem' }}>
                          {spare.compatibleAircraft ? spare.compatibleAircraft.join(', ') : 'All Fleet'}
                        </div>
                      </td>

                      {/* Description & OEM */}
                      <td className="py-2.5 px-3">
                        <div className="fw-semibold text-dark" style={{ fontSize: '0.82rem' }}>
                          {spare.name}
                        </div>
                        <div className="font-mono-tech text-muted" style={{ fontSize: '0.7rem' }}>
                          {spare.subsystem} • {spare.supplier}
                        </div>
                      </td>

                      {/* Criticality */}
                      <td className="py-2.5 px-3 font-mono-tech">
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: spare.criticality.startsWith('A') ? '#B91C1C' : '#475569'
                          }}
                        >
                          {spare.criticality.startsWith('A') ? '● Class A (Critical)' : '○ Class B (Essential)'}
                        </span>
                      </td>

                      {/* Depot Stock Allocation */}
                      <td className="py-2.5 px-3 font-mono-tech">
                        <div className="fw-bold text-dark" style={{ fontSize: '0.8rem' }}>
                          {spare.totalAvailable} Units Total
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.68rem' }}>
                          Pune: {spare.depotStock?.centralDepotPune || 0} | Ambala: {spare.depotStock?.ambalaStore || 0} | Bareilly: {spare.depotStock?.bareillyStore || 0}
                        </div>
                      </td>

                      {/* Lead Time */}
                      <td className="py-2.5 px-3 font-mono-tech">
                        <div className="text-dark fw-bold" style={{ fontSize: '0.78rem' }}>
                          {spare.leadTimeDays}d Turnaround
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.68rem' }}>
                          ₹{(spare.unitCostINR / 100000).toFixed(1)}L/Unit
                        </div>
                      </td>

                      {/* Prognostic Demand Link */}
                      <td className="py-2.5 px-3">
                        {isUrgent ? (
                          <div className="d-flex flex-column gap-1">
                            {urgentAlerts.map(alert => (
                              <button
                                key={alert.alertId}
                                onClick={() => onNavigate && onNavigate('aircraft', alert.aircraftId)}
                                className="font-mono-tech text-start p-1 d-flex align-items-center justify-content-between gap-1 text-danger"
                                style={{
                                  fontSize: '0.7rem',
                                  background: 'transparent',
                                  border: 'none',
                                  cursor: 'pointer',
                                  textDecoration: 'underline'
                                }}
                                title="Inspect aircraft digital twin"
                              >
                                <span>⚠️ Required for {alert.aircraftId} ({alert.subsystem})</span>
                                <ExternalLink size={11} />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="font-mono-tech text-muted" style={{ fontSize: '0.72rem' }}>
                            Nominal buffer
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3 text-end" style={{ minWidth: '130px' }}>
                        {isExpedited ? (
                          <span
                            className="font-mono-tech text-success d-inline-flex align-items-center gap-1"
                            style={{ fontSize: '0.74rem', fontWeight: 600 }}
                          >
                            <CheckCircle size={13} color="#10B981" />
                            Expedited (ETA 18h)
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenRequisitionModal(spare)}
                            className="font-mono-tech px-2.5 py-1"
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              backgroundColor: isUrgent ? '#DC2626' : '#0F172A',
                              color: '#FFFFFF',
                              borderRadius: '4px',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            Requisition
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Requisition Order Dispatch Modal */}
      {selectedSpareForModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            zIndex: 1050
          }}
        >
          <div
            className="bg-white shadow-lg overflow-hidden"
            style={{
              width: '92%',
              maxWidth: '540px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0'
            }}
          >
            {/* Modal Header */}
            <div
              className="p-3 d-flex justify-content-between align-items-center border-bottom"
              style={{ backgroundColor: '#0F172A', color: '#FFFFFF' }}
            >
              <div>
                <span
                  className="font-mono-tech text-muted d-block"
                  style={{ fontSize: '0.65rem' }}
                >
                  DISPATCH ORDER REQUISITION
                </span>
                <h5 className="mb-0 fw-bold font-sans" style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>
                  Forward Depot Spares Dispatch
                </h5>
              </div>
              <button
                onClick={() => setSelectedSpareForModal(null)}
                className="text-white-50 p-1"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 font-sans">
              {/* Part Details Box */}
              <div
                className="p-3 mb-3 font-mono-tech"
                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px' }}
              >
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <div>
                    <span className="fw-bold text-dark d-block" style={{ fontSize: '0.88rem' }}>
                      {selectedSpareForModal.partNumber}
                    </span>
                    <span className="text-secondary" style={{ fontSize: '0.8rem' }}>
                      {selectedSpareForModal.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: selectedSpareForModal.criticality.startsWith('A') ? '#DC2626' : '#475569'
                    }}
                  >
                    {selectedSpareForModal.criticality}
                  </span>
                </div>
                <div className="text-muted mt-2 d-flex justify-content-between" style={{ fontSize: '0.72rem' }}>
                  <span>Central Depot Stock: <strong>{selectedSpareForModal.depotStock?.centralDepotPune || 0} units</strong></span>
                  <span>Unit Cost: <strong>₹{(selectedSpareForModal.unitCostINR / 100000).toFixed(1)} Lakh</strong></span>
                </div>
              </div>

              {/* Form Controls */}
              <div className="mb-3">
                <label className="form-label font-mono-tech text-muted small mb-1">
                  DESTINATION FORWARD AIRBASE:
                </label>
                <select
                  className="form-select form-select-sm font-mono-tech"
                  value={targetBase}
                  onChange={(e) => setTargetBase(e.target.value)}
                  style={{ borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                >
                  <option value="Ambala AFS (Forward Store 1)">Ambala AFS — No. 17 Golden Arrows (Forward Store 1)</option>
                  <option value="Bareilly AFS (Forward Store 2)">Bareilly AFS — No. 8 Pursoots (Forward Store 2)</option>
                  <option value="Gwalior AFS (Forward Store 3)">Gwalior AFS — No. 1 Tigers (Forward Store 3)</option>
                  <option value="Sulur AFS (Forward Store 4)">Sulur AFS — No. 45 Flying Daggers (Forward Store 4)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label font-mono-tech text-muted small mb-1">
                  DISPATCH TRANSIT PRIORITY:
                </label>
                <select
                  className="form-select form-select-sm font-mono-tech"
                  value={transitPriority}
                  onChange={(e) => setTransitPriority(e.target.value)}
                  style={{ borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                >
                  <option value="FLASH (Airlift 6h)">FLASH MIL-CARGO (An-32 Dedicated Airlift — 6 Hours)</option>
                  <option value="IMMEDIATE (Express Transit 18h)">IMMEDIATE (Standard Tactical Logistics Courier — 18 Hours)</option>
                  <option value="ROUTINE (48h Depot Replenishment)">ROUTINE (Scheduled Depot Consignment — 48 Hours)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label font-mono-tech text-muted small mb-1">
                  REQUISITION JUSTIFICATION &amp; TAIL ALLOCATION:
                </label>
                <textarea
                  className="form-control font-mono-tech"
                  rows="2"
                  value={orderRemarks}
                  onChange={(e) => setOrderRemarks(e.target.value)}
                  placeholder="Enter specific work order or tail linkage..."
                  style={{ fontSize: '0.78rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                />
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <button
                  type="button"
                  onClick={() => setSelectedSpareForModal(null)}
                  className="font-mono-tech px-3 py-1.5"
                  style={{
                    fontSize: '0.76rem',
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    border: '1px solid #CBD5E1',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRequisition}
                  className="font-mono-tech px-3 py-1.5 d-flex align-items-center gap-1.5"
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: '600',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <CheckCircle size={13} color="#10B981" />
                  CONFIRM DISPATCH REQUISITION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
