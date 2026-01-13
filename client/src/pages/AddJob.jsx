import { FormRow, FormRowSelect, SubmitBtn } from '../components'
import Wrapper from '../assets/wrappers/DashboardFormPage'
import { useOutletContext } from 'react-router-dom'
import { TICKET_STATUS, TICKET_TYPE } from '../../../server/utils/constants'
import { Form, redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import customFetch from '../utils/customFetch'

export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    try {
      await customFetch.post('/jobs', data)
      queryClient.invalidateQueries(['jobs'])
      toast.success('Ticket created successfully')
      return redirect('all-jobs')
    } catch (error) {
      toast.error(error?.response?.data?.msg)
      return error
    }
  }

const AddJob = () => {
  const { user } = useOutletContext()

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">new ticket</h4>
        <div className="form-center">
          <FormRow 
            type="text" 
            name="position" 
            labelText="task / issue"
            placeholder="e.g., Fix AC, Deep Clean"
          />
          <FormRow 
            type="text" 
            name="company" 
            labelText="property / unit"
            placeholder="e.g., Cabin 01, Airstream Beta"
          />
          <FormRow
            type="text"
            labelText="zone / area"
            name="jobLocation"
            defaultValue={user.location}
          />
          <FormRowSelect
            labelText="ticket status"
            name="jobStatus"
            defaultValue={TICKET_STATUS.OPEN}
            list={Object.values(TICKET_STATUS)}
          />
          <FormRowSelect
            labelText="priority"
            name="jobType"
            defaultValue={TICKET_TYPE.HIGH_PRIORITY}
            list={Object.values(TICKET_TYPE)}
          />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  )
}
export default AddJob
