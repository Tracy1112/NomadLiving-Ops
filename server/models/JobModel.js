import mongoose from 'mongoose'
import { 
  JOB_STATUS, 
  JOB_TYPE, 
  PROPERTY_STATUS, 
  PROPERTY_TYPE,
  TICKET_STATUS,
  TICKET_TYPE,
  TICKET_CATEGORY
} from '../utils/constants.js'

// Combine all status/type values for enum validation (support legacy and new)
const allStatusValues = [
  ...Object.values(JOB_STATUS), 
  ...Object.values(PROPERTY_STATUS),
  ...Object.values(TICKET_STATUS)
]
const allTypeValues = [
  ...Object.values(JOB_TYPE), 
  ...Object.values(PROPERTY_TYPE),
  ...Object.values(TICKET_TYPE)
]

const jobSchema = new mongoose.Schema(
  {
    company: String, // Now: Property / Vendor / Customer
    position: String, // Now: Task / Issue / Subject / Reference ID
    jobStatus: {
      type: String,
      enum: allStatusValues,
      default: TICKET_STATUS.OPEN, // New default: 'open' → UI Display: "Open / Pending"
    },
    jobType: {
      type: String,
      enum: allTypeValues,
      default: TICKET_TYPE.HIGH_PRIORITY, // New default: 'high-priority' → UI Display: "High Priority"
    },
    ticketCategory: {
      type: String,
      enum: Object.values(TICKET_CATEGORY),
      default: TICKET_CATEGORY.MAINTENANCE, // Default: maintenance task
    },
    jobLocation: {
      type: String,
      default: 'my city',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

const Job = mongoose.model('Job', jobSchema)
export default Job
