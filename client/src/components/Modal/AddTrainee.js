import React, {useState, useEffect}  from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { CustomInput, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';


const AddTrainee = ({AddTraineeModal , setAddTraineeModal, currentShift, setProxySelect, userAuth}) => {
    //state template

    const [Users, setUsers] = useState(false);

    const [eventInfo, setEventInfo] = useState(
        {
            event_id: currentShift?currentShift.event.id:"",
            event_name:  currentShift?currentShift.event.title:"",
            selectUser: "",
            role: "Trainee",
            comment: "",
            trainer: 0,
        }
    );

    const toggle = (e) => {
        if(currentShift)
        {
            setEventInfo(
                {
                    event_id: currentShift?currentShift.event.id:"",
                    event_name:  currentShift?currentShift.event.title:"",
                    selectUser: "",
                    role: "Trainee",
                    comment: "",
                    trainer: 0,
                }
            );
            //Setting on and off of pop up
            setAddTraineeModal(e);
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

    const AddTrainee = (e) => {
        // //Refer to
        // //https://www.w3schools.com/sql/sql_autoincrement.asp
        e.preventDefault();

        const splitting = eventInfo.selectUser.split('#').join(',').split(':').join(',').split(',')
        const name = splitting[0];
        const username = splitting[1].replace(' ', '');
        const user_type = splitting[2];
        const phone_number = splitting[3];


        const article = {
            event_id: eventInfo.event_id,
            event_name: eventInfo.event_name,
            username: username,
            name: name,
            user_type: user_type,
            phone_number: phone_number,
            role: eventInfo.role,
            comment: eventInfo.comment,
            trainer: eventInfo.trainer,
            action_user: userAuth.username,
        }

        axios.put('/addToEventLog', article)
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
        })
        .catch((error) => {
            console.log('error ' + error);
        });
    }

    const userRender = () => {
        //If it exists and it is greater than 0
        if(Users.length !== 0 && Users)
        {
            let userOptionRender = [];

            for(let i = 0; i< Users.length; i++)
            {
                userOptionRender.push(<option key={i}>{Users[i].name} #{Users[i].username}:{Users[i].user_type}:{Users[i].phone_number}</option>)
            }
            return userOptionRender;
        }
        else
            return;
    }


    useEffect(() => {
        if(AddTraineeModal)
        {
            axios.get('/getNameAndUsername/Trainee')
            .then(response => {
                // If request is good...
                setUsers(response.data);
            })
            .catch((error) => {
                console.log('error ' + error);
            });
        }

    }, [AddTraineeModal]);

    const openBtn = <Button color="primary" onClick={() => toggle(true)}>Add Trainee</Button> //<Button color="primary">ADD TO TRAINEE</Button>{' '}
    const closeBtn = <Button className="close" onClick = {() =>toggle(false)}>Close</Button>;

    return (

        //put UI objects here
        <>
            {openBtn}
            <Modal isOpen={AddTraineeModal} toggle={() => toggle(false)} className= "">
                <ModalHeader  close={closeBtn}>Add Trainee</ModalHeader>
                <ModalBody>
                    <Form  onSubmit = {(e) => AddTrainee(e)}>
                        <FormGroup>
                            <Label for="selectUser">Select Multiple</Label>
                            <Input type="select" name="selectUser" id="exampleSelectMulti" onChange={onChange} size="5" required>
                                {userRender()}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="comment">Comment</Label>
                            <Input type="text" maxLength={999} name="comment" onChange={onChange} value={eventInfo.comment} />
                        </FormGroup>
                        <Button>Submit</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    );

}


export default AddTrainee;
