let allMenuItems = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

async function loadMenu() {
  const loading = document.getElementById('loading');
  loading.style.display = 'block';
  
  try {
    const response = await fetch('/api/menu');
    allMenuItems = await response.json();
    loading.style.display = 'none';
    displayMenu(allMenuItems);
    updateCartCount();
  } catch (err) {
    console.error('Error loading menu:', err);
    loading.style.display = 'none';
  }
}

function displayMenu(items) {
  const menuContainer = document.getElementById('menu-items');
  
  if (items.length === 0) {
    menuContainer.innerHTML = '<p style="color: white; text-align: center; font-size: 1.2rem;">No items available</p>';
    return;
  }
  
  menuContainer.innerHTML = items.map(item => `
    <div class="menu-item">
      <h3>${item.name}</h3>
      <span class="category">${getCategoryIcon(item.category)} ${item.category}</span>
      <p class="price">₹${item.price}</p>
      <button onclick="addToCart('${item._id}', '${item.name}', ${item.price})">
        <i class="fas fa-cart-plus"></i> Add to Cart
      </button>
    </div>
  `).join('');
}

function getCategoryIcon(category) {
  const icons = {
    'Breakfast': '☕',
    'Lunch': '🍕',
    'Snacks': '🍪'
  };
  return icons[category] || '🍽️';
}

function addToCart(id, name, price) {
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showToast(`${name} added to cart!`);
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElement = document.getElementById('cart-count');
  cartCountElement.textContent = count;
  
  // Trigger pulse animation
  cartCountElement.style.animation = 'none';
  setTimeout(() => cartCountElement.style.animation = 'pulse 0.5s ease-in-out', 10);
}

function filterByCategory(category) {
  if (category === 'all') {
    displayMenu(allMenuItems);
  } else {
    const filtered = allMenuItems.filter(item => item.category === category);
    displayMenu(filtered);
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-message').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

document.querySelectorAll('.category-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    filterByCategory(e.target.dataset.category);
  });
});

loadMenu();
