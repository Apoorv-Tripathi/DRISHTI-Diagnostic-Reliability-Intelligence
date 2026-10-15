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
  Plane,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Send,
  SlidersHorizontal
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

  // Total valuation in Crores
  const totalValuation = (spares.reduce((acc, curr) => acc + ((curr.totalAvailable || 0) * (curr.unitCostINR || 0)), 0) / 10000000).toFixed(2);

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

  const hasActiveFilters = searchTerm !== '' || filterSubsystem !== 'ALL' || filterStatus !== 'ALL';

  const resetFilters = () => {
    setSearchTerm('');
    setFilterSubsystem('ALL');
    setFilterStatus('ALL');
  };

  const subsystems = ['ALL', 'Engine', 'Hydraulics', 'Avionics', 'Fuel', 'Flight Controls'];

  return (
    <div className="container-fluid px-3 px-md-4 py-3" style={{ maxWidth: '1400px' }}>
      {/* Toast Notification */}
      {dispatchSuccessToast && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1060, maxWidth: '440px' }}
        >
          <div
            className="p-3 shadow-sm d-flex align-items-center justify-content-between gap-3 text-white rounded-3"
            style={{
              backgroundColor: '#111827',
              borderLeft: '4px solid #059669',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <CheckCircle size={18} color="#10B981" />
              <div style={{ fontSize: '0.82rem' }}>
                <strong className="d-block">Dispatch Confirmed</strong>
                <span style={{ color: '#D1D5DB' }}>{dispatchSuccessToast}</span>
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

      {/* ── 1. Top Header Row ── */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4 pt-1">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
              Fleet Operations / Logistics &amp; Spares
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
              Central Depot (Pune) + 4 Forward Stores Active
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
            Depot Spares Inventory &amp; Forward Logistics
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
            Real-time Line Replaceable Unit (LRU) allocation, automated prognostic demand linking, and forward base stock management.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 pt-1">
          <button
            onClick={() => onNavigate && onNavigate('maintenance')}
            className="btn btn-sm d-flex align-items-center gap-1.5"
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '0.48rem 1rem',
              borderRadius: '8px',
              background: '#FFFFFF',
              border: '1px solid #D1D5DB',
              color: '#374151'
            }}
          >
            <span>View Work Directives →</span>
          </button>
        </div>
      </div>

      {/* ── 2. Interactive KPI Metric Cards (Click to Filter) ── */}
      <div className="row g-3 mb-4">
        {/* Metric 1: Total Assemblies */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            onClick={() => {
              setFilterStatus('ALL');
              setFilterSubsystem('ALL');
            }}
            style={{
              background: '#FFFFFF',
              border: `1px solid ${filterStatus === 'ALL' && filterSubsystem === 'ALL' ? '#111827' : '#E5E7EB'}`,
              borderRadius: '10px',
              padding: '1.2rem 1.35rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: filterStatus === 'ALL' && filterSubsystem === 'ALL' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#6B7280' }}>
                Monitored Line Items
              </span>
              <Package size={16} color="#9CA3AF" />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>
              {spares.length}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: '0.3rem' }}>
              Assemblies catalogued in system
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>Depot network</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>● All Stores Synced</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Urgent Demand */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            onClick={() => setFilterStatus(filterStatus === 'URGENT' ? 'ALL' : 'URGENT')}
            style={{
              background: '#FFFFFF',
              border: `1px solid ${filterStatus === 'URGENT' ? '#DC2626' : '#E5E7EB'}`,
              borderRadius: '10px',
              padding: '1.2rem 1.35rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: filterStatus === 'URGENT' ? '0 2px 8px rgba(220,38,38,0.08)' : 'none'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#6B7280' }}>
                Prognostic Demand
              </span>
              <AlertTriangle size={16} color={urgentCount > 0 ? '#DC2626' : '#9CA3AF'} />
            </div>
            <div style={{
              fontSize: '1.9rem',
              fontWeight: 700,
              color: urgentCount > 0 ? '#DC2626' : '#111827',
              lineHeight: 1.1
            }}>
              {urgentCount}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: '0.3rem' }}>
              Parts linked to active airframe snags
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>AF-04 &amp; AF-02</span>
              <span style={{ color: '#DC2626', fontWeight: 600 }}>● Priority Hold</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Expedited Transit */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            onClick={() => setFilterStatus(filterStatus === 'EXPEDITED' ? 'ALL' : 'EXPEDITED')}
            style={{
              background: '#FFFFFF',
              border: `1px solid ${filterStatus === 'EXPEDITED' ? '#D97706' : '#E5E7EB'}`,
              borderRadius: '10px',
              padding: '1.2rem 1.35rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: filterStatus === 'EXPEDITED' ? '0 2px 8px rgba(217,119,6,0.08)' : 'none'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#6B7280' }}>
                Expedited in Transit
              </span>
              <Truck size={16} color={expeditedCount > 0 ? '#D97706' : '#9CA3AF'} />
            </div>
            <div style={{
              fontSize: '1.9rem',
              fontWeight: 700,
              color: expeditedCount > 0 ? '#D97706' : '#111827',
              lineHeight: 1.1
            }}>
              {expeditedCount}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: '0.3rem' }}>
              Active airlift or road dispatch
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>Forward Stores</span>
              <span style={{ color: '#D97706', fontWeight: 600 }}>● Tracking Active</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Inventory Valuation */}
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
                Catalog Valuation
              </span>
              <Building size={16} color="#9CA3AF" />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>
              ₹{totalValuation} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#9CA3AF' }}>Cr</span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: '0.3rem' }}>
              Capital in active depot inventory
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>IAF Logistics Command</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>● Asset Audited</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Search & Filter Bar ── */}
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
                placeholder="Search by part number, name, or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: '0.82rem', borderRadius: '0 8px 8px 0', border: '1px solid #D1D5DB' }}
              />
            </div>
          </div>

          {/* Subsystem & Status Filter Controls */}
          <div className="d-flex flex-wrap align-items-center gap-2">
            {/* Subsystem Tabs */}
            <div
              className="d-flex align-items-center gap-1 p-1 rounded-2"
              style={{ background: '#F3F4F6', border: '1px solid #E5E8EC' }}
            >
              {subsystems.map(sub => {
                const isActive = filterSubsystem === sub;
                return (
                  <button
                    key={sub}
                    onClick={() => setFilterSubsystem(sub)}
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
                    {sub}
                  </button>
                );
              })}
            </div>

            {/* Status Dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
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
              title="Filter by status"
            >
              <option value="ALL">All Statuses</option>
              <option value="URGENT">Urgent Demand Only</option>
              <option value="CRITICAL_A">Critical A Parts</option>
              <option value="EXPEDITED">Expedited / In Transit</option>
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
              Showing <strong style={{ color: '#111827' }}>{filteredSpares.length}</strong> of {spares.length}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Spares Catalog Table ── */}
      <div
        className="rounded-3 overflow-hidden shadow-sm mb-4"
        style={{ background: '#FFFFFF', border: '1px solid #E5E8EC' }}
      >
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1050px' }}>
            <thead>
              <tr>
                <th style={{ background: '#FAFAFA', padding: '0.75rem 1.15rem', fontSize: '0.74rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E8EC', width: '22%' }}>
                  Assembly &amp; Part Number
                </th>
                <th style={{ background: '#FAFAFA', padding: '0.75rem 1.15rem', fontSize: '0.74rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E8EC', width: '13%' }}>
                  Subsystem
                </th>
                <th style={{ background: '#FAFAFA', padding: '0.75rem 1.15rem', fontSize: '0.74rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E8EC', width: '13%' }}>
                  Criticality
                </th>
                <th style={{ background: '#FAFAFA', padding: '0.75rem 1.15rem', fontSize: '0.74rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E8EC', width: '20%' }}>
                  Depot Stock Distribution
                </th>
                <th style={{ background: '#FAFAFA', padding: '0.75rem 1.15rem', fontSize: '0.74rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E8EC', width: '17%' }}>
                  Requisition Status
                </th>
                <th style={{ background: '#FAFAFA', padding: '0.75rem 1.15rem', fontSize: '0.74rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E8EC', width: '15%', textAlign: 'right' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSpares.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#9CA3AF' }}>
                    <Package size={26} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#374151' }}>
                      No spare assemblies match your search or filter
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
                filteredSpares.map(spare => {
                  const urgentAlerts = getUrgentNeeds(spare.partNumber);
                  const isUrgent = urgentAlerts.length > 0;
                  const isExpedited =
                    spare.requisitionStatus.toLowerCase().includes('requisition') ||
                    spare.requisitionStatus.toLowerCase().includes('transit');

                  return (
                    <tr
                      key={spare.partNumber}
                      style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.12s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAFBFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* 1. Assembly & Part Number */}
                      <td style={{ padding: '0.9rem 1.15rem', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>
                          {spare.name}
                        </div>
                        <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#4B5563' }}>{spare.partNumber}</span>
                          <span>·</span>
                          <span>{spare.supplier || 'HAL OEM'}</span>
                        </div>
                      </td>

                      {/* 2. Subsystem */}
                      <td style={{ padding: '0.9rem 1.15rem', verticalAlign: 'middle' }}>
                        <span style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 500 }}>
                          {spare.subsystem}
                        </span>
                        <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                          {spare.compatibleAircraft ? spare.compatibleAircraft.join(', ') : 'Multi-Platform'}
                        </div>
                      </td>

                      {/* 3. Criticality */}
                      <td style={{ padding: '0.9rem 1.15rem', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '999px',
                            background: spare.criticality.startsWith('A') ? '#FEF2F2' : '#FFFBEB',
                            color: spare.criticality.startsWith('A') ? '#991B1B' : '#92400E',
                            border: `1px solid ${spare.criticality.startsWith('A') ? '#FECACA' : '#FDE68A'}`
                          }}
                        >
                          {spare.criticality}
                        </span>
                      </td>

                      {/* 4. Depot Stock Distribution */}
                      <td style={{ padding: '0.9rem 1.15rem', verticalAlign: 'middle' }}>
                        <div className="d-flex align-items-baseline gap-2 mb-1">
                          <strong style={{ fontSize: '0.92rem', color: spare.totalAvailable < spare.minThreshold ? '#DC2626' : '#111827', fontFamily: 'var(--font-mono)' }}>
                            {spare.totalAvailable} Units
                          </strong>
                          <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
                            (Min Buffer: {spare.minThreshold})
                          </span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>
                          Pune: {spare.depotStock?.centralDepotPune || 0} · Ambala: {spare.depotStock?.ambalaStore || 0} · Sulur: {spare.depotStock?.sulurStore || 0}
                        </div>
                      </td>

                      {/* 5. Requisition Status */}
                      <td style={{ padding: '0.9rem 1.15rem', verticalAlign: 'middle' }}>
                        {isUrgent ? (
                          <div>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                padding: '0.2rem 0.55rem',
                                borderRadius: '999px',
                                background: '#FEF2F2',
                                color: '#991B1B',
                                border: '1px solid #FECACA'
                              }}
                            >
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#DC2626' }}></span>
                              Priority Hold ({urgentAlerts.map(a => a.aircraftId).join(', ')})
                            </span>
                          </div>
                        ) : isExpedited ? (
                          <div>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                padding: '0.2rem 0.55rem',
                                borderRadius: '999px',
                                background: '#FFFBEB',
                                color: '#92400E',
                                border: '1px solid #FDE68A'
                              }}
                            >
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#D97706' }}></span>
                              {spare.requisitionStatus}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontSize: '0.72rem',
                                fontWeight: 500,
                                padding: '0.2rem 0.55rem',
                                borderRadius: '999px',
                                background: '#ECFDF5',
                                color: '#065F46',
                                border: '1px solid #A7F3D0'
                              }}
                            >
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#059669' }}></span>
                              {spare.requisitionStatus || 'In Stock'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* 6. Action Button */}
                      <td style={{ padding: '0.9rem 1.15rem', verticalAlign: 'middle', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => handleOpenRequisitionModal(spare)}
                          className="btn btn-sm d-inline-flex align-items-center gap-1.5"
                          style={{
                            background: isUrgent ? '#111827' : '#FFFFFF',
                            color: isUrgent ? '#FFFFFF' : '#374151',
                            border: isUrgent ? 'none' : '1px solid #D1D5DB',
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            padding: '0.38rem 0.85rem',
                            borderRadius: '6px',
                            boxShadow: isUrgent ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                          }}
                        >
                          <Send size={12} color={isUrgent ? '#10B981' : '#6B7280'} />
                          <span>Requisition Part</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. System Status Bar ── */}
      <div
        className="d-flex flex-wrap justify-content-between align-items-center gap-2 px-3 py-2.5 rounded-2"
        style={{ background: '#FAFAFA', border: '1px solid #E5E7EB', fontSize: '0.72rem', color: '#9CA3AF' }}
      >
        <div className="d-flex align-items-center gap-2">
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#059669' }}></span>
          <span>Central Logistics Registry Online · Integrated Logistics Support (MIL-STD-1388)</span>
        </div>
        <div className="d-none d-md-block">
          HQ Maintenance Command (Nagpur / Pune Central)
        </div>
      </div>

      {/* ── 6. Requisition Dispatch Modal ── */}
      {selectedSpareForModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.55)', zIndex: 1055, backdropFilter: 'blur(2px)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div
              className="modal-content border-0 shadow-lg"
              style={{ borderRadius: '14px', overflow: 'hidden', background: '#FFFFFF' }}
            >
              {/* Header */}
              <div
                className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom"
                style={{ background: '#F8FAFC' }}
              >
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '0.12rem 0.45rem',
                      borderRadius: '4px',
                      background: '#E5E7EB',
                      color: '#374151',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {selectedSpareForModal.partNumber}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#6B7280' }}>
                      {selectedSpareForModal.subsystem}
                    </span>
                  </div>
                  <h4 style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#111827',
                    margin: 0,
                    letterSpacing: '-0.02em'
                  }}>
                    Requisition Line Replaceable Unit: {selectedSpareForModal.name}
                  </h4>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedSpareForModal(null)}
                ></button>
              </div>

              {/* Body */}
              <div className="p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {/* Stock distribution box */}
                <div
                  className="p-3 rounded-2 mb-3"
                  style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}
                >
                  <div className="row g-2" style={{ fontSize: '0.78rem' }}>
                    <div className="col-sm-3">
                      <span style={{ fontSize: '0.7rem', color: '#9CA3AF', display: 'block' }}>TOTAL AVAILABLE</span>
                      <strong style={{ fontSize: '1rem', color: '#111827', fontFamily: 'var(--font-mono)' }}>
                        {selectedSpareForModal.totalAvailable} Units
                      </strong>
                    </div>
                    <div className="col-sm-3">
                      <span style={{ fontSize: '0.7rem', color: '#9CA3AF', display: 'block' }}>CENTRAL DEPOT (PUNE)</span>
                      <strong style={{ fontSize: '0.9rem', color: '#111827' }}>
                        {selectedSpareForModal.depotStock?.centralDepotPune || 0} Units
                      </strong>
                    </div>
                    <div className="col-sm-3">
                      <span style={{ fontSize: '0.7rem', color: '#9CA3AF', display: 'block' }}>FORWARD BUFFER</span>
                      <strong style={{ fontSize: '0.9rem', color: '#111827' }}>
                        {selectedSpareForModal.minThreshold} Units
                      </strong>
                    </div>
                    <div className="col-sm-3">
                      <span style={{ fontSize: '0.7rem', color: '#9CA3AF', display: 'block' }}>EST. AIRLIFT LEAD</span>
                      <strong style={{ fontSize: '0.9rem', color: '#059669' }}>
                        {selectedSpareForModal.leadTimeDays || 1} Day(s)
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Destination Base */}
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>
                    Destination Air Force Station / Forward Store
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={targetBase}
                    onChange={(e) => setTargetBase(e.target.value)}
                    style={{ fontSize: '0.82rem', borderRadius: '6px' }}
                  >
                    <option value="Ambala AFS (Forward Store 1)">Ambala AFS (No. 7 Battleaxes / Vajra Wing)</option>
                    <option value="Sulur AFS (Forward Store 2)">Sulur AFS (No. 45 Flying Daggers / LCA Bay)</option>
                    <option value="Pune AFS (Forward Store 3)">Pune AFS (No. 20 Lightnings / Su-30M Depot)</option>
                    <option value="Gwalior AFS (Forward Store 4)">Gwalior AFS (No. 1 Tigers / Mirage Avionics)</option>
                    <option value="Bareilly AFS (Forward Store 5)">Bareilly AFS (Tactical Airfield Base)</option>
                  </select>
                </div>

                {/* Priority */}
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>
                    Transit Logistics Priority
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={transitPriority}
                    onChange={(e) => setTransitPriority(e.target.value)}
                    style={{ fontSize: '0.82rem', borderRadius: '6px' }}
                  >
                    <option value="FLASH (Airlift 6h)">FLASH (Dedicated AN-32 / C-130J Tactical Airlift — 6h)</option>
                    <option value="EXPEDITED (Ground 18h)">EXPEDITED (Dedicated Ground Express Escort — 18h)</option>
                    <option value="ROUTINE (Scheduled 48h)">ROUTINE (Scheduled Inter-Base Depot Replenishment — 48h)</option>
                  </select>
                </div>

                {/* Remarks */}
                <div className="mb-2">
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>
                    Requisition Remarks &amp; Aircraft Association
                  </label>
                  <textarea
                    className="form-control form-control-sm"
                    rows="3"
                    value={orderRemarks}
                    onChange={(e) => setOrderRemarks(e.target.value)}
                    style={{ fontSize: '0.82rem', borderRadius: '6px' }}
                  ></textarea>
                </div>
              </div>

              {/* Footer */}
              <div
                className="px-4 py-3 d-flex justify-content-between align-items-center border-top"
                style={{ background: '#F8FAFC' }}
              >
                <button
                  type="button"
                  className="btn btn-sm btn-light border"
                  onClick={() => setSelectedSpareForModal(null)}
                  style={{ fontSize: '0.8rem', padding: '0.45rem 1rem', borderRadius: '6px' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRequisition}
                  className="btn btn-sm btn-dark d-flex align-items-center gap-2 shadow-sm"
                  style={{
                    background: '#111827',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    padding: '0.45rem 1.15rem',
                    borderRadius: '6px'
                  }}
                >
                  <Send size={13} color="#10B981" />
                  <span>Dispatch Requisition Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
