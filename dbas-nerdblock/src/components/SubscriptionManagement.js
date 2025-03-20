// src/components/SubscriptionManagement.js
'use client';
import { useState, useEffect } from 'react';

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    async function fetchSubscriptions() {
      const response = await fetch('/api/subscriptions');
      const data = await response.json();
      setSubscriptions(data);
    }
    fetchSubscriptions();
  }, []);

  return (
    <div className="subscription-container">
      <h1>Subscription Management</h1>
      <table>
        <thead><tr><th>ID</th><th>Customer</th><th>Genre</th><th>Start Date</th><th>End Date</th><th>Status</th></tr></thead>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
