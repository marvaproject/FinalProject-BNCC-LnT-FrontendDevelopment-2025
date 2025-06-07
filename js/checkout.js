document.addEventListener('DOMContentLoaded', () => {
    initializeCheckout();
});

function initializeCheckout() {
    const orderItems = document.getElementById('orderItems');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const checkoutForm = document.getElementById('checkoutForm');
    
    updateOrderSummary();
    setupFormValidation();

    function updateOrderSummary() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        orderItems.innerHTML = '';
        
        let subtotal = 0;
        let totalItems = 0;
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'flex items-center gap-4 py-4 border-b border-neon-cyan/10 last:border-0';
            itemElement.innerHTML = `
                <div class="flex-shrink-0">
                    <img src="${item.image}" alt="${item.name}" 
                         class="w-16 h-16 object-cover rounded-lg border border-neon-cyan/20">
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="text-white truncate">${item.name}</h4>
                    <div class="text-gray-400 text-sm">
                        Size: ${item.size} | Qty: ${item.quantity}
                    </div>
                </div>
                <div class="text-neon-cyan text-right">
                    Rp ${(item.price * item.quantity).toLocaleString()}
                </div>
            `;
            orderItems.appendChild(itemElement);
            
            subtotal += item.price * item.quantity;
            totalItems += item.quantity;
        });

        const summaryDetails = document.createElement('div');
        summaryDetails.className = 'mt-4 space-y-2 text-sm text-gray-400';
        summaryDetails.innerHTML = `
            <div class="flex justify-between">
                <span>Total Items:</span>
                <span>${totalItems} items</span>
            </div>
            <div class="flex justify-between">
                <span>Estimated Delivery:</span>
                <span>2-3 business days</span>
            </div>
            <div class="flex justify-between">
                <span>Shipping Method:</span>
                <span>Regular Delivery</span>
            </div>
        `;
        orderItems.appendChild(summaryDetails);
        
        subtotalElement.textContent = `Rp ${subtotal.toLocaleString()}`;
        totalElement.textContent = `Rp ${subtotal.toLocaleString()}`;
    }

    function setupFormValidation() {
        const cardInput = document.getElementById('cardNumber');
        if (cardInput) {
            cardInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 16) value = value.slice(0, 16);
                
                const parts = [];
                for (let i = 0; i < value.length; i += 4) {
                    parts.push(value.slice(i, i + 4));
                }
                e.target.value = parts.join(' ');
            });
        }

        const monthInput = document.getElementById('expiryMonth');
        const yearInput = document.getElementById('expiryYear');
        
        if (monthInput) {
            monthInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 2) value = value.slice(0, 2);
                if (parseInt(value) > 12) value = '12';
                e.target.value = value;
            });
        }

        if (yearInput) {
            yearInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 2) value = value.slice(0, 2);
                e.target.value = value;
            });
        }

        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 3) value = value.slice(0, 3);
                e.target.value = value;
            });
        }

        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateForm()) {
                showNotification('Please fill in all required fields correctly', 'error');
                return;
            }

            const submitButton = checkoutForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            `;

            try {
                await new Promise(resolve => setTimeout(resolve, 2000));

                showNotification('Order placed successfully!');
                
                localStorage.removeItem('cart');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);

            } catch (error) {
                showNotification('Error processing order. Please try again.', 'error');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }

    function validateForm() {
        const requiredFields = checkoutForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('border-red-500');
                isValid = false;
            } else {
                field.classList.remove('border-red-500');
            }
        });

        const emailInput = checkoutForm.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                emailInput.classList.add('border-red-500');
                isValid = false;
            }
        }

        const cardInput = document.getElementById('cardNumber');
        if (cardInput && cardInput.value) {
            const cardNumber = cardInput.value.replace(/\s/g, '');
            if (cardNumber.length !== 16) {
                cardInput.classList.add('border-red-500');
                isValid = false;
            }
        }

        return isValid;
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
