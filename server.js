const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware om JSON-verzoeken te parseren
app.use(bodyParser.json());

// Endpoint voor het inloggen
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Controleer of het gebruikersbestand bestaat
    fs.readFile('users.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Er is een fout opgetreden bij het lezen van het gebruikersbestand' });
        }

        // Parse de inhoud van het bestand
        const users = data ? JSON.parse(data) : [];

        // Zoek naar de gebruiker in de lijst
        const foundUser = users.find(user => user.username === username && user.password === password);

        if (foundUser) {
            res.status(200).json({ message: 'Inloggen succesvol' });
        } else {
            res.status(401).json({ error: 'Ongeldige gebruikersnaam of wachtwoord' });
        }
    });
});

// Endpoint voor het registreren van gebruikers
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Controleer of het gebruikersbestand bestaat
    fs.readFile('users.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Er is een fout opgetreden bij het lezen van het gebruikersbestand' });
        }

        // Parse de inhoud van het bestand
        const users = data ? JSON.parse(data) : [];

        // Controleer of de gebruiker al bestaat
        const existingUser = users.find(user => user.username === username);

        if (existingUser) {
            return res.status(400).json({ error: 'Gebruiker bestaat al' });
        }

        // Voeg de nieuwe gebruiker toe aan de lijst
        users.push({ username, password });

        // Schrijf de bijgewerkte lijst terug naar het bestand
        fs.writeFile('users.txt', JSON.stringify(users), 'utf8', (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Er is een fout opgetreden bij het schrijven naar het gebruikersbestand' });
            }

            res.status(201).json({ message: 'Registratie succesvol' });
        });
    });
});

// Start de server
app.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
});
