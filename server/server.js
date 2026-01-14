/**
 * NomadLiving Ops Console - Backend Server
 * 
 * Express.js REST API server for the NomadLiving Ops Console operations dashboard.
 * Handles API routes, authentication, database connections, and operational analytics.
 * 
 * Business Context: Internal operations dashboard for luxury glamping brand property
 * management, maintenance tracking, and vendor coordination across multiple sites.
 * 
 * @module server
 * @requires express
 * @requires mongoose
 * @requires dotenv
 */

import 'express-async-errors'
import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
const app = express()

import { readFile } from 'fs/promises'
import morgan from 'morgan'
import mongoose from 'mongoose'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import cors from 'cors'

import jobRouter from './routes/jobRouter.js'
import authRouter from './routes/authRouter.js'
import userRouter from './routes/userRouter.js'

import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js'
import { authenticateUser } from './middleware/authMiddleware.js'
import cookieParser from 'cookie-parser'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

import cloudinary from 'cloudinary'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Configure Cloudinary for image uploads
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

// Health check endpoint (for Render to keep service alive)
// Must be before other middleware to respond quickly
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Note: Static file serving removed - frontend is deployed separately on Vercel
// If you need to serve frontend from backend, uncomment the following:
// app.use(express.static(path.resolve(__dirname, '../client/dist')))

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean) // Remove undefined values

// Log allowed origins for debugging (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Allowed CORS origins:', allowedOrigins)
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL)
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        return callback(null, true)
      }
      
      // In production, check if origin is in allowed list
      if (process.env.NODE_ENV === 'production') {
        if (allowedOrigins.includes(origin)) {
          return callback(null, true)
        } else {
          console.error('CORS blocked origin:', origin)
          console.error('Allowed origins:', allowedOrigins)
          return callback(new Error('Not allowed by CORS'))
        }
      }
      
      // In development, allow all origins
      callback(null, true)
    },
    credentials: true, // Allow cookies to be sent with cross-origin requests
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
  })
)

// Trust proxy - Required for Render and other proxy services
// This allows Express to trust the X-Forwarded-* headers from the proxy
app.set('trust proxy', 1)

// Middleware
app.use(morgan('dev')) // HTTP request logger
app.use(express.json()) // Parse JSON request bodies
app.use(cookieParser()) // Parse cookies
app.use(helmet()) // Security headers
app.use(mongoSanitize()) // Prevent MongoDB injection attacks

// API Routes
app.use('/api/v1/jobs', authenticateUser, jobRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', authenticateUser, userRouter)

// Error handling middleware (must be after routes)
app.use(errorHandlerMiddleware)

// Note: SPA routing removed - frontend is deployed separately on Vercel
// If you need to serve frontend from backend, uncomment the following:
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'))
// })

// Server configuration
const port = process.env.PORT || 5100

/**
 * Starts the Express server and connects to MongoDB
 * Optimized for production with connection pooling and error handling
 * @async
 * @function startServer
 * @throws {Error} If MongoDB connection fails
 */
const startServer = async () => {
  try {
    // Validate MongoDB connection string
    const mongoUrl = process.env.MONGO_URL?.trim()
    if (!mongoUrl) {
      console.error('❌ MONGO_URL is not set or empty')
      console.error('Environment variables:', Object.keys(process.env).filter(k => k.includes('MONGO')))
      throw new Error('MONGO_URL environment variable is not set. Please check your .env file or environment variables.')
    }
    
    if (!mongoUrl.startsWith('mongodb://') && !mongoUrl.startsWith('mongodb+srv://')) {
      console.error('❌ Invalid MONGO_URL format')
      console.error('MONGO_URL value:', JSON.stringify(mongoUrl))
      console.error('MONGO_URL length:', mongoUrl.length)
      console.error('First 50 chars:', mongoUrl.substring(0, 50))
      throw new Error(
        `Invalid MONGO_URL format. Expected connection string to start with "mongodb://" or "mongodb+srv://".\n` +
        `Current value (first 50 chars): ${mongoUrl.substring(0, 50)}\n` +
        `Please check your .env file or Render environment variables.`
      )
    }

    // Optimize MongoDB connection for production
    const mongooseOptions = {
      // Connection pool settings
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain at least 2 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      // Connection retry settings
      retryWrites: true,
    }

    await mongoose.connect(mongoUrl, mongooseOptions)
    
    console.log('MongoDB connected successfully')
    
    // Start server after DB connection
    app.listen(port, () => {
      console.log(`Server running on PORT ${port}....`)
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
  }
}

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected')
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('MongoDB connection closed through app termination')
  process.exit(0)
})

startServer()
