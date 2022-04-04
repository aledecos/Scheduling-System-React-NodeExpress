//https://bezkoder.com/node-js-rest-api-express-mysql/

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require('jsonwebtoken')
const mysql = require("mysql");
const bcrypt = require("bcrypt");

const app = express();
const path = require('path');

app.use(cors())
app.use(bodyParser.json());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));


const middleware = require("./middleware/controller");


//JWT Key
const JWTKEY = 'secret_key_change_later';

/**
 * @Documentation MySQL Section
 * @Help https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server
 * @Help https://stackoverflow.com/questions/44481917/mysql-shell-is-not-able-to-connect-to-mysql-server
 * @TODO Remove this JSDOC after project is complete
 */

var con = mysql.createPool({
  connectionLimit : 10,
  host     : "us-cdbr-east-03.cleardb.com",
  user     : "b10274a4345f11",
  password : "be0f3773",
  database: "heroku_0e748edbdfa9d2e"
});

function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if(typeof bearerHeader !== 'undefined')
  {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }
  else{
    res.sendStatus(403);
  }
}

/**
 * @Documentation HTTP requests located here
 * @TODO Remove this JSDOC after project is complete
 */



//Authentication controller
app.post('/login', middleware.authenticate);

//User controller
app.put('/users', middleware.updateUser);
app.put('/addUser', middleware.addUser);
app.delete('/deleteUser/:username', middleware.deleteUser);
app.get('/checkAvailability/:username', middleware.checkAvailability);


//Event Controller
app.put('/addToEvent', middleware.addToEvent, action_logTrackerMiddleware);
app.put('/removeUser', middleware.removeUser , action_logTrackerMiddleware);
app.put('/requestSub', middleware.requestSub , action_logTrackerMiddleware)
app.delete('/deleteEvent/:event_id', middleware.deleteEvent)

async function passwordValidation(username, old_password) {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM users WHERE username = ?", username, function (error, result, fields) {
      if (error)
        reject(error);
      else {
        if(result.length > 0){
          bcrypt.compare(old_password, result[0].password, (error, response) =>
          {
              if(response)
              {
                  resolve(true);
              }
              else
              {
                  //Cannot login is not authenticated
                  resolve(false);
              }
          })
        }
        //this occurs if user does not exist
        else{
            //User not found so resource not found
            resolve(false);
        }
      }
    });
  });
}

app.put('/ChangePassword', async function (req, res) {
  try
  {
      const info = req.body;
      const username = info.username;
      const old_password = info.old_password;
      const new_password = info.new_password;
      let match = await passwordValidation(username, old_password).catch((err) => { console.error(err); });
      console.log("Match: " + match);
      if(match === true){
        console.log("Changing Password");
        bcrypt.hash(new_password, saltRounds, (err, hash) =>{
            if(err)
            {
              //500 Internal Server Error. Bcrypt has error
              res.status(500).send();
              return; // Not override previous status
            }

            con.query("UPDATE users SET password = ? WHERE username = ?", [hash, username],
              (err, result) => {
                //Error checking
                if (err) {
                  //500 Internal Server Error. Which means database is giving error.
                  res.status(500).send();
                  return; // Not override previous status
                }

                if(result.affectedRows !== 0)
                {
                  //Successfully Edited
                  res.status(204).send();
                  return;
                }
                else {
                  //Resource already exists
                  res.status(404).send();
                  return; // Not override previous status
                }
            });
        });
      }
    }
  catch(err){
      //client did not send correct API Request
      res.status(400).send();
      return;
  }
})


