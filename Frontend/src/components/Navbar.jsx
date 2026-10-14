import React, { useState, useEffect } from 'react';
import {
  Plane,
  AlertTriangle,
  Cpu,
  Wrench,
  Package,
  BarChart3,
  LogOut,
  PlusCircle,
  CheckSquare,
  Bell,
  User,
  Clock,
  Compass,
  Zap
} from 'lucide-react';

export default function Navbar({
  activePage,
  setActivePage,
  alerts = [],
  currentUser = null,
  onLogout,
  onOpenAssignJobModal
}) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const criticalAlertsCount = alerts.filter(a => a.severity === 'Critical' && a.status === 'Active').length;
  const isAdmin = currentUser?.role === 'Admin';
  const isTechnician = currentUser?.role === 'Technician';

  return (
    <div className="skyline-navbar-container">
      <header className="skyline-navbar">
        {/* Left: Brand Identity with Winged Emblem */}
        <div className="d-flex align-items-center gap-3">
          <button 
            onClick={() => {
              if (currentUser) {
                setActivePage(isAdmin ? 'fleet' : 'technician-dashboard');
              } else {
                setActivePage('landing');
              }
            }} 
            className="p-0 text-decoration-none skyline-brand"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            title="D.R.I.S.H.T.I. Tactical Home"
          >
            <div className="skyline-brand-icon">
              {/* Winged Aviation Emblem SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.2c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/>
              </svg>
            </div>
            <div>
              <span className="fw-bold tracking-tight text-dark" style={{ letterSpacing: '0.04em' }}>
                D.R.I.S.H.T.I.
              </span>
            </div>
          </button>
        </div>

        {/* Center: Skyline Pill Navigation */}
        <nav className="skyline-nav-pills d-none d-md-flex">
          {isAdmin && (
            <>
              <button
                onClick={() => setActivePage('fleet')}
                className={`skyline-nav-link ${activePage === 'fleet' ? 'active' : ''}`}
              >
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActivePage('aircraft')}
                className={`skyline-nav-link ${activePage === 'aircraft' ? 'active' : ''}`}
              >
                <Plane size={15} />
                <span>Aircraft</span>
              </button>

              <button
                onClick={() => setActivePage('maintenance')}
                className={`skyline-nav-link ${activePage === 'maintenance' ? 'active' : ''}`}
              >
                <span>Engineers &amp; Work</span>
              </button>

              <button
                onClick={() => setActivePage('spares')}
                className={`skyline-nav-link ${activePage === 'spares' ? 'active' : ''}`}
              >
                <span>Logistics</span>
              </button>

              <button
                onClick={() => setActivePage('analytics')}
                className={`skyline-nav-link ${activePage === 'analytics' ? 'active' : ''}`}
              >
                <span>Reports</span>
              </button>
            </>
          )}

          {isTechnician && (
            <>
              <button
                onClick={() => setActivePage('technician-dashboard')}
                className={`skyline-nav-link ${activePage === 'technician-dashboard' ? 'active' : ''}`}
              >
                <CheckSquare size={14} />
                <span>My Assigned Work</span>
              </button>

              <button
                onClick={() => setActivePage('aircraft')}
                className={`skyline-nav-link ${activePage === 'aircraft' ? 'active' : ''}`}
              >
                <Plane size={14} />
                <span>Aircraft Twin</span>
              </button>
            </>
          )}

          {/* Only unauthenticated visitors see the Overview landing link */}
          {!currentUser && (
            <button
              onClick={() => setActivePage('landing')}
              className={`skyline-nav-link ${activePage === 'landing' ? 'active' : ''}`}
            >
              <span>Overview</span>
            </button>
          )}
        </nav>

        {/* Right Header Controls (Notification Bell, Secure User Badge Capsule, Action Button) */}
        <div className="skyline-header-right">
          {/* Quick Assign Button for Admin */}
          {isAdmin && onOpenAssignJobModal && (
            <button
              onClick={onOpenAssignJobModal}
              className="skyline-btn-dark py-1 px-3 d-none d-lg-inline-flex"
              style={{ fontSize: '0.8rem' }}
            >
              <PlusCircle size={14} />
              <span>Assign Job</span>
            </button>
          )}

          {/* Notification Bell with Red Badge Dot */}
          <button
            onClick={() => setActivePage(currentUser?.role === 'Technician' ? 'technician-dashboard' : 'fleet')}
            className="skyline-icon-btn"
            title="Active Anomaly Alerts"
          >
            <Bell size={17} />
            {criticalAlertsCount > 0 && <span className="skyline-badge-dot"></span>}
          </button>

          {/* Secure User Capsule (Read-Only Identity Display with Single-Click Logout) */}
          {currentUser ? (
            <div className="skyline-user-capsule">
              {/* User Avatar Circle with Role Ring */}
              <div
                className="skyline-avatar"
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#252830',
                  border: `2px solid ${isAdmin ? '#FFA034' : '#1DC30A'}`,
                  color: '#FFFFFF',
                  fontWeight: '700',
                  marginLeft: 0
                }}
                title={`${currentUser.name} (${currentUser.role})`}
              >
                {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('') : 'U'}
              </div>

              {/* Read-Only Authenticated User Identity */}
              <div className="d-flex flex-column text-start font-sans px-1" style={{ maxWidth: '175px' }}>
                <div className="d-flex align-items-center gap-1">
                  <span className="fw-bold text-dark text-truncate" style={{ fontSize: '0.8rem', lineHeight: 1.2 }}>
                    {currentUser.name}
                  </span>
                  <span
                    className="skyline-pill"
                    style={{
                      fontSize: '0.58rem',
                      padding: '0.08rem 0.4rem',
                      background: isAdmin ? 'rgba(255, 160, 52, 0.12)' : 'rgba(29, 195, 10, 0.12)',
                      color: isAdmin ? '#B56700' : '#0F8205',
                      border: `1px solid ${isAdmin ? 'rgba(255, 160, 52, 0.3)' : 'rgba(29, 195, 10, 0.3)'}`
                    }}
                  >
                    {isAdmin ? 'ADMIN' : 'TECH'}
                  </span>
                </div>
                <span className="text-muted text-truncate" style={{ fontSize: '0.66rem', lineHeight: 1.1 }}>
                  {currentUser.station || currentUser.base || currentUser.squadron || (isAdmin ? 'Air HQ' : 'Maintenance Wing')}
                </span>
              </div>

              {/* Secure Logout Button */}
              <button
                onClick={onLogout}
                className="skyline-icon-btn logout text-danger"
                title="Sign Out & Lock Session"
                style={{ width: '30px', height: '30px' }}
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActivePage('login')}
              className="skyline-btn-dark py-1 px-3"
              style={{ fontSize: '0.82rem' }}
            >
              Sign In
            </button>
          )}
        </div>
      </header>
    </div>
  );
}
