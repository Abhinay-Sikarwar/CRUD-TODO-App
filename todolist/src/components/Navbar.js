import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // to get user's data from state
    const user = useSelector(state => state.userReducer.user)

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: "LOGOUT" });
        toast.info('Logout Successful!', {
            autoClose: 3000,
        });
        navigate('/signup');
    }


    return (
        <header data-bs-theme="light">
            <nav className="navbar navbar-expand-md navbar-light fixed-top bg-light">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand shopping-cart"><img width="35" height="35" src="https://cdn-icons-png.flaticon.com/512/3176/3176366.png" alt="shopping-bag" /> Daily Task</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse rating" id="navbarCollapse">
                        <ul className="navbar-nav me-auto mb-2 mb-md-0">
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/">Home</Link>
                            </li>
                        </ul>


                        <div className='d-flex'>

                            {user._id && (
                                <div>

                                    <button className="btn btn-light me-2" type="button">
                                        <img width="35" height="35" src={user.profilePic} alt="DP" className='me-2 rounded-5' />
                                        {user.name}
                                    </button>

                                    <button className='btn btn-danger' onClick={logout}>
                                        Logout
                                    </button>

                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar;