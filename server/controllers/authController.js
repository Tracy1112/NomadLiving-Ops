/**
 * Authentication Controller
 * 
 * Handles user registration, login, and logout operations.
 * Implements secure password hashing, JWT token generation, and HTTP-only cookies.
 * 
 * @module controllers/authController
 */

import { StatusCodes } from 'http-status-codes'
import User from '../models/UserModel.js'
import { hashPassword, comparePassword } from '../utils/passwordUtils.js'
import { UnauthenticatedError } from '../errors/customErrors.js'
import { createJWT } from '../utils/tokenUtils.js'

/**
 * Register a new user
 * First user becomes admin, subsequent users are regular users.
 * Password is hashed before storage.
 * 
 * @async
 * @function register
 * @param {Object} req - Express request object
 * @param {Object} req.body - User registration data (name, email, password, lastName, location)
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with created user (password excluded)
 */
export const register = async (req, res) => {
  // First account becomes admin, others are regular users
  const isFirstAccount = (await User.countDocuments()) === 0
  req.body.role = isFirstAccount ? 'admin' : 'user'
  
  // Hash password before storing
  const hashedPassword = await hashPassword(req.body.password)
  req.body.password = hashedPassword
  
  // Create user in database
  const user = await User.create(req.body)

  res.status(StatusCodes.CREATED).json({ msg: 'user created', user })
}

/**
 * Authenticate user and create JWT token
 * Validates email and password, then issues a JWT token stored in HTTP-only cookie.
 * 
 * @async
 * @function login
 * @param {Object} req - Express request object
 * @param {Object} req.body - Login credentials (email, password)
 * @param {Object} res - Express response object
 * @throws {UnauthenticatedError} If credentials are invalid
 * @returns {Promise<Object>} JSON response with user data
 */
export const login = async (req, res) => {
  // Find user by email
  const user = await User.findOne({ email: req.body.email })
  
  // Verify password
  const isValidUser =
    user && (await comparePassword(req.body.password, user.password))
  if (!isValidUser) throw new UnauthenticatedError('invalid credentials')

  // Create JWT token
  const token = createJWT({ userId: user.id, role: user.role })

  // Set HTTP-only cookie with token (secure in production)
  const oneDay = 1000 * 60 * 60 * 24
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    path: '/', // Ensure cookie is available for all paths
  }
  
  // For production (cross-origin), use SameSite=None and Secure=true
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.sameSite = 'None'
    cookieOptions.secure = true // Required for SameSite=None
    // Don't set domain - let browser handle it for cross-origin
  } else {
    cookieOptions.sameSite = 'Strict'
    cookieOptions.secure = false
  }
  
  res.cookie('token', token, cookieOptions)
  
  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Cookie set with options:', {
      httpOnly: cookieOptions.httpOnly,
      sameSite: cookieOptions.sameSite,
      secure: cookieOptions.secure,
      path: cookieOptions.path,
    })
  }

  res.status(StatusCodes.OK).json({ msg: 'user logged in', user })
}

/**
 * Logout user by clearing authentication cookie
 * 
 * @function logout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response confirming logout
 */
export const logout = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now()),
    path: '/', // Ensure cookie is cleared for all paths
  }
  
  // For production (cross-origin), use SameSite=None and Secure=true
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.sameSite = 'None'
    cookieOptions.secure = true // Required for SameSite=None
  } else {
    cookieOptions.sameSite = 'Strict'
    cookieOptions.secure = false
  }
  
  res.cookie('token', 'logout', cookieOptions)
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}
