import List from './components/List';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Signup from './pages/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Navbar from './components/Navbar';


const App = () => {


  function DynamicComponent() {
    const dispatch = useDispatch();                // initializing dispatch
    const navigate = useNavigate();

    //this will get the  user's data available in redux store
    const user = useSelector(state => state.userReducer.user)

    useEffect(() => {

      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData) {   // when user has a logged in active session
        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
        navigate('/');                // if user is logged in navigate to home page
      }
      else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: "LOGOUT" });
        navigate('/signup');                  // if user not logged in navigate to signup page
      }

    }, []);


    if (user._id) {          // if user is logged in give access to this routes
      return (
        <Routes>
          <Route path='/' element={<List />} />
        </Routes>
      )
    }
    else {                   // if user is not logged in show login or signup page
      return (
        <Routes>
          <Route path="/signup" element={<Signup />}></Route>
        </Routes>
      )
    }

  }




  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />         {/* Fontawesome toast container */}
        <Navbar />
        <DynamicComponent />
      </BrowserRouter>
    </div>
  );
}

export default App;
