import { toast } from 'react-toastify'
import { JobsContainer, SearchContainer } from '../components'
import customFetch from '../utils/customFetch'
import { useLoaderData } from 'react-router-dom'
import { useContext, createContext } from 'react'
import { useQuery } from '@tanstack/react-query'

const allJobsQuery = (params) => {
  // Note: API uses jobStatus/jobType for compatibility, but these represent ticketStatus/ticketType
  const { search, jobStatus, jobType, ticketCategory, sort, page } = params
  return {
    queryKey: [
      'jobs', // Query key remains 'jobs' for cache compatibility
      search ?? '',
      ticketCategory ?? 'all', // Ticket category filter
      jobStatus ?? 'all', // Represents ticketStatus
      jobType ?? 'all', // Represents ticketType/priority
      sort ?? 'newest',
      page ?? 1,
    ],
    queryFn: async () => {
      const { data } = await customFetch.get('/jobs', {
        params, // API expects jobStatus/jobType/ticketCategory
      })
      return data
    },
  }
}

export const loader =
  (queryClient) =>
  async ({ request }) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ])

    await queryClient.ensureQueryData(allJobsQuery(params))
    return { searchValues: { ...params } }
  }

const AllJobsContext = createContext()
const AllJobs = () => {
  const { searchValues } = useLoaderData()
  const { data } = useQuery(allJobsQuery(searchValues))
  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  )
}

export const useAllJobsContext = () => useContext(AllJobsContext)

export default AllJobs
