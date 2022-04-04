const mysql = require("mysql");
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const saltRounds = 10;

const con = mysql.createPool({
    connectionLimit : 10,
    host     : "us-cdbr-east-03.cleardb.com",
    user     : "b10274a4345f11",
    password : "be0f3773",
    database: "heroku_0e748edbdfa9d2e"
});

function runQuery(sql, configid) {
  return new Promise((resolve, reject) => {
    con.query(sql, configid, function (error, result, fields) {
      if (error)
        reject(error);
      else {
        resolve(result);
      }
    });
  });
}

// User
function authenticate (req, res, next) {
    try
    {

        const username = req.body.username; // code
        const password = req.body.password;//code

        var return_data =  {};

        con.query(
        "SELECT * FROM users WHERE username = ?",
        username,
        (err, result) => {

            //Error checking
            if (err && (result === undefined)) {
                //500 Internal Server Error. Which means database is giving error.
                res.status(500).send();
                return;
            }

            //Checking result of login
            if(result.length > 0){
                bcrypt.compare(password, result[0].password, (error, response) =>
                {
                    if(response)
                    {
                        return_data.username = username;
                        return_data.user_type = result[0].user_type;
                        return_data.name = result[0].name;
                        return_data.phone_number = result[0].phone_number;
                        return_data.trainer = result[0].trainer;
                        res.status(200).send(return_data);
                        return;
                    }
                    else
                    {
                        //Cannot login is not authenticated
                        res.status(401).send();
                        return;
                    }
                })
            }
            //this occurs if user does not exist
            else{
                //User not found so resource not found
                res.status(404).send();
                return;
            }
        });
    }
    catch(err){
        //client did not send correct API Request
        res.status(400).send();
        return;
    }
}

function addUser (req,res) {
    try {
      let info = req.body;
      let name = info.name;
      let phone_number = info.phone_number;
      let username = info.username;
      let email = info.email;
      let user_type = info.user_type;
      let trainer = info.trainer;
      let password = info.password;

      bcrypt.hash(password, saltRounds, (err, hash) =>{
        if(err)
        {
          //500 Internal Server Error. Bcrypt has error
          res.status(500).send();
          return; // Not override previous status
        }

        con.query("INSERT INTO users (name,phone_number,username,password,email,user_type,trainer) VALUES (?,?,?,?,?,?,?)",
        [
          name,
          phone_number,
          username,
          hash,
          email,
          user_type,
          trainer
        ],
          (err, result) => {
            //Error checking
            if (err) {
              //500 Internal Server Error. Which means database is giving error.
              res.status(500).send();
              return; // Not override previous status
            }

            if(result.affectedRows !== 0)
            {
              //Successfully Added
              res.status(204).send();
              return;
            }
            else {
              //Resource already exists
              res.status(404).send();
              return; // Not override previous status
            }
          }
        )
      });
    }
    catch(err)
    {
      //Other Error
      res.status(500).send();
    }

}

function updateUser (req, res) {
    try{
      let info = req.body;
      let name = info.name;
      let phone_number = info.phone_number;
      let username = info.username;
      let email = info.email;
      let user_type = info.user_type;
      let trainer = info.trainer;

      con.query(
        "UPDATE users SET name = ?, phone_number = ?, username = ?, email = ?, user_type = ?, trainer = ? WHERE username = ?",
        [
          name,
          phone_number,
          username,
          email,
          user_type,
          trainer,
          username
        ],
        (err, result) => {

          //Error checking
          if (err) {
            //500 Internal Server Error. Which means database is giving error.
            res.status(500).send();
            return; // Not override previous status
          }


          if(result.affectedRows !== 0)
          {
            // //1 means it worked
            let article = {
              name: name,
              phone_number: phone_number,
              username: username,
              email: email,
              user_type: user_type,
              trainer: trainer
            };
            //Resource already deleted
            res.status(200).send(article);
            return;
          }
          else
          {
            //Resource not available
            res.status(404).send();
            return; // Not override previous status
          }

        }
      );
    }
    catch(err)
    {
      //Other Error
      res.status(500).send();
    }

}

function deleteUser (req, res) {
    try{
      const username = req.params.username;
      con.query(
        "DELETE FROM users WHERE username = ?",
        username,
        (err, result) => {
          //Error checking
          if (err) {
            //500 Internal Server Error. Which means database is giving error.
            res.status(500).send();
            return; // Not override previous status
          }
          else if(result.affectedRows === 0)
          {
            //Resource already deleted
            res.status(410).send();
            return; // Not override previous status
          }
          else
          {
            //Server did deleted user
            res.status(204).send();
            return; // Not override previous status
          }
        }
      );
    }
    catch(err)
    {
      //Other Error
      res.status(500).send();
    }


}

//Event Fucntions

