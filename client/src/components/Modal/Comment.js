import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
const Comment = ({currentShift, setProxySelect, user}) => {

  const [modal, setModal] = useState(false);
  const [eventInfo, setEventInfo] = useState(
      {
          event_id: currentShift?currentShift.event.id:"",
          username:  user?user.username:"",
          comment: user?user.comment:"",
      }
  );

  const toggle = (e) => {
      if(user && currentShift)
      {
          setEventInfo(
              {
                  event_id: currentShift?currentShift.event.id:"",
                  username:  user?user.username:"",
                  comment: user?user.comment:"",
              }
          );
          //Setting on and off of pop up
          setModal(e);
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

  const editComment = (e) => {

      e.preventDefault();

      const article = {
          event_id: currentShift.event.id,
          username: user.username,
          comment: eventInfo.comment,
      };
      axios.put('/editComment', article)
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

  const openBtn = <Button color="success" className ="mr-1 mt-1" onClick={() => toggle(true)}>Comment</Button>
  const closeBtn = <Button className="close" onClick = {() =>toggle(false)}>Close</Button>;

  return (
    <div>
      {openBtn}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader  close={closeBtn}>Edit Comment</ModalHeader>
        <ModalBody onSubmit = {(e) => editComment(e)} >
            <p>Current Comment: {user?user.comment:""}</p>
            <Form>
              <FormGroup>
                <Label for="comment" className="col-form-label">Type to add to comment:</Label>
                <Input type="text" name="comment" onChange={onChange}/>
              </FormGroup>
              <Button >Submit</Button>
            </Form>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default Comment;
