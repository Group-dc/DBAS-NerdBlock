// src/components/SubscriptionReport.js
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

export default function SubscriptionReport() {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    const response = await fetch('/api/subscriptions');
    const data = await response.json();
    setSubscriptions(data);
  }

  return (
    <div className="content">
      <div className="header-div">
        <h1 className="header">Subscription Reporting</h1>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '20px 0',
          paddingLeft: '40px',
          paddingRight: '40px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', color: '#1ca5c8', marginBottom: '4px' }}>
            Subscription Complete Report
          </h2>
          <p style={{ fontSize: '14px', color: '#565b5c', marginTop: '0' }}>
            Download subscription data for external reporting or analysis.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => exportSubscriptionsToCSV(subscriptions)}
        >
          <FontAwesomeIcon icon="fa-solid fa-download" size="xl" style={{color: "#ffffff",}} /> Export as CSV
        </button>
      </div>
    </div>
  );
}
