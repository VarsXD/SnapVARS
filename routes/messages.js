const express = require("express");
const Message = require("../models/message");

const router = express.Router();

/*
==================================
Save Message
POST /api/messages
==================================
*/

router.post("/", async (req, res) => {

    try {

        const { sender, receiver, message } = req.body;

        const newMessage = new Message({

            sender,
            receiver,
            message

        });

        await newMessage.save();

        res.status(201).json({

            success: true,
            message: "Message Saved"

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Server Error"

        });

    }

});

/*
==================================
Get Chat History
GET /api/messages/:sender/:receiver
==================================
*/

router.get("/:sender/:receiver", async (req, res) => {

    try {

        const { sender, receiver } = req.params;

        const chats = await Message.find({

            $or: [

                {
                    sender,
                    receiver
                },

                {
                    sender: receiver,
                    receiver: sender
                }

            ]

        }).sort({

            createdAt: 1

        });

        res.json(chats);

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Server Error"

        });

    }

});

module.exports = router;