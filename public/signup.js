const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!fullName || !username || !email || !password) {
        alert("Please fill all fields.");
        return;
    }

    try {
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName,
                username,
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Account Created Successfully");
            window.location.href = "index.html";
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error(error);
        alert("❌ Server Error");
    }
});