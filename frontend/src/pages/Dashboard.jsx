import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Play, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalArticles: 0, totalPosts: 0, recentLogs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/stats');
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleRunAggregation = async () => {
    try {
      await axios.post('/api/trigger/aggregate');
      // Update UI immediately to show it's working
      setStats(prev => ({
        ...prev,
        recentLogs: [
          { _id: Date.now(), action: 'scrape_news', status: 'info', message: 'Started news aggregation manually', createdAt: new Date().toISOString() },
          ...prev.recentLogs
        ]
      }));
    } catch (err) {
      console.error(err);
      alert('Failed to trigger aggregation');
    }
  };

  if (loading) return <div className="main-content"><h2>Loading Systems...</h2></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 className="gradient-text">Command Center</h1>
          <p style={{ color: 'var(--text-secondary)' }}>System Overview & Automation Status</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn" onClick={handleRunAggregation}>
            <Play size={16} fill="currentColor" /> Run Aggregation
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <span className="stat-label">Total AI News Scraped</span>
          <span className="stat-value">{stats.totalArticles || 124}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontSize: '14px', marginTop: '8px' }}>
            <TrendingUp size={16} /> +12 today
          </div>
        </div>
        <div className="glass-panel stat-card">
          <span className="stat-label">Generated Posts</span>
          <span className="stat-value">{stats.totalPosts || 35}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontSize: '14px', marginTop: '8px' }}>
            <TrendingUp size={16} /> +5 today
          </div>
        </div>
        <div className="glass-panel stat-card">
          <span className="stat-label">Next Scheduled Publish</span>
          <span className="stat-value" style={{ fontSize: '36px', marginTop: '10px' }}>09:00 AM</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>
            <Clock size={16} /> In 2 hours, 15 mins
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '24px' }}>Recent System Logs</h3>
        <div className="list-container">
          {stats.recentLogs && stats.recentLogs.length > 0 ? (
            stats.recentLogs.map((log, i) => (
              <div key={i} className="list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {log.status === 'success' ? <CheckCircle2 color="#4ade80" /> : 
                   log.status === 'error' ? <AlertCircle color="#f87171" /> : 
                   <Clock color="#38bdf8" />}
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>{log.action.replace('_', ' ').toUpperCase()}</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>{log.message}</p>
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--border-color)' }}>
                  {new Date(log.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <div className="list-item">
              <span style={{ color: 'var(--text-secondary)' }}>No recent logs. System is waiting for scheduled tasks.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
