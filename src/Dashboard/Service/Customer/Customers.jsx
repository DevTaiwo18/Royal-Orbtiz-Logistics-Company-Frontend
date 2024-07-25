import React, { useState, useEffect } from 'react';
import { useCustomers } from '../../../context/CustomerContext';
import { FaEdit, FaTrash, FaRegSadCry } from 'react-icons/fa';

const Customers = () => {
  const { customers, loading, error, addCustomer, updateCustomer, deleteCustomer, currentPage, setCurrentPage, totalPages } = useCustomers();
  const [newCustomer, setNewCustomer] = useState({ name: '', address: '', phoneNumber: '' });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setCurrentPage(1);
  }, [totalPages, setCurrentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (newCustomer.name && newCustomer.address && newCustomer.phoneNumber) {
      setSubmitting(true);
      await addCustomer(newCustomer);
      handleCancel();
      setSubmitting(false);
    } else {
      alert('Please fill out all fields.');
    }
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    if (newCustomer.name && newCustomer.address && newCustomer.phoneNumber) {
      setSubmitting(true);
      await updateCustomer(editingCustomer._id, newCustomer);
      handleCancel();
      setSubmitting(false);
    } else {
      alert('Please fill out all fields.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id);
      if (customers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setNewCustomer({ name: customer.name, address: customer.address, phoneNumber: customer.phoneNumber });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setEditingCustomer(null);
    setNewCustomer({ name: '', address: '', phoneNumber: '' });
    setShowAddForm(false);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Customers</h1>

      {loading && <p className="text-gray-500 mb-3">Loading...</p>}
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <div className="mb-6 flex flex-col md:flex-row md:space-x-4 items-start md:items-center">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 outline-none rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm w-full md:w-64 mb-4 md:mb-0"
        />
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-md shadow-sm hover:bg-purple-600"
          >
            Add Customer
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer} className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2"
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2"
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-2"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : (editingCustomer ? 'Update Customer' : 'Add Customer')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <table className="w-full bg-white border border-gray-300 rounded-md shadow-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-4 text-sm border-b text-left">Name</th>
            <th className="p-4 text-sm border-b text-left">Address</th>
            <th className="p-4 text-sm border-b text-left">Phone Number</th>
            <th className="p-4 text-sm border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
            <tr key={customer._id} className="hover:bg-gray-50">
              <td className="p-4 text-sm  border-b">{customer.name}</td>
              <td className="p-4 text-sm  border-b">{customer.address}</td>
              <td className="p-4 text-sm  border-b">{customer.phoneNumber}</td>
              <td className="p-4 text-sm  border-b flex space-x-2">
                <button
                  onClick={() => handleEdit(customer)}
                  className="text-purple-500 hover:text-purple-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(customer._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" className="text-center p-6">
                <div className="flex flex-col items-center">
                  <FaRegSadCry className="text-6xl text-gray-500 mb-4" />
                  <p className="text-lg text-gray-600">No customers found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 bg-purple-500 text-white rounded-md shadow-sm hover:bg-purple-600 disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-purple-500 text-white rounded-md shadow-sm hover:bg-purple-600 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Customers;
