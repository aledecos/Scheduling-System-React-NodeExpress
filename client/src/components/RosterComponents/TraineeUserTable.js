import  React, {useEffect} from 'react';
import AssignArea from '../Modal/AssignArea'
import AssignTrainer from '../Modal/AssignTrainer'
import Comment from '../Modal/Comment'
import RemoveUser from './RemoveUser'
import RequestSub from './RequestSub'
import Attendance from '../Modal/Attendance'
import {Table} from 'reactstrap';
import { Link } from 'react-router-dom';
import {Subtitle, TableCard} from'../Elements/Elements'
import './Table.css'

const TraineeUserTable = ({currentShift, setCurrentShift, setProxySelect, traineeList, userAuth}) => {

    const traineeUsersToRender = () => {
        let i = 0;
        return traineeList.map(traineeUser => (
            <tr key={i++}>
                <td className='userText'><Link to={'/users/' + traineeUser.username}>{traineeUser.name}</Link></td>
                <td className='userText'>{traineeUser.area}</td>
                <td className='userText'>{traineeUser.shadowing}</td>
                <td className='userText'>{(traineeUser.timestamp_subrequest !== '0000-00-00 00:00:00')?'X':''}</td>
                <td className='userText'>{traineeUser.attendance}</td>

                {(userAuth.username === traineeUser.username)?
                    <>
                        <td >
                            <div style={{display: 'flex'}}>
                                <Comment currentShift={currentShift} setProxySelect={setProxySelect} user={traineeUser}/>
                                <RequestSub currentShift={currentShift} setProxySelect={setProxySelect} user={traineeUser} username={userAuth.username}/>
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
                                <AssignArea currentShift={currentShift} setCurrentShift={setCurrentShift} setProxySelect={setProxySelect} user={traineeUser} username={userAuth.username}/>
                                <AssignTrainer currentShift={currentShift} setCurrentShift={setCurrentShift} setProxySelect={setProxySelect} user={traineeUser} username={userAuth.username}/> 
                                <Attendance currentShift={currentShift} setCurrentShift={setCurrentShift} setProxySelect={setProxySelect} user={traineeUser} username={userAuth.username}/> 
                                <Comment currentShift={currentShift} setProxySelect={setProxySelect} user={traineeUser}/>
                                <RemoveUser currentShift={currentShift} setProxySelect={setProxySelect} user={traineeUser} username={userAuth.username}/>
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

    }, [traineeList, currentShift]);


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
                        {traineeUsersToRender()}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default TraineeUserTable
