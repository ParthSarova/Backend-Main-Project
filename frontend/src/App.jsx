import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Package, LogIn, LayoutDashboard, Search, LogOut } from 'lucide-react';

// Components
import Login from './pages/Login';
import FoundItemsGallery from './pages/FoundItemsGallery';
import SubmitClaim from './pages/SubmitClaim';
import StaffDashboard from './pages/StaffDashboard';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border-color)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 600 }}>
          <Package /> <span>Campus Lost & Found</span>
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Search size={18} /> Gallery</Link>
          {user ? (
            <>
              {user.role === 'staff' && (
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><LayoutDashboard size={18} /> Dashboard</Link>
              )}
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
              <LogIn size={16} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div className="page-container">
        <Navbar />
        <main className="main-content container">
          <Routes>
            <Route path="/" element={<FoundItemsGallery />} />
            <Route path="/login" element={<Login />} />
            <Route path="/claim/:itemId" element={<SubmitClaim />} />
            <Route path="/dashboard" element={<StaffDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
