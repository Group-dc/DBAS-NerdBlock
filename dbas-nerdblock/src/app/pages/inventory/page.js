// src/app/inventory/page.js
'use client';
import InventoryManagement from '@/components/InventoryManagement';

export default function InventoryPage() {
  return (
    <div className="page-container">
      <h1>Inventory</h1>
      <InventoryManagement />
    </div>
  );
}
