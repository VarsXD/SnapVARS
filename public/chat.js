// ==========================
// Socket Connection
// ==========================

const socket = io();

const token = localStorage.getItem("token");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    alert("Please login first.");
    window.location.href = "index.html";
}

// ==========================
// HTML Elements
// ==========================

const usersDiv = document.getElementById("users");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const chatUser = document.getElementById("chatUser");
const status = document.getElementById("status");
const searchUser = document.getElementById("searchUser");

let selectedUser = null;
let users = [];

// ==========================
// Join Socket
// ==========================

socket.emit("join", currentUser.id);

// ==========================
// Load Users
// ==========================

async function loadUsers() {

    try {

        const res = await fetch("/api/users");

        users = await res.json();

        displayUsers(users);

    } catch (err) {

        console.log(err);

    }

}

// ==========================
// Display Users
// ==========================

function displayUsers(userList) {

    usersDiv.innerHTML = "";

    userList.forEach(user => {

        // Don't show yourself
        if (user._id === currentUser.id) return;

        const div = document.createElement("div");

        div.className = "user";

        div.innerHTML = `
            <div class="avatar">
                ${user.fullName.charAt(0).toUpperCase()}
            </div>

            <div class="info">
                <h4>${user.fullName}</h4>
                <p>${user.email}</p>
            </div>
        `;

        div.addEventListener("click", () => {

            selectedUser = user;

            chatUser.innerText = user.fullName;

            status.innerText = "Online";

            messagesDiv.innerHTML = "";

            loadMessages();

        });

        usersDiv.appendChild(div);

    });

}

loadUsers();

// ==========================
// Search Users
// ==========================

searchUser.addEventListener("keyup", () => {

    const value = searchUser.value.toLowerCase();

    const filtered = users.filter(user =>

        user.fullName.toLowerCase().includes(value) ||

        user.email.toLowerCase().includes(value)

    );

    displayUsers(filtered);

});

// ==========================
// Load Chat History
// ==========================

async function loadMessages() {

    if (!selectedUser) return;

    try {

        const response = await fetch(
            `/api/messages/${currentUser.id}/${selectedUser._id}`
        );

        const chats = await response.json();

        messagesDiv.innerHTML = "";

        chats.forEach(msg => {

            displayMessage(msg);

        });

        scrollToBottom();

    } catch (err) {

        console.log(err);

    }

}

// ==========================
// Display Message
// ==========================

function displayMessage(msg) {

    const div = document.createElement("div");

    const isMine = msg.sender === currentUser.id ||
                   msg.sender._id === currentUser.id;

    div.className = isMine
        ? "message sent"
        : "message received";

    div.innerHTML = `
        <div class="bubble">
            ${msg.message}
        </div>
    `;

    messagesDiv.appendChild(div);

}

// ==========================
// Auto Scroll
// ==========================

function scrollToBottom() {

    messagesDiv.scrollTop = messagesDiv.scrollHeight;

}

// ==========================
// Send Button
// ==========================

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        sendMessage();

    }

});

// ==========================
// Send Message
// ==========================

async function sendMessage() {

    if (!selectedUser) {

        alert("Please select a user.");

        return;

    }

    const text = messageInput.value.trim();

    if (text === "") return;

    const msg = {

        sender: currentUser.id,
        receiver: selectedUser._id,
        message: text

    };

    try {

        // Save message in MongoDB
        await fetch("/api/messages", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(msg)

        });

        // Send via Socket.IO
        socket.emit("sendMessage", {

            sender: currentUser.id,
            receiver: selectedUser._id,
            senderName: currentUser.fullName,
            message: text

        });

        // Show immediately
        displayMessage({

            sender: currentUser.id,
            message: text

        });

        scrollToBottom();

        messageInput.value = "";

        messageInput.focus();

    } catch (err) {

        console.log(err);

        alert("Message could not be sent.");

    }

}

// ==========================
// Receive Messages
// ==========================

socket.on("receiveMessage", (data) => {

    // Agar current chat user hi sender hai
    if (
        selectedUser &&
        data.sender === selectedUser._id
    ) {

        displayMessage({
            sender: data.sender,
            message: data.message
        });

        scrollToBottom();

    }

});

// ==========================
// Connection Status
// ==========================

socket.on("connect", () => {

    console.log("🟢 Connected:", socket.id);

});

socket.on("disconnect", () => {

    console.log("🔴 Disconnected");

});