// header-footer.js
(function () {
  /* ==================== HEADER MENU ==================== */
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  const menuItems = document.querySelectorAll(".menu-item");
  const submenus = document.querySelectorAll(".submenu");
  const searchInput = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-btn");
  const searchResults = document.querySelector(".search-results");

  /* Mở / đóng menu chính */
  menuToggle.addEventListener("click", () => {
    menu.classList.toggle("active");
    submenus.forEach((s) => s.classList.remove("active")); // ẩn hết submenu khi đóng
  });

  /* Hiển thị submenu khi nhấn */
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      const submenuId = item.dataset.submenu;
      submenus.forEach((s) => {
        if (s.id === submenuId) {
          s.classList.toggle("active");
        } else {
          s.classList.remove("active");
        }
      });
    });
  });

  const productsData = {
    // ... (Products Data)
    "lazy-top": {
      id: "lazy-top",
      name: "Lazy-top",
      price: 40.0,
      images: ["images/lazy-top.jpg"],
    },
    // ... (Các sản phẩm khác)
  };

  /* Lọc sản phẩm */
  function filterSearch(query) {
    if (!query) return [];
    return Object.values(productsData).filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  /* Hiển thị kết quả search */
  function showResults(results) {
    // ... (Logic hiển thị kết quả)
    searchResults.innerHTML = "";
    if (results.length === 0) {
      searchResults.style.display = "none";
      return;
    }

    results.forEach((p) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${p.images[0]}" alt="${p.name}">
        <div class="item-info">
          <span class="item-name">${p.name}</span>
          <span class="item-price">${p.price}$</span>
        </div>
      `;

      /* Khi click → chuyển tới product-detail.html?id=<id> */
      li.addEventListener("click", () => {
        window.location.href = `product-detail.html?id=${p.id}`;
      });

      searchResults.appendChild(li);
    });

    searchResults.style.display = "block";
  }

  /* Lắng nghe input */
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    const results = filterSearch(query);
    showResults(results);
  });

  /* Click nút search */
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return;
    const results = filterSearch(query);
    showResults(results);
  });

  /* Click ra ngoài → ẩn kết quả */
  document.addEventListener("click", (e) => {
    if (!document.querySelector(".search-box").contains(e.target)) {
      searchResults.style.display = "none";
    }
  });

  /* Login */
  window.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const username = localStorage.getItem("username");

    const loginLink = document.querySelector("#login-cart a");

    if (isLoggedIn === "true" && loginLink) {
      // Đổi icon login thành avatar
      loginLink.innerHTML = `
        <img src="images/Account info.png" alt="${
          username || "User"
        }" width="28" height="28" style="border-radius:50%;" />
      `;
      loginLink.href = "#"; // không dẫn đi đâu nữa khi đã đăng nhập
      loginLink.title = `Hello, ${username || "User"}`;
    }

    // Nếu người dùng click avatar → đăng xuất
    loginLink?.addEventListener("click", (e) => {
      if (localStorage.getItem("isLoggedIn") === "true") {
        e.preventDefault(); // tránh điều hướng nếu có
        if (confirm("Sign out?")) {
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("username");
          location.reload();
        }
      }
    });
  });

  /* ==================== FOOTER LANGUAGE MENU ==================== */
  // ... (Code xử lý Language Menu hiện tại)

  document.addEventListener("DOMContentLoaded", () => {
    // 1. Lấy các phần tử cần thiết
    const toggleButtons = document.querySelectorAll(".language-toggle"); // Cả nút text và nút dấu >
    const menu = document.querySelector(".language-menu");
    const menuItems = document.querySelectorAll(".language-menu li");
    const currentLangDisplay = document.querySelector(".current-lang");

    // --- Chức năng 1: Toggle Menu (Ẩn/Hiện) ---
    const toggleMenu = () => {
      const isShown = menu.classList.toggle("show");

      // Cập nhật trạng thái aria cho cả hai nút
      toggleButtons.forEach((btn) => {
        btn.setAttribute("aria-expanded", isShown);
      });
    };

    // Gán sự kiện click cho cả hai nút (text và dấu >)
    toggleButtons.forEach((btn) => {
      btn.addEventListener("click", toggleMenu);
    });

    // --- Chức năng 2 & 3: Lựa chọn ngôn ngữ và thay đổi text nút ---
    menuItems.forEach((item) => {
      item.addEventListener("click", function () {
        const selectedLangCode = this.getAttribute("data-lang");

        // A. Cập nhật menu xổ ra (in đậm)
        menuItems.forEach((i) => i.classList.remove("active"));
        this.classList.add("active");

        // B. Cập nhật text ngôn ngữ hiện tại (ENG/VN)
        if (currentLangDisplay) {
          currentLangDisplay.textContent = selectedLangCode;
        }

        // C. Đóng menu sau khi chọn
        menu.classList.remove("show");
        toggleButtons.forEach((btn) => {
          btn.setAttribute("aria-expanded", false);
        });
      });
    });

    // Đóng menu nếu click ra ngoài
    document.addEventListener("click", (e) => {
      const wrapper = document.querySelector(".footer-text3");
      if (
        wrapper &&
        !wrapper.contains(e.target) &&
        menu.classList.contains("show")
      ) {
        menu.classList.remove("show");
        toggleButtons.forEach((btn) => {
          btn.setAttribute("aria-expanded", false);
        });
      }
    });
  });
})(); // KẾT THÚC IIFE
