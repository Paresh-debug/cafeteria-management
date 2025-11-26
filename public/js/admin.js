async function loadAdminItems() {
  try {
    const response = await fetch('/api/menu');
    const items = await response.json();
    displayAdminItems(items);
  } catch (err) {
    console.error('Error loading items:', err);
  }
}

function displayAdminItems(items) {
  const container = document.getElementById('admin-items');
  
  if (items.length === 0) {
    container.innerHTML = '<p style="color: white; text-align: center;">No menu items yet</p>';
    return;
  }
  
  container.innerHTML = items.map(item => `
    <div class="admin-item">
      <div>
        <strong><i class="fas fa-utensils"></i> ${item.name}</strong> - ₹${item.price} 
        <span style="color: #7f8c8d;">(${item.category})</span>
      </div>
      <div>
        <button class="delete-btn" onclick="deleteItem('${item._id}')">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    </div>
  `).join('');
}

async function addMenuItem() {
  const name = document.getElementById('item-name').value;
  const price = document.getElementById('item-price').value;
  const category = document.getElementById('item-category').value;
  
  if (!name || !price || !category) {
    showToast('Please fill all fields');
    return;
  }
  
  try {
    const response = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price: parseFloat(price), category })
    });
    
    if (response.ok) {
      showToast('Item added successfully! ✅');
      document.getElementById('item-name').value = '';
      document.getElementById('item-price').value = '';
      document.getElementById('item-category').value = '';
      loadAdminItems();
    }
  } catch (err) {
    showToast('Error adding item');
  }
}

async function deleteItem(id) {
  if (!confirm('Delete this item?')) return;
  
  try {
    const response = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
    if (response.ok) {
      showToast('Item deleted');
      loadAdminItems();
    }
  } catch (err) {
    showToast('Error deleting item');
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-message').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

loadAdminItems();
