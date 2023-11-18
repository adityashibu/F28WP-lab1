const express = require('express');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const hbs = exphbs.create();
const bcrypt = require('bcrypt');
const saltRounds = 10;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

app.get('/', (req, res) => {
    pool.query('SELECT * FROM users', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.render('home', {title: 'Home', data: result});
    });
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('DB not connecting');
            }

            res.redirect('/');
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error hashing password');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        pool.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("DB not connecting");
            }

            if (result.length > 0) {
                const hashedPassword = result[0].password;
                const match = await bcrypt.compare(password, hashedPassword);

                if (match) {
                    res.redirect('/profile');
                } else {
                    res.send('<script>alert("Incorrect credentials Entered"); window.location.href = "/";</script>');
                }
            } else {
                res.send('<script>alert("Incorrect credentials Entered"); window.location.href = "/";</script>');
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error comparing passwords");
    }
});

app.get('/profile', (req, res) => {
    res.render('profile', {title: 'Profile Page'});
});

app.get('/register', (req, res) => {
    res.render('register', {title: 'Registration Page'});
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});