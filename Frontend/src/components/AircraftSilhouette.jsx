import React, { useState, useEffect } from 'react';
import {
  Radio,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Layers,
  Activity,
  AlertTriangle
} from 'lucide-react';

export default function AircraftSilhouette({ aircraft, selectedSubsystem, onSelectSubsystem }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState('exterior'); // 'exterior' | 'cutaway' | 'heatmap'
  const [isSimulating, setIsSimulating] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Dynamic simulation parameters (oscillating at 20Hz when active)
  const [simMetrics, setSimMetrics] = useState({
    gLoad: 2.1,
    airspeed: 420,
    altitude: 28000,
    engineVib: 4.8,
    egtTemp: 642,
    packetsIngested: 14250,
    strainMPa: 285
  });

  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimMetrics(prev => {
          const t = Date.now() / 1000;
          const gOsc = (2.2 + 1.8 * Math.sin(t * 1.5) + 0.4 * Math.cos(t * 3)).toFixed(1);
          const spd = Math.round(420 + 25 * Math.sin(t * 0.8));
          const alt = Math.round(28000 + 450 * Math.sin(t * 0.5));
          const vib = (4.8 + 0.6 * Math.sin(t * 4.2)).toFixed(2);
          const temp = Math.round(642 + 18 * Math.sin(t * 1.2));
          const strain = Math.round(285 + 65 * Math.sin(t * 2.1));
          return {
            gLoad: parseFloat(gOsc),
            airspeed: spd,
            altitude: alt,
            engineVib: parseFloat(vib),
            egtTemp: temp,
            packetsIngested: prev.packetsIngested + 20,
            strainMPa: strain
          };
        });
      }, 50); // 20Hz update loop
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  if (!aircraft || !aircraft.subsystems) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.35));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.85));

  // Subsystem definitions with clean icons and precise CAD coordinates
  const subsystems = [
    { id: 'engine', label: 'Turbofan E-01', node: { top: '51%', left: '58%' }, rul: '40h', status: aircraft.subsystems?.engine?.status || 'Warning' },
    { id: 'avionics', label: 'Avionics & Radar', node: { top: '53%', left: '18%' }, rul: '620h', status: aircraft.subsystems?.avionics?.status || 'Healthy' },
    { id: 'fuelAndEcs', label: 'Fuel & ECS', node: { top: '55%', left: '40%' }, rul: '310h', status: aircraft.subsystems?.fuelAndEcs?.status || 'Healthy' },
    { id: 'hydraulic', label: 'Hydraulics & FBW', node: { top: '56%', left: '70%' }, rul: '110h', status: aircraft.subsystems?.hydraulic?.status || 'Healthy' },
    { id: 'electrical', label: 'Electrical / APU', node: { top: '42%', left: '30%' }, rul: '450h', status: 'Healthy' }
  ];

  return (
    <div className="skyline-card p-0 overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      
      {/* 1. TOP HEADER TOOLBAR */}
      <div className="d-flex flex-wrap justify-content-between align-items-center p-3 px-4 border-bottom gap-2" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
        <div className="d-flex align-items-center gap-2">
          <div className="d-flex align-items-center justify-content-center rounded-2" style={{ width: '28px', height: '28px', background: '#0F172A', color: '#FFFFFF' }}>
            <Radio size={14} />
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold font-mono-tech text-dark" style={{ fontSize: '0.88rem' }}>
              {aircraft.aircraftId} • 3D DIGITAL TWIN &amp; STRUCTURAL AIRFRAME
            </span>
            <span className="skyline-pill skyline-pill-dark font-mono-tech d-none d-sm-inline" style={{ fontSize: '0.65rem' }}>
              {aircraft.type}
            </span>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="d-flex align-items-center gap-1 bg-white p-1 rounded-pill border shadow-sm" style={{ borderColor: '#E2E8F0' }}>
          <button
            onClick={() => setViewMode('exterior')}
            className={`skyline-pill-tab border-0 ${viewMode === 'exterior' ? 'active' : ''}`}
            style={{ fontSize: '0.7rem', padding: '0.2rem 0.65rem' }}
          >
            3D Exterior
          </button>
          <button
            onClick={() => setViewMode('cutaway')}
            className={`skyline-pill-tab border-0 ${viewMode === 'cutaway' ? 'active' : ''}`}
            style={{ fontSize: '0.7rem', padding: '0.2rem 0.65rem' }}
          >
            Mechanical Cutaway
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`skyline-pill-tab border-0 ${viewMode === 'heatmap' ? 'active' : ''}`}
            style={{ fontSize: '0.7rem', padding: '0.2rem 0.65rem' }}
          >
            FEA Stress Heatmap
          </button>
        </div>
      </div>

      {/* 2. SIMULATION & TELEMETRY CONTROL STRIP */}
      <div className="d-flex flex-wrap justify-content-between align-items-center p-2.5 px-4 border-bottom font-mono-tech" style={{ background: '#FFFFFF', fontSize: '0.75rem', borderColor: '#F1F5F9' }}>
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => setIsSimulating(prev => !prev)}
            className={isSimulating ? 'skyline-btn-secondary py-1 px-2.5 d-flex align-items-center gap-1.5' : 'skyline-btn-dark py-1 px-2.5 d-flex align-items-center gap-1.5'}
            style={{ fontSize: '0.72rem' }}
          >
            {isSimulating ? (
              <>
                <Pause size={12} color="#DC2626" />
                <span>Pause Dynamics</span>
              </>
            ) : (
              <>
                <Play size={12} color="#10B981" />
                <span>▶ Run 20Hz Flight Dynamics</span>
              </>
            )}
          </button>

          {isSimulating && (
            <span className="skyline-pill skyline-pill-green font-mono-tech d-flex align-items-center gap-1" style={{ fontSize: '0.64rem' }}>
              <span className="badge rounded-circle p-1 pulse-live" style={{ backgroundColor: '#10B981', width: '6px', height: '6px' }}></span>
              LIVE 20Hz INGESTION
            </span>
          )}
        </div>

        {/* Live Metrics */}
        <div className="d-flex flex-wrap align-items-center gap-3 text-secondary font-mono-tech" style={{ fontSize: '0.74rem' }}>
          <div>
            <span className="text-muted">G-LOAD:</span>{' '}
            <strong className={simMetrics.gLoad > 3.0 ? 'text-danger' : 'text-dark'}>
              {isSimulating ? `${simMetrics.gLoad} G` : '+2.4 G'}
            </strong>
          </div>
          <div>
            <span className="text-muted">FEA STRESS:</span>{' '}
            <strong className="text-dark">
              {isSimulating ? `${simMetrics.strainMPa} MPa` : '285 MPa'}
            </strong>
          </div>
          <div>
            <span className="text-muted">EGT TEMP:</span>{' '}
            <strong className="text-dark">
              {isSimulating ? `${simMetrics.egtTemp}°C` : '642°C'}
            </strong>
          </div>
          <div>
            <span className="text-muted">TURBINE VIB:</span>{' '}
            <strong style={{ color: '#DC2626' }}>
              {isSimulating ? `${simMetrics.engineVib} mm/s` : '5.2 mm/s'}
            </strong>
          </div>
          <div className="d-none d-md-inline">
            <span className="text-muted">BUS PACKETS:</span>{' '}
            <strong className="text-dark">{simMetrics.packetsIngested.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* 3. MAIN VISUAL AIRFRAME CANVAS */}
      <div 
        className="position-relative d-flex align-items-center justify-content-center p-3"
        style={{ 
          minHeight: '340px', 
          background: viewMode === 'heatmap' ? '#0F172A' : '#FAFAFA',
          overflow: 'hidden',
          transition: 'background 0.25s ease'
        }}
      >
        {/* Zoom Controls */}
        <div 
          className="position-absolute d-flex flex-column rounded-pill overflow-hidden shadow-sm bg-white border"
          style={{ bottom: '1rem', left: '1rem', zIndex: 10, borderColor: '#E2E8F0' }}
        >
          <button 
            onClick={handleZoomIn} 
            className="aircraft-zoom-btn text-dark" 
            title="Zoom In"
            style={{ width: '30px', height: '30px', fontSize: '0.95rem', fontWeight: 700 }}
          >
            +
          </button>
          <div style={{ height: '1px', background: '#E2E8F0' }}></div>
          <button 
            onClick={handleZoomOut} 
            className="aircraft-zoom-btn text-dark" 
            title="Zoom Out"
            style={{ width: '30px', height: '30px', fontSize: '1rem', fontWeight: 700 }}
          >
            -
          </button>
        </div>

        {/* 360 Indicator */}
        <div 
          className="position-absolute d-flex align-items-center gap-1.5 bg-white rounded-pill px-2.5 py-1 shadow-sm border font-mono-tech"
          style={{ bottom: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10, borderColor: '#E2E8F0', fontSize: '0.68rem', color: '#334155' }}
        >
          <span className="text-dark fw-bold">360°</span>
          <span className="text-muted">‹ ›</span>
          <span>{viewMode === 'cutaway' ? 'MECHANICAL CUTAWAY' : viewMode === 'heatmap' ? 'FEA STRESS GRADIENT' : 'AERODYNAMIC EXTERIOR'}</span>
        </div>

        {/* Airframe CAD Render */}
        <div 
          className="w-100 position-relative d-flex align-items-center justify-content-center py-2"
          style={{ 
            transform: `scale(${zoomLevel})`, 
            transition: 'transform 0.25s ease',
            maxWidth: '820px'
          }}
        >
          {viewMode === 'cutaway' ? (
            <img 
              src="/images/cad/cad-aircraft-cutaway-hd.png" 
              alt="Mechanical Cutaway"
              className="img-fluid"
              style={{ maxHeight: '270px', objectFit: 'contain' }}
            />
          ) : (
            <img 
              src="/images/cad/cad-aircraft-exterior-hd.png" 
              alt="Aircraft CAD Exterior"
              className="img-fluid"
              style={{ maxHeight: '270px', objectFit: 'contain', filter: viewMode === 'heatmap' ? 'contrast(1.2) brightness(0.85)' : 'none' }}
            />
          )}

          {/* FEA Strain Heatmap SVG overlay */}
          {viewMode === 'heatmap' && (
            <div 
              className="position-absolute w-100 h-100 pointer-events-none"
              style={{ top: 0, left: 0, pointerEvents: 'none' }}
            >
              <svg width="100%" height="100%" viewBox="0 0 800 350" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <radialGradient id="heatTurbine" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                    <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.5" />
                    <stop offset="80%" stopColor="#10B981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heatWingSpar" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
                    <stop offset="70%" stopColor="#10B981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <ellipse cx="470" cy="180" rx="95" ry="50" fill="url(#heatTurbine)" />
                <ellipse cx="360" cy="190" rx="80" ry="35" fill="url(#heatWingSpar)" />
                <ellipse cx="560" cy="195" rx="55" ry="30" fill="url(#heatWingSpar)" />
              </svg>
            </div>
          )}

          {/* Hotspot Beacon Nodes */}
          {subsystems.map(sub => {
            const isSelected = selectedSubsystem === sub.id;
            const isHovered = hoveredNode === sub.id;

            return (
              <div
                key={sub.id}
                className="position-absolute"
                style={{
                  top: sub.node.top,
                  left: sub.node.left,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: 8
                }}
                onClick={() => onSelectSubsystem(sub.id)}
                onMouseEnter={() => setHoveredNode(sub.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div 
                  className={`rounded-circle ${isSelected ? 'pulse-live' : ''}`}
                  style={{
                    width: isSelected ? '14px' : '10px',
                    height: isSelected ? '14px' : '10px',
                    backgroundColor: sub.status === 'Warning' || sub.status === 'Critical' ? '#DC2626' : isSelected ? '#0F172A' : '#10B981',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    transition: 'all 0.15s ease'
                  }}
                ></div>

                {isHovered && (
                  <div
                    className="position-absolute shadow-sm rounded-pill px-2 py-0.5 font-mono-tech"
                    style={{
                      bottom: '18px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#0F172A',
                      color: '#FFFFFF',
                      fontSize: '0.64rem',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      zIndex: 20
                    }}
                  >
                    {sub.label} • {sub.rul} RUL
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. SUBSYSTEM SELECTOR BAR */}
      <div className="p-2.5 px-4 border-top bg-white" style={{ borderColor: '#E2E8F0' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <span className="font-mono-tech text-muted fw-semibold" style={{ fontSize: '0.7rem' }}>
            SELECT SUBSYSTEM HOTSPOT:
          </span>

          <div className="d-flex flex-wrap align-items-center gap-1.5">
            {subsystems.map(sub => {
              const isSelected = selectedSubsystem === sub.id;

              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectSubsystem(sub.id)}
                  className="skyline-pill-tab border-0"
                  style={{
                    background: isSelected ? '#0F172A' : '#F1F5F9',
                    color: isSelected ? '#FFFFFF' : '#334155',
                    fontSize: '0.72rem',
                    padding: '0.28rem 0.75rem',
                    fontWeight: isSelected ? 700 : 600,
                    borderRadius: '20px'
                  }}
                >
                  <span>{sub.label}</span>
                  {sub.status === 'Warning' && (
                    <span className="ms-1.5 badge rounded-circle p-0" style={{ backgroundColor: '#DC2626', width: '6px', height: '6px', display: 'inline-block' }}></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
