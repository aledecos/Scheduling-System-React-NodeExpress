import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { Form, Button } from 'reactstrap';
import {
  UserCardContainer,
  Card,
  UserInput,
  UserButton,
  UserHeadingInput,
  UserDescription,
  FirstCard,
  Icon
} from '../../components/Elements/Elements'

const Area = () => {

  //TODO: userArray temporary, get all users from db into userArray

  var hasBorder = true;

  const [areaArray, setAreaArray] = useState([{}]);
  const [alterations, setAlterations] = useState(false);
  const [editing, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [adding, setAdding] = useState(true);
  const [Updater, setUpdater] = useState(false);
  const [currentArea, setCurrentArea] = useState({});

  const addArea = () => {
	const article = {
      area: currentArea.area
    }
    axios.put('/addArea/', article)
      .then(res => {
        setAdding(true);
        setUpdater(e => !e);
        if(res.status === 204){
          setCurrentArea(
          {
              area: "",
					    old_area: ""
          });
          setUpdater(e => !e);
        }
        else{
            console.log("Error in DB")
        }
      })
  }

  const editArea = () => {
	const article = {
      area: currentArea.area,
	  old_area: currentArea.old_area
    }
    axios.put('/editAreas/', article)
      .then(res => {
        setUpdater(e => !e);
        if(res.status === 204){
          resetAreaInfo();
          setAdding(true);
          setEdit(false);
        }
        else{
            console.log("Error in DB")
        }
      })
  }

  const editToggle = (val) => {
		setCurrentArea(
			{
				old_area: val.area,
				area: val.area
			}
		);
    setAlterations(false);
	}

  const resetAreaInfo = () => {
		setCurrentArea(
			{
        old_area: "",
				area: ""
			});
      setAlterations(false);
			setUpdater(e => !e);
	}

	const onChange = (e) => {
        //setting dictionary with of previous values + the new value. The dictionary will overwrite the existing e.target.name since you cannot have duplicates
        setCurrentArea(prev => (
            {
                ...prev,
                [e.target.name]: e.target.value,
            }
        ))
        setAlterations(true);
    }

  useEffect(() => {
    axios.get('/getAreas/')
    .then(response => {
        // If request is good...
        setAreaArray(response.data);
    })
    .catch((error) => {
        console.log('error ' + error);
    });
  }, [Updater]);

  return (
    <>
      <UserCardContainer>
        {adding?
          (
          // plus sign
          <FirstCard height='300px'>
            <Icon onClick={ () => { setAdding(false); setEdit(false) }}>
              <FaPlus size='100px'/>
            </Icon>
          </FirstCard>
          )
          :
          (
          // editable card
          <Card height='300px'>
            <Form>
              <UserHeadingInput type="text" readOnly='true' defaultValue="Area" placeholder="Area" ></UserHeadingInput>

              <UserDescription>Area Name: </UserDescription>
              <UserInput type="text" readOnly={adding} editing={!adding} placeholder="Area name" name="area" onChange={onChange} value={currentArea.area} required/>

              <Button type="button" useMargin='10%' width='45%' disabled={!currentArea.area} onClick={() => addArea()}>
                Save
              </Button>
              <Button type="button" width='45%' onClick={ () => setAdding(true)}>
                Cancel
              </Button>
            </Form>
          </Card>
          )
        }

        {
          areaArray.map((val, index) => {
            return (
            <Card height='300px'>
              <Form onSubmit={ () => {setEdit(false); setAdding(true); setEditIndex(-1); editArea()}}>
                <UserHeadingInput type="text" readOnly='true' defaultValue="Area" placeholder="Area" ></UserHeadingInput>

                <UserDescription>Area Name: </UserDescription>
                {(currentArea.old_area === val.area)?
                <UserInput type="text" name="area" readOnly={!editing || editIndex!==index} editing={editing && editIndex===index} onChange={onChange} placeholder="Area name"/>:
                <UserInput type="text" readOnly='true' editing={false} defaultValue={val.area} placeholder="Area name"/>}
                {(!adding || (editIndex!==-1 && editIndex!==index))?
                  <></>
                  :
                  (editing?
                    <Button type="submit" disabled={!alterations}>
                      Save
                    </Button>
                    :
                    <Button type='button' onClick={ () => {setEdit(!editing); setAdding(true); setEditIndex(index); editToggle(val);}}>
                      Edit
                    </Button>
                  )}
                {(currentArea.old_area === val.area && adding)?
                <Button type='button' hide={!editing || editIndex !== index} onClick={() => (
                  axios.delete('/deleteArea/' + val.area)
                    .then(res => {
                      setUpdater(e => !e);
                      resetAreaInfo();
                      setEdit(false);
                      setEditIndex(-1);
                      if(res.status !== 204){
                        console.log("Error in DB")
                      }
                    })
                  )}>
                  Delete
                </Button>
                :
                <></>}
                {(currentArea.old_area === val.area && adding)?
                <Button type='button' onClick={ () => {setEdit(false); setEditIndex(-1); resetAreaInfo()} }>
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
    </>
  );
}

export default Area;
