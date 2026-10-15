import React, { useState, useEffect } from 'react';
import {
  Radio,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Layers,
  Activity,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Gauge,
  Sliders,
  Compass
} from 'lucide-react';

export default function AircraftSilhouette({ aircraft, selectedSubsystem, onSelectSubsystem }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState('exterior'); // 'exterior' | 'cutaway' | 'heatmap'
  const [isSimulating, setIsSimulating] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [flightProfile, setFlightProfile] = useState('combat'); // 'combat' | 'patrol' | 'ground'

  // Dynamic simulation parameters (oscillating at 20Hz when active)
  const [simMetrics, setSimMetrics] = useState({
    gLoad: 2.4,
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
          let baseG = 2.4, baseSpd = 420, baseAlt = 28000, baseVib = 4.8, baseTemp = 642, baseStrain = 285;
          
          if (flightProfile === 'combat') {
            baseG = 3.8;
            baseSpd = 540;
            baseStrain = 340;
          } else if (flightProfile === 'ground') {
            baseG = 1.0;
            baseSpd = 0;
            baseAlt = 980;
            baseVib = 2.1;
            baseTemp = 420;
            baseStrain = 65;
          }

          const gOsc = (baseG + (flightProfile === 'ground' ? 0.05 : 1.4) * Math.sin(t * 1.6)).toFixed(1);
          const spd = Math.round(baseSpd + (flightProfile === 'ground' ? 0 : 30 * Math.sin(t * 0.9)));
          const alt = Math.round(baseAlt + (flightProfile === 'ground' ? 0 : 350 * Math.sin(t * 0.4)));
          const vib = (baseVib + (flightProfile === 'ground' ? 0.1 : 0.6) * Math.sin(t * 4.2)).toFixed(2);
          const temp = Math.round(baseTemp + 15 * Math.sin(t * 1.1));
          const strain = Math.round(baseStrain + (flightProfile === 'ground' ? 5 : 45 * Math.sin(t * 2.1)));

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
  }, [isSimulating, flightProfile]);

  if (!aircraft || !aircraft.subsystems) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.8));
  const handleResetZoom = () => setZoomLevel(1);

  // Subsystem definitions with clean icons and precise CAD coordinates
  const subsystems = [
    { id: 'engine', label: 'Turbofan E-01', node: { top: '51%', left: '58%' }, rul: '40h', status: aircraft.subsystems?.engine?.status || 'Warning' },
    { id: 'avionics', label: 'Avionics & Radar', node: { top: '53%', left: '18%' }, rul: '620h', status: aircraft.subsystems?.avionics?.status || 'Healthy' },
    { id: 'fuelAndEcs', label: 'Fuel & ECS', node: { top: '55%', left: '40%' }, rul: '310h', status: aircraft.subsystems?.fuelAndEcs?.status || 'Healthy' },
    { id: 'hydraulic', label: 'Hydraulics & FBW', node: { top: '56%', left: '70%' }, rul: '110h', status: aircraft.subsystems?.hydraulic?.status || 'Healthy' },
    { id: 'electrical', label: 'Electrical / APU', node: { top: '42%', left: '30%' }, rul: '450h', status: 'Healthy' }
  ];

  return (
    <div
      className="rounded-3 overflow-hidden"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
      }}
    >
      {/* ── 1. Top Header Toolbar ── */}
      <div
        className="d-flex flex-wrap justify-content-between align-items-center p-3 px-4 border-bottom gap-2"
        style={{ background: '#F8FAFC' }}
      >
        <div className="d-flex align-items-center gap-2.5">
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: '#111827',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Radio size={14} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>
                {aircraft.aircraftId} · 3D Digital Twin &amp; Structural Airframe
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  padding: '0.12rem 0.45rem',
                  borderRadius: '4px',
                  background: '#E5E7EB',
                  color: '#374151'
                }}
              >
                {aircraft.type}
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div
          className="d-flex align-items-center gap-1 p-1 rounded-2"
          style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
        >
          {[
            { id: 'exterior', label: '3D Exterior' },
            { id: 'cutaway', label: 'Mechanical Cutaway' },
            { id: 'heatmap', label: 'FEA Stress Heatmap' }
          ].map(tab => {
            const isActive = viewMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: isActive ? 600 : 500,
                  padding: '0.28rem 0.75rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: isActive ? '#111827' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#6B7280',
                  boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Telemetry & Simulation Control Strip ── */}
      <div
        className="d-flex flex-wrap justify-content-between align-items-center p-2.5 px-4 border-bottom"
        style={{ background: '#FFFFFF', fontSize: '0.76rem' }}
      >
        <div className="d-flex flex-wrap align-items-center gap-2">
          {/* Start/Pause Simulation */}
          <button
            onClick={() => setIsSimulating(prev => !prev)}
            className="btn btn-sm d-flex align-items-center gap-1.5"
            style={{
              fontSize: '0.74rem',
              fontWeight: 600,
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              background: isSimulating ? '#FEF2F2' : '#111827',
              border: `1px solid ${isSimulating ? '#FECACA' : '#111827'}`,
              color: isSimulating ? '#DC2626' : '#FFFFFF'
            }}
          >
            {isSimulating ? (
              <>
                <Pause size={12} color="#DC2626" />
                <span>Pause Dynamics</span>
              </>
            ) : (
              <>
                <Play size={12} color="#10B981" />
                <span>Run 20Hz Flight Dynamics</span>
              </>
            )}
          </button>

          {/* Flight Profile Selector */}
          <div className="d-flex align-items-center gap-1 p-0.5 rounded-2 bg-light border">
            <span style={{ fontSize: '0.68rem', color: '#9CA3AF', padding: '0 0.4rem' }}>Profile:</span>
            {[
              { id: 'combat', label: 'Combat Sortie' },
              { id: 'patrol', label: 'High-Alt Patrol' },
              { id: 'ground', label: 'Ground Idle' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setFlightProfile(p.id)}
                style={{
                  fontSize: '0.68rem',
                  fontWeight: flightProfile === p.id ? 600 : 400,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  border: 'none',
                  background: flightProfile === p.id ? '#FFFFFF' : 'transparent',
                  color: flightProfile === p.id ? '#111827' : '#6B7280',
                  boxShadow: flightProfile === p.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {isSimulating && (
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                color: '#059669',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#ECFDF5',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                border: '1px solid #A7F3D0'
              }}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#059669' }}></span>
              20 Hz Telemetry Ingestion Live
            </span>
          )}
        </div>

        {/* Live Gauges Ribbon */}
        <div className="d-flex flex-wrap align-items-center gap-3" style={{ fontSize: '0.74rem' }}>
          <div>
            <span style={{ color: '#9CA3AF' }}>G-LOAD:</span>{' '}
            <strong style={{
              color: simMetrics.gLoad > 3.5 ? '#DC2626' : '#111827',
              fontFamily: 'var(--font-mono)'
            }}>
              {isSimulating ? `${simMetrics.gLoad} G` : '+2.4 G'}
            </strong>
          </div>
          <div>
            <span style={{ color: '#9CA3AF' }}>FEA STRESS:</span>{' '}
            <strong style={{ color: '#111827', fontFamily: 'var(--font-mono)' }}>
              {isSimulating ? `${simMetrics.strainMPa} MPa` : '285 MPa'}
            </strong>
          </div>
          <div>
            <span style={{ color: '#9CA3AF' }}>EGT TEMP:</span>{' '}
            <strong style={{ color: '#111827', fontFamily: 'var(--font-mono)' }}>
              {isSimulating ? `${simMetrics.egtTemp}°C` : '642°C'}
            </strong>
          </div>
          <div>
            <span style={{ color: '#9CA3AF' }}>VIB:</span>{' '}
            <strong style={{
              color: simMetrics.engineVib > 4.5 ? '#DC2626' : '#059669',
              fontFamily: 'var(--font-mono)'
            }}>
              {isSimulating ? `${simMetrics.engineVib} mm/s` : '5.2 mm/s'}
            </strong>
          </div>
          <div className="d-none d-md-inline">
            <span style={{ color: '#9CA3AF' }}>SSFDR PACKETS:</span>{' '}
            <strong style={{ color: '#111827', fontFamily: 'var(--font-mono)' }}>
              {simMetrics.packetsIngested.toLocaleString()}
            </strong>
          </div>
        </div>
      </div>

      {/* ── 3. Visual Airframe 3D Canvas ── */}
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
          className="position-absolute d-flex flex-column rounded-2 overflow-hidden shadow-sm bg-white border"
          style={{ bottom: '1rem', left: '1rem', zIndex: 10, borderColor: '#E5E7EB' }}
        >
          <button
            onClick={handleZoomIn}
            className="btn btn-sm btn-link p-1 text-dark"
            title="Zoom In"
            style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ZoomIn size={14} />
          </button>
          <div style={{ height: '1px', background: '#E5E7EB' }}></div>
          <button
            onClick={handleZoomOut}
            className="btn btn-sm btn-link p-1 text-dark"
            title="Zoom Out"
            style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ZoomOut size={14} />
          </button>
          <div style={{ height: '1px', background: '#E5E7EB' }}></div>
          <button
            onClick={handleResetZoom}
            className="btn btn-sm btn-link p-1 text-secondary"
            title="Reset Zoom"
            style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <RotateCcw size={12} />
          </button>
        </div>

        {/* 360 View Indicator */}
        <div
          className="position-absolute d-flex align-items-center gap-1.5 bg-white rounded-pill px-2.5 py-1 shadow-sm border"
          style={{
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            borderColor: '#E5E7EB',
            fontSize: '0.68rem',
            color: '#374151'
          }}
        >
          <Compass size={12} color="#6B7280" />
          <span style={{ fontWeight: 700, color: '#111827' }}>360°</span>
          <span style={{ color: '#9CA3AF' }}>·</span>
          <span>
            {viewMode === 'cutaway'
              ? 'Mechanical Subsystem Cutaway'
              : viewMode === 'heatmap'
              ? 'FEA Finite-Element Strain Gradient'
              : 'Aerodynamic CAD Planform'}
          </span>
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
              style={{
                maxHeight: '270px',
                objectFit: 'contain',
                filter: viewMode === 'heatmap' ? 'contrast(1.2) brightness(0.85)' : 'none'
              }}
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
            const isWarning = sub.status === 'Warning' || sub.status === 'Critical';

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
                  style={{
                    width: isSelected ? '14px' : '10px',
                    height: isSelected ? '14px' : '10px',
                    borderRadius: '50%',
                    backgroundColor: isWarning ? '#DC2626' : isSelected ? '#111827' : '#059669',
                    border: '2px solid #FFFFFF',
                    boxShadow: isWarning
                      ? '0 0 0 3px rgba(220, 38, 38, 0.3), 0 2px 6px rgba(0,0,0,0.2)'
                      : isSelected
                      ? '0 0 0 3px rgba(17, 24, 39, 0.25), 0 2px 6px rgba(0,0,0,0.2)'
                      : '0 2px 6px rgba(0,0,0,0.2)',
                    transition: 'all 0.15s ease'
                  }}
                ></div>

                {/* Hover Tooltip */}
                {isHovered && (
                  <div
                    className="position-absolute shadow-sm rounded-pill px-2 py-0.5"
                    style={{
                      bottom: '20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#111827',
                      color: '#FFFFFF',
                      fontSize: '0.68rem',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      zIndex: 20
                    }}
                  >
                    {sub.label} · {sub.rul} RUL
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. Subsystem Selector Chips Bar ── */}
      <div className="p-2.5 px-4 border-top bg-white" style={{ borderColor: '#E5E8EC' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <span style={{ fontSize: '0.74rem', color: '#6B7280', fontWeight: 600 }}>
            Select Subsystem Hotspot:
          </span>

          <div className="d-flex flex-wrap align-items-center gap-1.5">
            {subsystems.map(sub => {
              const isSelected = selectedSubsystem === sub.id;
              const isWarning = sub.status === 'Warning' || sub.status === 'Critical';

              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectSubsystem(sub.id)}
                  style={{
                    background: isSelected ? '#111827' : '#F3F4F6',
                    color: isSelected ? '#FFFFFF' : '#374151',
                    fontSize: '0.74rem',
                    padding: '0.32rem 0.8rem',
                    fontWeight: isSelected ? 600 : 500,
                    borderRadius: '999px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isWarning ? '#DC2626' : isSelected ? '#10B981' : '#059669'
                    }}
                  ></span>
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
