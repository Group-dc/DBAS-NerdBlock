// src/components/CustomerManagement.js
'use client';
import { useState, useEffect } from 'react';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function fetchCustomers() {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
    }
    fetchCustomers();
  }, []);

  return (
    <div className="customer-container">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      <h1 className='header'>Customer Management</h1>
=======
=======
>>>>>>> Stashed changes
      <div className="header-div">
        <h1 className='header'>Customer Management</h1>
        <button className="primary-btn" onClick={() => { setShowForm(true); setIsEditing(false); }}>
          Add Customer
        </button>
      </div>
  
      {showForm && (
        <div className="modal">
          <form className="customer-form" onSubmit={handleSubmit}>
            <h2>{isEditing ? 'Edit Customer' : 'Add Customer'}</h2>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" value={formData.customer_first_name} onChange={(e) => setFormData({ ...formData, customer_first_name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" value={formData.customer_last_name} onChange={(e) => setFormData({ ...formData, customer_last_name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={formData.customer_email} onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" value={formData.customer_country} onChange={(e) => setFormData({ ...formData, customer_country: e.target.value })} required />
            </div>
            <div className="modal-buttons">
              <button className="save-btn" type="submit">{isEditing ? 'Update' : 'Create'}</button>
              <button className="cancel-btn" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
  
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Country</th></tr></thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customer_id}>
              <td>{customer.customer_id}</td>
              <td>{customer.customer_first_name} {customer.customer_last_name}</td>
              <td>{customer.customer_email}</td>
              <td>{customer.customer_country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
