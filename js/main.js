let allProducts = [];
let currentProducts = [];
let currentPage = 1;
const productsPerPage = 6;
let currentCategory = "All";
let currentPriceRange = { min: 0, max: 2000000 };
let currentSort = "newest";

document.addEventListener("DOMContentLoaded", async () => {
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
    mirror: false,
  });

  await loadProducts();

  initializeCart();
  initializeMobileMenu();

  if (window.location.pathname.includes("product.html")) {
    await initializeProductPage();
  } else if (document.querySelector(".flex.space-x-6")) {
    await initializeFeaturedProducts();
  }
});

async function initializeProductPage() {
  initializeFilters();
  initializePriceRange();
  initializeSorting();

  applyFiltersAndSort();
}

function initializeMobileMenu() {
  const mobileMenuButton = document.querySelector(
    '[aria-controls="mobile-menu"]'
  );
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      const isExpanded =
        mobileMenuButton.getAttribute("aria-expanded") === "true";
      mobileMenuButton.setAttribute("aria-expanded", !isExpanded);
      
      if (!isExpanded) {
        mobileMenu.classList.remove("hidden");
        setTimeout(() => {
          mobileMenu.classList.add("translate-y-0");
          mobileMenu.classList.remove("-translate-y-full");
        }, 10);
      } else {
        mobileMenu.classList.add("-translate-y-full");
        mobileMenu.classList.remove("translate-y-0");
        setTimeout(() => {
          mobileMenu.classList.add("hidden");
        }, 300);
      }
    });
  }
}

async function loadProducts() {
  try {
    const response = await fetch("js/products.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    allProducts = data.products;
    currentProducts = [...allProducts];
    console.log("Products loaded:", allProducts);
    return data.products;
  } catch (error) {
    console.error("Error loading products:", error);
    const productsGrid = document.getElementById("productsGrid");
    if (productsGrid) {
      productsGrid.innerHTML = `
                <div class="col-span-full text-center text-red-500">
                    Error loading products. Please try again later.
                </div>`;
    }
    return [];
  }
}

function initializeFilters() {
  const categoryButtons = document.querySelectorAll(".categories button");
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((btn) => {
        btn.classList.remove("text-neon-cyan", "bg-neon-cyan/10");
        btn.classList.add(
          "text-gray-300",
          "hover:text-neon-cyan",
          "hover:bg-neon-cyan/10"
        );
      });
      button.classList.remove(
        "text-gray-300",
        "hover:text-neon-cyan",
        "hover:bg-neon-cyan/10"
      );
      button.classList.add("text-neon-cyan", "bg-neon-cyan/10");

      currentCategory = button.dataset.category;
      currentPage = 1;
      applyFiltersAndSort();
    });
  });
}

function initializePriceRange() {
  const slider = document.querySelector('input[type="range"]');
  if (slider) {
    slider.addEventListener("input", (e) => {
      const maxPrice = parseInt(e.target.value);
      currentPriceRange.max = maxPrice;
      document.querySelector(".price-range-display").textContent =
        `Rp ${maxPrice.toLocaleString()}`;
      applyFiltersAndSort();
    });
  }
}

function initializeSorting() {
  const sortSelect = document.querySelector("select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      applyFiltersAndSort();
    });
  }
}

function applyFiltersAndSort() {
  currentProducts = allProducts.filter((product) => {
    const categoryMatch =
      currentCategory === "All" || product.category === currentCategory;
    const priceMatch =
      product.price >= currentPriceRange.min &&
      product.price <= currentPriceRange.max;
    return categoryMatch && priceMatch;
  });

  switch (currentSort) {
    case "price-low":
      currentProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      currentProducts.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      currentProducts.sort(() => Math.random() - 0.5);
      break;
    default: 
      currentProducts.sort((a, b) => a.id - b.id);
  }

  updateProductDisplay();
  updatePagination();
}

function updateProductDisplay() {
  const productsGrid = document.getElementById("productsGrid");
  const template = document.getElementById("productTemplate");

  if (!productsGrid || !template) {
    console.error("Required elements not found");
    return;
  }

  productsGrid.innerHTML = "";

  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const paginatedProducts = currentProducts.slice(start, end);

  paginatedProducts.forEach((product) => {
    const clone = template.content.cloneNode(true);
    const img = clone.querySelector("img");
    const link = clone.querySelector("a");
    const name = clone.querySelector("h3");
    const price = clone.querySelector("p");
    const addToCartBtn = clone.querySelector("button");

    img.src = product.image;
    img.alt = product.name;
    link.href = `product-detail.html?id=${product.id}`;
    name.textContent = product.name;
    price.textContent = `Rp ${product.price.toLocaleString()}`;

    addToCartBtn.onclick = () =>
      addToCart(product.id, product.name, product.price, product.image);

    productsGrid.appendChild(clone);
  });

  if (paginatedProducts.length === 0) {
    productsGrid.innerHTML = `
            <div class="col-span-full text-center text-gray-400">
                No products found matching your criteria.
            </div>`;
  }
}


function updatePagination() {
  const totalPages = Math.ceil(currentProducts.length / productsPerPage);
  const pagination = document.querySelector(".pagination");
  if (!pagination) return;

  pagination.innerHTML = "";

  if (totalPages > 1) {
    const prevButton = createPaginationButton("Previous", () => {
      if (currentPage > 1) {
        currentPage--;
        updateProductDisplay();
        updatePagination();
      }
    });
    pagination.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = createPaginationButton(
        i.toString(),
        () => {
          currentPage = i;
          updateProductDisplay();
          updatePagination();
        },
        i === currentPage
      );
      pagination.appendChild(pageButton);
    }


    const nextButton = createPaginationButton("Next", () => {
      if (currentPage < totalPages) {
        currentPage++;
        updateProductDisplay();
        updatePagination();
      }
    });
    pagination.appendChild(nextButton);
  }
}


function createPaginationButton(text, onClick, isActive = false) {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = isActive
    ? "px-4 py-2 rounded-lg border border-neon-cyan text-neon-cyan"
    : "px-4 py-2 rounded-lg border border-neon-cyan/20 text-gray-300 hover:border-neon-cyan hover:text-neon-cyan transition-colors";
  button.onclick = onClick;
  return button;
}


async function initializeFeaturedProducts() {
  const container = document.querySelector(".flex.space-x-6");
  if (!container) return;

  const products = await loadProducts();
  const featuredProducts = products.slice(0, 6); 

  featuredProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "flex-none w-64";
    productCard.innerHTML = `
            <div class="group">
                <div class="relative aspect-square overflow-hidden rounded-lg border border-neon-cyan/20">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="absolute w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-300">
                    <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div class="space-y-2">
                            <a href="product-detail.html?id=${product.id}" 
                               class="block bg-neon-cyan text-black px-6 py-2 rounded-lg transform -translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                View Details
                            </a>
                            <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')"
                                    class="block w-full bg-black/50 text-neon-cyan border border-neon-cyan px-6 py-2 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
                <div class="mt-4">
                    <h3 class="text-lg font-medium text-white">${product.name}</h3>
                    <p class="text-neon-cyan">Rp ${product.price.toLocaleString()}</p>
                </div>
            </div>
        `;
    container.appendChild(productCard);
  });
}

function initializeCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.textContent = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }
}

function addToCart(productId, name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: productId,
      name: name,
      price: price,
      image: image,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.textContent = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  const notification = document.createElement("div");
  notification.className =
    "fixed bottom-4 right-4 bg-neon-cyan text-black px-6 py-3 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all duration-500";
  notification.textContent = "Item added to cart!";
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("translate-y-full", "opacity-0");
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}
