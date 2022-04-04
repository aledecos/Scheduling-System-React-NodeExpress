import React, {useState, useEffect}  from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { Form, FormFeedback, FormGroup, Label, Input } from 'reactstrap';


const AddShadow = ({AddShadowModal , setAddShadowModal, currentShift, setProxySelect, userAuth}) => {

    const [phonenumberValidation, setPhonenumberValidation] = useState(false);
    const [usernameAvailability, setUsernameAvailability] = useState(false);

    const [userInfo, setUserInfo] = useState(
        {
          event_id: currentShift?currentShift.event.id:"",
          event_name:  currentShift?currentShift.event.title:"",
          selectUser: "",
          shadow_name: "",
          shadow_phone_number: "",
          shadow_email: "",
          role: "Shadow",
          comment: "",
          user_type: "Not A User",
          trainer: ""
        }
    );

    const toggle = (e) => {
        if(currentShift)
        {
            setUserInfo(
                {
                event_id: currentShift?currentShift.event.id:"",
                event_name:  currentShift?currentShift.event.title:"",
                shadow_name: "",
                shadow_phone_number: "",
                shadow_email: "",
                role: "Shadow",
                comment: "",
                user_type: "Not A User",
                trainer: ""
                }
            );
            //Setting on and off of pop up
            setAddShadowModal(e);
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

    const AddShadow = (e) => {

      e.preventDefault();
      const article = {
        event_id: userInfo.event_id,
        event_name: userInfo.event_name,
        username: userInfo.shadow_name,
        name: userInfo.shadow_name,
        phone_number: userInfo.shadow_phone_number,
        email: userInfo.shadow_email,
        user_type: userInfo.user_type,
        role: userInfo.role,
        comment: userInfo.comment,
        trainer: userInfo.trainer,
        action_user: userAuth.username,
      }

      axios.put('/addToEventLog', article)
        .then(response => {

          console.log(response);
            //if error from database
            if(response.status === 204)
            {
                //load proxy
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
                //Setting on and off of pop up
                setAddShadowModal(false);
            }
            else{
                console.log("Error in DB");
            }
        })
        .catch((error) => {
            console.log('error ' + error);
        });
    }

    useEffect(() => {
      if(AddShadowModal)
      {
        //checking if username is available for creation
        if(userInfo.shadow_name !== '')
        {
            axios.get('/checkAvailability/' + userInfo.shadow_name)
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

        //checking if phone number is valid length
        if(userInfo.shadow_phone_number.length === 17)
        {
            setPhonenumberValidation(true);
        }
        else
        {
            setPhonenumberValidation(false);
        }
      }
    }, [userInfo, AddShadowModal]);

    const openBtn = <Button color="primary" className="m1" onClick={() => toggle(true)} >Add Shadow</Button>
    const closeBtn = <Button className="close" onClick = {() =>toggle(false)}>Close</Button>;
    //<Form onSubmit={}>

    return (

        //put UI objects here
        <div>
            {openBtn}
            <Modal isOpen={AddShadowModal} toggle={() => toggle(false)} className= "">
                <ModalHeader toggle={() => toggle(false)} close={closeBtn}>Add Shadow</ModalHeader>
                <ModalBody>
                    <Form onSubmit= {(e) => AddShadow(e)} >
                        <FormGroup>
                            <Label for="first_">Name</Label>
                            <Input valid={usernameAvailability} invalid={!usernameAvailability} type="text" name="shadow_name" onChange={onChange} value={userInfo.shadow_name} required/>
                            <FormFeedback valid>Username is Available</FormFeedback>
                            <FormFeedback invalid>Invalid or Taken</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="shadow_phone_number">Phone Number</Label>
                            <Input invalid = {!phonenumberValidation} type="text" maxLength={17} name="shadow_phone_number" onChange={onChange} value={formatPhoneNumber(userInfo.shadow_phone_number)}/>
                            <FormFeedback invalid>Phone number is invalid</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="shadow_email">Email</Label>
                            <Input placeholder="jo@gmail.gov" type="email" name="shadow_email" onChange={onChange} value={userInfo.shadow_email} required/>
                        </FormGroup>
                        <FormGroup>
                          <Label for="comment">Comment</Label>
                          <Input type="text" maxLength={999} name="comment" onChange={onChange} value={userInfo.comment} />
                        </FormGroup>
                        <Button disabled = {!usernameAvailability || !phonenumberValidation}>Submit</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    );

}


export default AddShadow;
