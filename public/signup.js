const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = form.querySelector('input[type="text"]').value.trim();

    const username = form.querySelector("#username")
        ? form.querySelector("#username").value.trim()
        : "";

    const email = form.querySelector('input[type="email"]').value.trim();
    const password = form.querySelector('input[type="password"]').value;

    if (!fullName || !email || !password) {
        alert("Please fill all required fields.");
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

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Account created successfully!");

        window.location.href = "index.html";

    } catch (error) {
        console.error(error);
        alert("Server Error");
    }
});