/* ==================== GLOBALS ==================== */
let productId;
// ==================== CART FUNCTIONS ====================

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || []; // Lấy giỏ hàng từ localStorage
}

// Lưu giỏ hàng vào localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart)); // Chuyển object/array thành chuỗi JSON và lưu vào localStorage
  updateCartCount(); // Cập nhật số lượng sản phẩm hiển thị
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(id, size, qty = 1) {
  const product = products[id];
  if (!product) return;

  let cart = getCart();
  const existing = cart.find((item) => item.id === id && item.size === size); // Kiểm tra xem sản phẩm cùng id và size đã có trong giỏ hàng chưa

  if (existing) {
    existing.quantity += qty; // Nếu đã có thì tăng số lượng
  } else {
    // Nếu chưa có thì tạo mới
    cart.push({
      id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size,
      quantity: qty,
    });
  }

  saveCart(cart);
}

// Cập nhật số lượng sản phẩm hiển thị trên icon giỏ hàng
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0); // Tính tổng số lượng sản phẩm trong giỏ, reduce() lặp qua từng item và cộng dồn quantity
  const cartBadge = document.querySelector(".cart-count"); // Lấy phần tử hiển thị số lượng giỏ hàng trên giao diện
  if (cartBadge) cartBadge.textContent = total; // Nếu phần tử tồn tại, cập nhật số lượng
}
document.addEventListener("DOMContentLoaded", updateCartCount);
/* ==================== LOAD PRODUCT ==================== */
function loadProduct(id) {
  productId = id;
  const product = products[id];
  if (!product) {
    document.querySelector("main").innerHTML =
      "<p style='text-align:center; padding:40px;'>Product not found.</p>";
    // Đặt tiêu đề lỗi nếu không tìm thấy sản phẩm
    document.title = "Product Not Found | RAFFINE";
    return;
  }

  // Update thông tin sản phẩm
  document.querySelector(".product-info h2").textContent = product.name;
  document.querySelector(".product-price").textContent = "$" + product.price;
  document.querySelector(".main-image img").src = product.images[0];
  document.querySelector(".main-image img").alt = product.name;

  // Update tiêu đề
  let titleContent = product.name;
  document.title = `${titleContent} | RAFFINE`;

  // Update tabs
  document.getElementById("description").querySelector("p").textContent =
    product.description || "";
  document.getElementById("sizefit").querySelector("p").textContent =
    product.sizefit || "";
  document.getElementById("contact").querySelector("p").textContent =
    product.contact || "";
  document.getElementById("delivery").querySelector("p").textContent =
    product.delivery || "";

  // Thumbnails
  const thumbContainer = document.querySelector(".thumbnail-list");
  thumbContainer.innerHTML = ""; // xóa ảnh cũ
  product.images.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = product.name;
    if (i === 0) img.classList.add("active"); // Nếu là ảnh đầu tiên → thêm class "active" để highlight
    thumbContainer.appendChild(img);
  });

  // Sizes
  const sizeContainer = document.querySelector(".size-buttons");
  sizeContainer.innerHTML = "";
  (product.sizes || ["S", "M", "L", "XL"]).forEach((s) => {
    // Lặp qua danh sách size của sản phẩm, Nếu product.sizes không tồn tại → dùng mặc định ["S", "M", "L", "XL"]
    const btn = document.createElement("button"); // Tạo một nút button mới cho mỗi size
    btn.textContent = s; // Gán text cho nút là size
    sizeContainer.appendChild(btn);
  });

  // Related products
  const relatedList = document.querySelector(".related-list");
  relatedList.innerHTML = "";
  // Lặp qua danh sách ID sản phẩm liên quan của sản phẩm hiện tại
  // Nếu product.related không tồn tại → dùng mảng rỗng []
  (product.related || []).forEach((relId) => {
    const rel = products[relId];
    if (rel) {
      const card = document.createElement("div"); // Tạo div cho mỗi sản phẩm liên quan
      card.className = "related-card";
      card.dataset.id = relId;
      card.innerHTML = `
        <img src="${rel.images[0]}" alt="${rel.name}" />
        <p>${rel.name}</p>
        <p>$${rel.price}</p>
      `;
      relatedList.appendChild(card);
    }
  });
}

