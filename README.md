# Blood Donation Management System

A fully functional web application for managing blood donations with TypeScript backend and basic HTML frontend.

## Features

- **Donor Management**: Register, view, edit, and delete donors
- **Recipient Management**: Register, view, edit, and delete recipients
- **Institution Setup**: Register blood banks and hospitals
- **Donation Recording**: Log blood donations and link them to blood banks
- **Blood Inventory Search**: Search for available blood by type, location, and expiration date
- **Full CRUD Operations**: Create, Read, Update, Delete for all entities

## Technology Stack

- **Frontend**: Basic HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Driver**: node-postgres (pg)

## Project Structure

```
db-project/
├── src/
│   ├── server.ts         # Express server with all API routes
│   └── database.ts       # PostgreSQL connection pool
├── public/
│   ├── index.html        # Home page
│   ├── donor_form.html   # Donor registration
│   ├── recipient_form.html
│   ├── institution_setup_form.html
│   ├── record_donation_form.html
│   ├── search_form.html
│   ├── donors.html       # View/Edit/Delete donors
│   ├── recipients.html   # View/Edit/Delete recipients
│   └── styles.css        # Minimal styling
├── schema.sql            # PostgreSQL database schema
├── .env                  # Environment variables (Supabase connection)
├── package.json
└── tsconfig.json
```

## Setup Instructions

### Install modules

```bash
npm install
```

### Run the Application

**Development mode** (with auto-reload):
```bash
npm run dev
```

### Set the password in .env
