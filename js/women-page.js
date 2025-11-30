document.addEventListener("DOMContentLoaded", () => {
  // 1. Lấy tất cả các khối filter-item (Sort, Color, Size, Sale)
  const filterItems = document.querySelectorAll(".filter-item");

  filterItems.forEach((item) => {
    const toggleButton = item.querySelector(".filter-toggle"); // Lấy nút bấm (Sort / Color / Size / Sale)
    const dropdown = item.querySelector(".filter-dropdown"); // Lấy menu dropdown tương ứng

    if (toggleButton && dropdown) {
      // === A. Xử lý sự kiện mở/đóng dropdown ===

      toggleButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài (lên document)

        const isVisible = dropdown.style.display === "block"; // Kiểm tra dropdown hiện tại đang mở hay đóng

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
// Phân trang sản phẩm, lấy tất cả các sản phẩm, xác định số sản phẩm/trang và tổng số trang
document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.querySelector(".product-grid"); // Lấy container chứa tất cả product cards
  const paginationNav = document.getElementById("pagination"); // Lấy navigation phân trang (nút PREV / NEXT)
  const pageIndicator = document.getElementById("page-indicator"); // Lấy thẻ hiển thị "Page X of Y"

  const productsPerPage = 9; //Ví dụ 1 trang có 9 sản phẩm
  // Lấy tất cả sản phẩm dưới dạng array
  const allProducts = Array.from(
    productsContainer.querySelectorAll(".product-card")
  );
  const totalProducts = allProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage); // Tổng số trang = làm tròn lên
  let currentPage = 1;

  // --- 1. Hàm Hiển thị Sản phẩm cho Trang Hiện tại (Không thay đổi) ---
  function displayProducts(page) {
    currentPage = page; // Cập nhật lại trang hiện tại
    const start = (page - 1) * productsPerPage; // Tính vị trí bắt đầu của sản phẩm trong trang
    const end = page * productsPerPage; // Vị trí kết thúc

    // Duyệt tất cả sản phẩm và ẩn/hiện theo từng trang
    allProducts.forEach((product, index) => {
      product.style.display = index >= start && index < end ? "block" : "none";
    });

    updatePaginationButtons();
    updatePageIndicator();
  }

  // --- 2. Hàm Tạo và Cập nhật Nút Phân trang ---
  function updatePaginationButtons() {
    paginationNav.innerHTML = ""; // Xóa các nút cũ

    // Nút Previous
    const prevButton = createPaginationButton("<", currentPage > 1);
    prevButton.addEventListener("click", () => {
      // Chỉ cho phép chuyển trang nếu chưa ở trang 1
      if (currentPage > 1) {
        displayProducts(currentPage - 1);
      }
    });
    paginationNav.appendChild(prevButton); // Thêm nút PREV vào thanh phân trang

    // Các nút số trang
    for (let i = 1; i <= totalPages; i++) {
      const button = createPaginationButton(i, true); // Tạo nút có chữ là số trang. true = luôn enable
      if (i === currentPage) {
        button.classList.add("active"); // Đánh dấu trang hiện tại
      }
      button.addEventListener("click", () => displayProducts(i)); // Khi bấm vào một số trang bất kỳ
      paginationNav.appendChild(button); // Thêm nút vào thanh phân trang
    }

    // Nút Next
    // createPaginationButton(text, isEnabled), isEnabled = true khi currentPage < totalPages
    const nextButton = createPaginationButton(">", currentPage < totalPages);
    nextButton.addEventListener("click", () => {
      // Chỉ cho bấm khi chưa ở trang cuối cùng
      if (currentPage < totalPages) {
        displayProducts(currentPage + 1);
      }
    });
    paginationNav.appendChild(nextButton);
  }

  // --- 3. Hàm Tạo nút HTML ---
  function createPaginationButton(text, isClickable) {
    const button = document.createElement("a"); // Tạo thẻ <a> làm nút phân trang
    button.href = "#";
    button.textContent = text;
    button.classList.add("page-link"); // Thêm class chung cho tất cả các nút phân trang

    if (!isClickable) {
      button.classList.add("disabled");
      button.removeAttribute("href");
    }
    return button; // Trả về đối tượng nút đã cấu hình xong
  }

  // --- 4. Cập nhật chỉ số trang ---
  function updatePageIndicator() {
    if (totalPages > 0) {
      pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    } else {
      pageIndicator.textContent = "No products found.";
    }
  }

  // --- 5. Khởi tạo Phân trang ---
  // Nếu tổng số sản phẩm > số sản phẩm mỗi trang thì cần phân trang
  if (totalProducts > productsPerPage) {
    updatePaginationButtons();
    displayProducts(1); // Hiển thị trang đầu tiên khi tải trang
  } else {
    paginationNav.style.display = "none";
    pageIndicator.textContent = "";
    allProducts.forEach((p) => (p.style.display = "block"));
  }
});

// Click vào sản phẩm sẽ chuyển sang trang chi tiết sản phẩm

document.addEventListener("DOMContentLoaded", function () {
  const productCards = document.querySelectorAll(".product-card.is-product");

  productCards.forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id"); // Lấy ID sản phẩm từ attribute data-id
      if (id) {
        // Chuyển sang trang chi tiết sản phẩm
        window.location.href = `product-detail-page.html?id=${id}`;
      }
    });
  });
});