function eventsAltered(req, res) {
  const info = req.params.startAndEnd;
  let query = "SELECT * FROM event WHERE start_date >= ? AND start_date <= ?";
  splitting = info.split("$");
  let date1 = splitting[0];
  let date2 = splitting[1];
  if(splitting.length > 2) query = query + " AND (";
  for(let i = 2; i < splitting.length; i++)
  {
    switch(splitting[i]){
      case "Sunday":
        query = query + "WEEKDAY(start_date)=6";
        break;
      case "Monday":
        query = query + "WEEKDAY(start_date)=0";
        break;
      case "Tuesday":
        query = query + "WEEKDAY(start_date)=1";
        break;
      case "Wednesday":
        query = query + "WEEKDAY(start_date)=2";
        break;
      case "Thursday":
        query = query + "WEEKDAY(start_date)=3";
        break;
      case "Friday":
        query = query + "WEEKDAY(start_date)=4";
        break;
      case "Saturday":
        query = query + "WEEKDAY(start_date)=5";
        break;
  }

    if(i !== splitting.length - 1) query = query + " OR ";
  }

  if(splitting.length > 2) query = query + ")";

  con.query(query,
    [date1, date2],
    (err, result) => {
      //Error checking
      if (err) {
        //500 Internal Server Error. Which means database is giving error.
        res.status(500).send();
        return; // Not override previous status
      }
      else if(result.length === 0)
      {
        //Resource not found
        res.status(204).send();
        return; // Not override previous status
      }
      else
      {
        //Server did deleted user
        res.status(200).send(result);
        return; // Not override previous status
      }
    }
  );
}
function addToEvent(req, res, next) {

  try{

    let info = req.body;

    let event_name = info.event_name;
    let start = info.start;
    let end = info.end;
    let allDay = info.allDay;
    let min_patrollers = info.min_patrollers;
    let max_patrollers = info.max_patrollers;
    let max_trainees = info.max_trainees;
    let username = info.username;
    let action_user = info.action_user;

    con.query(
      "INSERT INTO event (event_name, start_date, end_date, min_patrollers, max_patrollers, max_trainees, all_day) VALUES(?, ?, ?, ?, ?, ?, ?)",
      [
        event_name,
        start,
        end,
        min_patrollers,
        max_patrollers,
        max_trainees,
        allDay
      ],
      (err, result) => {
        //Error checking
        if (err) {
          //500 Internal Server Error. Which means database is giving error.
          res.status(500).send();
          return; // Not override previous status
        }

        if(result.affectedRows !== 0)
        {
          //action log query for creating event
          res.locals.event_id = result.insertId;
          res.locals.username = username;
          res.locals.action_user = action_user;
          res.locals.result = action_user + " created event (Title, Min Pat, Max Pat, Max Train, Urgent) " + "(" + event_name + "," + min_patrollers + "," + max_patrollers + "," + max_trainees + "," + allDay + ")";
          next();
          //Resource created
          res.status(200);
          res.send(result);
          return;
        }
        else
        {
          //No Rows effected error
          res.status(409).send();
          return; // Not override previous status
        }

      }
    );
  }
  catch(err)
  {
    //Other Error
    res.status(500).send();
  }
}

function checkAvailability (req, res) {
  try
  {
      const username = req.params.username; // code
      con.query(
      "SELECT * FROM users WHERE username = ?",
      username,
      (err, result) => {

          //Error checking
          if (err && (result === undefined)) {
              //500 Internal Server Error. Which means database is giving error.
              res.status(500).send();
              return;
          }
          //Checking result of database
          if(result.length === 0){

              res.status(204).send();
              return;

          }
          //this occurs if user does not exist
          else{
              //User found
              res.status(200).send();
              return;
          }
      });
  }
  catch(err){
      //client did not send correct API Request
      res.status(400).send();
      return;
  }
}

function deleteEvent(req, res) {
  try{
    const event_id = req.params.event_id;
    con.query(
      "DELETE FROM event WHERE event_id = ?",
      event_id,
      (err, result) => {
        //Error checking
        if (err) {
          //500 Internal Server Error. Which means database is giving error.
          res.status(500).send();
          return; // Not override previous status
        }
        else if(result.affectedRows === 0)
        {
          //Resource already deleted
          res.status(410).send();
          return; // Not override previous status
        }
        else
        {
          //Server did deleted event
          res.status(204).send();
          return; // Not override previous status
        }
      }
    );
  }
  catch(err)
  {
    //Other Error
    res.status(500).send();
  }
}

