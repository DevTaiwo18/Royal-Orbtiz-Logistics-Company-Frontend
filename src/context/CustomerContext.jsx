import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create Context
const CustomerContext = createContext();

// Get the base API URL from environment variables
const API_URL = import.meta.env.VITE_APP_API_URL;

// Context Provider Component
export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/customers/`);
      setCustomers(response.data);
    } catch (err) {
      setError('Failed to fetch customers.');
    } finally {
      setLoading(false);
    }
  };

  // Add new customer
  const addCustomer = async (customer) => {
    try {
      const response = await axios.post(`${API_URL}/customers/`, customer);
      setCustomers([...customers, response.data]);
    } catch (err) {
      setError('Failed to add customer.');
    }
  };

  // Update existing customer
  const updateCustomer = async (id, updatedCustomer) => {
    try {
      const response = await axios.put(`${API_URL}/customers/${id}`, updatedCustomer);
      setCustomers(customers.map((customer) => (customer._id === id ? response.data : customer)));
    } catch (err) {
      setError('Failed to update customer.');
    }
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    try {
      await axios.delete(`${API_URL}/customers/${id}`);
      setCustomers(customers.filter((customer) => customer._id !== id));
    } catch (err) {
      setError('Failed to delete customer.');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        customers,
        loading,
        error,
        addCustomer,
        updateCustomer,
        deleteCustomer
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

// Custom hook to use the CustomerContext
export const useCustomers = () => {
  return useContext(CustomerContext);
};
