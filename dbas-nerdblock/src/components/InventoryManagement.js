// src/components/InventoryManagement.js
'use client';
import { useState, useEffect } from 'react';

export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    async function fetchInventory() {
      const response = await fetch('/api/inventory');
      const data = await response.json();
      setInventory(data);
    }
    fetchInventory();
  }, []);

  return (
    <div className="inventory-container">
      <div className="header-div">
        <h1 className='header'>Inventory Management</h1>
      </div>
      <table>
        <thead><tr><th>Product</th><th>Quantity</th><th>Location</th></tr></thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.inventory_id}>
              <td>{item.Product?.product_name || 'Unknown'}</td>
              <td>{item.inventory_quantity}</td>
              <td>{item.inventory_location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
