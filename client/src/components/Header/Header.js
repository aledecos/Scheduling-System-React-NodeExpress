import React, {useState, useEffect} from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { IconContext } from 'react-icons/lib'
import { Button, SignOutButton } from '../Elements/Elements'
import {
    HeaderNav,
    HeaderContainer,
    HeaderLogo,
    HeaderIcon,
    HeaderMobileIcon,
    HeaderMenu,
    HeaderItem,
    HeaderLinks,
    HeaderItemButton,
    HeaderButtonLink
} from './HeaderElements'

const Header = ({login, setLogin, userAuth, setAuth, CookieService}) => {
    const[click, setClick] = useState(false);
    const[button, setButton] = useState(true);

    const handleClick = () => setClick(!click);

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    };

    const signOutActions = () =>{
        setLogin("Not Attempted");
        setAuth({username:"", user_type: ""});
        CookieService.remove("type",'/');
    }

    const AuthenticatedHeaderLinks = (link) =>
    {
        if(userAuth.user_type === "System Admin" && link === "admin")
        {
            return (
                <>
                    <HeaderItem>
                        <HeaderLinks to='/admin'>
                            Admin
                        </HeaderLinks>
                    </HeaderItem>
                    <HeaderItem>
                        <HeaderLinks to='/area'>
                            Area
                        </HeaderLinks>
                    </HeaderItem>
                </>
            )
        }
        else if(userAuth.user_type === "Hill Admin" && link === "area")
        {
            return (
                <HeaderItem>
                    <HeaderLinks to='/area'>
                        Area
                    </HeaderLinks>
                </HeaderItem>
            )
        }
        else{
            return <></>
        }

    }

    useEffect(() => {
        showButton()
    }, [])

    window.addEventListener('resize', showButton);

    return (
        <>
        <IconContext.Provider value = {{color: '#fff'}}>
            <HeaderNav>
                <HeaderContainer>
                    <HeaderLogo to="/">
                        <HeaderIcon />
                        CSP
                    </HeaderLogo>
                    <HeaderMobileIcon onClick = {handleClick}>
                        {click ? <FaTimes /> : <FaBars />}
                    </HeaderMobileIcon>
                    <HeaderMenu onClick = {handleClick} click={click}>
                        <HeaderItem>
                            <HeaderLinks to='/'>
                                Home
                            </HeaderLinks>
                        </HeaderItem>

                        {(login === "Successful")?
                            <>
                                <HeaderItem>
                                    <HeaderLinks to='/roster/start'>
                                        Roster
                                    </HeaderLinks>
                                </HeaderItem>
                                {AuthenticatedHeaderLinks("admin")}
                                {AuthenticatedHeaderLinks("area")}
                                <HeaderItem>
                                    <HeaderLinks to='/user'>
                                        User
                                    </HeaderLinks>
                                </HeaderItem>
                                <HeaderItemButton>
                                    {button ? (
                                        <HeaderButtonLink to="/sign-in">
                                            <SignOutButton primary onClick={() =>{signOutActions()}}>
                                                SIGN OUT
                                            </SignOutButton>
                                        </HeaderButtonLink>
                                    ) :(
                                        <HeaderButtonLink to="/sign-in">
                                            <SignOutButton fontBig primary onClick={() =>{signOutActions()}}>
                                                SIGN OUT
                                            </SignOutButton>
                                        </HeaderButtonLink>
                                    )}
                                </HeaderItemButton>
                            </>
                            :
                            <>
                                <HeaderItemButton>
                                    {button ? (
                                        <HeaderButtonLink to="/sign-in">
                                            <Button primary>
                                                SIGN IN
                                            </Button>
                                        </HeaderButtonLink>
                                    ) :(
                                        <HeaderButtonLink to="/sign-in">
                                            <Button fontBig primary>
                                                SIGN IN
                                            </Button>
                                        </HeaderButtonLink>
                                    )}
                                </HeaderItemButton>

                            </>
                        }
                    </HeaderMenu>
                </HeaderContainer>
            </HeaderNav>
        </IconContext.Provider>
        </>
    )
}





export default Header
