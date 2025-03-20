'use client';
import { useState, useEffect } from 'react';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: '', 
    customer_first_name: '',
    customer_last_name: '',
    customer_email: '',
    customer_country: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    const response = await fetch('/api/customers');
    const data = await response.json();
    setCustomers(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const response = await fetch('/api/customers', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      fetchCustomers();
      setShowForm(false);
      setFormData({ customer_id: '', customer_first_name: '', customer_last_name: '', customer_email: '', customer_country: '' });
      setIsEditing(false);
    }
  }

  async function handleDelete(customer_id) {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    await fetch('/api/customers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id }), 
    });

    fetchCustomers();
  }

  function handleEdit(customer) {
    setFormData(customer);
    setIsEditing(true);
    setShowForm(true);
  }

  return (
    <div className="customer-container">
      <h1>Customer Management</h1>
      <button className="primary-btn" onClick={() => { setShowForm(true); setIsEditing(false); }}>
        Add Customer
      </button>
  
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
  
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Country</th>
            <th>Actions</th> 
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.customer_id}>
                <td>{customer.customer_number}</td>
                <td>{customer.customer_first_name} {customer.customer_last_name}</td>
                <td>{customer.customer_email}</td>
                <td>{customer.customer_country}</td>
                <td className="button-group">
                  <button className="edit-btn" onClick={() => handleEdit(customer)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(customer.customer_id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>No customers found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}