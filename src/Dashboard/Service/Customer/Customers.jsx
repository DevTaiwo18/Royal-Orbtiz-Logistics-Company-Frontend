import React, { useState, useEffect } from 'react';
import { useCustomers } from '../../../context/CustomerContext';

const Customers = () => {
  const { customers, loading, error, addCustomer, deleteCustomer } = useCustomers();
  const [newCustomer, setNewCustomer] = useState({ name: '', address: '', phoneNumber: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (newCustomer.name && newCustomer.address && newCustomer.phoneNumber) {
      addCustomer(newCustomer);
      setNewCustomer({ name: '', address: '', phoneNumber: '' });
      setShowAddForm(false);
    } else {
      alert('Please fill out all fields.');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Customers</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="mb-6 px-4 py-2 bg-purple-500 text-white rounded-md shadow-sm hover:bg-purple-600"
      >
        {showAddForm ? 'Cancel' : 'Add Customer'}
      </button>

      {showAddForm && (
        <form onSubmit={handleAddCustomer} className="mb-6 p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
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
                className="mt-1 outline-none block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2"
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
                className="mt-1 outline-none block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2"
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
                className="mt-1 outline-none block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Add Customer
            </button>
          </div>
        </form>
      )}

      <table className="w-full bg-white border border-gray-300 rounded-md shadow-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 border-b text-left">Name</th>
            <th className="p-4 border-b text-left">Address</th>
            <th className="p-4 border-b text-left">Phone Number</th>
            <th className="p-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td className="p-4 border-b">{customer.name}</td>
              <td className="p-4 border-b">{customer.address}</td>
              <td className="p-4 border-b">{customer.phoneNumber}</td>
              <td className="p-4 border-b">
                <button
                  onClick={() => handleDelete(customer._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
