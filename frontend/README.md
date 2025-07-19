# McDonald's Clone Frontend

## Description
This is the frontend application for the McDonald's Clone project, built with React and Vite.

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Environment Variables Setup:
- Copy the `.env.example` file to create a new `.env` file:
```bash
cp .env.example .env
```

3. Configure your environment variables in the `.env` file:
```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:5001

# Google Maps API Key (required for the store locator feature)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Development

To start the development server:
```bash
npm run dev
# or
yarn dev
```

## Build

To create a production build:
```bash
npm run build
# or
yarn build
```

## Features
- Interactive Menu
- Cart Management
- Order Processing
- Store Location Information
- User Authentication
- Responsive Design

## Important Notes
- Ensure all environment variables are properly set before starting the application
- The backend server must be running for the application to work properly