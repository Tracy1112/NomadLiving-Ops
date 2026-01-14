import { FormRow, FormRowSelect } from '../components/index.js'
import Wrapper from '../assets/wrappers/DashboardFormPage.js'
import { Form, useSubmit, Link } from 'react-router-dom'
import {
  TICKET_TYPE,
  TICKET_STATUS,
  TICKET_CATEGORY,
  PROPERTY_SORT_BY,
} from '../../../server/utils/constants.js'
import { useAllJobsContext } from '../pages/AllJobs'

const SearchContainer = () => {
  const { searchValues } = useAllJobsContext()
  const { search, jobStatus, jobType, ticketCategory, sort } = searchValues
  const submit = useSubmit()

  const debounce = (onChange) => {
    let timeout
    return (e) => {
      const form = e.currentTarget.form
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        onChange(form)
      }, 2000)
    }
  }

  return (
    <Wrapper>
      <Form className="form">
        <h5 className="form-title">search tickets</h5>
        <div className="form-center">
          <FormRow
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Search by subject, entity, order ID, or location..."
            onChange={debounce((form) => {
              submit(form)
            })}
          />
          <FormRowSelect
            labelText="ticket category"
            name="ticketCategory"
            list={['all', ...Object.values(TICKET_CATEGORY)]}
            defaultValue={ticketCategory}
            onChange={(e) => {
              submit(e.currentTarget.form)
            }}
          />
          <FormRowSelect
            labelText="ticket status"
            name="jobStatus"
            list={['all', ...Object.values(TICKET_STATUS)]}
            defaultValue={jobStatus}
            onChange={(e) => {
              submit(e.currentTarget.form)
            }}
          />
          <FormRowSelect
            labelText="priority"
            name="jobType"
            list={['all', ...Object.values(TICKET_TYPE)]}
            defaultValue={jobType}
            onChange={(e) => {
              submit(e.currentTarget.form)
            }}
          />
          <FormRowSelect
            name="sort"
            defaultValue={sort}
            list={[...Object.values(PROPERTY_SORT_BY)]}
            onChange={(e) => {
              submit(e.currentTarget.form)
            }}
          />
          <Link to="/dashboard/all-jobs" className="btn form-btn delete-btn">
            Reset Search Values
          </Link>
        </div>
      </Form>
    </Wrapper>
  )
}

export default SearchContainer
