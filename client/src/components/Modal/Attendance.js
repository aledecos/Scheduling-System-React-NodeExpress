import React, {useState, useEffect}  from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { Form, FormGroup, Label, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';


const Attendance = ({currentShift, setProxySelect, user, username}) => {
    //state template

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [attendanceModal, setAttendanceModal] = useState(false); // for Edit Shift
    const [attendance, setAttendance] = useState(user.attendance);

    const [eventInfo, setEventInfo] = useState(
        {
            event_id: currentShift?currentShift.event.id:"",
            username:  user?user.username:"",
            attendance: user?user.attendance:"",
        }
    );

    const dropToggle = () => setDropdownOpen(prevState => !prevState);
    const toggle = (e) => {
        if(user && currentShift)
        {
            setEventInfo(
                {
                    event_id: currentShift?currentShift.event.id:"",
                    username:  user?user.username:"",
                    attendance: user?user.attendance:"",
                }
            );
            changeAttendance("On Time");
            //Setting on and off of pop up
            setAttendanceModal(e);
        }
    }

    const changeAttendance = (e) => {
        //setting dictionary with of previous values + the new value. The dictionary will overwrite the existing e.target.name since you cannot have duplicates
        setAttendance(e);
        setEventInfo(prev => (
            {
                ...prev,
                attendance: e,
            }
        ))

    }

    const editAttendance = (e) => {

        e.preventDefault();
        const article = {
            event_id: currentShift.event.id,
            username: user.username,
            attendance: eventInfo.attendance,
            action_user: username,
        };

        axios.put('/editAttendance', article)
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

    useEffect(() => {}, [attendanceModal]);

    const openBtn = <Button color="secondary" className ="mr-1 mt-1" onClick={() => toggle(true)}>Attendance</Button> //<Button color="primary">ADD TO TRAINEE</Button>{' '}
    const closeBtn = <Button className="close" onClick = {() =>toggle(false)}>Close</Button>;

    return (

        //put UI objects here
        <div>
            {openBtn}
            <Modal isOpen={attendanceModal} toggle={() => toggle(false)} className= "">
                <ModalHeader  close={closeBtn}>{user.name} - {user.username}</ModalHeader>
                <ModalBody onSubmit = {(e) => editAttendance(e)} >
                    <Form>
                        <FormGroup>
                            <Label for="attendance">Attendance</Label>
                            <Dropdown isOpen={dropdownOpen} toggle={dropToggle}>
                                    <DropdownToggle caret>
                                        {attendance}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={() => changeAttendance("On Time")} selected>On Time</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem onClick={() => changeAttendance("Late")}>Late</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem onClick={() => changeAttendance("No Show")}>No Show</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem onClick={() => changeAttendance("Excused Absense")}>Excused Absense</DropdownItem>
                                    </DropdownMenu>
                                    </Dropdown>
                        </FormGroup>
                        <Button >Submit</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    );

}


export default Attendance;
