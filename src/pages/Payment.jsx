import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const paymentAnimationStyle = `
  .payment-btn {
    transition: all 0.3s ease;
  }
  .payment-btn:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 4px 12px rgba(227, 83, 54, 0.3);
  }
  .payment-btn:active {
    transform: translateY(0) scale(0.98);
  }
`;

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, addRecharge } = useAuth();
  const { plan } = location.state || {};
  const [formData, setFormData] = useState({ mobile: '', operator: '' });
  const [offerCode, setOfferCode] = useState('');
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const defaultPlan = { name: 'Sample Plan', price: 299, validity: '28 days' };
  const currentPlan = plan || defaultPlan;
  const [finalAmount, setFinalAmount] = useState(currentPlan.price);

  const offers = [
    { code: 'CASH5', discount: 5, type: 'percentage', minAmount: 200 },
    { code: 'FLAT50', discount: 50, type: 'flat', minAmount: 500 },
    { code: 'FIRST10', discount: 10, type: 'percentage', minAmount: 100 }
  ];

  const getApplicableOffers = () => {
    return offers.filter(offer => currentPlan.price >= offer.minAmount);
  };

  const selectOffer = (offer) => {
    let discount = 0;
    if (offer.type === 'percentage') {
      discount = (currentPlan.price * offer.discount) / 100;
    } else {
      discount = offer.discount;
    }
    
    const newAmount = Math.max(0, currentPlan.price - discount);
    setFinalAmount(newAmount);
    setAppliedOffer({ ...offer, discount });
    setOfferCode(offer.code);
    setShowOfferModal(false);
    alert(`Offer applied! You saved ₹${discount}`);
  };

  const showOffers = () => {
    if (currentPlan.price < 500) {
      alert('Offers are available only for recharges above ₹500');
      return;
    }
    setShowOfferModal(true);
  };

  const removeOffer = () => {
    setFinalAmount(currentPlan.price);
    setAppliedOffer(null);
    setOfferCode('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rechargeData = {
      operator: formData.operator,
      mobile: formData.mobile,
      amount: finalAmount,
      plan: currentPlan.planName || currentPlan.name,
      originalAmount: currentPlan.price,
      offer: appliedOffer,
      cashback: Math.round(finalAmount * 0.02)
    };
    
    try {
      await addRecharge(rechargeData);
      navigate('/success', { state: { rechargeData } });
    } catch (error) {
      console.error('Recharge failed:', error);
      alert('Recharge failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <style>{paymentAnimationStyle}</style>
      <div className="min-h-screen bg-light py-8">
      <div className="container mx-auto px-4 max-w-2xl py-12">
        <h1 className="text-3xl font-bold text-center text-secondary mb-8">Payment</h1>
        
        <div className="bg-accent rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-secondary mb-2">{currentPlan.name}</h3>
          <div className="text-2xl font-bold text-secondary mb-2">
            {appliedOffer ? (
              <div>
                <span className="line-through text-gray-500">₹{currentPlan.price}</span>
                <span className="ml-2">₹{finalAmount}</span>
                <div className="text-sm text-green-600">Saved ₹{appliedOffer.discount}</div>
              </div>
            ) : (
              `₹${currentPlan.price}`
            )}
          </div>
          <p className="text-secondary opacity-70">Validity: {currentPlan.validity}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-accent rounded-lg shadow-md p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary mb-2">
              Mobile Number
            </label>
            <input
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-secondary focus:border-secondary text-lg"
              placeholder="Enter mobile number"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary mb-2">
              Operator
            </label>
            <select
              name="operator"
              value={formData.operator}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-secondary focus:border-secondary text-lg"
              required
            >
              <option value="">Select Operator</option>
              <option value="airtel">Airtel</option>
              <option value="jio">Jio</option>
              <option value="vi">Vi</option>
              <option value="bsnl">BSNL</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-secondary mb-2">
              Offer Code (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={offerCode}
                onChange={(e) => setOfferCode(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-secondary focus:border-secondary text-lg"
                placeholder="Enter offer code"
              />
              <button
                type="button"
                onClick={showOffers}
                className="bg-primary text-light px-6 py-3 rounded-md hover:bg-secondary transition-colors payment-btn"
              >
                Apply Offer
              </button>
            </div>
            {appliedOffer && (
              <div className="mt-2 flex items-center justify-between bg-green-100 p-2 rounded">
                <span className="text-green-800 text-sm">Offer {appliedOffer.code} applied</span>
                <button
                  type="button"
                  onClick={removeOffer}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-light py-4 rounded-md hover:bg-secondary transition-colors font-semibold text-lg payment-btn"
          >
            Pay ₹{finalAmount}
          </button>
        </form>

        {/* Offer Modal */}
        {showOfferModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-light rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-secondary">Available Offers</h3>
                <button 
                  onClick={() => setShowOfferModal(false)}
                  className="text-secondary hover:text-primary text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                {getApplicableOffers().map(offer => (
                  <div key={offer.code} className="border rounded-lg p-4 hover:bg-accent transition-colors">
                    <h4 className="font-semibold text-primary mb-2">
                      {offer.type === 'percentage' ? `${offer.discount}% Off` : `₹${offer.discount} Off`}
                    </h4>
                    <p className="text-sm text-secondary mb-3">
                      Minimum recharge: ₹{offer.minAmount}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-accent text-secondary px-2 py-1 rounded">
                        Code: {offer.code}
                      </span>
                      <button 
                        onClick={() => selectOffer(offer)}
                        className="bg-primary text-light px-4 py-1 rounded text-sm hover:bg-secondary transition-colors payment-btn"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
                
                {getApplicableOffers().length === 0 && (
                  <p className="text-center text-secondary py-4">
                    No offers available for this amount. Minimum ₹500 required.
                  </p>
                )}
              </div>
              
              <button 
                onClick={() => setShowOfferModal(false)}
                className="mt-4 w-full bg-secondary text-light py-2 rounded hover:bg-primary transition-colors payment-btn"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Payment;