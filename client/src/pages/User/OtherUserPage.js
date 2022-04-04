import React, {useState, useEffect}  from 'react';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import axios from 'axios';
import './UserPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard, faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons'
import { Scrollbars } from 'react-custom-scrollbars';

import { useParams } from 'react-router-dom';

const OtherUserPage = ({userAuth}) => {

    let { usernameParam } = useParams();
    const [userData, setUserData] = useState([]);

    const [eventLogItems, setEventLogItems] = useState([]);
    const [atStart, setAtStart] = useState(true);

    useEffect(() => {
      if(atStart) {
        try{
          axios.get('/getEventLogItems/'+ usernameParam)
            .then(response => {
              if(response.status === 200)
              {
                let eventlogList = [];
                for (let i = 0; i < response.data.length; i++) {
                    let eventlog = {
                      event_id: response.data[i].event_id,
                      event_name: response.data[i].event_name,
                      area: String(response.data[i].area),
                      start_date: response.data[i].start_date,
                      timestamp_rostered: response.data[i].timestamp_rostered,
                      attendance: response.data[i].attendance,
                      role: response.data[i].role,
                    }
                    eventlogList.push(eventlog);
                }
                setEventLogItems(eventlogList);
              }
              else{
                  console.log("No Shifts")
              }
            })
            .catch((error) => {
                console.log('error ' + error);
            });
        }
        catch (error) {
          console.log(error);
        }

      try{
        axios.get('/getUserData/' + usernameParam)
          .then(response => {
            if(response.status === 200)
            {
              let data = [];
              console.log('Found user');
              data = {
                  name: response.data[0].name,
                  username: usernameParam,
                  phone_number: response.data[0].phone_number,
                  email: response.data[0].email,
                  user_type: response.data[0].user_type,
              }
              setUserData(data);
            }
            else{
                console.log("Couldn't find user")
            }
          })
        }
        catch (error) {
          console.log(error);
        }
        setAtStart(false);
      }
    }, [atStart, userData]);

    // Renders user card with user info
    const renderUserCard = () => {
      return (
        <div className = "user">
          <div className = "user-header">{userData.name}</div>
          <div className = "username">{userData.username}</div>
          <div className = "user-type"><FontAwesomeIcon icon={faAddressCard} />  {(userData.user_type==="Rostered")?"Patroller":userData.user_type}</div>
          <div className = "contact-info"><FontAwesomeIcon icon={faEnvelope} />  {userData.email}</div>
          <div className = "contact-info"><FontAwesomeIcon icon={faPhoneAlt} />  {userData.phone_number}</div>
        </div>
      )
    }

    const renderTableHeader = () => {
        return(
          <thead>
            <tr>
                <th>Event Name</th>
                <th>Area Name</th>
                <th>Date</th>
                <th>Role</th>
                <th>Time Rostered</th>
                <th>Attendance</th>
            </tr>
        </thead>
        )
    }

    const renderTableBody = () => {
      let i = 0;
      return eventLogItems.map(eventLogItem => (
        <tbody key={i++}>
          <tr>
              <td className='userText'><Link to={'/roster/' + eventLogItem.event_id}>{eventLogItem.event_name}</Link></td>
              <td className='userText'>{(eventLogItem.area !== "null")? eventLogItem.area: ""}</td>
              <td className='userText'>{eventLogItem.start_date.slice(0,10)}</td>
              <td className='userText'>{eventLogItem.role}</td>
              <td className='userText'>{eventLogItem.timestamp_rostered.slice(0,10)}</td>
              <td className='userText'>{eventLogItem.attendance}</td>
          </tr>
        </tbody>
      ))
    }

    // To do: Decide if want to implement pagination
    // Renders the table
    const renderTable = () => {
      return(
          <div className = "Table-vertical">
            <Scrollbars autoHide={true}>
              <Table>
                  {renderTableHeader()}
                  {renderTableBody()}
              </Table>
            </Scrollbars>
          </div>
      )
    }

    const renderTableMobile = () => {
      return(
          <div className = "mobile-Table-vertical">
            <Scrollbars autoHide={true}>
              <Table>
                  {renderTableHeader()}
                  {renderTableBody()}
              </Table>
            </Scrollbars>
          </div>
      )
    }


    return(
      <>
      <MediaQuery minDeviceWidth={500}>
        <div className = "wrapper flex">
          {renderUserCard()}
          {renderTable()}
        </div>
      </MediaQuery>

      <MediaQuery maxDeviceWidth={500}>
        <div className = "mobile-wrapper">
          {renderUserCard()}
          {renderTableMobile()}
        </div>
      </MediaQuery>
      </>
    )
}

export default OtherUserPage;
