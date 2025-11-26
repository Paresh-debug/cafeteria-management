let allMenuItems = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

async function loadMenu() {
  try {
    const response = await fetch('/api/menu');
    allMenuItems = await response.json();
    displayMenu(allMenuItems);
    updateCartCount();
  } catch (err) {
    console.error('Error loading menu:', err);
  }
}

function displayMenu(items) {
  const menuContainer = document.getElementById('menu-items');
  
  if (items.length === 0) {
    menuContainer.innerHTML = '<p>No items available</p>';
    return;
  }
  
  menuContainer.innerHTML = items.map(item => `
    <div class="menu-item">
      <h3>${item.name}</h3>
      <p class="category">${item.category}</p>
      <p class="price">₹${item.price}</p>
      <button onclick="addToCart('${item._id}', '${item.name}', ${item.price})">
        Add to Cart
      </button>
    </div>
  `).join('');
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
  alert(`${name} added to cart!`);
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
}

function filterByCategory(category) {
  if (category === 'all') {
    displayMenu(allMenuItems);
  } else {
    const filtered = allMenuItems.filter(item => item.category === category);
    displayMenu(filtered);
  }
}

document.querySelectorAll('.category-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    filterByCategory(e.target.dataset.category);
  });
});

loadMenu();
