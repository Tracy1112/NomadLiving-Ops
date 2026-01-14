/**
 * Ticket Controller (formerly Job Controller)
 * 
 * Handles all ticket-related operations for NomadLiving Ops Console including CRUD operations,
 * filtering, searching, pagination, and statistics.
 * 
 * @module controllers/jobController
 */

import Job from '../models/JobModel.js'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import day from 'dayjs'

/**
 * Get all tickets for the authenticated user with filtering, searching, and pagination
 * 
 * @async
 * @function getAllJobs
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters (search, jobStatus as ticketStatus, jobType as ticketType, sort, page, limit)
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.userId - User ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with tickets (jobs), pagination info
 */
export const getAllJobs = async (req, res) => {
  // Note: Using jobStatus/jobType in query params for API compatibility, but these represent ticketStatus/ticketType
  const { search, jobStatus: ticketStatus, jobType: ticketType, ticketCategory, sort } = req.query

  const queryObject = {
    createdBy: req.user.userId,
  }

  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: 'i' } }, // Task/Issue/Order Reference
      { company: { $regex: search, $options: 'i' } }, // Property/Vendor/Customer
    ]
  }
  if (ticketCategory && ticketCategory !== 'all') {
    queryObject.ticketCategory = ticketCategory // Filter by ticket category (maintenance/order-fulfillment)
  }
  if (ticketStatus && ticketStatus !== 'all') {
    queryObject.jobStatus = ticketStatus // Database field: jobStatus, represents ticketStatus
  }
  if (ticketType && ticketType !== 'all') {
    queryObject.jobType = ticketType // Database field: jobType, represents ticketType/priority
  }

  const sortOptions = {
    newest: '-createdAt',
    oldest: 'createdAt',
    'a-z': 'position',
    'z-a': '-position',
  }

  const sortKey = sortOptions[sort] || sortOptions.newest

  // setup pagination
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  const tickets = await Job.find(queryObject).sort(sortKey).skip(skip).limit(limit)

  const totalTickets = await Job.countDocuments(queryObject)
  const numOfPages = Math.ceil(totalTickets / limit)

  res
    .status(StatusCodes.OK)
    .json({ totalJobs: totalTickets, numOfPages, currentPage: page, jobs: tickets })
}

/**
 * Create a new ticket
 * 
 * @async
 * @function createJob
 * @param {Object} req - Express request object
 * @param {Object} req.body - Ticket data (company as property/vendor, position as task/issue, jobStatus as ticketStatus, jobType as ticketType/priority, jobLocation as zone/area)
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.userId - User ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with created ticket (job)
 */
export const createJob = async (req, res) => {
  const { company: property, position: task } = req.body
  req.body.createdBy = req.user.userId
  const ticket = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job: ticket })
}

/**
 * Get a single ticket by ID
 * 
 * @async
 * @function getJob
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Ticket ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with ticket data (job)
 */
export const getJob = async (req, res) => {
  const ticket = await Job.findById(req.params.id)
  res.status(StatusCodes.OK).json({ job: ticket })
}

/**
 * Update an existing ticket
 * 
 * @async
 * @function updateJob
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Ticket ID
 * @param {Object} req.body - Updated ticket data
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with updated ticket (job)
 */
export const updateJob = async (req, res) => {
  const updatedTicket = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(StatusCodes.OK).json({ msg: 'ticket modified', job: updatedTicket })
}

/**
 * Delete a ticket
 * 
 * @async
 * @function deleteJob
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Ticket ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with deleted ticket (job)
 */
export const deleteJob = async (req, res) => {
  const removedTicket = await Job.findByIdAndDelete(req.params.id)
  res.status(StatusCodes.OK).json({ msg: 'ticket deleted', job: removedTicket })
}

/**
 * Get ticket statistics for the authenticated user
 * Returns status counts and monthly ticket trends
 * 
 * @async
 * @function showStats
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.userId - User ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with ticket statistics
 */
export const showStats = async (req, res) => {
  // Get status statistics
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
  ])

  // Get category statistics
  let categoryStats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$ticketCategory', count: { $sum: 1 } } },
  ])

  const categoryCounts = categoryStats.reduce((acc, curr) => {
    acc[curr._id || 'maintenance'] = curr.count
    return acc
  }, {})

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr
    acc[title] = count
    return acc
  }, {})

  // Support all status values for backward compatibility
  const defaultStats = {
    // New ticket status values
    'open': stats.open || stats.pending || stats.maintenance || 0,
    'in-progress': stats['in-progress'] || stats.interview || stats.active || 0,
    'cancelled': stats.cancelled || stats.declined || stats.inactive || 0,
    // Legacy property status values
    maintenance: stats.maintenance || stats.pending || stats.open || 0,
    active: stats.active || stats.interview || stats['in-progress'] || 0,
    inactive: stats.inactive || stats.declined || stats.cancelled || 0,
    // Legacy job status values (for existing data)
    pending: stats.pending || stats.maintenance || stats.open || 0,
    interview: stats.interview || stats.active || stats['in-progress'] || 0,
    declined: stats.declined || stats.inactive || stats.cancelled || 0,
  }

  let monthlyTickets = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ])

  monthlyTickets = monthlyTickets
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item

      const date = day()
        .month(month - 1)
        .year(year)
        .format('MMM YY')

      return { date, count }
    })
    .reverse()

  res.status(StatusCodes.OK).json({ 
    defaultStats, 
    monthlyApplications: monthlyTickets,
    categoryStats: {
      maintenance: categoryCounts.maintenance || 0,
      orderFulfillment: categoryCounts['order-fulfillment'] || 0,
    }
  })
}
