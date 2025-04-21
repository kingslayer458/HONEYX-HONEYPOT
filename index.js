require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const honeypotRoutes = require('./routes/honeypot');
const fakeFilesRoutes = require('./routes/fakefiles');
const dashboardRoutes = require('./routes/dashboard');
const shellRoutes = require('./routes/shell');
const uploadRoutes = require('./routes/upload');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const { scheduleReports } = require('./utils/reporter');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'honeypotsecret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Modular routes
app.use('/', honeypotRoutes);
app.use('/', fakeFilesRoutes);
app.use('/', dashboardRoutes);
app.use('/', shellRoutes);
app.use('/', uploadRoutes);
app.use('/', apiRoutes);
app.use('/', authRoutes);
app.use('/', require('./routes/central'));

// Deception: Randomize appearance
app.get('/', (req, res) => {
  const variants = [
    '<h1>Welcome to Company Portal</h1>',
    '<h1>Internal Management System</h1>',
    '<h1>Restricted Area</h1>'
  ];
  res.send(variants[Math.floor(Math.random() * variants.length)] + '<br><a href="/admin">Admin Login</a>');
});

app.use((req, res) => {
  res.status(404).send('<h2>404 Not Found</h2>');
});

// Start scheduled reports
scheduleReports();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Honeypot running on http://localhost:${PORT}/admin`);
});
