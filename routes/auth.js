const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

//
// ======================
// Signup
// ======================
//
router.post("/signup", async (req, res) => {

    try {

        const { fullName, username, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "User already exists"
            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({

            fullName,
            username,
            email,
            password: hashedPassword

        });

        await user.save();

        res.status(201).json({

            success: true,
            message: "Account created successfully"

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

});

//
// ======================
// Login
// ======================
//
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({

                success: false,
                message: "Invalid Email"

            });

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(400).json({

                success: false,
                message: "Invalid Password"

            });

        }

        const token = jwt.sign(

            { id: user._id },

            process.env.JWT_SECRET,

            { expiresIn: "7d" }

        );

        res.status(200).json({

            success: true,

            message: "Login Successful",

            token,

            user: {

                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email

            }

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

});

module.exports = router;