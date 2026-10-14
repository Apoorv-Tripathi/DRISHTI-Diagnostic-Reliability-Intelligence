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
  Sparkles
} from 'lucide-react';
import AirworthinessReportModal from '../components/AirworthinessReportModal.jsx';

export default function MaintenanceHistory({
  workOrders = [],
  aircraftList = [],
  onOpenWorkOrderModal,
  onCompleteWorkOrder,
  onOpenAssignJobModal,
  onValidateOrder
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterTech, setFilterTech] = useState('ALL');
  const [selectedReportOrder, setSelectedReportOrder] = useState(null);

  const filteredOrders = workOrders.filter(w => {
    const matchesStatus = filterStatus === 'ALL' 
      ? true 
      : filterStatus === 'Pending Validation'
        ? w.status === 'Pending Command Validation'
        : w.status === filterStatus;
    const matchesTech = filterTech === 'ALL' || w.assignedTechnician?.toLowerCase().includes(filterTech.toLowerCase());
    return matchesStatus && matchesTech;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return { label: 'COMPLETED & CERTIFIED', dot: '#10B981', bg: 'rgba(16, 185, 129, 0.08)', border: '#10B981' };
      case 'Pending Command Validation':
        return { label: 'AWAITING PASSING ORDER', dot: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', border: '#F59E0B' };
      case 'Maintenance Directive Issued':
        return { label: 'MAINTENANCE DIRECTIVE ISSUED', dot: '#64748B', bg: 'rgba(100, 116, 139, 0.1)', border: '#64748B' };
      case 'In Progress':
        return { label: 'FLIGHT-LINE IN PROGRESS', dot: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)', border: '#F59E0B' };
      case 'Assigned':
        return { label: 'ASSIGNED TO BAY', dot: '#3B82F6', bg: 'rgba(59, 130, 246, 0.08)', border: '#3B82F6' };
      case 'Scheduled':
        return { label: 'SCHEDULED', dot: '#64748B', bg: 'rgba(100, 116, 139, 0.08)', border: '#64748B' };
      default:
        return { label: status, dot: '#64748B', bg: 'rgba(100, 116, 139, 0.08)', border: '#64748B' };
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
      case 'High':
        return { label: priority.toUpperCase(), color: '#DC2626', bg: 'rgba(220, 38, 38, 0.08)', border: '#FCA5A5' };
      case 'Medium':
        return { label: priority.toUpperCase(), color: '#D97706', bg: 'rgba(217, 119, 6, 0.08)', border: '#FDE68A' };
      case 'Low':
        return { label: priority.toUpperCase(), color: '#059669', bg: 'rgba(5, 150, 105, 0.08)', border: '#86EFAC' };
      default:
        return { label: priority, color: '#64748B', bg: '#F1F5F9', border: '#E2E8F0' };
    }
  };

  const pendingCount = workOrders.filter(w => w.status === 'Pending Command Validation').length;

  return (
    <div className="container-fluid px-3 px-md-4 py-3" style={{ maxWidth: '1440px' }}>
      
      {/* 1. TOP HEADER */}
      <div className="skyline-card p-4 mb-3" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.66rem', padding: '0.2rem 0.6rem' }}>
                DIRECTORATE OF AEROSPACE MAINTENANCE
              </span>
              <span className="font-mono-tech text-muted" style={{ fontSize: '0.74rem' }}>
                TECHNICAL RECORDS &amp; DISPATCH ROSTER
              </span>
              <span className="skyline-pill skyline-pill-green font-mono-tech" style={{ fontSize: '0.66rem', padding: '0.2rem 0.6rem' }}>
                ● ISO-13374 COMPLIANT DISPATCH
              </span>
            </div>
            
            <h2 className="fw-bold text-dark mb-1 font-sans" style={{ letterSpacing: '-0.02em', fontSize: '1.65rem' }}>
              Technician Job Assignments &amp; Work Orders
            </h2>
            <p className="text-secondary small mb-0 font-sans" style={{ fontSize: '0.84rem' }}>
              Real-time technician allocation, flight line GSE bus inspections, and formal airworthiness command passing orders.
            </p>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2">
            {onOpenAssignJobModal && (
              <button
                onClick={onOpenAssignJobModal}
                className="skyline-btn-dark d-flex align-items-center gap-1.5 shadow-sm"
                style={{ fontSize: '0.8rem', padding: '0.55rem 1.25rem' }}
              >
                <UserCheck size={15} />
                <span>Assign Job to Technician</span>
              </button>
            )}

            <button
              onClick={() => onOpenWorkOrderModal(null, 'AF-04')}
              className="skyline-btn-secondary d-flex align-items-center gap-1.5"
              style={{ fontSize: '0.8rem', padding: '0.55rem 1.1rem' }}
            >
              <Plus size={15} />
              <span>New Airworthiness Directive</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI METRICS STRIP */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="bg-white p-3 h-100" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
            <div className="d-flex justify-content-between align-items-center mb-2 font-mono-tech">
              <span className="text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>ACTIVE DIRECTIVES</span>
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>[FLIGHT LINE]</span>
            </div>
            <div className="fs-2 fw-bold text-dark font-mono-tech mb-2">
              {workOrders.filter(w => w.status !== 'Completed').length}
            </div>
            <div className="p-2 rounded-1 font-mono-tech text-muted" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.68rem' }}>
              Assigned or Active on Flight Line
            </div>
            <div className="mt-2 font-mono-tech text-muted d-flex justify-content-between" style={{ fontSize: '0.66rem' }}>
              <span>Ambala &amp; Pune Wings</span>
              <span className="text-primary">● In Progress</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="bg-white p-3 h-100" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
            <div className="d-flex justify-content-between align-items-center mb-2 font-mono-tech">
              <span className="text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>CRITICAL AOG RISK</span>
              <span style={{ fontSize: '0.7rem', color: '#DC2626' }}>[IMMEDIATE]</span>
            </div>
            <div className="fs-2 fw-bold font-mono-tech mb-2" style={{ color: '#DC2626' }}>
              {workOrders.filter(w => (w.priority === 'High' || w.priority === 'Critical') && w.status !== 'Completed').length}
            </div>
            <div className="p-2 rounded-1 font-mono-tech text-muted" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.68rem' }}>
              Mandates Immediate Engineering Intervention
            </div>
            <div className="mt-2 font-mono-tech text-muted d-flex justify-content-between" style={{ fontSize: '0.66rem' }}>
              <span>AF-04 &amp; AF-02 Interventions</span>
              <span className="text-danger">● Priority 1</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="bg-white p-3 h-100" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
            <div className="d-flex justify-content-between align-items-center mb-2 font-mono-tech">
              <span className="text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>DOWNTIME SAVED (YIELD)</span>
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>[RECOVERED]</span>
            </div>
            <div className="fs-2 fw-bold text-dark font-mono-tech mb-2">
              {workOrders.reduce((acc, curr) => acc + (curr.downtimeSavedEstimateHours || 0), 0).toFixed(1)}h
            </div>
            <div className="p-2 rounded-1 font-mono-tech text-muted" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.68rem' }}>
              Avoided Emergency Unscheduled Grounding
            </div>
            <div className="mt-2 font-mono-tech text-muted d-flex justify-content-between" style={{ fontSize: '0.66rem' }}>
              <span>Proactive Boroscopy Intercept</span>
              <span className="text-success">● ₹4.8Cr Value</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="bg-white p-3 h-100" style={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
            <div className="d-flex justify-content-between align-items-center mb-2 font-mono-tech">
              <span className="text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>COMPLETED CERTIFICATIONS</span>
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>[SORTIE READY]</span>
            </div>
            <div className="fs-2 fw-bold font-mono-tech mb-2" style={{ color: '#059669' }}>
              {workOrders.filter(w => w.status === 'Completed').length}
            </div>
            <div className="p-2 rounded-1 font-mono-tech text-muted" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.68rem' }}>
              Restored to Active Squadron Sortie Schedule
            </div>
            <div className="mt-2 font-mono-tech text-muted d-flex justify-content-between" style={{ fontSize: '0.66rem' }}>
              <span>Mirage-2000 (AF-05) Certified</span>
              <span className="text-success">● Mission Capable</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PENDING COMMAND VALIDATION NOTICE STRIP */}
      {pendingCount > 0 && (
        <div className="skyline-card p-3 mb-3 bg-white" style={{ borderLeft: '4px solid #D97706', boxShadow: '0 2px 14px rgba(217, 119, 6, 0.12)' }}>
          <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <span className="badge rounded-circle p-1 pulse-live" style={{ backgroundColor: '#D97706', width: '8px', height: '8px' }}></span>
              <strong className="text-dark font-mono-tech" style={{ fontSize: '0.88rem' }}>
                TECHNICIAN REPORTS AWAITING COMMAND VALIDATION ({pendingCount})
              </strong>
            </div>
            <span className="skyline-pill skyline-pill-amber font-mono-tech" style={{ fontSize: '0.68rem' }}>
              PASSING ORDER MANDATORY
            </span>
          </div>

          <div className="row g-2">
            {workOrders.filter(w => w.status === 'Pending Command Validation').map(pendingOrder => (
              <div key={pendingOrder.orderId} className="col-12 col-md-6">
                <div className="p-3 rounded-3 d-flex justify-content-between align-items-center font-mono-tech" style={{ background: '#FFFBEB', border: '1px solid #FDE68A', fontSize: '0.78rem' }}>
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <strong className="text-dark fs-6">{pendingOrder.aircraftId}</strong>
                      <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.65rem' }}>{pendingOrder.orderId}</span>
                      <span 
                        className="px-2 py-0.5 rounded-pill fw-semibold"
                        style={{ 
                          fontSize: '0.65rem',
                          background: pendingOrder.technicianRecommendation === 'FLIGHT_CLEARED' ? '#F0FDF4' : '#FEF2F2',
                          color: pendingOrder.technicianRecommendation === 'FLIGHT_CLEARED' ? '#059669' : '#DC2626',
                          border: `1px solid ${pendingOrder.technicianRecommendation === 'FLIGHT_CLEARED' ? '#86EFAC' : '#FCA5A5'}`
                        }}
                      >
                        {pendingOrder.technicianRecommendation === 'FLIGHT_CLEARED' ? 'FLIGHT CLEARANCE REQUESTED' : 'HEAVY MAINTENANCE RECOMMENDED'}
                      </span>
                    </div>
                    <div className="text-secondary small">
                      Specialist: <strong className="text-dark">{pendingOrder.assignedTechnician}</strong> • RUL: <strong className="text-danger">{pendingOrder.predictedRul || '~40h'}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedReportOrder(pendingOrder)}
                    className="skyline-btn-dark py-1.5 px-3 d-flex align-items-center gap-1.5 shadow-sm"
                    style={{ fontSize: '0.76rem', background: '#0F172A' }}
                  >
                    <FileText size={13} color="#F59E0B" />
                    <span>Review &amp; Issue Order →</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. FILTER TOOLBAR */}
      <div className="skyline-card p-3 mb-3" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          {/* Status Tabs */}
          <div className="d-flex flex-wrap align-items-center gap-1 bg-light p-1 rounded-pill border" style={{ borderColor: '#E2E8F0' }}>
            {['ALL', 'Pending Validation', 'In Progress', 'Assigned', 'Completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`skyline-pill-tab border-0 ${filterStatus === status ? 'active' : ''}`}
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.75rem' }}
              >
                {status.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Technician Filter & Count */}
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted font-mono-tech" style={{ fontSize: '0.7rem' }}>TECHNICIAN:</span>
              <select
                className="form-select form-select-sm font-mono-tech"
                value={filterTech}
                onChange={(e) => setFilterTech(e.target.value)}
                style={{ width: '190px', fontSize: '0.76rem', borderRadius: '14px', border: '1px solid #CBD5E1' }}
              >
                <option value="ALL">ALL TECHNICIANS</option>
                <option value="Rahul Sharma">Rahul Sharma (Powerplant)</option>
                <option value="Vikram Singh">Vikram Singh (Hydraulics)</option>
                <option value="Aditya Verma">Aditya Verma (Avionics)</option>
                <option value="Karan Gupta">Karan Gupta (Fuel)</option>
              </select>
            </div>

            <div className="text-muted font-mono-tech" style={{ fontSize: '0.75rem' }}>
              DIRECTIVES: <strong className="text-dark">{filteredOrders.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TECHNICIAN ASSIGNMENT ROSTER TABLE */}
      <div className="skyline-card p-0 overflow-hidden shadow-sm" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <div className="p-3 px-4 d-flex justify-content-between align-items-center border-bottom" style={{ background: '#F8FAFC' }}>
          <div className="d-flex align-items-center gap-2">
            <UserCheck size={16} color="#0F172A" />
            <span className="fw-bold text-dark font-mono-tech" style={{ fontSize: '0.9rem' }}>
              Technician Assignment Roster &amp; Flight Directives
            </span>
          </div>
          <span className="skyline-pill skyline-pill-green font-mono-tech" style={{ fontSize: '0.68rem' }}>
            ● REAL-TIME DISPATCH TRACKING
          </span>
        </div>

        <div className="table-responsive">
          <table className="skyline-table w-100">
            <thead>
              <tr>
                <th style={{ width: '12%' }}>AIRCRAFT</th>
                <th style={{ width: '22%' }}>JOB DIRECTIVE &amp; ID</th>
                <th style={{ width: '20%' }}>ASSIGNED SPECIALIST</th>
                <th style={{ width: '10%' }}>PRIORITY</th>
                <th style={{ width: '12%' }}>RUL HORIZON</th>
                <th style={{ width: '14%' }}>STATUS</th>
                <th className="text-end" style={{ width: '10%', whiteSpace: 'nowrap' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                const statusBadge = getStatusBadge(order.status);
                const priorityBadge = getPriorityBadge(order.priority);

                return (
                  <tr key={order.orderId}>
                    {/* Aircraft ID */}
                    <td className="font-mono-tech fw-bold">
                      <div className="d-flex align-items-center gap-2">
                        <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.75rem' }}>
                          {order.aircraftId}
                        </span>
                      </div>
                    </td>

                    {/* Job Directive & ID */}
                    <td>
                      <div className="fw-semibold text-dark font-sans" style={{ fontSize: '0.84rem' }}>
                        {order.jobType || order.title}
                      </div>
                      <small className="text-muted font-mono-tech" style={{ fontSize: '0.7rem' }}>
                        {order.orderId}
                      </small>
                    </td>

                    {/* Assigned Specialist */}
                    <td>
                      <div className="d-flex align-items-center gap-1.5 font-mono-tech" style={{ fontSize: '0.82rem' }}>
                        <User size={13} className="text-secondary" />
                        <strong className="text-dark">{order.assignedTechnician}</strong>
                      </div>
                      <small className="text-muted font-mono-tech" style={{ fontSize: '0.7rem' }}>
                        {order.station || 'Flight Line Bay'}
                      </small>
                    </td>

                    {/* Priority */}
                    <td>
                      <span 
                        className="font-mono-tech fw-semibold px-2 py-0.5 rounded-pill"
                        style={{
                          fontSize: '0.66rem',
                          background: priorityBadge.bg,
                          color: priorityBadge.color,
                          border: `1px solid ${priorityBadge.border}`
                        }}
                      >
                        {priorityBadge.label}
                      </span>
                    </td>

                    {/* RUL Horizon */}
                    <td className="font-mono-tech fw-semibold" style={{ fontSize: '0.78rem', color: '#DC2626' }}>
                      {order.predictedRul || '~40h'}
                    </td>

                    {/* Status */}
                    <td>
                      <span 
                        className="font-mono-tech fw-semibold d-inline-flex align-items-center gap-1.5 px-2 py-0.5 rounded-pill"
                        style={{
                          fontSize: '0.66rem',
                          background: statusBadge.bg,
                          color: statusBadge.dot,
                          border: `1px solid ${statusBadge.border}`
                        }}
                      >
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: statusBadge.dot }}></span>
                        {statusBadge.label}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="text-end" style={{ whiteSpace: 'nowrap' }}>
                      {order.status === 'Pending Command Validation' ? (
                        <button
                          onClick={() => setSelectedReportOrder(order)}
                          className="skyline-btn-dark py-1.5 px-3 d-flex align-items-center gap-1.5 ms-auto shadow-sm"
                          style={{ fontSize: '0.74rem', background: '#0F172A' }}
                        >
                          <FileText size={12} color="#F59E0B" />
                          <span>REVIEW &amp; ORDER</span>
                        </button>
                      ) : order.status === 'Completed' ? (
                        <button
                          onClick={() => setSelectedReportOrder(order)}
                          className="skyline-btn-secondary py-1.5 px-3 d-flex align-items-center gap-1.5 ms-auto"
                          style={{ fontSize: '0.74rem' }}
                        >
                          <CheckCircle2 size={12} color="#059669" />
                          <span>VIEW REPORT</span>
                        </button>
                      ) : order.status === 'Maintenance Directive Issued' ? (
                        <button
                          onClick={() => setSelectedReportOrder(order)}
                          className="skyline-btn-secondary py-1.5 px-3 d-flex align-items-center gap-1.5 ms-auto"
                          style={{ fontSize: '0.74rem' }}
                        >
                          <Wrench size={12} color="#D97706" />
                          <span>VIEW DIRECTIVE</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenWorkOrderModal(null, order.aircraftId, order)}
                          className="skyline-btn-secondary py-1.5 px-3 ms-auto"
                          style={{ fontSize: '0.74rem' }}
                        >
                          VIEW DETAILS
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Airworthiness Inspection Report Review Modal */}
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
