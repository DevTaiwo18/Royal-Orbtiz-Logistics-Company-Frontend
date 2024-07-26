import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

const Setting = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { changePassword, user } = useAuth(); 

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      setLoading(true); // Start loading state
      try {
        await changePassword(user.username, currentPassword, newPassword);
        alert('Password updated successfully!');
        
        // Clear input fields on successful password update
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (error) {
        alert('Password update failed.');
      } finally {
        setLoading(false); // End loading state
      }
    } else {
      alert('Passwords do not match.');
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-gray-100">
      <div className="flex-1 bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-lg font-bold mb-6">Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
                className="mt-1 block outline-none w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm py-3 px-4"
                required
              />
            </div>

            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                className="mt-1 outline-none block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm py-3 px-4"
                required
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="mt-1 outline-none block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm py-3 px-4"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0 8 8 0 01-16 0z"></path>
              </svg>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setting;
