import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Container } from '../Elements/Elements';
import CSPLogo from '../../images/CSP-logo.png'

export const HeaderNav = styled.nav`
    background: #101522;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size:1.2rem;
    position: sticky;
    top: 0;
    z-index: 999;
`;

export const HeaderContainer = styled(Container)`
    display: flex;
    justify-content: space-between;
    height: 80px;
    ${Container}
`;

export const HeaderLogo = styled(Link)`
    color: #fff;
    cursor: pointer;
    text-decoration: none;
    font-size: 2.2rem;
    display: flex;
    align-items: center;
    margin: auto 0;
    
    &:hover {
        color: #fff;
        text-decoration: none;
    }
`;

export const HeaderIcon = styled.img.attrs({
    src: `${CSPLogo}`
})`
    width: 35px;
    height: 35px;
    margin-right: 0.5rem;
`;

export const HeaderMobileIcon = styled.div`
    display: none;
    @media screen and (max-width: 960px) {
        display: flex;
        font-size: 1.8rem;
        cursor: pointer;
        margin: auto 0;
    }
`;

export const HeaderMenu = styled.ul`
    display: flex;
    margin: auto 0;
    align-items: center;
    list-style: none;
    text-align: center;
    @media screen and (max-width: 960px) {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 90vh;
        position: absolute;
        top: 80px;
        left: ${({click}) => (click ? 0 : '-100%')}; //click it? show value : disappear
        opacity: 1;
        transition: all 0.5s ease;
        background: #101522;
        padding: 0;
    }
`;

export const HeaderItem = styled.li`
    height: 80px;
    &:hover {
    }
    @media screen and (max-width: 960px) {
        width: 100%;

        &:hover {
            border: none
        }
    }
`;

export const HeaderLinks = styled(Link)`
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0.5rem 1rem;
    height: 100%;
    border: 5px solid transparent;
    &:hover {
        color: #4b59f7;
        text-decoration: none;
        border-bottom: 5px solid #4b59f7;
    }

    @media screen and (max-width: 960px) {
        text-align: center;
        padding: 2rem;
        width: 100%;
        display: table;

        &:hover {
            color: #4b59f7;
            transition: all 0.3s ease;
            text-decoration: none;
            border-bottom: 5px solid transparent;
        }

        
    }
`;

export const HeaderItemButton = styled.li`
    @media screen and (max-width: 960px) {
        display: flex;
        justifiy-content: center;
        align-items: center;
        width: 100%;
        height: 120px;
    }
`;

export const HeaderButtonLink = styled(Link)`
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    padding: 8px 16px;
    height: 100%;
    width: 100%;
    border: none;
    outline: none;

    &:hover {
        text-decoration: none;
    }
`;
