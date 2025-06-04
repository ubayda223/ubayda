// Global variables
let currentTheme = 'light';
let cart = [];
let products = [];
let userProfile = {
    name: '',
    phone: '',
    address: ''
};

// Sample products data
const sampleProducts = [
    {
        id: 1,
        name: 'Турецкая рубашка',
        price: 250,
        category: 'clothing',
        description: 'Качественная хлопковая рубашка',
        image: '👔'
    },
    {
        id: 2,
        name: 'Джинсы премиум',
        price: 400,
        category: 'clothing',
        description: 'Стильные джинсы из Турции',
        image: '👖'
    },
    {
        id: 3,
        name: 'Женское платье',
        price: 350,
        category: 'clothing',
        description: 'Элегантное вечернее платье',
        image: '👗'
    },
    {
        id: 4,
        name: 'Смартфон',
        price: 1200,
        category: 'electronics',
        description: 'Современный смартфон',
        image: '📱'
    },
    {
        id: 5,
        name: 'Наушники',
        price: 150,
        category: 'electronics',
        description: 'Беспроводные наушники',
        image: '🎧'
    },
    {
        id: 6,
        name: 'Ноутбук',
        price: 2500,
        category: 'electronics',
        description: 'Игровой ноутбук',
        image: '💻'
    },
    {
        id: 7,
        name: 'Кроссовки',
        price: 300,
        category: 'clothing',
        description: 'Спортивные кроссовки',
        image: '👟'
    },
    {
        id: 8,
        name: 'Планшет',
        price: 800,
        category: 'electronics',
        description: 'Планшет для работы',
        image: '📟'
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadTheme();
    loadProducts();
    loadUserProfile();
    loadCart();
    setupEventListeners();
    updateCartDisplay();
}

// Event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            showSection(target);
            updateActiveNav(this);
        });
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            filterProducts(category);
            updateActiveFilter(this);
        });
    });

    // Mobile menu toggle
    document.getElementById('menuToggle').addEventListener('click', toggleMobileMenu);
}

// Theme management
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme();
    saveTheme();
}

function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    const themeIcon = document.querySelector('#themeToggle i');
    themeIcon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

function saveTheme() {
    // Store theme preference in memory
    window.themePreference = currentTheme;
}

function loadTheme() {
    // Load theme preference from memory
    currentTheme = window.themePreference || 'light';
    applyTheme();
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function updateActiveNav(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Products management
function loadProducts() {
    products = [...sampleProducts];
    displayProducts(products);
}

function displayProducts(productsToShow) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">${product.image}</div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price} сомони</div>
            <button class="btn btn-primary" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i>
                Добавить в корзину
            </button>
        </div>
    `;
    return card;
}

function filterProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    displayProducts(filteredProducts);
}

function updateActiveFilter(activeBtn) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

// Cart management
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    showMessage('Товар добавлен в корзину!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    displayCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartDisplay();
            displayCart();
        }
    }
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const subtotal = document.getElementById('subtotal');
    const total = document.getElementById('total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        subtotal.textContent = '0 сомони';
        total.textContent = '0 сомони';
        return;
    }
    
    let cartHTML = '';
    let totalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-image">${item.image}</div>
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
        `;
    });
    
    cartItems.innerHTML = cartHTML;
    subtotal.textContent = `${totalPrice} сомони`;
    total.textContent = `${totalPrice} сомони`;
}

function saveCart() {
    window.cartData = cart;
}

function loadCart() {
    cart = window.cartData || [];
    displayCart();
}

// Checkout functionality
function checkout() {
    if (cart.length === 0) {
        showMessage('Корзина пуста!', 'error');
        return;
    }
    
    if (!userProfile.name || !userProfile.phone) {
        showMessage('Пожалуйста, заполните профиль перед оформлением заказа!', 'error');
        showSection('profile');
        return;
    }
    
    showOrderOptions();
}

function showOrderOptions() {
    const orderText = generateOrderText();
    
    const modal = document.createElement('div');
    modal.className = 'order-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Оформление заказа</h3>
                <button class="close-modal" onclick="closeOrderModal()">×</button>
            </div>
            <div class="modal-body">
                <p>Выберите способ оформления заказа:</p>
                <div class="order-options">
                    <button class="btn btn-primary" onclick="orderViaWhatsApp()">
                        <i class="fab fa-whatsapp"></i>
                        Заказать через WhatsApp
                    </button>
                    <button class="btn btn-secondary" onclick="orderViaTelegram()">
                        <i class="fab fa-telegram"></i>
                        Заказать через Telegram
                    </button>
                </div>
                <div class="order-preview">
                    <h4>Детали заказа:</h4>
                    <div class="order-details">${orderText}</div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .order-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .modal-content {
            background: var(--surface-color);
            border-radius: 16px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-secondary);
        }
        
        .order-options {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin: 1.5rem 0;
        }
        
        .order-preview {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
        }
        
        .order-details {
            background: var(--background-color);
            padding: 1rem;
            border-radius: 8px;
            font-family: monospace;
            font-size: 0.9rem;
            white-space: pre-line;
            max-height: 200px;
            overflow-y: auto;
        }
    `;
    document.head.appendChild(style);
}

function closeOrderModal() {
    const modal = document.querySelector('.order-modal');
    if (modal) {
        modal.remove();
    }
}

function generateOrderText() {
    let orderText = `🛍️ НОВЫЙ ЗАКАЗ - TurkiyaMode\n\n`;
    orderText += `👤 Клиент: ${userProfile.name}\n`;
    orderText += `📞 Телефон: ${userProfile.phone}\n`;
    orderText += `📍 Адрес: ${userProfile.address}\n\n`;
    orderText += `🛒 ТОВАРЫ:\n`;
    
    let totalPrice = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        orderText += `${index + 1}. ${item.name}\n`;
        orderText += `   Цена: ${item.price} сомони\n`;
        orderText += `   Количество: ${item.quantity}\n`;
        orderText += `   Сумма: ${itemTotal} сомони\n\n`;
    });
    
    orderText += `💰 ИТОГО: ${totalPrice} сомони\n\n`;
    orderText += `📅 Дата заказа: ${new Date().toLocaleDateString('ru-RU')}\n`;
    orderText += `🕐 Время: ${new Date().toLocaleTimeString('ru-RU')}`;
    
    return orderText;
}

function orderViaWhatsApp() {
    const orderText = generateOrderText();
    const phoneNumber = '992905746633';
    const encodedText = encodeURIComponent(orderText);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Clear cart and close modal
    setTimeout(() => {
        clearCartAfterOrder();
        closeOrderModal();
    }, 1000);
}

function orderViaTelegram() {
    const orderText = generateOrderText();
    const telegramUsername = 'ubayda_1507';
    const encodedText = encodeURIComponent(orderText);
    const telegramUrl = `https://t.me/${telegramUsername}?text=${encodedText}`;
    
    // Open Telegram
    window.open(telegramUrl, '_blank');
    
    // Clear cart and close modal
    setTimeout(() => {
        clearCartAfterOrder();
        closeOrderModal();
    }, 1000);
}

