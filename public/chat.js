const usersDiv = document.getElementById("users");

async function loadUsers() {

    try {

        const response = await fetch("/api/users");

        const users = await response.json();

        usersDiv.innerHTML = "";

        users.forEach(user => {

            usersDiv.innerHTML += `

            <div class="user">

                <div class="avatar">

                    ${user.fullName.charAt(0).toUpperCase()}

                </div>

                <div class="info">

                    <h4>${user.fullName}</h4>

                    <p>${user.email}</p>

                </div>

            </div>

            `;

        });

    } catch (err) {

        console.log(err);

    }

}

loadUsers();