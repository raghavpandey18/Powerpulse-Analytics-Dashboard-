import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, ReferenceArea, ReferenceLine
} from 'recharts';
import { Activity, Zap, TrendingUp, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import './App.css';

const COLORS = {
  Eastern: '#1f77b4',
  Northeastern: '#ff7f0e',
  Northern: '#2ca02c',
  Southern: '#d62728',
  Western: '#9467bd'
};

const CHART_MARGINS = { top: 20, right: 30, left: 40, bottom: 20 };

function App() {
  const [trends, setTrends] = useState([]);
  const [national, setNational] = useState([]);
  const [recoveryPct, setRecoveryPct] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendsRes, nationalRes, recoveryRes, statsRes] = await Promise.all([
          axios.get('http://127.0.0.1:5000/api/trends'),
          axios.get('http://127.0.0.1:5000/api/national'),
          axios.get('http://127.0.0.1:5000/api/recovery_pct'),
          axios.get('http://127.0.0.1:5000/api/stats')
        ]);
        setTrends(trendsRes.data);
        setNational(nationalRes.data);
        setRecoveryPct(recoveryRes.data);
        setStats(statsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorDetails(error.message || "Unknown error occurred");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Zap size={48} color="#3b82f6" />
        </motion.div>
        <p style={{ marginLeft: '1rem' }}>Processing visual intelligence...</p>
      </div>
    );
  }

  if (errorDetails) {
    return (
      <div className="error-container" style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
        <h2>Error Loading Dashboard</h2>
        <p>{errorDetails}</p>
        <p>Please ensure the backend is running at http://localhost:5000</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="title-section">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="gradient-text">
            PowerPulse Analytics Dashboard
          </motion.h1>
          <p>India Electricity Consumption Analysis (2019-2020)</p>
        </div>
        <div className="glass-card system-status">
          <Activity size={18} color="#10b981" />
          <span>Real-time Insights Enabled</span>
        </div>
      </header>

      {/* KPI Section */}
      <section className="stats-grid">
        {[
          { label: "Total Consumption", value: `${(stats.total_usage / 1000).toFixed(2)} GWh`, icon: <Zap />, sub: "Cumulative Data" },
          { label: "Peak Observed", value: `${stats.peak_usage} MU`, icon: <TrendingUp />, sub: stats.peak_state },
          { label: "Daily Average", value: `${stats.avg_usage?.toFixed(1)} MU`, icon: <Activity />, sub: "Per State Avg" },
          { label: "Active Nodes", value: stats.days_covered, icon: <Map />, sub: "Time Periods" }
        ].map((stat, i) => (
          <motion.div key={i} className="glass-card stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="stat-card-header">
              <span className="stat-label">{stat.label}</span>
              <div className="stat-icon">{stat.icon}</div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-sub">{stat.sub}</div>
          </motion.div>
        ))}
      </section>

      <div className="dashboard-grid">
        {/* Scenario 1: Regional Monthly Electricity Consumption */}
        <motion.div className="glass-card chart-container-large" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className="chart-header">
            <h3 className="chart-title">Regional Monthly Electricity Consumption (2019-2020) - Line Plot</h3>
          </div>
          <div style={{ height: 450, width: '100%' }}>
            <ResponsiveContainer>
              <LineChart data={trends} margin={CHART_MARGINS}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} label={{ value: 'Total Regional Consumption (GWh)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12, offset: 0 }} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                <Legend iconType="circle" />
                {Object.keys(COLORS).map(region => (
                  <Line key={region} type="monotone" dataKey={region} stroke={COLORS[region]} strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Scenario 3: National Monthly Electricity Consumption */}
        <motion.div className="glass-card chart-container-large" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="chart-header">
            <h3 className="chart-title">National Monthly Electricity Consumption (2019-2020) with COVID-19 Lockdown Impact</h3>
          </div>
          <div style={{ height: 450, width: '100%' }}>
            <ResponsiveContainer>
              <LineChart data={national} margin={CHART_MARGINS}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" label={{ value: 'Total National Consumption (GWh)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12, offset: 0 }} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                <Legend />
                <ReferenceArea x1="2020-03" x2="2020-06" fill="rgba(239, 68, 68, 0.2)" label={{ position: 'top', value: 'COVID-19 Lockdown', fill: '#ef4444', fontSize: 10 }} />
                <Line type="monotone" name="Total National Consumption" dataKey="usage" stroke="#1f77b4" strokeWidth={3} dot={{ r: 5, fill: '#1f77b4' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Scenario 2: Recovery Percentage Change */}
        <motion.div className="glass-card chart-container-large" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <div className="chart-header">
            <h3 className="chart-title">Regional Electricity Consumption Recovery: Percentage Change (Jul-Dec 2020 vs 2019)</h3>
          </div>
          <div style={{ height: 450, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={recoveryPct} margin={CHART_MARGINS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" label={{ value: 'Percentage Change (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                <Legend />
                {Object.keys(COLORS).map(region => (
                  <Bar key={region} dataKey={region} fill={COLORS[region]} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <footer className="footer-section">
        <p>© 2026 PowerPulse Analytics | Built with React & Recharts</p>
      </footer>
    </div>
  );
}

export default App;
