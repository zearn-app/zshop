const products = [
  {
    name: "iPhone 13",
    priceAmazon: 52000,
    priceFlipkart: 51000
  },
  {
    name: "Samsung S21",
    priceAmazon: 45000,
    priceFlipkart: 43000
  }
];

const container = document.getElementById("product-list");

function displayProducts(items) {
  container.innerHTML = "";

  items.forEach(p => {
    const bestPrice = Math.min(p.priceAmazon, p.priceFlipkart);

    container.innerHTML += `
      <div class="product">
        <h2>${p.name}</h2>
        <p>Amazon: ₹${p.priceAmazon}</p>
        <p>Flipkart: ₹${p.priceFlipkart}</p>
        <p><b>Best Price: ₹${bestPrice}</b></p>
      </div>
    `;
  });
}

displayProducts(products);
