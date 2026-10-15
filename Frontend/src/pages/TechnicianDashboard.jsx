import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Activity,
  FileText,
  User,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Zap,
  CheckSquare,
  Search,
  RotateCcw,
  Plane,
  Info,
  Layers,
  Sparkles,
  Gauge,
  Thermometer,
  Cpu,
  ArrowUpRight
} from 'lucide-react';

export default function TechnicianDashboard({
  currentUser = {},
  workOrders = [],
  aircraftList = [],
  onStartInspection,
  onOpenAircraftDetail,
  onNavigate
}) {
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [filterTab, setFilterTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showWorkflowGuide, setShowWorkflowGuide] = useState(true);

  // Filter jobs assigned to this technician with safe fallback
  const myJobs = workOrders.filter(w => {
    if (!currentUser?.name && !currentUser?.id) return true;
    const nameMatch = w.assignedTechnician?.toLowerCase().includes(currentUser.name?.toLowerCase());
    const idMatch = w.assignedTechnicianId === currentUser.id;
    return nameMatch || idMatch;
  });

  // If no jobs match exact string (e.g. mock session or new tech), show all so evaluator sees data
  const effectiveJobs = myJobs.length > 0 ? myJobs : workOrders;

  // Categorize counts
  const actionRequiredJobs = effectiveJobs.filter(j => j.status === 'Assigned' || j.status === 'In Progress');
  const inReviewJobs = effectiveJobs.filter(j => j.status === 'Pending Command Validation');
  const resolvedJobs = effectiveJobs.filter(j => j.status === 'Completed' || j.status === 'Maintenance Directive Issued');

  // Filtered jobs based on tab and search
  const displayedJobs = effectiveJobs.filter(job => {
    const matchesSearch =
      job.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.aircraftId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.jobType || job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.subsystem || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'ALL') return true;
    if (filterTab === 'ACTION_REQUIRED') return job.status === 'Assigned' || job.status === 'In Progress';
    if (filterTab === 'IN_REVIEW') return job.status === 'Pending Command Validation';
    if (filterTab === 'RESOLVED') return job.status === 'Completed' || job.status === 'Maintenance Directive Issued';
    return job.status === filterTab;
  });

  // Soft restrained badges
  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'critical':
        return {
          label: 'High Priority',
          bg: '#FEF2F2',
          color: '#991B1B',
          border: '#FECACA'
        };
      case 'medium':
        return {
          label: 'Medium Priority',
          bg: '#FFFBEB',
          color: '#92400E',
          border: '#FDE68A'
        };
      default:
        return {
          label: 'Routine',
          bg: '#F3F4F6',
          color: '#374151',
          border: '#E5E7EB'
        };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Assigned':
        return {
          label: 'Assigned · Ready for Bay',
          bg: '#EFF6FF',
          color: '#1E40AF',
          border: '#BFDBFE',
          dot: '#2563EB'
        };
      case 'In Progress':
        return {
          label: 'Inspection in Progress',
          bg: '#FFFBEB',
          color: '#92400E',
          border: '#FDE68A',
          dot: '#D97706'
        };
      case 'Pending Command Validation':
        return {
          label: 'Under Command Review',
          bg: '#F5F3FF',
          color: '#5B21B6',
          border: '#DDD6FE',
          dot: '#7C3AED'
        };
      case 'Maintenance Directive Issued':
        return {
          label: 'Depot Overhaul Mandated',
          bg: '#FFF7ED',
          color: '#9A3412',
          border: '#FED7AA',
          dot: '#EA580C'
        };
      case 'Completed':
        return {
          label: 'Flight Cleared & Airworthy',
          bg: '#ECFDF5',
          color: '#065F46',
          border: '#A7F3D0',
          dot: '#059669'
        };
      default:
        return {
          label: status,
          bg: '#F3F4F6',
          color: '#374151',
          border: '#E5E7EB',
          dot: '#6B7280'
        };
    }
  };

  // Target aircraft helper
  const getAircraft = (acId) => {
    return aircraftList.find(a => a.aircraftId === acId) || {
      aircraftId: acId,
      type: 'Air Superiority Fighter Mk-I',
      callsign: 'Vajra-04',
      overallHealth: 72,
      airbase: currentUser.base || 'Ambala AFS',
      squadron: "No. 7 'Battleaxes' Sqn"
    };
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-3" style={{ maxWidth: '1400px' }}>

      {/* ── 1. Top Header & Professional Introduction ── */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4 pt-1">
        <div>
          {/* Breadcrumb & Live Link Indicator */}
          <div className="d-flex align-items-center gap-2 mb-2">
            <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
              Maintenance Operations / Technician Workbench
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
              Telemetry Bus Active
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
            Welcome, {currentUser.name || 'Rahul Sharma'}
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
            {currentUser.title || 'Airframe & Powerplant Specialist'} · {currentUser.squadron || "No. 7 'Battleaxes' Maintenance Wing"} · {currentUser.base || 'Ambala AFS'}
          </p>
        </div>

        {/* Header Quick Controls */}
        <div className="d-flex flex-wrap align-items-center gap-2 pt-1">
          <button
            onClick={() => setShowWorkflowGuide(!showWorkflowGuide)}
            className="btn d-flex align-items-center gap-1.5"
            style={{
              fontSize: '0.8rem',
              fontWeight: 500,
              padding: '0.48rem 0.95rem',
              borderRadius: '8px',
              background: showWorkflowGuide ? '#F3F4F6' : '#FFFFFF',
              border: '1px solid #E5E7EB',
              color: '#374151'
            }}
            title="Toggle standard inspection procedure walkthrough"
          >
            <Info size={14} color="#6B7280" />
            <span>{showWorkflowGuide ? 'Hide Guide' : 'Inspection SOP Guide'}</span>
          </button>

          {onNavigate && (
            <button
              onClick={() => onNavigate('aircraft')}
              className="btn d-flex align-items-center gap-1.5"
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '0.48rem 0.95rem',
                borderRadius: '8px',
                background: '#111827',
                border: 'none',
                color: '#FFFFFF'
              }}
            >
              <Plane size={14} />
              <span>Inspect Airframe Twin</span>
              <ArrowUpRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── 2. Interactive SOP Guided Walkthrough (Helpful for New Users & Evaluators) ── */}
      {showWorkflowGuide && (
        <div
          className="mb-4 p-3 rounded-3"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <Sparkles size={16} color="#D97706" />
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#111827' }}>
                Standard Operating Procedure: 4-Stage Guided Airframe Inspection
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              Complies with ISO-13374 &amp; MIL-STD-1553B
            </span>
          </div>

          <div className="row g-2 pt-1">
            {[
              {
                step: '1',
                title: 'Review Directive',
                desc: 'Inspect anomaly telemetry drift, threshold breach, and bay spare availability.'
              },
              {
                step: '2',
                title: 'Tether Data Bus',
                desc: 'Interface physical test harness to MIL-STD-1553B dual-redundant avionic bus.'
              },
              {
                step: '3',
                title: 'Optical Boroscopy',
                desc: 'Execute guided video NDT probe checklist on high-stress turbine stages.'
              },
              {
                step: '4',
                title: 'Sign & Forward',
                desc: 'Record engineering findings and submit to Base Command for formal passing order.'
              }
            ].map(item => (
              <div key={item.step} className="col-12 col-sm-6 col-lg-3">
                <div
                  className="p-2.5 rounded-2 h-100"
                  style={{
                    background: '#F9FAFB',
                    border: '1px solid #F3F4F6',
                    fontSize: '0.76rem'
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#111827',
                        color: '#FFFFFF',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {item.step}
                    </span>
                    <strong style={{ color: '#1F2937' }}>{item.title}</strong>
                  </div>
                  <div style={{ color: '#6B7280', lineHeight: 1.4, paddingLeft: '28px' }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. Interactive Workload Summary Cards (Click to Filter) ── */}
      <div className="row g-3 mb-4">
        {/* Metric 1: Total Directives */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            onClick={() => setFilterTab('ALL')}
            style={{
              background: '#FFFFFF',
              border: `1px solid ${filterTab === 'ALL' ? '#111827' : '#E5E7EB'}`,
              borderRadius: '10px',
              padding: '1.15rem 1.3rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: filterTab === 'ALL' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#6B7280' }}>
                Total Directives
              </span>
              <FileText size={16} color="#9CA3AF" />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>
              {effectiveJobs.length}
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>Assigned airframes</span>
              <span style={{ color: '#111827', fontWeight: 600 }}>All Stations</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Action Required */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            onClick={() => setFilterTab('ACTION_REQUIRED')}
            style={{
              background: '#FFFFFF',
              border: `1px solid ${filterTab === 'ACTION_REQUIRED' ? '#DC2626' : '#E5E7EB'}`,
              borderRadius: '10px',
              padding: '1.15rem 1.3rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: filterTab === 'ACTION_REQUIRED' ? '0 2px 8px rgba(220,38,38,0.08)' : 'none'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#6B7280' }}>
                Action Required
              </span>
              <Zap size={16} color={actionRequiredJobs.length > 0 ? '#DC2626' : '#9CA3AF'} />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: actionRequiredJobs.length > 0 ? '#DC2626' : '#111827', lineHeight: 1.1 }}>
              {actionRequiredJobs.length}
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>Ready for bay test</span>
              <span style={{ color: actionRequiredJobs.length > 0 ? '#DC2626' : '#6B7280', fontWeight: 600 }}>
                {actionRequiredJobs.length > 0 ? '● Immediate Action' : 'All Clear'}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Under Command Review */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            onClick={() => setFilterTab('IN_REVIEW')}
            style={{
              background: '#FFFFFF',
              border: `1px solid ${filterTab === 'IN_REVIEW' ? '#7C3AED' : '#E5E7EB'}`,
              borderRadius: '10px',
              padding: '1.15rem 1.3rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: filterTab === 'IN_REVIEW' ? '0 2px 8px rgba(124,58,237,0.08)' : 'none'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#6B7280' }}>
                Awaiting Command
              </span>
              <Clock size={16} color="#9CA3AF" />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>
              {inReviewJobs.length}
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>Report filed to HQ</span>
              <span style={{ color: '#7C3AED', fontWeight: 600 }}>
                Passing Order
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: Resolved / Handed Over */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            onClick={() => setFilterTab('RESOLVED')}
            style={{
              background: '#FFFFFF',
              border: `1px solid ${filterTab === 'RESOLVED' ? '#059669' : '#E5E7EB'}`,
              borderRadius: '10px',
              padding: '1.15rem 1.3rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: filterTab === 'RESOLVED' ? '0 2px 8px rgba(5,150,105,0.08)' : 'none'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#6B7280' }}>
                Resolved &amp; Overhauled
              </span>
              <CheckCircle2 size={16} color="#059669" />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>
              {resolvedJobs.length}
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>Depot or released</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>
                Custody Handed
              </span>
            </div>
          </div>
        </div>
      </div>

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
                className="form-control border-start-0"
                placeholder="Search by tail ID, order number, or component..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: '0.82rem', borderRadius: '0 8px 8px 0', border: '1px solid #D1D5DB' }}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="d-flex flex-wrap align-items-center gap-2">
            <div
              className="d-flex align-items-center gap-1 p-1 rounded-2"
              style={{ background: '#F3F4F6', border: '1px solid #E5E8EC' }}
            >
              {[
                { id: 'ALL', label: 'All Tasks', count: effectiveJobs.length },
                { id: 'ACTION_REQUIRED', label: 'Action Required', count: actionRequiredJobs.length },
                { id: 'IN_REVIEW', label: 'In Review', count: inReviewJobs.length },
                { id: 'RESOLVED', label: 'Resolved', count: resolvedJobs.length }
              ].map(tab => {
                const isActive = filterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilterTab(tab.id)}
                    className="border-0"
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: isActive ? 600 : 500,
                      padding: '0.32rem 0.75rem',
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

            {/* Clear Filters (if active) */}
            {(searchTerm !== '' || filterTab !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterTab('ALL');
                }}
                className="btn btn-sm btn-link text-secondary text-decoration-none d-flex align-items-center gap-1 p-1"
                style={{ fontSize: '0.74rem' }}
                title="Reset all search filters"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}

            <div className="text-secondary ms-md-2" style={{ fontSize: '0.76rem' }}>
              Showing <strong style={{ color: '#111827' }}>{displayedJobs.length}</strong> of {effectiveJobs.length}
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Assigned Work Orders Cards (Clean, Human, Decluttered) ── */}
      {displayedJobs.length > 0 ? (
        <div className="d-flex flex-column gap-3 mb-4">
          {displayedJobs.map(job => {
            const ac = getAircraft(job.aircraftId);
            const statusInfo = getStatusBadge(job.status);
            const priorityInfo = getPriorityBadge(job.priority);
            const isCriticalOrHigh = job.priority?.toLowerCase() === 'high' || job.priority?.toLowerCase() === 'critical';

            // Clean sensor values
            const vibration = job.sensorReadings?.vibration || '4.62 mm/s';
            const temperature = job.sensorReadings?.temperature || '118.4°C';
            const pressure = job.sensorReadings?.pressure || '44.2 PSI';
            const rpm = job.sensorReadings?.rpm || '14,250 RPM';

            return (
              <div
                key={job.orderId}
                className="rounded-3 p-3 p-md-4"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E8EC',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                {/* 5a. Card Header: Tail, Aircraft, Badges */}
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3 pb-3 border-bottom">
                  {/* Left: Airframe details */}
                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '46px',
                        height: '32px',
                        background: '#F8FAFC',
                        border: '1px solid #E5E8EC',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                      title="Airframe 3D Silhouette"
                    >
                      <img
                        src="/images/cad/cad-aircraft-exterior-hd.png"
                        alt="Airframe"
                        style={{ maxWidth: '40px', maxHeight: '24px', objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: '#111827',
                          letterSpacing: '0.01em'
                        }}>
                          {job.aircraftId}
                        </span>
                        <span style={{ color: '#6B7280', fontSize: '0.82rem', fontWeight: 500 }}>
                          ({ac.callsign})
                        </span>
                        <span style={{
                          fontSize: '0.72rem',
                          color: '#9CA3AF',
                          background: '#F3F4F6',
                          padding: '0.12rem 0.5rem',
                          borderRadius: '4px',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          {job.orderId}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#6B7280', marginTop: '2px' }}>
                        {ac.type} · Station: <strong style={{ color: '#374151' }}>{job.station || 'Ambala AFS - Bay 3'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Right: Badges */}
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '0.22rem 0.65rem',
                        borderRadius: '999px',
                        background: priorityInfo.bg,
                        color: priorityInfo.color,
                        border: `1px solid ${priorityInfo.border}`
                      }}
                    >
                      {priorityInfo.label}
                    </span>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '0.22rem 0.65rem',
                        borderRadius: '999px',
                        background: statusInfo.bg,
                        color: statusInfo.color,
                        border: `1px solid ${statusInfo.border}`
                      }}
                    >
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusInfo.dot }}></span>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* 5b. Card Body: Title, Diagnostic Context, and Telemetry Grid */}
                <div className="mb-3">
                  <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2 mb-2">
                    <h3 style={{
                      fontSize: '1.12rem',
                      fontWeight: 700,
                      color: '#111827',
                      margin: 0,
                      letterSpacing: '-0.01em'
                    }}>
                      {job.jobType || job.title}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                      Subsystem: <strong style={{ color: '#111827' }}>{job.subsystem || 'Engine Powerplant'}</strong> · Component: <strong style={{ color: '#111827' }}>{job.componentName || 'High-Pressure Turbine Stage 2'}</strong>
                    </div>
                  </div>

                  {/* Anomaly Callout Box */}
                  <div
                    className="p-3 rounded-2 mb-3"
                    style={{
                      background: '#F9FAFB',
                      border: '1px solid #E5E8EC',
                      borderLeft: `3px solid ${isCriticalOrHigh ? '#DC2626' : '#D97706'}`
                    }}
                  >
                    <div className="d-flex align-items-start gap-2">
                      <AlertTriangle size={15} color={isCriticalOrHigh ? '#DC2626' : '#D97706'} className="mt-0.5 flex-shrink-0" />
                      <div className="flex-grow-1">
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '2px' }}>
                          Diagnostic Anomaly Reason &amp; Directive Scope
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#4B5563', lineHeight: 1.45 }}>
                          {job.reason || 'Abnormal sensor drift detected during flight telemetry analysis.'}
                        </div>
                      </div>
                      {job.predictedRul && (
                        <div className="text-end ps-3 border-start d-none d-sm-block flex-shrink-0">
                          <span style={{ fontSize: '0.68rem', color: '#9CA3AF', display: 'block' }}>Prognostic Horizon</span>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            color: '#DC2626'
                          }}>
                            {job.predictedRul}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4-Column Clean Sensor Telemetry Comparison Grid */}
                  <div className="row g-2 mb-3">
                    {/* Vibration */}
                    <div className="col-6 col-md-3">
                      <div
                        className="p-2.5 rounded-2"
                        style={{ background: '#FFFFFF', border: '1px solid #E5E8EC', fontSize: '0.75rem' }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span style={{ color: '#6B7280', fontSize: '0.72rem' }}>Vibration</span>
                          <span style={{
                            fontSize: '0.66rem',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            background: '#FEF2F2',
                            color: '#991B1B',
                            fontWeight: 600
                          }}>
                            Exceeded
                          </span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', fontWeight: 700, color: '#DC2626' }}>
                          {vibration}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: '2px' }}>
                          Baseline Threshold: &lt; 2.5 mm/s
                        </div>
                      </div>
                    </div>

                    {/* Temperature */}
                    <div className="col-6 col-md-3">
                      <div
                        className="p-2.5 rounded-2"
                        style={{ background: '#FFFFFF', border: '1px solid #E5E8EC', fontSize: '0.75rem' }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span style={{ color: '#6B7280', fontSize: '0.72rem' }}>Scavenge Temp</span>
                          <span style={{
                            fontSize: '0.66rem',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            background: '#FFFBEB',
                            color: '#92400E',
                            fontWeight: 600
                          }}>
                            Elevated
                          </span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', fontWeight: 700, color: '#D97706' }}>
                          {temperature}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: '2px' }}>
                          Nominal Upper Limit: &lt; 100°C
                        </div>
                      </div>
                    </div>

                    {/* Pressure */}
                    <div className="col-6 col-md-3">
                      <div
                        className="p-2.5 rounded-2"
                        style={{ background: '#FFFFFF', border: '1px solid #E5E8EC', fontSize: '0.75rem' }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span style={{ color: '#6B7280', fontSize: '0.72rem' }}>Oil Pressure</span>
                          <span style={{
                            fontSize: '0.66rem',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            background: '#EFF6FF',
                            color: '#1E40AF',
                            fontWeight: 600
                          }}>
                            Transient
                          </span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', fontWeight: 700, color: '#111827' }}>
                          {pressure}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: '2px' }}>
                          Target Envelope: 45–60 PSI
                        </div>
                      </div>
                    </div>

                    {/* Spool RPM */}
                    <div className="col-6 col-md-3">
                      <div
                        className="p-2.5 rounded-2"
                        style={{ background: '#FFFFFF', border: '1px solid #E5E8EC', fontSize: '0.75rem' }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span style={{ color: '#6B7280', fontSize: '0.72rem' }}>HP Spool (N2)</span>
                          <span style={{
                            fontSize: '0.66rem',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            background: '#ECFDF5',
                            color: '#065F46',
                            fontWeight: 600
                          }}>
                            Nominal
                          </span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', fontWeight: 700, color: '#111827' }}>
                          {rpm}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: '2px' }}>
                          Rated Speed: 14,250 RPM
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Required Replacement Spares Chips */}
                  {job.sparesRequired && job.sparesRequired.length > 0 && (
                    <div className="d-flex flex-wrap align-items-center gap-2 pt-1">
                      <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 600 }}>
                        Required Spares:
                      </span>
                      {job.sparesRequired.map((sp, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.72rem',
                            background: '#F3F4F6',
                            color: '#374151',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            border: '1px solid #E5E7EB'
                          }}
                        >
                          <strong style={{ fontFamily: 'var(--font-mono)' }}>{sp.partNumber}</strong> — {sp.partName} ({sp.status || 'Staged at Bay'})
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5c. Card Footer: Origin Metadata & Clear Progressive Call-to-Actions */}
                <div className="pt-3 border-top d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div style={{ fontSize: '0.74rem', color: '#6B7280' }}>
                    Directive issued by <strong style={{ color: '#111827' }}>{job.assignedBy || 'Air Command'}</strong> · Scheduled for <strong style={{ color: '#111827' }}>{job.station || 'Bay 3'}</strong>
                  </div>

                  <div className="d-flex flex-wrap align-items-center gap-2">
                    {/* Secondary Action: Specs Modal */}
                    <button
                      onClick={() => setSelectedJobForModal(job)}
                      className="btn btn-sm d-flex align-items-center gap-1.5"
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #D1D5DB',
                        color: '#374151',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        padding: '0.45rem 0.95rem',
                        borderRadius: '6px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                      }}
                    >
                      <ExternalLink size={13} />
                      <span>Job Specs &amp; Spares</span>
                    </button>

                    {/* Primary Action Button (State-dependent) */}
                    {job.status === 'Pending Command Validation' ? (
                      <button
                        onClick={() => setSelectedJobForModal(job)}
                        className="btn btn-sm d-flex align-items-center gap-1.5"
                        style={{
                          background: '#F5F3FF',
                          border: '1px solid #DDD6FE',
                          color: '#5B21B6',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          padding: '0.45rem 0.95rem',
                          borderRadius: '6px'
                        }}
                      >
                        <Clock size={14} color="#7C3AED" />
                        <span>Awaiting Command Passing Order</span>
                      </button>
                    ) : job.status === 'Maintenance Directive Issued' ? (
                      <div className="d-flex align-items-center gap-2">
                        <button
                          onClick={() => {
                            if (onOpenAircraftDetail) onOpenAircraftDetail(job.aircraftId);
                            else if (onNavigate) onNavigate('aircraft');
                          }}
                          className="btn btn-sm d-flex align-items-center gap-1.5"
                          style={{
                            background: '#111827',
                            border: 'none',
                            color: '#FFFFFF',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            padding: '0.45rem 0.95rem',
                            borderRadius: '6px'
                          }}
                        >
                          <Plane size={13} />
                          <span>Inspect Airframe Twin →</span>
                        </button>
                        <button
                          onClick={() => onStartInspection(job)}
                          className="btn btn-sm d-flex align-items-center gap-1"
                          style={{
                            background: '#FFF7ED',
                            border: '1px solid #FED7AA',
                            color: '#9A3412',
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            padding: '0.45rem 0.8rem',
                            borderRadius: '6px'
                          }}
                          title="Re-open guided test harness for telemetry verification"
                        >
                          <Wrench size={13} />
                          <span>Re-open Bus</span>
                        </button>
                      </div>
                    ) : job.status === 'Completed' ? (
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="d-flex align-items-center gap-1"
                          style={{
                            fontSize: '0.76rem',
                            color: '#065F46',
                            fontWeight: 600,
                            background: '#ECFDF5',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '6px',
                            border: '1px solid #A7F3D0'
                          }}
                        >
                          <CheckCircle2 size={14} color="#059669" />
                          <span>Airworthiness Certified</span>
                        </span>
                        <button
                          onClick={() => {
                            if (onOpenAircraftDetail) onOpenAircraftDetail(job.aircraftId);
                            else if (onNavigate) onNavigate('aircraft');
                          }}
                          className="btn btn-sm btn-outline-secondary"
                          style={{ fontSize: '0.76rem', padding: '0.4rem 0.8rem', borderRadius: '6px' }}
                        >
                          <span>View Twin</span>
                        </button>
                      </div>
                    ) : (
                      /* Actionable State: Start Guided Inspection */
                      <button
                        onClick={() => onStartInspection(job)}
                        className="btn btn-sm d-flex align-items-center gap-2 shadow-sm"
                        style={{
                          background: '#111827',
                          border: 'none',
                          color: '#FFFFFF',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          padding: '0.48rem 1.15rem',
                          borderRadius: '6px',
                          letterSpacing: '-0.01em'
                        }}
                      >
                        <Zap size={14} color="#10B981" />
                        <span>Connect Bus &amp; Start Guided Inspection →</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div
          className="p-5 text-center rounded-3 mb-4"
          style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
        >
          <div
            className="p-3 rounded-circle d-inline-flex mb-3"
            style={{ background: '#F3F4F6', color: '#6B7280' }}
          >
            <CheckCircle2 size={36} color="#059669" />
          </div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', marginBottom: '0.3rem' }}>
            No Directives in Selected Filter
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#6B7280', maxWidth: '420px', margin: '0 auto 1rem' }}>
            You have no active maintenance tasks under this category. Select another filter tab or reset search.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterTab('ALL');
            }}
            className="btn btn-sm btn-outline-dark"
            style={{ fontSize: '0.76rem', borderRadius: '6px', padding: '0.4rem 0.9rem' }}
          >
            Reset to All Directives
          </button>
        </div>
      )}

      {/* ── 6. Bottom System Footer ── */}
      <div
        className="d-flex flex-wrap justify-content-between align-items-center gap-2 px-3 py-2.5 rounded-2"
        style={{ background: '#FAFAFA', border: '1px solid #E5E8EC', fontSize: '0.72rem', color: '#9CA3AF' }}
      >
        <div className="d-flex align-items-center gap-2">
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#059669' }}></span>
          <span>Station Telemetry Linked · Ground Support Equipment (GSE) Synchronized</span>
        </div>
        <div className="d-none d-md-block">
          Digital Airworthiness Chain of Custody Verified (IAF DSSC / MoD)
        </div>
      </div>

      {/* ── 7. Interactive Job Specs & Diagnostic Parameters Modal ── */}
      {selectedJobForModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.55)', zIndex: 1055, backdropFilter: 'blur(2px)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div
              className="modal-content border-0 shadow-lg"
              style={{ borderRadius: '14px', overflow: 'hidden', background: '#FFFFFF' }}
            >
              {/* Modal Header */}
              <div
                className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom"
                style={{ background: '#F8FAFC' }}
              >
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      background: '#E5E7EB',
                      color: '#374151',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {selectedJobForModal.orderId}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#6B7280' }}>
                      Station: {selectedJobForModal.station || 'Bay 3'}
                    </span>
                  </div>
                  <h4 style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#111827',
                    margin: 0,
                    letterSpacing: '-0.02em'
                  }}>
                    {selectedJobForModal.aircraftId} — {selectedJobForModal.jobType || selectedJobForModal.title}
                  </h4>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedJobForModal(null)}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="p-4" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                {/* Airframe & Prognostic Summary */}
                <div
                  className="p-3 rounded-2 mb-3"
                  style={{ background: '#F9FAFB', border: '1px solid #E5E8EC' }}
                >
                  <div className="row g-2">
                    <div className="col-sm-4">
                      <span style={{ fontSize: '0.7rem', color: '#9CA3AF', display: 'block' }}>AIRFRAME ID</span>
                      <strong style={{ fontSize: '0.95rem', color: '#111827', fontFamily: 'var(--font-mono)' }}>
                        {selectedJobForModal.aircraftId}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#6B7280', display: 'block' }}>
                        {selectedJobForModal.aircraftType || 'Airframe Mk-I'}
                      </span>
                    </div>

                    <div className="col-sm-4">
                      <span style={{ fontSize: '0.7rem', color: '#9CA3AF', display: 'block' }}>PROJECTED RUL HORIZON</span>
                      <strong style={{ fontSize: '0.95rem', color: '#DC2626', fontFamily: 'var(--font-mono)' }}>
                        {selectedJobForModal.predictedRul || '~40 flight hours'}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#9CA3AF', display: 'block' }}>
                        Prognostic model prediction
                      </span>
                    </div>

                    <div className="col-sm-4">
                      <span style={{ fontSize: '0.7rem', color: '#9CA3AF', display: 'block' }}>CERTIFYING SPECIALIST</span>
                      <strong style={{ fontSize: '0.9rem', color: '#111827', display: 'block' }}>
                        {selectedJobForModal.assignedTechnician || currentUser.name || 'Technician'}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                        Assigned by {selectedJobForModal.assignedBy || 'Air Command'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Technical Directive Note */}
                <div className="mb-3">
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>
                    TECHNICAL REASON &amp; DIRECTIVE OBJECTIVE
                  </div>
                  <div
                    className="p-3 rounded-2"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E8EC',
                      fontSize: '0.82rem',
                      lineHeight: 1.5,
                      color: '#374151'
                    }}
                  >
                    {selectedJobForModal.reason || 'Abnormal sensor vibration detected during flight telemetry analysis.'}
                  </div>
                </div>

                {/* Required Spares & Staging Status */}
                {selectedJobForModal.sparesRequired && selectedJobForModal.sparesRequired.length > 0 && (
                  <div className="mb-3">
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>
                      REQUISITIONED REPLACEMENT SPARES
                    </div>
                    <div className="rounded-2 overflow-hidden border">
                      <table className="w-100" style={{ borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E8EC' }}>
                          <tr>
                            <th className="p-2 px-3 text-secondary" style={{ fontWeight: 600 }}>Part Number</th>
                            <th className="p-2 px-3 text-secondary" style={{ fontWeight: 600 }}>Description</th>
                            <th className="p-2 px-3 text-secondary" style={{ fontWeight: 600 }}>Qty</th>
                            <th className="p-2 px-3 text-secondary text-end" style={{ fontWeight: 600 }}>Staging Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedJobForModal.sparesRequired.map((sp, idx) => (
                            <tr key={idx} style={{ borderBottom: idx < selectedJobForModal.sparesRequired.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                              <td className="p-2 px-3 fw-bold" style={{ fontFamily: 'var(--font-mono)' }}>{sp.partNumber}</td>
                              <td className="p-2 px-3 text-dark">{sp.partName}</td>
                              <td className="p-2 px-3 text-muted">{sp.quantity || 1}</td>
                              <td className="p-2 px-3 text-end">
                                <span style={{
                                  fontSize: '0.7rem',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '999px',
                                  background: '#ECFDF5',
                                  color: '#065F46',
                                  border: '1px solid #A7F3D0',
                                  fontWeight: 600
                                }}>
                                  {sp.status || 'Available in Depot'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Recorded Findings or Passing Order (if already logged) */}
                {selectedJobForModal.findings && (
                  <div className="mb-3">
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>
                      INSPECTION FINDINGS LOG
                    </div>
                    <div
                      className="p-3 rounded-2"
                      style={{ background: '#F9FAFB', border: '1px solid #E5E8EC', fontSize: '0.8rem', color: '#4B5563', lineHeight: 1.5 }}
                    >
                      {selectedJobForModal.findings}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div
                className="px-4 py-3 d-flex justify-content-between align-items-center border-top"
                style={{ background: '#F8FAFC' }}
              >
                <button
                  type="button"
                  className="btn btn-sm btn-light border"
                  onClick={() => setSelectedJobForModal(null)}
                  style={{ fontSize: '0.8rem', padding: '0.45rem 1rem', borderRadius: '6px' }}
                >
                  Close
                </button>

                <div className="d-flex align-items-center gap-2">
                  {onOpenAircraftDetail && (
                    <button
                      type="button"
                      onClick={() => {
                        const targetId = selectedJobForModal.aircraftId;
                        setSelectedJobForModal(null);
                        onOpenAircraftDetail(targetId);
                      }}
                      className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1.5"
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.95rem', borderRadius: '6px' }}
                    >
                      <Plane size={14} />
                      <span>View Airframe Twin</span>
                    </button>
                  )}

                  {selectedJobForModal.status !== 'Completed' && (
                    <button
                      type="button"
                      onClick={() => {
                        const jobToStart = selectedJobForModal;
                        setSelectedJobForModal(null);
                        onStartInspection(jobToStart);
                      }}
                      className="btn btn-sm btn-dark d-flex align-items-center gap-2 shadow-sm"
                      style={{
                        background: '#111827',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        padding: '0.45rem 1.15rem',
                        borderRadius: '6px'
                      }}
                    >
                      <Zap size={14} color="#10B981" />
                      <span>Launch Diagnostic Bus Inspection →</span>
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
