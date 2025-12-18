import { useState, useEffect } from 'react';
import { usePlans } from '../context/PlanContext';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Dashboard = () => {
  const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const { plans, addPlan, updatePlan, deletePlan } = usePlans();
  const { clearHistory } = useAuth();
  const [newPlan, setNewPlan] = useState({ name: '', price: '', validity: '' });
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchTransactions();
      fetchUsers();
    }
    console.log('Plans in dashboard:', plans);
  }, [isAdminLoggedIn, plans]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getUsers();
      console.log('Users response:', response.data);
      setUsers(response.data.users || response.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.deleteUser(id);
        setUsers(users.filter(user => user._id !== id));
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleAddPlan = async () => {
    if (newPlan.name && newPlan.price && newPlan.validity) {
      try {
        const planData = {
          planName: newPlan.name, 
          price: Number(newPlan.price), 
          validity: Number(newPlan.validity),
          description: `${newPlan.name} plan`,
          data: '1GB/day',
          talkTime: 'Unlimited',
          sms: '100/day',
          category: 'prepaid' 
        };
        console.log('Adding plan with data:', planData);
        console.log('Validity value:', newPlan.validity, 'Type:', typeof newPlan.validity);
        await addPlan(planData);
        setNewPlan({ name: '', price: '', validity: '' });
        alert('Plan added successfully!');
      } catch (error) {
        console.error('Failed to add plan:', error);
        alert(`Failed to add plan: ${error.response?.data?.message || error.message}`);
      }
    } else {
      alert('Please fill all fields');
    }
  };

  const handleUpdatePlan = async (id, updatedPlan) => {
    try {
      await updatePlan(id, { ...updatedPlan, price: Number(updatedPlan.price) });
      setEditingPlan(null);
      alert('Plan updated successfully!');
    } catch (error) {
      console.error('Failed to update plan:', error);
      alert('Failed to update plan');
    }
  };

  const handleDeletePlan = async (id) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      try {
        await deletePlan(id);
        alert('Plan deleted successfully!');
      } catch (error) {
        console.error('Failed to delete plan:', error);
        alert('Failed to delete plan');
      }
    }
  };

  const clearAllTransactions = async () => {
    if (confirm('Are you sure you want to clear all transactions? This action cannot be undone.')) {
      try {
        const response = await fetch('http://localhost:5000/api/transactions/clear', {
          method: 'DELETE'
        });
        if (response.ok) {
          setTransactions([]);
          alert('All transactions cleared successfully!');
        } else {
          alert('Failed to clear transactions');
        }
      } catch (error) {
        console.error('Failed to clear transactions:', error);
        alert('Failed to clear transactions');
      }
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-light p-6 flex items-center justify-center">
        <div className="bg-accent p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-secondary mb-4">Access Denied</h2>
          <p className="text-secondary mb-4">Please login as admin to view dashboard</p>
          <a href="/login" className="bg-primary text-light px-6 py-2 rounded">
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-secondary">Admin Dashboard</h1>
        <button 
          onClick={() => {
            localStorage.removeItem('adminLoggedIn');
            window.location.href = '/login';
          }}
          className="bg-primary text-light px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Plan Management */}
      <div className="bg-accent p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-secondary mb-4">Manage Plans</h2>
        
        {/* Add New Plan */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <input 
            placeholder="Plan Name" 
            value={newPlan.name}
            onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
            className="p-2 rounded"
          />
          <input 
            placeholder="Price" 
            type="number"
            value={newPlan.price}
            onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
            className="p-2 rounded"
          />
          <input 
            placeholder="Validity" 
            value={newPlan.validity}
            onChange={(e) => setNewPlan({...newPlan, validity: e.target.value})}
            className="p-2 rounded"
          />
          <button onClick={handleAddPlan} className="bg-primary text-light p-2 rounded">Add Plan</button>
        </div>

        {/* Plans List */}
        <div className="space-y-2">
          {plans.map(plan => (
            <div key={plan._id} className="flex items-center justify-between bg-light p-4 rounded">
              {editingPlan === plan._id ? (
                <div className="flex gap-2 flex-1">
                  <input 
                    defaultValue={plan.name}
                    onBlur={(e) => handleUpdatePlan(plan._id, {...plan, name: e.target.value})}
                    className="p-1 rounded flex-1"
                  />
                  <input 
                    defaultValue={plan.price}
                    onBlur={(e) => handleUpdatePlan(plan._id, {...plan, price: e.target.value})}
                    className="p-1 rounded w-20"
                  />
                  <input 
                    defaultValue={plan.validity}
                    onBlur={(e) => handleUpdatePlan(plan._id, {...plan, validity: e.target.value})}
                    className="p-1 rounded w-24"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <span className="font-semibold">{plan.planName || plan.name}</span> - ₹{plan.price} - {plan.validity} days
                </div>
              )}
              <div className="space-x-2">
                <button 
                  onClick={() => setEditingPlan(editingPlan === plan._id ? null : plan._id)}
                  className="bg-secondary text-light px-3 py-1 rounded text-sm"
                >
                  {editingPlan === plan._id ? 'Save' : 'Edit'}
                </button>
                <button 
                  onClick={() => handleDeletePlan(plan._id)}
                  className="bg-red-500 text-light px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Management */}
      <div className="bg-accent p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-secondary mb-4">User Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-light">
                <th className="p-2 text-left">Username</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="p-2">{user.username}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.phone}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">
                    <button 
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 text-light px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-accent p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-secondary">Transaction History</h2>
          <div className="space-x-2">
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to clear user transaction history? This action cannot be undone.')) {
                  clearHistory();
                  alert('User transaction history cleared successfully!');
                }
              }}
              className="bg-orange-500 text-light px-4 py-2 rounded hover:bg-orange-600 transition-colors"
            >
              Clear User History
            </button>
            <button 
              onClick={clearAllTransactions}
              className="bg-red-500 text-light px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Clear All Transactions
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-light">
                <th className="p-2 text-left">Mobile</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Plan</th>
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{tx.mobile}</td>
                  <td className="p-2">₹{tx.amount}</td>
                  <td className="p-2">{tx.planName}</td>
                  <td className="p-2">{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
