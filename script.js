// Global variables
let cart = [];
let products = [];
let userProfile = {};
let orders = [];
let currentTheme = 'light';

// Sample products data
const sampleProducts = [
    {
        id: 1,
        name: 'Стильная куртка',
        description: 'Модная турецкая куртка высокого качества',
        price: 450,
        category: 'clothing',
        image: '🧥'
    },
    {
        id: 2,
        name: 'Классические джинсы',
        description: 'Удобные джинсы из качественного денима',
        price: 280,
        category: 'clothing',
        image: '👖'
    },
    {
        id: 3,
        name: 'Элегантная блузка',
        description: 'Женская блузка для офиса и торжеств',
        price: 190,
        category: 'clothing',
        image: '👚'
    },
    {
        id: 4,
        name: 'Смартфон Premium',
        description: 'Современный смартфон с отличной камерой',
        price: 2500,
        category: 'electronics',
        image: '📱'
    },
    {
        id: 5,
        name: 'Беспроводные наушники',
        description: 'Качественные наушники с шумоподавлением',
        price: 350,
        category: 'electronics',
        image: '🎧'
    },
    {
        id: 6,
        name: 'Планшет для работы',
        description: 'Производительный планшет для учебы и работы',
        price: 1800,
        category: 'electronics',
        image: '📟'
    },
    {
        id: 7,
        name: 'Спортивный костюм',
        description: 'Комфортный костюм для спорта и отдыха',
        price: 320,
        category: 'clothing',
        image: '👕'
    },
    {
        id: 8,
        name: 'Умные часы',
        description: 'Смарт-часы с множеством функций',
        price: 890,
        category: 'electronics',
        image: '⌚'
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadProducts();
    loadUserData();
});

// Initialize application
function initializeApp() {
    products = [...sampleProducts];
    
    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
    
    // Load user profile
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
        loadProfileData();
    }
    
    // Load orders
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
        loadOrdersHistory();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('href').substring(1);
            showSection(section);
            setActiveNavLink(this);
        });
    });
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProducts(category);
            setActiveFilter(this);
        });
    });
    
    // Mobile menu toggle
    document.getElementById('menuToggle').addEventListener('click', toggleMobileMenu);
}

// Theme management
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeIcon = document.querySelector('#themeToggle i');
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    document.getElementById(sectionId).classList.add('active');
    
    // Update URL hash
    window.history.pushState({}, '', `#${sectionId}`);
    
    // Special handling for shop section
    if (sectionId === 'shop') {
        displayProducts();
    }
}

function setActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Products management
function loadProducts() {
    displayProducts();
}

function displayProducts(category = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    let filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="text-center">Товары не найдены</p>';
        return;
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                ${product.image}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price} сомони</div>
                <button class="btn btn-primary" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> В корзину
                </button>
            </div>
        </div>
    `).join('');
}

function filterProducts(category) {
    displayProducts(category);
}

function setActiveFilter(activeBtn) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

// Cart management
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCartToStorage();
    showMessage('Товар добавлен в корзину!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToStorage();
    showMessage('Товар удален из корзины', 'success');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    updateCartUI();
    saveCartToStorage();
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const subtotal = document.getElementById('subtotal');
    const total = document.getElementById('total');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${item.image}
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} сомони</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Update totals
    const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    subtotal.textContent = `${subtotalAmount} сомони`;
    total.textContent = `${subtotalAmount} сомони`;
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showMessage('Корзина пуста!', 'error');
        return;
    }
    
    if (!userProfile.name || !userProfile.phone) {
        showMessage('Пожалуйста, заполните профиль перед оформлением заказа', 'error');
        showSection('profile');
        return;
    }
    
    // Create order
    const order = {
        id: Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'Новый',
        customer: { ...userProfile }
    };
    
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Generate order message
    const orderMessage = generateOrderMessage(order);
    
    // Send to Telegram and WhatsApp
    sendOrderToTelegram(orderMessage);
    sendOrderToWhatsApp(orderMessage);
    
    // Clear cart
    cart = [];
    updateCartUI();
    saveCartToStorage();
    
    // Update orders history
    loadOrdersHistory();
    
    showMessage('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.', 'success');
}

function generateOrderMessage(order) {
    let message = `🛍️ *Новый заказ #${order.id}*\n\n`;
    message += `👤 *Клиент:* ${order.customer.name}\n`;
    message += `📞 *Телефон:* ${order.customer.phone}\n`;
    message += `📍 *Адрес:* ${order.customer.address}\n\n`;
    message += `📦 *Товары:*\n`;
    
    order.items.forEach(item => {
        message += `• ${item.name} x${item.quantity} - ${item.price * item.quantity} сомони\n`;
    });
    
    message += `\n💰 *Итого:* ${order.total} сомони\n`;
    message += `📅 *Дата:* ${order.date}`;
    
    return message;
}

function sendOrderToTelegram(message) {
    const telegramUrl = `https://t.me/ubayda_1507?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
}

function sendOrderToWhatsApp(message) {
    const whatsappUrl = `https://wa.me/992905746633?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Profile management
function saveProfile() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const address = document.getElementById('userAddress').value;
    
    if (!name || !phone) {
        showMessage('Пожалуйста, заполните имя и телефон', 'error');
        return;
    }
    
    userProfile = { name, phone, address };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    showMessage('Профиль успешно сохранен!', 'success');
}

function loadProfileData() {
    if (userProfile.name) {
        document.getElementById('userName').value = userProfile.name;
    }
    if (userProfile.phone) {
        document.getElementById('userPhone').value = userProfile.phone;
    }
    if (userProfile.address) {
        document.getElementById('userAddress').value = userProfile.address;
    }
}

function loadUserData() {
    loadProfileData();
    loadOrdersHistory();
}

function loadOrdersHistory() {
    const ordersList = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="no-orders">У вас пока нет заказов</p>';
        return;
    }
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <strong>Заказ #${order.id}</strong>
                <span class="order-date">${order.date}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-product">
                        ${item.name} x${item.quantity}
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <strong>Итого: ${order.total} сомони</strong>
            </div>
            <div class="order-status">
                Статус: <span class="status-badge">${order.status}</span>
            </div>
        </div>
    `).join('');
}

// Utility functions
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    // Add to current section
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        activeSection.insertBefore(messageElement, activeSection.firstChild);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Handle browser navigation
window.addEventListener('popstate', function() {
    const hash = window.location.hash.substring(1) || 'home';
    showSection(hash);
});

// Initialize on page load
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1) || 'home';
    showSection(hash);
});

// Format phone number input
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('userPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('992')) {
                value = value.substring(3);
            }
            
            if (value.length > 0) {
                if (value.length <= 2) {
                    value = `+992 ${value}`;
                } else if (value.length <= 5) {
                    value = `+992 ${value.substring(0, 2)} ${value.substring(2)}`;
                } else if (value.length <= 7) {
                    value = `+992 ${value.substring(0, 2)} ${value.substring(2, 5)} ${value.substring(5)}`;
                } else {
                    value = `+992 ${value.substring(0, 2)} ${value.substring(2, 5)} ${value.substring(5, 7)} ${value.substring(7, 9)}`;
                }
            }
            
            e.target.value = value;
        });
    }
});

// Search functionality
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    const productsGrid = document.getElementById('productsGrid');
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="text-center">Товары не найдены</p>';
        return;
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.image}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price} сомони</div>
                <button class="btn btn-primary" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> В корзину
                </button>
            </div>
        </div>
    `).join('');
}

// Add smooth scrolling to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lazy loading for images (if needed in future)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// PWA Service Worker registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
