// src/app/orders/page.js
'use client';
import OrderManagement from '@/components/OrderManagement';

export default function OrdersPage() {
  return (
    <div className="page-container">
      {/* <h1>Orders</h1> */}
      <OrderManagement />
    </div>
  );
}