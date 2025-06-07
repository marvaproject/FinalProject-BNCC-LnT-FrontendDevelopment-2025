document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
});

function initializeCart() {
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const template = document.getElementById('cartItemTemplate');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    updateCartDisplay();

    function updateCartDisplay() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            cartItems.style.display = 'none';
            emptyCart.style.display = 'block';
            return;
        }
        
        cartItems.style.display = 'block';
        emptyCart.style.display = 'none';
        cartItems.innerHTML = '';
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const clone = template.content.cloneNode(true);
            
            const img = clone.querySelector('img');
            const name = clone.querySelector('h3');
            const price = clone.querySelector('.item-price');
            const quantity = clone.querySelector('.quantity');
            const size = clone.querySelector('.size-selector');
            
            img.src = item.image;
            img.alt = item.name;
            name.textContent = item.name;
            price.textContent = `Rp ${(item.price * item.quantity).toLocaleString()}`;
            quantity.textContent = item.quantity;

            if (size) {
                size.value = item.size;
                size.addEventListener('change', (e) => updateItemSize(item.id, item.size, e.target.value));
            }
            
            subtotal += item.price * item.quantity;
            
            clone.querySelector('.decrease').addEventListener('click', () => updateQuantity(item.id, item.size, -1));
            clone.querySelector('.increase').addEventListener('click', () => updateQuantity(item.id, item.size, 1));
            clone.querySelector('.remove-item').addEventListener('click', () => removeItem(item.id, item.size));
            
            cartItems.appendChild(clone);
        });
        
        subtotalElement.textContent = `Rp ${subtotal.toLocaleString()}`;
        totalElement.textContent = `Rp ${subtotal.toLocaleString()}`;

        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        }
    }
    
    function updateQuantity(id, size, change) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === id && item.size === size);
        
        if (itemIndex > -1) {
            const newQuantity = cart[itemIndex].quantity + change;
            if (newQuantity < 1) {
                removeItem(id, size);
            } else {
                cart[itemIndex].quantity = newQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
            }
        }
    }

    function updateItemSize(id, oldSize, newSize) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === id && item.size === oldSize);
        
        if (itemIndex > -1) {
            const existingItemWithNewSize = cart.findIndex(item => 
                item.id === id && item.size === newSize
            );

            if (existingItemWithNewSize > -1) {
                cart[existingItemWithNewSize].quantity += cart[itemIndex].quantity;
                cart.splice(itemIndex, 1);
            } else {
                cart[itemIndex].size = newSize;
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();

            showNotification('Size updated successfully');
        }
    }
    
    function removeItem(id, size) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => !(item.id === id && item.size === size));
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all duration-500 ${
        type === 'success' ? 'bg-neon-cyan text-black' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('translate-y-full', 'opacity-0');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}
