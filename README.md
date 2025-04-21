# HONEYX-HONEYPOT

<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version 1.0.0">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License MIT">
  <img src="https://img.shields.io/badge/node-%3E%3D%2014.0.0-brightgreen.svg" alt="Node >= 14.0.0">
</div>

<p align="center">A sophisticated Node.js-based honeypot and threat intelligence platform with a Netflix-inspired dashboard UI for real-time attack visualization and analysis.</p>

<p align="center">🍯 Trap attackers | 📊 Visualize threats | 🔔 Get alerts | 🛡️ Enhance security</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Dashboard](#-dashboard)
- [API Endpoints](#-api-endpoints)
- [Fake Traps](#-fake-traps)
- [Security Considerations](#-security-considerations)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

HONEYX-HONEYPOT is a comprehensive honeypot solution designed to attract, log, and analyze potential attackers. It provides a modern, Netflix-inspired dashboard for real-time monitoring and analysis of attack patterns. The system includes fake file traps, detailed logging, and alerting capabilities to help security professionals understand threat landscapes and improve defensive strategies.

---

## ✨ Features

### Core Functionality
- **Honeypot Traps**: Multiple trap types to attract different kinds of attackers
- **Real-time Logging**: Detailed logging of all interactions with the honeypot
- **Geolocation**: IP-based geolocation of attack origins
- **Threat Intelligence**: Integration with threat intelligence sources

### Advanced Dashboard
- **Netflix-inspired UI**: Modern, responsive design with dark mode support
- **Real-time Visualizations**: Interactive charts and maps showing attack data
- **Attack Timeline**: Chronological view of attack events
- **Top Attackers**: Identification of most persistent threat actors
- **Attack Type Analysis**: Breakdown of attack methodologies
- **Geographical Mapping**: Visual representation of attack origins
- **Mobile Responsive**: Fully functional on all device sizes

### Security Features
- **Authentication System**: Secure login for dashboard access
- **Alert System**: Email notifications for significant events
- **Data Export**: Export logs in JSON or CSV format
- **IP Blocking**: Automatic or manual blocking of malicious IPs

### Trap Types
- **Fake Configuration Files**: Simulated config files to attract attackers
- **Fake Database Dumps**: Seemingly valuable database exports
- **Fake Credentials**: Honeytokens that trigger alerts when used
- **Fake API Endpoints**: Simulated vulnerable endpoints
- **Fake Backup Archives**: Seemingly important backup files

---

## 🛠 Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualization**: Chart.js, Leaflet.js
- **Database**: JSON-based file storage (easily extendable to MongoDB)
- **Authentication**: Session-based with bcrypt password hashing
- **Notifications**: Email (SMTP), SMS (optional)
- **Geolocation**: IP-based location tracking

---

## 📥 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

### Clone and Install

```bash
# Clone the repository
git clone https://github.com/kingslayer458/HONEYX-HONEYPOT.git
cd HONEYX-HONEYPOT

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration
```

---

## ⚙️ Configuration

### Environment Variables

Edit the `.env` file with your specific configuration:

```env
# Server Configuration
PORT=3000                          # Port to run the server on
SESSION_SECRET=your_secret_here    # Secret for session management
ADMIN_EMAIL=admin@example.com      # Admin email for login and alerts
ADMIN_PASSWORD=your_password_here  # Admin password for dashboard access
ADMIN_PHONE=+1234567890            # Admin phone for SMS alerts (optional)

# Email Configuration (for alerts)
SMTP_USER=your_email@gmail.com     # SMTP username
SMTP_PASS=your_app_password        # SMTP password or app password

# Optional Services
# TWILIO_ACCOUNT_SID=your_sid      # For SMS alerts (optional)
# TWILIO_AUTH_TOKEN=your_token     # For SMS alerts (optional)
# TWILIO_PHONE=+1234567890         # For SMS alerts (optional)

# Threat Intelligence
SHODAN_API_KEY=your_shodan_key     # For enriching attacker data (optional)
```

### Security Recommendations

- Use a strong, unique `SESSION_SECRET`
- Set a complex `ADMIN_PASSWORD` (min. 12 characters with mixed case, numbers, symbols)
- Use app-specific passwords for email services
- Consider running behind a reverse proxy for production deployments

---

## 🚀 Usage

### Starting the Server

```bash
# Development mode
npm start

# With nodemon (auto-restart on changes)
npm run dev
```

### Accessing the Dashboard

1. Navigate to `http://localhost:3000/login`
2. Log in with the admin credentials set in your `.env` file
3. Access the dashboard at `http://localhost:3000/dashboard`

### Deployment Considerations

- For production, consider using PM2 or similar process manager
- Set up proper firewall rules to allow incoming connections
- Consider using a reverse proxy like Nginx for SSL termination

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start index.js --name honeyx-honeypot
```

---

## 📊 Dashboard

The Netflix-inspired dashboard provides a comprehensive view of honeypot activity:

### Main Features

- **Attack Timeline**: Chronological visualization of attack events
- **Attack Map**: Geographic representation of attack origins
- **Attack Types**: Pie chart showing distribution of attack methodologies
- **Top Attackers**: Bar chart of most persistent threat actors
- **Live Feed**: Real-time stream of recent attack events
- **Dark/Light Mode**: Toggle between viewing modes
- **Mobile Responsive**: Fully functional on all device sizes

### Dashboard Controls

- **Refresh Button**: Manually update dashboard data
- **Time Range Selector**: Filter data by time period
- **Export Options**: Download logs in JSON or CSV format
- **Settings Panel**: Configure dashboard preferences

---

## 🔌 API Endpoints

### Dashboard Data Endpoints

```
GET /api/dashboard/timeline      # Attack timeline data
GET /api/dashboard/typepie       # Attack type distribution
GET /api/dashboard/topattackers  # Most active attackers
GET /api/dashboard/mappoints     # Geolocation data for map
GET /api/dashboard/livefeed      # Recent attack events
GET /api/dashboard/topports      # Most targeted ports
GET /api/dashboard/protopie      # Protocol distribution
```

### Export Endpoints

```
GET /export/json                 # Export all logs as JSON
GET /export/csv                  # Export all logs as CSV
```

### Authentication Endpoints

```
GET  /login                      # Login page
POST /login                      # Process login
GET  /logout                     # Log out
```

---

## 🪤 Fake Traps

HONEYX-HONEYPOT includes various fake resources to attract attackers:

### File Traps

- `/config` - Fake configuration files with seemingly sensitive information
- `/db` - Fake database dumps with synthetic data
- `/backup.zip` - Fake backup archive

### API Traps

- `/api/users` - Fake user data API
- `/api/system` - Fake system information API

### Web Traps

- `/admin` - Fake admin portal
- `/phpmyadmin` - Fake database administration tool

All interactions with these traps are logged with detailed information including:
- IP address
- User agent
- Timestamp
- Geographic location (if available)
- Request details

---

## 🔒 Security Considerations

### Protecting Your Deployment

- **Never expose admin credentials** in code or public repositories
- **Regularly rotate passwords** and API keys
- **Monitor logs** for unusual activity
- **Keep dependencies updated** to patch security vulnerabilities

### Legal Considerations

- Ensure deployment complies with local laws regarding honeypots
- Consider adding a banner notification about monitoring
- Do not store personally identifiable information unnecessarily

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">Made with ❤️ by <a href="https://github.com/kingslayer458">kingslayer458</a></p>
