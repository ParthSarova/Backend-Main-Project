import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Info } from 'lucide-react';

const FoundItemsGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/found-items');
        setItems(res.data);
      } catch (error) {
        console.error('Failed to fetch items');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) return <div className="text-center mt-4">Loading items...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="title">Found Items Gallery</h1>
        <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Browse through items that have been found on campus. If you recognize something that belongs to you, you can submit a claim for it.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="card glass text-center" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
          <Info size={48} style={{ margin: '0 auto', color: 'var(--text-secondary)' }} className="mb-2" />
          <h3>No items found yet.</h3>
          <p className="text-secondary">Check back later if you've lost something recently.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {items.map(item => (
            <div key={item._id} className="card">
              <img src={`http://localhost:5001${item.photoPath}`} alt={item.description} className="card-img" />
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }} className="mb-2">
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{item.description}</h3>
                  <span className={`badge badge-${item.status}`}>{item.status}</span>
                </div>
                <p className="text-secondary mb-3" style={{ fontSize: '0.9rem' }}>
                  Found on: {new Date(item.createdAt).toLocaleDateString()}
                </p>
                {item.status === 'found' && (!user || user.role === 'student') && (
                  <Link to={`/claim/${item._id}`} className="btn btn-secondary" style={{ width: '100%' }}>
                    Claim Item
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoundItemsGallery;
