// src/components/SubscriptionManagement.js
'use client';
import { useState, useEffect } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, faLock, faKey, faCircleXmark, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { far, faUser, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { exportSubscriptionsToCSV } from '@/utils/exportUtils';

// Add the icons to the library
library.add(fas, faKey, faLock, far, faBagShopping, faUser, faEnvelope, faCircleXmark, fab);

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
  const [activeCustomer, setActiveCustomer] = useState(null);

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
      setActiveCustomer(null);
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
    setActiveCustomer(`${sub.Customer?.customer_first_name || ''} ${sub.Customer?.customer_last_name || ''}`);
    setIsEditing(true);
    setShowForm(true);
  }

  async function handleDelete(subscription_id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this subscription?");
    if (!confirmDelete) return;

    const response = await fetch('/api/subscriptions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription_id }),
    });

    if (response.ok) {
      fetchSubscriptions();
    }
  }

  return (
    <div className={`subscription-container ${showForm ? 'modal-active' : ''}`}>
      <div className="header-div">

        <h1 className='header'>Subscription Management</h1>

        <button className="primary-btn" onClick={() => { setShowForm(true); setIsEditing(false); setActiveCustomer(null); }}
          >
            <FontAwesomeIcon icon="fa-solid fa-notes-medical" size="xl" style={{color: "#ffffff",}} />
            Add Subscription
        </button>

      </div>

      {showForm && (
        <>
          <div className="modal-overlay" onClick={() => setShowForm(false)}></div>
          <div className="modal">
            <form className="subscription-form" onSubmit={handleSubmit}>
              <h2>{isEditing ? 'Edit Subscription' : 'Add Subscription'}</h2>
              {isEditing && activeCustomer && (
                <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Customer: {activeCustomer}</p>
              )}
              {!isEditing && (
                <div className="subscription-group">
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
              )}
              <div className="subscription-group">
                <label>Start Date</label>
                <input type="date" value={formData.subscription_start_date} onChange={(e) => setFormData({ ...formData, subscription_start_date: e.target.value })} required />
              </div>
              <div className="subscription-group">
                <label>End Date</label>
                <input type="date" value={formData.subscription_end_date || ''} onChange={(e) => setFormData({ ...formData, subscription_end_date: e.target.value })} />
              </div>
              <div className="subscription-group">
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
              <div className="subscription-group">
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
                <button className="edit-btn" onClick={() => handleEdit(sub)}
                  >
                  <FontAwesomeIcon icon="fa-solid fa-pen-to-square" style={{color: "#ffffff",}} />
                    Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(sub.subscription_id)}
                  >
                    <FontAwesomeIcon icon="fa-solid fa-trash-can" style={{color: "#ffffff",}} />
                    Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
