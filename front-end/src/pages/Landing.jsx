// import styled from 'styled-components'

import { Link } from 'react-router-dom'
// import {Logo} from '../components'
const Landing = () => {
  return (
    <>
      <nav></nav>
      <div className="container page">
        <div className="info">
          <h1>
            job<span> tracking </span>app
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
            dolore laboriosam, molestiae velit cum consequuntur earum, aut
            dolorem nostrum perferendis quis qui suscipit non ipsam omnis maxime
            eligendi odio possimus nesciunt. Nulla quas sunt cupiditate dolores,
            quis reiciendis atque laudantium magnam iste doloribus beatae, neque
            aliquid, harum dolorum dignissimos architecto?
          </p>
          <Link to="/register" className="btn register-link">
            Register
          </Link>
          <Link to="/login" className="btn ">
            Login / Demo User
          </Link>
        </div>
        {/* <img src={main} alt="job hunt" className="img main-img" /> */}
      </div>
    </>
  )
}

export default Landing
