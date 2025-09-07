const cardimage = document.getElementById("cardsContainer");
  fetch('Products.json')
  .then(result => result.json())
  .then(data => {
    const products = data.Products;
    products.forEach(product => {
      const card = `
        <div class="col-12 col-md-4">
          <div class="card h-100 shadow">
            <img src="${product.ImagePath}" class="card-img-top" alt="${product.title}">
            <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text">₹${product.Price}</p>
              <div class="d-flex justify-content-between">
          <a id="carda3"  href="#" class="btn btn-secondary">Add to cart</a>
           <a href="#" class="btn btn-primary">Buy Now</a>
          <a id="carda3.1"  href="#" class="btn btn-secondary">Save for later</a>
          </div>
        </div>

            </div>
          </div>
        </div>
      `;
      cardimage.innerHTML += card;
    });
  })
  .catch(error => console.error("Error loading data:", error));
