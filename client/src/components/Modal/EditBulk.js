import React, {useState, useEffect}  from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, Dropdown, DropdownItem, DropdownToggle, DropdownMenu} from 'reactstrap'
import { CustomInput, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserDescription } from '../../components/Elements/Elements'


const EditShift = ({BulkEditModal , setBulkEditModal, currentShift, setProxySelect, shiftInfo, setUpdater, setCurrentShift}) => {
    //state template
    const [Sunday, setSunday] = useState(false);
    const [Monday, setMonday] = useState(false);
    const [Tuesday, setTuesday] = useState(false);
    const [Wednesday, setWednesday] = useState(false);
    const [Thursday, setThursday] = useState(false);
    const [Friday, setFriday] = useState(false);
    const [Saturday, setSaturday] = useState(false);
    const [startDate, setStartDate] = useState((currentShift)?currentShift.event.start: new Date());
    const [endDate, setEndDate] = useState((currentShift)?currentShift.event.end: new Date());
    const [eventsAltered, setEventsAltered] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

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
        setBulkEditModal(e);
        setEventInfo(
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
        )
        setStartDate((currentShift)?currentShift.event.start: new Date());
        setEndDate((currentShift)?currentShift.event.end: new Date());
        setSunday(false);
        setMonday(false);
        setTuesday(false);
        setWednesday(false);
        setThursday(false);
        setFriday(false);
        setSaturday(false);
    }

    const dropToggle = () => setDropdownOpen(prevState => !prevState);

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
        };
        let currentTempStart = new Date(startDate)
        currentTempStart = new Date(currentTempStart.getTime() + currentTempStart.getTimezoneOffset() * 60000);
        let newTempStart = new Date(currentTempStart.getTime());

        let currentTempEnd = new Date(endDate)
        currentTempEnd = new Date(currentTempEnd.getTime() + currentTempEnd.getTimezoneOffset() * 60000);
        let newTempEnd = new Date(currentTempEnd.getTime());

        //start String
        let month = newTempStart.getMonth()+1;
        let startString = newTempStart.getFullYear() + "-" + ((month < 10)?'0'+ month : month) + "-" + ((newTempStart.getDate() < 10)?'0'+ newTempStart.getDate() : newTempStart.getDate());

        //End String
        month = newTempEnd.getMonth()+1;
        let endString = newTempEnd.getFullYear() + "-" + ((month < 10)?'0'+ month : month) + "-" + ((newTempEnd.getDate() < 10)?'0'+ newTempEnd.getDate() : newTempEnd.getDate());

        const startAndEnd = startString + '$' + endString;
        const weekdays = (Sunday? "$Sunday":"")+(Monday? "$Monday":"")+(Tuesday? "$Tuesday":"")+(Wednesday? "$Wednesday":"")+(Thursday? "$Thursday":"")+
                  (Friday? "$Friday":"")+(Saturday? "$Saturday":"");

        axios.put('/editGroupEvent/' + startAndEnd + weekdays, article)
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

    const eventRender = () => {
      //If it exists and it is greater than 0
      if(eventsAltered.length !== 0 && eventsAltered)
      {
          let eventOptionRender = [];

          for(let i = 0; i< eventsAltered.length; i++)
          {
              eventOptionRender.push(<option key={i}>{eventsAltered[i].event_name}: {eventsAltered[i].start_date.split("T")[0]}</option>)
          }
          return eventOptionRender;
      }
      else
          return;
    }

    useEffect(() => {
      let currentTempStart = new Date(startDate)
      currentTempStart = new Date(currentTempStart.getTime() + currentTempStart.getTimezoneOffset() * 60000);
      let newTempStart = new Date(currentTempStart.getTime());

      let currentTempEnd = new Date(endDate)
      currentTempEnd = new Date(currentTempEnd.getTime() + currentTempEnd.getTimezoneOffset() * 60000);
      let newTempEnd = new Date(currentTempEnd.getTime());

      //start String
      let month = newTempStart.getMonth()+1;
      let startString = newTempStart.getFullYear() + "-" + ((month < 10)?'0'+ month : month) + "-" + ((newTempStart.getDate() < 10)?'0'+ newTempStart.getDate() : newTempStart.getDate());

      //End String
      month = newTempEnd.getMonth()+1;
      let endString = newTempEnd.getFullYear() + "-" + ((month < 10)?'0'+ month : month) + "-" + ((newTempEnd.getDate() < 10)?'0'+ newTempEnd.getDate() : newTempEnd.getDate());

      const startAndEnd = startString + '$' + endString;
      const weekdays = (Sunday? "$Sunday":"")+(Monday? "$Monday":"")+(Tuesday? "$Tuesday":"")+(Wednesday? "$Wednesday":"")+(Thursday? "$Thursday":"")+
                (Friday? "$Friday":"")+(Saturday? "$Saturday":"");

      axios.get('/eventsAltered/' + startAndEnd + weekdays)
      .then(response => {
          //if error from database
          if(response.status === 200)
          {
              setEventsAltered(response.data);
          }
          else if(response.status === 204)
          {
              setEventsAltered([]);
          }
          else{
              console.log("Error in DB")
          }
      })
      .catch((error) => {
          setEventsAltered([]);
          console.log(error);
      });
    }, [BulkEditModal, currentShift, eventInfo, startDate, endDate, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]);


    const openBtn = <Button color="info" onClick={() => toggle(true)}>Bulk Edit Shifts</Button>
    const closeBtn = <Button className="close" onClick = {() =>toggle()}>Close</Button>;
    //<Form onSubmit={}>

    return (

        //put UI objects here
        <div>
            {openBtn}
            <Modal isOpen={BulkEditModal} toggle={() => toggle(false)} className= "">
                <ModalHeader  close={closeBtn}>Event Start: {BulkEditModal?showDate("start"):""} <br/> Event End: {BulkEditModal?showDate("end"):""}</ModalHeader>
                <ModalBody>
                    <Form onSubmit= {(e) => EditEvent(e)} >
                        <FormGroup>
                            <Label for="eventName">Event Name</Label>
                            <Input type="text" name="event_name" onChange={onChange} value={eventInfo.event_name}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="min_patrollers">Min Patrollers</Label>
                            <Input min={0} max={eventInfo.max_patrollers} type="number" name="min_patrollers" onChange={onChange} value={eventInfo.min_patrollers}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="max_patrollers">Max Patrollers</Label>
                            <Input min={0} type="number" name="max_patrollers" onChange={onChange} value={eventInfo.max_patrollers}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="max_trainees">Max Trainees</Label>
                            <Input min={0} type="number" name="max_trainees" onChange={onChange} value={eventInfo.max_trainees}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="all_day" check>Urgent Day<br/></Label>
                            <CustomInput  type="switch" name="all_day" id="exampleCheck" onChange={onSwitch} checked={eventInfo.all_day}/>
                        </FormGroup>
                        <FormGroup>
                          <UserDescription>From: </UserDescription>
                          <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                        </FormGroup>
                        <FormGroup>
                          <UserDescription>To: </UserDescription>
                          <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
                        </FormGroup>
                        <FormGroup check inline>
                          <Label check>
                            <Input type="checkbox" id="Sunday" onChange={(e) => {setSunday(e.target.checked)}}/> Sunday
                          </Label>
                        </FormGroup>
                        <FormGroup check inline>
                          <Label check>
                             <Input type="checkbox" id="Monday" onChange={(e) => {setMonday(e.target.checked)}}/> Monday
                          </Label>
                        </FormGroup>
                        <FormGroup check inline>
                          <Label check>
                            <Input type="checkbox" id="Tuesday" onChange={(e) => {setTuesday(e.target.checked)}}/> Tuesday
                          </Label>
                        </FormGroup>
                        <FormGroup check inline>
                          <Label check>
                            <Input type="checkbox" id="Wednesday" onChange={(e) => {setWednesday(e.target.checked)}}/> Wednesday
                          </Label>
                        </FormGroup>
                        <FormGroup check inline>
                          <Label check>
                            <Input type="checkbox" id="Thursday" onChange={(e) => {setThursday(e.target.checked)}}/> Thursday
                          </Label>
                        </FormGroup>
                        <FormGroup check inline>
                          <Label check>
                           <Input type="checkbox" id="Friday" onChange={(e) => {setFriday(e.target.checked)}}/> Friday
                          </Label>
                        </FormGroup>
                        <FormGroup check inline>
                          <Label check>
                            <Input type="checkbox" id="Saturday" onChange={(e) => {setSaturday(e.target.checked)}}/> Saturday
                          </Label>
                        </FormGroup>
                        <FormGroup>
                          <Input type="select" name="selectedShadow" id="exampleSelectMulti" readOnly={true} size="5" required>
                            {eventRender()}
                          </Input>
                        </FormGroup>

                        <Button>Submit</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    );

}


export default EditShift;
