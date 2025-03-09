
const API_URL = "https://your-backend.onrender.com/api/auth"; // Replace this with your live backend URL from Render



function showSignup() {
    document.querySelector(".container").style.display = "none";
    document.getElementById("signupContainer").style.display = "block";
}

function showLogin() {
    document.querySelector(".container").style.display = "block";
    document.getElementById("signupContainer").style.display = "none";
}

// Signup Function
function signup() {
    const name = document.getElementById("signupName").value.trim();
    const mobile = document.getElementById("signupMobile").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    // ✅ Check if fields are empty
    if (!name || !mobile || !password) {
        alert("All fields are required!");
        return;
    }

    // ✅ Validate mobile number (10 digits)
    if (!/^\d{10}$/.test(mobile)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    // ✅ Validate password (at least 6 characters)
    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    // Proceed with API call only if validation passes
    fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile, password })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.success) {  // ✅ Use success flag instead of message check
            showLogin();
        }
    })
    .catch(error => console.error("Error:", error));
}


// Login Function
function login() {
    const mobile = document.getElementById("loginMobile").value;
    const password = document.getElementById("loginPassword").value;

    fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Login successful") {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "dashboard.html";
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error("Error:", error));
}
