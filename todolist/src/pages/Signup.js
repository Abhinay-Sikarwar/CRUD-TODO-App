import React, { useState } from 'react';
import "./Signup.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';        // use to add/pass/store data to the store or userReducer

const Signup = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();           // for passing data in redux store

    axios.defaults.baseURL = "http://localhost:8080";        // port number on which the database will run
 
    //function for the  registration
    const signup = async (e) => {
        e.preventDefault();
        setLoading(true);

        //these  parameters will be  passed with the signup request 
        const requestData = { name, username, email, password }

        try {
            const response = await axios.post(`/signup`, requestData);

            if (response.status === 201) {
                setLoading(false);
                toast.success(`${response.data.result}`, {
                    autoClose: 3000,
                });

                setName('');
                setUsername('');
                setEmail('');
                setPassword('');

            }
        }
        catch (error) {             // error message if signup unsuccessful
            setLoading(false);
            toast.error(`${error.response.data.error}`, {
                autoClose: 3000,
            });
        };

    }



    const login = async (e) => {
        e.preventDefault();

        setLoading(true);

        //these parameters will be  passed with the login request (object format)
        const requestData = { email, password }

        try {
            const response = await axios.post(`/login`, requestData);


            if (response.status === 200) {
                localStorage.setItem('token', response.data.result.token);   // storing token to localStorage
                localStorage.setItem('user', JSON.stringify(response.data.result.user));  // to localStorage
                dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.result.user, })  // passing user's data to userReducer inside case: "LOGIN_SUCCESS"

                setEmail('');
                setPassword('');
                navigate('/');

                setLoading(false);

                toast.success(`${response.data.result.message}`, {
                    autoClose: 5000,
                });

            }

        }
        catch (error) {             // error message if signup unsuccessful
            console.log(error);
            setLoading(false);
            toast.error(`${error.response.data.error}`, {
                autoClose: 3000,
            });
        };




    }




    function wide() {
        document.getElementById('log').style.bottom = '-14%';
        document.getElementById('log').style.borderRadius = '35%';
    }

    function lowr() {
        document.getElementById('log').style.bottom = '-86%';
        document.getElementById('log').style.borderRadius = '50%';
    }



    return (
        <div className="signup container d-flex justify-content-center align-items-center" id="hideAfterFill">
            <section className="wrapper">
                <div className="form signup">
                    <header onClick={lowr}>Signup</header>
                    <form onSubmit={signup}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="on"
                        />
                        <input
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        {loading ?
                            <button className="authbtn text-primary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                <span role="status"> Loading...</span>
                            </button>
                            :
                            <input type="submit" value="Signup" />
                        }
                    </form>
                </div>

                <div className="form login" id="log">
                    <header onClick={wide}>Login</header>
                    <form onSubmit={login}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required />
                        <input
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="on"
                        />
                        {loading ?
                            <button className="authbtn text-light btn btn-primary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                <span role="status"> Loading...</span>
                            </button>
                            :
                            <input type="submit" value="Login" />
                        }
                    </form>
                </div>
            </section>
        </div>

    )
}

export default Signup;