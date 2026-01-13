import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa'
import { Link, Form } from 'react-router-dom'
import Wrapper from '../assets/wrappers/Job'
import JobInfo from './JobInfo'

import day from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
day.extend(advancedFormat)

// Format ticket status for display - NomadLiving Ops Console
// Maps: pending → Open, interview → In Progress, declined → Closed
const formatStatus = (status) => {
  const statusMap = {
    // New ticket statuses
    open: 'Open',
    'in-progress': 'In Progress',
    cancelled: 'Closed',
    // Legacy support - database values mapped to display labels
    maintenance: 'Open',
    active: 'In Progress',
    inactive: 'Closed',
    pending: 'Open',
    interview: 'In Progress',
    declined: 'Closed',
  }
  return statusMap[status] || status
}

// Format priority/type for display - NomadLiving Ops Console
// Maps: full-time → High Priority, part-time → Normal Priority, remote → Low Priority, internship → Emergency
const formatType = (type) => {
  const typeMap = {
    // New priority types
    'high-priority': 'High Priority',
    routine: 'Normal Priority',
    emergency: 'Emergency',
    maintenance: 'Low Priority',
    // Legacy support - database values mapped to display labels
    'luxury-tent': 'High Priority',
    cabin: 'Normal Priority',
    treehouse: 'Emergency',
    'full-time': 'High Priority',
    'part-time': 'Normal Priority',
    internship: 'Emergency',
    remote: 'Low Priority',
  }
  return typeMap[type] || type
}

// Ticket component (formerly Job component) - NomadLiving Ops Console
const Job = ({
  _id,
  position, // Task / Issue
  company, // Property / Vendor
  jobLocation, // Zone / Area (database field name: jobLocation)
  jobType, // Priority/Type (database field name: jobType, represents ticketType/priority)
  createdAt,
  jobStatus, // Ticket Status (database field name: jobStatus, represents ticketStatus)
}) => {
  const date = day(createdAt).format('MMM Do, YYYY')
  // Normalize status for CSS class (support both old and new values)
  // Map to CSS classes: pending (gray for Open), interview (blue/yellow for In Progress), declined (gray for Closed)
  const ticketStatus = jobStatus // Alias for clarity
  const statusClass =
    ticketStatus === 'open' ||
    ticketStatus === 'pending' ||
    ticketStatus === 'maintenance'
      ? 'pending' // Gray for Open
      : ticketStatus === 'in-progress' ||
        ticketStatus === 'active' ||
        ticketStatus === 'interview'
      ? 'interview' // Blue/Yellow for In Progress
      : 'declined' // Gray for Closed

  return (
    <Wrapper>
      <header>
        {/* Property/Unit icon - first letter of property name */}
        <div className="main-icon">{company.charAt(0).toUpperCase()}</div>
        <div className="info">
          <h5>{position}</h5> {/* Task / Issue - main title */}
          <p>{company}</p> {/* Property / Unit - subtitle */}
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />{' '}
          {/* Zone / Area */}
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={formatType(jobType)} />{' '}
          {/* Priority (jobType represents ticketType/priority) */}
          <div className={`status ${statusClass}`}>
            {formatStatus(ticketStatus)}
          </div>
        </div>

        <footer className="actions">
          <Link to={`../edit-job/${_id}`} className="btn edit-btn">
            Edit
          </Link>
          <Form method="post" action={`../delete-job/${_id}`}>
            <button type="submit" className="btn delete-btn">
              Delete
            </button>
          </Form>
        </footer>
      </div>
    </Wrapper>
  )
}

export default Job
