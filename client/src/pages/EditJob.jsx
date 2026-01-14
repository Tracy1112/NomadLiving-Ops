import { FormRow, FormRowSelect, SubmitBtn } from '../components'
import Wrapper from '../assets/wrappers/DashboardFormPage'
import { useLoaderData, useParams } from 'react-router-dom'
import { TICKET_STATUS, TICKET_TYPE, TICKET_CATEGORY } from '../../../server/utils/constants'
import { Form, redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import customFetch from '../utils/customFetch'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const singleJobQuery = (id) => {
  return {
    queryKey: ['job', id],
    queryFn: async () => {
      const { data } = await customFetch.get(`/jobs/${id}`)
      return data
    },
  }
}

export const loader =
  (queryClient) =>
  async ({ params }) => {
    try {
      await queryClient.ensureQueryData(singleJobQuery(params.id))
      return params.id
    } catch (error) {
      toast.error(error?.response?.data?.msg)
      return redirect('/dashboard/all-jobs')
    }
  }
export const action =
  (queryClient) =>
  async ({ request, params }) => {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    try {
      await customFetch.patch(`/jobs/${params.id}`, data)
      queryClient.invalidateQueries(['jobs'])

      toast.success('Ticket updated successfully')
      return redirect('/dashboard/all-jobs')
    } catch (error) {
      toast.error(error?.response?.data?.msg)
      return error
    }
  }

const EditJob = () => {
  const id = useLoaderData()

  const {
    data: { job },
  } = useQuery(singleJobQuery(id))

  const [ticketCategory, setTicketCategory] = useState(
    job?.ticketCategory || TICKET_CATEGORY.MAINTENANCE
  )

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
        <h4 className="form-title">edit ticket</h4>
        <div className="form-center">
          <FormRowSelect
            labelText="ticket category"
            name="ticketCategory"
            defaultValue={job?.ticketCategory || TICKET_CATEGORY.MAINTENANCE}
            list={Object.values(TICKET_CATEGORY)}
            onChange={(e) => setTicketCategory(e.target.value)}
          />
          <FormRow 
            type="text" 
            name="position" 
            labelText={fieldConfig.position.label}
            defaultValue={job?.position}
            placeholder={fieldConfig.position.placeholder}
          />
          <FormRow 
            type="text" 
            name="company" 
            labelText={fieldConfig.company.label}
            defaultValue={job?.company}
            placeholder={fieldConfig.company.placeholder}
          />
          <FormRow
            type="text"
            name="jobLocation"
            labelText={fieldConfig.location.label}
            defaultValue={job?.jobLocation}
            placeholder={fieldConfig.location.placeholder}
          />
          <FormRowSelect
            name="jobStatus"
            labelText="ticket status"
            defaultValue={job?.jobStatus}
            list={Object.values(TICKET_STATUS)}
          />
          <FormRowSelect
            name="jobType"
            labelText="priority"
            defaultValue={job?.jobType}
            list={Object.values(TICKET_TYPE)}
          />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  )
}
export default EditJob
