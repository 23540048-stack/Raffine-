// Click vào sản phẩm sẽ chuyển sang trang chi tiết sản phẩm

document.addEventListener("DOMContentLoaded", function () {
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      if (id) {
        // Chuyển sang trang chi tiết sản phẩm
        window.location.href = `product-detail-page.html?id=${id}`;
      }
    });
  });
});
