import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StaffDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'staff') {
      navigate('/');
      return;
    }

    const fetchClaims = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/claims', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setClaims(res.data);
      } catch (error) {
        console.error('Failed to fetch claims');
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, [user, navigate]);

  const handleApprove = async (claimId) => {
    try {
      await axios.patch(`http://localhost:5001/api/claims/${claimId}/approve`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setClaims(claims.map(c => c._id === claimId ? { ...c, status: 'approved' } : c));
    } catch (error) {
      alert('Failed to approve claim');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!photo) return alert("Please select a photo");

    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);

    try {
      await axios.post('http://localhost:5001/api/found-items', formData, {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Item added successfully!');
      setDescription('');
      setPhoto(null);
    } catch (error) {
      alert('Failed to add item');
    }
  };

  if (loading) return <div className="text-center mt-4">Loading dashboard...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="title" style={{ margin: 0 }}>Staff Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Add Item Section */}
        <div className="card glass" style={{ height: 'fit-content' }}>
          <div className="card-body">
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Log a Found Item</h2>
            <form onSubmit={handleAddItem}>
              <div className="form-group">
                <label className="form-label">Item Description</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Black Nike Backpack"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Item Photo</label>
                <input 
                  type="file" 
                  className="form-input" 
                  onChange={(e) => setPhoto(e.target.files[0])}
                  required
                  style={{ padding: '0.5rem' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Add Item
              </button>
            </form>
          </div>
        </div>

        {/* Claims Section */}
        <div className="card glass">
          <div className="card-body">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Pending Claims</h2>
            
            {claims.length === 0 ? (
              <p className="text-secondary">No claims found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '1rem' }}>Item</th>
                      <th style={{ padding: '1rem' }}>Student</th>
                      <th style={{ padding: '1rem' }}>Verification Details</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                      <th style={{ padding: '1rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map(claim => (
                      <tr key={claim._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem' }}>{claim.item?.description || 'Deleted Item'}</td>
                        <td style={{ padding: '1rem' }}>{claim.student?.name || 'Unknown'}</td>
                        <td style={{ padding: '1rem', maxWidth: '300px' }}>{claim.verificationDetails}</td>
                        <td style={{ padding: '1rem' }}>
                          <span className={`badge badge-${claim.status === 'approved' ? 'returned' : claim.status}`}>
                            {claim.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {claim.status === 'pending' && (
                            <button onClick={() => handleApprove(claim._id)} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
