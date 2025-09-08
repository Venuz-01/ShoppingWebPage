const cardimage = document.getElementById("cardsContainer");
const searchInput = document.getElementById("searchInput");
const cartIcon = document.querySelector(".fa-shopping-cart");
const saveIcon = document.querySelector(".fa-bookmark");
const sectionTitle = document.getElementById("sectionTitle");
const productsSection = document.getElementById("productsSection"); //  grab products section

// Global variables
let products = [];
let cartItems = [];
let savedItems = [];
let cartCount = 0;
let savedCount = 0;

//diglog box function
 function showSaveModal() {
  const modal1 = document.getElementById("saveModal");
  const modal = new bootstrap.Modal(modal1);
  modal.show();
 }

// Fetch products
fetch('http://localhost:3000/Products')
  .then(result => result.json())
  .then(data => {
    products = data;
    displayProducts(products, "all");
  })
  .catch(error => console.error("Error loading data:", error));

// addproducts part
function Addproduct() {
  const name = document.getElementById("name").value;
  const rate = document.getElementById("rate").value;
  const picture = document.getElementById("picture").value;

  const newProduct = {
    title: name,
    Price: parseFloat(rate),
    ImagePath: picture
  };

  fetch('http://localhost:3000/Products', {  
    method: 'POST',                         
    headers: {
      'Content-Type': 'application/json'    
    },
    body: JSON.stringify(newProduct)        
  })
  .then(response => response.json())
  .then(() => {
    alert("Product added successfully!");
    fetch('http://localhost:3000/Products')
      .then(result => result.json())
      .then(data => {
        products = data;
        displayProducts(products, "all"); 
      });
  })
  .catch(()=> {
    alert("Failed to add product.");
  });
}

// Display products based on mode
function displayProducts(productsList, mode = "all") {
  sectionTitle.textContent =
    mode === "cart" ? "Cart Items" :
    mode === "saved" ? "Saved Items" :
    "All Products";

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
            <div class="d-flex justify-content-between flex-wrap gap-2">
              ${
                mode === "cart"
                  ? `<a href="#" class="btn btn-danger remove-from-cart" data-id="${product.id}">Remove</a>`
                  : mode === "saved"
                  ? `<a href="#" class="btn btn-warning remove-from-saved" data-id="${product.id}">Remove</a>`
                  : `<a href="#" class="btn btn-secondary add-to-cart" data-id="${product.id}">Add to cart</a>
                     <a href="#" class="btn btn-primary">Buy Now</a>
                     <a href="#" class="btn btn-secondary save-for-later" data-id="${product.id}">Save for later</a>`
              }
            </div>
          </div>
        </div>
      </div>
    `;
    cardimage.innerHTML += card;
  });

  if (mode === "all") {
    document.querySelectorAll(".add-to-cart").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = e.target.getAttribute("data-id");
        const product = products.find(p => p.id == productId);

        if (product && !cartItems.some(p => p.id == productId)) {
          cartItems.push(product);
          cartCount++;
          updateCartIcon();
          showToast(); 
        }
      });
    });

    document.querySelectorAll(".save-for-later").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = e.target.getAttribute("data-id");
        const product = products.find(p => p.id == productId);

        if (product && !savedItems.some(p => p.id == productId)) {
          savedItems.push(product);
          savedCount++;
          updateSavedIcon();
          showSaveModal();  // showing confirmation message.
        }
      });
    });
  }

  if (mode === "cart") {
    document.querySelectorAll(".remove-from-cart").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = e.target.getAttribute("data-id");
        cartItems = cartItems.filter(p => p.id != productId);
        cartCount = cartItems.length;
        updateCartIcon();
        displayProducts(cartItems, "cart");
      });
    });
  }

  if (mode === "saved") {
    document.querySelectorAll(".remove-from-saved").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = e.target.getAttribute("data-id");
        savedItems = savedItems.filter(p => p.id != productId);
        savedCount = savedItems.length;
        updateSavedIcon();
        displayProducts(savedItems, "saved");
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

  badge.textContent = cartCount;
  badge.style.display = cartCount > 0 ? "inline-block" : "none";
}

// Update saved icon badge
function updateSavedIcon() {
  let badge = document.querySelector(".saved-badge");

  if (!badge) {
    badge = document.createElement("span");
    badge.classList.add("saved-badge", "position-absolute", "top-0", "start-100", "translate-middle", "badge", "rounded-pill", "bg-warning");
    saveIcon.parentElement.style.position = "relative";
    saveIcon.parentElement.appendChild(badge);
  }

  badge.textContent = savedCount;
  badge.style.display = savedCount > 0 ? "inline-block" : "none";
}

// Search products
function searchProducts() {
  const query = searchInput.value.toLowerCase();
  const filtered = products.filter(product =>
    product.title.toLowerCase().includes(query)
  );
  displayProducts(filtered, "all");
}

// All Products button click
document.getElementById("allProductsBtn").addEventListener("click", (e) => {
  e.preventDefault();
  displayProducts(products, "all");
  productsSection.scrollIntoView({ behavior: "smooth" }); // scroll to section
});

// Cart Icon click
cartIcon.parentElement.addEventListener("click", (e) => {
  e.preventDefault();
  displayProducts(cartItems, "cart");
  productsSection.scrollIntoView({ behavior: "smooth" });
});

// Save for Later Icon click
saveIcon.parentElement.addEventListener("click", (e) => {
  e.preventDefault();
  displayProducts(savedItems, "saved");
  productsSection.scrollIntoView({ behavior: "smooth" });
});

// Toast Function
function showToast() {
  const toastEl = document.getElementById("toastMsg");
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

