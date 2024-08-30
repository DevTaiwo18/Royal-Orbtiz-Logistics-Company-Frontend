import React, { useState, useEffect } from 'react';
import { useBranch } from '../../../context/BranchContext';

const Branch = () => {
  const { fetchAllBranches, createBranch, branches, error } = useBranch();
  const [branchDetails, setBranchDetails] = useState({ name: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadBranches = async () => {
      await fetchAllBranches();
    };

    loadBranches();
  }, [fetchAllBranches]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBranchDetails({ ...branchDetails, [name]: value });
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createBranch(branchDetails.name, branchDetails.password);
      setBranchDetails({ name: '', password: '' });
      await fetchAllBranches();
    } catch (err) {
      console.error('Error creating branch:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Branch Management</h1>

      {/* Form to create a new branch */}
      <form onSubmit={handleCreateBranch} className="mb-6 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Create New Branch</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Branch Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={branchDetails.name}
              onChange={handleInputChange}
              className="mt-1 block w-full outline-none border border-gray-300 rounded-md shadow-sm sm:text-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={branchDetails.password}
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
            {submitting ? 'Creating...' : 'Create Branch'}
          </button>
        </div>
      </form>

      {/* Display list of branches */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Branches List</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {branches.map((branch) => (
              <tr key={branch._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{branch.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{branch.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default Branch;
