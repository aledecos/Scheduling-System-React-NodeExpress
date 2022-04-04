import React, {useState, useEffect}  from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, Dropdown, DropdownItem, DropdownToggle, DropdownMenu} from 'reactstrap'
import { CustomInput, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';


const EditShift = ({EditShiftModal , setEditShiftModal, currentShift, setProxySelect, shiftInfo, setUpdater, setCurrentShift, username}) => {
    //state template

    const [eventInfo, setEventInfo] = useState(
        {
            event_name: "",
            start_date:  "",
            end_date:  "",
            min_patrollers:  "",
            max_patrollers:  "",
            max_trainees:  "",
            selectUser: "",
            all_day:  false,
        }
    );

    const toggle = (e) => {
        //Setting on and off of pop up
        if(currentShift)
        {
            setEditShiftModal(e);
            setEventInfo(
                {
                    event_name: shiftInfo?shiftInfo.event_name:"",
                    start_date: currentShift?currentShift.event.startStr:"",
                    end_date: currentShift?currentShift.event.endStr:"",
                    min_patrollers: shiftInfo?shiftInfo.min_pat:"",
                    max_patrollers: shiftInfo?shiftInfo.max_pat:"",
                    max_trainees: shiftInfo?shiftInfo.max_trainee:"",
                    selectUser: shiftInfo?shiftInfo.hl:"",
                    all_day: shiftInfo?((shiftInfo.all_day==='1')?true:false):"",
                }
            )
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
    const onSwitch = (e) => {
        //setting dictionary with of previous values + the new value. The dictionary will overwrite the existing e.target.name since you cannot have duplicates
        setEventInfo(prev => (
            {
                ...prev,
                [e.target.name]: e.target.checked,
            }
        ))
    }

    const showDate = (e) => {
        if(currentShift)
        {
            if(e === "start")
                return currentShift.event.startStr
            else
                return currentShift.event.endStr
        }

    }

    const EditEvent = async (e) => {
        // //Refer to
        // //https://www.w3schools.com/sql/sql_autoincrement.asp
        e.preventDefault();

        const article = {
            event_id: currentShift.event.id,
            event_name: eventInfo.event_name,
            allDay: eventInfo.all_day, //Specifies whether shift will be an all day shift
            min_patrollers: eventInfo.min_patrollers,
            max_patrollers: eventInfo.max_patrollers,
            max_trainees: eventInfo.max_trainees,
            selectUser: eventInfo.selectUser,
            action_user: username,
        };
        axios.put('/editEvent', article)
        .then(response => {
            //if error from database
            if(response.status === 204)
            {
                //Setting on and off of pop up
                toggle(false);
                //load events
                setUpdater(true);

                //do this since to select a shift again in proxy and update we must have current.event.id != clickedInfo.event.id in Rostered services proxy select
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

                //update Shift infos
                setProxySelect(storeShift);
            }
            else{
                console.log("Error in DB")
            }
        });

    }


    useEffect(() => {

    }, [EditShiftModal, currentShift, eventInfo]);


    const openBtn = <Button color="info" onClick={() => toggle(true)}>Edit Shift</Button>
    const closeBtn = <Button className="close" onClick = {() =>toggle()}>Close</Button>;
    //<Form onSubmit={}>

    return (

        //put UI objects here
        <div>
            {openBtn}
            <Modal isOpen={EditShiftModal} toggle={() => toggle(false)} className= "">
                <ModalHeader  close={closeBtn}>Event Start: {EditShiftModal?showDate("start"):""} <br/> Event End: {EditShiftModal?showDate("end"):""}</ModalHeader>
                <ModalBody>
                    <Form onSubmit= {(e) => EditEvent(e)} >
                        <FormGroup>
                            <Label for="eventName">Event Name</Label>
                            <Input type="text" name="event_name" onChange={onChange} value={eventInfo.event_name} required/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="min_patrollers">Min Patrollers</Label>
                            <Input min={0} max={eventInfo.max_patrollers} type="number" name="min_patrollers" onChange={onChange} value={eventInfo.min_patrollers} required/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="max_patrollers">Max Patrollers</Label>
                            <Input min={0} type="number" name="max_patrollers" onChange={onChange} value={eventInfo.max_patrollers} required/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="max_trainees">Max Trainees</Label>
                            <Input min={0} type="number" name="max_trainees" onChange={onChange} value={eventInfo.max_trainees} required/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="all_day" check>Urgent Day<br/></Label>
                            <CustomInput  type="switch" name="all_day" id="exampleCheck" onChange={onSwitch} checked={eventInfo.all_day}/>
                        </FormGroup>

                        <Button>Submit</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    );

}


export default EditShift;
