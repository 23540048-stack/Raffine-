// =============== HIỂN THỊ ORDER ===============
const orderId = localStorage.getItem("lastOrderId") || "N/A";
document.getElementById("order-id").textContent = orderId;

// Lấy danh sách sản phẩm đã mua (được lưu tạm khi bấm Payment)
const orderItems = JSON.parse(localStorage.getItem("lastOrderItems")) || [];

const tbody = document.getElementById("order-body");
const totalEl = document.getElementById("order-total");

let total = 0;
if (orderItems.length === 0) {
  tbody.innerHTML =
    "<tr><td colspan='5' style='padding:20px;'>No items found.</td></tr>";
} else {
  orderItems.forEach((item) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" width="80">
    </td>
    <td>${item.name}</td>
            <td>Size ${item.size}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${subtotal.toFixed(2)}</td>
          `;
    tbody.appendChild(row);
  });
}
totalEl.textContent = `$${total.toFixed(2)}`;

// =============== NÚT TIẾP TỤC MUA ===============
document.getElementById("continue-btn").addEventListener("click", () => {
  window.location.href = "index.html";
});
