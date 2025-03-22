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
      <h1 className='header'>Customer Management</h1>
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
