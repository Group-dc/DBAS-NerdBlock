// src/components/OrderManagement.js
'use client';
import { useState, useEffect } from 'react';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    }
    fetchOrders();
  }, []);

  return (
    <div className="order-container">
      <h1>Order Management</h1>
      <table>
        <thead><tr><th>Order Number</th><th>Customer</th><th>Shipping Date</th><th>Status</th></tr></thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{String(order.order_id).padStart(4, '0')}</td>
              <td>{order.Customer?.customer_first_name} {order.Customer?.customer_last_name}</td>
              <td>{order.order_shipping_date || 'N/A'}</td>
              <td><span className={order.order_processed ? "status processed" : "status pending"}>
                {order.order_processed ? 'Processed' : 'Pending'}
              </span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
