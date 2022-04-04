import React, {useState, useEffect}  from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import axios from 'axios';

import { ProtectedRoute, ProtectedLogin, ProtectedRouteSysAdmin, ProtectedRouteHillAdmin } from './components/App/ProtectedRoutes';

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home';
import Admin2 from './pages/Admin2/Admin';
import Area2 from './pages/Area2/Area';
import SignIn from './pages/SignIn/SignIn';
import Roster from './pages/Roster/Roster';
import UserPage from './pages/User/UserPage.js'
import OtherUserPage from './pages/User/OtherUserPage.js'

//Cookie Service
import CookieService from './services/CookieServices'


import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'



function App() {

  const [login, setLogin] = useState(CookieService.get("type")? "Successful":"Not Attempted");
  const [userAuth, setAuth] = useState(CookieService.get("type")?{username:CookieService.get("type").username, user_type: CookieService.get("type").user_type, name: CookieService.get("type").name, trainer: CookieService.get("type").name, phone_number: CookieService.get("type").phone_number}: {username:"", user_type: ""});


  const [updateInfo, setUpdateInfo] = useState(true);

  useEffect(() => {
    //TODO redirect if login is successful
    // if(updateInfo)
    // {
    //   //wait(50); //If the user info is not updated uncomment this
    //   const AuthStr = 'Bearer ' + CookieService.get("type");
    //   axios.get('/users', { headers: { 'Authorization': AuthStr } })
    //     .then(response => {
    //       // If request is good...
    //       setAuth(
    //       {
    //           username: response.data.username,
    //           user_type: response.data.user_type
    //       });
    //     })
    //     .catch((error) => {
    //       console.log('error ' + error);
    //   });
    //   setUpdateInfo(false);
    // }
  }, [updateInfo, userAuth]);

  return (
    <Router>

        <Header login={login} setLogin={setLogin} userAuth={userAuth} setAuth={setAuth} CookieService={CookieService}/>
        <Switch>

          {/* Can access if they Are Signed in */}
          <ProtectedRouteHillAdmin path="/area" Component={Area2} login={login} setLogin={setLogin} userAuth={userAuth}/>
          <ProtectedRouteSysAdmin path="/admin" Component={Admin2} login={login} setLogin={setLogin} userAuth={userAuth}/>
          {/* <ProtectedRoute path="/roster" Component={Roster} login={login} setLogin={setLogin} userAuth={userAuth}/> */}
          <ProtectedRoute path="/roster/:event_id" Component={Roster} login={login} setLogin={setLogin} userAuth={userAuth}/>
          <ProtectedRoute path="/user" Component={UserPage} login={login} setLogin={setLogin} userAuth={userAuth}/>
          <ProtectedRoute path="/users/:usernameParam" Component={OtherUserPage} login={login} setLogin={setLogin} userAuth={userAuth}/>

          {/* Can access if they Are NOT Signed in */}
          <ProtectedLogin path="/sign-in" Component={SignIn} login={login} setLogin={setLogin} CookieService={CookieService} setAuth={setAuth} setUpdateInfo={setUpdateInfo}/>

          {/* Unprotected Can Access by Anyone */}
          <Route path="/sign-up" />
          <Route exact path="/test" component={Roster}/>
          <Route exact path="/" component={Home}/>
          <Route component={Home} />

        </Switch>
        <Footer />
    </Router>
  );
}

export default App;




function TestRemoveLater()
{
  return (
    <FullCalendar
        plugins={[ dayGridPlugin ]}
        initialView="dayGridMonth"
    />
  )
}
