import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export const AuthForm: React.FC<{ setUser: (u: any) => void }> = ({ setUser }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    age: '',
    gender: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (isSignUp && !formData.fullName) {
      setError('Please fill in all required fields');
      return;
    }

    // Dummy login/signup logic
    if (!isSignUp) {
      if (formData.username === 'shelly' && formData.password === 'ElderCare2024!') {
        setSuccess('Welcome back!');
        setTimeout(() => setUser({ username: 'shelly' }), 1000);
      } else {
        setError('Invalid credentials');
      }
    } else {
      setSuccess('Account created!');
      setTimeout(() => setUser({ username: formData.username }), 1000);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-eldercare-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/logo-Photoroom.png"
            alt="ElderCare Logo"
            className="w-24 h-24 mx-auto"
          />
          <h1 className="text-3xl font-bold text-eldercare-secondary">
            Welcome to ElderCare
          </h1>
          <p className="italic text-eldercare-text">"Because our elders deserve the best."</p>
        </div>

        {/* Auth Box */}
        <div className="bg-white rounded-xl shadow-lg p-8 border">
          <div className="flex items-center justify-center mb-6 space-x-2">
            {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
            <h2 className="text-xl font-bold">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-sm text-red-700 rounded flex items-start space-x-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-sm text-green-700 rounded flex items-start space-x-2">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-1">Username *</label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-3 py-2 border rounded"
                  placeholder="Enter username"
                  required
                />
                <User size={16} className="absolute left-2 top-2.5 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-10 py-2 border rounded"
                  placeholder="Enter password"
                  required
                />
                <Lock size={16} className="absolute left-2 top-2.5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2.5 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Additional Signup Fields */}
            {isSignUp && (
              <>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Full name *"
                  required
                />
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Age (optional)"
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select gender (optional)</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-eldercare-primary text-white py-2 rounded font-semibold"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-4 text-center text-sm">
            <span>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFormData({
                  username: '',
                  password: '',
                  fullName: '',
                  age: '',
                  gender: ''
                });
                setError('');
                setSuccess('');
              }}
              className="ml-2 text-eldercare-primary font-medium"
            >
              {isSignUp ? 'Sign In' : 'Create New Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
