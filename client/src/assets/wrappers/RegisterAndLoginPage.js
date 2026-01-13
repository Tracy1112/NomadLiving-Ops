import styled from 'styled-components'

const Wrapper = styled.section`
  min-height: 100vh;
  display: grid;
  align-items: center;
  .form {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    margin-top: 0;
    margin-bottom: 1.5rem;
    width: 100%;
  }
  h4 {
    text-align: center;
    margin-bottom: 1.38rem;
    margin-top: 0;
    text-transform: capitalize;
    display: block;
    width: 100%;
  }
  p {
    margin-top: 1rem;
    text-align: center;
    line-height: 1.5;
  }
  .btn {
    margin-top: 1rem;
  }
  .member-btn {
    color: var(--primary-500);
    letter-spacing: var(--letter-spacing);
    margin-left: 0.25rem;
  }
`
export default Wrapper
