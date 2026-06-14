require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");

const app = express();

// =============================
// Create HTTP Server
// =============================
const server = http.createServer(app);

// =============================
// Socket.IO
// =============================
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// =============================
// Online Users
// =============================
const onlineUsers = {};

// =============================
// Middleware
// =============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// =============================
// MongoDB Connection
// =============================
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
    })
    .catch((err) => {
        console.log("❌ MongoDB Connection Error:", err.message);
    });

// =============================
// Routes
// =============================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// =============================
// Socket.IO Events
// =============================
io.on("connection", (socket) => {

    console.log("🟢 User Connected:", socket.id);

    // =========================
    // Join
    // =========================
    socket.on("join", (userId) => {

        onlineUsers[userId] = socket.id;

        console.log("Online Users:", onlineUsers);

        io.emit("onlineUsers", Object.keys(onlineUsers));

    });

    // =========================
    // Send Message
    // =========================
    socket.on("sendMessage", (data) => {

        console.log("📩 Message:", data);

        const receiverSocket = onlineUsers[data.receiver];

        if (receiverSocket) {
            io.to(receiverSocket).emit("receiveMessage", data);
        }

        socket.emit("receiveMessage", data);

    });

    // =========================
    // Typing
    // =========================
    socket.on("typing", (data) => {

        const receiverSocket = onlineUsers[data.receiver];

        if (receiverSocket) {
            io.to(receiverSocket).emit("typing", data);
        }

    });

    // =========================
    // Stop Typing
    // =========================
    socket.on("stopTyping", (data) => {

        const receiverSocket = onlineUsers[data.receiver];

        if (receiverSocket) {
            io.to(receiverSocket).emit("stopTyping");
        }

    });

    // =========================
    // Disconnect
    // =========================
    socket.on("disconnect", () => {

        console.log("🔴 User Disconnected:", socket.id);

        for (const userId in onlineUsers) {

            if (onlineUsers[userId] === socket.id) {

                delete onlineUsers[userId];

                io.emit("onlineUsers", Object.keys(onlineUsers));

                break;

            }

        }

    });

});

// =============================
// Start Server
// =============================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);

});