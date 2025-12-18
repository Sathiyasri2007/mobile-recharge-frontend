import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [totalCashback, setTotalCashback] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const savedHistory = localStorage.getItem('rechargeHistory');
    const savedCashback = localStorage.getItem('totalCashback');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }
    
    if (savedHistory) {
      setRechargeHistory(JSON.parse(savedHistory));
    }
    
    if (savedCashback) {
      setTotalCashback(parseFloat(savedCashback));
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsLoggedIn(true);
      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      const { token, user: newUser } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setUser(newUser);
      setIsLoggedIn(true);
      return newUser;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rechargeHistory');
    localStorage.removeItem('totalCashback');
    setUser(null);
    setIsLoggedIn(false);
    setRechargeHistory([]);
    setTotalCashback(0);
  };

  const clearHistory = () => {
    setRechargeHistory([]);
    setTotalCashback(0);
    localStorage.removeItem('rechargeHistory');
    localStorage.removeItem('totalCashback');
  };

  const addRecharge = async (rechargeData) => {
    try {
      // Save to backend
      console.log('Attempting to save transaction:', rechargeData);
      const { transactionAPI } = await import('../services/api');
      const response = await transactionAPI.createTransaction({
        mobile: rechargeData.mobile,
        operator: rechargeData.operator,
        amount: rechargeData.amount,
        planName: rechargeData.plan
      });
      console.log('Transaction saved to backend:', response.data);
      
      const newRecharge = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        operator: rechargeData.operator,
        mobile: rechargeData.mobile,
        amount: rechargeData.amount,
        plan: rechargeData.plan,
        status: 'Success',
        cashback: rechargeData.cashback || 0
      };
      
      const updatedHistory = [newRecharge, ...rechargeHistory];
      const updatedCashback = totalCashback + (rechargeData.cashback || 0);
      
      setRechargeHistory(updatedHistory);
      setTotalCashback(updatedCashback);
      
      localStorage.setItem('rechargeHistory', JSON.stringify(updatedHistory));
      localStorage.setItem('totalCashback', updatedCashback.toString());
      
      return newRecharge;
    } catch (error) {
      console.error('Failed to save transaction:', error);
      // Don't throw error, just log it so recharge still works locally
      const newRecharge = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        operator: rechargeData.operator,
        mobile: rechargeData.mobile,
        amount: rechargeData.amount,
        plan: rechargeData.plan,
        status: 'Success',
        cashback: rechargeData.cashback || 0
      };
      
      const updatedHistory = [newRecharge, ...rechargeHistory];
      const updatedCashback = totalCashback + (rechargeData.cashback || 0);
      
      setRechargeHistory(updatedHistory);
      setTotalCashback(updatedCashback);
      
      localStorage.setItem('rechargeHistory', JSON.stringify(updatedHistory));
      localStorage.setItem('totalCashback', updatedCashback.toString());
      
      return newRecharge;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        rechargeHistory,
        totalCashback,
        loading,
        login,
        signup,
        logout,
        addRecharge,
        clearHistory
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};