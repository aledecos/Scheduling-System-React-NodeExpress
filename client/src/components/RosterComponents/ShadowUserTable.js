import  React, {useEffect} from 'react';
import AssignArea from '../Modal/AssignArea'
import AssignShadow from '../Modal/AssignShadow'
import Comment from '../Modal/Comment'
import RemoveUser from './RemoveUser'
import {Subtitle, TableCard} from'../Elements/Elements'
import './Table.css'

import {Table} from 'reactstrap';

const ShadowUserTable = ({currentShift, setCurrentShift, setProxySelect, shadowList, userAuth}) => {

    const shadowUsersToRender = () => {
        let i = 0;
        return shadowList.map(shadowUser => (
            <tr key={i++}>
                <td className='userText'>{shadowUser.name}</td>
                <td className='userText'>{shadowUser.phone_number}</td>
                <td className='userText'>{shadowUser.email}</td>
                <td className='userText'>{shadowUser.area}</td>
                <td className='userText'>{shadowUser.shadowing}</td>
                <td ><div style={{display: 'flex'}}><Comment currentShift={currentShift} setProxySelect={setProxySelect} user={shadowUser}/></div></td>
                    
                
                {(userAuth.user_type === "System Admin" || userAuth.user_type === "Hill Admin")?
                    <>
                        <td>
                            <div style={{display: 'flex'}}>
                                <AssignArea currentShift={currentShift} setCurrentShift={setCurrentShift} setProxySelect={setProxySelect} user={shadowUser} username={userAuth.username}/> 
                                <AssignShadow currentShift={currentShift} setCurrentShift={setCurrentShift} setProxySelect={setProxySelect} user={shadowUser} username={userAuth.username}/> 
                                <RemoveUser currentShift={currentShift} setProxySelect={setProxySelect} user={shadowUser} username={userAuth.username}/>
                            </div>
                            
                        </td>
                    </>
                    :
                    <>
                        <td></td>
                    </>
                }

            </tr>

        ))
    }

    //will update calendar if the Add Roster Modal changes
    useEffect(() => {

    }, [shadowList, currentShift]);


    return (
        <>
            <div className='tableFixHeader'>
                <Table >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Area</th>
                            <th>Shadowing</th>
                            <th>Actions</th>  
                            {(userAuth.user_type === "System Admin" || userAuth.user_type === "Hill Admin")?
                                <><th>Admin</th></>:<></>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {shadowUsersToRender()}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default ShadowUserTable
