import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

// Create Context
const PriceContext = createContext();

// Get the base API URL from environment variables
const API_URL = import.meta.env.VITE_APP_API_URL;

// Context Provider Component
export const PriceProvider = ({ children }) => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [singlePrice, setSinglePrice] = useState(null); // State for single price
  const [names, setNames] = useState([]); // State for category names

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/prices/`);
      console.log(response.data);
      setPrices(response.data);

      // Extract names from the categories
      const allNames = response.data.flatMap(price => price.categories.map(category => category.name));
      setNames([...new Set(allNames)]); // Use a Set to remove duplicates
    } catch (err) {
      setError('Failed to fetch prices.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single price by ID
  const fetchPriceById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/prices/${id}`);
      setSinglePrice(response.data);
    } catch (err) {
      setError('Failed to fetch price.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new price
  const addPrice = async (price) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/prices/`, price);
      setPrices([...prices, response.data]);
    } catch (err) {
      setError('Failed to add price.');
    } finally {
      setLoading(false);
    }
  };

  // Update existing price
  const updatePrice = async (id, updatedPrice) => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/prices/${id}`, updatedPrice);
      setPrices(prices.map((price) => (price._id === id ? response.data : price)));
    } catch (err) {
      setError('Failed to update price.');
    } finally {
      setLoading(false);
    }
  };

  // Delete price
  const deletePrice = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/prices/${id}`);
      setPrices(prices.filter((price) => price._id !== id));
    } catch (err) {
      setError('Failed to delete price.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate price based on shipment details
  const calculatePrice = async (shipmentDetails) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/prices/calculate`, shipmentDetails);
      console.log(response.data);
      return response.data.totalPrice;
    } catch (err) {
      setError('Failed to calculate price.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Inside PriceProvider
  return (
    <PriceContext.Provider
      value={{
        prices,
        loading,
        error,
        addPrice,
        updatePrice,
        deletePrice,
        calculatePrice,
        singlePrice,
        fetchPriceById,
        fetchPrices,
        names // Provide names here
      }}
    >
      {children}
    </PriceContext.Provider>
  );
};

// Custom hook to use the PriceContext
export const usePrices = () => {
  return useContext(PriceContext);
};
