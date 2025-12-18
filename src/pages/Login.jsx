import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user"
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (formData.role === 'admin') {
        if (formData.email === 'admin@admin.com' && formData.password === 'admin123') {
          localStorage.setItem('adminLoggedIn', 'true');
          navigate('/dashboard');
        } else {
          setError('Invalid admin credentials');
        }
      } else {
        localStorage.removeItem('adminLoggedIn');
        await login(formData);
        navigate("/plans");
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(`Login failed: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{background: 'linear-gradient(135deg, #F5F5DC 0%, #F4A460 50%, #E35336 100%)'}}>
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="max-w-md w-full space-y-6">

        <h2 className="text-center text-4xl font-bold text-secondary">
          Login
        </h2>

        {error && (
          <p className="text-red-600 text-center">{error}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl space-y-5 relative z-10 border border-white/20"
        >
          <div>
            <label className="block text-secondary font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-md border"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-secondary font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 rounded-md border"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-secondary font-semibold">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md border"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-light rounded-md font-semibold"
          >
            Login
          </button>

          <p className="text-center text-secondary">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
