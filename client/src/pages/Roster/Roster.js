import './Roster.css'
import React, {useEffect, useState,  } from 'react';
import { useParams , useHistory } from 'react-router-dom';
import { Button } from 'reactstrap';
//calendar
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

//Tab
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';


//Services
import {createShiftHandler, getCalendarData, selectShiftHandler, linkShiftHandler, dragDropShift} from './RosterServices';

//Components
import {MainAddEvent, EditShift, DeleteShift, AddRoster, AddTrainee, AddUnavailable, ShiftInfo, SignUpShift, UnavailableShift, RosterUserTable, TraineeUserTable, UserTable, ActionTable, AddShadow, ShadowUserTable, DeleteBulk, EditBulk, printSignInSheet} from '../../components';


// Enums for weekdays
const SUNDAY = 0;
const MONDAY = 1;
const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;
const SATURDAY = 6;

const Roster = ( {userAuth}) => {

    //used for updating information
    const [Updater, setUpdater] = useState(true); // for Add
    const [proxySelect, setProxySelect] = useState(false); // for Add
    const [resetter, setResetter] = useState(false); // for Add
    const [dragDropEnable, setDragDropEnable] = useState("first"); // for Add

    const [rosteredList, setRosteredList] = useState([]);
    const [traineeList, setTraineeList] = useState([]);
    const [waitlist, setWaitlist] = useState([]);
    const [unavailList, setUnavailList] = useState([]);
    const [shadowList, setShadowList] = useState([]);
    const [actionLog, setActionLog] = useState([]);
    const [list, setList] = useState([]);

    //Used for showing info in the "Shift Info" section
    const [currentShift, setCurrentShift] = useState(null); // current selected shift set to nothing currently
    const [totalShifts, setTotalShifts] = useState([]); // current selected shift set to nothing currently
    const [selectedRostered, setSelectedRostered] = useState(null); // current selected shift set to nothing currently
    const [selectedTrainee, setSelectedTrainee] = useState(null); // current selected shift set to nothing currently
    const [shiftInfo, setShiftInfo] = useState(
        {
            hl: "",
            min_pat: "",
            max_pat: "",
            current_ros: "",
            max_trainee: "",
            event_name: "",
            all_day: "",
            startStr: "",
        }
    );

    //Pop Up States
    const [selectedDate, setSelectedDate] = useState(null); // for Add
    const [EventAddModal, setEventAddModal] = useState(false); // for Add
    const [EditShiftModal, setEditShiftModal] = useState(false); // for Edit Shift
    const [EventDeleteModal, setEventDeleteModal] = useState(false); // for Add
    const [AssignAreaModal, setAssignAreaModal] = useState(false); // for Edit Shift
    const [AssignShadowModal, setAssignShadowModal] = useState(false); // for Edit Shift
    const [AddRosterModal, setAddRosterModal] = useState(false); // for Edit Shift
    const [AddTraineeModal, setAddTraineeModal] = useState(false); // for Edit Shift
    const [AddUnavailableModal, setAddUnavailableModal] = useState(false); // for Edit Shift
    const [AddShadowModal, setAddShadowModal] = useState(false);
    const [BulkEventDeleteModal, setBulkEventDeleteModal] = useState(false);
    const [BulkEditModal, setBulkEditModal] = useState(false);

    //Table Tab Panes
    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
    }


    //For linking from hyperlink clicked on user page to a specific event
    const [atStart, setAtStart] = useState(true);
    const { event_id } = useParams();
    const history = useHistory();



    //will update calendar if the Add Roster Modal changes
    useEffect(() => {
        if(atStart && event_id !== undefined)
        {
            console.log(event_id);
            let link_id = {
                event: {
                    id: event_id
                }
            }
            linkShiftHandler(link_id, setCurrentShift, setShiftInfo, setRosteredList, setUnavailList, setTraineeList, setWaitlist, setUpdater, setShadowList, setActionLog);
            setAtStart(false);
        }

        if(Updater)
        {
            setUpdater(false);
        }
        if(proxySelect)
        {
            selectShiftHandler(proxySelect, setCurrentShift, currentShift, dragDropEnable, setDragDropEnable, setShiftInfo, setRosteredList, setUnavailList, setTraineeList, setWaitlist, setUpdater, setShadowList, setList, setActionLog);
            setProxySelect(false);
        }
        if(resetter)
        {
            setShiftInfo(
                {
                    hl: "",
                    min_pat: "",
                    max_pat: "",
                    current_ros: "",
                    max_trainee: "",
                    event_name: "",
                    all_day: "",
                    startStr: "",
                }
            );
            setRosteredList([]);
            setTraineeList([]);
            setWaitlist([]);
            setUnavailList([]);
            setShadowList([]);
            setActionLog([])
            setResetter(false);
        }
    }, [Updater, proxySelect, resetter, atStart]);



    return (
        <>
            {/** Pop Up Components */}
            <MainAddEvent EventAddModal = {EventAddModal} setEventAddModal ={setEventAddModal} selectedDate ={selectedDate} setSelectedDate={setSelectedDate} setUpdater={setUpdater} username={userAuth.username}/>


            <div className="grid">
                <div  className="ShiftInfo">
                    <Card body>
                      {(userAuth.user_type === "System Admin" || userAuth.user_type === "Hill Admin")?
                        <Row>
                          <EditBulk currentShift={currentShift} BulkEditModal={BulkEditModal} setBulkEditModal={setBulkEditModal} setProxySelect={setProxySelect} setUpdater={setUpdater} currentShift={currentShift} shiftInfo={shiftInfo} setCurrentShift={setCurrentShift}/>
                          <DeleteBulk BulkEventDeleteModal={BulkEventDeleteModal} setBulkEventDeleteModal={setBulkEventDeleteModal} currentShift={currentShift} setUpdater={setUpdater}/>

                        </Row>:<></>
                      }
                        <ShiftInfo currentShift={currentShift} shiftInfo={shiftInfo}/>
                        <div className='ShiftButtons'>
                            <SignUpShift currentShift={currentShift} setProxySelect={setProxySelect} name={userAuth.name} username={userAuth.username} user_type={userAuth.user_type} trainer={userAuth.trainer} phone_number={userAuth.phone_number} setCurrentShift={setCurrentShift}/>
                            <UnavailableShift currentShift={currentShift} setProxySelect={setProxySelect} name={userAuth.name} username={userAuth.username} user_type={userAuth.user_type}/>
                            <Button color="secondary" onClick={() => printSignInSheet(currentShift, list)}>Attendance(PDF)</Button>
                            {/** ACCESS FOR ADMINS ONLY */}
                            {(userAuth.user_type === "System Admin" || userAuth.user_type === "Hill Admin")?
                                <>
                                    <EditShift currentShift={currentShift} EditShiftModal={EditShiftModal} setEditShiftModal={setEditShiftModal} setProxySelect={setProxySelect} setUpdater={setUpdater} currentShift={currentShift} shiftInfo={shiftInfo} setCurrentShift={setCurrentShift} username={userAuth.username}/>
                                    <DeleteShift EventDeleteModal={EventDeleteModal} setEventDeleteModal={setEventDeleteModal} currentShift={currentShift} setUpdater={setUpdater} setResetter={setResetter}/>
                                </>:<></>
                            }
                        </div>

                    </Card>
                </div>
                <div  className="ShiftTables">

                    <Nav tabs>
                        <NavItem><NavLink className={classnames({ active: activeTab === '1' })} onClick={() => { toggle('1'); }}>Rostered({rosteredList.length})</NavLink></NavItem>
                        <NavItem><NavLink className={classnames({ active: activeTab === '2' })} onClick={() => { toggle('2'); }}>Trainee({traineeList.length})</NavLink></NavItem>
                        <NavItem><NavLink className={classnames({ active: activeTab === '3' })} onClick={() => { toggle('3'); }}>Waitlist({waitlist.length})</NavLink></NavItem>
                        <NavItem><NavLink className={classnames({ active: activeTab === '4' })} onClick={() => { toggle('4'); }}>Unavailable({unavailList.length})</NavLink></NavItem>
                        <NavItem><NavLink className={classnames({ active: activeTab === '5' })} onClick={() => { toggle('5'); }}>Shadow({shadowList.length})</NavLink></NavItem>
                        <NavItem><NavLink className={classnames({ active: activeTab === '5' })} onClick={() => { toggle('6'); }}>Action Log({actionLog.length})</NavLink></NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                            <Row>
                                <Col sm="12">
                                    <RosterUserTable currentShift={currentShift} setCurrentShift={setCurrentShift} AssignAreaModal={AssignAreaModal} setAssignAreaModal={setAssignAreaModal} setProxySelect={setProxySelect} rosteredList={rosteredList} userAuth={userAuth}/>
                                    {/** ACCESS FOR ADMINS ONLY */}
                                    {(userAuth.user_type === "System Admin" || userAuth.user_type === "Hill Admin")?
                                        <AddRoster currentShift={currentShift} setCurrentShift={setCurrentShift} AddRosterModal={AddRosterModal} setAddRosterModal={setAddRosterModal} setProxySelect={setProxySelect} userAuth={userAuth}/>
                                        :<></>
                                    }
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                <Col sm="12">
                                    <TraineeUserTable currentShift={currentShift} setCurrentShift={setCurrentShift} setProxySelect={setProxySelect} traineeList={traineeList} userAuth={userAuth}/>
                                    {/** ACCESS FOR ADMINS ONLY */}
                                    {(userAuth.user_type === "System Admin" || userAuth.user_type === "Hill Admin")?
                                        <AddTrainee currentShift={currentShift} setCurrentShift={setCurrentShift} AddTraineeModal={AddTraineeModal} setAddTraineeModal={setAddTraineeModal} setProxySelect={setProxySelect} userAuth={userAuth}/>
                                        :<></>
                                    }
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="3">
                            <Row>
                                <Col sm="12">
                                    <UserTable currentShift={currentShift} userlist={waitlist} setProxySelect={setProxySelect} name="Waitlist" userAuth={userAuth}/>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="4">
                            <Row>
                                <Col sm="12">
                                    <UserTable currentShift={currentShift} userlist={unavailList} setProxySelect={setProxySelect} name="Unavaiable" userAuth={userAuth}/>
                                    {/** ACCESS FOR ADMINS ONLY */}
                                    {(userAuth.user_type === "System Admin" || userAuth.user_type === "Hill Admin")?
                                        <AddUnavailable currentShift={currentShift} setCurrentShift={setCurrentShift} AddUnavailableModal={AddUnavailableModal} setAddUnavailableModal={setAddUnavailableModal} setProxySelect={setProxySelect}/>
                                        :<></>
                                    }
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="5">
                            <Row>
                                <Col sm="12">
                                    <ShadowUserTable currentShift={currentShift} setCurrentShift={setCurrentShift} setProxySelect={setProxySelect} shadowList={shadowList} userAuth={userAuth}/>
                                    {/** ACCESS FOR ADMINS ONLY */}
                                    {(userAuth.user_type === "System Admin" || userAuth.user_type === "Hill Admin")?
                                        <AddShadow currentShift={currentShift} setCurrentShift={setCurrentShift} AddShadowModal={AddShadowModal} setAddShadowModal={setAddShadowModal} setProxySelect={setProxySelect} userAuth={userAuth}/>
                                        :<></>
                                    }
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="6">
                            <Row>
                                <Col sm="12">
                                    <ActionTable currentShift={currentShift} actionLog={actionLog} />
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
                </div>


                <div className="Calendar">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} //Specifies the plugins that will be used. Plugins are used for using additional libraries, as shown under headerToolBar

                        headerToolbar={
                            (window.innerWidth > 760) ?
                            {
                                left: 'prev,next',
                                center: 'title',
                                right: 'dayGridMonth,dayGridWeek'
                            }
                            :
                            {
                                left: 'title',
                                right: 'prev,next'
                            }

                        }

                        footerToolbar={
                            (window.innerWidth > 760) ?
                            { /** Empty */ }
                            :
                            { center: 'dayGridMonth,dayGridWeek'}
                        }

                        initialView={
                            (window.innerWidth > 760) ?
                             'dayGridMonth'
                            :
                             'dayGridWeek'
                        }


                        dayHeaderFormat={
                            (window.innerWidth > 760) ?
                            {
                                weekday: 'short'

                            }
                            :
                            {
                                month: 'numeric',
                                day: 'numeric',
                            }

                        }

                        editable={(dragDropEnable === "third")?true:false} //To do: I couldn't figure out what this does. I tried changing it to false and nothing changed on the UI
                        selectable={true} //Enables ability to select dates
                        selectMirror={true} //To do: I couldn't figure out what this does. I tried changing it to false and nothing changed on the UI
                        dayMaxEvents={true} //Enables it so that only 4 shifts can be fit in one date. Additional dates will be shown in "+# more", where # is the additional numbers of shifts
                        eventResizableFromStart={true}

                        //Get Shifts
                        events={(Updater)?(fetchInfo, successCallback, failureCallback) => getCalendarData(fetchInfo, Updater, dragDropEnable, totalShifts, setTotalShifts, setDragDropEnable):totalShifts} //Specifies the initial shifts that are displayed
                        eventClick={(e) => {
                            selectShiftHandler(e, setCurrentShift, currentShift, dragDropEnable, setDragDropEnable, setShiftInfo, setRosteredList, setUnavailList, setTraineeList, setWaitlist, setUpdater, setShadowList, setList, setActionLog) //Specifies the handler that is called when an shift is clicked
                            history.push('/roster/' + e.event.id);
                        }}

                        //Mobile
                        longPressDelay={1}
                        eventLongPressDelay={1}
                        selectLongPressDelay={1}

                        //Handler specification
                        select={(e) => createShiftHandler(e, userAuth, setSelectedDate, setEventAddModal, setCurrentShift, setResetter)} //Specifies the handler that is called when a date is clicked

                        //when drag and drop or reshape
                        eventChange={(e) => dragDropShift(e, dragDropEnable, setUpdater, totalShifts, setTotalShifts, userAuth, setDragDropEnable, setShiftInfo, setProxySelect)}


                        //When view changes, month, week, etc
                        datesSet={(e)=> {setUpdater(true)}}




                    />
                </div>
            </div>
        </>
    )
}

export default Roster
