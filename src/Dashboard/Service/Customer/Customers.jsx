import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useCustomers } from '../../../context/CustomerContext';

const Customers = () => {
  const { fetchCustomers, addCustomer, deleteCustomer, customers, loading, error } = useCustomers();
  const [newCustomer, setNewCustomer] = useState({ name: '', address: '', phoneNumber: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      await fetchCustomers();
    };

    loadCustomers();
  }, [fetchCustomers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addCustomer(newCustomer);
      setNewCustomer({ name: '', address: '', phoneNumber: '' });
    } catch (err) {
      console.error('Error adding customer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
      } catch (err) {
        console.error('Error deleting customer:', err);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Customers</h1>

      <form onSubmit={handleAddCustomer} className="mb-6 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Add New Customer</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newCustomer.name}
              onChange={handleInputChange}
              className="mt-1 block w-full outline-none border border-gray-300 rounded-md shadow-sm sm:text-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={newCustomer.address}
              onChange={handleInputChange}
              className="mt-1 block w-full outline-none border border-gray-300 rounded-md shadow-sm sm:text-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={newCustomer.phoneNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full outline-none border border-gray-300 rounded-md shadow-sm sm:text-sm p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={submitting}
          >
            {submitting ? 'Adding...' : 'Add Customer'}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center text-gray-700">Loading...</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(customer._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customers;
