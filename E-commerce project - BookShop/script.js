// Cart functionality
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(book) {
  // Check if book already exists in cart
  const existingBook = cart.find((item) => item.id === book.id);

  if (existingBook) {
    existingBook.quantity += 1;
  } else {
    cart.push({ ...book, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showNotification("Book added to cart!");
}

function removeFromCart(bookId) {
  cart = cart.filter((item) => item.id !== bookId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showNotification("Book removed from cart!");
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "block" : "none";
  }
}

// Favorites functionality
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function toggleFavorite(book) {
  const index = favorites.findIndex((item) => item.id === book.id);

  if (index === -1) {
    favorites.push(book);
    showNotification("Book added to favorites!");
  } else {
    favorites.splice(index, 1);
    showNotification("Book removed from favorites!");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoritesCount();
}

function updateFavoritesCount() {
  const favoritesCount = document.getElementById("favorites-count");
  if (favoritesCount) {
    favoritesCount.textContent = favorites.length;
    favoritesCount.style.display = favorites.length > 0 ? "block" : "none";
  }
}

// Notification system
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// User Authentication Functions
function isLoggedIn() {
  return localStorage.getItem("currentUser") !== null;
}

function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

function logout() {
  localStorage.removeItem("currentUser");
  showNotification("Logged out successfully!");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}

// Update header based on login status
function updateHeaderAuth() {
  const loginBtn = document.querySelector(".login-btn");
  if (loginBtn) {
    const currentUser = getCurrentUser();
    if (currentUser) {
      loginBtn.innerHTML = `
        <i class="fas fa-user"></i>
        ${currentUser.email}
        <div class="dropdown-menu">
          <a href="#" onclick="logout()">Logout</a>
        </div>
      `;
      loginBtn.classList.add("logged-in");
    } else {
      loginBtn.innerHTML = `
        <i class="fas fa-user"></i>
        Login
      `;
      loginBtn.classList.remove("logged-in");
    }
  }
}

// Initialize header auth state
document.addEventListener("DOMContentLoaded", () => {
  updateHeaderAuth();
  updateCartCount();
  updateFavoritesCount();
});

// Add event listeners to all "Add to Cart" buttons
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const bookCard = e.target.closest(".book-card");
    const book = {
      id: bookCard.dataset.id,
      title: bookCard.querySelector(".book-title").textContent,
      author: bookCard.querySelector(".book-author").textContent,
      price: bookCard.querySelector(".book-price").textContent,
      image: bookCard.querySelector(".book-img img").src,
    };
    addToCart(book);
  }

  if (e.target.classList.contains("add-to-favorites")) {
    const bookCard = e.target.closest(".book-card");
    const book = {
      id: bookCard.dataset.id,
      title: bookCard.querySelector(".book-title").textContent,
      author: bookCard.querySelector(".book-author").textContent,
      price: bookCard.querySelector(".book-price").textContent,
      image: bookCard.querySelector(".book-img img").src,
    };
    toggleFavorite(book);
  }
});
