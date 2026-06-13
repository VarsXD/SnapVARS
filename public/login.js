const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem("token", data.token);
            localStorage.setItem("currentUser", JSON.stringify(data.user));

            alert("✅ Login Successful");

            window.location.href = "chat.html";

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("❌ Server Error");

    }

});