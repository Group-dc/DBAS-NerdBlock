// src/components/InventoryManagement.js
'use client';
import { useState, useEffect } from 'react';

export default function InventoryManagement() {

  // Variables for data
  const [inventory, setInventory] = useState([]);
  const [genres, setGenres] = useState([]);

  // Data for the modal form
  const [formData, setFormData] = useState({
    inventory_id: '',
    inventory_quantity: '',
    inventory_location: '',
    product_name: '',
    product_description: '',
    product_price: '',
    product_shipment_month: '',
    product_genre_id: '',
  });

  // For the month selection
  const [selectedMonth, setSelectedMonth] = useState('');

  const monthMap = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
  };  
  
  // Bools in the names
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Resets the form
  function resetForm() {
    setFormData({
      inventory_id: '',
      inventory_quantity: '',
      inventory_location: '',
      product_name: '',
      product_description: '',
      product_price: '',
      product_shipment_month: '',
      product_genre_id: '',
    });
  
    setIsEditing(false);
    setShowForm(false);
    setSelectedMonth('');
  }

  // Fetching Data
  useEffect(() => {
    fetchInventory();
    fetchGenres();
  }, []);
  
  async function fetchGenres() {
    try {
      const response = await fetch('/api/genres');
      if (!response.ok) throw new Error('Failed to fetch genres');
      const data = await response.json();
      setGenres(data);
    } catch (error) {
      console.error(error);
      alert("Error loading genres.");
    }
  }  

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
      product_id: item.Product?.product_id || '',
      product_name: item.Product?.product_name || '',
      product_description: item.Product?.product_description || '',
      product_price: item.Product?.product_price || '',
      product_shipment_month: item.Product?.product_shipment_month || '',
      product_genre_id: item.Product?.product_genre_id || '',
    });
  
    // for the month dropdown
    setSelectedMonth(
      item.Product?.product_shipment_month
        ? new Date(item.Product.product_shipment_month).toLocaleString('default', { month: 'long' })
        : ''
    );
  
    setIsEditing(true);
    setShowForm(true);
  }  

  async function handleDelete(inventory_id) {
    const confirmed = window.confirm('Are you sure you want to delete this item and its product?');
    if (!confirmed) return;
  
    try {
      // Step 1: Fetch the inventory item to get product_id
      const inventoryRes = await fetch('/api/inventory');
      if (!inventoryRes.ok) throw new Error("Failed to fetch inventory data");
  
      const inventoryData = await inventoryRes.json();
      const inventoryItem = inventoryData.find(item => item.inventory_id === inventory_id);
  
      if (!inventoryItem || !inventoryItem.Product?.product_id) {
        throw new Error("Could not find related product for this inventory item");
      }
  
      const product_id = inventoryItem.Product.product_id;
  
      // Step 2: Delete inventory item
      const deleteInventoryRes = await fetch('/api/inventory', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inventory_id }),
      });
  
      if (!deleteInventoryRes.ok) throw new Error("Failed to delete inventory");
  
      // Step 3: Delete associated product
      const deleteProductRes = await fetch(`/api/product/${product_id}`, {
        method: 'DELETE',
      });
  
      if (!deleteProductRes.ok) throw new Error("Failed to delete related product");
  
      alert('Inventory and associated product deleted successfully.');
      fetchInventory();
    } catch (error) {
      console.error('Delete Error:', error.message);
      alert(`Error deleting item: ${error.message}`);
    }
  }  

  async function handleSubmit(e) {
    e.preventDefault();

    if (isEditing) {
      try {
        // 1. Update inventory
        const inventoryRes = await fetch('/api/inventory', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inventory_id: formData.inventory_id,
            inventory_quantity: formData.inventory_quantity,
            inventory_location: formData.inventory_location,
          }),
        });
    
        if (!inventoryRes.ok) throw new Error("Failed to update inventory");
    
        // 2. Update product
        const productRes = await fetch(`/api/product/${formData.product_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_name: formData.product_name,
            product_description: formData.product_description,
            product_price: formData.product_price,
            product_shipment_month: formData.product_shipment_month,
            product_genre_id: formData.product_genre_id,
          }),
        });
    
        if (!productRes.ok) throw new Error("Failed to update product");
    
        fetchInventory();
        resetForm();
      } catch (error) {
        console.error(error);
        alert("Error updating inventory and product.");
      }
    } else {
      try {
        // 1. Create the product
        const productResponse = await fetch('/api/product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_name: formData.product_name,
            product_description: formData.product_description,
            product_price: formData.product_price,
            product_shipment_month: formData.product_shipment_month,
            product_genre_id: formData.product_genre_id,
          }),
        });

        const productData = await productResponse.json();
        console.log("Product response data:", productData);

        if (!productResponse.ok) {
          throw new Error(`Failed to create product: ${productData.error || 'Unknown error'}`);
        }

        const product_id = productData.data?.[0]?.product_id;
        if (!product_id) {
          throw new Error("Product ID not returned from API");
        }

        console.log("Creating inventory with:", {
          inventory_quantity: formData.inventory_quantity,
          inventory_location: formData.inventory_location,
          product_id,
        });

        // 2. Create the inventory item linked to product_id
        const inventoryResponse = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inventory_quantity: formData.inventory_quantity,
            inventory_location: formData.inventory_location,
            product_id,
          }),
        });

        const inventoryData = await inventoryResponse.json();
        console.log("Inventory response:", inventoryData);

        if (!inventoryResponse.ok) {
          throw new Error(`Failed to create inventory: ${inventoryData.error || 'Unknown error'}`);
        }

        fetchInventory();
        resetForm();
      } catch (error) {
        console.error("handleSubmit error:", error.message);
        alert(error.message);
      }
    }
  }
  
  return (
    <div className="inventory-container">
      <div className="header-div">
        <h1 className='header'>Inventory Management</h1>
        <button
          className="primary-btn"
          onClick={() => {
            resetForm();
            setIsEditing(false);
            setShowForm(true);
          }}
        >
          Add Product
        </button>

      </div>

      {showForm && (
        <>
          <div className="modal-overlay" onClick={() => setShowForm(false)}></div>
          <div className="modal">
            <form
              className="inventory-form"
              onSubmit={(e) => {
                handleSubmit(e);
                setShowForm(false);
              }}
            >
              <h2>{isEditing ? 'Edit Inventory' : 'Add Product'}</h2>

              {/* ===== Product Fields ===== */}
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={formData.product_description}
                  onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={formData.product_price}
                  onChange={(e) =>
                    setFormData({ ...formData, product_price: parseInt(e.target.value) || '' })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Shipment Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    const month = e.target.value;
                    setSelectedMonth(month);

                    if (month) {
                      const currentYear = new Date().getFullYear();
                      const formattedMonth = monthMap[month];
                      const fullDate = `${currentYear}-${formattedMonth}-01`;
                      setFormData({ ...formData, product_shipment_month: fullDate });
                    } else {
                      setFormData({ ...formData, product_shipment_month: '' });
                    }
                  }}
                  required
                >
                  <option value="">-- Select Month --</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>

              <div className="form-group">
                <label>Genre</label>
                <select
                  value={formData.product_genre_id}
                  onChange={(e) => setFormData({ ...formData, product_genre_id: e.target.value })}
                  required
                >
                  <option value="">-- Select Genre --</option>
                  {genres.map((genre) => (
                    <option key={genre.genre_no} value={genre.genre_no}>
                      {genre.genre_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ===== Inventory Fields ===== */}
              <div className="form-group">
                <label>Inventory Quantity</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.inventory_quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      inventory_quantity: e.target.value.replace(/\D/g, ''), // only digits
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Inventory Location</label>
                <select
                  value={formData.inventory_location}
                  onChange={(e) => setFormData({ ...formData, inventory_location: e.target.value })}
                  required
                >
                  <option value="">-- Select a warehouse --</option>
                  <option value="Warehouse A - Toronto">Warehouse A - Toronto</option>
                  <option value="Warehouse B - Vancouver">Warehouse B - Vancouver</option>
                  <option value="Warehouse C - Montreal">Warehouse C - Montreal</option>
                </select>
              </div>

              <div className="modal-buttons">
                <button className="save-btn" type="submit">{isEditing ? 'Update' : 'Create'}</button>
                <button className="cancel-btn" type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </>
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
