const API_URL = "https://your-actual-backend-url.onrender.com/api/auth"; // Replace with your actual backend URL

// Show Signup
function showSignup() {
    document.querySelector(".container").style.display = "none";
    document.getElementById("signupContainer").style.display = "block";
}

// Show Login
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
        if (data.message === "User registered successfully") {  // Check for success message from backend
            showLogin();
        }
    })
    .catch(error => console.error("Error:", error));
}

// Login Function
function login() {
    const mobile = document.getElementById("loginMobile").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    // ✅ Check if fields are empty
    if (!mobile || !password) {
        alert("Both fields are required!");
        return;
    }

    // Proceed with API call if validation passes
    fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Login successful") {
            // Store the token and user info in localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect to dashboard after successful login
            window.location.href = "dashboard.html";
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred during login.");
    });
}
