// src/components/InventoryManagement.js
'use client';
import { useState, useEffect } from 'react';

export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    inventory_id: '',
    inventory_quantity: '',
    inventory_location: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);


  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    try {
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error("Failed to fetch inventory");
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error(error);
      alert("Error loading inventory.");
    }
  }

  async function handleProductClick(productId) {
    try {
      console.log("Fetching product with ID:", productId);
      const response = await fetch(`/api/product/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch product info");
      const data = await response.json();
      console.log("Product data:", data);
      setSelectedProduct(data);
      setShowProductModal(true);
    } catch (error) {
      console.error(error);
      alert("Could not load product details.");
    }
  }  

  function handleEdit(item) {
    setFormData({
      inventory_id: item.inventory_id,
      inventory_quantity: item.inventory_quantity,
      inventory_location: item.inventory_location,
    });
    setIsEditing(true);
    setShowForm(true);
  }

  async function handleDelete(inventory_id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch('/api/inventory', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inventory_id }),
      });

      if (!response.ok) throw new Error("Failed to delete item");
      fetchInventory();
    } catch (error) {
      console.error(error);
      alert("Error deleting item.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch('/api/inventory', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save item");
      
      fetchInventory();
      setShowForm(false);
      setFormData({ inventory_id: '', inventory_quantity: '', inventory_location: '' });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Error saving item.");
    }
  }

  return (
    <div className="inventory-container">
      <div className="header-div">
        <h1 className='header'>Inventory Management</h1>
        <button className="primary-btn" onClick={() => { setShowForm(true); setIsEditing(false); }}>
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="modal">
          <form className="inventory-form" onSubmit={handleSubmit}>
            <h2>{isEditing ? 'Edit Inventory' : 'Add Product'}</h2>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" value={formData.inventory_quantity} onChange={(e) => setFormData({ ...formData, inventory_quantity: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" value={formData.inventory_location} onChange={(e) => setFormData({ ...formData, inventory_location: e.target.value })} required />
            </div>
            <div className="modal-buttons">
              <button className="save-btn" type="submit">{isEditing ? 'Update' : 'Create'}</button>
              <button className="cancel-btn" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.length > 0 ? (
            inventory.map((item) => (
              <tr key={item.inventory_id}>
                <td>
                  <button
                    className="product-name-btn"
                    onClick={() => handleProductClick(item.Product?.product_id)}
                    style={{ background: "none", border: "none", color: "blue", textDecoration: "underline", cursor: "pointer" }}
                  >
                    {item.Product?.product_name || 'Unknown'}
                  </button>
                </td>
                <td>{item.inventory_quantity}</td>
                <td>{item.inventory_location}</td>
                <td className="button-group">
                  <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(item.inventory_id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>No inventory items found.</td>
            </tr>
          )}
        </tbody>
      </table>

    {showProductModal && selectedProduct && (
      <div className="modal-overlay">
        <div className="modal">
          <div className="product-details">
            <h2>{selectedProduct.product_name}</h2>
            <p><strong>Description:</strong> {selectedProduct.product_description || 'No description available.'}</p>
            <p><strong>Price:</strong> ${selectedProduct.product_price}</p>
            <p><strong>Shipment Month:</strong> {selectedProduct.product_shipment_month ? new Date(selectedProduct.product_shipment_month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}</p>
            <p><strong>Created On:</strong> {selectedProduct.product_created ? new Date(selectedProduct.product_created).toLocaleDateString() : 'N/A'}</p>
            <button onClick={() => setShowProductModal(false)} className="cancel-btn">Close</button>
          </div>
        </div>
      </div>
    )}

    </div>
  );
}
