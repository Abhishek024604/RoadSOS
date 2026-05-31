# RoadSOS

RoadSOS is a full-stack web application designed to help users quickly discover and navigate to nearby emergency services such as hospitals, clinics, mechanics, and police stations. It integrates with Google Maps Platform to provide accurate location data, routing, and real-time mapping functionality.

## Features

- **Live Location Tracking**: Automatically detects and updates the user's current location.
- **Nearby Services**: Instantly find essential services (Hospitals, Mechanics, Police, etc.) near you.
- **Interactive Map**: Built with Google Maps for rich interactivity and dynamic markers.
- **Route Calculation**: Get distance and directions to selected emergency services.
- **Search & Filter**: Powerful search capabilities to filter services by category or name.

## Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS, Zustand (State Management), React Query, Framer Motion
- **Backend**: Node.js, Express.js, Mongoose (MongoDB)
- **APIs**: Google Maps API (Places, Directions, Geocoding)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- A Google Cloud account with the Google Maps Platform enabled (Places API, Directions API, Maps JavaScript API).

## Onboarding & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Abhishek024604/RoadSOS.git
cd RoadSOS
```

### 2. Install dependencies

Since this project uses a monorepo-style structure where both frontend and backend share the root `package.json`, you only need to install dependencies once at the root level:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add your API keys and configuration:

```env
# Server Configuration
PORT=4000
MONGODB_URI=your_mongodb_connection_string

# Google Maps API Keys
# VITE_ prefix is required for the frontend to access the key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 4. Running the Application

You need to run both the frontend development server and the backend Express server.

**Start the Backend Server:**
```bash
npm run server
```
*The API will run on http://127.0.0.1:4000*

**Start the Frontend App:**
```bash
npm run dev
```
*The app will typically run on http://127.0.0.1:5173*

## Project Structure

- `/src`: Contains the React frontend code (Components, Pages, Features, Hooks).
- `/server`: Contains the Node.js/Express backend API (Controllers, Routes, Services, Models).
- `/public`: Static assets.

## Scripts

- `npm run dev`: Starts the Vite development server for the frontend.
- `npm run build`: Builds the frontend for production.
- `npm run server`: Starts the backend Express server.
- `npm run preview`: Previews the production build locally.

## License

This project is open-source and available for educational and personal use.
