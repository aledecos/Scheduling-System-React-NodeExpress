import React, {useState, useEffect}  from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { Form, FormGroup, Label, Input } from 'reactstrap';


const AssignArea = ({currentShift, setProxySelect, user, username}) => {
    //state template

    const [Areas, setAreas] = useState(false);
    const [AssignAreaModal, setAssignAreaModal] = useState(false); // for Edit Shift

    const [eventInfo, setEventInfo] = useState(
        {
            event_id: currentShift?currentShift.event.id:"",
            username:  user?user.username:"",
            selectedArea: user?user.area:"",
        }
    );

    const toggle = (e) => {
        if(user && currentShift)
        {
            setEventInfo(
                {
                    event_id: currentShift?currentShift.event.id:"",
                    username:  user?user.username:"",
                    selectedArea: user?user.area:"",
                }
            );
            //Setting on and off of pop up
            setAssignAreaModal(e);
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

    const editArea = (e) => {

        e.preventDefault();

        const article = {
            event_id: currentShift.event.id,
            username: user.username,
            area: eventInfo.selectedArea,
            action_user: username, 
        };
        console.log(eventInfo.selectedArea)
        axios.put('/editArea', article)
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
        if(Areas.length !== 0 && Areas)
        {
            let userOptionRender = [];

            for(let i = 0; i< Areas.length; i++)
            {
                userOptionRender.push(<option key={i}>{Areas[i].area}</option>)
            }
            return userOptionRender;
        }
        else
            return;
    }


    useEffect(() => {
        if(AssignAreaModal)
        {
            axios.get('/getAreas')
            .then(response => {
                // If request is good...
                setAreas(response.data);
            })
            .catch((error) => {
                console.log('error ' + error);
            });
        }

    }, [AssignAreaModal]);

    const openBtn = <Button color="primary" className ="mr-1 mt-1" onClick={() => toggle(true)}>Area</Button> //<Button color="primary">ADD TO TRAINEE</Button>{' '}
    const closeBtn = <Button className="close" onClick = {() =>toggle(false)}>Close</Button>;

    return (

        //put UI objects here
        <div>
            {openBtn}
            <Modal isOpen={AssignAreaModal} toggle={() => toggle(false)} className= "">
                <ModalHeader  close={closeBtn}>Assign Area</ModalHeader>
                <ModalBody onSubmit = {(e) => editArea(e)} >
                    <Form>
                        <FormGroup>
                            <Label for="selectedArea">{}</Label>
                            <Input type="select" name="selectedArea" id="exampleSelectMulti" onChange={onChange} size="5" required>
                                {userRender()}
                            </Input>
                        </FormGroup>
                        <Button >Submit</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    );

}


export default AssignArea;
