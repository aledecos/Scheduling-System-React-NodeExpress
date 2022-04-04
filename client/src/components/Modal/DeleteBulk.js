import React, {useState, useEffect}  from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { CustomInput, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserDescription } from '../../components/Elements/Elements'


const DeleteShift = ({BulkEventDeleteModal, setBulkEventDeleteModal, currentShift, setUpdater}) => {
    //state template

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [startDate, setStartDate] = useState((currentShift)?currentShift.event.start: new Date());
    const [endDate, setEndDate] = useState((currentShift)?currentShift.event.end: new Date());
    const [eventsAltered, setEventsAltered] = useState([]);

    const [Sunday, setSunday] = useState(false);
    const [Monday, setMonday] = useState(false);
    const [Tuesday, setTuesday] = useState(false);
    const [Wednesday, setWednesday] = useState(false);
    const [Thursday, setThursday] = useState(false);
    const [Friday, setFriday] = useState(false);
    const [Saturday, setSaturday] = useState(false);

    const [eventInfo, setEventInfo] = useState(
        {

        }
    );

    const toggle = (e) => {
        setEventInfo(
            {

            }
        );
        //Setting on and off of pop up
        setStartDate((currentShift)?currentShift.event.start: new Date());
        setEndDate((currentShift)?currentShift.event.end: new Date());
        setSunday(false);
        setMonday(false);
        setTuesday(false);
        setWednesday(false);
        setThursday(false);
        setFriday(false);
        setSaturday(false);
        setBulkEventDeleteModal(e);
    }

    const DeleteEvent = async (e) =>  {
        // //Refer to
        // //https://www.w3schools.com/sql/sql_autoincrement.asp
        e.preventDefault();

        let URL = "";
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

        const weekdays = (Sunday? "$Sunday":"")+(Monday? "$Monday":"")+(Tuesday? "$Tuesday":"")+(Wednesday? "$Wednesday":"")+(Thursday? "$Thursday":"")+
                  (Friday? "$Friday":"")+(Saturday? "$Saturday":"");

        const startAndEnd = startString + '$' + endString;
        URL = '/deleteEventGroup/' + startAndEnd + weekdays;

        axios.delete(URL)
        .then(response => {
            //if error from database
            if(response.status === 204)
            {
                //Rerender the Calendar
                setUpdater(true);
                //Setting on and off of pop up
                toggle(false);
            }
            else{
                console.log("Error in DB")
            }
        })

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

    }, [startDate, endDate, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]);

    const openBtn = <Button color="danger" onClick={() => toggle(true)}>Bulk Delete Shifts</Button>
    const closeBtn = <Button className="close" onClick = {() =>toggle(false)}>Close</Button>;
    //<Form onSubmit={}>

    return (

        //put UI objects here
        <>
            {openBtn}
            <Modal isOpen={BulkEventDeleteModal} toggle={() => toggle(false)} className= "">
                <ModalHeader  close={closeBtn}> DELETE Event Name: {(currentShift)?currentShift.event.title:""} </ModalHeader>
                <ModalBody>
                    <Form onSubmit= {(e) => DeleteEvent(e)}>
                          <div>
                            <UserDescription>From: </UserDescription>
                            <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                          </div>
                          <div>
                            <UserDescription>To: </UserDescription>
                            <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
                          </div>
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
                          <div>
                            <Input type="select" name="selectedShadow" id="exampleSelectMulti" readOnly={true} size="5" required>
                              {eventRender()}
                            </Input>
                          </div>
                        <Button>Delete Shifts?</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    );

}


export default DeleteShift;
