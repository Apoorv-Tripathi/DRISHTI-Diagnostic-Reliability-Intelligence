import React from 'react';

export default function ReadinessGauge({
  score = 62,
  dispatchRecommendation = "Not Cleared",
  riskLevel = "High",
  title = "Readiness & Risk",
  subtitle = null,
  metrics = null,
  onExpand = null
}) {
  // Semi-circle math
  const radius = 75;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // half circle circumference ~ 235.6
  const fillLength = (Math.min(Math.max(score, 0), 100) / 100) * circumference;

  return (
    <div className="skyline-card h-100 d-flex flex-column justify-content-between">
      <div className="skyline-card-header mb-1">
        <div>
          <h6 className="skyline-card-title mb-0">{title}</h6>
          {subtitle && (
            <span className="text-muted font-mono-tech d-block" style={{ fontSize: '0.72rem' }}>
              {subtitle}
            </span>
          )}
        </div>
        {onExpand && (
          <button onClick={onExpand} className="skyline-expand-btn" title="Expand">
            ↗
          </button>
        )}
      </div>

      <div className="readiness-gauge-card my-auto py-2">
        <svg className="readiness-gauge-svg" viewBox="0 0 220 125">
          <defs>
            <linearGradient id="readinessGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF4F34" />
              <stop offset="50%" stopColor="#FFA034" />
              <stop offset="100%" stopColor="#1DC30A" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <path
            d="M 35 100 A 75 75 0 0 1 185 100"
            fill="none"
            stroke="#E8ECEF"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Foreground colored arc */}
          <path
            d="M 35 100 A 75 75 0 0 1 185 100"
            fill="none"
            stroke="url(#readinessGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${fillLength} ${circumference}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />

          {/* Semicircular Tick Marks on the remaining edge */}
          <path
            d="M 35 100 A 75 75 0 0 1 185 100"
            fill="none"
            stroke="#F2F2F2"
            strokeWidth="3"
            strokeDasharray="2 6"
          />

          {/* Score text */}
          <text
            x="110"
            y="85"
            textAnchor="middle"
            fill="#1F242D"
            fontSize="32"
            fontWeight="800"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {score}%
          </text>
          <text
            x="110"
            y="105"
            textAnchor="middle"
            fill="#828894"
            fontSize="10"
            fontWeight="600"
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            Tactical Fleet Availability
          </text>
        </svg>

        {/* Bottom Breakdown: either custom metrics array or recommendation/risk specs */}
        {metrics && metrics.length > 0 ? (
          <div className="row g-2 w-100 pt-3 border-top mt-2 font-mono-tech text-center" style={{ fontSize: '0.74rem' }}>
            {metrics.map((m, idx) => (
              <div key={idx} className="col-3">
                <span className="text-muted d-block" style={{ fontSize: '0.66rem' }}>{m.label}</span>
                <strong style={{ color: m.color || '#1F242D', fontSize: '0.82rem' }}>
                  {m.value}
                </strong>
              </div>
            ))}
          </div>
        ) : (
          <div className="d-flex justify-content-between w-100 pt-3 border-top mt-2 text-start font-sans" style={{ fontSize: '0.78rem' }}>
            <div>
              <div className="text-muted-custom" style={{ fontSize: '0.7rem' }}>Dispatch Recommendation</div>
              <strong style={{ color: score >= 85 ? '#0F8205' : score >= 70 ? '#A85B00' : '#D32F1A' }}>
                {dispatchRecommendation}
              </strong>
            </div>
            <div className="text-end">
              <div className="text-muted-custom" style={{ fontSize: '0.7rem' }}>Risk Level</div>
              <strong style={{ color: riskLevel === 'Critical' || riskLevel === 'High' ? '#D32F1A' : riskLevel === 'Medium' ? '#A85B00' : '#0F8205' }}>
                {riskLevel}
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
