const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors'); // For handling Cross-Origin Requests from your frontend
const nodemailer = require('nodemailer');
require('dotenv').config(); // To load environment variables from .env file

const app = express();
const port = 3001; // You can choose a different port

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Enable CORS for all routes (in a production environment, you would restrict this)
app.use(cors());

// Connect to the SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database('./patient_data.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create the patients table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS patients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER NOT NULL,
                village TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
});

// POST endpoint to add a new patient
app.post('/api/patients', (req, res) => {
    const { name, age, village } = req.body;
    if (!name || !age || !village) {
        return res.status(400).json({ error: 'Name, age, and village are required.' });
    }

    db.run('INSERT INTO patients (name, age, village) VALUES (?, ?, ?)', [name, age, village], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, name, age, village });
    });
});

// GET endpoint to retrieve all patients
app.get('/api/patients', (req, res) => {
    db.all('SELECT id, name, age, village FROM patients ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// PUT endpoint to update a patient by ID
app.put('/api/patients/:id', (req, res) => {
    const id = req.params.id;
    const { name, age, village } = req.body;
    if (!name || !age || !village) {
        return res.status(400).json({ error: 'Name, age, and village are required.' });
    }

    db.run('UPDATE patients SET name = ?, age = ?, village = ? WHERE id = ?', [name, age, village, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: `Patient with ID ${id} not found.` });
        }
        res.json({ id: parseInt(id), name, age, village });
    });
});

// DELETE endpoint to delete a patient by ID
app.delete('/api/patients/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM patients WHERE id = ?', id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: `Patient with ID ${id} not found.` });
        }
        res.json({ message: `Patient with ID ${id} deleted successfully.` });
    });
});

// Nodemailer setup (configure with your email service provider details in .env)
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // e.g., 'Gmail', 'Outlook'
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
});

// POST endpoint to send a message via email
app.post('/api/send-message', async (req, res) => {
    const { name, phone, email, message } = req.body;

    if (!name || !phone || !message) {
        return res.status(400).json({ error: 'Name, phone, and message are required.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender's email
        to: 'itakarlapalli.subcentre@health.gov.in', // Recipient's email
        subject: `New Message from Website - ${name}`,
        text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email || 'Not provided'}\nMessage:\n${message}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: 'Failed to send message. Please try again later.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});