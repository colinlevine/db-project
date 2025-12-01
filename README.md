# Blood Donation Management System

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Run the Application

**Development mode** (with auto-reload):
```bash
npm run dev
```

### 3. Set the password in .env

Edit the `.env` file and replace the password placeholder:

```env
SUPABASE_PASSWORD=<your-password-here>
```

## Technology Stack

- **Frontend**: Basic HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL)

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


