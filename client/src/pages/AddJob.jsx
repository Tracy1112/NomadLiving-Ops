import { FormRow, FormRowSelect, SubmitBtn } from '../components'
import Wrapper from '../assets/wrappers/DashboardFormPage'
import { useOutletContext } from 'react-router-dom'
import { TICKET_STATUS, TICKET_TYPE, TICKET_CATEGORY } from '../../../server/utils/constants'
import { Form, redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import customFetch from '../utils/customFetch'
import { useState } from 'react'

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
  const [ticketCategory, setTicketCategory] = useState(TICKET_CATEGORY.MAINTENANCE)

  // Dynamic placeholders and labels based on ticket category
  const getFieldConfig = () => {
    if (ticketCategory === TICKET_CATEGORY.ORDER_FULFILLMENT) {
      return {
        position: {
          label: 'order reference id',
          placeholder: 'e.g., Order #2491, PO-2025-1234'
        },
        company: {
          label: 'customer name',
          placeholder: 'e.g., Customer: John Doe, ABC Company'
        },
        location: {
          label: 'warehouse / shipping location',
          placeholder: 'e.g., Warehouse B, Shipping Dock 3'
        }
      }
    } else {
      return {
        position: {
          label: 'task / issue',
          placeholder: 'e.g., Repair AC unit, Deep Clean Required'
        },
        company: {
          label: 'property / unit',
          placeholder: 'e.g., Sunset Cabin, Airstream Beta'
        },
        location: {
          label: 'zone / area',
          placeholder: 'e.g., North Site, Zone A - North Camp'
        }
      }
    }
  }

  const fieldConfig = getFieldConfig()

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">new ticket</h4>
        <div className="form-center">
          <FormRowSelect
            labelText="ticket category"
            name="ticketCategory"
            defaultValue={TICKET_CATEGORY.MAINTENANCE}
            list={Object.values(TICKET_CATEGORY)}
            onChange={(e) => setTicketCategory(e.target.value)}
          />
          <FormRow 
            type="text" 
            name="position" 
            labelText={fieldConfig.position.label}
            placeholder={fieldConfig.position.placeholder}
          />
          <FormRow 
            type="text" 
            name="company" 
            labelText={fieldConfig.company.label}
            placeholder={fieldConfig.company.placeholder}
          />
          <FormRow
            type="text"
            labelText={fieldConfig.location.label}
            name="jobLocation"
            defaultValue={user.location}
            placeholder={fieldConfig.location.placeholder}
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
