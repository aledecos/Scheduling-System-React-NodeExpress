import  React, {useEffect} from 'react';
import RemoveUser from './RemoveUser'
import './Table.css'
import {Table} from 'reactstrap';

const UserTable = ({currentShift, userlist, setProxySelect, name, userAuth}) => {

    const UsersToRender = () => {
        let i = 0;
        return userlist.map(user => (
            <tr key={i++}>
                <td className='userText'>{user.name}</td>
                {(userAuth.username === user.username || userAuth.user_type === "System Admin" || userAuth.user_type === "Hill Admin")?
                    <td><RemoveUser currentShift={currentShift} setProxySelect={setProxySelect} user={user}/></td>
                    :
                    <></>
                }
            </tr>
        ))
    }
    //will update calendar if the Add Roster Modal changes
    useEffect(() => {

    }, [userlist, currentShift]);


    return (
        <>
            <div className='tableFixHeader'>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {UsersToRender()}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default UserTable
