import React, {useEffect}  from 'react';
import axios from 'axios';
import { Button} from 'reactstrap'



const RequestSub = ({currentShift, setProxySelect, user, username}) => {
    //state template

    const RequestSub = async (e) => {

        const article = {
            event_id: currentShift.event.id,
            username: user.username,
            role: user.role,
            action_user: username,
        };

        axios.put('/requestSub', article)
        .then(response => {
            //if error from database
            if(response.status === 204)
            {
                //load events
                let storeShift = {
                    event: {
                        proxy: 'yes',
                        id: currentShift.event.id,
                        title: currentShift.event.title,
                        start: currentShift.event.start,
                        end: currentShift.event.end,
                        startStr: currentShift.event.startStr,
                        endStr: currentShift.event.endStr,
                    }
                }

                //load events
                setProxySelect(storeShift);
            }
            else{
                console.log("Error in DB")
            }
        });



    }


    useEffect(() => {

    }, [currentShift]);

    const removeButton = <Button color="danger" className ="mr-1 mt-1" onClick={() => RequestSub()}>SubReq</Button>

    return (

        //put UI objects here
        <div>
            {removeButton}
        </div>
    );

}


export default RequestSub;
