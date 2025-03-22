// src/components/Dashboard.js
'use client';
import { useState, useEffect } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, faLock, faKey, faCircleXmark, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { far, faUser, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Add the icons to the library
library.add(fas, faKey, faLock, far, faBagShopping, faUser, faEnvelope, faCircleXmark, fab);

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
      <h1 className='header'>Dashboard</h1>
      <div className="card-grid">
        <div className="card-box">
          <p className='card-title'>Total Sales</p>
          <div className='card-description'>
            <p>{stats.totalSales}</p> 
            <p className='card-icon'><FontAwesomeIcon icon="fa-solid fa-bag-shopping" /></p>
          </div>
        </div>
        <div className="card-box">
          <p className='card-title'>Total Income</p>
          <div className='card-description'>
            <p>${stats.totalIncome.toFixed(2)}</p>
            <p className='card-icon'><FontAwesomeIcon icon="fa-solid fa-circle-dollar-to-slot" /></p>
          </div>
        </div>
        <div className="card-box">
          <p className='card-title'>Total Sessions</p>
          <div className='card-description'>
            <p>{stats.totalSessions}</p>
            <p className='card-icon'><FontAwesomeIcon icon="fa-solid fa-users" /></p>
          </div>
        </div>
      </div>

      <h2 className='header'>Recent Customers</h2>
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
