//Need for all tests
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server.js");

//Needed for Some tests
const mysql = require("mysql");

//Assertion Style
chai.should();

//http protocol
chai.use(chaiHttp);


//Template for node.js SQL setup
var con = mysql.createConnection({
  connectionLimit : 10,
  host     : "us-cdbr-east-03.cleardb.com",
  user     : "b10274a4345f11",
  password : "be0f3773",
  database: "heroku_0e748edbdfa9d2e",
});
//database connection
con.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  };
  console.log("Connected for editing User test");

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


describe('Server.js API', () => {

    describe("app.put('/addToEvent')", () => {

        //reset database 
        before(async function(){
          const query = await runQuery("INSERT INTO users (username) VALUES (?)",["addSingleEventUser1"])
          .then((result) => {
              console.log("Created addSingleEventUser1 for Test")
          }).catch((err) => {
              console.log(err)
          });
            
        })


        let insertedEventID = '';
        after(async function() {
            // runs once after the last test in this block
            const query = await runQuery("DELETE FROM users WHERE username = ?",["addSingleEventUser1"])
            .then((result) => {
                console.log("Deleted addSingleEventUser1")
            }).catch((err) => {
                console.log(err)
            });  

            // runs once after the last test in this block
            const query2 = await runQuery("DELETE FROM event WHERE event_id = ?",[insertedEventID])
            .then((result) => {
                console.log("Deleted Event with ID insertedEventID")
            }).catch((err) => {
                console.log(err)
            }); 
        });

        it("Add Event - Bad Input 1 - Missing/Wrong JSON Objects", (done) => {
            let article = {
                event_name: 'title',
                start: "2021-03-05", //Specifies start date
                end: "2021-03-06", //Specifies end date
                allDay: false, //Specifies whether shift will be an all day shift
                min_patrollers: 2,
                // max_patrollers: 2,
                // max_trainees: 2,
                username: 'addSingleEventUser1',
                // action_user: 'addSingleEventUser1',
            };
            chai.request('http://localhost:5000')
            .put("/addToEvent")
            .send(article)
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                //check that user returned has correct username
                response.body.should.be.a('Object');
                response.status.should.be.eq(500);
                Object.keys(response.body).length.should.eq(0); // way to check the json body {} is empty since it is 204 it should return nothing
                done();
            })
        })

        it("Add Event - Good Input ", (done) => {
            let article = {
                event_name: 'Backend Testing',
                start: "2021-03-05", //Specifies start date
                end: "2021-03-06", //Specifies end date
                allDay: false, //Specifies whether shift will be an all day shift
                min_patrollers: 2,
                max_patrollers: 2,
                max_trainees: 2,
                username: 'addSingleEventUser1',
                action_user: 'addSingleEventUser1',
            };
            chai.request('http://localhost:5000')
            .put("/addToEvent")
            .send(article)
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                //check that user returned has correct username
                response.body.should.be.a('Object');

                response.status.should.be.eq(200);
                Object.keys(response.body).length.should.eq(8); // way to check the json body {} is empty since it is 204 it should return nothing

                insertedEventID = response.body.insertId // to delete event
                done();
            })
        })


    })
    
})


