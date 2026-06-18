import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import News from './pages/News';
import Posts from './pages/Posts';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/news" element={<News />} />
            <Route path="/posts" element={<Posts />} />
            {/* Fallback routes */}
            <Route path="/logs" element={<div className="glass-panel"><h2>System Logs</h2><p>Logs will appear here.</p></div>} />
            <Route path="/settings" element={<div className="glass-panel"><h2>Settings</h2><p>API configurations.</p></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