//Event
async function requestSub(req, res, next) {
  try{
    const info = req.body;
    const event_id = info.event_id;
    const username = info.username;
    const role = info.role;
    const action_user = info.action_user;

    const exist = "SELECT * FROM event_log WHERE event_id = ? AND username = ?";
    const deleteQuery = "DELETE FROM event_log WHERE event_id = ? AND username = ? AND role = ?";
    const getMax = "SELECT * FROM event WHERE event_id = ?";
    const countLog = "SELECT COUNT(event_id) FROM event_log WHERE role = ? AND event_id = ?";
    const checkWaitListRostered = "SELECT * FROM event_log WHERE event_id = ? AND user_type <> 'Trainee' AND role = ? LIMIT 1";
    const checkWaitListTrainee = "SELECT * FROM event_log WHERE event_id = ? AND user_type = 'Trainee' AND role = ? LIMIT 1";
    const waitToRoster = "UPDATE event_log SET timestamp_rostered = CURRENT_TIMESTAMP, event_name = ?, name = ?, user_type = ?, role = ?, comment = ? WHERE event_id = ? AND username = ?"
    const updateToSub = "UPDATE event_log SET timestamp_subrequest = CURRENT_TIMESTAMP WHERE event_id = ? AND username = ?"
    const deSubb = "UPDATE event_log SET timestamp_subrequest = '0000-00-00 00:00:00' WHERE event_id = ? AND username = ?"

    //action log query for creating event
    res.locals.event_id = event_id;
    res.locals.username = username;
    res.locals.action_user = action_user;
    res.locals.result = "";

    let users = null;

    //check if user exists and await result
    const checkingExistPromise = await runQuery(exist,[event_id,username])
    .then((result) => {
      users = result;
    }).catch((err) => {
      console.log(err)
    });

    if(users === null)
    {
      res.status(500).send(); // database error
      return;
    }

    //if exists
    if(users.length !== 0)
    {

      // if already sub request they have to be de sub requested
      if(users[0].timestamp_subrequest !== '0000-00-00 00:00:00')
      {
        //check if user exists and await result
        let success = false;
        const subUpdate = await runQuery(deSubb,[event_id,username])
        .then((result) => {
          success = true;
        }).catch((err) => {
          success = false;
          console.log(err)
        });

        if(success)
        {
          res.locals.result = "Unrequest Sub by " + action_user;
          next();
          res.status(204).send();
          return;
        }
        else{
          res.status(500).send();
          return;
        }
      }

      //sub request
      else
      {
        if(role !== "Shadow" && role !== "Waitlist")
        {
          let maxVal = 0;
          //get max assign value
          const checkMaxVal = await runQuery(getMax,[event_id])
          .then((result) => {
            maxVal = (users[0].role === "Trainee")?result[0].max_trainees:result[0].max_patrollers;
          }).catch((err) => {
            console.log(err)
          });

          let currentVal = 0;
          //get current Assigned Count
          const checkCurrentVal = await runQuery(countLog,[role,event_id])
          .then((result) => {
            currentVal = result[0]['COUNT(event_id)'];
          }).catch((err) => {
            console.log(err)
          });

          //-1 is if the person potentially was removed from the table
          if(currentVal-1 < maxVal)
          {
            const transferRole = (role === "Rostered" || role === "Trainee")?role:false;
            if(transferRole !== false)
            {
              let transfer = false;
              //see if there are any people waiting on waitlist
              const checkWait = await runQuery((transferRole === "Trainee")?checkWaitListTrainee:checkWaitListRostered,[event_id, "Waitlist"])
              .then((result) => {
                transfer = (result.length !== 0)?result[0]:false;
              }).catch((err) => {
                console.log(err)
              });

              if(transfer !== false)
              {
                let transferSuccess = false;
                let newRole = (transfer.user_type === "Trainee")?"Trainee":"Rostered";
                const transfering = await runQuery(waitToRoster,[transfer.event_name, transfer.name, transfer.user_type, newRole, transfer.comment, event_id, transfer.username])
                .then((result) => {
                  //success don't send back just yet

                }).catch((err) => {

                  console.log(err)
                });

                let deleted = false;
                const deleting = await runQuery(deleteQuery, [event_id, username, role])
                .then((result) => {
                  //success don't send back just yet
                  transferSuccess = true;
                }).catch((err) => {
                  transferSuccess = false;
                  console.log(err)
                });

                if(transferSuccess)
                {
                  res.locals.result = "Sub Requested by " + action_user +". Repalaced from Waitlist: " + transfer.username;
                  next();
                  res.status(204).send();
                  return;
                }
                else{
                  res.status(500).send();
                  return;
                }
              }
              else{
                //check if user exists and await result
                let success = false;
                const subUpdate = await runQuery(updateToSub,[event_id,username])
                .then((result) => {
                  success = true;
                }).catch((err) => {
                  success = false;
                  console.log(err)
                });

                if(success)
                {
                  res.locals.result = "Sub Requested by " + action_user;
                  next();
                  res.status(204).send();
                  return;
                }
                else{
                  res.status(500).send();
                  return;
                }

              }
            }
          }

          res.locals.result = "Sub Requested by Shadow or Waitlist: Not supported";
          next();
          //They are in shadow or waitlist
          res.sendStatus(204);
          return;
        }
        else{
          //error with database
          res.status(500).send();
          return;
        }
      }

    }
    else
    {
      res.status(404).send();
      return;
    }


  }
  catch(err)
  {
    console.log(err)
    res.status(500).send();
    return;
  }

}