describe('Server Unit Test', () => {
// describe('Server Unit Test', () => {

    //reset database 
    before(async function(){
      const query = await runQuery("INSERT INTO users (username) VALUES (?)",["addSingleEventUser2"])
      .then((result) => {
          console.log("Created addSingleEventUser2 for Test")
      }).catch((err) => {
          console.log(err)
      });
        
    })


    let insertedEventID = '';
    after(async function() {
        // runs once after the last test in this block
        const query = await runQuery("DELETE FROM users WHERE username = ?",["addSingleEventUser2"])
        .then((result) => {
            console.log("Deleted addSingleEventUser2")
        }).catch((err) => {
            console.log(err)
        });  

        // runs once after the last test in this block
        const query2 = await runQuery("DELETE FROM event WHERE event_id = ?",[insertedEventID])
        .then((result) => {
            console.log("Deleted Event with ID " + insertedEventID)
        }).catch((err) => {
            console.log(err)
        }); 
    });

    describe("app.put('/addToEvent')", () => {

        it("Add Event - Bad Input 1 - Missing/Wrong JSON Objects", (done) => {
          //how get and delete are formatted
          let req = {body: {
            event_name: 'title',
            start: "2021-03-05", //Specifies start date
            end: "2021-03-06", //Specifies end date
            allDay: false, //Specifies whether shift will be an all day shift
            // min_patrollers: 2,
            // max_patrollers: 2,
            // max_trainees: 2,
            username: 'addSingleEventUser2',
            action_user: 'addSingleEventUser2',
          }}; // input from Client


          try{

            let info = req.body;
        
            let event_name = info.event_name;
            event_name.should.be.eq("title"); // Test 

            let start = info.start;
            start.should.be.eq("2021-03-05"); // Test 

            let end = info.end;
            end.should.be.eq("2021-03-06"); // Test 

            let allDay = info.allDay;
            allDay.should.be.eq(false); // Test 

            let min_patrollers = info.min_patrollers;
            //min_patrollers.should.be.eq(2); // Test 

            let max_patrollers = info.max_patrollers;
            //max_patrollers.should.be.eq(2); // Test 

            let max_trainees = info.max_trainees;
            //max_trainees.should.be.eq(2); // Test 

            let username = info.username;
            username.should.be.eq('addSingleEventUser2'); // Test 

            let action_user = info.action_user;
            action_user.should.be.eq('addSingleEventUser2'); // Test 

        
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

                let databaseError = (err === null); // Test helper
                databaseError.should.be.eq(false); // Test
                
                let databaseResult = (result === undefined); // Test helper
                databaseResult.should.be.eq(true); // Test

                //Error checking
                if (err) {
                  //500 Internal Server Error. Which means database is giving error.
                //   res.status(500).send();
                    done(); // Correct Response
                    return; // Not override previous status
                }
        
                if(result.affectedRows !== 0)
                {
                    //   //action log query for creating event
                    //   res.locals.event_id = result.insertId;
                    //   res.status(200);
                    //   res.send(result);
                    done(new Error("Insertion Attempted")); // Correct Response
                    return;
                }
                else
                {
                  //Resource not available
                    done(new Error("Resource Already Exists")); // Correct response
                    //   res.status(204).send();
                  return; // Not override previous status
                }
        
              }
            );
          }
          catch(err)
          {
            //Other Error
            done(new Error("Error Thrown"));
            // res.status(500).send();
          }
        })

        it("Add Event - Good Input ", (done) => {
            //how get and delete are formatted
            let req = {body: {
              event_name: 'title',
              start: "2021-03-05", //Specifies start date
              end: "2021-03-06", //Specifies end date
              allDay: false, //Specifies whether shift will be an all day shift
              min_patrollers: 2,
              max_patrollers: 2,
              max_trainees: 2,
              username: 'addSingleEventUser2',
              action_user: 'addSingleEventUser2',
            }}; // input from Client
  
  
            try{
  
              let info = req.body;
          
              let event_name = info.event_name;
              event_name.should.be.eq("title"); // Test 
  
              let start = info.start;
              start.should.be.eq("2021-03-05"); // Test 
  
              let end = info.end;
              end.should.be.eq("2021-03-06"); // Test 
  
              let allDay = info.allDay;
              allDay.should.be.eq(false); // Test 
  
              let min_patrollers = info.min_patrollers;
              min_patrollers.should.be.eq(2); // Test 
  
              let max_patrollers = info.max_patrollers;
              max_patrollers.should.be.eq(2); // Test 
  
              let max_trainees = info.max_trainees;
              max_trainees.should.be.eq(2); // Test 
  
              let username = info.username;
              username.should.be.eq('addSingleEventUser2'); // Test 
  
              let action_user = info.action_user;
              action_user.should.be.eq('addSingleEventUser2'); // Test 
  
          
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

                let databaseError = (err === null); // Test helper
                databaseError.should.be.eq(true); // Test
                
                let databaseResult = (result === undefined); // Test helper
                databaseResult.should.be.eq(false); // Test

                  //Error checking
                  if (err) {
                    //500 Internal Server Error. Which means database is giving error.
                  //   res.status(500).send();
                      done(new Error("Datebase Error")); // Correct Response
                      return; // Not override previous status
                  }
          
                  if(result.affectedRows !== 0)
                  {
                      //   //action log query for creating event
                      //   res.locals.event_id = result.insertId;
                      //   res.status(200);
                      //   res.send(result);

                      insertedEventID = result.insertId;

                      done(); // Correct Response
                      return;
                  }
                  else
                  {
                    //Resource not available
                      done(new Error("Resource Already Exists")); // Correct response
                      //   res.status(204).send();
                    return; // Not override previous status
                  }
          
                }
              );
            }
            catch(err)
            {
              //Other Error
              done(new Error("Error Thrown"));
              // res.status(500).send();
            }
        })

        

    })

})

