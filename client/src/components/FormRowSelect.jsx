// Format option labels for display - NomadLiving Ops Console
// Maps database values to user-friendly display labels
const formatOptionLabel = (value) => {
  // Priority/Type formatting (check before status to avoid conflict with 'maintenance' type)
  // Maps: full-time → High Priority, part-time → Normal Priority, remote → Low Priority, internship → Emergency
  if (value === 'high-priority' || value === 'full-time' || value === 'luxury-tent') return 'High Priority'
  if (value === 'routine' || value === 'part-time' || value === 'cabin') return 'Normal Priority'
  if (value === 'emergency' || value === 'internship' || value === 'treehouse') return 'Emergency'
  if (value === 'maintenance' || value === 'remote') return 'Low Priority'
  
  // Ticket Status formatting
  // Maps: pending → Open / Pending, interview → In Progress, declined → Closed
  if (value === 'open' || value === 'pending' || value === 'maintenance') return 'Open / Pending'
  if (value === 'in-progress' || value === 'active' || value === 'interview') return 'In Progress'
  if (value === 'cancelled' || value === 'inactive' || value === 'declined') return 'Closed'
  
  // Sort formatting
  if (value === 'newest') return 'Newest First'
  if (value === 'oldest') return 'Oldest First'
  if (value === 'a-z') return 'A-Z'
  if (value === 'z-a') return 'Z-A'
  
  // Default: capitalize first letter
  return value === 'all' ? 'All' : value.charAt(0).toUpperCase() + value.slice(1)
}

const FormRowSelect = ({
  name,
  labelText,
  list,
  defaultValue = '',
  onChange,
}) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <select
        name={name}
        id={name}
        className="form-select"
        defaultValue={defaultValue}
        onChange={onChange}
      >
        {list.map((itemValue) => {
          return (
            <option key={itemValue} value={itemValue}>
              {formatOptionLabel(itemValue)}
            </option>
          )
        })}
      </select>
    </div>
  )
}
export default FormRowSelect
