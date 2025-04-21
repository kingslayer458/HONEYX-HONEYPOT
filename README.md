# HONEYX-HONEYPOT

A Node.js-based honeypot and analytics platform designed to attract, log, and analyze attacker behavior. Includes fake file traps, API endpoints for analytics, and an optional modern dashboard UI.

---

## Features
- **Fake File Traps**: Serve fake config, DB, and backup files to lure attackers and log their activity.
- **API Endpoints**: Analytics endpoints for timeline, ports, protocol breakdown, etc.
- **Export Logs**: Download logs as JSON or CSV.
- **Authentication**: Session-based login for the dashboard.
- **Modern UI (Optional)**: Responsive dashboard with charts and maps (if enabled).
- **Code Quality**: ESLint integration and secure environment variable management.

---

## Project Structure
```
honeypot/
├── public/                # Frontend assets (HTML, CSS, JS)
├── routes/                # Express route handlers
├── middleware/            # Express middleware (auth, logging, etc.)
├── utils/                 # Utilities (logger, helpers)
├── .env                   # Environment variables (not committed)
├── .gitignore
├── .eslintrc.json
├── package.json
└── index.js               # Main server entry point
```

---

## Setup & Usage
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Set environment variables:**
   - Copy `.env.example` to `.env` and fill in required values.
3. **Run the server:**
   ```sh
   npm start
   ```
4. **Access features:**
   - Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - Login: [http://localhost:3000/login](http://localhost:3000/login)
   - API endpoints: `/api/dashboard/*`
   - Fake files: `/config`, `/db`, `/backup.zip`
   - Export logs: `/export/json`, `/export/csv`

---

## Security & Best Practices
- **Never commit secrets!** Use `.env` for sensitive config.
- **Logs and .env are gitignored by default.**
- **Use strong admin credentials** for dashboard access.

---

## Development
- **Lint code:**
  ```sh
  npm run lint
  ```
- **Contributions welcome!**

---

## License
MIT
