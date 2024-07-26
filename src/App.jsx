import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Signin from './Auth/Signin';
import Dashboard from './Dashboard/Dashboard';
import ProtectedRoute from './Dashboard/Component/ProtectedRoute ';
import { CustomerProvider } from './context/CustomerContext';
import { ShipmentProvider } from './context/ShipmentContext';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CustomerProvider>
          <ShipmentProvider>
            <Routes>
              <Route path="/" element={<Signin />} />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ShipmentProvider>
        </CustomerProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
