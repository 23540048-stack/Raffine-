/* Nhấp vào nút create account sẽ chuyển sang trang home với trạng thái đăng nhập*/
document.getElementById("signup-form").addEventListener("submit", function (e) {
  e.preventDefault(); // ngăn reload

  const username = document.getElementById("new-username").value.trim();
  const password = document.getElementById("new-password").value.trim();

  if (username === "" || password === "") {
    alert("Please fill in all fields");
    return;
  }

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("username", username);

  window.location.href = "index.html";
});
/* Nhấp vào biểu tượng con mắt sẽ hiện/ẩn password*/
const togglePassword = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
});
