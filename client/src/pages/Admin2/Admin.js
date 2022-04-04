import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { Button, Form, FormGroup, FormFeedback, Input, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';
import {
  UserCardContainer,
  Card,
  UserInput,
  UserHeadingInput,
  UserHeadingInputLink,
  UserDescription,
  FirstCard,
  Icon
} from '../../components/Elements/Elements'

const Admin2 = () => {

  //TODO: userArray temporary, get all users from db into userArray
   const [userArray, setUserArray] = useState([{}]);

  const [editing, setEditing] = useState(false);
  const [editIndex, setEditingIndex] = useState(-1);
  const [adding, setAdding] = useState(true);
  const [alterations, setAlterations] = useState(false);
  const [Updater, setUpdater] = useState(false);
  const [usernameAvailability, setUsernameAvailability] = useState(false);
  const [phonenumberValidation, setPhonenumberValidation] = useState(false);
  const [type, setType] = useState("Rostered");
  const [trainer, setTrainer] = useState("Trainer");

  const [dropdownOpen, setOpen] = useState(false);
  const [trainerDropdownOpen, setTrainerDropdownOpen] = useState(false);
  const toggle = () => setOpen(e => !e);
  const trainerToggle = () => setTrainerDropdownOpen(e => !e);

  const [userInfo, setUserInfo] = useState(
        {
            name: "",
            phone_number: "",
            username: "",
            password: "",
            email: "",
            user_type: type,
            trainer: trainer
        }
    );

	const resetUserInfo = () => {
		setUserInfo(
			{
				name: "",
				phone_number: "",
				username: "",
				password: "",
				email: "",
				user_type: "",
				trainer: 0
			});
      setTrainer("Trainer")
      setType("Rostered");
			setUpdater(e => !e);
	}

  const addUser = () => {
    const article = {
      phone_number: userInfo.phone_number,
      email: userInfo.email,
      name: userInfo.name,
      username: userInfo.username,
      user_type: type,
      trainer:  ((trainer==="Trainer") ? 1 : 0),
      password: userInfo.password
    }
    axios.put('/addUser/', article)
      .then(res => {
        setUpdater(e => !e);
        if(res.status === 204){
          setUserInfo(
          {
              name: "",
              phone_number: "",
              username: "",
              password: "",
              email: "",
              user_type: "",
              trainer: 0
          });
          setAdding(true);
          setUpdater(e => !e);
        }
        else{
            console.log("Error in DB")
        }
      })
  }

  const editUser = () => {
    const article = {
      phone_number: userInfo.phone_number,
      email: userInfo.email,
      name: userInfo.name,
      username: userInfo.username,
      user_type: type,
      trainer:  ((trainer==="Trainer") ? 1 : 0)
    }
    axios.put('/users/', article)
      .then(res => {
        if(res.status === 204){
          setUserInfo(
          {
              name: "",
              phone_number: "",
              username: "",
              password: "",
              email: "",
              user_type: "",
              trainer: 0
          });
          setEditing(true);
          setUpdater(e => !e);
        }
        else{
            console.log("Error in DB")
        }
      })
  }

  const onChange = (e) => {
        //setting dictionary with of previous values + the new value. The dictionary will overwrite the existing e.target.name since you cannot have duplicates
        setUserInfo(prev => (
            {
                ...prev,
                [e.target.name]: e.target.value,
            }
        ))
        setAlterations(true);
    }

	const editToggle = (val) => {
		setUserInfo(
			{
				name: val.name,
				phone_number: val.phone_number,
				username: val.username,
				email: val.email,
				user_type: val.user_type,
				trainer: (val.trainer)?"Trainer":"Not a Trainer",
			}
		);
    setTrainer((val.trainer===1)?"Trainer":"Not a Trainer")
    setType(val.user_type);
    setAlterations(false);
	}

	const changeType = (e) => {
        //setting dictionary with of previous values + the new value. The dictionary will overwrite the existing e.target.name since you cannot have duplicates
        setType(e);
        setUserInfo(prev => (
            {
                ...prev,
                user_type: e,
            }
        ))
        setAlterations(true);
    }

  const changeTrainer = (e) => {
      //setting dictionary with of previous values + the new value. The dictionary will overwrite the existing e.target.name since you cannot have duplicates
      setTrainer(e);
      setUserInfo(prev => (
          {
              ...prev,
              trainer: e,
          }
      ))
      setAlterations(true);
  }

  const formatPhoneNumber = (str) => {
      //Filter only numbers from the input
      let cleaned = (`` + str).replace(/\D/g, '');

      let match = '';
      if(cleaned.length === 1)
          match = cleaned.match(/^(\d{1})$/);
      if(cleaned.length === 2)
          match = cleaned.match(/^(\d{1})(\d{1})$/);
      if(cleaned.length === 3)
          match = cleaned.match(/^(\d{1})(\d{2})$/);
      if(cleaned.length === 4)
          match = cleaned.match(/^(\d{1})(\d{3})$/);
      if(cleaned.length === 5)
          match = cleaned.match(/^(\d{1})(\d{3})(\d{1})$/);
      if(cleaned.length === 6)
          match = cleaned.match(/^(\d{1})(\d{3})(\d{2})$/);
      if(cleaned.length === 7)
          match = cleaned.match(/^(\d{1})(\d{3})(\d{3})$/);
      if(cleaned.length === 8)
          match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{1})$/);
      if(cleaned.length === 9)
          match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})$/);
      if(cleaned.length === 10)
          match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{3})$/);
      if(cleaned.length === 11)
          match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);

      if(cleaned.length === 1)
      {
          if (match) return `+` + String(match[1])
          else return ``
      }
      else if(2  <= cleaned.length && 4 >= cleaned.length)
      {
          if (match) return `+` + String(match[1]) + ` ` + String(match[2])
          else return ``
      }
      else if(5  <= cleaned.length && 7 >= cleaned.length)
      {
          if (match) return `+` + String(match[1]) + ` ` + `(` + String(match[2]) + `) ` + String(match[3])
          else return ``
      }
      else
      {
          if (match) return `+` + String(match[1]) + ` ` + `(` + String(match[2]) + `) ` + String(match[3]) + ` ` + String(match[4])
          else return ``
      }
  };

    const handleKeyPress = (event, index) => {
      if(event.code === "Enter" || event.code === "NumpadEnter") {
        setEditing(!editing); setAdding(true); setEditingIndex(index); editUser();
      }
    };

  useEffect(() => {
    axios.get('/adminUsers/')
    .then(response => {
        // If request is good...
        setUserArray(response.data);
    })
    .catch((error) => {
        console.log('error ' + error);
    });

    // //checking if phone number is valid length
    if(userInfo.phone_number.length === 17)
    {
        setPhonenumberValidation(true);
    }
    else
    {
        setPhonenumberValidation(false);
    }

    //checking if username is available for creation
    if(userInfo.username !== '' && !adding)
    {
        axios.get('/checkAvailability/' + userInfo.username)
            .then(response =>
            {
                // If request is good...
                if(response.status === 204)
                {
                    setUsernameAvailability(true);
                }
                else{
                    setUsernameAvailability(false);
                }
            })
            .catch((error) => {
                setUsernameAvailability(false);
            });
    }
    else{
        setUsernameAvailability(false);
    }

  }, [Updater, userInfo, adding]);

  return (
      <UserCardContainer>
      {adding?
        (
          // plus sign
          <FirstCard height='300px'>
            <Icon onClick={ () => { setAdding(false); setEditing(false) }}>
              <FaPlus size='100px'/>
            </Icon>
          </FirstCard>
        )
        :
        (
          // editable card
          <Card height='300px'>
            <Form onSubmit= {() => addUser()}>
              <UserHeadingInput type="text" readOnly={adding} editing={!adding} placeholder="Name" onChange={onChange} value={userInfo.name} name="name" required></UserHeadingInput>
              <FormGroup>
                <UserDescription>Username: </UserDescription>
                <Input valid={usernameAvailability} invalid={!usernameAvailability} type="text" readOnly={adding} editing={!adding} placeholder="Username" name="username" onChange={onChange} value={userInfo.username} required/>
                <FormFeedback valid>Username is Available</FormFeedback>
                <FormFeedback invalid>Invalid or Taken</FormFeedback>
              </FormGroup>

              <FormGroup>
                <UserDescription>Password: </UserDescription>
                <Input type="text" readOnly={adding} editing={(!adding).toString()} placeholder="Password" onChange={onChange} value={userInfo.password} name="password" required/>
              </FormGroup>

              <FormGroup>
                <UserDescription>Phone Number: </UserDescription>
                <Input valid={phonenumberValidation} invalid = {!phonenumberValidation} maxLength={17} name="phone_number" onChange={onChange} value={formatPhoneNumber(userInfo.phone_number)} type="text" readOnly={adding} editing={!adding} placeholder="Phone Number"/>
                <FormFeedback invalid>Phone number is invalid</FormFeedback>
              </FormGroup>

              <FormGroup>
                <UserDescription>Email: </UserDescription>
                <Input type="email" name="email" onChange={onChange} value={userInfo.email} readOnly={adding} editing={!adding} placeholder="Email" required/>
              </FormGroup>

              <>
                <FormGroup>
                  <UserDescription>User Type: </UserDescription>
                  <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} disabled={adding} editing={!adding}>
                    <DropdownToggle caret>
                      {(type==="Rostered")?"Patroller":type}
                    </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => changeType("Hill Admin")}>Hill Admin</DropdownItem>
                        <DropdownItem onClick={() => changeType("System Admin")}>System Admin</DropdownItem>
                        <DropdownItem onClick={() => changeType("Rostered")}>Patroller</DropdownItem>
                        <DropdownItem onClick={() => changeType("Trainee")}>Trainee</DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </FormGroup>
              </>
              <>
                <FormGroup>
                  <UserDescription>Trainer: </UserDescription>
                  <ButtonDropdown isOpen={trainerDropdownOpen} toggle={trainerToggle} disabled={adding} editing={!adding}>
                    <DropdownToggle caret>
                      {trainer}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => changeTrainer("Trainer")}>Trainer</DropdownItem>
                      <DropdownItem onClick={() => changeTrainer("Not Trainer")}>Not a Trainer</DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </FormGroup>
              </>

              <Button width='45%' onClick={ () => {setAdding(true); resetUserInfo();}}>
                Cancel
              </Button>
              {/* TODO: add user when save is pressed */}
              <Button color='primary' type="submit" disabled = {!usernameAvailability || !phonenumberValidation} width='45%'>
                Save
              </Button>
            </Form>
          </Card>
        )
      }
      {
        userArray.map((val, index) => {
          return (
            <Card height='300px' key={index}>
              <Form onSubmit={ () => {setEditing(false); setAdding(true); setEditingIndex(index); editUser()}}>
                {(userInfo.username === val.username && adding)?
                  <UserHeadingInput type="text" readOnly={!editing || editIndex!==index} editing={editing && editIndex===index} onChange={onChange} name="name" required value={userInfo.name}></UserHeadingInput>
                  :
                  <Link to={'/users/' + val.username}><UserHeadingInputLink type="text" readOnly={true} editing={false} value={val.name} placeholder="Name"></UserHeadingInputLink></Link>
                }

                <UserDescription>Username: </UserDescription>
                <UserInput type="text" readOnly={true} value={val.username} placeholder="Username"/>

                <FormGroup>
                  <UserDescription>Phone Number: </UserDescription>
                  {(userInfo.username === val.username && adding)?
                    <>
                      <Input valid = {phonenumberValidation} invalid = {!phonenumberValidation} maxLength={17} name="phone_number" onChange={onChange} value={formatPhoneNumber(userInfo.phone_number)} type="text" readOnly={!editing || editIndex!==index} editing={editing && editIndex===index} placeholder="Phone Number"/>
                      <FormFeedback invalid>Phone number is invalid</FormFeedback>
                    </>
                    :
                    <UserInput type="text" readOnly={true} editing={false} value={val.phone_number} placeholder="Phone Number"/>
                  }
                </FormGroup>

                <FormGroup>
                  <UserDescription>Email: </UserDescription>
                  {(userInfo.username === val.username && adding)?
                    <Input type='email' name="email" onChange={onChange} readOnly={!editing || editIndex!==index} editing={editing && editIndex===index} value={userInfo.email} placeholder="Email"/>
                    :
                    <UserInput type="text" readOnly={true} editing={false} value={val.email} placeholder="Email"/>
                  }
                </FormGroup>

                <FormGroup>
                  <UserDescription>User Type:</UserDescription>
                  {(userInfo.username === val.username && adding)?
                    <>
                      <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} disabled={!editing || editIndex!==index} editing={editing && editIndex===index}>
                        <DropdownToggle caret>
                          {(type==="Rostered")?"Patroller":type}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={() => changeType("Hill Admin")}>Hill Admin</DropdownItem>
                          <DropdownItem onClick={() => changeType("System Admin")}>System Admin</DropdownItem>
                          <DropdownItem onClick={() => changeType("Rostered")}>Patroller</DropdownItem>
                          <DropdownItem onClick={() => changeType("Trainee")}>Trainee</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </>
                    :
                    <>
                      <UserInput type="text" readOnly={true} editing={false} value={(val.user_type==="Rostered")?"Patroller":val.user_type} placeholder="User Type"/>
                    </>
                  }
                </FormGroup>

                <FormGroup>
                  <UserDescription>Trainer:</UserDescription>
                  {(userInfo.username === val.username && adding)?
                    <>
                      <ButtonDropdown isOpen={trainerDropdownOpen} toggle={trainerToggle} disabled={!editing || editIndex!==index} editing={editing && editIndex===index}>
                        <DropdownToggle caret>
                          {trainer}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={() => changeTrainer("Trainer")}>Trainer</DropdownItem>
                          <DropdownItem onClick={() => changeTrainer("Not Trainer")}>Not a Trainer</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </>
                    :
                    <>
                      <UserInput type="text" readOnly={!editing || editIndex!==index} editing={editing && editIndex===index} placeholder="Trainer" value={(val.trainer)?"Trainer":"Not a Trainer"}/>
                    </>
                  }
                </FormGroup>
                {(!adding || (editIndex!==-1 && editIndex!==index))?
                  <></>
                  :
                  (editing?
                    <Button type='submit' disabled = {!phonenumberValidation || !alterations}>
                      Save
                    </Button>
                    :
                    <Button type='button' onClick={ () => {setEditing(true); setAdding(true); setEditingIndex(index); editToggle(val); setAlterations(false)}}>
                      Edit
                    </Button>
                  )}
                {(userInfo.username === val.username && adding)?
                <Button type='button' onClick={() => {
                  if(window.confirm('Delete the user?')){
                    axios.delete('/deleteUser/' + val.username)
                        .then(res => {
                          setUpdater(e => !e);
                          setEditing(false);
                          setEditingIndex(-1);
                          resetUserInfo()
                            if(res.status !== 204){
                              console.log("Error in DB");
                            }
                          }
                        )
                      }
                    }
                  }>
                  Delete
                </Button>
                :
                <></>}
                {(userInfo.username === val.username && adding)?
                <Button type='button' onClick={ () => {setEditing(false); setEditingIndex(-1); resetUserInfo()} }>
                  Cancel
                </Button>
                :
                <></>}
              </Form>
            </Card>

          );
        })
      }
      </UserCardContainer>
  );
}

export default Admin2;
