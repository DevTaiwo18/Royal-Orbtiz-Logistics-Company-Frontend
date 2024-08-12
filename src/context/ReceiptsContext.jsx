import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

// Get the base URL from environment variable
const apiUrl = import.meta.env.VITE_APP_API_URL;

// Set the base URL for Axios
axios.defaults.baseURL = apiUrl;

// Create a context for receipts
const ReceiptsContext = createContext();

// Create a custom hook to use the ReceiptsContext
export const useReceipts = () => {
    return useContext(ReceiptsContext);
};

// Create a provider component
export const ReceiptsProvider = ({ children }) => {
    const [receipts, setReceipts] = useState([]);
    const [singleReceipt, setSingleReceipt] = useState(null); // New state for single receipt
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all receipts by sender's name
    const fetchReceiptsBySenderName = useCallback(async (senderName) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/receipts/${senderName}`);
            setReceipts(response.data);
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch the latest receipt by sender's name
    const fetchLatestReceiptBySenderName = useCallback(async (senderName) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/receipts/latest/sender/${senderName}`);
            setReceipts(response.data); // Assuming it's still an array
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch a receipt by waybill number
    const fetchReceiptByWaybillNumber = useCallback(async (waybillNumber) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/receipts/waybill/${waybillNumber}`);
            setSingleReceipt(response.data.pdf.data.data); // Set single receipt separately
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete a receipt by its ID
    const deleteReceipt = useCallback(async (receiptId) => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`/receipts/${receiptId}`);
            setReceipts((prevReceipts) => prevReceipts.filter(receipt => receipt._id !== receiptId));
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <ReceiptsContext.Provider
            value={{
                receipts,
                singleReceipt,
                loading,
                error,
                fetchReceiptsBySenderName,
                fetchLatestReceiptBySenderName,
                fetchReceiptByWaybillNumber,
                deleteReceipt
            }}
        >
            {children}
        </ReceiptsContext.Provider>
    );
};
