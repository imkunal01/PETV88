import './nav.css'
import logo from '../../../assets/mcdlogo.svg'
import { Link } from 'react-router-dom';
import Home from '../../layout/Home/home';
function Nav() {
  return (
    <>
      <div className="container">
        <div className="mcdlogo">
            <img src={logo} alt="McDLogo" />
        </div>
        <div className="navbar">
          <div className="navlinks">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/contact">Contacts</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Nav