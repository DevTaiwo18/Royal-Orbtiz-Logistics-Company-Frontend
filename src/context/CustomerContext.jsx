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
  const [customerByPhone, setCustomerByPhone] = useState(null); // State for customer by phone

  // Add new customer
  const addCustomer = async (customer) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/customers`, customer);
      setCustomers((prevCustomers) => [...prevCustomers, response.data]);
    } catch (err) {
      setError('Failed to add customer. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Update existing customer
  const updateCustomer = async (id, updatedCustomer) => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/customers/${id}`, updatedCustomer);
      setCustomers((prevCustomers) => prevCustomers.map((customer) => (customer._id === id ? response.data : customer)));
    } catch (err) {
      setError('Failed to update customer. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/customers/${id}`);
      setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer._id !== id));
    } catch (err) {
      setError('Failed to delete customer. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch customer by phone number
  const fetchCustomerByPhone = async (phoneNumber) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/customers/phone/${phoneNumber}`);
      setCustomerByPhone(response.data);
    } catch (err) {
      setError('Failed to fetch customer by phone number. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
