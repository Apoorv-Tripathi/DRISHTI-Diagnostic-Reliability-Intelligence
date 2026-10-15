import React, { useState } from 'react';
import {
  Plane,
  AlertTriangle,
  Search,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  UserCheck,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Shield,
  TrendingUp,
  Clock,
  Activity
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

  // Fleet metrics
  const total = aircraftList.length;
  const missionCapable = aircraftList.filter(a => a.status === 'Mission Capable').length;
  const underInspection = aircraftList.filter(a => a.status === 'Under Inspection').length;
  const underMaintenance = aircraftList.filter(a => a.status === 'Under Maintenance' || a.status === 'Awaiting Spares').length;
  const availabilityRate = total > 0 ? +((missionCapable / total) * 100).toFixed(1) : 0;

  // Pending validation orders
  const pendingValidationOrders = workOrders.filter(w => w.status === 'Pending Command Validation');

  const bases = ['ALL', ...new Set(aircraftList.map(a => a.airbase))];
  const statuses = ['ALL', 'Mission Capable', 'Under Inspection', 'Under Maintenance'];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Mission Capable':
        return { label: 'Mission Capable', bg: '#ECFDF5', color: '#065F46', dot: '#059669' };
      case 'Under Inspection':
        return { label: 'Under Inspection', bg: '#FFFBEB', color: '#92400E', dot: '#D97706' };
      case 'Under Maintenance':
        return { label: 'Under Maintenance', bg: '#FEF2F2', color: '#991B1B', dot: '#DC2626' };
      case 'Awaiting Spares':
        return { label: 'Awaiting Spares', bg: '#F3F4F6', color: '#4B5563', dot: '#6B7280' };
      default:
        return { label: status, bg: '#F3F4F6', color: '#4B5563', dot: '#6B7280' };
    }
  };

  const getHealthColor = (health) => {
    if (health >= 85) return '#059669';
    if (health >= 70) return '#D97706';
    return '#DC2626';
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

  // Shared card style
  const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '10px',
    padding: '1.25rem 1.4rem',
    minHeight: '138px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-3" style={{ maxWidth: '1400px' }}>

      {/* ── Page Header ── */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4 pt-1">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
              Operations / Fleet Control
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              fontSize: '0.72rem', color: '#059669', fontWeight: 500
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#059669' }}></span>
              Live
            </span>
          </div>
          <h1 style={{
            fontSize: '1.5rem', fontWeight: 700, color: '#111827',
            letterSpacing: '-0.025em', lineHeight: 1.3, marginBottom: '0.3rem'
          }}>
            Fleet Availability Dashboard
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0, maxWidth: '600px', lineHeight: 1.5 }}>
            Real-time airframe health, predictive life forecasts, and maintenance coordination across active wings.
          </p>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2 pt-1">
          {onOpenAssignJobModal && (
            <button
              onClick={onOpenAssignJobModal}
              className="btn d-flex align-items-center gap-2"
              style={{
                background: '#111827', color: '#FFFFFF',
                fontSize: '0.8rem', fontWeight: 600,
                padding: '0.5rem 1rem', borderRadius: '8px', border: 'none'
              }}
            >
              <UserCheck size={14} />
              <span>Assign Directive</span>
            </button>
          )}
          <button
            onClick={() => setSelectedStatus(selectedStatus === 'Under Inspection' ? 'ALL' : 'Under Inspection')}
            className="btn d-flex align-items-center gap-2"
            style={{
              fontSize: '0.8rem', fontWeight: 500,
              padding: '0.5rem 1rem', borderRadius: '8px',
              background: selectedStatus === 'Under Inspection' ? '#FEF2F2' : '#FFFFFF',
              border: `1px solid ${selectedStatus === 'Under Inspection' ? '#FECACA' : '#E5E7EB'}`,
              color: selectedStatus === 'Under Inspection' ? '#DC2626' : '#374151'
            }}
          >
            <AlertTriangle size={14} />
            <span>Inspections ({underInspection})</span>
          </button>
        </div>
      </div>

      {/* ── Command Validation Inbox ── */}
      {pendingValidationOrders.length > 0 ? (
        <div
          className="mb-4 rounded-3"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderLeft: '3px solid #D97706',
            overflow: 'hidden'
          }}
        >
          <div className="px-3 py-2 d-flex flex-wrap justify-content-between align-items-center"
            style={{ borderBottom: '1px solid #F3F4F6' }}>
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#D97706' }}></span>
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#111827' }}>
                Action Required
              </span>
              <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                — {pendingValidationOrders.length} inspection report{pendingValidationOrders.length > 1 ? 's' : ''} awaiting review
              </span>
            </div>
          </div>

          <div className="d-flex flex-column">
            {pendingValidationOrders.map(order => {
              const targetAc = aircraftList.find(a => a.aircraftId === order.aircraftId);
              return (
                <div
                  key={order.orderId}
                  className="px-3 py-3 d-flex flex-wrap justify-content-between align-items-center gap-3"
                  style={{ borderBottom: '1px solid #F9FAFB' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-2"
                      style={{
                        width: '36px', height: '36px',
                        background: '#F9FAFB', border: '1px solid #E5E7EB',
                        color: '#374151', flexShrink: 0
                      }}
                    >
                      <FileText size={16} />
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>
                          {order.aircraftId}
                        </span>
                        <span style={{ color: '#9CA3AF', fontSize: '0.78rem' }}>
                          {targetAc?.type || order.aircraftType}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#6B7280', marginTop: '2px' }}>
                        Technician: <strong style={{ color: '#374151' }}>{order.assignedTechnician || 'Assigned'}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <div className="text-end d-none d-md-block">
                      <span style={{ fontSize: '0.7rem', color: '#9CA3AF', display: 'block' }}>Recommendation</span>
                      <span style={{
                        fontWeight: 600, fontSize: '0.78rem',
                        color: order.technicianRecommendation === 'MAINTENANCE_REQUIRED' ? '#DC2626' : '#059669'
                      }}>
                        {order.technicianRecommendation === 'MAINTENANCE_REQUIRED' ? 'Maintenance Required' : 'Cleared for Sortie'}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedReportOrder(order)}
                      className="btn btn-sm d-flex align-items-center gap-1"
                      style={{
                        background: '#111827', color: '#FFFFFF', border: 'none',
                        fontSize: '0.76rem', fontWeight: 600,
                        padding: '0.42rem 0.9rem', borderRadius: '6px'
                      }}
                    >
                      <CheckSquare size={13} />
                      <span>Review & Approve</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          className="mb-4 d-flex align-items-center gap-2 px-3 py-2 rounded-2"
          style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', fontSize: '0.8rem' }}
        >
          <CheckCircle2 size={15} color="#059669" />
          <span style={{ color: '#6B7280' }}>
            All directives validated — no pending approvals.
          </span>
        </div>
      )}

      {/* ── Key Metrics ── */}
      <div className="row g-3 mb-4">
        {/* Fleet Readiness */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div style={cardStyle}>
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#6B7280' }}>Fleet Readiness</span>
                <Shield size={16} color="#9CA3AF" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', lineHeight: 1, letterSpacing: '-0.03em' }}>
                {availabilityRate}<span style={{ fontSize: '1rem', fontWeight: 500, color: '#9CA3AF' }}>%</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#9CA3AF', margin: '0.4rem 0 0' }}>
                {missionCapable} of {total} aircraft mission capable
              </p>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ height: '4px', background: '#F3F4F6', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${availabilityRate}%`, borderRadius: '2px',
                  background: availabilityRate >= 60 ? '#059669' : '#DC2626',
                  transition: 'width 0.4s ease'
                }}></div>
              </div>
              <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                <span style={{ color: availabilityRate >= 60 ? '#059669' : '#DC2626', fontWeight: 500 }}>
                  {availabilityRate >= 60 ? 'Operational' : 'Below Threshold'}
                </span>
                <span>{underInspection + underMaintenance} grounded</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attention Required */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div style={cardStyle}>
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#6B7280' }}>Attention Required</span>
                <AlertTriangle size={16} color="#9CA3AF" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', lineHeight: 1, letterSpacing: '-0.03em' }}>
                {underInspection + underMaintenance}<span style={{ fontSize: '1rem', fontWeight: 500, color: '#9CA3AF', marginLeft: '4px' }}>aircraft</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#9CA3AF', margin: '0.4rem 0 0' }}>
                {underInspection} inspecting · {underMaintenance} in maintenance
              </p>
            </div>
            <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid #F3F4F6' }}>
              <div className="d-flex justify-content-between" style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                <span>Active directives assigned</span>
                <span style={{ fontWeight: 500, color: '#D97706' }}>{underInspection + underMaintenance} open</span>
              </div>
            </div>
          </div>
        </div>

        {/* Average Remaining Life */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div style={cardStyle}>
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#6B7280' }}>Avg. Remaining Life</span>
                <TrendingUp size={16} color="#9CA3AF" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', lineHeight: 1, letterSpacing: '-0.03em' }}>
                157<span style={{ fontSize: '1rem', fontWeight: 500, color: '#9CA3AF', marginLeft: '4px' }}>hours</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#9CA3AF', margin: '0.4rem 0 0' }}>
                Fleet-wide prognostic forecast
              </p>
            </div>
            <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid #F3F4F6' }}>
              <div className="d-flex justify-content-between" style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                <span>Lowest aircraft</span>
                <span style={{ fontWeight: 600, color: '#DC2626', fontFamily: 'var(--font-mono)' }}>AF-04 · 38.4 hrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Downtime Prevented */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div style={cardStyle}>
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#6B7280' }}>Downtime Prevented</span>
                <Clock size={16} color="#9CA3AF" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', lineHeight: 1, letterSpacing: '-0.03em' }}>
                110<span style={{ fontSize: '1rem', fontWeight: 500, color: '#9CA3AF', marginLeft: '4px' }}>hours</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#9CA3AF', margin: '0.4rem 0 0' }}>
                Proactive maintenance savings
              </p>
            </div>
            <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid #F3F4F6' }}>
              <div className="d-flex justify-content-between" style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                <span>Cost savings</span>
                <span style={{ fontWeight: 600, color: '#059669' }}>₹4.8 Cr estimated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Filters ── */}
      <div
        className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3 px-1"
      >
        {/* Search */}
        <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: '340px' }}>
          <div className="position-relative w-100">
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Search aircraft..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '0.45rem 0.75rem 0.45rem 2rem',
                fontSize: '0.8rem', border: '1px solid #E5E7EB',
                borderRadius: '8px', outline: 'none', background: '#FFFFFF',
                color: '#374151'
              }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="d-flex flex-wrap align-items-center gap-2">
          <div
            className="d-flex align-items-center gap-1 p-1 rounded-2"
            style={{ background: '#F3F4F6' }}
          >
            {statuses.map(s => {
              const isActive = selectedStatus === s;
              const label = s === 'ALL' ? 'All' : s;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  style={{
                    fontSize: '0.74rem', fontWeight: isActive ? 600 : 400,
                    padding: '0.28rem 0.7rem', borderRadius: '6px', border: 'none',
                    background: isActive ? '#FFFFFF' : 'transparent',
                    color: isActive ? '#111827' : '#6B7280',
                    boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <select
            value={selectedBase}
            onChange={(e) => setSelectedBase(e.target.value)}
            style={{
              fontSize: '0.78rem', padding: '0.38rem 0.6rem',
              border: '1px solid #E5E7EB', borderRadius: '8px',
              background: '#FFFFFF', color: '#374151', outline: 'none',
              cursor: 'pointer'
            }}
          >
            {bases.map(b => (
              <option key={b} value={b}>{b === 'ALL' ? 'All Bases' : b}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              style={{
                fontSize: '0.72rem', color: '#6B7280', background: 'none',
                border: 'none', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '3px', padding: '0.25rem 0.4rem'
              }}
            >
              <RotateCcw size={11} />
              <span>Clear</span>
            </button>
          )}

          <span style={{ fontSize: '0.74rem', color: '#9CA3AF' }}>
            {filteredAircraft.length} of {total}
          </span>
        </div>
      </div>

      {/* ── Aircraft Roster Table ── */}
      <div
        className="rounded-3 overflow-hidden mb-4"
        style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
      >
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1020px' }}>
            <thead>
              <tr>
                {['Aircraft', 'Station', 'Status', 'Health', 'Remaining Life', 'Active Directive', ''].map((h, i) => (
                  <th
                    key={h || 'action'}
                    style={{
                      background: '#FAFAFA', padding: '0.7rem 1.1rem',
                      fontSize: '0.72rem', fontWeight: 600, color: '#9CA3AF',
                      borderBottom: '1px solid #E5E7EB',
                      textAlign: i === 6 ? 'right' : 'left',
                      letterSpacing: '0.02em'
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAircraft.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9CA3AF' }}>
                    <Plane size={24} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '0.85rem' }}>No aircraft match your filters.</div>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        style={{
                          marginTop: '0.5rem', fontSize: '0.75rem',
                          background: 'none', border: '1px solid #E5E7EB',
                          padding: '0.3rem 0.8rem', borderRadius: '6px',
                          cursor: 'pointer', color: '#6B7280'
                        }}
                      >
                        Clear Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredAircraft.map(ac => {
                  const acAlerts = alerts.filter(a => a.aircraftId === ac.aircraftId && a.status === 'Active');
                  const statusStyle = getStatusStyle(ac.status);
                  const assignedOrder = workOrders.find(w => w.aircraftId === ac.aircraftId && w.status !== 'Completed');
                  const isExpanded = expandedAircraftId === ac.aircraftId;
                  const healthColor = getHealthColor(ac.overallHealth);

                  return (
                    <React.Fragment key={ac.aircraftId}>
                      <tr
                        style={{
                          borderBottom: '1px solid #F3F4F6',
                          transition: 'background 0.12s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#FAFBFC'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        {/* Aircraft */}
                        <td style={{ padding: '0.85rem 1.1rem', verticalAlign: 'middle' }}>
                          <div className="d-flex align-items-center gap-3">
                            <div style={{
                              width: '40px', height: '28px', background: '#F9FAFB',
                              border: '1px solid #E5E7EB', borderRadius: '6px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <img
                                src="/images/cad/cad-aircraft-exterior-hd.png"
                                alt=""
                                style={{ maxWidth: '36px', maxHeight: '22px', objectFit: 'contain' }}
                              />
                            </div>
                            <div>
                              <div className="d-flex align-items-center gap-2">
                                <span style={{
                                  fontFamily: 'var(--font-mono)', fontWeight: 700,
                                  color: '#111827', fontSize: '0.88rem', letterSpacing: '0.01em'
                                }}>
                                  {ac.aircraftId}
                                </span>
                                <span style={{ color: '#9CA3AF', fontSize: '0.76rem' }}>
                                  {ac.callsign}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: '1px' }}>
                                {ac.type}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Station */}
                        <td style={{ padding: '0.85rem 1.1rem', verticalAlign: 'middle' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#374151' }}>{ac.airbase}</div>
                          <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '1px' }}>{ac.squadron}</div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '0.85rem 1.1rem', verticalAlign: 'middle' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            fontSize: '0.72rem', fontWeight: 500, padding: '0.2rem 0.55rem',
                            borderRadius: '999px', background: statusStyle.bg, color: statusStyle.color
                          }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusStyle.dot }}></span>
                            {statusStyle.label}
                          </span>
                          {assignedOrder?.status === 'Pending Command Validation' && (
                            <div style={{ marginTop: '4px' }}>
                              <span style={{
                                fontSize: '0.65rem', color: '#D97706', fontWeight: 500
                              }}>
                                Pending approval
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Health */}
                        <td style={{ padding: '0.85rem 1.1rem', verticalAlign: 'middle', minWidth: '100px' }}>
                          <div className="d-flex align-items-baseline gap-1" style={{ marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: healthColor }}>
                              {ac.overallHealth}%
                            </span>
                          </div>
                          <div style={{ height: '3px', background: '#F3F4F6', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%', width: `${ac.overallHealth}%`,
                              background: healthColor, borderRadius: '2px',
                              transition: 'width 0.3s ease'
                            }}></div>
                          </div>
                        </td>

                        {/* Remaining Life */}
                        <td style={{ padding: '0.85rem 1.1rem', verticalAlign: 'middle' }}>
                          <div style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.86rem', fontWeight: 600,
                            color: ac.rulHours < 50 ? '#DC2626' : '#111827'
                          }}>
                            {ac.rulHours} hrs
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '1px' }}>
                            {ac.totalFlightHours} FH · {ac.flightCycles} cycles
                          </div>
                        </td>

                        {/* Active Directive */}
                        <td style={{ padding: '0.85rem 1.1rem', verticalAlign: 'middle' }}>
                          {assignedOrder ? (
                            <div>
                              <div style={{ fontSize: '0.78rem', fontWeight: 500, color: '#DC2626' }}>
                                {assignedOrder.jobType || assignedOrder.title}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '2px' }}>
                                {assignedOrder.assignedTechnician} · {assignedOrder.status}
                              </div>
                            </div>
                          ) : acAlerts.length > 0 ? (
                            <div>
                              <div style={{ fontSize: '0.78rem', fontWeight: 500, color: '#D97706' }}>
                                {acAlerts[0].subsystem}: {acAlerts[0].componentName}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '2px' }}>
                                Needs assignment
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div style={{ fontSize: '0.78rem', fontWeight: 500, color: '#059669' }}>
                                All systems nominal
                              </div>
                              <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '2px' }}>
                                Sortie cleared
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '0.85rem 1.1rem', verticalAlign: 'middle', textAlign: 'right' }}>
                          <div className="d-inline-flex align-items-center gap-1">
                            <button
                              onClick={() => {
                                onSelectAircraft(ac.aircraftId);
                                onNavigate('aircraft');
                              }}
                              style={{
                                background: '#111827', color: '#FFFFFF', border: 'none',
                                fontSize: '0.74rem', fontWeight: 500,
                                padding: '0.35rem 0.75rem', borderRadius: '6px',
                                cursor: 'pointer', display: 'inline-flex',
                                alignItems: 'center', gap: '4px'
                              }}
                            >
                              Inspect Twin
                              <ArrowUpRight size={12} />
                            </button>
                            <button
                              onClick={() => toggleExpand(ac.aircraftId)}
                              style={{
                                width: '28px', height: '28px', borderRadius: '6px',
                                border: '1px solid #E5E7EB',
                                background: isExpanded ? '#F3F4F6' : '#FFFFFF',
                                cursor: 'pointer', display: 'inline-flex',
                                alignItems: 'center', justifyContent: 'center',
                                color: '#6B7280'
                              }}
                              title={isExpanded ? 'Collapse' : 'Subsystem Details'}
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Subsystem Detail Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan="7" style={{ padding: '1rem 1.1rem', background: '#FAFBFC', borderBottom: '1px solid #E5E7EB' }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>
                                Subsystem Health — {ac.aircraftId}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                                Last inspected: {new Date(ac.lastInspectionDate).toLocaleDateString()} · Next: {new Date(ac.nextScheduledCheck).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="row g-2">
                              {ac.subsystems && Object.entries(ac.subsystems).map(([key, sub]) => {
                                const subHealth = sub?.health || 85;
                                const subColor = getHealthColor(subHealth);
                                const formatName = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                                return (
                                  <div key={key} className="col-6 col-md-3 col-lg-2">
                                    <div style={{
                                      padding: '0.65rem 0.75rem', borderRadius: '8px',
                                      background: '#FFFFFF', border: '1px solid #E5E7EB'
                                    }}>
                                      <div className="d-flex justify-content-between align-items-center mb-1">
                                        <span style={{ fontSize: '0.72rem', color: '#374151', fontWeight: 500 }}>{formatName}</span>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: subColor }}>{subHealth}%</span>
                                      </div>
                                      <div style={{ height: '3px', background: '#F3F4F6', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${subHealth}%`, background: subColor, borderRadius: '2px' }}></div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
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

      {/* ── Footer Status Bar ── */}
      <div
        className="d-flex flex-wrap justify-content-between align-items-center gap-2 px-3 py-2 rounded-2"
        style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', fontSize: '0.72rem', color: '#9CA3AF' }}
      >
        <div className="d-flex align-items-center gap-2">
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#059669' }}></span>
          <span>Telemetry connected · 20 Hz refresh</span>
        </div>
        <div className="d-none d-md-block">
          Airworthiness chain of custody verified
        </div>
      </div>

      {/* ── Airworthiness Report Modal ── */}
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
