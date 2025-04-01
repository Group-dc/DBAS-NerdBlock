'use client';
import { useState, useEffect } from 'react';

export default function OrderManagement() {
  // === STATE ===
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formMode, setFormMode] = useState('edit');

  const [formData, setFormData] = useState({
    order_id: '',
    customer_id: '',
    subscription_ids: [''],
    order_shipping_date: '',
    order_processed: false,
  });

  // === RESET FORM ===
  function resetForm() {
    setFormData({
      order_id: '',
      customer_id: '',
      subscription_ids: [''],
      order_shipping_date: '',
      order_processed: false,
    });
    setShowForm(false);
    setIsEditing(false);
    setFormMode('add');
  }

  // === FETCH DATA ===
  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (!formData.customer_id) return;

    async function fetchSubscriptions() {
      const res = await fetch(`/api/customers/${formData.customer_id}/subscriptions`);
      const data = await res.json();
      setSubscriptions(data);
    }

    fetchSubscriptions();
  }, [formData.customer_id]);

  async function fetchOrders() {
    const response = await fetch('/api/orders');
    const data = await response.json();
    setOrders(data);
  }

  async function fetchCustomers() {
    const res = await fetch('/api/customers');
    const data = await res.json();
    setCustomers(data);
  }

  // === HANDLERS ===
  function handleEdit(order) {
    setFormData({
      order_id: order.order_id,
      order_shipping_date: order.order_shipping_date || '',
      order_processed: order.order_processed || false,
    });
    setIsEditing(true);
    setFormMode('edit');
    setShowForm(true);
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

      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Failed to delete order.');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const { customer_id, subscription_ids, order_processed, order_shipping_date } = formData;

      if (formMode === 'edit') {
        const response = await fetch('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to update order');
      } else {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_id,
            subscription_ids,
            order_processed,
            shipping_date: order_shipping_date,
          }),
        });
        if (!response.ok) throw new Error('Failed to create order');
      }

      fetchOrders();
      resetForm();
      alert(formMode === 'edit' ? 'Order updated.' : 'Order created.');
    } catch (error) {
      console.error(error);
      alert(`Error ${formMode === 'edit' ? 'updating' : 'creating'} order.`);
    }
  }

  // === RENDER ===
  return (
    <div className="order-container">
      <div className="header-div">
        <h1 className="header">Order Management</h1>
        <button
          className="primary-btn"
          onClick={() => {
            resetForm();
            setFormMode('add');
            setShowForm(true);
          }}
        >
          Add Order
        </button>
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
          <div className="modal-overlay" onClick={resetForm}></div>
          <div className="modal">
            <form className="order-form" onSubmit={handleSubmit}>
              <h2>{formMode === 'add' ? 'Add Order' : 'Edit Order'}</h2>

              {formMode === 'add' && (
                <>
                  {/* Customer Dropdown */}
                  <div className="form-group">
                    <label>Customer</label>
                    <select
                      value={formData.customer_id}
                      onChange={(e) => setFormData({
                        ...formData,
                        customer_id: e.target.value,
                        subscription_ids: [''],
                      })}
                      required
                    >
                      <option value="">-- Select Customer --</option>
                      {customers.map((c) => (
                        <option key={c.customer_id} value={c.customer_id}>
                          {c.customer_first_name} {c.customer_last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subscriptions Dropdowns */}
                  <div className="form-group">
                    <label>Subscriptions</label>
                    {formData.subscription_ids.map((subId, index) => (
                      <div key={index} className="subscription-row">
                        <select
                          value={subId}
                          onChange={(e) => {
                            const updated = [...formData.subscription_ids];
                            updated[index] = e.target.value;
                            setFormData({ ...formData, subscription_ids: updated });
                          }}
                          required
                        >
                          <option value="">-- Select Subscription --</option>
                          {subscriptions
                            .filter((sub) => {
                              // Only allow options that aren't already selected in another dropdown
                              return (
                                sub.subscription_id === subId || // Always include the current one in this dropdown
                                !formData.subscription_ids.includes(sub.subscription_id)
                              );
                            })
                            .map((sub) => (
                              <option key={sub.subscription_id} value={sub.subscription_id}>
                                #{sub.subscription_id} — {sub.Genre?.genre_name || 'Unknown Genre'}
                              </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={() => {
                            const updated = [...formData.subscription_ids];
                            updated.splice(index, 1);
                            setFormData({ ...formData, subscription_ids: updated });
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="primary-btn"
                      onClick={() => setFormData({
                        ...formData,
                        subscription_ids: [...formData.subscription_ids, ''],
                      })}
                    >
                      + Add Subscription
                    </button>
                  </div>
                </>
              )}

              {/* Shared Fields */}
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
                  onChange={(e) => setFormData({
                    ...formData,
                    order_processed: e.target.value === 'Processed',
                  })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processed">Processed</option>
                </select>
              </div>

              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  {formMode === 'add' ? 'Create' : 'Save'}
                </button>
                <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
