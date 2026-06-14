const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = form.querySelector('input[type="email"]').value.trim();
    const password = form.querySelector('input[type="password"]').value;

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

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

        if (!response.ok) {

            alert(data.message);

            return;

        }

        // Save JWT
        localStorage.setItem("token", data.token);

        // Save Logged In User
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        alert("Login Successful");

        window.location.href = "chat.html";

    } catch (err) {

        console.error(err);

        alert("Server Error");

    }

});