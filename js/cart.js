/* ----------------- CART FUNCTIONS ----------------- */
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || []; // Lấy dữ liệu cart trong localStorage
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart)); // Lưu dữ liệu vào localStorage
  updateCartCount();
}

/* ----------------- CART COUNT ----------------- */
function updateCartCount() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0); // Dùng reduce để cộng dồn số lượng (quantity) của từng sản phẩm, bắt đầu từ 0
  const badge = document.querySelector(".cart-count"); // Tìm và cập nhật số lượng hiển thị trên icon giỏ hàng (Badge)
  if (badge) badge.textContent = totalCount;
}

/* ----------------- ADD TO CART ----------------- */
function addToCart(id, size, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id && item.size === size); // Tìm sản phẩm trùng khớp bằng ID, size
  // Nếu có thì tăng số lượng, không thì thêm vào
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
  cart = cart.filter((item) => !(item.id === id && item.size === size)); // Lọc ra tất cả sản phẩm không trùng với id và size cần xóa => item nào trùng id + size sẽ bị loại khỏi mảng
  saveCart(cart);
  renderCart();
}

function updateQuantity(id, size, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id && i.size === size); // Tìm sản phẩm có id và size trùng với sản phẩm cần cập nhật
  if (item) {
    // Cập nhật số lượng mới: tăng/giảm theo delta, Math.max(1, ...) để đảm bảo số lượng luôn >= 1 (không cho xuống 0)
    item.quantity = Math.max(1, item.quantity + delta);
    saveCart(cart);
    renderCart();
  }
}

/* ----------------- RENDER CART ----------------- */
function renderCart() {
  const cart = getCart();
  const tbody = document.getElementById("cart-body"); // Body của bảng giỏ hàng
  const subtotalEl = document.getElementById("cart-subtotal"); // Hiển thị tổng tiền

  if (!tbody || !subtotalEl) return; // Nếu table body hoặc subtotal không tồn tại → thoát

  // 2. Xử lý Reset và Empty
  tbody.innerHTML = "";
  let subtotal = 0;

  if (cart.length === 0) {
    tbody.innerHTML =
      "<tr><td colspan='7' style='padding:20px; text-align:center;'>Your cart is empty!</td></tr>";
    subtotalEl.textContent = "$0.00";
    return;
  }

  // 3. Loop qua giỏ hàng
  cart.forEach((item, index) => {
    const product = products[item.id]; // Lấy thông tin sản phẩm từ biến local
    if (!product) return; // Nếu sản phẩm không tồn tại → bỏ qua

    const itemTotal = product.price * item.quantity; // Tiền của item
    subtotal += itemTotal; // Cộng vào tổng

    // === TẠO DOM ===
    const row = document.createElement("tr");
    row.classList.add("cart-row");
    row.dataset.rowId = `${item.id}-${item.size}`; // Đánh dấu row

    // -- Cột 1: Hình ảnh (Product) --
    const colProduct = createTd("col-product", "Product");
    const productWrapper = document.createElement("div");
    productWrapper.classList.add("product-wrapper");

    const img = document.createElement("img");
    img.src = product.images[0];
    img.alt = product.name;
    img.classList.add("product-img");

    productWrapper.appendChild(img);
    colProduct.appendChild(productWrapper);

    // -- Cột 2: Tên --
    const colName = createTd("col-name", "Name");
    colName.textContent = product.name;

    // -- Cột 3: Size --
    const colSize = createTd("col-size", "Size");
    colSize.textContent = `Size ${item.size}`;

    // -- Cột 4: Giá --
    const colPrice = createTd("col-price", "Price");
    colPrice.dataset.price = product.price;
    colPrice.textContent = `$${product.price.toFixed(2)}`;

    // -- Cột 5: Số lượng (Cấu trúc phức tạp) --
    const colQty = createTd("col-qty", "Qty");
    const qtyControl = document.createElement("div");
    qtyControl.classList.add("quantity-control");

    // Input hiển thị số
    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.value = item.quantity;
    qtyInput.classList.add("qty-input");
    qtyInput.readOnly = true;

    // Div chứa 2 nút bấm
    const qtyActions = document.createElement("div");
    qtyActions.classList.add("qty-actions");

    const plusBtn = createQtyButton("plus", "increase", "▲", index);
    const minusBtn = createQtyButton("minus", "decrease", "▼", index);

    qtyActions.appendChild(plusBtn);
    qtyActions.appendChild(minusBtn);

    qtyControl.appendChild(qtyInput);
    qtyControl.appendChild(qtyActions);
    colQty.appendChild(qtyControl);

    // -- Cột 6: Tổng tiền item --
    const colSubtotal = createTd("col-subtotal", "Subtotal");
    colSubtotal.textContent = `$${itemTotal.toFixed(2)}`;

    // -- Cột 7: Nút xóa --
    const colRemove = createTd("col-remove", "Remove");
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.dataset.index = index; // Dùng index để xóa
    removeBtn.textContent = "×";

    colRemove.appendChild(removeBtn);

    // -- Ghép tất cả vào hàng --
    row.appendChild(colProduct);
    row.appendChild(colName);
    row.appendChild(colSize);
    row.appendChild(colPrice);
    row.appendChild(colQty);
    row.appendChild(colSubtotal);
    row.appendChild(colRemove);

    tbody.appendChild(row);
  });

  // 4. Cập nhật tổng tiền cuối cùng
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
}

// --- CÁC HÀM HỖ TRỢ  ---

function createTd(className, title) {
  const td = document.createElement("td");
  td.classList.add(className);
  td.dataset.title = title;
  return td;
}

function createQtyButton(className, action, text, index) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.classList.add("qty-btn", className, "quantity-btn");
  btn.dataset.action = action;
  btn.dataset.index = index;
  btn.textContent = text;
  return btn;
}
/* ----------------- EVENT HANDLERS ----------------- */
document.addEventListener("click", (e) => {
  const cart = getCart();

  // Tăng số lượng
  if (e.target.classList.contains("plus")) {
    // Nếu nhấn vào nút cộng
    const index = parseInt(e.target.dataset.index); // Lấy giá trị index của sản phẩm trong giỏ hàng từ data-index của nút
    cart[index].quantity++; // Tăng số lượng sản phẩm đó lên 1
    saveCart(cart);
    renderCart();
  }

  // Giảm số lượng
  if (e.target.classList.contains("minus")) {
    // Nếu nhấn vào nút trừ
    const index = parseInt(e.target.dataset.index);
    if (cart[index].quantity > 1) {
      // Nếu giá trị > 1
      cart[index].quantity--; // Giảm số lượng sản phẩm đó xuống 1
      saveCart(cart);
      renderCart();
    }
  }

  // Xóa sản phẩm
  if (e.target.classList.contains("remove-btn")) {
    // Nếu nhấn vào nút xóa
    const index = parseInt(e.target.dataset.index);
    cart.splice(index, 1); // Xóa 1 phần tử khỏi giỏ hàng tại vị trí index
    saveCart(cart);
    renderCart();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  /* ----------------- INIT ----------------- */
  renderCart();
  updateCartCount();
  /* ----------------- BUTTON HANDLERS ----------------- */
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
