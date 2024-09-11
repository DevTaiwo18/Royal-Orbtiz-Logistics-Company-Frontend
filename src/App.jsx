import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Signin from './Auth/Signin';
import Dashboard from './Dashboard/Dashboard';
import ProtectedRoute from './Dashboard/Component/ProtectedRoute ';
import { CustomerProvider } from './context/CustomerContext';
import { ShipmentProvider } from './context/ShipmentContext';
import { ReceiptsProvider } from './context/ReceiptsContext';
import { PriceProvider } from './context/PriceContext';
import { BranchProvider } from './context/BranchContext';
import { PayrollProvider } from './context/PayrollContext';
import { RiderProvider } from './context/RiderContext';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <PriceProvider>
          <CustomerProvider>
            <ShipmentProvider>
              <ReceiptsProvider>
                <BranchProvider>
                  <PayrollProvider>
                    <RiderProvider>
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
                    </RiderProvider>
                  </PayrollProvider>
                </BranchProvider>
              </ReceiptsProvider>
            </ShipmentProvider>
          </CustomerProvider>
        </PriceProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
