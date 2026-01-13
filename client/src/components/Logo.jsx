import { FaTools } from 'react-icons/fa'
import styled from 'styled-components'

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .logo-icon {
    font-size: 2rem;
    display: flex;
    align-items: center;
    color: var(--primary-500);
    flex-shrink: 0;
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: var(--letter-spacing);
    color: var(--text-color);
    text-transform: none;
    white-space: nowrap;
  }

  /* Hide text on mobile for navbar context, but show in sidebar/landing */
  @media (max-width: 991px) {
    .logo-text {
      display: none;
    }
  }

  /* Ensure logo is centered when used in forms/landing */
  &.centered {
    justify-content: center;
    margin: 0 auto;
  }
`

const Logo = () => {
  return (
    <LogoWrapper className="logo">
      <div className="logo-icon">
        <FaTools />
      </div>
      <span className="logo-text">Nomad Ops</span>
    </LogoWrapper>
  )
}

export default Logo
