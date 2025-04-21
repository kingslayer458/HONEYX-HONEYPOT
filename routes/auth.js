const express = require('express');
const router = express.Router();
const { verifyLogin } = require('../middleware/auth');

router.get('/login', (req, res) => {
  const error = req.session.loginError;
  req.session.loginError = null;
  res.send(`
    <!DOCTYPE html>
    <html lang='en'>
    <head>
      <meta charset='UTF-8'>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'>
      <title>Login - Honeypot</title>
      <link rel='stylesheet' href='/login.css'>
    </head>
    <body>
      <div class='login-container'>
        <h2>Honeypot Login</h2>
        ${error ? `<div class='error'>${error}</div>` : ''}
        <form method='POST'>
          <label for='username'>Username</label>
          <input id='username' name='username' placeholder='Username' autocomplete='username' required />
          <label for='password'>Password</label>
          <input id='password' name='password' placeholder='Password' type='password' autocomplete='current-password' required />
          <button type='submit'>Login</button>
        </form>
      </div>
      <script src='/login.js'></script>
    </body>
    </html>
  `);
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (await verifyLogin(username, password)) {
    req.session.authenticated = true;
    res.redirect('/dashboard');
  } else {
    res.redirect('/login?error=1');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
