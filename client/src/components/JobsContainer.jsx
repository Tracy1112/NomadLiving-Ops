import Job from './Job'
import Wrapper from '../assets/wrappers/JobsContainer'
import PageBtnContainer from './PageBtnContainer'
import { useAllJobsContext } from '../pages/AllJobs'

const JobsContainer = () => {
  const { data } = useAllJobsContext()
  const { jobs, totalJobs, numOfPages } = data
  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No active tickets...</h2>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <h5>
        {totalJobs} active ticket{totalJobs === 1 ? '' : 's'}
      </h5>
      <div className="jobs">
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  )
}

export default JobsContainer
