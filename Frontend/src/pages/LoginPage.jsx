import React, { useState } from 'react';
import { Shield, User, ArrowRight, Plane, Lock, AlertCircle, RefreshCw, Key, CheckCircle } from 'lucide-react';
import { login } from '../services/api.js';

export default function LoginPage({ onLogin, onBackToLanding }) {
  const [usernameInput, setUsernameInput] = useState('arjun.mehta');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Unified, restrained persona data with clean typography and zero clashing colors
  const demoAccounts = [
    {
      username: 'arjun.mehta',
      password: 'password123',
      name: 'Arjun Mehta',
      role: 'Fleet Command Administrator',
      initials: 'AM',
      station: 'Headquarters • Air Command',
      scope: 'Full Fleet Command • Work Order Dispatch & Telemetry Oversight',
      squadron: 'HQ AIR COMMAND',
      badgeClass: 'skyline-pill-solid-dark',
      avatarBg: '#252830',
      avatarBorder: '#4A5568',
      isAdmin: true
    },
    {
      username: 'rahul.sharma',
      password: 'password123',
      name: 'Rahul Sharma',
      role: 'Propulsion Specialist',
      initials: 'RS',
      station: 'Ambala AFS • 45 Squadron',
      scope: 'Turbofan Boroscopic Diagnostics & Vibration Balancing [AF-04]',
      squadron: '45 SQN • FLYING DAGGERS',
      badgeClass: 'skyline-pill-amber',
      avatarBg: '#2D3748',
      avatarBorder: '#FFA034',
      isAdmin: false
    },
    {
      username: 'vikram.singh',
      password: 'password123',
      name: 'Vikram Singh',
      role: 'Hydraulics Specialist',
      initials: 'VS',
      station: 'Sulur AFS • 45 Squadron',
      scope: 'High-Pressure Hydraulic Actuator Line Inspection [AF-02]',
      squadron: '45 SQN • SULUR WING',
      badgeClass: 'skyline-pill-green',
      avatarBg: '#2D3748',
      avatarBorder: '#1DC30A',
      isAdmin: false
    },
    {
      username: 'aditya.verma',
      password: 'password123',
      name: 'Aditya Verma',
      role: 'Avionics Specialist',
      initials: 'AV',
      station: 'Gwalior AFS • 1 Squadron',
      scope: 'AESA Radar Bus & MIL-STD-1553B Digital Calibration [AF-05]',
      squadron: '1 SQN • TIGERS',
      badgeClass: 'skyline-pill-amber',
      avatarBg: '#2D3748',
      avatarBorder: '#60A5FA',
      isAdmin: false
    },
    {
      username: 'karan.gupta',
      password: 'password123',
      name: 'Karan Gupta',
      role: 'Fuel Systems Specialist',
      initials: 'KG',
      station: 'Pune AFS • 20 Squadron',
      scope: 'Internal Fuel Cells & Pressure Metering Valve Overhaul [AF-03]',
      squadron: '20 SQN • LIGHTNINGS',
      badgeClass: 'skyline-pill-green',
      avatarBg: '#2D3748',
      avatarBorder: '#34D399',
      isAdmin: false
    }
  ];

  const executeAuth = async (username, password) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await login(username, password);
      onLogin(result.user);
    } catch (err) {
      console.error('Authentication rejected:', err);
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    executeAuth(usernameInput, passwordInput);
  };

  const handleDemoClick = (acc) => {
    setUsernameInput(acc.username);
    setPasswordInput(acc.password);
    executeAuth(acc.username, acc.password);
  };

  return (
    <div className="py-4 px-3" style={{ background: '#F2F2F2', minHeight: 'calc(100vh - 80px)' }}>
      <div className="container py-2" style={{ maxWidth: '1120px' }}>
        
        {/* Navigation Breadcrumb Bar */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.68rem' }}>SECURITY GATEWAY</span>
            <span className="font-mono-tech text-secondary" style={{ fontSize: '0.76rem' }}>
              PROJECT D.R.I.S.H.T.I. • OPERATIONAL ACCESS CONTROL
            </span>
          </div>

          <button
            onClick={onBackToLanding}
            className="skyline-btn-secondary py-1 px-3"
            style={{ fontSize: '0.78rem' }}
          >
            ← Return to Overview
          </button>
        </div>

        {/* Unified, Restrained Authentication Card */}
        <div className="skyline-card p-0 overflow-hidden shadow-sm border" style={{ borderRadius: '20px', borderColor: '#E5E8EC', background: '#FFFFFF' }}>
          <div className="row g-0">
            
            {/* Left Column: Direct Encrypted Sign-In (Clean, Restrained Slate Surface) */}
            <div className="col-12 col-lg-5 p-4 p-md-5 d-flex flex-column justify-content-between border-end" style={{ background: '#FBFBFC', borderColor: '#E5E8EC' }}>
              <div>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '28px', height: '28px', background: '#333333', color: '#FFFFFF' }}>
                    <Shield size={14} />
                  </div>
                  <span className="fw-bold font-mono-tech text-dark" style={{ fontSize: '0.86rem', letterSpacing: '0.04em' }}>
                    AUTHENTICATION
                  </span>
                </div>

                <h3 className="fw-bold text-dark mb-1" style={{ letterSpacing: '-0.02em', fontSize: '1.4rem' }}>
                  Sign in to D.R.I.S.H.T.I.
                </h3>
                <p className="text-secondary small mb-4 font-sans" style={{ fontSize: '0.84rem', lineHeight: 1.55 }}>
                  Access the Aeronautical Decision Support Platform with your service credentials or select a verified operational persona.
                </p>

                {/* Direct Manual Credentials Form */}
                <form onSubmit={handleManualSubmit} className="p-3 bg-white rounded-3 border" style={{ borderColor: '#E5E8EC' }}>
                  <div className="d-flex align-items-center justify-content-between mb-2 pb-1 border-bottom">
                    <span className="font-mono-tech fw-bold text-dark" style={{ fontSize: '0.72rem' }}>
                      SERVICE CREDENTIALS
                    </span>
                    <Lock size={12} className="text-muted" />
                  </div>
                  
                  <div className="mb-3">
                    <label className="font-mono-tech text-secondary d-block mb-1" style={{ fontSize: '0.72rem' }}>
                      SERVICE ID / USERNAME
                    </label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-light border" style={{ borderColor: '#D1D5DB', color: '#5C6270' }}>
                        <User size={13} />
                      </span>
                      <input
                        type="text"
                        className="form-control font-mono-tech border"
                        style={{ borderColor: '#D1D5DB', fontSize: '0.82rem', color: '#333333' }}
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder="e.g. arjun.mehta"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="font-mono-tech text-secondary d-block mb-1" style={{ fontSize: '0.72rem' }}>
                      SECURITY PASSWORD
                    </label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-light border" style={{ borderColor: '#D1D5DB', color: '#5C6270' }}>
                        <Lock size={13} />
                      </span>
                      <input
                        type="password"
                        className="form-control font-mono-tech border"
                        style={{ borderColor: '#D1D5DB', fontSize: '0.82rem', color: '#333333' }}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="skyline-btn-dark w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{ fontSize: '0.84rem', padding: '0.6rem 1rem' }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={14} className="spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <Key size={14} />
                        <span>Sign In with JWT</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Defense Staff College Attribution */}
              <div className="mt-4 pt-3 border-top font-mono-tech text-muted" style={{ borderColor: '#E5E8EC', fontSize: '0.7rem' }}>
                <div>MINISTRY OF DEFENCE • DEFENCE SERVICES STAFF COLLEGE</div>
                <div className="mt-1" style={{ color: '#828894' }}>SECURE AERONAUTICAL SURVEILLANCE GATEWAY</div>
              </div>
            </div>

            {/* Right Column: 1-Click Operational Persona Profiles */}
            <div className="col-12 col-lg-7 p-4 p-md-5 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                  <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.65rem' }}>1-CLICK VERIFIED ACCESS</span>
                  <h4 className="fw-bold text-dark mb-0 font-mono-tech mt-1" style={{ fontSize: '1.2rem' }}>
                    Select Operational Persona
                  </h4>
                </div>
                <span className="font-mono-tech text-muted" style={{ fontSize: '0.7rem' }}>
                  JWT SIGNED • 7-DAY
                </span>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="alert alert-danger d-flex align-items-start gap-2 py-2 px-3 mb-3 font-mono-tech small" role="alert">
                  <AlertCircle size={15} className="text-danger flex-shrink-0 mt-1" />
                  <div>
                    <strong className="d-block">Authentication Error:</strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Persona Accounts List */}
              <div className="d-flex flex-column gap-2">
                {demoAccounts.map((acc) => {
                  return (
                    <div
                      key={acc.username}
                      className="p-3 rounded-3 d-flex flex-wrap justify-content-between align-items-center gap-2 transition-all"
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleDemoClick(acc)}
                    >
                      <div className="d-flex align-items-center gap-3">
                        {/* Avatar */}
                        <div 
                          className="skyline-avatar"
                          style={{
                            width: '38px',
                            height: '38px',
                            backgroundColor: acc.avatarBg || '#252830',
                            border: `2px solid ${acc.avatarBorder || '#CBD5E1'}`,
                            color: '#FFFFFF',
                            fontWeight: '700',
                            fontSize: '0.8rem'
                          }}
                        >
                          {acc.initials}
                        </div>

                        <div>
                          <div className="d-flex flex-wrap align-items-center gap-2">
                            <span className="fw-bold text-dark font-mono-tech" style={{ fontSize: '0.9rem' }}>
                              {acc.name}
                            </span>
                            <span className={`skyline-pill ${acc.badgeClass}`} style={{ fontSize: '0.64rem', padding: '0.12rem 0.5rem' }}>
                              {acc.role}
                            </span>
                            {acc.squadron && (
                              <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.6rem', padding: '0.1rem 0.45rem' }}>
                                {acc.squadron}
                              </span>
                            )}
                          </div>
                          
                          <div className="text-muted font-mono-tech mt-0.5" style={{ fontSize: '0.72rem' }}>
                            {acc.station}
                          </div>
                          <div className="text-secondary font-mono-tech" style={{ fontSize: '0.7rem' }}>
                            {acc.scope}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleDemoClick(acc); }}
                        className={acc.isAdmin ? 'skyline-btn-dark px-3 py-1' : 'skyline-btn-secondary px-3 py-1'}
                        style={{ fontSize: '0.76rem' }}
                        disabled={loading}
                      >
                        <span>{acc.isAdmin ? 'Command Access' : 'Sign In'}</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Footer Credentials Note */}
              <div className="mt-3 pt-2 d-flex justify-content-between align-items-center text-muted font-mono-tech" style={{ fontSize: '0.7rem' }}>
                <span>DEFAULT PASSWORD: password123</span>
                <span>AUTHENTICATED BY MONGODB ATLAS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
