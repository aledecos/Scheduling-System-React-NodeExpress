import axios from 'axios';

//Getting Shifts into Calendar
export async function getCalendarData(fetchInfo, Updater, dragDropEnable, totalShifts, setTotalShifts, setDragDropEnable ) {

    let allShifts = [];

    try {

      if(Updater)
      {
        allShifts = []
        let low_year = new Date().getFullYear();
        let high_year = new Date().getFullYear();
        let low_month = new Date().getMonth() + 1;
        let high_month = new Date().getMonth() + 1;

        if (fetchInfo) {
          low_year = new Date(fetchInfo.start).getFullYear();
          high_year = new Date(fetchInfo.end).getFullYear();
          low_month = new Date(fetchInfo.start).getMonth() + 1;
          high_month = new Date(fetchInfo.end).getMonth() + 1;
          high_month = (high_month === 12)? 1:high_month+1;
        }

        //Setting on and off of pop up
        let sendString = low_year + '-' + high_year + '-' + low_month + '-' + high_month;
        await axios.get('/getEvents/'+ sendString)
          .then(response => {
            //if error from database
            if(response.status === 200)
            {
              for (let i = 0; i < response.data.length; i++) {
                  let tempStore = {
                    id: response.data[i].event_id, //Assigns shift ID
                    title: String(response.data[i].event_name), //Assigns shift Title
                    start: String(response.data[i].start_date).replace(/Z/g,''), //Assigns the start date
                    end: String(response.data[i].end_date).replace(/Z/g,''),
                    allDay: true,
                    color: (response.data[i].all_day === '1')?'#A2242F':'#34568B',
                    start_date: response.data[i].start_date,
                    end_date: response.data[i].end_date,
                  }
                  allShifts.push(tempStore);
              }
            }
            else{
                console.log("No Shifts")
            }
          })
          .catch((error) => {
              console.log('error ' + error);
          });

        //only allow drag and drop after first 2 event cycles to avoid duplication error.
        if(dragDropEnable === "first")
          setDragDropEnable("second");
        else if (dragDropEnable === "second")
          setDragDropEnable("third");
      }

    }
    catch (error) {
      console.log(error);
    }
    await setTotalShifts(allShifts);
    return   (allShifts)
}


//When shift is clicked set Event

export const selectShiftHandler = async (clickInfo, setCurrentShift, currentShift, dragDropEnable, setDragDropEnable, setShiftInfo, setRosteredList, setUnavailList, setTraineeList, setWaitlist, setUpdater, setShadowList, setList, setActionLog) => {

  try {
    let compare = currentShift;
    if(compare === null || compare === undefined)
    {
      //assign it nothing so make || true
      compare = {
        event:{
          id:""
        }
      }
    }


    if(clickInfo.event.proxy === "yes" || compare.event.id !== clickInfo.event.id)
    {
      //current shift if not selected before
      await setCurrentShift(clickInfo);


      //disable drag and drop while shift info is getting retrieved
      await setDragDropEnable("second");

      //Setting on and off of pop up
      await axios.get('/getShiftInfo/'+ clickInfo.event.id)
      .then(response => {
        //correct response
        if(response.status === 200)
        {
          setShiftInfo(
            {
              hl: response.data[0].hl_user,
              min_pat: response.data[0].min_patrollers,
              max_pat: response.data[0].max_patrollers,
              current_ros: "",
              max_trainee: response.data[0].max_trainees,
              event_name: response.data[0].event_name,
              all_day: response.data[0].all_day,
              startStr: clickInfo.event.startStr,
            }
          )
        }
        else{
            console.log("No Shifts")
        }
      })
      .catch((error) => {
          console.log('error ' + error);
      });


      //Getting the action log
      axios.get('/getActionLogInfo/'+ clickInfo.event.id)
      .then(response => {
          //correct response
          if(response.status === 200)
          {
            setActionLog(response.data)
          }
          else{
              console.log("No Actions")
          }
      })
      .catch((error) => {
          console.log('error ' + error);
      });

      let rostered_list = [];
      let unavail_list = [];
      let trainee_list = [];
      let wait_list = [];
      let shadow_list = [];

      //Getting the Event Log Users
      await axios.get('/getEventLogInfo/'+ clickInfo.event.id)
      .then(response => {
          //correct response
          if(response.status === 200)
          {
            setList(response.data);
            for(let i = 0; i < response.data.length; i++ )
            {
              if(response.data[i].role === 'Rostered')
              {
                rostered_list.push(response.data[i])
              }
              else if(response.data[i].role === 'Unavailable')
              {
                unavail_list.push(response.data[i])
              }
              else if(response.data[i].role === 'Trainee'){
                trainee_list.push(response.data[i])
              }
              else if(response.data[i].role === 'Waitlist'){
                wait_list.push(response.data[i])
              }
              else if(response.data[i].role === 'Shadow'){
                shadow_list.push(response.data[i])
              }

            }
          }
          else{
              console.log("No Shifts")
          }
      })
      .catch((error) => {
          console.log('error ' + error);
      });

      //current shift amount
      setShiftInfo(prev => (
        {
            ...prev,
            current_ros: rostered_list.length,
        }
      ))
      //Setting table viewable
      setRosteredList(rostered_list);
      setUnavailList(unavail_list)
      setTraineeList(trainee_list);
      setWaitlist(wait_list);
      setShadowList(shadow_list);

      if(compare.event.id !== clickInfo.event.id || dragDropEnable === "third")
      {
        await setUpdater(true);
      }


    }
  } catch (error) {
    console.log(error);
  }
}

