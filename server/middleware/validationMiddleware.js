import { body, param, validationResult } from 'express-validator'
import mongoose from 'mongoose'
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/customErrors.js'
import { JOB_TYPE, JOB_STATUS, TICKET_TYPE, TICKET_STATUS } from '../utils/constants.js'
import Job from '../models/JobModel.js'

import User from '../models/UserModel.js'

// utility middleware, to attach validation rules and handle errors
const withValidationErrors = (validationvalues) => {
  return [
    ...validationvalues,
    (req, res, next) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg)
        if (errorMessages[0].startsWith('not authorized')) {
          throw new UnauthenticatedError(errorMessages)
        }

        if (errorMessages[0].startsWith('no job')) {
          throw new NotFoundError(errorMessages)
        }
        throw new BadRequestError(errorMessages)
      }
      next()
    },
  ]
}

// validate rule 1: request body for ticket creation and update (formerly job)
// Note: Database fields use jobStatus/jobType for compatibility, but represent ticketStatus/ticketType
export const validateJobInput = withValidationErrors([
  body('company').notEmpty().withMessage('Property/Vendor is required'), // company represents property/vendor
  body('position').notEmpty().withMessage('Task/Issue is required'), // position represents task/issue
  body('jobStatus') // Database field: jobStatus, represents ticketStatus
    .isIn([...Object.values(JOB_STATUS), ...Object.values(TICKET_STATUS)])
    .withMessage('Invalid ticket status'),
  body('jobType') // Database field: jobType, represents ticketType/priority
    .isIn([...Object.values(JOB_TYPE), ...Object.values(TICKET_TYPE)])
    .withMessage('Invalid ticket type/priority'),
])

// validate rule 2: ensure that only admins and the creator of the ticket can access or manipulate ticket data
export const validateIdParam = withValidationErrors([
  param('id').custom(async (value, { req }) => {
    // id format
    const isValidId = mongoose.Types.ObjectId.isValid(value)
    if (!isValidId) throw new BadRequestError('Invalid MongoDB ID')
    // id exists
    const ticket = await Job.findById(value) // Job model represents Ticket
    if (!ticket) throw new NotFoundError(`No ticket found with ID:${value}`)
    // Admin check: admin can access all tickets
    const isAdmin = req.user.role === 'admin'
    // Owner check: only the ticket creator can modify or delete the ticket
    const isOwner = req.user.userId === ticket.createdBy.toString()
    if (!isAdmin && !isOwner)
      throw UnauthenticatedError('not authorized to access this route')
  }),
])

export const validateRegisterInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email) => {
      const user = await User.findOne({ email })
      if (user) {
        throw new BadRequestError('email already exists')
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long'),
  body('location').notEmpty().withMessage('location is required'),
  body('lastName').notEmpty().withMessage('last name is required'),
])

export const validateLoginInput = withValidationErrors([
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format'),
  body('password').notEmpty().withMessage('password is required'),
])

export const validateUpdateUserInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email })
      if (user && user._id.toString() !== req.user.userId) {
        throw new Error('email already exists')
      }
    }),
  body('lastName').notEmpty().withMessage('last name is required'),
  body('location').notEmpty().withMessage('location is required'),
])
