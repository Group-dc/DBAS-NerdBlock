// src/components/SubscriptionManagement.js
'use client';
import { useState, useEffect } from 'react';

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [formData, setFormData] = useState({
    subscription_id: '',
    subscription_start_date: '',
    subscription_end_date: '',
    subscription_customer_id: '',
    subscription_genre_no: '',
    subscription_active: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchSubscriptions();
    fetchCustomers();
    fetchGenres();
  }, []);

  async function fetchSubscriptions() {
    const response = await fetch('/api/subscriptions');
    const data = await response.json();
    setSubscriptions(data);
  }

  async function fetchCustomers() {
    const res = await fetch('/api/customers');
    const data = await res.json();
    setCustomers(data);
  }

  async function fetchGenres() {
    const res = await fetch('/api/genres');
    const data = await res.json();
    setGenres(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const response = await fetch('/api/subscriptions', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      fetchSubscriptions();
      setShowForm(false);
      setFormData({
        subscription_id: '',
        subscription_start_date: '',
        subscription_end_date: '',
        subscription_customer_id: '',
        subscription_genre_no: '',
        subscription_active: true,
      });
      setIsEditing(false);
    }
  }

  function handleEdit(sub) {
    setFormData({
      subscription_id: sub.subscription_id,
      subscription_start_date: sub.subscription_start_date,
      subscription_end_date: sub.subscription_end_date || '',
      subscription_customer_id: sub.Customer?.customer_id || '',
      subscription_genre_no: sub.Genre?.genre_no || '',
      subscription_active: sub.subscription_active,
    });
    setIsEditing(true);
    setShowForm(true);
  }

  return (
    <div className={`subscription-container ${showForm ? 'modal-active' : ''}`}>
      <div className="header-div">
        <h1 className='header'>Subscription Management</h1>
        <button className="primary-btn" onClick={() => { setShowForm(true); setIsEditing(false); }}>
          Add Subscription
        </button>
      </div>

      {showForm && (
        <>
          <div className="modal-overlay" onClick={() => setShowForm(false)}></div>
          <div className="modal">
            <form className="customer-form" onSubmit={handleSubmit}>
              <h2>{isEditing ? 'Edit Subscription' : 'Add Subscription'}</h2>
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" value={formData.subscription_start_date} onChange={(e) => setFormData({ ...formData, subscription_start_date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" value={formData.subscription_end_date || ''} onChange={(e) => setFormData({ ...formData, subscription_end_date: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Customer</label>
                <select
                  value={formData.subscription_customer_id}
                  onChange={(e) =>
                    setFormData({ ...formData, subscription_customer_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select a customer</option>
                  {customers.map((cust) => (
                    <option key={cust.customer_id} value={cust.customer_id}>
                      {cust.customer_first_name} {cust.customer_last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Genre</label>
                <select
                  value={formData.subscription_genre_no}
                  onChange={(e) =>
                    setFormData({ ...formData, subscription_genre_no: e.target.value })
                  }
                  required
                >
                  <option value="">Select a genre</option>
                  {genres.map((genre) => (
                    <option key={genre.genre_no} value={genre.genre_no}>
                      {genre.genre_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={formData.subscription_active} onChange={(e) => setFormData({ ...formData, subscription_active: e.target.value === 'true' })}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button className="save-btn" type="submit">{isEditing ? 'Update' : 'Create'}</button>
                <button className="cancel-btn" type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}

      <table>
        <thead><tr><th>ID</th><th>Customer</th><th>Genre</th><th>Start Date</th><th>End Date</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub.subscription_id}>
              <td>{sub.subscription_id}</td>
              <td>{sub.Customer?.customer_first_name} {sub.Customer?.customer_last_name}</td>
              <td>{sub.Genre?.genre_name}</td>
              <td>{sub.subscription_start_date}</td>
              <td>{sub.subscription_end_date || 'Ongoing'}</td>
              <td><span className={sub.subscription_active ? "status active" : "status inactive"}>
                {sub.subscription_active ? 'Active' : 'Inactive'}
              </span></td>
              <td className="button-group">
                <button className="edit-btn" onClick={() => handleEdit(sub)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
