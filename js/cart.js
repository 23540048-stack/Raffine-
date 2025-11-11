/* ==================== CART.JS ==================== */

/* ----------------- CART FUNCTIONS ----------------- */
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

/* ----------------- CART COUNT ----------------- */
function updateCartCount() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector(".cart-count");
  if (badge) badge.textContent = totalCount;
}

/* ----------------- ADD TO CART ----------------- */
function addToCart(id, size, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id && item.size === size);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id, size, quantity });
  }

  saveCart(cart);
  renderCart();
}

/* ----------------- REMOVE & UPDATE QUANTITY ----------------- */
function removeFromCart(id, size) {
  let cart = getCart();
  cart = cart.filter((item) => !(item.id === id && item.size === size));
  saveCart(cart);
  renderCart();
}

function updateQuantity(id, size, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id && i.size === size);
  if (item) {
    item.quantity = Math.max(1, item.quantity + delta);
    saveCart(cart);
    renderCart();
  }
}

/* ----------------- RENDER CART ----------------- */
function renderCart() {
  const cart = getCart();
  const tbody = document.getElementById("cart-body");
  const subtotalEl = document.getElementById("cart-subtotal");

  if (!tbody || !subtotalEl) return;

  tbody.innerHTML = "";
  let subtotal = 0;

  if (cart.length === 0) {
    tbody.innerHTML =
      "<tr><td colspan='6' style='padding:20px; text-align:center;'>Your cart is empty!</td></tr>";
    subtotalEl.textContent = "$0.00";
    return;
  }

  cart.forEach((item, index) => {
    const product = products[item.id];
    if (!product) return;

    const itemSubtotal = product.price * item.quantity;
    subtotal += itemSubtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <img src="${product.images[0]}" alt="${product.name}" width="150">
        
      </td>
      <td>${product.name}</>
      <td>Size ${item.size}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>
        <button class="quantity-btn minus" data-index="${index}">−</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn plus" data-index="${index}">+</button>
      </td>
      <td>$${itemSubtotal.toFixed(2)}</td>
      <td><button class="remove-btn" data-index="${index}">×</button></td>
    `;
    tbody.appendChild(row);
  });

  // Cập nhật subtotal
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
}

/* ----------------- EVENT HANDLERS ----------------- */
document.addEventListener("click", (e) => {
  const cart = getCart();

  // Tăng số lượng
  if (e.target.classList.contains("plus")) {
    const index = parseInt(e.target.dataset.index);
    cart[index].quantity++;
    saveCart(cart);
    renderCart();
  }

  // Giảm số lượng
  if (e.target.classList.contains("minus")) {
    const index = parseInt(e.target.dataset.index);
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
      saveCart(cart);
      renderCart();
    }
  }

  // Xóa sản phẩm
  if (e.target.classList.contains("remove-btn")) {
    const index = parseInt(e.target.dataset.index);
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
  }
});

/* ----------------- INIT ----------------- */
window.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartCount();
});
/* ----------------- BUTTON HANDLERS ----------------- */
window.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartCount();

  const paymentBtn = document.getElementById("payment-btn");
  const continueBtn = document.getElementById("continue-btn");

  // Nút PAYMENT → chuyển sang trang success-page.html
  if (paymentBtn) {
    paymentBtn.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert("Your cart is empty, checkout is unavailable!");
        return;
      }

      // Giả lập tạo order ID
      const orderId = Math.floor(100000 + Math.random() * 900000);

      // Lưu orderId tạm để hiển thị bên success.html
      localStorage.setItem("lastOrderId", orderId);
      localStorage.setItem("lastOrderItems", JSON.stringify(cart));

      // Xóa giỏ hàng
      localStorage.removeItem("cart");

      // Chuyển hướng
      window.location.href = "success-page.html";
    });
  }

  // Nút CONTINUE SHOPPING → quay lại home
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
});
