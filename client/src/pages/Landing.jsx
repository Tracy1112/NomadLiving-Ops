import Wrapper from '../assets/wrappers/LandingPage'
import { Link } from 'react-router-dom'
import { Logo } from '../components'
import main from '../assets/images/main.svg'

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            NomadLiving <span>Internal Portal</span>
          </h1>
          <p>
            Authorized Personnel Only. Manage property maintenance and supply chain workflows.
            Track tickets, monitor operations, and streamline internal processes — all in one
            powerful operations dashboard.
          </p>
          <Link to="/register" className="btn register-link">
            Register
          </Link>
          <Link to="/login" className="btn">
            Login / Demo User
          </Link>
        </div>
        <img src={main} alt="operations dashboard" className="img main-img" />
      </div>
    </Wrapper>
  )
}

export default Landing