app.delete('/deleteEventGroup/:startAndEnd', function (req, res) {
  try{
    const info = req.params.startAndEnd;
    let query = "DELETE FROM event WHERE start_date >= ? AND start_date <= ?";
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
})

app.get('/eventsAltered/:startAndEnd', middleware.eventsAltered);

app.get('/users', ensureToken ,function (req, res) {
  jwt.verify(req.token, JWTKEY, function(err, data) {
    if(err){
      console.log(err);
      res.sendStatus(403);
    }
    else{
      res.status(200).send(data);
    }
  });
})




app.get('/getUserData/:username', function (req, res) {
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
          //Checking result of database
          if(result.length !== 0){
            res.status(200).send(result);
            return;
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
})

app.get('/adminUsers/', function (req,res) {

  try{
    con.query(
      "SELECT trainer, phone_number, email, name, username, user_type FROM users",
      (err, result) => {
        //Error checking
        if (err && (result === undefined)) {
            //500 Internal Server Error. Which means database is giving error.
            res.status(500).send();
            return;
        }
        //Checking result of database
        if(result.length !== 0){

            res.status(200).send(result);
            return;
        }
        //this occurs if user does not exist
        else{
            //Successful but nothing sent back
            res.status(204).send();
            return;
        }

      }
    );
  }
  catch(err)
  {
    //Other Error
    res.status(500).send();
  }
})

function action_logTrackerMiddleware(req, res, next){

  try {
    let info = res.locals;
    let event_id = info.event_id;
    let username = info.username;
    let action_user = info.action_user;
    let result = info.result;

    con.query(
      "INSERT INTO action_log (event_id, username, action_user, result) VALUES(?, ?, ?, ?)",
      [
        event_id,
        username,
        action_user,
        result
      ],
      (err, result) => {
        //Error checking
        if (err) {
          console.log(err)
          return; // Not override previous status
        }
      }
    );

  } catch (error) {
    console.log(error);
  }
}





app.put('/updateDragDrop', function (req, res) {
  try{
    let info = req.body;
    let event_id = info.event_id;
    let start = info.start;
    let end = info.end;

    let queryString = "UPDATE event SET start_date = ?, end_date = ? WHERE event_id = ?"


    con.query(
      queryString,
      [
        start,
        end,
        event_id
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
          //Resource already deleted
          res.status(204).send();
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
    console.log(err)
    //Other Error
    res.status(500).send();
  }

})

//adding to events
app.put('/editEvent', function (req, res, next) {

  try{
    let info = req.body;
    let event_id = info.event_id;
    let event_name = info.event_name;
    let allDay = info.allDay;
    let min_patrollers = info.min_patrollers;
    let max_patrollers = info.max_patrollers;
    let max_trainees = info.max_trainees;
    let action_user = info.action_user;

    con.query(
      "UPDATE event SET event_name = ?, min_patrollers = ?, max_patrollers = ?, max_trainees = ?, all_day = ? WHERE event_id = ?",
      [
        event_name,
        min_patrollers,
        max_patrollers,
        max_trainees,
        allDay,
        event_id
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
          res.locals.event_id = event_id;
          res.locals.username = action_user;
          res.locals.action_user = action_user;
          res.locals.result = action_user + " updated event (Title, Min Pat, Max Pat, Max Train, Urgent) " + "(" + event_name + "," + min_patrollers + "," + max_patrollers + "," + max_trainees + "," + allDay + ")";
          next();

          //Resource already deleted
          res.status(204).send();
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

}, action_logTrackerMiddleware)


app.put('/editGroupEvent/:startAndEnd', function (req, res, next) {
  try{
    let query = "UPDATE event SET "
    let info = req.body;
    let event_name = info.event_name;
    if(event_name !== "") query = query + "event_name = " + con.escape(event_name) + ",";
    let allDay = info.allDay;
    if(allDay !== "") query = query + "all_day = " + con.escape(allDay) + ",";
    let min_patrollers = info.min_patrollers;
    if(min_patrollers !== "") query = query + "min_patrollers = " + con.escape(min_patrollers) + ",";
    let max_patrollers = info.max_patrollers;
    if(max_patrollers !== "") query = query + "max_patrollers = " + con.escape(max_patrollers) + ",";
    let max_trainees = info.max_trainees;
    if(max_trainees !== "") query = query + "max_trainees = " + con.escape(max_trainees) + ",";

    let action_user = info.action_user;

    if(query[query.length-1] === ",") query = query.slice(0, -1);

    query = query + " WHERE start_date >= ? AND start_date <= ?";

    let params = req.params.startAndEnd;
    splitting = params.split("$");
    let date1 = splitting[0];
    let date2 = splitting[1];
    if(splitting.length > 2) query = query + " AND (";

    console.log(query);
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

    con.query(query, [date1, date2],
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
          res.locals.username = action_user;
          res.locals.action_user = action_user;
          res.locals.result = action_user + " updated event (Title, Min Pat, Max Pat, Max Train, Urgent) " + "(" + event_name + "," + min_patrollers + "," + max_patrollers + "," + max_trainees + "," + allDay + ")";
          next();

          //Resource already deleted
          res.status(204).send();
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

}, action_logTrackerMiddleware)

app.put('/editArea', function (req, res, next) {
  try{
    let info = req.body;
    let event_id = info.event_id;
    let area = info.area;
    let username = info.username;
    let action_user = info.action_user;
    con.query(
      "UPDATE event_log SET area = ? WHERE event_id = ? AND username = ?",
      [
        area,
        event_id,
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
          //action log query for creating event
          res.locals.event_id = event_id;
          res.locals.username = username;
          res.locals.action_user = action_user;
          res.locals.result = username + " assigned " + area + " by " + action_user;
          next();
          //Resource already deleted
          res.status(204).send();
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
    console.log(err)
    //Other Error
    res.status(500).send();
  }

}, action_logTrackerMiddleware)

app.put('/editShadow', function (req, res, next) {
  try{
    let info = req.body;
    let event_id = info.event_id;
    let shadowing = info.shadowing;
    let username = info.username;
    let action_user = info.action_user;
    con.query(
      "UPDATE event_log SET shadowing = ? WHERE event_id = ? AND username = ?",
      [
        shadowing,
        event_id,
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
          //action log query for creating event
          res.locals.event_id = event_id;
          res.locals.username = username;
          res.locals.action_user = action_user;
          res.locals.result = username + " paired with " + shadowing + " by " + action_user;
          next();
          //Resource assigned
          res.status(204).send();
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
    console.log(err)
    //Other Error
    res.status(500).send();
  }

}, action_logTrackerMiddleware)


app.put('/editAttendance', function (req, res, next) {
  try{
    let info = req.body;
    let event_id = info.event_id;
    let attendance = info.attendance;
    let username = info.username;
    let action_user = info.action_user;

    con.query(
      "UPDATE event_log SET attendance = ? WHERE event_id = ? AND username = ?",
      [
        attendance,
        event_id,
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
          //action log query for creating event
          res.locals.event_id = event_id;
          res.locals.username = username;
          res.locals.action_user = action_user;
          res.locals.result = username + " marked " + attendance + " by " + action_user;
          next();

          //Resource already deleted
          res.status(204).send();
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
    console.log(err)
    //Other Error
    res.status(500).send();
  }

}, action_logTrackerMiddleware)

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




//TODO remove when project is done
app.get('/getAreas', function (req, res) {
  try
  {

    con.query(
    "SELECT * FROM area",
    (err, result) => {
        //Error checking
        if (err && (result === undefined)) {
            //500 Internal Server Error. Which means database is giving error.
            res.status(500).send();
            return;
        }
        //Checking result of database
        if(result.length !== 0){

            res.status(200).send(result);
            return;
        }
        //this occurs if user does not exist
        else{
            //Successful but nothing sent back
            res.status(204).send();
            return;
        }
    });
  }
  catch(err){
      //client did not send correct API Request
      res.status(400).send();
      return;
  }
})

app.put('/editAreas', function (req, res) {
  try
  {
	let info = req.body;
	let area = info.area;
	let old_area = info.old_area;
    con.query(
    "UPDATE area SET area=? WHERE area=?",
	[area, old_area],
    (err, result) => {
        //Error checking
        if (err && (result === undefined)) {
            //500 Internal Server Error. Which means database is giving error.
            res.status(500).send();
            return;
        }
        //Checking result of database
        if(result.length !== 0){

            res.status(200).send(result);
            return;
        }
        //this occurs if user does not exist
        else{
            //Successful but nothing sent back
            res.status(204).send();
            return;
        }
    });
  }
  catch(err){
      //client did not send correct API Request
      res.status(400).send();
      return;
  }
})

app.put('/addArea', function (req, res) {
  try
  {
	let area = req.body.area;
    con.query(
    "INSERT INTO area VALUE (?)",
	[area],
    (err, result) => {
        //Error checking
        if (err && (result === undefined)) {
            //500 Internal Server Error. Which means database is giving error.
            res.status(500).send();
            return;
        }
        //Checking result of database
        if(result.length !== 0){

            res.status(200).send(result);
            return;
        }
        //this occurs if user does not exist
        else{
            //Successful but nothing sent back
            res.status(204).send();
            return;
        }
    });
  }
  catch(err){
      //client did not send correct API Request
      res.status(400).send();
      return;
  }
})

app.delete('/deleteArea/:area', async function (req, res) {
	try
  {
		let area = req.params.area;
		con.query(
		"DELETE FROM area WHERE area=?",
		[area],
		(err, result) => {
			//Error checking
			if (err && (result === undefined)) {
				//500 Internal Server Error. Which means database is giving error.
				res.status(500).send();
				return;
			}
			//Checking result of database
			if(result.length !== 0){

				res.status(200).send(result);
				return;
			}
			//this occurs if user does not exist
			else{
				//Successful but nothing sent back
				res.status(04).send();
				return;
			}
		});
	  }
	  catch(err){
		  //client did not send correct API Request
		  res.status(400).send();
		  return;
	  }

})

//Adding to Event Log
app.put('/addToEventLog', async function (req, res, next) {
  try{
    let info = req.body;
    const event_id = info.event_id;
    const event_name = info.event_name;
    const name = info.name;
    const username = info.username;
    const user_type = info.user_type;
    const role = info.role;
    const comment = info.comment;
    const trainer = info.trainer;
    const action_user = info.action_user;


    const phone_number = ((info.phone_number == null)? "":  info.phone_number);
    const email = ((info.email == null)? "":  info.email);

    //action log query for creating event
    res.locals.event_id = event_id;
    res.locals.username = username;
    res.locals.action_user = action_user;
    res.locals.result = "";

    const exist = "SELECT * FROM event_log WHERE event_id = ? AND username = ?";
    const getMax = "SELECT * FROM event WHERE event_id = ?";
    const countLog = "SELECT COUNT(event_id) FROM event_log WHERE role = ? AND event_id = ?";
    const update = "UPDATE event_log SET timestamp_rostered = CURRENT_TIMESTAMP, event_name = ?, name = ?, user_type = ?, role = ?, comment = ?  phone_number = ?, trainer = ? WHERE event_id = ? AND username = ?"
    const checkWaitListRostered = "SELECT * FROM event_log WHERE event_id = ? AND user_type <> 'Trainee' AND role = ? LIMIT 1";
    const checkWaitListTrainee = "SELECT * FROM event_log WHERE event_id = ? AND user_type = 'Trainee' AND role = ? LIMIT 1";
    const insert = "INSERT INTO event_log (event_id, event_name, username, name, user_type, role, comment, email, phone_number, trainer) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    const waitlist = "INSERT INTO event_log (event_id, event_name, username, name, user_type, role, comment, phone_number, trainer) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)"
    const waitToRoster = "UPDATE event_log SET timestamp_rostered = CURRENT_TIMESTAMP, event_name = ?, name = ?, user_type = ?, role = ?, comment = ?, phone_number = ?, trainer = ? WHERE event_id = ? AND username = ?"
    const checkSub = "SELECT * FROM event_log WHERE event_id = ? AND user_type = 'Trainee' AND role = ? AND timestamp_subrequest <> '' LIMIT 1";
    const checkSubRostered = "SELECT * FROM event_log WHERE event_id = ? AND user_type <> 'Trainee' AND role = ? AND timestamp_subrequest <> '0000-00-00 00:00:00' LIMIT 1";
    const checkSubTrainee = "SELECT * FROM event_log WHERE event_id = ? AND user_type = 'Trainee' AND role = ? AND timestamp_subrequest <> '0000-00-00 00:00:00' LIMIT 1";
    const deleteQuery = "DELETE FROM event_log WHERE event_id = ? AND username = ? AND role = ?";


    let users = null;

    //check if user exists and await result
    const checkingExistPromise = await runQuery(exist,[event_id,username])
    .then((result) => {
      users = result;
    }).catch((err) => {
      console.log(err)
    });


    //if exists
    if(users.length !== 0)
    {
      res.locals.result = action_user + " already in table. No action.";
      next();
      //should not be able to transfer tables
      res.status(204).send();
      return;
    }
    //need to insert
    else{
      if(role !== "Shadow" &&  role !== "Unavailable")
      {
        let maxVal = 0;
        //get max assign value
        const checkMaxVal = await runQuery(getMax,[event_id])
        .then((result) => {
          maxVal = (role === "Trainee")?result[0].max_trainees:result[0].max_patrollers;
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

        let insertSuccess = false;
        if(currentVal < maxVal)
        {
          //Insert into roster
          const updateLog = await runQuery(insert, [event_id,event_name,username,name,user_type, role,comment, email, phone_number, trainer])
          .then((result) => {
            //Inserted
            res.locals.result = username + " inserted into " + role + " table " + " by " + action_user;
            insertSuccess = true;
          }).catch((err) => {
            console.log(err)
            insertSuccess = false;
          });
        }
        else{

          const transferRole = (role === "Rostered" || role === "Trainee")?role:false;

          let transfer = false;
          //see if there are any people that request sub
          const checkingSub = await runQuery((transferRole === "Trainee")?checkSubTrainee:checkSubRostered,[event_id, role])
          .then((result) => {
            transfer = (result.length !== 0)?result[0]:false;
          }).catch((err) => {
            console.log(err)
          });

          //someone has sub requet
          if(transfer !== false && currentVal-1 < maxVal)
          {
            //see if there are any people waiting on waitlist
            let waitPerson = false;
            const checkWait = await runQuery((transferRole === "Trainee")?checkWaitListTrainee:checkWaitListRostered,[event_id, "Waitlist"])
            .then((result) => {
              waitPerson = (result.length !== 0)?result[0]:false;
            }).catch((err) => {
              console.log(err)
            });


            let transferSuccess = false;
            //get person in waitlist first to rostered
            if(waitPerson !== false)
            {

              let newRole = (waitPerson.user_type === "Trainee")?"Trainee":"Rostered";
              const transfering = await runQuery(waitToRoster,[waitPerson.event_name, waitPerson.name, waitPerson.user_type, newRole, waitPerson.comment, waitPerson.trainer, event_id, waitPerson.username])
              .then((result) => {
                //success don't send back just yet

              }).catch((err) => {

                console.log(err)
              });

              //deleting person we got that has sub request
              const deleting = await runQuery(deleteQuery, [event_id, transfer.username, transfer.role])
              .then((result) => {
                res.locals.result = "Sub Requested by " + transfer.username +". Repalaced from Waitlist: " + waitPerson.username;
                //success don't send back just yet
                transferSuccess = true;
              }).catch((err) => {
                transferSuccess = false;
                console.log(err)
              });
            }
            // no one in waitlist so insert current person that wants to go as replacement
            else{
              const transfering = await runQuery(insert, [event_id,event_name,username,name,user_type, role,comment, email, phone_number, trainer])
              .then((result) => {
                //success don't send back just yet

              }).catch((err) => {

                console.log(err)
              });

              //deleting person we got that has sub request
              const deleting = await runQuery(deleteQuery, [event_id, transfer.username, transfer.role])
              .then((result) => {
                res.locals.result = "Sub Requested by " + transfer.username +". Repalaced with: " + username;
                //success don't send back just yet
                transferSuccess = true;
              }).catch((err) => {
                transferSuccess = false;
                console.log(err)
              });
            }


            if(transferSuccess)
            {
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
            //Put into waitlist
            const waitlistIn = await runQuery(waitlist, [event_id,event_name,username,name,user_type,"Waitlist",comment, phone_number, trainer])
            .then((result) => {
              //Updated
              res.locals.result = username + " inserted into Waitlist table by " + action_user;
              insertSuccess = true;
            }).catch((err) => {
              console.log(err)
              insertSuccess = true;
            });
          }
        }


        if(insertSuccess)
        {
          next();
          res.status(204).send();
          return;
        }
        else{
          //error
          res.status(500).send();
          return;
        }
      }
      else{
        //adding a shadow or unavailable no questions
        let shadowSuccess = false;
        const shadow = await runQuery(insert, [event_id,event_name,username,name,user_type,role,comment, email, phone_number, trainer])
        .then((result) => {
          res.locals.result = username + " Inserted as " + role + " by " + action_user;
          //Inserted
          shadowSuccess = true;
        }).catch((err) => {
          console.log(err)
          shadowSuccess = false;
        });

        if(shadowSuccess)
        {
          next();
          //success
          res.status(204).send();
          return;
        }
        else{
          ///error
          res.status(500).send();
          return;
        }
      }

    }

  }
  catch(err)
  {
    //Other Error
    res.status(500).send();
  }
}, action_logTrackerMiddleware)



//TODO remove when project is done
app.get('/getNameAndUsername/:user_type', function (req, res) {
  try
  {
      const user_type_temp = req.params.user_type;
      const user_type_string = (user_type_temp === "Trainee")? "WHERE user_type = 'Trainee'":"WHERE user_type = 'System Admin' OR user_type = 'Hill Admin' OR user_type = 'Hill Leader' OR user_type = 'Rostered'";

      con.query(
      "SELECT name, username, user_type, trainer, phone_number FROM users " + user_type_string,
      (err, result) => {
          //Error checking
          if (err && (result === undefined)) {
              //500 Internal Server Error. Which means database is giving error.
              res.status(500).send();
              return;
          }
          //Checking result of database
          if(result.length !== 0){

              res.status(200).send(result);
              return;
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
})

//TODO remove when project is done
app.get('/getEventLogInfo/:shiftID', function (req, res) {
  try
  {
      const eventID = req.params.shiftID;
      con.query(
      "SELECT * FROM event_log WHERE event_id = ?",
      [eventID],
      (err, result) => {
          //Error checking
          if (err && (result === undefined)) {
              //500 Internal Server Error. Which means database is giving error.
              res.status(500).send();
              return;
          }
          //Checking result of database
          if(result.length !== 0){

              res.status(200).send(result);
              return;
          }
          //this occurs if user does not exist
          else{
              //User not found so resource not found
              res.status(204).send();
              return;
          }
      });
  }
  catch(err){
      //client did not send correct API Request
      res.status(400).send();
      return;
  }
})

//TODO remove when project is done
app.get('/getActionLogInfo/:shiftID', function (req, res) {
  try
  {
      const eventID = req.params.shiftID;
      con.query(
      "SELECT * FROM action_log WHERE event_id = ?",
      [eventID],
      (err, result) => {
          //Error checking
          if (err && (result === undefined)) {
              //500 Internal Server Error. Which means database is giving error.
              res.status(500).send();
              return;
          }
          //Checking result of database
          if(result.length !== 0){

              res.status(200).send(result);
              return;
          }
          //this occurs if user does not exist
          else{
              //User not found so resource not found
              res.status(204).send();
              return;
          }
      });
  }
  catch(err){
      //client did not send correct API Request
      res.status(400).send();
      return;
  }
})



//TODO remove when project is done
app.get('/getEvents/:date', function (req, res) {
  try
  {
    const splitting = req.params.date.split("-");
    const firstyear = splitting[0];
    const secondyear = splitting[1];
    const firstmonth = splitting[2];
    const secondmonth = splitting[3];
    const lower = firstyear + '-' + firstmonth + '-' + '00';
    const upper = secondyear + '-' + secondmonth + '-' + '00';

    con.query(
    "SELECT * FROM event WHERE start_date >= ? AND start_date <= ?",
    [lower, upper],
    (err, result) => {
        //Error checking
        if (err && (result === undefined)) {
            //500 Internal Server Error. Which means database is giving error.
            res.status(500).send();
            return;
        }
        //Checking result of database
        if(result.length !== 0){

            res.status(200).send(result);
            return;
        }
        //this occurs if user does not exist
        else{
            //Successful but nothing sent back
            res.status(204).send();
            return;
        }
    });
  }
  catch(err){
      //client did not send correct API Request
      res.status(400).send();
      return;
  }
})

app.get('/getEventLogItems/:username', function (req, res) {
  try
  {
    const username = req.params.username;

    con.query(
    "SELECT event_log.event_id, event_log.event_name, area, start_date, timestamp_rostered, attendance, role FROM event_log JOIN event ON  event_log.event_id=event.event_id WHERE username = ? ORDER BY start_date DESC",
    [username],
    (err, result) => {
        //Error checking
        if (err && (result === undefined)) {
            //500 Internal Server Error. Which means database is giving error.
            res.status(500).send();
            return;
        }
        //Checking result of database
        if(result.length !== 0){
            res.status(200).send(result);
            return;
        }
        //this occurs if user does not exist
        else{
            //Successful but nothing sent back
            res.status(204).send();
            return;
        }
    });
  }
  catch(err){
      //client did not send correct API Request
      res.status(400).send();
      return;
  }
})

//TODO remove when project is done
app.get('/getShiftInfo/:shiftID', function (req, res) {
  try
  {
    const eventID = req.params.shiftID;
    con.query(
    "SELECT * FROM event WHERE event_id = ?",
    [eventID],
    (err, result) => {
        //Error checking
        if (err && (result === undefined)) {
            //500 Internal Server Error. Which means database is giving error.
            console.log(err)
            res.status(500).send();
            return;
        }
        //Checking result of database
        if(result.length !== 0){

            res.status(200).send(result);
            return;
        }
        //this occurs if user does not exist
        else{
            //Successful but nothing sent back
            res.status(204).send();
            return;
        }
    });
  }
  catch(err){
      //client did not send correct API Request
      res.status(400).send();
      return;
  }
})

app.put('/editComment', function (req, res) {
  try
  {

    let info = req.body;
    let event_id = info.event_id;
    let username = info.username;
    let comment = info.comment;

    con.query(
    "UPDATE event_log SET comment = ? WHERE event_id = ? AND username = ?",
    [comment, event_id, username],
    (err, result) => {
      if (err) {
        //500 Internal Server Error. Which means database is giving error.
        res.status(500).send();
        return; // Not override previous status
      }

      if(result.affectedRows !== 0)
      {
        //Resource already deleted
        res.status(204).send();
        return;
      }
      else
      {
        //Resource not available
        res.status(404).send();
        return; // Not override previous status
      }
    });
  }
  catch(err){
      //client did not send correct API Request
      res.status(400).send();
      return;
  }
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/public/index.html'));
});



const port = process.env.PORT||5000;
app.listen(port, () => {
    console.log(`App running on port ${port} `);
});
