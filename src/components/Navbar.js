 import React, {useContext} from 'react'
 import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    let {user, logoutUser} = useContext(AuthContext)
    return ( 
        <nav className="navbar">
            <h1>Foodie</h1>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/contact">Contact us</Link>
                <Link to={"/recipe-share"}>Share-recipe</Link>

                {user ? (
                    <p onClick={logoutUser}>logout</p>
                ):(
                    <Link to="/login">login</Link>
                )}

                {user && <p>Hello {user.username}</p>}
            </div>
        </nav>
     );
}
 
export default Navbar;
