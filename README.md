# User Management System

A full-stack application for managing user data, featuring CSV import, pagination, sorting, and search capabilities.

## Features

- **CSV Import**: Easily upload user data from CSV files.
- **Data Visualization**: View users in a paginated, sortable table.
- **Search**: Robust search functionality across multiple fields.
- **Responsive Design**: Modern, glassmorphism-inspired UI that works on desktop and mobile.
- **Deployment**: Configured for deployment on Render.

## Tech Stack

- **Frontend**: React, standard CSS (no external UI libraries).
- **Backend**: Node.js, Express, MongoDB.
- **Database**: MongoDB Atlas.

## Setup

1. **Clone the repository**
2. **Install Dependencies**:

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the `server` directory with:

   ```env
   MONGODB_URI=mongodb+srv://adityasaditya19_db_user:assesment123@assesment.vqha8g5.mongodb.net/?appName=assesment
   PORT=5000
   ```

4. **Run Locally**:
   - Start Server: `cd server && npm start`
   - Start Client: `cd client && npm start`

## Deployment

The application is configured to be deployed on Render.

- **Frontend URL**: `https://assessment-5xpn.onrender.com`
