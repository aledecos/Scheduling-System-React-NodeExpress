import React, {useEffect}  from 'react';
import axios from 'axios';
import { Button} from 'reactstrap'
import './Table.css'


const UnavailableShift = ({currentShift, setProxySelect, name, username, user_type}) => {
    //state template

    const signUp = (e) => {
        if(currentShift)
        {
            const article = {
                event_id: currentShift.event.id,
                event_name: currentShift.event.title,
                username: username,
                name: name,
                user_type: user_type,
                role: "Unavailable",
                comment: "",
                trainer: false,
                action_user: username,
            }


            axios.put('/addToEventLog', article)
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

    }


    useEffect(() => {

    }, [currentShift]);

    const unavailButton = <Button color="warning" onClick={() => signUp()}>Unavailable</Button>

    return (

        //put UI objects here
        <div>
            {unavailButton}
        </div>
    );

}


export default UnavailableShift;
