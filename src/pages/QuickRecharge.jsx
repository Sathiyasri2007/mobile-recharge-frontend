import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const QuickRecharge = () => {
  const { isLoggedIn, addRecharge } = useAuth();
  const navigate = useNavigate();
  const [savedNumbers, setSavedNumbers] = useState([]);
  const [newNumber, setNewNumber] = useState({ mobile: '', operator: '', nickname: '' });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    loadSavedNumbers();
  }, [isLoggedIn, navigate]);

  const loadSavedNumbers = () => {
    const saved = JSON.parse(localStorage.getItem('savedNumbers') || '[]');
    setSavedNumbers(saved);
  };

  const saveNumber = () => {
    if (newNumber.mobile && newNumber.operator && newNumber.nickname) {
      const updated = [...savedNumbers, { ...newNumber, id: Date.now() }];
      setSavedNumbers(updated);
      localStorage.setItem('savedNumbers', JSON.stringify(updated));
      setNewNumber({ mobile: '', operator: '', nickname: '' });
    }
  };

  const quickRecharge = async (number, amount) => {
    try {
      await addRecharge({
        mobile: number.mobile,
        operator: number.operator,
        amount: amount,
        plan: `Quick Recharge ₹${amount}`,
        cashback: Math.round(amount * 0.02)
      });
      navigate('/success', { 
        state: { 
          rechargeData: {
            mobile: number.mobile,
            operator: number.operator,
            amount: amount,
            plan: `Quick Recharge ₹${amount}`,
            cashback: Math.round(amount * 0.02)
          }
        }
      });
    } catch (error) {
      alert('Recharge failed. Please try again.');
    }
  };

  const removeNumber = (id) => {
    const updated = savedNumbers.filter(num => num.id !== id);
    setSavedNumbers(updated);
    localStorage.setItem('savedNumbers', JSON.stringify(updated));
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-secondary mb-8">Quick Recharge</h1>

        {/* Add New Number */}
        <div className="bg-accent p-6 rounded-lg mb-8 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-secondary mb-4">Save New Number</h2>
          <div className="space-y-4">
            <input
              type="tel"
              placeholder="Mobile Number"
              value={newNumber.mobile}
              onChange={(e) => setNewNumber({...newNumber, mobile: e.target.value})}
              className="w-full p-3 rounded border"
            />
            <select
              value={newNumber.operator}
              onChange={(e) => setNewNumber({...newNumber, operator: e.target.value})}
              className="w-full p-3 rounded border"
            >
              <option value="">Select Operator</option>
              <option value="airtel">Airtel</option>
              <option value="jio">Jio</option>
              <option value="vi">Vi</option>
              <option value="bsnl">BSNL</option>
            </select>
            <input
              type="text"
              placeholder="Nickname (e.g., Mom, Dad)"
              value={newNumber.nickname}
              onChange={(e) => setNewNumber({...newNumber, nickname: e.target.value})}
              className="w-full p-3 rounded border"
            />
            <button
              onClick={saveNumber}
              className="w-full bg-primary text-light py-3 rounded hover:bg-secondary transition-colors"
            >
              Save Number
            </button>
          </div>
        </div>

        {/* Saved Numbers */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedNumbers.map((number) => (
            <div key={number.id} className="bg-accent p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-secondary">{number.nickname}</h3>
                  <p className="text-primary">{number.mobile}</p>
                  <p className="text-sm text-secondary capitalize">{number.operator}</p>
                </div>
                <button
                  onClick={() => removeNumber(number.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-secondary">Quick Amounts:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[99, 199, 299, 499].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => quickRecharge(number, amount)}
                      className="bg-primary text-light py-2 px-4 rounded hover:bg-secondary transition-colors text-sm"
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {savedNumbers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary text-lg">No saved numbers yet. Add your first number above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickRecharge;