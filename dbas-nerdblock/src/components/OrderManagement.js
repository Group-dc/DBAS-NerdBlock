// src/components/OrderManagement.js
'use client';
import { useState, useEffect } from 'react';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    order_id: '',
    order_shipping_date: '',
    order_processed: false,
  });

  function resetForm() {
    setFormData({
      order_id: '',
      order_shipping_date: '',
      order_processed: false,
    });
    setIsEditing(false);
    setShowForm(false);
  }  

  useEffect(() => {
    async function fetchOrders() {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    }
    fetchOrders();
  }, []);

  function handleEdit(order) {
    setFormData({
      order_id: order.order_id,
      order_shipping_date: order.order_shipping_date || '',
      order_processed: order.order_processed || false,
    });
    setIsEditing(true);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) throw new Error('Failed to update order');
  
      const result = await response.json();
      console.log('Order updated:', result);
  
      // Refresh table
      const updated = await fetch('/api/orders');
      const data = await updated.json();
      setOrders(data);
  
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Error updating order.');
    }
  }

  async function handleDelete(order_id) {
    const confirmDelete = confirm('Are you sure you want to delete this order?');
    if (!confirmDelete) return;
  
    try {
      const response = await fetch('/api/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id }),
      });
  
      if (!response.ok) throw new Error('Failed to delete order');
  
      // Refresh the table
      const refreshed = await fetch('/api/orders');
      const data = await refreshed.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      alert('Failed to delete order.');
    }
  }  

  return (
    <div className="order-container">
      <div className="header-div">
        <h1 className='header'>Order Management</h1>
      </div>
      <table>
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Customer</th>
            <th>Shipping Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{String(order.order_id).padStart(4, '0')}</td>
              <td>{order.Customer?.customer_first_name} {order.Customer?.customer_last_name}</td>
              <td>{order.order_shipping_date || 'N/A'}</td>
              <td>
                <span className={order.order_processed ? "status processed" : "status pending"}>
                  {order.order_processed ? 'Processed' : 'Pending'}
                </span>
              </td>
              <td className="button-group">
                <button className="edit-btn" onClick={() => handleEdit(order)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(order.order_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <>
          <div className="modal-overlay" onClick={() => setShowForm(false)}></div>
          <div className="modal">
            <form
              className="order-form"
              onSubmit={handleSubmit}
            >
              <h2>Edit Order</h2>
              <div className="form-group">
                <label>Shipping Date</label>
                <input
                  type="date"
                  value={formData.order_shipping_date}
                  onChange={(e) => setFormData({ ...formData, order_shipping_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.order_processed ? 'Processed' : 'Pending'}
                  onChange={(e) => setFormData({ ...formData, order_processed: e.target.value === 'Processed' })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processed">Processed</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
