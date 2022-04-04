import React, {useState, useEffect}  from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { Form, FormGroup, Label, Input } from 'reactstrap';


const AssignShadow = ({currentShift, setProxySelect, user, username}) => {
    //state template

    const [Users, setUsers] = useState(false);
    const [AssignShadowModal, setAssignShadowModal] = useState(false); // for Edit Shift

    const [eventInfo, setEventInfo] = useState(
        {
            event_id: currentShift?currentShift.event.id:"",
            username:  user?user.username:"",
            selectedShadow: user?user.shadowing:"",
        }
    );

    const toggle = (e) => {
        if(currentShift)
        {
            setEventInfo(
                {
                    event_id: currentShift?currentShift.event.id:"",
                    username:  user?user.username:"",
                    selectedShadow: user?user.shadowing:"",
                }
            );
            //Setting on and off of pop up
            setAssignShadowModal(e);
        }
    }


    const onChange = (e) => {
        //setting dictionary with of previous values + the new value. The dictionary will overwrite the existing e.target.name since you cannot have duplicates
        setEventInfo(prev => (
            {
                ...prev,
                [e.target.name]: e.target.value,
            }
        ))
    }

    const AddRoster = (e) => {
        // //Refer to
        // //https://www.w3schools.com/sql/sql_autoincrement.asp
        e.preventDefault();

        const article = {
            event_id: eventInfo.event_id,
            username: eventInfo.username,
            shadowing: eventInfo.selectedShadow,
            action_user: username,
        };
        axios.put('/editShadow', article)
        .then(response => {
            //if error from database
            if(response.status === 204)
            {
                //Setting on and off of pop up
                toggle(false);

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

    const userRender = () => {
        //If it exists and it is greater than 0
        if(Users.length !== 0 && Users)
        {
            let userOptionRender = [];

            for(let i = 0; i< Users.length; i++)
            {
                if(Users[i].role==='Rostered'){
                  userOptionRender.push(<option key={i}>{Users[i].name} #{Users[i].username}:{Users[i].user_type}</option>)
                }
            }
            return userOptionRender;
        }
        else
            return;
    }


    useEffect(() => {
        if(AssignShadowModal)
        {
            axios.get('/getEventLogInfo/' + eventInfo.event_id)
            .then(response => {
                // If request is good...
                setUsers(response.data);
            })
            .catch((error) => {
                console.log('error ' + error);
            });
        }

    }, [AssignShadowModal]);

    const openBtn = <Button color="warning" className = "mt-1" onClick={() => toggle(true)}>Shadow</Button> //<Button color="primary">ADD TO ROSTER</Button>{' '}
    const closeBtn = <Button className="close" onClick = {() =>toggle(false)}>Close</Button>;

    return (

        //put UI objects here
        <>
            {openBtn}
            <Modal isOpen={AssignShadowModal} toggle={() => toggle(false)} className= "">
                <ModalHeader  close={closeBtn}>Assign User to Shadow:</ModalHeader>
                <ModalBody>
                    <Form onSubmit = {(e) => AddRoster(e)} >
                        <FormGroup>
                            <Label for="selectedShadow">Select</Label>
                            <Input type="select" name="selectedShadow" id="exampleSelectMulti" onChange={onChange} size="5" required>
                                {userRender()}
                            </Input>
                        </FormGroup>
                        <Button >Submit</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    );

}


export default AssignShadow;
