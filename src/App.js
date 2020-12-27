
import './App.css';
import {useEffect, useState} from 'react'
import {Route, Switch, Redirect } from 'react-router-dom'

import {ToastContainer} from 'react-toastify'
import Movies from './components/Movies'
import NavBar from './components/NavBar';
import Customers from './components/Customers'
import Rentals from './components/Rentals'
import NotFound from './components/NotFound'
import MovieDetail from './components/MovieDetail'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Logout from './components/Logout'
import Profile from './components/Profile'
import auth from './services/authService'
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from './components/common/ProtectedRoute';


function App() {
  const [user, setUser] = useState(null);
  useEffect ( () => {
    setUser( auth.getCurrentUser() );

  }, [])
  return (
    <div className="App">
      <ToastContainer />
      <NavBar user={user} />
      
      <main className="container">
        <Switch>
          <Route path="/register" component={RegisterForm} />
          <Route path="/login" component={LoginForm} />
          <Route path="/logout" component={Logout} />
          <Route path="/profile" component={Profile} />
          <Route path="/customers" component={Customers} />
          <Route path="/rentals" component={Rentals} />

          <ProtectedRoute path="/movies/:id" component={MovieDetail} />
          <Route path="/movies" exact render={ props => (<Movies user={user} {...props} /> )} />
        
          <Route path="/not-found" component={NotFound} />
          
          <Redirect from="/" to="/movies" />
          <Redirect to="/not-found" />
        </Switch>
        {/* <Movies /> */}
      </main>
    </div>
  );
}

export default App;
