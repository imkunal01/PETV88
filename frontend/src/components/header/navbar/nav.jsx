import './nav.css'
import logo from '../../../assets/mcdlogo.svg'
import { Link } from 'react-router-dom';
function Nav() {
  return (
  <>
    <div className="constainer">
      <div className="mcdlogo">
          <img src={logo} alt="McDLogo" />
      </div>

      <div className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    </div>
  </>
  )
}

export default Nav