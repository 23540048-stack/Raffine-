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
          // Nếu submenu hiện tại có id trùng với submenuId của item được click
          s.classList.toggle("active"); // Toggle class 'active' (nếu đang ẩn thì hiện, nếu đang hiện thì ẩn)
        } else {
          s.classList.remove("active"); // Còn các submenu khác thì luôn ẩn
        }
      });
    });
  });

  /* Lọc sản phẩm */
  function filterSearch(query) {
    if (!query) return []; // Nếu ô tìm kiếm rỗng → trả về mảng rỗng (không hiển thị kết quả)
    return Object.values(products).filter(
      (
        p // Lấy tất cả sản phẩm từ object "products" và lọc theo tên
      ) => p.name.toLowerCase().includes(query.toLowerCase()) // Chuyển tên sản phẩm và từ khóa về chữ thường để so sánh không phân biệt hoa/thường
    );
  }

  /* Hiển thị kết quả search */
  function showResults(results) {
    searchResults.innerHTML = ""; // Xóa kết quả cũ
    if (results.length === 0) {
      const li = document.createElement("li"); // Tạo một dòng <li> để thông báo "không tìm thấy"
      li.classList.add("no-result");
      li.textContent = "Sorry, we couldn't find any products!";
      searchResults.appendChild(li);
      return;
    }

    results.forEach((p) => {
      const li = document.createElement("li"); // Tạo một phần tử <li> để chứa từng sản phẩm trong kết quả tìm kiếm
      li.innerHTML = `
        <img src="${p.images[0]}" alt="${p.name}">
        <div class="item-info">
          <span class="item-name">${p.name}</span>
          <span class="item-price">${p.price}$</span>
        </div>
      `;

      /* Khi click → chuyển tới product-detail-page.html?id=<id> */
      li.addEventListener("click", () => {
        window.location.href = `product-detail-page.html?id=${p.id}`;
      });

      searchResults.appendChild(li);
    });

    searchResults.style.display = "block";
  }

  /* Lắng nghe input */
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim(); // Lấy nội dung người dùng nhập vào, đồng thời loại bỏ khoảng trắng đầu/cuối
    const results = filterSearch(query); // Gọi hàm filterSearch để lọc danh sách sản phẩm theo từ khóa
    showResults(results); // Hiển thị các kết quả tìm kiếm ra UI
  });

  /* Click nút search */
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim(); // Lấy từ khóa trong ô input, đồng thời loại bỏ khoảng trắng dư
    if (!query) return; // Nếu ô tìm kiếm trống thì không làm gì cả
    const results = filterSearch(query); // Lọc danh sách sản phẩm theo từ khóa
    showResults(results);
  });

  /* Click ra ngoài → ẩn kết quả */
  document.addEventListener("click", (e) => {
    if (!document.querySelector(".search-box").contains(e.target)) {
      // Nếu phần tử được click không nằm bên trong .search-box
      searchResults.style.display = "none"; // Ẩn kết quả tìm kiếm
    }
  });

  /* Login */
  window.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // Lấy trạng thái đăng nhập và tên người dùng từ localStorage
    const username = localStorage.getItem("username");

    const loginLink = document.querySelector("#login-cart a"); // Lấy phần tử <a> trong khu vực #login-cart

    if (isLoggedIn === "true" && loginLink) {
      // Nếu người dùng đã đăng nhập và phần tử loginLink tồn tại
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
      // Gắn sự kiện click cho loginLink (avatar) nếu tồn tại
      if (localStorage.getItem("isLoggedIn") === "true") {
        // Chỉ xử lý khi người dùng đang đăng nhập
        e.preventDefault(); // tránh điều hướng nếu có
        if (confirm("Sign out?")) {
          localStorage.removeItem("isLoggedIn"); // Xóa trạng thái đăng nhập và username khỏi localStorage
          localStorage.removeItem("username");
          location.reload(); // Reload lại trang để cập nhật giao diện
        }
      }
    });
  });

  /* ==================== FOOTER LANGUAGE MENU ==================== */

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
        const selectedLangCode = this.getAttribute("data-lang"); // Lấy giá trị ngôn ngữ được gán trong thuộc tính data-lang của item

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
