// server.js - Backend for Itakarlapalli Sub Centre
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer'); // Import Nodemailer

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'patients.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ensure data file exists
async function ensureDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify([]));
    }
}

// Read patients data
async function readPatientsData() {
    await ensureDataFile();
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading patient data:", error);
        throw error; // Re-throw the error to be caught by the route handler
    }
}

// Write patients data
async function writePatientsData(data) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing patient data:", error);
        throw error; // Re-throw the error
    }
}

// Create a transporter object using Nodemailer
const transporter = nodemailer.createTransport({
    // Configure your email service here
    service: 'Gmail', // Example: Use Gmail.  Change to your provider.
    auth: {
        user: 'your_email@gmail.com', // Your email address.  Change this.
        pass: 'your_email_password' // Your email password or App Password.  Change this.
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('Itakarlapalli Backend Server is running.');
});

// API routes
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await readPatientsData();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve patients data' });
    }
});

app.post('/api/patients', async (req, res) => {
    const { name, age, village } = req.body;
    if (!name || !age || !village) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const patients = await readPatientsData();
        const newPatient = { id: Date.now(), name, age, village };
        patients.push(newPatient);
        await writePatientsData(patients);

        // Send email notification (Moved inside try block)
        try {
            const mailOptions = {
                from: 'your_email@gmail.com', // Sender address
                to: 'recipient_email@example.com', // Recipient address(es)
                subject: 'New Patient Data Entry',
                text: `A new patient data entry has been submitted:\n\nName: ${newPatient.name}\nAge: ${newPatient.age}\nVillage: ${newPatient.village}`
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);

        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Consider if you want to fail the whole operation or just log the email error
        }

        res.status(201).json(newPatient);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add patient' });
    }
});

app.put('/api/patients/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, village } = req.body;
    if (!name || !age || !village) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const patients = await readPatientsData();
        const index = patients.findIndex(p => p.id === parseInt(id));
        if (index === -1) return res.status(404).json({ error: 'Patient not found' });

        patients[index] = { ...patients[index], name, age, village };
        await writePatientsData(patients);
        res.json(patients[index]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update patient' });
    }
});

app.delete('/api/patients/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const patients = await readPatientsData();
        const updated = patients.filter(p => p.id !== parseInt(id));
        if (updated.length === patients.length) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        await writePatientsData(updated);
        res.json({ message: 'Patient deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete patient' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    ensureDataFile().catch(console.error);
});
