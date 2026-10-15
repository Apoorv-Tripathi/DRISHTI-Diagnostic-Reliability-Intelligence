import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  FileText,
  CheckSquare,
  UserCheck,
  User,
  ShieldCheck,
  ArrowRight,
  Filter,
  Check,
  Sparkles,
  Search,
  RotateCcw,
  Plane,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
  Info
} from 'lucide-react';
import AirworthinessReportModal from '../components/AirworthinessReportModal.jsx';

export default function MaintenanceHistory({
  workOrders = [],
  aircraftList = [],
  usersList = [],
  onOpenWorkOrderModal,
  onCompleteWorkOrder,
  onOpenAssignJobModal,
  onValidateOrder
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterTech, setFilterTech] = useState('ALL');
  const [filterAircraft, setFilterAircraft] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReportOrder, setSelectedReportOrder] = useState(null);

  // Compute counts
  const totalOrders = workOrders.length;
  const activeOrders = workOrders.filter(w => w.status !== 'Completed');
  const pendingOrders = workOrders.filter(w => w.status === 'Pending Command Validation');
  const inProgressOrders = workOrders.filter(w => w.status === 'In Progress');
  const assignedOrders = workOrders.filter(w => w.status === 'Assigned');
  const completedOrders = workOrders.filter(w => w.status === 'Completed');
  const highPriorityOrders = workOrders.filter(w => (w.priority === 'High' || w.priority === 'Critical') && w.status !== 'Completed');

  // Total downtime hours saved
  const totalDowntimeSaved = workOrders.reduce((acc, curr) => acc + (curr.downtimeSavedEstimateHours || 0), 0);

  // Filtered orders
  const filteredOrders = workOrders.filter(w => {
    // Search match
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      w.orderId?.toLowerCase().includes(searchLower) ||
      w.aircraftId?.toLowerCase().includes(searchLower) ||
      (w.title || w.jobType || '').toLowerCase().includes(searchLower) ||
      (w.assignedTechnician || '').toLowerCase().includes(searchLower) ||
      (w.station || '').toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    // Status match
    const matchesStatus =
      filterStatus === 'ALL'
        ? true
        : filterStatus === 'Pending Validation'
        ? w.status === 'Pending Command Validation'
        : filterStatus === 'Active'
        ? w.status !== 'Completed'
        : filterStatus === 'High Priority'
        ? (w.priority === 'High' || w.priority === 'Critical') && w.status !== 'Completed'
        : w.status === filterStatus;

    if (!matchesStatus) return false;

    // Tech match
    const matchesTech = filterTech === 'ALL' || w.assignedTechnician?.toLowerCase().includes(filterTech.toLowerCase());
    if (!matchesTech) return false;

    // Aircraft match
    const matchesAircraft = filterAircraft === 'ALL' || w.aircraftId === filterAircraft;
    return matchesAircraft;
  });

  // Soft restrained badges
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return {
          label: 'Certified Airworthy',
          dot: '#059669',
          bg: '#ECFDF5',
          color: '#065F46',
          border: '#A7F3D0'
        };
      case 'Pending Command Validation':
        return {
          label: 'Awaiting Passing Order',
          dot: '#D97706',
          bg: '#FFFBEB',
          color: '#92400E',
          border: '#FDE68A'
        };
      case 'Maintenance Directive Issued':
        return {
          label: 'Depot Overhaul Mandated',
          dot: '#EA580C',
          bg: '#FFF7ED',
          color: '#9A3412',
          border: '#FED7AA'
        };
      case 'In Progress':
        return {
          label: 'Flight-Line In Progress',
          dot: '#D97706',
          bg: '#FFFBEB',
          color: '#92400E',
          border: '#FDE68A'
        };
      case 'Assigned':
        return {
          label: 'Assigned to Bay',
          dot: '#2563EB',
          bg: '#EFF6FF',
          color: '#1E40AF',
          border: '#BFDBFE'
        };
      case 'Scheduled':
        return {
          label: 'Scheduled',
          dot: '#6B7280',
          bg: '#F3F4F6',
          color: '#374151',
          border: '#E5E7EB'
        };
      default:
        return {
          label: status,
          dot: '#6B7280',
          bg: '#F3F4F6',
          color: '#374151',
          border: '#E5E7EB'
        };
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
      case 'high':
        return {
          label: 'High Priority',
          color: '#991B1B',
          bg: '#FEF2F2',
          border: '#FECACA'
        };
      case 'medium':
        return {
          label: 'Medium',
          color: '#92400E',
          bg: '#FFFBEB',
          border: '#FDE68A'
        };
      case 'low':
        return {
          label: 'Routine',
          color: '#065F46',
          bg: '#ECFDF5',
          border: '#A7F3D0'
        };
      default:
        return {
          label: priority || 'Standard',
          color: '#374151',
          bg: '#F3F4F6',
          border: '#E5E7EB'
        };
    }
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    filterStatus !== 'ALL' ||
    filterTech !== 'ALL' ||
    filterAircraft !== 'ALL';

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('ALL');
    setFilterTech('ALL');
    setFilterAircraft('ALL');
  };

  // Distinct technicians list
  const technicians = [
    'ALL',
    ...new Set(workOrders.map(w => w.assignedTechnician).filter(Boolean))
  ];

  // Distinct aircraft list
  const aircraftIds = [
    'ALL',
    ...new Set(workOrders.map(w => w.aircraftId).filter(Boolean))
  ];

  return (
    <div className="container-fluid px-3 px-md-4 py-3" style={{ maxWidth: '1400px' }}>

      {/* ── 1. Top Header & Primary Actions ── */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4 pt-1">
        <div>
          {/* Breadcrumb & Live Dispatch Status */}
          <div className="d-flex align-items-center gap-2 mb-2">
            <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
              Maintenance Operations / Engineering Roster
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.72rem',
              color: '#059669',
              fontWeight: 500,
              background: '#ECFDF5',
              padding: '0.15rem 0.55rem',
              borderRadius: '999px',
              border: '1px solid #A7F3D0'
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#059669' }}></span>
              Dispatch Roster Synchronized
            </span>
          </div>

          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#111827',
            letterSpacing: '-0.025em',
            lineHeight: 1.25,
            marginBottom: '0.25rem'
          }}>
            Engineering Directives &amp; Work Orders
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
            Manage technician flight-line allocations, verify GSE diagnostic inspections, and issue formal airworthiness command passing orders.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="d-flex flex-wrap align-items-center gap-2 pt-1">
          {onOpenAssignJobModal && (
            <button
              onClick={onOpenAssignJobModal}
              className="btn btn-sm d-flex align-items-center gap-1.5 shadow-sm"
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '0.5rem 1.15rem',
                borderRadius: '8px',
                background: '#111827',
                border: 'none',
                color: '#FFFFFF'
              }}
            >
              <UserCheck size={14} />
              <span>Assign Job to Technician</span>
            </button>
          )}

          <button
            onClick={() => onOpenWorkOrderModal(null, 'AF-04')}
            className="btn btn-sm d-flex align-items-center gap-1.5"
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '0.5rem 1.05rem',
              borderRadius: '8px',
              background: '#FFFFFF',
              border: '1px solid #D1D5DB',
              color: '#374151'
            }}
          >
            <Plus size={14} />
            <span>New Directive</span>
          </button>
        </div>
      </div>

      {/* ── 2. Interactive KPI Metrics (Clickable Quick Filters) ── */}
      <div className="row g-3 mb-4">
        {/* Metric 1: Active Directives */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            onClick={() => setFilterStatus(filterStatus === 'Active' ? 'ALL' : 'Active')}
            style={{
              background: '#FFFFFF',
              border: `1px solid ${filterStatus === 'Active' ? '#111827' : '#E5E7EB'}`,
              borderRadius: '10px',
              padding: '1.2rem 1.35rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: filterStatus === 'Active' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#6B7280' }}>
                Active Directives
              </span>
              <Wrench size={16} color="#9CA3AF" />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>
              {activeOrders.length}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: '0.3rem' }}>
              Assigned or active on flight line
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>Forward wings</span>
              <span style={{ color: '#2563EB', fontWeight: 600 }}>● In Progress</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Critical Attention Required */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            onClick={() => setFilterStatus(filterStatus === 'High Priority' ? 'ALL' : 'High Priority')}
            style={{
              background: '#FFFFFF',
              border: `1px solid ${filterStatus === 'High Priority' ? '#DC2626' : '#E5E7EB'}`,
              borderRadius: '10px',
              padding: '1.2rem 1.35rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: filterStatus === 'High Priority' ? '0 2px 8px rgba(220,38,38,0.08)' : 'none'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#6B7280' }}>
                Immediate Attention
              </span>
              <AlertTriangle size={16} color={highPriorityOrders.length > 0 ? '#DC2626' : '#9CA3AF'} />
            </div>
            <div style={{
              fontSize: '1.9rem',
              fontWeight: 700,
              color: highPriorityOrders.length > 0 ? '#DC2626' : '#111827',
              lineHeight: 1.1
            }}>
              {highPriorityOrders.length}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: '0.3rem' }}>
              High-priority engineering snags
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>Airframe critical</span>
              <span style={{ color: '#DC2626', fontWeight: 600 }}>● Priority 1</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Downtime Prevented */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              padding: '1.2rem 1.35rem'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#6B7280' }}>
                Downtime Prevented
              </span>
              <Clock size={16} color="#9CA3AF" />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>
              {totalDowntimeSaved.toFixed(1)}<span style={{ fontSize: '1rem', fontWeight: 500, color: '#9CA3AF', marginLeft: '3px' }}>hrs</span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: '0.3rem' }}>
              Saved via predictive boroscopy
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>Lifecycle yield</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>₹4.8 Cr Value</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Completed Certifications */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            onClick={() => setFilterStatus(filterStatus === 'Completed' ? 'ALL' : 'Completed')}
            style={{
              background: '#FFFFFF',
              border: `1px solid ${filterStatus === 'Completed' ? '#059669' : '#E5E7EB'}`,
              borderRadius: '10px',
              padding: '1.2rem 1.35rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: filterStatus === 'Completed' ? '0 2px 8px rgba(5,150,105,0.08)' : 'none'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#6B7280' }}>
                Completed Certifications
              </span>
              <CheckCircle2 size={16} color="#059669" />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#059669', lineHeight: 1.1 }}>
              {completedOrders.length}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: '0.3rem' }}>
              Restored to active flight schedule
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>Flight cleared</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>● Mission Capable</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Pending Command Validation Alert Strip ── */}
      {pendingOrders.length > 0 && (
        <div
          className="mb-4 rounded-3 p-3.5"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderLeft: '4px solid #D97706',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2 pb-2 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D97706' }}></span>
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#111827' }}>
                Command Action Required — {pendingOrders.length} technician inspection report{pendingOrders.length > 1 ? 's' : ''} awaiting passing order
              </span>
            </div>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '0.18rem 0.6rem',
                borderRadius: '999px',
                background: '#FFFBEB',
                color: '#92400E',
                border: '1px solid #FDE68A'
              }}
            >
              Passing Order Mandatory
            </span>
          </div>

          <div className="d-flex flex-column gap-2 pt-1">
            {pendingOrders.map(pendingOrder => (
              <div
                key={pendingOrder.orderId}
                className="p-3 rounded-2 d-flex flex-wrap justify-content-between align-items-center gap-3"
                style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#111827',
                      flexShrink: 0
                    }}
                  >
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <strong style={{ fontSize: '0.92rem', color: '#111827', fontFamily: 'var(--font-mono)' }}>
                        {pendingOrder.aircraftId}
                      </strong>
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '0.12rem 0.45rem',
                        borderRadius: '4px',
                        background: '#E5E7EB',
                        color: '#374151',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {pendingOrder.orderId}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.55rem',
                          borderRadius: '999px',
                          background: pendingOrder.technicianRecommendation === 'FLIGHT_CLEARED' ? '#ECFDF5' : '#FEF2F2',
                          color: pendingOrder.technicianRecommendation === 'FLIGHT_CLEARED' ? '#065F46' : '#991B1B',
                          border: `1px solid ${pendingOrder.technicianRecommendation === 'FLIGHT_CLEARED' ? '#A7F3D0' : '#FECACA'}`
                        }}
                      >
                        {pendingOrder.technicianRecommendation === 'FLIGHT_CLEARED' ? 'Flight Clearance Requested' : 'Heavy Maintenance Recommended'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#6B7280', marginTop: '2px' }}>
                      Certifying Specialist: <strong style={{ color: '#374151' }}>{pendingOrder.assignedTechnician}</strong> · RUL Horizon: <strong style={{ color: '#DC2626' }}>{pendingOrder.predictedRul || '~40h'}</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedReportOrder(pendingOrder)}
                  className="btn btn-sm d-flex align-items-center gap-1.5 shadow-sm"
                  style={{
                    background: '#111827',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '0.45rem 1rem',
                    borderRadius: '6px'
                  }}
                >
                  <FileText size={13} color="#D97706" />
                  <span>Review &amp; Issue Order →</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 4. Search & Filter Bar ── */}
      <div
        className="p-3 mb-3 rounded-3"
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
        }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          {/* Search Input */}
          <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: '340px' }}>
            <div className="input-group input-group-sm">
              <span
                className="input-group-text bg-white border-end-0 text-muted"
                style={{ borderRadius: '8px 0 0 8px', border: '1px solid #D1D5DB' }}
              >
                <Search size={14} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by tail, order ID, or specialist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: '0.82rem', borderRadius: '0 8px 8px 0', border: '1px solid #D1D5DB' }}
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="d-flex flex-wrap align-items-center gap-2">
            {/* Status Tab Chips */}
            <div
              className="d-flex align-items-center gap-1 p-1 rounded-2"
              style={{ background: '#F3F4F6', border: '1px solid #E5E8EC' }}
            >
              {[
                { id: 'ALL', label: 'All', count: totalOrders },
                { id: 'Pending Validation', label: 'In Review', count: pendingOrders.length },
                { id: 'In Progress', label: 'In Progress', count: inProgressOrders.length },
                { id: 'Assigned', label: 'Assigned', count: assignedOrders.length },
                { id: 'Completed', label: 'Completed', count: completedOrders.length }
              ].map(tab => {
                const isActive = filterStatus === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilterStatus(tab.id)}
                    className="border-0"
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: isActive ? 600 : 500,
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      background: isActive ? '#FFFFFF' : 'transparent',
                      color: isActive ? '#111827' : '#6B7280',
                      boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tab.label} ({tab.count})
                  </button>
                );
              })}
            </div>

            {/* Specialist Dropdown */}
            <select
              value={filterTech}
              onChange={(e) => setFilterTech(e.target.value)}
              style={{
                fontSize: '0.78rem',
                padding: '0.36rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                background: '#FFFFFF',
                color: '#374151',
                outline: 'none',
                cursor: 'pointer'
              }}
              title="Filter by technician"
            >
              <option value="ALL">All Specialists</option>
              {technicians.filter(t => t !== 'ALL').map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Aircraft Dropdown */}
            <select
              value={filterAircraft}
              onChange={(e) => setFilterAircraft(e.target.value)}
              style={{
                fontSize: '0.78rem',
                padding: '0.36rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                background: '#FFFFFF',
                color: '#374151',
                outline: 'none',
                cursor: 'pointer'
              }}
              title="Filter by aircraft tail"
            >
              <option value="ALL">All Aircraft</option>
              {aircraftIds.filter(a => a !== 'ALL').map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="btn btn-sm btn-link text-secondary text-decoration-none d-flex align-items-center gap-1 p-1"
                style={{ fontSize: '0.74rem' }}
                title="Reset all filters"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}

            <div className="text-secondary ms-md-2" style={{ fontSize: '0.76rem' }}>
              Showing <strong style={{ color: '#111827' }}>{filteredOrders.length}</strong> of {totalOrders}
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Technician Assignment Roster Table ── */}
      <div
        className="rounded-3 overflow-hidden shadow-sm mb-4"
        style={{ background: '#FFFFFF', border: '1px solid #E5E8EC' }}
      >
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '980px' }}>
            <thead>
              <tr>
                <th style={{ background: '#FAFAFA', padding: '0.75rem 1.15rem', fontSize: '0.74rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E8EC', width: '13%' }}>
                  Aircraft
                </th>
                <th style={{ background: '#FAFAFA', padding: '0.75rem 1.15rem', fontSize: '0.74rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E8EC', width: '25%' }}>
                  Directive &amp; Scope
                </th>
                <th style={{ background: '#FAFAFA', padding: '0.75rem 1.15rem', fontSize: '0.74rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E8EC', width: '20%' }}>
                  Assigned Specialist
                </th>
                <th style={{ background: '#FAFAFA', padding: '0.75rem 1.15rem', fontSize: '0.74rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E8EC', width: '11%' }}>
                  Priority
                </th>
                <th style={{ background: '#FAFAFA', padding: '0.75rem 1.15rem', fontSize: '0.74rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E8EC', width: '11%' }}>
                  RUL Horizon
                </th>
                <th style={{ background: '#FAFAFA', padding: '0.75rem 1.15rem', fontSize: '0.74rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E8EC', width: '12%' }}>
                  Status
                </th>
                <th style={{ background: '#FAFAFA', padding: '0.75rem 1.15rem', fontSize: '0.74rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E8EC', width: '8%', textAlign: 'right' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#9CA3AF' }}>
                    <Wrench size={26} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#374151' }}>
                      No directives match your filter criteria
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: '2px' }}>
                      Try selecting another status tab or clearing active filters.
                    </div>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="btn btn-sm btn-outline-secondary mt-2.5"
                        style={{ fontSize: '0.75rem' }}
                      >
                        Reset Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const statusBadge = getStatusBadge(order.status);
                  const priorityBadge = getPriorityBadge(order.priority);
                  const targetAircraft = aircraftList.find(a => a.aircraftId === order.aircraftId);

                  return (
                    <tr
                      key={order.orderId}
                      style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.12s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAFBFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* 1. Aircraft Identification */}
                      <td style={{ padding: '0.9rem 1.15rem', verticalAlign: 'middle' }}>
                        <div className="d-flex align-items-center gap-2">
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: '#111827'
                          }}>
                            {order.aircraftId}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: '#9CA3AF' }}>
                            ({targetAircraft?.callsign || order.aircraftType?.split(' ')[0] || 'Airframe'})
                          </span>
                        </div>
                      </td>

                      {/* 2. Directive Title & Order ID */}
                      <td style={{ padding: '0.9rem 1.15rem', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>
                          {order.jobType || order.title}
                        </div>
                        <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{order.orderId}</span>
                          <span>·</span>
                          <span>{order.station || 'Flight Line Bay'}</span>
                        </div>
                      </td>

                      {/* 3. Assigned Specialist */}
                      <td style={{ padding: '0.9rem 1.15rem', verticalAlign: 'middle' }}>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: '#F3F4F6',
                              color: '#374151',
                              fontSize: '0.68rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {order.assignedTechnician ? order.assignedTechnician.split(' ').map(n => n[0]).join('') : 'T'}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111827' }}>
                              {order.assignedTechnician}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                              {order.station || 'Station Assigned'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 4. Priority */}
                      <td style={{ padding: '0.9rem 1.15rem', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '999px',
                            background: priorityBadge.bg,
                            color: priorityBadge.color,
                            border: `1px solid ${priorityBadge.border}`
                          }}
                        >
                          {priorityBadge.label}
                        </span>
                      </td>

                      {/* 5. RUL Horizon */}
                      <td style={{ padding: '0.9rem 1.15rem', verticalAlign: 'middle' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: (order.predictedRul || '').includes('40') ? '#DC2626' : '#111827'
                        }}>
                          {order.predictedRul || '~40h'}
                        </span>
                      </td>

                      {/* 6. Airworthiness Status */}
                      <td style={{ padding: '0.9rem 1.15rem', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            padding: '0.22rem 0.6rem',
                            borderRadius: '999px',
                            background: statusBadge.bg,
                            color: statusBadge.color,
                            border: `1px solid ${statusBadge.border}`,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: statusBadge.dot }}></span>
                          {statusBadge.label}
                        </span>
                      </td>

                      {/* 7. Action Button */}
                      <td style={{ padding: '0.9rem 1.15rem', verticalAlign: 'middle', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {order.status === 'Pending Command Validation' ? (
                          <button
                            onClick={() => setSelectedReportOrder(order)}
                            className="btn btn-sm d-inline-flex align-items-center gap-1.5 shadow-sm"
                            style={{
                              background: '#111827',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              padding: '0.38rem 0.85rem',
                              borderRadius: '6px'
                            }}
                          >
                            <FileText size={13} color="#D97706" />
                            <span>Review &amp; Order</span>
                          </button>
                        ) : order.status === 'Completed' ? (
                          <button
                            onClick={() => setSelectedReportOrder(order)}
                            className="btn btn-sm btn-light border d-inline-flex align-items-center gap-1.5"
                            style={{ fontSize: '0.76rem', padding: '0.38rem 0.85rem', borderRadius: '6px', color: '#065F46' }}
                          >
                            <CheckCircle2 size={13} color="#059669" />
                            <span>View Report</span>
                          </button>
                        ) : order.status === 'Maintenance Directive Issued' ? (
                          <button
                            onClick={() => setSelectedReportOrder(order)}
                            className="btn btn-sm btn-light border d-inline-flex align-items-center gap-1.5"
                            style={{ fontSize: '0.76rem', padding: '0.38rem 0.85rem', borderRadius: '6px', color: '#9A3412' }}
                          >
                            <Wrench size={13} color="#EA580C" />
                            <span>View Directive</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onOpenWorkOrderModal(null, order.aircraftId, order)}
                            className="btn btn-sm btn-light border"
                            style={{ fontSize: '0.76rem', padding: '0.38rem 0.85rem', borderRadius: '6px', color: '#374151' }}
                          >
                            View Details
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

      {/* ── 6. Bottom System Status Bar ── */}
      <div
        className="d-flex flex-wrap justify-content-between align-items-center gap-2 px-3 py-2.5 rounded-2"
        style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', fontSize: '0.72rem', color: '#9CA3AF' }}
      >
        <div className="d-flex align-items-center gap-2">
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#059669' }}></span>
          <span>Aeronautical Technical Record Chain of Custody Verified</span>
        </div>
        <div className="d-none d-md-block">
          Complies with IAF Directorate of Aerospace Maintenance &amp; DSSC Standard Orders
        </div>
      </div>

      {/* ── 7. Airworthiness Inspection Report Review Modal ── */}
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
