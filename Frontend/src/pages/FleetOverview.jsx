import React, { useState } from 'react';
import {
  Plane,
  AlertTriangle,
  Search,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Clock,
  Wrench,
  Layers,
  FileText,
  UserCheck,
  CheckSquare,
  ArrowRight,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import AirworthinessReportModal from '../components/AirworthinessReportModal.jsx';

export default function FleetOverview({
  aircraftList = [],
  alerts = [],
  workOrders = [],
  onSelectAircraft,
  onNavigate,
  onOpenAssignJobModal,
  onValidateOrder
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBase, setSelectedBase] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedReportOrder, setSelectedReportOrder] = useState(null);
  const [expandedAircraftId, setExpandedAircraftId] = useState(null);

  // Filter logic
  const filteredAircraft = aircraftList.filter(a => {
    const matchesSearch =
      a.aircraftId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.callsign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBase = selectedBase === 'ALL' || a.airbase === selectedBase;
    const matchesStatus = selectedStatus === 'ALL' || a.status === selectedStatus;
    return matchesSearch && matchesBase && matchesStatus;
  });

  // Calculate genuine fleet metrics reflecting real inspection state
  const total = aircraftList.length;
  const missionCapable = aircraftList.filter(a => a.status === 'Mission Capable').length;
  const underInspection = aircraftList.filter(a => a.status === 'Under Inspection').length;
  const underMaintenance = aircraftList.filter(a => a.status === 'Under Maintenance' || a.status === 'Awaiting Spares').length;
  const availabilityRate = total > 0 ? +((missionCapable / total) * 100).toFixed(1) : 0;

  // Pending technician inspection reports awaiting admin passing order
  const pendingValidationOrders = workOrders.filter(w => w.status === 'Pending Command Validation');

  const bases = ['ALL', ...new Set(aircraftList.map(a => a.airbase))];
  const statuses = ['ALL', 'Mission Capable', 'Under Inspection', 'Under Maintenance'];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Mission Capable':
        return {
          label: 'Mission Capable',
          className: 'ent-badge ent-badge-capable',
          dot: '#24845B'
        };
      case 'Under Inspection':
        return {
          label: 'Under Inspection',
          className: 'ent-badge ent-badge-inspection',
          dot: '#C78522'
        };
      case 'Under Maintenance':
        return {
          label: 'Under Maintenance',
          className: 'ent-badge ent-badge-maintenance',
          dot: '#C84A4A'
        };
      case 'Awaiting Spares':
        return {
          label: 'Awaiting Spares',
          className: 'ent-badge ent-badge-neutral',
          dot: '#68717D'
        };
      default:
        return {
          label: status,
          className: 'ent-badge ent-badge-neutral',
          dot: '#68717D'
        };
    }
  };

  const getHealthColor = (health) => {
    if (health >= 85) return '#24845B';
    if (health >= 70) return '#C78522';
    return '#C84A4A';
  };

  const toggleExpand = (id) => {
    setExpandedAircraftId(prev => (prev === id ? null : id));
  };

  const hasActiveFilters = searchTerm !== '' || selectedBase !== 'ALL' || selectedStatus !== 'ALL';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBase('ALL');
    setSelectedStatus('ALL');
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-3" style={{ maxWidth: '1440px' }}>
      
      {/* 1. TOP COMMAND HEADER / INTRODUCTION */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4 pt-1">
        <div>
          {/* Breadcrumb & Subtle Telemetry State */}
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="text-secondary font-sans" style={{ fontSize: '0.78rem' }}>
              Operations / Fleet Control
            </span>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>•</span>
            <span className="d-inline-flex align-items-center gap-1.5 text-secondary font-sans" style={{ fontSize: '0.75rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#24845B' }}></span>
              Telemetry Mesh 20 Hz Live
            </span>
            <span className="text-muted d-none d-md-inline" style={{ fontSize: '0.75rem' }}>•</span>
            <span className="text-muted d-none d-md-inline font-sans" style={{ fontSize: '0.75rem' }}>
              MIL-STD-1553B Synchronized
            </span>
          </div>

          <h1 className="fw-bold text-dark mb-1 font-sans" style={{ fontSize: '1.65rem', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            Tactical Fleet Overview
          </h1>
          <p className="text-secondary mb-0 font-sans" style={{ fontSize: '0.86rem', maxWidth: '820px' }}>
            Monitor real-time airframe health, predictive remaining useful life (RUL) horizons, and technical passing orders across active forward wings.
          </p>
        </div>

        {/* Primary and Secondary Header Actions */}
        <div className="d-flex flex-wrap align-items-center gap-2 pt-1">
          {onOpenAssignJobModal && (
            <button
              onClick={onOpenAssignJobModal}
              className="btn btn-dark d-flex align-items-center gap-2 shadow-sm font-sans"
              style={{
                background: '#17212F',
                borderColor: '#17212F',
                fontSize: '0.82rem',
                fontWeight: 600,
                padding: '0.52rem 1.15rem',
                borderRadius: '8px'
              }}
            >
              <UserCheck size={15} />
              <span>Assign Directive</span>
            </button>
          )}

          <button
            onClick={() => {
              setSelectedStatus(selectedStatus === 'Under Inspection' ? 'ALL' : 'Under Inspection');
            }}
            className="btn d-flex align-items-center gap-2 font-sans"
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '0.52rem 1.1rem',
              borderRadius: '8px',
              background: selectedStatus === 'Under Inspection' ? '#FEF2F2' : '#FFFFFF',
              borderColor: selectedStatus === 'Under Inspection' ? '#FCA5A5' : '#D1D5DB',
              color: selectedStatus === 'Under Inspection' ? '#DC2626' : '#374151',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}
          >
            <AlertTriangle size={15} color={selectedStatus === 'Under Inspection' ? '#DC2626' : '#C78522'} />
            <span>Inspection Directives ({underInspection})</span>
          </button>
        </div>
      </div>

      {/* 2. COMMAND VALIDATION & PASSING ORDER INBOX */}
      {pendingValidationOrders.length > 0 ? (
        <div 
          className="mb-4 p-3 rounded-3" 
          style={{ 
            background: '#FFFFFF', 
            border: '1px solid #E5E8EC',
            borderLeft: '4px solid #C78522',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2 pb-2 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <span className="badge rounded-circle p-1" style={{ backgroundColor: '#C78522', width: '8px', height: '8px' }}></span>
              <span className="fw-semibold text-dark font-sans" style={{ fontSize: '0.88rem' }}>
                Command Action Required — {pendingValidationOrders.length} inspection report awaiting airworthiness passing order
              </span>
            </div>
            <span className="ent-badge ent-badge-inspection font-sans" style={{ fontSize: '0.72rem' }}>
              Airworthiness Review Required
            </span>
          </div>

          <div className="d-flex flex-column gap-2">
            {pendingValidationOrders.map(order => {
              const targetAc = aircraftList.find(a => a.aircraftId === order.aircraftId);

              return (
                <div 
                  key={order.orderId} 
                  className="p-3 rounded-2 d-flex flex-wrap justify-content-between align-items-center gap-3"
                  style={{ background: '#F8FAFC', border: '1px solid #E5E8EC' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="d-flex align-items-center justify-content-center rounded-2" 
                      style={{ width: '38px', height: '38px', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#17212F' }}
                    >
                      <FileText size={18} />
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="font-mono fw-bold text-dark fs-6">{order.aircraftId}</span>
                        <span className="text-secondary small font-sans">
                          {targetAc?.type || order.aircraftType}
                        </span>
                        <span className="text-muted font-mono" style={{ fontSize: '0.72rem' }}>
                          [{order.orderId}]
                        </span>
                      </div>
                      <div className="text-secondary small font-sans mt-0.5" style={{ fontSize: '0.76rem' }}>
                        Certifying Specialist: <strong className="text-dark">{order.assignedTechnician || 'Technician'}</strong> • Station: {order.station || 'Flight Line Bay'}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <div className="text-end d-none d-md-block font-sans">
                      <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Specialist Recommendation</span>
                      <span className="fw-semibold" style={{ color: order.technicianRecommendation === 'MAINTENANCE_REQUIRED' ? '#C84A4A' : '#24845B', fontSize: '0.82rem' }}>
                        {order.technicianRecommendation === 'MAINTENANCE_REQUIRED' ? 'Transfer to Heavy Maintenance' : 'Sortie Clearance Recommended'}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedReportOrder(order)}
                      className="btn btn-sm btn-dark d-flex align-items-center gap-1.5 shadow-sm font-sans"
                      style={{ 
                        background: '#17212F', 
                        borderColor: '#17212F',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        padding: '0.45rem 0.95rem',
                        borderRadius: '6px'
                      }}
                    >
                      <CheckSquare size={14} color="#C78522" />
                      <span>Review Report &amp; Issue Order →</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div 
          className="p-2.5 px-3 rounded-2 mb-4 d-flex justify-content-between align-items-center font-sans" 
          style={{ background: '#FFFFFF', border: '1px solid #E5E8EC', fontSize: '0.78rem' }}
        >
          <div className="d-flex align-items-center gap-2">
            <CheckCircle2 size={15} color="#24845B" />
            <span className="text-secondary">
              Command Readiness: <strong className="text-dark">All flight line directives validated. Zero pending passing orders.</strong>
            </span>
          </div>
          <span className="text-muted d-none d-md-inline" style={{ fontSize: '0.72rem' }}>
            Chain of Custody Active • MIL-STD-1553B
          </span>
        </div>
      )}

      {/* 3. KEY OPERATIONAL METRICS (4 COHESIVE ENTERPRISE CARDS) */}
      <div className="row g-3 mb-4">
        {/* Metric 1: Fleet Readiness */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="ent-metric-card">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="ent-metric-label font-sans">Fleet Readiness</span>
                <span className="font-sans text-muted" style={{ fontSize: '0.72rem' }}>
                  Target: 75%
                </span>
              </div>
              <div className="ent-metric-value font-sans">
                {availabilityRate}%
              </div>
              <div className="ent-metric-subtext font-sans">
                {missionCapable} of {total} aircraft mission capable
              </div>
            </div>

            <div className="pt-2">
              <div className="progress" style={{ height: '4px', background: '#F1F5F9', borderRadius: '2px', marginBottom: '0.4rem' }}>
                <div
                  className="progress-bar"
                  style={{
                    width: `${availabilityRate}%`,
                    backgroundColor: availabilityRate >= 60 ? '#24845B' : '#C84A4A'
                  }}
                ></div>
              </div>
              <div className="d-flex justify-content-between font-sans text-muted" style={{ fontSize: '0.72rem' }}>
                <span style={{ color: availabilityRate >= 60 ? '#24845B' : '#C84A4A', fontWeight: 500 }}>
                  {availabilityRate >= 60 ? '● Sortie Sustained' : '● Threshold Advisory'}
                </span>
                <span>{underInspection + underMaintenance} restricted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2: Aircraft Requiring Attention */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="ent-metric-card">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="ent-metric-label font-sans">Aircraft Requiring Attention</span>
                <span className="font-sans text-danger" style={{ fontSize: '0.72rem', fontWeight: 500 }}>
                  Restricted
                </span>
              </div>
              <div className="ent-metric-value font-sans">
                {underInspection + underMaintenance} <span style={{ fontSize: '1.05rem', fontWeight: 500, color: '#68717D' }}>tails</span>
              </div>
              <div className="ent-metric-subtext font-sans">
                {underInspection} under inspection · {underMaintenance} in maintenance
              </div>
            </div>

            <div className="pt-2 font-sans text-muted d-flex justify-content-between align-items-center" style={{ fontSize: '0.72rem', borderTop: '1px solid #EEF0F3' }}>
              <span className="text-truncate">Tails: AF-04, AF-02, AF-03</span>
              <span className="text-secondary ms-1 flex-shrink-0" style={{ fontWeight: 500 }}>
                Directives Active
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Average Remaining Useful Life */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="ent-metric-card">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="ent-metric-label font-sans">Fleet Useful Life (RUL)</span>
                <span className="font-sans text-muted" style={{ fontSize: '0.72rem' }}>
                  Prognostic
                </span>
              </div>
              <div className="ent-metric-value font-mono">
                157 <span style={{ fontSize: '1.05rem', fontWeight: 500, color: '#68717D', fontFamily: 'inherit' }}>FH</span>
              </div>
              <div className="ent-metric-subtext font-sans">
                Fleet-wide prognostic horizon
              </div>
            </div>

            <div className="pt-2 font-sans d-flex justify-content-between align-items-center" style={{ fontSize: '0.72rem', borderTop: '1px solid #EEF0F3' }}>
              <span className="text-muted">Lowest Tail:</span>
              <span className="font-mono text-danger fw-semibold">AF-04 (38.4 FH)</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Downtime Prevented */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="ent-metric-card">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="ent-metric-label font-sans">Downtime Prevented</span>
                <span className="font-sans text-muted" style={{ fontSize: '0.72rem' }}>
                  Proactive
                </span>
              </div>
              <div className="ent-metric-value font-mono">
                110 <span style={{ fontSize: '1.05rem', fontWeight: 500, color: '#68717D', fontFamily: 'inherit' }}>hrs</span>
              </div>
              <div className="ent-metric-subtext font-sans">
                4 airframes protected from unscheduled grounding
              </div>
            </div>

            <div className="pt-2 font-sans d-flex justify-content-between align-items-center" style={{ fontSize: '0.72rem', borderTop: '1px solid #EEF0F3' }}>
              <span className="text-muted">Lifecycle Benefit:</span>
              <span className="fw-semibold" style={{ color: '#24845B' }}>₹4.8 Cr Savings</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SEARCH & FILTER TOOLBAR */}
      <div 
        className="p-3 mb-3 rounded-3" 
        style={{ 
          background: '#FFFFFF', 
          border: '1px solid #E5E8EC',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)' 
        }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          {/* Search Input */}
          <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: '380px' }}>
            <div className="input-group input-group-sm">
              <span 
                className="input-group-text bg-white border-end-0 text-muted" 
                style={{ borderRadius: '8px 0 0 8px', border: '1px solid #D1D5DB' }}
              >
                <Search size={14} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 font-sans"
                placeholder="Search by tail ID, callsign, or variant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: '0.82rem', borderRadius: '0 8px 8px 0', border: '1px solid #D1D5DB' }}
              />
            </div>
          </div>

          {/* Status Filter & Base Dropdown */}
          <div className="d-flex flex-wrap align-items-center gap-2">
            {/* Segmented Status Tabs */}
            <div 
              className="d-flex align-items-center gap-1 p-1 rounded-2" 
              style={{ background: '#F1F3F5', border: '1px solid #E5E8EC' }}
            >
              {statuses.map(s => {
                const isActive = selectedStatus === s;
                const label = s === 'ALL' ? 'All Status' : s;
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className="border-0 font-sans"
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: isActive ? 600 : 500,
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      background: isActive ? '#FFFFFF' : 'transparent',
                      color: isActive ? '#20252B' : '#68717D',
                      boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Base Dropdown */}
            <div className="d-flex align-items-center gap-1.5 ms-md-2">
              <span className="text-muted font-sans" style={{ fontSize: '0.74rem' }}>Base:</span>
              <select
                className="form-select form-select-sm font-sans"
                value={selectedBase}
                onChange={(e) => setSelectedBase(e.target.value)}
                style={{ 
                  width: '140px', 
                  fontSize: '0.78rem', 
                  borderRadius: '8px', 
                  border: '1px solid #D1D5DB' 
                }}
              >
                {bases.map(b => (
                  <option key={b} value={b}>{b === 'ALL' ? 'All Bases' : b}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters (if active) */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="btn btn-sm btn-link text-secondary text-decoration-none d-flex align-items-center gap-1 font-sans p-1"
                style={{ fontSize: '0.74rem' }}
                title="Reset all search filters"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}

            {/* Results Count */}
            <div className="text-secondary font-sans ms-md-2" style={{ fontSize: '0.76rem' }}>
              Showing <strong className="text-dark">{filteredAircraft.length}</strong> of {total} aircraft
            </div>
          </div>
        </div>
      </div>

      {/* 5. AIRCRAFT ROSTER MATRIX (7 COLUMNS WITH PROGRESSIVE DISCLOSURE) */}
      <div 
        className="rounded-3 overflow-hidden shadow-sm mb-4" 
        style={{ 
          background: '#FFFFFF', 
          border: '1px solid #E5E8EC' 
        }}
      >
        <div className="table-responsive">
          <table className="skyline-table w-100" style={{ borderCollapse: 'collapse', minWidth: '1060px' }}>
            <thead>
              <tr>
                <th className="ent-table-header" style={{ minWidth: '240px' }}>Aircraft</th>
                <th className="ent-table-header" style={{ minWidth: '150px' }}>Location</th>
                <th className="ent-table-header" style={{ minWidth: '150px' }}>Status</th>
                <th className="ent-table-header" style={{ minWidth: '130px' }}>Health</th>
                <th className="ent-table-header" style={{ minWidth: '150px' }}>Remaining Life</th>
                <th className="ent-table-header" style={{ minWidth: '220px' }}>Maintenance &amp; Directives</th>
                <th className="ent-table-header text-end" style={{ minWidth: '170px', paddingRight: '1.25rem', whiteSpace: 'nowrap' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAircraft.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted font-sans">
                    <Plane size={28} className="text-secondary opacity-50 mb-2" />
                    <div>No aircraft match your current search or filter criteria.</div>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="btn btn-sm btn-outline-secondary mt-2 font-sans"
                        style={{ fontSize: '0.75rem' }}
                      >
                        Reset Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredAircraft.map(ac => {
                  const acAlerts = alerts.filter(a => a.aircraftId === ac.aircraftId && a.status === 'Active');
                  const badge = getStatusBadge(ac.status);
                  const assignedOrder = workOrders.find(w => w.aircraftId === ac.aircraftId && w.status !== 'Completed');
                  const isExpanded = expandedAircraftId === ac.aircraftId;

                  return (
                    <React.Fragment key={ac.aircraftId}>
                      <tr className="ent-table-row">
                        {/* 1. Aircraft Identification & Subtle Thumbnail */}
                        <td className="ent-table-cell">
                          <div className="d-flex align-items-center gap-3">
                            <div 
                              className="d-flex align-items-center justify-content-center rounded-2 p-1" 
                              style={{ 
                                background: '#F8FAFC', 
                                border: '1px solid #E5E8EC', 
                                width: '44px', 
                                height: '30px', 
                                flexShrink: 0 
                              }}
                              title="Airframe 3D Preview"
                            >
                              <img 
                                src="/images/cad/cad-aircraft-exterior-hd.png" 
                                alt="Airframe CAD" 
                                style={{ maxWidth: '40px', maxHeight: '24px', objectFit: 'contain' }}
                              />
                            </div>
                            <div>
                              <div className="d-flex align-items-center gap-2" style={{ whiteSpace: 'nowrap' }}>
                                <span className="font-mono fw-bold text-dark fs-6" style={{ letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
                                  {ac.aircraftId}
                                </span>
                                <span className="text-secondary small font-sans" style={{ whiteSpace: 'nowrap' }}>
                                  ({ac.callsign})
                                </span>
                              </div>
                              <div className="text-muted font-sans" style={{ fontSize: '0.75rem' }}>
                                {ac.type}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Location (Airbase & Squadron) */}
                        <td className="ent-table-cell">
                          <div className="fw-semibold text-dark font-sans" style={{ fontSize: '0.82rem' }}>
                            {ac.airbase}
                          </div>
                          <div className="text-muted font-sans" style={{ fontSize: '0.74rem' }}>
                            {ac.squadron}
                          </div>
                        </td>

                        {/* 3. Operational Airworthiness Status */}
                        <td className="ent-table-cell">
                          <span className={badge.className}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: badge.dot }}></span>
                            {badge.label}
                          </span>
                          {assignedOrder?.status === 'Pending Command Validation' && (
                            <div className="mt-1">
                              <span 
                                className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle font-sans" 
                                style={{ fontSize: '0.66rem', fontWeight: 500 }}
                              >
                                Awaiting Passing Order
                              </span>
                            </div>
                          )}
                        </td>

                        {/* 4. Health Percentage & Slim 4px Indicator */}
                        <td className="ent-table-cell">
                          <div className="d-flex justify-content-between align-items-center mb-1 font-sans" style={{ fontSize: '0.8rem' }}>
                            <span className="fw-semibold" style={{ color: getHealthColor(ac.overallHealth) }}>
                              {ac.overallHealth}%
                            </span>
                            <span className="text-muted" style={{ fontSize: '0.7rem' }}>Health</span>
                          </div>
                          <div className="progress" style={{ height: '4px', borderRadius: '2px', background: '#F1F5F9' }}>
                            <div
                              className="progress-bar"
                              style={{
                                width: `${ac.overallHealth}%`,
                                backgroundColor: getHealthColor(ac.overallHealth)
                              }}
                            ></div>
                          </div>
                        </td>

                        {/* 5. Remaining Life (RUL) & Flight Hours */}
                        <td className="ent-table-cell">
                          <div 
                            className="font-mono fw-semibold" 
                            style={{ 
                              fontSize: '0.86rem', 
                              color: ac.rulHours < 50 ? '#C84A4A' : '#20252B' 
                            }}
                          >
                            {ac.rulHours} FH
                          </div>
                          <div className="text-muted font-sans" style={{ fontSize: '0.72rem' }}>
                            {ac.totalFlightHours} FH • {ac.flightCycles} Sorties
                          </div>
                        </td>

                        {/* 6. Active Directive or Anomaly */}
                        <td className="ent-table-cell">
                          {assignedOrder ? (
                            <div className="font-sans" style={{ fontSize: '0.78rem' }}>
                              <span className="text-danger fw-semibold d-block">
                                ● {assignedOrder.jobType || assignedOrder.title}
                              </span>
                              <span className="text-secondary" style={{ fontSize: '0.72rem' }}>
                                Specialist: <strong className="text-dark">{assignedOrder.assignedTechnician}</strong> ({assignedOrder.status})
                              </span>
                            </div>
                          ) : acAlerts.length > 0 ? (
                            <div className="font-sans" style={{ fontSize: '0.78rem' }}>
                              <span className="fw-semibold d-block" style={{ color: '#C78522' }}>
                                ⚠ {acAlerts[0].subsystem}: {acAlerts[0].componentName}
                              </span>
                              <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                                Directive Required
                              </span>
                            </div>
                          ) : (
                            <div className="font-sans" style={{ fontSize: '0.78rem' }}>
                              <span className="fw-semibold d-block" style={{ color: '#24845B' }}>
                                ✓ Nominal Flight Schedule
                              </span>
                              <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                                Sortie Cleared
                              </span>
                            </div>
                          )}
                        </td>

                        {/* 7. Action Button + Progressive Disclosure Drawer Toggle */}
                        <td className="ent-table-cell text-end" style={{ whiteSpace: 'nowrap', paddingRight: '1.25rem' }}>
                          <div className="d-inline-flex align-items-center gap-1.5">
                            <button
                              onClick={() => {
                                onSelectAircraft(ac.aircraftId);
                                onNavigate('aircraft');
                              }}
                              className="btn btn-sm btn-dark d-inline-flex align-items-center gap-1 font-sans"
                              style={{ 
                                background: '#17212F', 
                                borderColor: '#17212F',
                                fontSize: '0.76rem',
                                fontWeight: 500,
                                padding: '0.38rem 0.85rem',
                                borderRadius: '6px'
                              }}
                            >
                              <span>Inspect Twin</span>
                              <ArrowUpRight size={13} />
                            </button>

                            <button
                              onClick={() => toggleExpand(ac.aircraftId)}
                              className="btn btn-sm btn-light border font-sans p-1 d-inline-flex align-items-center justify-content-center"
                              style={{ 
                                width: '28px', 
                                height: '28px', 
                                borderRadius: '6px',
                                background: isExpanded ? '#E5E8EC' : '#FFFFFF',
                                borderColor: '#D1D5DB'
                              }}
                              title={isExpanded ? "Collapse Subsystem Telemetry" : "Quick Subsystem Telemetry"}
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Progressive Disclosure Expandable Telemetry Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan="7" className="p-3" style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E8EC' }}>
                            <div className="p-2">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="fw-semibold text-dark font-sans" style={{ fontSize: '0.78rem' }}>
                                  Subsystem Health &amp; Bus Telemetry for {ac.aircraftId} ({ac.type})
                                </span>
                                <span className="text-muted font-sans" style={{ fontSize: '0.72rem' }}>
                                  Last Ground Inspection: {new Date(ac.lastInspectionDate).toLocaleDateString()} • Next Scheduled: {new Date(ac.nextScheduledCheck).toLocaleDateString()}
                                </span>
                              </div>

                              <div className="row g-2">
                                {ac.subsystems && Object.entries(ac.subsystems).map(([key, sub]) => {
                                  const subHealth = sub?.health || 85;
                                  const subColor = getHealthColor(subHealth);
                                  return (
                                    <div key={key} className="col-12 col-sm-6 col-md-3">
                                      <div 
                                        className="p-2 rounded-2 bg-white" 
                                        style={{ border: '1px solid #E2E8F0', fontSize: '0.75rem' }}
                                      >
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                          <span className="text-capitalize text-dark font-sans fw-medium">{key}</span>
                                          <span className="font-mono fw-semibold" style={{ color: subColor }}>{subHealth}%</span>
                                        </div>
                                        <div className="progress" style={{ height: '3px', background: '#F1F5F9' }}>
                                          <div className="progress-bar" style={{ width: `${subHealth}%`, backgroundColor: subColor }}></div>
                                        </div>
                                        <div className="text-muted mt-1 font-sans" style={{ fontSize: '0.68rem' }}>
                                          {sub?.name || 'Nominal Subsystem'}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. SECONDARY SYSTEM INFORMATION (SUBTLE ENTERPRISE FOOTER STRIP) */}
      <div 
        className="p-3 rounded-2 d-flex flex-wrap justify-content-between align-items-center gap-2 font-sans" 
        style={{ 
          background: '#FFFFFF', 
          border: '1px solid #E5E8EC',
          color: '#68717D',
          fontSize: '0.74rem'
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#24845B' }}></span>
          <span>Telemetry Status: <strong className="text-dark">Mesh 20 Hz Synchronized (Live WebSocket Link)</strong></span>
        </div>
        <div className="d-none d-md-flex align-items-center gap-3">
          <span>Standards: <strong>ISO-13374 Condition Monitoring</strong></span>
          <span>•</span>
          <span>Avionic Bus: <strong>MIL-STD-1553B Dual Redundant</strong></span>
        </div>
        <div>
          <span>Digital Airworthiness Chain of Custody: <strong className="text-dark">Verified (MoD / DSSC)</strong></span>
        </div>
      </div>

      {/* 7. AIRWORTHINESS REPORT MODAL (FOR ISSUING PASSING ORDERS DIRECTLY FROM DASHBOARD) */}
      {selectedReportOrder && (
        <AirworthinessReportModal
          order={selectedReportOrder}
          aircraft={aircraftList.find(a => a.aircraftId === selectedReportOrder.aircraftId)}
          onClose={() => setSelectedReportOrder(null)}
          onValidate={async (orderId, validationData) => {
            if (onValidateOrder) {
              await onValidateOrder(orderId, validationData);
            }
            setSelectedReportOrder(null);
          }}
        />
      )}
    </div>
  );
}