/* ==================== EVENT DELEGATION ==================== */

// Thumbnail click
document.querySelector(".thumbnail-list").addEventListener("click", (e) => {
  // Chỉ xử lý khi click vào thẻ <img>
  if (e.target.tagName === "IMG") {
    const mainImage = document.querySelector(".main-image img"); // Lấy phần tử main image và đổi src theo thumbnail được click
    mainImage.src = e.target.src;

    document
      .querySelectorAll(".thumbnail-list img")
      .forEach((img) => img.classList.remove("active")); // Loại bỏ class "active" khỏi tất cả thumbnail
    e.target.classList.add("active"); // Thêm class "active" cho thumbnail vừa click để highlight
  }
});

// Tabs click
document.querySelector(".tab-buttons").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab-btn"); // Tìm nút .tab-btn gần nhất từ vị trí click
  if (!btn) return; // Nếu click không phải vào button tab thì dừng

  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  const tabId = btn.dataset.tab; // Lấy id tab cần hiển thị từ data-tab của nút
  document
    .querySelectorAll(".tab-content")
    .forEach((c) => c.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
});

// Size button click
document.querySelector(".size-buttons").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  document
    .querySelectorAll(".size-buttons button")
    .forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");
});
// Chọn/Bỏ chọn size
document.querySelector(".size-buttons").addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const btn = e.target;

    // Nếu nút đã active → bỏ active
    if (btn.classList.contains("active")) {
      btn.classList.remove("active");
    } else {
      // Bỏ active tất cả các nút khác
      document
        .querySelectorAll(".size-buttons button")
        .forEach((b) => b.classList.remove("active"));

      // Thêm active cho nút vừa bấm
      btn.classList.add("active");
    }
  }
});

/* ==================== ADD TO CART ==================== */
// --- KHAI BÁO BIẾN ---
const toastNotification = document.getElementById("toastNotification");
const toastMessage = document.getElementById("toastMessage");
let toastTimeout;

// --- HÀM HIỂN THỊ TOAST ---
function showToast(message, duration = 3000) {
  // 1. Gán nội dung
  toastMessage.textContent = message;

  // 2. Hiển thị
  toastNotification.style.display = "block";

  // 3. Reset bộ đếm cũ nếu người dùng bấm liên tục
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  // 4. Đếm ngược để ẩn đi
  toastTimeout = setTimeout(() => {
    toastNotification.style.display = "none";
  }, duration);
}

// --- SỰ KIỆN CLICK THÊM VÀO GIỎ ---
document.querySelector(".add-to-cart").addEventListener("click", () => {
  // 1. Lấy size
  const selectedSize = document.querySelector(
    ".size-buttons button.selected"
  )?.textContent;

  // Kiểm tra Size
  if (!selectedSize) {
    showToast("⚠️ Please select a size first!");
    return;
  }

  // Kiểm tra ID sản phẩm
  if (!productId) {
    showToast("❌ Error: Product ID not found.");
    return;
  }

  // Logic thêm giỏ hàng
  const defaultQuantity = 1;
  addToCart(productId, selectedSize, defaultQuantity);
  updateCartCount();

  // Thông báo thành công
  showToast("✅ Added to cart successfully!");
});
/* ==================== RELATED PRODUCT CLICK ==================== */
document.querySelector(".related-list").addEventListener("click", (e) => {
  const card = e.target.closest(".related-card");
  if (!card) return;

  const relId = card.dataset.id;
  if (relId) {
    loadProduct(relId);
    window.history.pushState(
      { id: relId },
      "",
      `product-detail.html?id=${relId}`
    );
  }
});

/* ==================== INIT ==================== */
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search); // Lấy tham số query string từ URL
  productId = params.get("id") || "lazy-top"; // Lấy giá trị 'id' từ URL, nếu không có thì dùng mặc định "lazy-top"
  loadProduct(productId);
  updateCartCount();
});

/* ==================== HANDLE BACK/FORWARD ==================== */
window.addEventListener("popstate", () => {
  //Lắng nghe sự kiện 'popstate' trên window
  const id =
    new URLSearchParams(window.location.search).get("id") || "lazy-top"; // Lấy giá trị 'id' từ URL hiện tại, nếu không có thì dùng mặc định "lazy-top"
  loadProduct(id);
});
