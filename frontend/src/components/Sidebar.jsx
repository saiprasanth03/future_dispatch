import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Image as ImageIcon, Activity, Settings, Cpu } from 'lucide-react';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="brand">
        <Cpu className="brand-icon" size={28} />
        <span>Antigravity</span>
      </div>
      
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/news" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <Newspaper size={20} />
          <span>AI News</span>
        </NavLink>
        <NavLink to="/posts" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <ImageIcon size={20} />
          <span>Carousels</span>
        </NavLink>
        <NavLink to="/logs" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <Activity size={20} />
          <span>System Logs</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Sidebar;
