import  React, {useEffect} from 'react';

import './Table.css'
import {Table} from 'reactstrap';

const ActionTable = ({currentShift, actionLog}) => {

    const UsersToRender = () => {
        let i = 0;
        return actionLog.map(action => (
            <tr key={i++}>
                <td className='userText'>{action.result}</td>
                <td className='userText'>{action.timestamp_action}</td>
            </tr>
        ))
    }
    //will update calendar if the Add Roster Modal changes
    useEffect(() => {

    }, [actionLog, currentShift]);


    return (
        <>
            <div className='tableFixHeader'>
                <Table>
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Timetamp</th>
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

export default ActionTable
