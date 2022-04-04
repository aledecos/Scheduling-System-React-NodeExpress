import React, {useState, useEffect}  from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, Form } from 'reactstrap'

const DeleteShift = ({EventDeleteModal, setEventDeleteModal, currentShift, setUpdater, setResetter}) => {
    //state template
    const [eventInfo, setEventInfo] = useState(
        {

        }
    );

    const toggle = (e) => {
        if(currentShift)
        {
            setEventInfo(
                {

                }
            );
            //Setting on and off of pop up
            setEventDeleteModal(e);
        }
    }

    const DeleteEvent = async (e) =>  {
        // //Refer to
        // //https://www.w3schools.com/sql/sql_autoincrement.asp
        e.preventDefault();

        axios.delete('/deleteEvent/' + currentShift.event.id)
        .then(response => {
            //if error from database
            if(response.status === 204)
            {
                //shift info reset
                setResetter(true);
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

    useEffect(() => {

    }, []);

    const openBtn = <Button color="danger" onClick={() => toggle(true)}>Delete Shift</Button>
    const closeBtn = <Button className="close" onClick = {() =>toggle(false)}>Close</Button>;
    //<Form onSubmit={}>

    return (

        //put UI objects here
        <>
            {openBtn}
            <Modal isOpen={EventDeleteModal} toggle={() => toggle(false)} className= "">
                <ModalHeader  close={closeBtn}> DELETE Event Name: {(currentShift)?currentShift.event.title:""} </ModalHeader>
                <ModalBody>
                    <Form onSubmit= {(e) => DeleteEvent(e)}>
                        <Button>Delete Shift(s)?</Button>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    );

}


export default DeleteShift;
