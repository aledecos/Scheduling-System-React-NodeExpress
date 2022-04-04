import {
    Route,
    Redirect
  } from "react-router-dom";
export const ProtectedRoute = ({Component, login, setLogin, userAuth, ...rest}) => {
    return (
        <Route 
        {...rest} 
        render ={ () => 
            (login === "Successful") ?
            (
            <>
                <Component login={login} setLogin={setLogin} userAuth={userAuth}/>
            </>
            )
            :
            (
                <Redirect to='/sign-in'/>
            )
        }
        /> 
    )
}

export const ProtectedRouteSysAdmin = ({Component, login, setLogin, userAuth, ...rest}) => {
    return (
        <Route 
        {...rest} 
        render ={ () => 
            (login === "Successful") ?
            (
                (userAuth.user_type === "System Admin")?
                    <Component login={login} setLogin={setLogin} userAuth={userAuth}/>
                    :
                    <Redirect to='/roster/start'/>
            )
            :
            (
                <Redirect to='/sign-in'/>
            )
        }
        /> 
    )
}


export const ProtectedRouteHillAdmin = ({Component, login, setLogin, userAuth, ...rest}) => {
    return (
        <Route 
        {...rest} 
        render ={ () => 
            (login === "Successful") ?
            (
                (userAuth.user_type === "System Admin" || userAuth.user_type === "Hill Admin")?
                    <Component login={login} setLogin={setLogin} userAuth={userAuth}/>
                    :
                    <Redirect to='/roster/start'/>
            )
            :
            (
                <Redirect to='/sign-in'/>
            )
        }
        /> 
    )
}
  
export const ProtectedLogin = ({Component, login, setLogin, setAuth, setUpdateInfo, CookieService,...rest}) => {
    return (
        <Route 
        {...rest}
        render ={ () => 
            (login !== "Successful")?
            (
            <Component login={login} setLogin={setLogin} CookieService={CookieService} setAuth={setAuth} setUpdateInfo={setUpdateInfo}/>
            )
            :
            (
            <Redirect to='/roster/start'/>
            )
        }
        /> 
    )
}