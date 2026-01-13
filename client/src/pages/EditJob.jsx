import { FormRow, FormRowSelect, SubmitBtn } from '../components'
import Wrapper from '../assets/wrappers/DashboardFormPage'
import { useLoaderData, useParams } from 'react-router-dom'
import { TICKET_STATUS, TICKET_TYPE } from '../../../server/utils/constants'
import { Form, redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import customFetch from '../utils/customFetch'
import { useQuery } from '@tanstack/react-query'

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

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">edit ticket</h4>
        <div className="form-center">
          <FormRow 
            type="text" 
            name="position" 
            labelText="task / issue"
            defaultValue={job.position} 
          />
          <FormRow 
            type="text" 
            name="company" 
            labelText="property / unit"
            defaultValue={job.company} 
          />
          <FormRow
            type="text"
            name="jobLocation"
            labelText="zone / area"
            defaultValue={job.jobLocation}
          />
          <FormRowSelect
            name="jobStatus"
            labelText="ticket status"
            defaultValue={job.jobStatus}
            list={Object.values(TICKET_STATUS)}
          />
          <FormRowSelect
            name="jobType"
            labelText="priority"
            defaultValue={job.jobType}
            list={Object.values(TICKET_TYPE)}
          />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  )
}
export default EditJob
