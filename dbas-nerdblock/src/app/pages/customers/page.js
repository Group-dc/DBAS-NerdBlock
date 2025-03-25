// src/app/customers/page.js
'use client';
import CustomerManagement from '@/components/CustomerManagement';

export default function CustomersPage() {
  return (
    <div className="page-container">
      {/* <h1>Customers</h1> */}
      <CustomerManagement />
    </div>
  );
}
