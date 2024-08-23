import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

// Create Context
const CustomerContext = createContext();

// Get the base API URL from environment variables
const API_URL = import.meta.env.VITE_APP_API_URL;

// Context Provider Component
export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customerByPhone, setCustomerByPhone] = useState(null);

  // Function to handle API requests with centralized error handling
  const apiRequest = useCallback(async (requestFn) => {
    setLoading(true);
    try {
      const response = await requestFn();
      return response;
    } catch (error) {
      console.error('API Error:', error);
      setError('An error occurred. Please try again later.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all customers
  const fetchCustomers = useCallback(async () => {
    const response = await apiRequest(() => axios.get(`${API_URL}/customers/`));
    setCustomers(response.data);
  }, [apiRequest]);

  // Update existing customer
  const updateCustomer = useCallback(async (id, updatedCustomer) => {
    const response = await apiRequest(() => axios.put(`${API_URL}/customers/${id}`, updatedCustomer));
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) => (customer._id === id ? response.data : customer))
    );
  }, [apiRequest]);

  // Delete customer
  const deleteCustomer = useCallback(async (id) => {
    await apiRequest(() => axios.delete(`${API_URL}/customers/${id}`));
    setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer._id !== id));
  }, [apiRequest]);

  // Fetch customer by phone number
  const fetchCustomerByPhone = useCallback(async (phoneNumber) => {
    const response = await apiRequest(() =>
      axios.get(`${API_URL}/customers/phone/${phoneNumber}`)
    );
    setCustomerByPhone(response.data);
    console.log(response.data);
    
    return response.data;
  }, [apiRequest]);

  // Add new customer
  const addCustomer = useCallback(async (newCustomer) => {
    const response = await apiRequest(() => axios.post(`${API_URL}/customers/`, newCustomer));
    setCustomers((prevCustomers) => [...prevCustomers, response.data]);
  }, [apiRequest]);

  return (
    <CustomerContext.Provider
      value={{
        customers,
        loading,
        error,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        fetchCustomerByPhone,
        fetchCustomers,
        customerByPhone
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
