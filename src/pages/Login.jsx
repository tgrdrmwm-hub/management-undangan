import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple hardcoded login for demonstration
    if (username.trim().toLowerCase() === 'admin' && password.trim() === 'password123') {
      localStorage.setItem('auth_token', 'true');
      navigate('/dashboard');
    } else {
      setError('Username atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-wedding-gold/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-wedding-pink/30 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 relative z-10 animate-fade-in-up">
        <div className="text-center">
          <h2 className="mt-2 text-center text-4xl font-serif font-bold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Masuk ke panel Eterna untuk mengelola undangan
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-wedding-gold focus:border-wedding-gold sm:text-sm transition-colors"
                placeholder="Username (admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-wedding-gold focus:border-wedding-gold sm:text-sm transition-colors"
                placeholder="Password (password123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-wedding-gold hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wedding-gold transition-colors shadow-md"
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