export const linkShiftHandler = async (linkId, setCurrentShift, setShiftInfo, setRosteredList, setUnavailList, setTraineeList, setWaitlist, setUpdater, setShadowList, setActionLog) => {

  try {
    //current shift

    //Setting on and off of pop up
    await axios.get('/getShiftInfo/'+ linkId.event.id)
    .then(response => {
      //correct response
      if(response.status === 200)
      {
        setShiftInfo(
          {
            hl: response.data[0].hl_user,
            min_pat: response.data[0].min_patrollers,
            max_pat: response.data[0].max_patrollers,
            current_ros: "",
            max_trainee: response.data[0].max_trainees,
            event_name: response.data[0].event_name,
            all_day: response.data[0].all_day,
            startStr: response.data[0].start_date.substring(0,10),
          }
        )
        setCurrentShift({
          event: {
            id: linkId.event.id,
            startStr: response.data[0].start_date.substring(0,10),
            endStr: response.data[0].end_date.substring(0,10),
            title: response.data[0].event_name,
            allDay: response.data[0].all_day,
            start_date: response.data[0].start_date,
            end_date: response.data[0].end_date,
          }
        });
      }
      else{
          console.log("No Shifts")
      }
    })
    .catch((error) => {
        console.log('error ' + error);
    });

    //Getting the action log
    axios.get('/getActionLogInfo/'+ linkId.event.id)
    .then(response => {
        //correct response
        if(response.status === 200)
        {
          setActionLog(response.data)
        }
        else{
            console.log("No Actions")
        }
    })
    .catch((error) => {
        console.log('error ' + error);
    });

    let rostered_list = [];
    let unavail_list = [];
    let trainee_list = [];
    let wait_list = [];
    let shadow_list = [];

    //Getting the Event Log Users
    await axios.get('/getEventLogInfo/'+ linkId.event.id)
    .then(response => {
        //correct response
        if(response.status === 200)
        {
          for(let i = 0; i < response.data.length; i++ )
          {
            if(response.data[i].role === 'Rostered')
            {
              rostered_list.push(response.data[i])
            }
            else if(response.data[i].role === 'Unavailable')
            {
              unavail_list.push(response.data[i])
            }
            else if(response.data[i].role === 'Trainee'){
              trainee_list.push(response.data[i])
            }
            else if(response.data[i].role === 'Waitlist'){
              wait_list.push(response.data[i])
            }
            else if(response.data[i].role === 'Shadow'){
              shadow_list.push(response.data[i])
            }

          }
        }
        else{
            console.log("No Shifts")
        }
    })
    .catch((error) => {
        console.log('error ' + error);
    });

    //current shift amount
    setShiftInfo(prev => (
      {
          ...prev,
          current_ros: rostered_list.length,
      }
    ))
    //Setting table viewable
    setRosteredList(rostered_list);
    setUnavailList(unavail_list)
    setTraineeList(trainee_list);
    setWaitlist(wait_list);
    setShadowList(shadow_list);

    setUpdater(true);


  } catch (error) {
    console.log(error);
  }
}

