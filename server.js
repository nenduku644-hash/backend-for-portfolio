require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

/* FIXED FETCH FOR RENDER */

const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) =>
        fetch(...args)
    );

const app = express();

/* =====================================
   MIDDLEWARE
===================================== */

app.use(cors());

app.use(bodyParser.json());

/* =====================================
   MAIL CONFIGURATION
===================================== */

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 465,

    secure: true,

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    }

});

/* =====================================
   CONTACT API
===================================== */

app.post("/send", async (req, res) => {

    try {

        /* GET FORM DATA */

        const {

            name,
            email,
            phone,
            message

        } = req.body;

        console.log("FORM DATA:", req.body);

        /* =====================================
           EMAIL TEMPLATE
        ===================================== */

        const mailOptions = {

            from: process.env.EMAIL_USER,

            to: process.env.EMAIL_USER,

            subject: "🚀 New Portfolio Contact",

            html: `

                <div style="
                    font-family:Arial;
                    background:#0f172a;
                    color:white;
                    padding:30px;
                    border-radius:12px;
                ">

                    <h1 style="
                        color:#00ffff;
                        margin-bottom:25px;
                    ">
                        New Portfolio Contact
                    </h1>

                    <p style="font-size:18px;">
                        <b>👤 Name:</b> ${name}
                    </p>

                    <p style="font-size:18px;">
                        <b>📧 Email:</b> ${email}
                    </p>

                    <p style="font-size:18px;">
                        <b>📱 Phone:</b> ${phone}
                    </p>

                    <p style="font-size:18px;">
                        <b>💬 Message:</b>
                    </p>

                    <div style="
                        background:#111827;
                        padding:20px;
                        border-radius:10px;
                        margin-top:10px;
                        line-height:1.8;
                    ">

                        ${message}

                    </div>

                </div>

            `
        };

        /* =====================================
           SEND EMAIL
        ===================================== */

        await transporter.sendMail(mailOptions);

        console.log("EMAIL SENT SUCCESSFULLY");

        /* =====================================
           TELEGRAM MESSAGE
        ===================================== */

        const telegramMessage = `

🚀 NEW PORTFOLIO CONTACT

👤 Name: ${name}

📧 Email: ${email}

📱 Phone: ${phone}

💬 Message:
${message}

`;

        /* =====================================
           SEND TELEGRAM
        ===================================== */

        const telegramResponse = await fetch(

            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    chat_id: process.env.TELEGRAM_CHAT_ID,

                    text: telegramMessage

                })

            }

        );

        const telegramData =
            await telegramResponse.json();

        console.log(
            "TELEGRAM RESPONSE:",
            telegramData
        );

        /* =====================================
           SUCCESS RESPONSE
        ===================================== */

        res.status(200).json({

            message: "Message Sent Successfully 🚀"

        });

    }

    catch (error) {

        console.log("FULL ERROR:", error);

        res.status(500).json({

            message: "Failed To Send Message"

        });

    }

});

/* =====================================
   HOME ROUTE
===================================== */

app.get("/", (req, res) => {

    res.send("Backend Server Running 🚀");

});

/* =====================================
   SERVER
===================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server Running On Port ${PORT}`);

});