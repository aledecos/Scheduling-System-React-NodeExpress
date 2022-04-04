import  React, {useEffect} from 'react';
import AssignArea from '../Modal/AssignArea'
import Attendance from '../Modal/Attendance'
import Comment from '../Modal/Comment'
import RemoveUser from './RemoveUser'
import RequestSub from './RequestSub'
import {Subtitle, TableCard} from'../Elements/Elements'
import './Table.css'

import { Button, Table} from 'reactstrap';
import { Link, Route } from 'react-router-dom';

const RosterUserTable = ({currentShift, setCurrentShift, setProxySelect, rosteredList, userAuth}) => {

    const rosteredUsersToRender = () => {
        let i = 0;
        return rosteredList.map(rosteredUser => (
            <tr key={i++}>
                <td className='userText'><Link to={'/users/' + rosteredUser.username}>{rosteredUser.name}</Link></td>
                <td className='userText'>{rosteredUser.area}</td>
                <td className='userText'>{(rosteredUser.trainer)?"Trainer":""}</td>
                <td className='userText'>{(rosteredUser.timestamp_subrequest !== '0000-00-00 00:00:00')?'X':''}</td>
                <td className='userText'>{rosteredUser.attendance}</td>
                {(userAuth.username === rosteredUser.username)?
                    <>
                        <td >
                            <div style={{display: 'flex'}}>
                                <Comment currentShift={currentShift} setProxySelect={setProxySelect} user={rosteredUser}/>
                                <RequestSub currentShift={currentShift} setProxySelect={setProxySelect} user={rosteredUser} username={userAuth.username}/>
                            </div>
                        </td>
                    </>

                    :
                    <>
                        <td></td>
                    </>
                }
                {(userAuth.user_type === "System Admin" || userAuth.user_type === "Hill Admin")?
                    <>
                        <td>
                            <div style={{display: 'flex'}}>
                                <AssignArea currentShift={currentShift} setCurrentShift={setCurrentShift} setProxySelect={setProxySelect} user={rosteredUser} username={userAuth.username}/>
                                <Attendance currentShift={currentShift} setCurrentShift={setCurrentShift} setProxySelect={setProxySelect} user={rosteredUser} username={userAuth.username}/> 
                                <Comment currentShift={currentShift} setProxySelect={setProxySelect} user={rosteredUser}/>
                                <RemoveUser currentShift={currentShift} setProxySelect={setProxySelect} user={rosteredUser} username={userAuth.username}/>
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

    }, [rosteredList, currentShift]);


    return (
        <>
            <div className='tableFixHeader'>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Area</th>
                            <th>Trainer</th>
                            <th>SubRequest</th>
                            <th>Attendance</th>
                            <th>Actions</th>  
                            {(userAuth.user_type === "System Admin" || userAuth.user_type === "Hill Admin")?
                                <><th>Admin</th></>:<></>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {rosteredUsersToRender()}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default RosterUserTable
