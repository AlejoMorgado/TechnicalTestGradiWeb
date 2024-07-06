document.addEventListener("DOMContentLoaded", async () => {
  const url = "https://gradistore-spi.herokuapp.com/products/all";
  let currentIndex = 0;
  let products = [];
  let productsPerPage = getProductsPerPage();

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    products = data.products.nodes;
    displayProducts(products, currentIndex, productsPerPage);
  } catch (error) {
    console.error("Fetch error:", error);
    alert("There was an error fetching the products. Please try again later.");
  }

  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex -= productsPerPage;
      displayProducts(products, currentIndex, productsPerPage);
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentIndex < products.length - productsPerPage) {
      currentIndex += productsPerPage;
      displayProducts(products, currentIndex, productsPerPage);
    }
  });

  window.addEventListener("resize", () => {
    productsPerPage = getProductsPerPage();
    displayProducts(products, currentIndex, productsPerPage);
  });

  const sendButton = document.getElementById("sendButton");
  const emailInput = document.getElementById("emailInput");
  const validationMessage = document.getElementById("validationMessage");

  sendButton.addEventListener("click", (event) => {
    event.preventDefault();
    const emailValue = emailInput.value;
    if (validateEmail(emailValue)) {
      validationMessage.textContent = "Thank you for subscribing!!";
      validationMessage.style.color = "green";
    } else {
      validationMessage.textContent = "Please enter a valid email address.";
      validationMessage.style.color = "red";
    }
    emailInput.value = "";
    setTimeout(() => {
      validationMessage.textContent = "";
    }, 8000);
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});

function displayProducts(products, startIndex, productsPerPage) {
  const productsContainer = document.getElementById("productsContainer");
  productsContainer.innerHTML = "";

  const endIndex = Math.min(startIndex + productsPerPage, products.length);
  for (let i = startIndex; i < endIndex; i++) {
    const product = products[i];
    const rating = calculateStarRating(product.tags);
    const averageRating = calculateAverage(product.tags);
    const currencySymbol = getProductCurrencySymbol(
      product.prices.min.currencyCode
    );
    const formattedPrice = formatPrice(product.prices.min.amount);

    const productElement = document.createElement("div");
    productElement.className = "product";
    productElement.innerHTML = `
      <img src="${product.featuredImage.url}" alt="${product.title}">
      <div class="seeMoreButtonContainer">
        <button class="seeMoreButton">SEE MORE</button>
      </div>
      <h3 class='productTitle'>${product.title}</h3>
      <div class="productDescription">
        <div class="rating">
          <p><span class="stars">${"★".repeat(rating)}${"☆".repeat(
      5 - rating
    )}</span> (${averageRating})</p>
        </div>
        <div class="price">
          <p>${currencySymbol}${formattedPrice} </p>
        </div>
      </div>
      <div class="addToCartButtonContainer">
        <button class="addToCartButton">ADD TO CART</button>
      </div>
    `;
    productsContainer.appendChild(productElement);
  }
}

function formatPrice(price) {
  let priceStr = parseFloat(price).toFixed(2);

  priceStr = priceStr.replace(".", ",");
  return priceStr;
}
function getProductCurrencySymbol(currencyCode) {
  switch (currencyCode) {
    case "EUR":
      return "€";
    case "USD":
      return "$";
    default:
      return currencyCode;
  }
}

function calculateStarRating(tags) {
  const numericTags = tags
    .map((tag) => parseInt(tag, 10))
    .filter((tag) => !isNaN(tag));

  if (numericTags.length === 0) return 0;

  const average = numericTags.reduce((a, b) => a + b, 0) / numericTags.length;

  switch (true) {
    case average <= 100:
      return 1;
    case average <= 200:
      return 2;
    case average <= 300:
      return 3;
    case average <= 400:
      return 4;
    case average <= 500:
      return 5;
    default:
      return 0;
  }
}

function calculateAverage(tags) {
  const numericTags = tags
    .map((tag) => parseInt(tag, 10))
    .filter((tag) => !isNaN(tag));

  if (numericTags.length === 0) return "No numeric tags";

  const average = numericTags.reduce((a, b) => a + b, 0) / numericTags.length;
  return average.toFixed(0);
}

function getProductsPerPage() {
  const width = window.innerWidth;
  if (width <= 600) {
    return 1;
  } else if (width <= 1024) {
    return 2;
  } else {
    return 3;
  }
}
