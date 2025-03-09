// Ensure the user is logged in
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
        alert("User not logged in. Redirecting...");
        window.location.href = "/";
        return;
    }

    // Display user's name
    document.getElementById("userName").innerText = user.name;

    // Load expenses
    loadExpenses();
});

// ✅ Function to Load Expenses
function loadExpenses() {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch(`http://localhost:5000/api/expenses/${user.id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch expenses");
            }
            return response.json();
        })
        .then(expenses => {
            console.log("Expenses received:", expenses); // Debugging Log

            const expenseList = document.getElementById("expenseList");
            expenseList.innerHTML = ""; // Clear previous data

            let totalExpense = 0; // ✅ Reset total

            if (!expenses || expenses.length === 0) {
                expenseList.innerHTML = "<tr><td colspan='4'>No expenses found</td></tr>";
            } else {
                expenses.forEach(expense => {
                    const row = `<tr>
                        <td>${expense.type}</td>
                        <td>₹${parseFloat(expense.amount).toFixed(2)}</td>
                        <td>${new Date(expense.date_time).toLocaleString()}</td>
                        <td>${expense.transaction_type}</td>
                    </tr>`;
                    expenseList.innerHTML += row;

                    // ✅ Fix Total Expense Calculation
                    const expenseAmount = parseFloat(expense.amount);
                    if (expense.transaction_type.toLowerCase() === "debit") {
                        totalExpense += expenseAmount; // Add debits to total
                    } else {
                        totalExpense -= expenseAmount; // Subtract credits
                    }
                });
            }

            // ✅ Display the correct total expense
            document.getElementById("totalExpense").innerText = `₹${totalExpense.toFixed(2)}`;
        })
        .catch(error => {
            console.error("Error fetching expenses:", error);
            alert("Failed to load expenses.");
        });
}

// ✅ Function to Add Expense
function addExpense() {
    const user = JSON.parse(localStorage.getItem("user"));

    const type = document.getElementById("expenseType").value;
    const amount = document.getElementById("expenseAmount").value;
    const date_time = document.getElementById("expenseDate").value;
    const transaction_type = document.getElementById("transactionType").value;

    if (!type || !amount || !date_time || !transaction_type) {
        alert("Please fill all fields!");
        return;
    }

    const expenseData = {
        user_id: user.id,
        type,
        amount,
        date_time,
        transaction_type
    };

    console.log("Sending Expense Data:", expenseData); // Debugging Log

    fetch("http://localhost:5000/api/expenses/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(expenseData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to add expense");
        }
        return response.json();
    })
    .then(data => {
        console.log("Response from Server:", data); // Debugging Log
        alert(data.message);

        // ✅ Clear input fields after adding expense
        document.getElementById("expenseAmount").value = "";
        document.getElementById("expenseDate").value = "";

        // ✅ Reload expenses after adding
        loadExpenses();
    })
    .catch(error => {
        console.error("Error adding expense:", error);
        alert("Failed to add expense.");
    });
}

// ✅ Function to Logout
function logout() {
    localStorage.removeItem("user");
    window.location.href = "/";
}

// Attach logout function to button click
document.getElementById("logoutBtn").addEventListener("click", logout);