//When one of the dates is clicked, allow user to create a new shift
export const createShiftHandler = async (selectedDate, userAuth, setSelectedDate, setEventAddModal, setCurrentShift, setResetter) => {
  await setCurrentShift(null);
  setResetter(true);
  if(userAuth.user_type !== "" && userAuth.user_type !== "Rostered" && userAuth.user_type !== "Trainee")
  {

      setSelectedDate(selectedDate);
      setEventAddModal(true);
  }
}

//When one of the dates is clicked, allow user to create a new shift
export const dragDropShift = async (e, dragDropEnable, setUpdater, totalShifts, setTotalShifts, userAuth, setDragDropEnable, setShiftInfo, setProxySelect) => {

  if((userAuth.user_type === "System Admin" || userAuth.user_type === "Hill Admin") )
  {
    if(dragDropEnable === "third")
    {
      let shifts = totalShifts;

      const oldDateStart = new Date(e.oldEvent.startStr);
      const newDateStart = new Date(e.event.startStr);
      const diffStart = newDateStart - oldDateStart;

      const oldDateEnd = new Date(e.oldEvent.endStr);
      const newDateEnd = new Date(e.event.endStr);
      const diffEnd = newDateEnd - oldDateEnd;

      let newShiftInfo = []

      //avoid weird skipping glitch when you update it updates 4 times due to updating the currentShift state
      for(let i = 0; i < shifts.length; i++)
      {
        if(shifts[i].id == e.event.id)
        {
          let currentTempStart = new Date(shifts[i].start)
          currentTempStart = new Date(currentTempStart.getTime() + currentTempStart.getTimezoneOffset() * 60000);
          let newTempStart = new Date(currentTempStart.getTime() + diffStart);

          let currentTempEnd = new Date(shifts[i].end)
          currentTempEnd = new Date(currentTempEnd.getTime() + currentTempEnd.getTimezoneOffset() * 60000);
          let newTempEnd = new Date(currentTempEnd.getTime() + diffEnd);

          //start String
          let month = newTempStart.getMonth()+1;
          let startString = newTempStart.getFullYear() + "-" + ((month < 10)?'0'+ month : month) + "-" + ((newTempStart.getDate() < 10)?'0'+ newTempStart.getDate() : newTempStart.getDate());

          //End String
          month = newTempEnd.getMonth()+1;
          let endString = newTempEnd.getFullYear() + "-" + ((month < 10)?'0'+ month : month) + "-" + ((newTempEnd.getDate() < 10)?'0'+ newTempEnd.getDate() : newTempEnd.getDate());

          newShiftInfo.push(
            {
              id: shifts[i].id,
              start: startString,
              end: endString
            }
          );

          shifts[i].start = startString;
          shifts[i].end = endString;
        }
      }

      for(let i = 0; i < newShiftInfo.length; i++)
      {
        let article = {
          event_id: newShiftInfo[i].id,
          start: newShiftInfo[i].start, //Specifies start date
          end: newShiftInfo[i].end, //Specifies end date
        };
        let good = false;
        await axios.put('/updateDragDrop', article)
        .then(response => {
            //if error from database
            if(response.status === 204)
            {
              //success set total shifts and await - moved outside
              good = true;
            }
            else{
                console.log("Error in DB")
            }
        });

        if(good)
        {
          //proxy select to update shift
          let storeShift = {
            event: {
                proxy: 'yes',
                id: e.event.id,
                title: e.event.title,
                groupId: e.event.groupId,
                start: e.event.start,
                end: e.event.end,
                startStr: e.event.startStr,
                endStr: e.event.endStr,
            }
          }
          setProxySelect(storeShift);

          await setTotalShifts(shifts);
        }
      }
    }
  }
  else{
    if(dragDropEnable === "third")
    {
      setDragDropEnable("second")
      setUpdater(true);
    }
  }
}
