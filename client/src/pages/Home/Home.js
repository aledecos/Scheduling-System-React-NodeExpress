import React from 'react';
import { 
    homeObjOne,
    homeObjThree,
 } from './Data'
import { InfoSection, Reasons } from '../../components';

const Home = () => {
    return (
        <>
            <InfoSection {...homeObjOne} />
            <InfoSection {...homeObjThree} />
            <Reasons />
        </>
    )
}

export default Home
