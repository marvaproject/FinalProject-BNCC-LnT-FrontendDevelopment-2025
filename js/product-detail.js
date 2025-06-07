let selectedSize = null;

document.addEventListener('DOMContentLoaded', async () => {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    await initializeProductDetail();
});

async function initializeProductDetail() {
    try {
        const response = await fetch('js/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const products = data.products;

        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        
        if (!productId) {
            window.location.href = 'product.html';
            return;
        }

        const product = products.find(p => p.id === productId);
        if (!product) {
            window.location.href = 'product.html';
            return;
        }

        updateProductDetails(product);
        
        initializeSizeSelection();
        
        initializeQuantityButtons();

        loadRelatedProducts(product, products);

    } catch (error) {
        console.error('Error initializing product detail:', error);
    }
}

function updateProductDetails(product) {
    const mainImage = document.querySelector('.aspect-w-1.aspect-h-1 img');
    if (mainImage) {
        mainImage.src = product.image;
        mainImage.alt = product.name;
    }

    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = `Rp ${product.price.toLocaleString()}`;
    
    const description = document.querySelector('.prose.prose-invert p');
    if (description) {
        description.textContent = product.description;
    }

    const addToCartButton = document.querySelector('button[onclick="addToCart()"]');
    if (addToCartButton) {
        addToCartButton.onclick = () => addToCartWithSize(product);
    }
}

function initializeSizeSelection() {
    const sizeButtons = document.querySelectorAll('.grid.grid-cols-4.gap-4 button');
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            sizeButtons.forEach(btn => {
                btn.classList.remove('border-neon-cyan', 'text-neon-cyan');
                btn.classList.add('border-neon-cyan/20', 'text-gray-300');
            });

            button.classList.remove('border-neon-cyan/20', 'text-gray-300');
            button.classList.add('border-neon-cyan', 'text-neon-cyan');

            selectedSize = button.textContent;
        });
    });
}

function initializeQuantityButtons() {
    const quantityElement = document.getElementById('quantity');
    
    window.updateQuantity = function(change) {
        let quantity = parseInt(quantityElement.textContent);
        quantity = Math.max(1, quantity + change);
        quantityElement.textContent = quantity;
    }
}

function addToCartWithSize(product) {
    if (!selectedSize) {
        showNotification('Please select a size first', 'error');
        return;
    }

    const quantity = parseInt(document.getElementById('quantity').textContent);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id && item.size === selectedSize);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            quantity: quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    showNotification('Item added to cart!', 'success');

    document.getElementById('quantity').textContent = '1';
}

function loadRelatedProducts(currentProduct, allProducts) {
    const relatedProductsContainer = document.getElementById('relatedProducts');
    if (!relatedProductsContainer) return;

    let relatedProducts = allProducts
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4); 

    if (relatedProducts.length < 4) {
        const otherProducts = allProducts
            .filter(p => p.category !== currentProduct.category && p.id !== currentProduct.id)
            .slice(0, 4 - relatedProducts.length);
        relatedProducts = [...relatedProducts, ...otherProducts];
    }

    relatedProductsContainer.innerHTML = '';

    relatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'group hover-card';
        productCard.innerHTML = `
            <div class="relative overflow-hidden rounded-lg border border-neon-cyan/20">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="w-full h-48 object-cover">
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <a href="product-detail.html?id=${product.id}" 
                       class="bg-neon-cyan text-black px-4 py-2 rounded-lg transform -translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        View Details
                    </a>
                </div>
            </div>
            <div class="mt-4">
                <h3 class="text-lg font-medium text-white">${product.name}</h3>
                <p class="text-neon-cyan">Rp ${product.price.toLocaleString()}</p>
            </div>
        `;
        relatedProductsContainer.appendChild(productCard);
    });
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
