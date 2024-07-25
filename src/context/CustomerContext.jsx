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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch customers from API
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/customers`);
      setCustomers(response.data);
    } catch (err) {
      setError('Failed to fetch customers.');
    } finally {
      setLoading(false);
    }
  };

  // Add new customer
  const addCustomer = async (customer) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/customers`, customer);
      setCustomers([...customers, response.data]);
    } catch (err) {
      setError('Failed to add customer.');
    } finally {
      setLoading(false);
    }
  };

  // Update existing customer
  const updateCustomer = async (id, updatedCustomer) => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/customers/${id}`, updatedCustomer);
      setCustomers(customers.map((customer) => (customer._id === id ? response.data : customer)));
    } catch (err) {
      setError('Failed to update customer.');
    } finally {
      setLoading(false);
    }
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/customers/${id}`);
      setCustomers(customers.filter((customer) => customer._id !== id));
    } catch (err) {
      setError('Failed to delete customer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Calculate paginated data
  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = customers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <CustomerContext.Provider
      value={{
        customers: paginatedCustomers,
        loading,
        error,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        currentPage,
        setCurrentPage,
        totalPages
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
