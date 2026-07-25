# Samy Locks - MERN Stack Project

Samy Locks is a comprehensive web application designed for a hair salon specializing in dreadlocks. The platform manages services, appointments, orders, and a gallery of work.

## 🚀 Project Overview

The project is structured as a monorepo with separate `client` and `server` directories, supporting a clean separation between the React frontend and the Node.js/Express backend.

## 📁 Project Structure

```text
Draedlocks/
├── client/          # React + Vite Frontend
├── server/          # Node.js + Express Backend
└── README.md        # This file
```

## 🛠 Technology Stack

### Frontend (`/client`)
- **Core**: React 18, Vite
- **Routing**: React Router DOM (v6)
- **State & Data**: Axios (API requests)
- **UI & Animation**: Framer Motion, Lucide React (Icons)
- **Form Handling**: React Select, React Datepicker
- **Feedback**: React Hot Toast
- **Localization**: i18next (Internationalization)
- **SEO**: React Helmet Async

## 📱 Core Modules & Pages

### Public Pages
- **Home**: Welcome page with service highlights and branding.
- **Services**: Detailed catalog of dreadlock services offered.
- **Gallery**: Visual showcase of past work/portfolio.
- **Shop (E-commerce)**:
    - **Products**: Catalog of hair care products and accessories.
    - **Checkout**: Secure checkout process for product orders.
- **Booking**: Interactive appointment scheduling system.
- **Contact**: Reach out via message form.

### Admin Dashboard (Protected)
- **Dashboard**: Overview of business performance.
- **Appointments**: Manage and track salon bookings.
- **Orders**: View and process customer product orders.
- **Product Management**: Create and edit products and categories.
- **Service Management**: Define and update service offerings.
- **Gallery Management**: Upload and organize work photos.
- **Inbox**: Manage messages received via the contact form.
- **Global Settings**: Configure business details and site-wide options.

### Backend (`/server`)
- **Core**: Node.js, Express
- **Database**: MongoDB (via Mongoose)
- **Security**: Helmet, Express-Rate-Limit, CORS, bcryptjs
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Multer, Cloudinary
- **Validation**: Joi
- **Logging**: Morgan

## ⚙️ Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- MongoDB (Local or Atlas)
- Cloudinary Account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Draedlocks
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   # Create a .env file based on existing config
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   # Create a .env file (VITE_API_URL, etc.)
   npm run dev
   ```

### Environment Variables

#### Server (`server/.env`)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for token signing
- `CLIENT_URL`: URL of the frontend
- `CLOUDINARY_CLOUD_NAME`: Cloudinary configuration
- `CLOUDINARY_API_KEY`: Cloudinary configuration
- `CLOUDINARY_API_SECRET`: Cloudinary configuration

#### Client (`client/.env`)
- `VITE_API_URL`: URL of the backend API

## 📜 Available Scripts

### Server
- `npm run dev`: Starts the server with nodemon
- `npm start`: Starts the server in production mode
- `npm run seed:admin`: Scripts to seed initial admin data

### Client
- `npm run dev`: Starts the Vite development server
- `npm run build`: Builds the production bundle
- `npm run lint`: Runs ESLint

## 🚀 Deployment

The project is configured for deployment on:
- **Frontend**: Netlify (see `client/netlify.toml`)
- **Backend**: Vercel (see `server/vercel.json`)
