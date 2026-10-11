import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SubmitClaim = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return (
      <div className="card glass text-center" style={{ padding: '3rem', maxWidth: '500px', margin: '4rem auto' }}>
        <h3>Authentication Required</h3>
        <p className="text-secondary mb-3">You must be logged in to submit a claim.</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">Go to Login</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5001/api/found-items/${itemId}/claim`, 
        { verificationDetails: details },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Claim submitted successfully. Waiting for staff approval.');
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit claim');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }} className="animate-fade-in">
      <div className="card glass">
        <div className="card-body">
          <h2 className="title mb-1">Submit Claim</h2>
          <p className="text-secondary mb-4">Provide specific details about the item so we can verify it belongs to you.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Verification Details</label>
              <textarea 
                className="form-input" 
                rows="5"
                placeholder="e.g. The wallet has a small scratch on the back, and contains my student ID ending in 1234."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">Submit Claim</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitClaim;
