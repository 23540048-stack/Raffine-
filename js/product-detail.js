/* ==================== GLOBALS ==================== */
let productId;
// ==================== CART FUNCTIONS ====================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id, size, qty = 1) {
  const product = products[id];
  if (!product) return;

  let cart = getCart();
  const existing = cart.find((item) => item.id === id && item.size === size);

  if (existing) {
    existing.quantity += qty;
  } else {
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
  alert(`${product.name} (size ${size}) has been added to your cart!`);
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.querySelector(".cart-count");
  if (cartBadge) cartBadge.textContent = total;
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

  // ---------- Update product info ----------
  document.querySelector(".product-info h2").textContent = product.name;
  document.querySelector(".product-price").textContent = "$" + product.price;
  document.querySelector(".main-image img").src = product.images[0];
  document.querySelector(".main-image img").alt = product.name;

  // ---------- Update title ----------
  let titleContent = product.name;
  document.title = `${titleContent} | RAFFINE`;

  // ---------- Update tabs ----------
  document.getElementById("description").querySelector("p").textContent =
    product.description || "";
  document.getElementById("sizefit").querySelector("p").textContent =
    product.sizefit || "";
  document.getElementById("contact").querySelector("p").textContent =
    product.contact || "";
  document.getElementById("delivery").querySelector("p").textContent =
    product.delivery || "";

  // ---------- Thumbnails ----------
  const thumbContainer = document.querySelector(".thumbnail-list");
  thumbContainer.innerHTML = "";
  product.images.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = product.name;
    if (i === 0) img.classList.add("active");
    thumbContainer.appendChild(img);
  });

  // ---------- Sizes ----------
  const sizeContainer = document.querySelector(".size-buttons");
  sizeContainer.innerHTML = "";
  (product.sizes || ["S", "M", "L", "XL"]).forEach((s) => {
    const btn = document.createElement("button");
    btn.textContent = s;
    sizeContainer.appendChild(btn);
  });

  // ---------- Related products ----------
  const relatedList = document.querySelector(".related-list");
  relatedList.innerHTML = "";
  (product.related || []).forEach((relId) => {
    const rel = products[relId];
    if (rel) {
      const card = document.createElement("div");
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
  if (e.target.tagName === "IMG") {
    const mainImage = document.querySelector(".main-image img");
    mainImage.src = e.target.src;

    document
      .querySelectorAll(".thumbnail-list img")
      .forEach((img) => img.classList.remove("active"));
    e.target.classList.add("active");
  }
});

// Tabs click
document.querySelector(".tab-buttons").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab-btn");
  if (!btn) return;

  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  const tabId = btn.dataset.tab;
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
document.querySelector(".add-to-cart").addEventListener("click", () => {
  // 1. Lấy Kích thước (Size)
  const selectedSize = document.querySelector(
    ".size-buttons button.selected"
  )?.textContent;

  if (!selectedSize) {
    alert("Please select a size before adding to cart!");
    return;
  }

  // 2. Lấy ID sản phẩm (Sử dụng biến toàn cục đã được loadProduct gán)
  if (!productId) {
    alert("Error: Product ID not found.");
    return;
  }

  // 3. Số lượng mặc định là 1
  const defaultQuantity = 1;

  // 4. Gọi hàm thêm vào giỏ hàng
  addToCart(productId, selectedSize, defaultQuantity);

  // 5. Cập nhật số đếm trên biểu tượng giỏ hàng (nếu có)
  updateCartCount();
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

/* ==================== INITIALIZE ==================== */
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  productId = params.get("id") || "lazy-top";
  loadProduct(productId);
  updateCartCount();
});

/* ==================== HANDLE BACK/FORWARD ==================== */
window.addEventListener("popstate", () => {
  const id =
    new URLSearchParams(window.location.search).get("id") || "lazy-top";
  loadProduct(id);
});