async function removeUser (req, res, next) {
  try{
    const info = req.body;
    const event_id = info.event_id;
    const username = info.username;
    const role = info.role;
    const action_user = info.action_user;

    const exist = "SELECT * FROM event_log WHERE event_id = ? AND username = ?";
    const deleteQuery = "DELETE FROM event_log WHERE event_id = ? AND username = ? AND role = ?";
    const getMax = "SELECT * FROM event WHERE event_id = ?";
    const countLog = "SELECT COUNT(event_id) FROM event_log WHERE role = ? AND event_id = ?";
    const checkWaitListRostered = "SELECT * FROM event_log WHERE event_id = ? AND user_type <> 'Trainee' AND role = ? LIMIT 1";
    const checkWaitListTrainee = "SELECT * FROM event_log WHERE event_id = ? AND user_type = 'Trainee' AND role = ? LIMIT 1";
    const waitToRoster = "UPDATE event_log SET timestamp_rostered = CURRENT_TIMESTAMP, event_name = ?, name = ?, user_type = ?, role = ?, comment = ? WHERE event_id = ? AND username = ?"


    let users = null;

    //check if user exists and await result
    const checkingExistPromise = await runQuery(exist,[event_id,username])
    .then((result) => {
      users = result;
    }).catch((err) => {
      console.log(err)
    });

     //action log query for creating event
     res.locals.event_id = event_id;
     res.locals.username = username;
     res.locals.action_user = action_user;
     res.locals.result = "";

    //if exists
    if(users.length !== 0)
    {
      let deleted = false;
      const deleting = await runQuery(deleteQuery, [event_id, username, role])
      .then((result) => {
        //success don't send back just yet
        res.locals.result = res.locals.result + username + " Removed by " + action_user + ".";
        deleted = true;
      }).catch((err) => {
        console.log(err)
      });

      if(deleted && role !== "Shadow" && role !== "Waitlist")
      {
        let maxVal = 0;
        //get max assign value
        const checkMaxVal = await runQuery(getMax,[event_id])
        .then((result) => {
          maxVal = (users[0].role === "Trainee")?result[0].max_trainees:result[0].max_patrollers;
        }).catch((err) => {
          console.log(err)
        });

        let currentVal = 0;
        //get current Assigned Count
        const checkCurrentVal = await runQuery(countLog,[role,event_id])
        .then((result) => {
          currentVal = result[0]['COUNT(event_id)'];
        }).catch((err) => {
          console.log(err)
        });


        if(currentVal < maxVal)
        {
          const transferRole = (role === "Rostered" || role === "Trainee")?role:false;
          if(transferRole !== false)
          {
            let transfer = false;
            //see if there are any people waiting on waitlist
            const checkWait = await runQuery((transferRole === "Trainee")?checkWaitListTrainee:checkWaitListRostered,[event_id, "Waitlist"])
            .then((result) => {
              transfer = (result.length !== 0)?result[0]:false;
            }).catch((err) => {
              console.log(err)
            });

            if(transfer !== false)
            {
              let transferSuccess = false;
              let newRole = (transfer.user_type === "Trainee")?"Trainee":"Rostered";
              const transfering = await runQuery(waitToRoster,[transfer.event_name, transfer.name, transfer.user_type, newRole, transfer.comment, event_id, transfer.username])
              .then((result) => {
                transferSuccess = true;
                res.locals.result = res.locals.result + " Replaced from Waitlist " + transfer.username;
                return;
              }).catch((err) => {
                transferSuccess = false;
                console.log(err)
              });

              if(transferSuccess)
              {
                next();
                res.status(204).send();
                return;
              }
              else{
                //error with database
                res.status(500).send();
                return;
              }
            }
          }
        }
        //no need to transfer, only delete happened
        next();
        res.sendStatus(204);
        return;
      }
      else{
        //error with database
        res.sendStatus(204);
        return;
      }


    }
    else{
      res.status(404).send();
      return;
    }


  }
  catch(err)
  {
    console.log(err)
    res.status(500).send();
    return;
  }

}


module.exports = {
    authenticate : authenticate,
    addUser: addUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    requestSub: requestSub,
    deleteEvent: deleteEvent,
    eventsAltered: eventsAltered,
    addToEvent: addToEvent,
    checkAvailability: checkAvailability,
    removeUser: removeUser,
}

