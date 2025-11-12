document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault(); // chặn form reload

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Giả lập kiểm tra — ở đây bạn có thể thêm điều kiện thật nếu có backend
  if (username === "" || password === "") {
    alert("Please fill in both username and password.");
    return;
  }

  // Lưu trạng thái đăng nhập vào localStorage
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("username", username);

  // Chuyển sang trang home
  window.location.href = "index.html";
});
/* Nhấp vào biểu tượng con mắt sẽ hiện/ẩn password và thay đổi icon */
const togglePassword = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");

// 1. Lấy phần tử icon

const eyeIcon = document.getElementById("eye-icon");

togglePassword.addEventListener("click", () => {
  // Thay đổi loại input (password <-> text)
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;

  // 2. Thay đổi class của icon dựa trên trạng thái hiện tại
  if (type === "text") {
    // Nếu password đang HIỆN (text), đổi icon thành gạch chéo (slash)
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  } else {
    // Nếu password đang ẨN (password), đổi icon thành con mắt mở (eye)
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  }
});
