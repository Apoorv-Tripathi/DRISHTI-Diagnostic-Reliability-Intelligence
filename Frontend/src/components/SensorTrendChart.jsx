import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SensorTrendChart({ telemetryData, title, parameterName = "Vibration Spectrum (mm/s)" }) {
  if (!telemetryData || !telemetryData.history) {
    return (
      <div className="p-4 text-center text-muted font-mono-tech" style={{ background: '#F8F9FA', borderRadius: '12px' }}>
        Loading sensor telemetry data...
      </div>
    );
  }

  const { history, projection } = telemetryData;

  // Labels: flight hours
  const historyLabels = history.map(p => `H-${p.flightHour}`);
  const projectionLabels = projection ? projection.map(p => `H-${p.flightHour} (Pred)`) : [];
  const allLabels = [...historyLabels, ...projectionLabels];

  // Observed historical points
  const observedData = history.map(p => p.vibration);

  // Baselines and thresholds
  const normalBaseline = allLabels.map(() => 1.8);
  const anomalyThreshold = allLabels.map(() => 2.5);
  const criticalThreshold = allLabels.map(() => 5.5);

  // Future projection line (connects with last historical point)
  const lastObserved = observedData[observedData.length - 1];
  const projectedData = new Array(history.length - 1).fill(null);
  projectedData.push(lastObserved);
  if (projection) {
    projection.forEach(p => projectedData.push(p.predictedVibration));
  }

  const data = {
    labels: allLabels,
    datasets: [
      {
        label: 'Measured Telemetry (Actual)',
        data: [...observedData, ...new Array(projection ? projection.length : 0).fill(null)],
        borderColor: '#333333',
        backgroundColor: 'rgba(51, 51, 51, 0.05)',
        borderWidth: 2.2,
        pointRadius: (ctx) => {
          const index = ctx.dataIndex;
          if (history[index] && history[index].anomaly) return 6;
          return 3;
        },
        pointBackgroundColor: (ctx) => {
          const index = ctx.dataIndex;
          if (history[index] && history[index].anomaly) return '#FF4F34';
          return '#333333';
        },
        tension: 0.25
      },
      {
        label: 'Model Projected Degradation (RUL)',
        data: projectedData,
        borderColor: '#FFA034',
        backgroundColor: 'rgba(255, 160, 52, 0.08)',
        borderWidth: 2,
        borderDash: [5, 4],
        pointRadius: 4,
        pointBackgroundColor: '#FFA034',
        tension: 0.2
      },
      {
        label: 'Nominal Baseline (1.8 mm/s)',
        data: normalBaseline,
        borderColor: '#1DC30A',
        borderWidth: 1.2,
        borderDash: [3, 3],
        pointRadius: 0,
        fill: false
      },
      {
        label: 'Anomaly Advisory (2.5 mm/s)',
        data: anomalyThreshold,
        borderColor: '#FFA034',
        borderWidth: 1.2,
        borderDash: [4, 4],
        pointRadius: 0,
        fill: false
      },
      {
        label: 'Critical Threshold Limit (5.5 mm/s)',
        data: criticalThreshold,
        borderColor: '#FF4F34',
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: { family: 'JetBrains Mono', size: 10 }
        }
      },
      tooltip: {
        backgroundColor: '#333333',
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 10 },
        padding: 10,
        callbacks: {
          footer: (items) => {
            const index = items[0]?.dataIndex;
            if (history[index]) {
              return `Status: ${history[index].status}\nOil Temp: ${history[index].oilTemp}°C\nEGT: ${history[index].egt}°C`;
            }
            return '';
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { font: { family: 'JetBrains Mono', size: 9 }, maxRotation: 45 }
      },
      y: {
        title: {
          display: true,
          text: parameterName,
          font: { family: 'JetBrains Mono', size: 10, weight: 'bold' }
        },
        min: 0.5,
        max: 6.5,
        grid: { color: 'rgba(0,0,0,0.06)' },
        ticks: { font: { family: 'JetBrains Mono', size: 10 } }
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h6 className="mb-0 fw-bold text-dark">{title || "Turbine Bearing Vibration Harmonic Progression"}</h6>
          <span className="text-muted font-mono-tech" style={{ fontSize: '0.72rem' }}>SENSOR FEED: HP_SPOOL_ACCEL_142HZ</span>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <span className="skyline-pill skyline-pill-red" style={{ fontSize: '0.65rem' }}>ANOMALY TRIGGERED</span>
          <span className="skyline-pill skyline-pill-amber" style={{ fontSize: '0.65rem' }}>RUL: ~14.5 HRS</span>
        </div>
      </div>

      <div style={{ height: '300px' }}>
        <Line data={data} options={options} />
      </div>

      {/* Visual story banner per brief: Normal -> Change -> Anomaly -> Predicted Risk -> Maintenance */}
      <div className="mt-3 p-2 rounded-3 font-mono-tech d-flex flex-wrap justify-content-between align-items-center" style={{ background: '#F8F9FA', border: '1px solid #E5E7EB', fontSize: '0.72rem' }}>
        <span className="fw-bold" style={{ color: '#1DC30A' }}>1. NORMAL BASELINE (1.5mm/s)</span>
        <span className="text-muted">→</span>
        <span className="fw-bold" style={{ color: '#FFA034' }}>2. DRIFT (H-1422.0)</span>
        <span className="text-muted">→</span>
        <span className="fw-bold" style={{ color: '#FF4F34' }}>3. ANOMALY DETECTED (H-1431.0)</span>
        <span className="text-muted">→</span>
        <span className="fw-bold" style={{ color: '#FF4F34' }}>4. CRITICAL FORECAST</span>
        <span className="text-muted">→</span>
        <span className="skyline-pill skyline-pill-dark" style={{ fontSize: '0.62rem', padding: '0.1rem 0.45rem' }}>5. ACTION REQUIRED</span>
      </div>
    </div>
  );
}
