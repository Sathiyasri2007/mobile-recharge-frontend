import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const cardAnimationStyle = `
  .plan-card {
    transition: all 0.3s ease;
  }
  .plan-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  }
  .plan-button {
    transition: all 0.2s ease;
  }
  .plan-button:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(227, 83, 54, 0.4);
  }
  .plan-button:active {
    transform: scale(0.98);
  }
`;

const PlanCard = ({ plan }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const handleRecharge = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate('/payment', { state: { plan } });
  };

  return (
    <div>
      <style>{cardAnimationStyle}</style>
      <div className="bg-accent rounded-lg shadow-lg p-6 border plan-card">
      <h3 className="text-lg font-semibold text-primary mb-2">{plan.planName || plan.name}</h3>
      <div className="text-2xl font-bold text-secondary mb-2">₹{plan.price}</div>
      <p className="text-secondary mb-2">Validity: {plan.validity} days</p>
      <p className="text-xs text-primary mb-4">{plan.description}</p>
      <ul className="text-xs text-primary mb-4 space-y-1">
        <li className="flex items-center">
          <span className="text-secondary mr-2">✓</span>
          Data: {plan.data}
        </li>
        <li className="flex items-center">
          <span className="text-secondary mr-2">✓</span>
          Talk Time: {plan.talkTime}
        </li>
        <li className="flex items-center">
          <span className="text-secondary mr-2">✓</span>
          SMS: {plan.sms}
        </li>
      </ul>
      <button 
        onClick={handleRecharge}
        className="w-full bg-primary text-light py-3 rounded hover:bg-secondary transition-colors shadow-md text-sm font-semibold plan-button"
      >
        Recharge Now
      </button>
      </div>
    </div>
  );
};

export default PlanCard;