import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import FleetOverview from './pages/FleetOverview.jsx';
import AircraftDetail from './pages/AircraftDetail.jsx';
import MaintenanceHistory from './pages/MaintenanceHistory.jsx';
import SparesInventory from './pages/SparesInventory.jsx';
import AnalyticsDashboard from './pages/AnalyticsDashboard.jsx';
import TechnicianDashboard from './pages/TechnicianDashboard.jsx';
import InspectionPortal from './components/InspectionPortal.jsx';
import JobAssignmentModal from './components/JobAssignmentModal.jsx';
import WorkOrderModal from './components/WorkOrderModal.jsx';
import {
  getStoredUser,
  getCurrentUser,
  login,
  logout,
  fetchUsers,
  fetchAircraft,
  fetchAlerts,
  fetchSpares,
  fetchWorkOrders,
  createNewWorkOrder,
  startMaintenanceOrder,
  completeMaintenanceOrder,
  validateMaintenanceOrder,
  requisitionSparePart,
  fetchTelemetry
} from './services/api.js';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [usersList, setUsersList] = useState([]);
  const [selectedAircraftId, setSelectedAircraftId] = useState('AF-04');
  const [aircraftList, setAircraftList] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [spares, setSpares] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(null);

  // Inspection Portal State
  const [inspectingJob, setInspectingJob] = useState(null);
  const [inspectingTelemetry, setInspectingTelemetry] = useState(null);

  // Admin Job Assignment Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Work Order Modal State (Generic)
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    initialAlert: null,
    initialAircraftId: 'AF-04',
    existingOrder: null
  });

  // Load all data from backend
  const refreshAllData = async () => {
    try {
      setBackendError(null);
      const [acData, alData, spData, woData, uData] = await Promise.all([
        fetchAircraft().catch(err => { throw err; }),
        fetchAlerts().catch(err => { throw err; }),
        fetchSpares().catch(err => { throw err; }),
        fetchWorkOrders().catch(err => { throw err; }),
        fetchUsers().catch(() => [])
      ]);
      setAircraftList(acData || []);
      setAlerts(alData || []);
      setSpares(spData || []);
      setWorkOrders(woData || []);
      if (uData && uData.length > 0) setUsersList(uData);
    } catch (e) {
      console.error('Backend connection error:', e);
      setBackendError(e.message || 'Unable to connect to backend server on http://localhost:5001');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verify stored JWT session with backend
    const verifySession = async () => {
      try {
        const verifiedUser = await getCurrentUser();
        if (verifiedUser) {
          setCurrentUser(verifiedUser);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.warn('Session verification error:', err);
        setCurrentUser(null);
      }
    };
    verifySession();
    refreshAllData();
  }, []);

  // Handlers for Authentication & Role Switching
  const handleLogin = (user) => {
    setCurrentUser(user);
    setBackendError(null);
    refreshAllData();
    if (user.role === 'Admin') {
      setActivePage('fleet');
    } else {
      setActivePage('technician-dashboard');
    }
  };

  const handleSwitchUser = async (username) => {
    try {
      setLoading(true);
      const result = await login(username, 'password123');
      setCurrentUser(result.user);
      setBackendError(null);
      await refreshAllData();
      if (result.user.role === 'Admin') {
        setActivePage('fleet');
      } else {
        setActivePage('technician-dashboard');
      }
    } catch (e) {
      alert(`Account switch failed: ${e.message}\nMake sure backend is running on http://localhost:5001.`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setActivePage('login');
  };

  const handleSelectAircraft = (id) => {
    setSelectedAircraftId(id);
  };

  // Technician Workflow: Start Inspection
  const handleStartInspection = async (job) => {
    try {
      if (job.orderId) {
        await startMaintenanceOrder(job.orderId, job);
        await refreshAllData();
      }
      const telem = await fetchTelemetry(job.aircraftId || 'AF-04');
      setInspectingTelemetry(telem);
      setInspectingJob({ ...job, status: 'In Progress' });
    } catch (err) {
      console.warn('Backend start order notice:', err.message);
      // Even if network or database encounters transient issue, open inspection portal
      try {
        const telem = await fetchTelemetry(job.aircraftId || 'AF-04');
        setInspectingTelemetry(telem);
      } catch (e) {
        // fallback telemetry
      }
      setInspectingJob({ ...job, status: 'In Progress' });
    }
  };

  // Technician Workflow: Complete Inspection
  const handleCompleteInspection = async (orderId, outcomeData) => {
    try {
      await completeMaintenanceOrder(orderId, outcomeData);
      await refreshAllData();
    } catch (err) {
      alert(`Failed to complete inspection: ${err.message}`);
    }
  };

  // Admin Workflow: Validate Inspection Report & Issue Passing Order
  const handleValidateOrder = async (orderId, validationData) => {
    try {
      await validateMaintenanceOrder(orderId, validationData);
      await refreshAllData();
    } catch (err) {
      alert(`Failed to validate order and issue passing directive: ${err.message}`);
    }
  };

  // Admin Workflow: Assign Job to Technician
  const handleAssignJob = async (jobData) => {
    try {
      await createNewWorkOrder(jobData);
      await refreshAllData();
    } catch (err) {
      alert(`Failed to assign job: ${err.message}`);
    }
  };

  // Generic Work Order Handlers
  const handleOpenWorkOrderModal = (initialAlert = null, initialAircraftId = 'AF-04', existingOrder = null) => {
    setModalConfig({
      isOpen: true,
      initialAlert,
      initialAircraftId: initialAircraftId || selectedAircraftId,
      existingOrder
    });
  };

  const handleCloseWorkOrderModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleSaveWorkOrder = async (orderData) => {
    try {
      if (modalConfig.existingOrder) {
        await completeMaintenanceOrder(modalConfig.existingOrder.orderId, orderData);
      } else {
        await createNewWorkOrder(orderData);
      }
      await refreshAllData();
      handleCloseWorkOrderModal();
    } catch (err) {
      alert(`Work order error: ${err.message}`);
    }
  };

  const handleRequisitionSpare = async (partNumber, data) => {
    try {
      await requisitionSparePart(partNumber, data);
      await refreshAllData();
    } catch (err) {
      alert(`Requisition error: ${err.message}`);
    }
  };

  const currentAircraft = aircraftList.find(a => a.aircraftId === selectedAircraftId) || aircraftList[0];

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-app)', color: 'var(--slate-900)' }}>
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          if (!currentUser && page !== 'landing') {
            setActivePage('login');
          } else {
            setActivePage(page);
          }
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAssignJobModal={() => setIsAssignModalOpen(true)}
      />

      {/* Backend Offline / Connection Error Banner */}
      {backendError && (
        <div className="bg-danger text-white py-2 px-3 text-center font-mono-tech d-flex justify-content-between align-items-center" style={{ fontSize: '0.78rem' }}>
          <div>
            <strong>⚠️ BACKEND DISCONNECTED:</strong> {backendError}. Ensure backend server is running on port 5001.
          </div>
          <button onClick={refreshAllData} className="btn btn-sm btn-light py-0 px-2 font-mono-tech" style={{ fontSize: '0.72rem' }}>
            Retry Connection ⟳
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow-1">
        {loading ? (
          <div className="container py-5 text-center text-muted font-mono-tech">
            <div className="spinner-border spinner-border-sm text-warning me-2" role="status"></div>
            CONNECTING TO MONGODB ATLAS &amp; VERIFYING TELEMETRY STREAMS...
          </div>
        ) : (
          <>
            {/* 1. Landing Page */}
            {activePage === 'landing' && (
              <LandingPage
                onNavigate={(page) => {
                  if (page === 'login' || !currentUser) {
                    setActivePage('login');
                  } else {
                    setActivePage(page);
                  }
                }}
                aircraftList={aircraftList}
                alerts={alerts}
              />
            )}

            {/* 2. Login Page */}
            {activePage === 'login' && (
              <LoginPage
                onLogin={handleLogin}
                onBackToLanding={() => setActivePage('landing')}
              />
            )}

            {/* Protected Screens - require authentication */}
            {!currentUser && activePage !== 'landing' && activePage !== 'login' && (
              <LoginPage
                onLogin={handleLogin}
                onBackToLanding={() => setActivePage('landing')}
              />
            )}

            {/* 3. Dedicated Technician Dashboard (My Assigned Work) */}
            {currentUser && activePage === 'technician-dashboard' && !inspectingJob && (
              <TechnicianDashboard
                currentUser={currentUser}
                workOrders={workOrders}
                aircraftList={aircraftList}
                onStartInspection={handleStartInspection}
                onNavigate={setActivePage}
                onOpenAircraftDetail={(acId) => {
                  setSelectedAircraftId(acId);
                  setActivePage('aircraft');
                }}
              />
            )}


            {/* 3c. Full-Screen Inspection & Certification Page */}
            {currentUser && inspectingJob && (
              <InspectionPortal
                job={inspectingJob}
                aircraft={aircraftList.find(a => a.aircraftId === inspectingJob.aircraftId) || currentAircraft}
                telemetry={inspectingTelemetry}
                onCompleteInspection={handleCompleteInspection}
                onClose={() => setInspectingJob(null)}
              />
            )}

            {/* 4. Admin Screens */}
            {currentUser && activePage === 'fleet' && (
              <FleetOverview
                aircraftList={aircraftList}
                alerts={alerts}
                workOrders={workOrders}
                onSelectAircraft={(id) => {
                  setSelectedAircraftId(id);
                }}
                onNavigate={setActivePage}
                onOpenAssignJobModal={() => setIsAssignModalOpen(true)}
                onValidateOrder={handleValidateOrder}
              />
            )}

            {currentUser && activePage === 'aircraft' && (
              <AircraftDetail
                aircraft={currentAircraft}
                alerts={alerts}
                workOrders={workOrders}
                onNavigate={setActivePage}
                onOpenWorkOrderModal={handleOpenWorkOrderModal}
              />
            )}

            {currentUser && activePage === 'predictive' && (
              <FleetOverview
                aircraftList={aircraftList}
                alerts={alerts}
                workOrders={workOrders}
                onSelectAircraft={setSelectedAircraftId}
                onNavigate={setActivePage}
                onOpenAssignJobModal={() => setIsAssignModalOpen(true)}
                onValidateOrder={handleValidateOrder}
              />
            )}

            {currentUser && activePage === 'maintenance' && (
              <MaintenanceHistory
                workOrders={workOrders}
                aircraftList={aircraftList}
                usersList={usersList}
                onOpenWorkOrderModal={handleOpenWorkOrderModal}
                onCompleteWorkOrder={handleCompleteInspection}
                onOpenAssignJobModal={() => setIsAssignModalOpen(true)}
                onValidateOrder={handleValidateOrder}
              />
            )}

            {currentUser && activePage === 'spares' && (
              <SparesInventory
                spares={spares}
                alerts={alerts}
                onRequisitionPart={handleRequisitionSpare}
                onNavigate={setActivePage}
              />
            )}

            {currentUser && activePage === 'analytics' && (
              <AnalyticsDashboard />
            )}
          </>
        )}
      </main>

      {/* Engineering Footer */}
      <footer className="py-3 font-mono-tech" style={{ backgroundColor: '#20242C', color: '#A0AEC0', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.74rem' }}>
        <div className="container-fluid px-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="skyline-pill" style={{ fontSize: '0.62rem', padding: '0.12rem 0.5rem', background: '#2D3748', border: '1px solid #4A5568', color: '#E2E8F0' }}>
                SIH 2026 • PS 26249
              </span>
              <span className="fw-bold text-white">PROJECT D.R.I.S.H.T.I. — PREDICTIVE MAINTENANCE &amp; FLEET AVAILABILITY</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#718096' }}>
              Ministry of Defence (MoD) • Defence Services Staff College | Active Session: {currentUser ? `${currentUser.name} (${currentUser.role})` : 'Unauthenticated'}
            </div>
          </div>
          <div className="text-md-end" style={{ maxWidth: '460px', fontSize: '0.68rem', color: '#718096' }}>
            QUALIFIED AERONAUTICAL DECISION-SUPPORT PLATFORM. 
            NOT AN AIRCRAFT-CONTROL SYSTEM; QUALIFIED ENGINEERING JUDGEMENT MANDATORY.
          </div>
        </div>
      </footer>

      {/* Admin Job Assignment Modal */}
      <JobAssignmentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        aircraftList={aircraftList}
        usersList={usersList}
        onSubmitAssign={handleAssignJob}
      />

      {/* Generic Work Order Modal */}
      <WorkOrderModal
        isOpen={modalConfig.isOpen}
        onClose={handleCloseWorkOrderModal}
        aircraftList={aircraftList}
        alerts={alerts}
        initialAlert={modalConfig.initialAlert}
        initialAircraftId={modalConfig.initialAircraftId}
        existingOrder={modalConfig.existingOrder}
        onSubmitOrder={handleSaveWorkOrder}
      />
    </div>
  );
}
