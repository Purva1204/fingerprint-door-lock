
// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'purva@2006',
    database: 'fingerprint_auth'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

app.post('/register', async (req, res) => {
    const { userId, credential } = req.body;
    try {
        const hashedFingerprint = await bcrypt.hash(JSON.stringify(credential), 10);
        const query = 'INSERT INTO users (phoneNumber, hashedFingerprint) VALUES (?, ?)';
        db.query(query, [userId, hashedFingerprint], (err, result) => {
            if (err) {
                res.status(500).json({ message: 'Failed to register user' });
            } else {
                res.json({ message: 'User registered successfully' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error hashing fingerprint' });
    }
});

app.post('/verify', async (req, res) => {
    const { userId, credential } = req.body;
    const query = 'SELECT hashedFingerprint FROM users WHERE phoneNumber = ?';
    db.query(query, [userId], async (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Failed to verify user' });
        } else if (results.length > 0) {
            const isMatch = await bcrypt.compare(JSON.stringify(credential), results[0].hashedFingerprint);
            if (isMatch) {
                // Trigger the door unlock
                try {
                    const unlockResponse = await axios.post('http://your-esp32-ip/unlock', {
                        userId: userId
                    });
                    res.json({ message: 'Fingerprint verified and door unlocked successfully' });
                } catch (unlockError) {
                    res.status(500).json({ message: 'Fingerprint verified but failed to unlock the door' });
                }
            } else {
                res.json({ message: 'Fingerprint verification failed' });
            }
        } else {
            res.json({ message: 'User not found' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});