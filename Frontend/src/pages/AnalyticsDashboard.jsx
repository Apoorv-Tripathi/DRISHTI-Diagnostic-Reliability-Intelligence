import React, { useState, useEffect } from 'react';
import { fetchAnalytics } from '../services/api.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Clock,
  Award,
  Activity,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  Zap,
  Sparkles,
  Download,
  Calendar,
  Layers
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics().then(data => setAnalytics(data));
  }, []);

  if (!analytics) {
    return (
      <div className="container py-5 text-center text-muted">
        Loading fleet reliability analytics and readiness records...
      </div>
    );
  }

  // Monthly Availability Trend Chart
  const trendLabels = analytics.monthlyAvailabilityTrend.map(m => m.month);
  const availabilityData = analytics.monthlyAvailabilityTrend.map(m => m.availability);
  const preventedSnags = analytics.monthlyAvailabilityTrend.map(m => m.predictedPrevented);

  const availabilityChartData = {
    labels: trendLabels,
    datasets: [
      {
        type: 'line',
        label: 'Fleet Availability Rate (%)',
        data: availabilityData,
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.06)',
        fill: true,
        borderWidth: 2.2,
        pointBackgroundColor: '#059669',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.35,
        yAxisID: 'y'
      },
      {
        type: 'bar',
        label: 'Predictive Interventions',
        data: preventedSnags,
        backgroundColor: 'rgba(217, 119, 6, 0.75)',
        hoverBackgroundColor: 'rgba(217, 119, 6, 0.95)',
        borderRadius: 4,
        borderSkipped: false,
        barPercentage: 0.5,
        yAxisID: 'y1'
      }
    ]
  };

  const availabilityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#111827',
        titleFont: { family: 'Plus Jakarta Sans', size: 11, weight: '700' },
        bodyFont: { family: 'Plus Jakarta Sans', size: 11 },
        padding: 10,
        cornerRadius: 6,
        displayColors: true
      }
    },
    scales: {
      x: {
        ticks: { font: { family: 'Plus Jakarta Sans', size: 10 }, color: '#6B7280' },
        grid: { color: 'rgba(0,0,0,0.03)' }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 55,
        max: 85,
        title: {
          display: true,
          text: 'Availability Rate (%)',
          font: { family: 'Plus Jakarta Sans', size: 10, weight: '600' },
          color: '#6B7280'
        },
        ticks: { font: { family: 'Plus Jakarta Sans', size: 10 }, color: '#6B7280' },
        grid: { color: 'rgba(0,0,0,0.04)' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 20,
        grid: { drawOnChartArea: false },
        title: {
          display: true,
          text: 'Averted Snags (Count)',
          font: { family: 'Plus Jakarta Sans', size: 10, weight: '600' },
          color: '#6B7280'
        },
        ticks: { font: { family: 'Plus Jakarta Sans', size: 10 }, color: '#6B7280' }
      }
    }
  };

  // Subsystem Failure Pareto Chart
  const subsystemLabels = analytics.subsystemFailureDistribution.map(s => s.subsystem);
  const subsystemPercentages = analytics.subsystemFailureDistribution.map(s => s.percentage);

  const subsystemChartData = {
    labels: subsystemLabels,
    datasets: [
      {
        label: '% of Logged Incidents',
        data: subsystemPercentages,
        backgroundColor: ['#DC2626', '#D97706', '#111827', '#4B5563', '#9CA3AF'],
        borderRadius: 4,
        borderSkipped: false,
        barPercentage: 0.6
      }
    ]
  };

  const subsystemChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111827',
        titleFont: { family: 'Plus Jakarta Sans', size: 11, weight: '700' },
        bodyFont: { family: 'Plus Jakarta Sans', size: 11 },
        padding: 10,
        cornerRadius: 6
      }
    },
    scales: {
      x: {
        ticks: { font: { family: 'Plus Jakarta Sans', size: 10 }, color: '#6B7280' },
        title: {
          display: true,
          text: 'Percentage of Historical Snags (%)',
          font: { family: 'Plus Jakarta Sans', size: 10, weight: '600' },
          color: '#6B7280'
        },
        grid: { color: 'rgba(0,0,0,0.04)' }
      },
      y: {
        ticks: { font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' }, color: '#111827' },
        grid: { display: false }
      }
    }
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-3" style={{ maxWidth: '1400px' }}>

      {/* ── 1. Top Header ── */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4 pt-1">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
              Operations / Fleet Reliability &amp; Reports
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
              Airworthiness Evaluation Ready
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
            Fleet Reliability, Availability &amp; ROI Analytics
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
            Empirical quantification of availability uplift, avoided AOG downtime hours, and condition-based turnaround efficiency across all active squadrons.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 pt-1">
          <button
            onClick={() => window.print()}
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
            <Download size={14} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* ── 2. Executive Metric Cards ── */}
      <div className="row g-3 mb-4">
        {/* Metric 1 */}
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
                Fleet Availability
              </span>
              <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                +6.8% Uplift
              </span>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>
              {analytics.fleetAvailabilityRate}%
            </div>
            <div style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: '0.3rem' }}>
              Target squadron benchmark: 75.0%
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>Historical baseline: 62.4%</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>● Condition-Based</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
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
                Downtime Averted
              </span>
              <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                Last 90 Days
              </span>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>
              {analytics.totalDowntimeHoursSavedLast90Days} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#9CA3AF' }}>hrs</span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: '0.3rem' }}>
              Averted unscheduled line groundings
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>14 snags intercepted</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>● Zero In-Flight AOG</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
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
                MTTR Turnaround
              </span>
              <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                -76% Latency
              </span>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>
              {analytics.mttrHours} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#9CA3AF' }}>hrs</span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: '0.3rem' }}>
              Reduced from 28.5h legacy average
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>Rapid LRU swap workflow</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>● Audited</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
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
                Predictive Accuracy
              </span>
              <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                Boroscopy Validated
              </span>
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>
              {analytics.proactiveInterventionSuccessRate}%
            </div>
            <div style={{ fontSize: '0.76rem', color: '#9CA3AF', marginTop: '0.3rem' }}>
              Zero false-positive groundings
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
              <span>Statistical confidence</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>● p &lt; 0.001</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Charts Row: Availability Trend + Failure Distribution ── */}
      <div className="row g-3 mb-4">
        {/* Chart 1: Availability Trend */}
        <div className="col-12 col-lg-7">
          <div
            className="p-3 px-4 h-100 rounded-3"
            style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6B7280' }}>
                  Historical Fleet Readiness
                </span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: '2px 0 0' }}>
                  Sortie Availability Uplift vs. Early Interventions
                </h3>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
                6-Month Horizon
              </span>
            </div>

            <div style={{ height: '280px' }}>
              <Line data={availabilityChartData} options={availabilityChartOptions} />
            </div>

            <div className="mt-2 text-secondary" style={{ fontSize: '0.74rem', lineHeight: 1.45 }}>
              ● Intercepting component micro-cracks during early harmonic drift prevents cataclysmic engine groundings and steadily elevates combat fleet availability.
            </div>
          </div>
        </div>

        {/* Chart 2: Subsystem Failure Pareto Distribution */}
        <div className="col-12 col-lg-5">
          <div
            className="p-3 px-4 h-100 rounded-3"
            style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6B7280' }}>
                  Failure Mode Distribution
                </span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: '2px 0 0' }}>
                  Subsystem Anomaly Pareto Breakdown
                </h3>
              </div>
              <span
                style={{
                  fontSize: '0.66rem',
                  fontWeight: 600,
                  padding: '0.12rem 0.45rem',
                  borderRadius: '4px',
                  background: '#FEF2F2',
                  color: '#991B1B',
                  border: '1px solid #FECACA'
                }}
              >
                Primary Bottleneck
              </span>
            </div>

            <div style={{ height: '280px' }}>
              <Bar data={subsystemChartData} options={subsystemChartOptions} />
            </div>

            <div className="mt-2 text-secondary" style={{ fontSize: '0.74rem', lineHeight: 1.45 }}>
              ● Turbofan powerplant bearings (38%) and high-pressure hydraulic circuits (26%) account for 64% of total fleet downtime risk.
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Operational Comparison Table ── */}
      <div
        className="rounded-3 overflow-hidden shadow-sm mb-4"
        style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}
      >
        <div className="p-3 px-4 d-flex justify-content-between align-items-center border-bottom" style={{ background: '#F8FAFC' }}>
          <div className="d-flex align-items-center gap-2">
            <Award size={16} color="#111827" />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827' }}>
              Operational Comparison: Conventional Reactive Maintenance vs. D.R.I.S.H.T.I. Platform
            </span>
          </div>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              background: '#ECFDF5',
              color: '#065F46',
              border: '1px solid #A7F3D0'
            }}
          >
            ● MoD / DSSC Doctrine Impact
          </span>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '950px' }}>
            <thead>
              <tr>
                <th style={{ background: '#FAFAFA', padding: '0.75rem 1.15rem', fontSize: '0.74rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', width: '22%' }}>
                  Operational Attribute
                </th>
                <th style={{ background: '#FAFAFA', padding: '0.75rem 1.15rem', fontSize: '0.74rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E8EC', width: '28%' }}>
                  Legacy Conventional Approach
                </th>
                <th style={{ background: '#FAFAFA', padding: '0.75rem 1.15rem', fontSize: '0.74rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E8EC', width: '30%' }}>
                  D.R.I.S.H.T.I. Predictive Platform
                </th>
                <th style={{ background: '#FAFAFA', padding: '0.75rem 1.15rem', fontSize: '0.74rem', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E8EC', width: '20%' }}>
                  Operational Outcome
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.85rem 1.15rem', fontWeight: 600, color: '#111827', fontSize: '0.82rem' }}>Fault Discovery</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#6B7280', fontSize: '0.8rem' }}>Discovered post-flight via pilot snag debrief or in-flight alarm</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#111827', fontWeight: 500, fontSize: '0.8rem' }}>Predicted 14–65 flight hours in advance via harmonic sensor drift</td>
                <td style={{ padding: '0.85rem 1.15rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '999px', background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' }}>
                    Zero In-Flight Emergencies
                  </span>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.85rem 1.15rem', fontWeight: 600, color: '#111827', fontSize: '0.82rem' }}>Depot Spares Allocation</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#6B7280', fontSize: '0.8rem' }}>Ordered reactively post-grounding (Aircraft On Ground delay)</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#111827', fontWeight: 500, fontSize: '0.8rem' }}>Auto-requisitioned from Central Depot during early vibration drift</td>
                <td style={{ padding: '0.85rem 1.15rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '999px', background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' }}>
                    -68% Supply Chain Lead Time
                  </span>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.85rem 1.15rem', fontWeight: 600, color: '#111827', fontSize: '0.82rem' }}>Inspection Workflow</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#6B7280', fontSize: '0.8rem' }}>Disjointed paper cards with disconnected flight logs</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#111827', fontWeight: 500, fontSize: '0.8rem' }}>Unified digital loop: Physical bus tethering → Airworthiness order</td>
                <td style={{ padding: '0.85rem 1.15rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '999px', background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' }}>
                    Full Chain of Custody
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '0.85rem 1.15rem', fontWeight: 600, color: '#111827', fontSize: '0.82rem' }}>Combat Fleet Availability</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#6B7280', fontSize: '0.8rem' }}>Constrained due to unscheduled grounding &amp; fragmented maintenance</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#111827', fontWeight: 500, fontSize: '0.8rem' }}>Continuous airworthiness monitoring with condition-based scheduling</td>
                <td style={{ padding: '0.85rem 1.15rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '999px', background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' }}>
                    +75.0% Mission Readiness
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