function clearCartAfterOrder() {
    // Save order to history
    const order = {
        id: Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'Отправлен'
    };
    
    // Add to order history
    const orders = window.orderHistory || [];
    orders.unshift(order);
    window.orderHistory = orders;
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartDisplay();
    displayCart();
    
    showMessage('Заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.', 'success');
}

// Profile management
function saveProfile() {
    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const address = document.getElementById('userAddress').value.trim();
    
    if (!name || !phone || !address) {
        showMessage('Пожалуйста, заполните все поля!', 'error');
        return;
    }
    
    userProfile = { name, phone, address };
    window.userProfileData = userProfile;
    
    showMessage('Профиль успешно сохранен!', 'success');
    displayOrderHistory();
}

function loadUserProfile() {
    userProfile = window.userProfileData || { name: '', phone: '', address: '' };
    
    document.getElementById('userName').value = userProfile.name;
    document.getElementById('userPhone').value = userProfile.phone;
    document.getElementById('userAddress').value = userProfile.address;
    
    displayOrderHistory();
}

function displayOrderHistory() {
    const ordersList = document.getElementById('ordersList');
    const orders = window.orderHistory || [];
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="no-orders">У вас пока нет заказов</p>';
        return;
    }
    
    let ordersHTML = '';
    orders.forEach(order => {
        ordersHTML += `
            <div class="order-item">
                <div class="order-header">
                    <span class="order-id">Заказ #${order.id}</span>
                    <span class="order-date">${order.date}</span>
                </div>
                <div class="order-status">Статус: ${order.status}</div>
                <div class="order-total">Сумма: ${order.total} сомони</div>
                <div class="order-items">
                    Товаров: ${order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </div>
            </div>
        `;
    });
    
    ordersList.innerHTML = ordersHTML;
}

// Firebase Authentication
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";

const auth = getAuth();
const storage = getStorage();

// Регистрация пользователя
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert('Регистрация прошла успешно!');
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        alert('Ошибка регистрации: ' + error.message);
    }
});

// Вход пользователя
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert('Вход выполнен успешно!');
    } catch (error) {
        console.error('Ошибка входа:', error);
        alert('Ошибка входа: ' + error.message);
    }
});

// Добавление товара с фото
const addProductForm = document.getElementById('addProductForm');
addProductForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const category = document.getElementById('productCategory').value;
    const description = document.getElementById('productDescription').value;
    const imageFile = document.getElementById('productImage').files[0];

    if (imageFile) {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        try {
            await uploadBytes(storageRef, imageFile);
            const imageUrl = await getDownloadURL(storageRef);

            const newProduct = {
                name,
                price,
                category,
                description,
                image: imageUrl
            };

            await addProductToDatabase(newProduct);
            alert('Товар успешно добавлен!');
            addProductForm.reset();
        } catch (error) {
            console.error('Ошибка загрузки фото:', error);
            alert('Ошибка загрузки фото: ' + error.message);
        }
    } else {
        alert('Пожалуйста, выберите фото товара.');
    }
});


// Initialize cart display when cart section is shown
document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const cartSection = document.getElementById('cart');
                if (cartSection && cartSection.classList.contains('active')) {
                    displayCart();
                }
            }
        });
    });
    
    const cartSection = document.getElementById('cart');
    if (cartSection) {
        observer.observe(cartSection, { attributes: true });
    }
});

// Add styles for order history
const orderHistoryStyles = `
.order-item {
    background: var(--background-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.order-id {
    color: var(--primary-color);
}

.order-date {
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.order-status {
    color: var(--secondary-color);
    font-weight: 500;
    margin-bottom: 0.25rem;
}

.order-total {
    font-weight: 600;
    color: var(--primary-color);
}

.no-orders {
    text-align: center;
    color: var(--text-secondary);
    font-style: italic;
    padding: 2rem;
}
`;

// Add the styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = orderHistoryStyles;
document.head.appendChild(styleSheet);
