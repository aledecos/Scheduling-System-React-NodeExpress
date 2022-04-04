import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { Form, FormGroup, FormFeedback, Label, Input } from 'reactstrap';
import axios from 'axios';
const ChangePassword = (user) => {

  const [modal, setModal] = useState(false);
  const [userInfo, setUserInfo] = useState(
      {
          username:  user.user,
          old_password: "",
          new_password: "",
          new_password_again: "",
      }
  );

  const toggle = (e) => {
      if(user)
      {
          setUserInfo(
              {
                username:  user.user,
                old_password: "",
                new_password: "",
                new_password_again: "",
              }
          );
          //Setting on and off of pop up
          setModal(e);
      }
  }

  const onChange = (e) => {
      //setting dictionary with of previous values + the new value. The dictionary will overwrite the existing e.target.name since you cannot have duplicates
      setUserInfo(prev => (
          {
              ...prev,
              [e.target.name]: e.target.value,
          }
      ))

  }

  const changePassword = (e) => {

      e.preventDefault();

      const article = {
          username: userInfo.username,
          old_password: userInfo.old_password,
          new_password: userInfo.new_password,
          new_password_again: userInfo.new_password_again,
      };
      axios.put('/ChangePassword', article)
      .then(response => {
          //if error from database
          if(response.status === 204)
          {
                //Setting on and off of pop up
                toggle(false);
          }
          else{
              console.log("Error in DB");
          }
      })
      .catch(err =>{
        console.log("Error in DB");
      });
  }

  useEffect(() => {

  }, [userInfo]);

  const openBtn = <Button color="info" className ="mr-1 mt-1" onClick={() => toggle(true)}>Change Password</Button>
  const closeBtn = <Button className="close" onClick = {() =>toggle(false)}>Close</Button>;

  return (
    <div>
      {openBtn}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader  close={closeBtn}>Change Password</ModalHeader>
        <ModalBody onSubmit = {(e) => changePassword(e)} >
            <Form>
              <FormGroup>
                <Label for="old_password" className="col-form-label">Old password:</Label>
                <Input type="password" name="old_password" onChange={onChange}/>
              </FormGroup>
              <FormGroup>
                <Label for="new_password" className="col-form-label">New password:</Label>
                <Input invalid={userInfo.new_password === userInfo.old_password} type="password" name="new_password" onChange={onChange}/>
                <FormFeedback invalid='true'>New password may not be the same as old password</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="new_password_again" className="col-form-label">Confirm new password:</Label>
                <Input invalid={userInfo.new_password !== userInfo.new_password_again || userInfo.new_password === ""}
                        valid={userInfo.new_password === userInfo.new_password_again && userInfo.new_password !== ""} type="password" name="new_password_again" onChange={onChange}/>
                <FormFeedback valid>Passwords match</FormFeedback>
                <FormFeedback invalid='true'>Passwords do not match</FormFeedback>
              </FormGroup>
              <Button disabled={userInfo.new_password !== userInfo.new_password_again || userInfo.new_password === "" || userInfo.new_password === userInfo.old_password}>Submit</Button>
            </Form>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ChangePassword;
