import React, { useState, useEffect } from 'react';
import { usePayrolls } from '../../../context/PayrollContext'; // Importing PayrollContext
import { useBranch } from '../../../context/BranchContext'; // Importing BranchContext
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing Font Awesome icons

const Payroll = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [branch, setBranch] = useState('');
  const [role, setRole] = useState('');
  const [payPeriod, setPayPeriod] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [overtimePay, setOvertimePay] = useState('');
  const [bonuses, setBonuses] = useState('');
  const [taxDeductions, setTaxDeductions] = useState('');
  const [otherDeductions, setOtherDeductions] = useState('');
  const [grossPay, setGrossPay] = useState(0);
  const [totalDeductions, setTotalDeductions] = useState(0);
  const [netPay, setNetPay] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [currentPayrollId, setCurrentPayrollId] = useState(null);
  const { payrolls, fetchPayrolls, createPayroll, deletePayroll, updatePayroll } = usePayrolls();
  const { fetchAllBranches } = useBranch();
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const allBranches = await fetchAllBranches();
        setBranches(allBranches);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    loadBranches();
    fetchPayrolls(); // Fetch payrolls when the component mounts
  }, [fetchAllBranches, fetchPayrolls]);

  useEffect(() => {
    const calculatedGrossPay = parseFloat(basicSalary || 0) + parseFloat(overtimePay || 0) + parseFloat(bonuses || 0);
    setGrossPay(calculatedGrossPay);

    const calculatedTotalDeductions = parseFloat(taxDeductions || 0) + parseFloat(otherDeductions || 0);
    setTotalDeductions(calculatedTotalDeductions);

    setNetPay(calculatedGrossPay - calculatedTotalDeductions);
  }, [basicSalary, overtimePay, bonuses, taxDeductions, otherDeductions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payrollData = {
      employeeName,
      branch,
      employeeRole: role,
      payPeriod,
      basicSalary: parseFloat(basicSalary),
      overtimePay: parseFloat(overtimePay || 0),
      bonuses: parseFloat(bonuses || 0),
      taxDeductions: parseFloat(taxDeductions || 0),
      otherDeductions: parseFloat(otherDeductions || 0),
      grossPay,
      totalDeductions,
      netPay,
    };

    try {
      if (editMode) {
        await updatePayroll(currentPayrollId, payrollData); // Update existing payroll
      } else {
        await createPayroll(payrollData); // Create new payroll
      }
      resetForm(); // Reset form after successful operation
      fetchPayrolls(); // Refresh payroll list
    } catch (error) {
      console.error('Error saving payroll:', error);
    }
  };

  const resetForm = () => {
    setEmployeeName('');
    setBranch('');
    setRole('');
    setPayPeriod('');
    setBasicSalary('');
    setOvertimePay('');
    setBonuses('');
    setTaxDeductions('');
    setOtherDeductions('');
    setEditMode(false);
    setCurrentPayrollId(null);
  };

  const formatCurrencyInput = (value) => {
    if (!value) return '';
    return parseFloat(value).toLocaleString('en-NG', { minimumFractionDigits: 0 });
  };

  const handleEdit = (payroll) => {
    setEditMode(true);
    setCurrentPayrollId(payroll._id);
    setEmployeeName(payroll.employeeName);
    setBranch(payroll.branch);
    setRole(payroll.employeeRole);
    setPayPeriod(payroll.payPeriod);
    setBasicSalary(payroll.basicSalary.toString());
    setOvertimePay(payroll.overtimePay.toString());
    setBonuses(payroll.bonuses.toString());
    setTaxDeductions(payroll.taxDeductions.toString());
    setOtherDeductions(payroll.otherDeductions.toString());
  };

  return (
    <div className="p-6 bg-white shadow-2xl min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Payroll Management</h1>
      <form className="space-y-6 mb-8" onSubmit={handleSubmit}>
        <div className="flex gap-8">
          <div className="flex-1">
            <label className="block text-gray-600 text-lg font-semibold">Employee Name</label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-600 text-lg font-semibold">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
              required
            >
              <option value="">Select Role</option>
              <option value="Driver">Driver</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Operations">Operations</option>
              <option value="Admin">Admin</option>
              <option value="Sales">Sales</option>
              <option value="Logistics">Logistics</option>
              <option value="Manager">Manager</option>
              <option value="Accountant">Accountant</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <label className="block text-gray-600 text-lg font-semibold">Branch</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
              required
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch.name}>{branch.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-gray-600 text-lg font-semibold">Pay Period</label>
            <select
              value={payPeriod}
              onChange={(e) => setPayPeriod(e.target.value)}
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
              required
            >
              <option value="">Select Pay Period</option>
              <option value="weekly">Weekly</option>
              <option value="endOfMonth">End of Month</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <label className="block text-gray-600 text-lg font-semibold">Basic Salary</label>
            <input
              type="text"
              value={formatCurrencyInput(basicSalary)}
              onChange={(e) => setBasicSalary(e.target.value.replace(/,/g, ''))}
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-600 text-lg font-semibold">Overtime Pay</label>
            <input
              type="text"
              value={formatCurrencyInput(overtimePay)}
              onChange={(e) => setOvertimePay(e.target.value.replace(/,/g, ''))}
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
            />
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <label className="block text-gray-600 text-lg font-semibold">Bonuses</label>
            <input
              type="text"
              value={formatCurrencyInput(bonuses)}
              onChange={(e) => setBonuses(e.target.value.replace(/,/g, ''))}
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-600 text-lg font-semibold">Tax Deductions</label>
            <input
              type="text"
              value={formatCurrencyInput(taxDeductions)}
              onChange={(e) => setTaxDeductions(e.target.value.replace(/,/g, ''))}
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
            />
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <label className="block text-gray-600 text-lg font-semibold">Other Deductions</label>
            <input
              type="text"
              value={formatCurrencyInput(otherDeductions)}
              onChange={(e) => setOtherDeductions(e.target.value.replace(/,/g, ''))}
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-yellow-100"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-600 text-lg font-semibold">Gross Pay</label>
            <input
              type="text"
              value={formatCurrencyInput(grossPay)}
              readOnly
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none bg-gray-200"
            />
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <label className="block text-gray-600 text-lg font-semibold">Total Deductions</label>
            <input
              type="text"
              value={formatCurrencyInput(totalDeductions)}
              readOnly
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none bg-gray-200"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-600 text-lg font-semibold">Net Pay</label>
            <input
              type="text"
              value={formatCurrencyInput(netPay)}
              readOnly
              className="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full outline-none bg-gray-200"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none"
        >
          {editMode ? 'Update Payroll' : 'Add Payroll'}
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Existing Payrolls</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        {payrolls.length === 0 ? (
          <p className="text-gray-600">No payroll records available.</p>
        ) : (
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-600 text-xs uppercase tracking-wider">
              <tr className="text-center">
                <th className="py-2 px-4 uppercase">Employee Name</th>
                <th className="py-2 px-4 uppercase">Branch</th>
                <th className="py-2 px-4 uppercase">Role</th>
                <th className="py-2 px-4 uppercase">Pay Period</th>
                <th className="py-2 px-4 uppercase">Gross Pay</th>
                <th className="py-2 px-4 uppercase">Total Deductions</th>
                <th className="py-2 px-4 uppercase">Net Pay</th>
                <th className="py-2 px-4 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((payroll) => (
                <tr key={payroll._id} className="border-t text-center text-xs">
                  <td className="py-2 px-4">{payroll.employeeName?.toUpperCase() || 'N/A'}</td>
                  <td className="py-2 px-4">{payroll.branch?.toUpperCase() || 'N/A'}</td>
                  <td className="py-2 px-4">{payroll.employeeRole?.toUpperCase() || 'N/A'}</td>
                  <td className="py-2 px-4">{payroll.payPeriod === 'weekly' ? 'WEEKLY' : 'END OF MONTH'}</td>
                  <td className="py-2 px-4">{`₦${payroll.grossPay?.toLocaleString() || '0'}`}</td>
                  <td className="py-2 px-4">{`₦${payroll.totalDeductions?.toLocaleString() || '0'}`}</td>
                  <td className="py-2 px-4">{`₦${payroll.netPay?.toLocaleString() || '0'}`}</td>
                  <td className="py-2 px-4 flex justify-center gap-4">
                    <button
                      onClick={() => handleEdit(payroll)}   
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deletePayroll(payroll._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Payroll;
