import React, {useState, useEffect}  from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { CustomInput, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserDescription } from '../../components/Elements/Elements'

const MainAddEvent = ({EventAddModal, setEventAddModal, selectedDate, setSelectedDate, setUpdater, username}) => {
    //state template

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [Reoccuriung, setReoccuriung] = useState("None");
    const [startDateChange, setStartDateChange] = useState(false);
    const [endDateChange, setEndDateChange] = useState(false);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [Sunday, setSunday] = useState(false);
    const [Monday, setMonday] = useState(false);
    const [Tuesday, setTuesday] = useState(false);
    const [Wednesday, setWednesday] = useState(false);
    const [Thursday, setThursday] = useState(false);
    const [Friday, setFriday] = useState(false);
    const [Saturday, setSaturday] = useState(false);


    const [eventInfo, setEventInfo] = useState(
        {
            event_name: "",
            start_date: "",
            end_date: "",
            min_patrollers: "",
            max_patrollers: "",
            max_trainees: "",
            hl_user: "",
            reoccuriung: "Single",
            all_day: false,
        }
    );

    const dropToggle = () => setDropdownOpen(prevState => !prevState);
    const toggle = (e) => {
        setEventInfo(
            {
                event_name: "",
                start_date: "",
                end_date: "",
                min_patrollers: "",
                max_patrollers: "",
                max_trainees: "",
                hl_user: "",
                reoccuriung: "Single",
                all_day: false,
            }
        );
        setReoccuriung("None");
        //Setting on and off of pop up
        setEventAddModal(e);
        //reset the selected Date
        if(e === false)
        {
            setSelectedDate(null);
        }
        setSunday(false);
        setMonday(false);
        setTuesday(false);
        setWednesday(false);
        setThursday(false);
        setFriday(false);
        setSaturday(false);
        setStartDateChange(false);
        setEndDateChange(false);
    }


    const changeReoccuring = (e) => {
        //setting dictionary with of previous values + the new value. The dictionary will overwrite the existing e.target.name since you cannot have duplicates
        setReoccuriung(e);
        setEventInfo(prev => (
            {
                ...prev,
                reoccuriung: e,
            }
        ))

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
        if(e === "start")
        {
            return selectedDate.startStr
        }
        else if (e === "end")
        {
            return selectedDate.endStr
        }
        else if (e === "startDate")
        {
            if(startDateChange)
            {
                return startDate;
            }
            else
            {
                return new Date(selectedDate.endStr);
            }
        }
        else if (e === "endDate")
        {
          if(endDateChange)
          {
              return endDate;
          }
          else
          {
              return new Date(selectedDate.endStr);
          }
        }

    }

    const addEventHelper = async (article) => {
      await axios.put('/addToEvent', article)
      .then(response => {

          //if error from database
          if(response.status === 200)
          {
              //Setting on and off of pop up
              toggle(false);
          }
          else{
              console.log("Error in DB")
          }
      });
    }

    const AddEvent = async (e) =>  {
        // //Refer to
        // //https://www.w3schools.com/sql/sql_autoincrement.asp
        e.preventDefault();

        /***One Shift */
        if(eventInfo.reoccuriung === "Single")
        {
          let article = {
              event_name: eventInfo.event_name,
              start: selectedDate.startStr, //Specifies start date
              end: selectedDate.endStr, //Specifies end date
              allDay: eventInfo.all_day, //Specifies whether shift will be an all day shift
              min_patrollers: eventInfo.min_patrollers,
              max_patrollers: eventInfo.max_patrollers,
              max_trainees: eventInfo.max_trainees,
              username: username,
              action_user: username,
          };
          addEventHelper(article);
        }

        /***Reoccuring SHIFTS */
        if(eventInfo.reoccuriung !== "Single")
        {
            startDate.setHours(0,0,0);
            let storeStartDate = startDate;
            let storeEndDate = startDate;
            storeStartDate = new Date(storeStartDate.getTime() + storeStartDate.getTimezoneOffset() * 60000);
            // End Date is just 1 day after start date
            storeEndDate = new Date(storeEndDate.getTime() + storeEndDate.getTimezoneOffset() * 60000 + 24 * 60 * 60 * 1000);
            let pivotStartDate = storeStartDate; // just placeholder could be null
            let pivotEndDate = storeEndDate; // just placeholder could be null

            let addEndDate = endDate;
            addEndDate = new Date(addEndDate.getTime() + addEndDate.getTimezoneOffset() * 60000);

            eventInfo.reoccur_num = (addEndDate.getTime() - storeStartDate.getTime()) / (1000 * 60 * 60 * 24);

            for(let i = 0; i < eventInfo.reoccur_num; i++)
            {
                let repeatArticle = {
                    event_name: eventInfo.event_name,
                    start: selectedDate.startStr, //Specifies start date
                    end: selectedDate.endStr, //Specifies end date
                    allDay: eventInfo.all_day, //Specifies whether shift will be an all day shift
                    min_patrollers: eventInfo.min_patrollers,
                    max_patrollers: eventInfo.max_patrollers,
                    max_trainees: eventInfo.max_trainees,
                    username: username,
                    action_user: username
                };
                //start
                let month = storeStartDate.getMonth()+1;
                repeatArticle.start = storeStartDate.getFullYear() + "-" + month + "-" + storeStartDate.getDate();

                //end
                month = storeEndDate.getMonth()+1;
                repeatArticle.end = storeEndDate.getFullYear() + "-" + month + "-" + storeEndDate.getDate();

                switch(storeStartDate.getDay()) {
                  case 0:
                    if(Sunday){
                      addEventHelper(repeatArticle);
                    }
                    break;
                  case 1:
                    if(Monday){
                      addEventHelper(repeatArticle);
                    }
                    break;
                  case 2:
                    if(Tuesday){
                      addEventHelper(repeatArticle);
                    }
                    break;
                  case 3:
                    if(Wednesday){
                      addEventHelper(repeatArticle);
                    }
                    break;
                  case 4:
                    if(Thursday){
                      addEventHelper(repeatArticle);
                    }
                    break;
                  case 5:
                    if(Friday){
                      addEventHelper(repeatArticle);
                    }
                    break;
                  case 6:
                    if(Saturday){
                      addEventHelper(repeatArticle);
                    }
                    break;

                }

                //start
                pivotStartDate = new Date(storeStartDate.getTime() + 24 * 60 * 60 * 1000);
                month = pivotStartDate.getMonth()+1;

                //end
                pivotEndDate = new Date(storeEndDate.getTime() + 24 * 60 * 60 * 1000);
                month = pivotEndDate.getMonth()+1;

                //next entry
                storeStartDate = pivotStartDate;
                storeEndDate = pivotEndDate;
            }
        }
        setUpdater(true);
    }

    useEffect(() => {


    }, [eventInfo]);

    const closeBtn = <Button className="close" onClick = {() =>toggle()}>Close</Button>;
    //<Form onSubmit={}>

    return (

        //put UI objects here
        <div>
            <Modal isOpen={EventAddModal} toggle={() => toggle(false)} className= "">
                <ModalHeader  close={closeBtn}>Event Start: {EventAddModal?showDate("start"):""} <br/> Event End: {EventAddModal?showDate("end"):""}</ModalHeader>
                <ModalBody>
                    <Form onSubmit= {(e) => AddEvent(e)} >
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
                        <Row form>
                            <Col md={3}>
                                <FormGroup check>
                                    <Label for="all_day" check>Urgent Day<br/></Label>
                                    <CustomInput  type="switch" name="all_day" id="exampleCheck" onChange={onSwitch} />
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup inline>
                                    <Label for="user_type">Reoccuring</Label>
                                    <Dropdown isOpen={dropdownOpen} toggle={dropToggle} value={Reoccuriung}>
                                    <DropdownToggle caret>
                                        {Reoccuriung}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={() => changeReoccuring("Single")} selected>Single</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem onClick={() => changeReoccuring("Multiple")}>Multiple</DropdownItem>
                                    </DropdownMenu>
                                    </Dropdown>
                                </FormGroup>
                            </Col>
                        </Row>
                        {(Reoccuriung === "Multiple")?
                        <>
                          <div>
                            <UserDescription>From: </UserDescription>
                            <DatePicker selected={EventAddModal?showDate("startDate"):""} onChange={date => {setStartDate(date); setStartDateChange(true);}} />
                          </div>
                          <div>
                            <UserDescription>To: </UserDescription>
                            <DatePicker selected={EventAddModal?showDate("endDate"):""} onChange={date => {setEndDate(date); setEndDateChange(true);}} />
                          </div>
                          <div>
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
                          </div>
                        </>
                        :
                        <></>}

                        <Button>Submit</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    );

}


export default MainAddEvent;
