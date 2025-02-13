const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/contact/', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER, // Gmailアカウント
            pass: process.env.GMAIL_PASS, // Gmailパスワード
        },
    });

    // Set up email data with unicode symbols
    let mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.TO_EMAIL, // 送信先のメールアドレス
        subject: 'Contact Form Message',
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'お問い合わせが送信されました。' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'お問い合わせの送信中にエラーが発生しました。' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});