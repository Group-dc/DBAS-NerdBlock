// src/components/Dashboard.js
'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalSales: 0, totalIncome: 0, totalSessions: 0 });
  const [recentCustomers, setRecentCustomers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Example placeholders
      setStats({
        totalSales: 21324,
        totalIncome: 221324.5,
        totalSessions: 16703,
      });

      // Fetch recent customers from API
      const response = await fetch('/api/customers');
      const data = await response.json();
      setRecentCustomers(data.slice(0, 5));
    }
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat-box"><h2>Total Sales</h2><p>{stats.totalSales}</p></div>
        <div className="stat-box"><h2>Total Income</h2><p>${stats.totalIncome.toFixed(2)}</p></div>
        <div className="stat-box"><h2>Total Sessions</h2><p>{stats.totalSessions}</p></div>
      </div>

      <h2>Recent Customers</h2>
      <table>
        <thead><tr><th>Name</th><th>Country</th></tr></thead>
        <tbody>
          {recentCustomers.map((customer, index) => (
            <tr key={index}><td>{customer.customer_first_name} {customer.customer_last_name}</td><td>{customer.customer_country}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
