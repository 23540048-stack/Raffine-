// =============== ORDER ===============
const orderId = localStorage.getItem("lastOrderId") || "N/A"; // Lấy mã đơn hàng từ localStorage (nếu không có thì để "N/A")

document.getElementById("order-id").textContent = orderId; // Hiển thị mã đơn hàng lên HTML

const orderItems = JSON.parse(localStorage.getItem("lastOrderItems")) || []; // Lấy danh sách sản phẩm đã mua (được lưu tạm khi bấm Payment)
const tbody = document.getElementById("order-body"); // Trỏ tới tbody của bảng hiển thị sản phẩm đã mua
const totalEl = document.getElementById("order-total"); // Trỏ tới element hiển thị tổng tiền đơn hàng

let total = 0;

if (orderItems.length === 0) {
  tbody.innerHTML =
    "<tr><td colspan='5' style='padding:20px;'>No items found.</td></tr>";
} else {
  orderItems.forEach((item) => {
    const subtotal = item.price * item.quantity; // Tính tổng của từng item = giá * số lượng
    total += subtotal;

    const row = document.createElement("tr"); // Tạo hàng <tr> mới để hiển thị item
    row.innerHTML = `

            <td><img src="${item.image}" alt="${item.name}" width="80">

    </td>

    <td>${item.name}</td>

            <td>Size ${item.size}</td>

            <td>$${item.price.toFixed(2)}</td>

            <td>${item.quantity}</td>

            <td>$${subtotal.toFixed(2)}</td>

          `;

    tbody.appendChild(row); // Thêm vào tbody
  });
}

totalEl.textContent = `$${total.toFixed(2)}`;

// =============== CONTINUE SHOPPING ===============
document.getElementById("continue-btn").addEventListener("click", () => {
  window.location.href = "index.html";
});
