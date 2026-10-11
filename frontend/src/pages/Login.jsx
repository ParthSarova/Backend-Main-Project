import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login Request
        const res = await axios.post('http://localhost:5001/api/auth/login', { email, password });
        localStorage.setItem('user', JSON.stringify(res.data));
        navigate('/');
      } else {
        // Register Request
        const res = await axios.post('http://localhost:5001/api/auth/register', { name, email, password, role });
        localStorage.setItem('user', JSON.stringify(res.data));
        navigate('/');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }} className="animate-fade-in">
      <div className="card glass">
        <div className="card-body">
          <h2 className="title text-center" style={{ fontSize: '2rem' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-center text-secondary mb-4">
            {isLogin ? 'Log in to claim items or manage gallery' : 'Sign up to report or claim lost items'}
          </p>
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Account Role (For Demo Purposes)</label>
                <select 
                  className="form-input" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="student">Student (Can Claim Items)</option>
                  <option value="staff">Security Staff (Can Add Items & Approve Claims)</option>
                </select>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="text-center mt-3">
            <button 
              type="button"
              className="btn btn-secondary" 
              style={{ border: 'none', background: 'transparent' }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
