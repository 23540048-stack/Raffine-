document.addEventListener("DOMContentLoaded", () => {
  // 1. Lấy tất cả các khối filter-item (Sort, Color, Size, Sale)
  const filterItems = document.querySelectorAll(".filter-item");

  filterItems.forEach((item) => {
    const toggleButton = item.querySelector(".filter-toggle");
    const dropdown = item.querySelector(".filter-dropdown");

    if (toggleButton && dropdown) {
      // === A. Xử lý sự kiện mở/đóng dropdown ===

      toggleButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài (lên document)

        const isVisible = dropdown.style.display === "block";

        // Đóng tất cả các dropdown khác trước khi mở cái mới
        document.querySelectorAll(".filter-dropdown").forEach((d) => {
          if (d !== dropdown) {
            d.style.display = "none";
          }
        });

        // Mở hoặc đóng dropdown hiện tại
        dropdown.style.display = isVisible ? "none" : "block";
      });

      // === B. Xử lý sự kiện chọn tùy chọn ===

      dropdown.querySelectorAll("li").forEach((option) => {
        option.addEventListener("click", (e) => {
          // Lấy text của tùy chọn được chọn (ví dụ: "Newest" hoặc "White")
          const selectedText = e.target.textContent.trim();

          // Lấy node đầu tiên của nút toggle (Đây thường là Text Node chứa "Sort", "Color", v.v...)
          const currentTextNode = toggleButton.childNodes[0];

          // Cập nhật text của nút toggle
          if (currentTextNode && currentTextNode.nodeType === 3) {
            // Thay thế text ban đầu bằng text đã chọn
            currentTextNode.textContent = selectedText + " ";
          } else {
            // Trường hợp nút toggle không có text node ở đầu, ta thêm text node mới
            const newTextNode = document.createTextNode(selectedText + " ");
            toggleButton.prepend(newTextNode);
          }

          // Đóng dropdown sau khi chọn
          dropdown.style.display = "none";
        });
      });
    }
  });

  // 2. Đóng tất cả dropdown khi click bất cứ đâu trên document
  document.addEventListener("click", () => {
    document.querySelectorAll(".filter-dropdown").forEach((dropdown) => {
      dropdown.style.display = "none";
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.querySelector(".product-grid");
  const paginationNav = document.getElementById("pagination");
  const pageIndicator = document.getElementById("page-indicator");

  // Giả định:
  const productsPerPage = 9;
  const allProducts = Array.from(
    productsContainer.querySelectorAll(".product-card")
  );
  const totalProducts = allProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  let currentPage = 1;

  // --- 1. Hàm Hiển thị Sản phẩm cho Trang Hiện tại (Không thay đổi) ---
  function displayProducts(page) {
    currentPage = page;
    const start = (page - 1) * productsPerPage;
    const end = page * productsPerPage;

    allProducts.forEach((product, index) => {
      product.style.display = index >= start && index < end ? "block" : "none";
    });

    updatePaginationButtons();
    updatePageIndicator();
  }

  // --- 2. Hàm Tạo và Cập nhật Nút Phân trang (ĐÃ SỬA) ---
  function updatePaginationButtons() {
    paginationNav.innerHTML = ""; // Xóa các nút cũ

    // Nút Previous (Sử dụng '<')
    const prevButton = createPaginationButton("<", currentPage > 1); // Đã đổi "Previous" thành '<'
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        displayProducts(currentPage - 1);
      }
    });
    paginationNav.appendChild(prevButton);

    // Các nút số trang
    for (let i = 1; i <= totalPages; i++) {
      const button = createPaginationButton(i, true);
      if (i === currentPage) {
        button.classList.add("active"); // Đánh dấu trang hiện tại
      }
      button.addEventListener("click", () => displayProducts(i));
      paginationNav.appendChild(button);
    }

    // Nút Next (Sử dụng '>')
    const nextButton = createPaginationButton(">", currentPage < totalPages); // Đã đổi "Next" thành '>'
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        displayProducts(currentPage + 1);
      }
    });
    paginationNav.appendChild(nextButton);
  }

  // --- 3. Hàm Tạo nút HTML (Không thay đổi) ---
  function createPaginationButton(text, isClickable) {
    const button = document.createElement("a");
    button.href = "#";
    button.textContent = text;
    button.classList.add("page-link");

    if (!isClickable) {
      button.classList.add("disabled");
      button.removeAttribute("href");
    }
    return button;
  }

  // --- 4. Cập nhật chỉ số trang (Không thay đổi) ---
  function updatePageIndicator() {
    if (totalPages > 0) {
      pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    } else {
      pageIndicator.textContent = "No products found.";
    }
  }

  // --- 5. Khởi tạo Phân trang (Không thay đổi) ---
  if (totalProducts > productsPerPage) {
    updatePaginationButtons();
    displayProducts(1); // Hiển thị trang đầu tiên khi tải trang
  } else {
    paginationNav.style.display = "none";
    pageIndicator.textContent = "";
    allProducts.forEach((p) => (p.style.display = "block"));
  }
});
