import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await signup({ 
        username: formData.name.toLowerCase().replace(/\s+/g, ''),
        email: formData.email, 
        password: formData.password,
        phone: formData.phone 
      });
      setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
      navigate('/plans');
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed';
      alert(`Signup failed: ${errorMessage}`);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 relative" style={{background: 'linear-gradient(135deg, #E35336 0%, #F4A460 50%, #F5F5DC 100%)'}}>
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="max-w-md w-full space-y-6">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-secondary whitespace-nowrap mb-3">
            Create your account
          </h2>
          <p className="text-center text-lg text-primary">
            Start recharging with us today
          </p>
        </div>
        
        <form className="space-y-5 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl relative z-10 border border-white/20" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="name" className="block text-lg font-semibold text-secondary">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 appearance-none relative block w-full px-4 py-3 text-base border border-gray-300 placeholder-gray-500 text-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-lg font-semibold text-secondary">
              Email address
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 appearance-none relative block w-full px-4 py-3 text-base border border-gray-300 placeholder-gray-500 text-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-lg font-semibold text-secondary">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-4 py-3 pr-12 text-base border border-gray-300 placeholder-gray-500 text-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '👁️' : '👁️🗨️'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-lg font-semibold text-secondary">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 appearance-none relative block w-full px-4 py-3 text-base border border-gray-300 placeholder-gray-500 text-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-lg font-semibold text-secondary">
              Confirm Password
            </label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-4 py-3 pr-12 text-base border border-gray-300 placeholder-gray-500 text-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? '👁️' : '👁️🗨️'}
              </button>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-md text-light bg-primary hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary transition-all"
            >
              Signup
            </button>
          </div>
          
          <div className="text-center pt-3">
            <p className="text-base text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-secondary transition-colors">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;