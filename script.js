const cardimage = document.getElementById("cardsContainer");
const searchInput = document.getElementById("searchInput");
const cartIcon = document.querySelector(".fa-shopping-cart");
const sectionTitle = document.getElementById("sectionTitle");

// Global variables
let products = [];
let cartItems = [];
let cartCount = 0;

// Fetch products
fetch('Products.json')
  .then(result => result.json())
  .then(data => {
    products = data.Products;
    displayProducts(products, false);
  })
  .catch(error => console.error("Error loading data:", error));

// Function to display products or cart items
function displayProducts(productsList, isCart = false) {
  // Change heading dynamically
  sectionTitle.textContent = isCart ? "Cart Items" : "All Products";

  cardimage.innerHTML = "";

  if (productsList.length === 0) {
    cardimage.innerHTML = `<p class="text-center fs-4 mt-4">No products found!</p>`;
    return;
  }

  productsList.forEach(product => {
    const card = `
      <div class="col-12 col-md-4">
        <div class="card h-100 shadow">
          <img src="${product.ImagePath}" class="card-img-top" alt="${product.title}">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">₹${product.Price}</p>
            <div class="d-flex justify-content-between">
              ${
                isCart
                  ? `<a href="#" class="btn btn-danger remove-from-cart" data-id="${product.id}">Remove</a>`
                  : `<a href="#" class="btn btn-secondary add-to-cart" data-id="${product.id}">Add to cart</a>
                     <a href="#" class="btn btn-primary">Buy Now</a>
                     <a href="#" class="btn btn-secondary">Save for later</a>`
              }
            </div>
          </div>
        </div>
      </div>
    `;
    cardimage.innerHTML += card;
  });

  if (!isCart) {
    // Add-to-cart buttons
    document.querySelectorAll(".add-to-cart").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = e.target.getAttribute("data-id");
        const product = products.find(p => p.id === productId);

        if (product && !cartItems.some(p => p.id === productId)) {
          cartItems.push(product);
          cartCount++;
          updateCartIcon();
        }
      });
    });
  } else {
    // Remove-from-cart buttons
    document.querySelectorAll(".remove-from-cart").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = e.target.getAttribute("data-id");
        cartItems = cartItems.filter(p => p.id !== productId);
        cartCount = cartItems.length;
        updateCartIcon();

        if (cartItems.length === 0) {
          sectionTitle.textContent = "Cart Items";
          cardimage.innerHTML = `<p class="text-center fs-4 mt-4">Your cart is empty!</p>`;
        } else {
          displayProducts(cartItems, true);
        }
      });
    });
  }
}

// Update cart icon badge
function updateCartIcon() {
  let badge = document.querySelector(".cart-badge");

  if (!badge) {
    badge = document.createElement("span");
    badge.classList.add("cart-badge", "position-absolute", "top-0", "start-100", "translate-middle", "badge", "rounded-pill", "bg-danger");
    cartIcon.parentElement.style.position = "relative";
    cartIcon.parentElement.appendChild(badge);
  }

  if (cartCount > 0) {
    badge.textContent = cartCount;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}

// Search products
function searchProducts() {
  const query = searchInput.value.toLowerCase();
  const filtered = products.filter(product =>
    product.title.toLowerCase().includes(query)
  );
  displayProducts(filtered, false);
}

// All Products button click
document.getElementById("allProductsBtn").addEventListener("click", (e) => {
  e.preventDefault();
  displayProducts(products, false);
});

// Cart Icon click
cartIcon.parentElement.addEventListener("click", (e) => {
  e.preventDefault();
  if (cartItems.length === 0) {
    sectionTitle.textContent = "Cart Items";
    cardimage.innerHTML = `<p class="text-center fs-4 mt-4">Your cart is empty!</p>`;
  } else {
    displayProducts(cartItems, true);
  }
});
