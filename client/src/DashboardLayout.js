import React from "react";
import { Link, useLocation } from "react-router-dom";
import '../src/assets/css/dashboard.css';

const DashboardLayout = ({ children }) => {
    const location = useLocation();
      const isAuthenticated = !!localStorage.getItem("authToken");
  const user = localStorage.getItem("userRole");
  const isAdmin = user === "admin";




  if (!isAuthenticated) {
    return <p>Access Denied. Please <Link to="/">login</Link>.</p>;
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-menu">
        <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>Dashboard</Link>
        {isAdmin && (
          <Link to="/dashboard/users" className={location.pathname === "/dashboard/users" ? "active" : ""}>Users</Link>
        )}
        <Link to="/dashboard/settings" className={location.pathname === "/dashboard/settings" ? "active" : ""}>Editor Settings</Link>
      </nav>

      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
