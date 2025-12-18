import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navbarAnimationStyle = `
  .navbar-btn {
    transition: all 0.3s ease;
  }
  .navbar-btn:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 4px 12px rgba(227, 83, 54, 0.3);
  }
  .navbar-btn:active {
    transform: translateY(0) scale(0.98);
  }
`;

const Navbar = () => {
  const { isLoggedIn, logout, totalCashback } = useAuth();

  return (
    <>
      <style>{navbarAnimationStyle}</style>
      <nav className="bg-secondary text-light p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold hover:text-accent transition-colors navbar-btn">
          <img src="/images/logo.svg" alt="Mobile Recharge" className="h-10" />
          <span>MobileRecharge</span>
        </Link>
        <div className="space-x-2">
          <Link to="/" className="px-3 py-2 rounded bg-primary hover:bg-accent transition-colors navbar-btn">
            Home
          </Link>
          <Link to="/plans" className="px-3 py-2 rounded bg-primary hover:bg-accent transition-colors navbar-btn">
            Recharge Plans
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/history" className="px-3 py-2 rounded bg-primary hover:bg-accent transition-colors navbar-btn">
                History
              </Link>
              <div className="px-3 py-2 rounded bg-green-600 text-white">
                Cashback: ₹{totalCashback}
              </div>
              <button
                onClick={logout}
                className="bg-primary px-4 py-2 rounded hover:bg-accent hover:text-secondary transition-colors text-base navbar-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 rounded bg-primary hover:bg-accent transition-colors navbar-btn">
                Login
              </Link>
              <Link to="/signup" className="px-3 py-2 rounded bg-primary hover:bg-accent transition-colors navbar-btn">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;