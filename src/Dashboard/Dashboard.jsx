// src/pages/Dashboard.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardIndex from './Component/DashboardIndex';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Routes>
        <Route path="/" element={<DashboardIndex />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
