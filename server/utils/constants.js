// Ticket status constants for NomadLiving Ops Console
export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  CANCELLED: 'cancelled',
}

// Legacy support - database values that map to display labels
export const PROPERTY_STATUS = {
  MAINTENANCE: 'open',
  ACTIVE: 'in-progress',
  INACTIVE: 'cancelled',
}

// Database values: pending, interview, declined
// UI Display: Open, In Progress, Closed
export const JOB_STATUS = {
  PENDING: 'pending', // Database value → Display: "Open"
  INTERVIEW: 'interview', // Database value → Display: "In Progress"
  DECLINED: 'declined', // Database value → Display: "Closed"
}

// Ticket type constants for NomadLiving Ops Console
export const TICKET_TYPE = {
  HIGH_PRIORITY: 'high-priority',
  ROUTINE: 'routine',
  EMERGENCY: 'emergency',
  MAINTENANCE: 'maintenance',
}

// Legacy support
export const PROPERTY_TYPE = {
  LUXURY_TENT: 'high-priority',
  CABIN: 'routine',
  TREEHOUSE: 'emergency',
}

// Database values: full-time, part-time, remote, internship
// UI Display: High Priority, Normal Priority, Low Priority, Emergency
export const JOB_TYPE = {
  FULL_TIME: 'full-time', // Database value → Display: "High Priority"
  PART_TIME: 'part-time', // Database value → Display: "Normal Priority"
  REMOTE: 'remote', // Database value → Display: "Low Priority"
  INTERNSHIP: 'internship', // Database value → Display: "Emergency"
}

export const PROPERTY_SORT_BY = {
  NEWEST_FIRST: 'newest',
  OLDEST_FIRST: 'oldest',
  ASCENDING: 'a-z',
  DESCENDING: 'z-a',
}

// Legacy support
export const JOB_SORT_BY = PROPERTY_SORT_BY

// Ticket category constants for NomadLiving Ops Console
// Distinguishes between maintenance tasks and order fulfillment
export const TICKET_CATEGORY = {
  MAINTENANCE: 'maintenance',
  ORDER_FULFILLMENT: 'order-fulfillment',
}
