//Need for all tests
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server.js");

//Needed for Some tests
const mysql = require("mysql");
const { before } = require("mocha");

//Password
const mySqlPassword = 'password';

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
    console.log("Connected for Delete Event Test");
  
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

    

    describe("Delete /deleteEvent", () => {
        //reset database Problem by deleting same user twice in rapid succession I don't get correct outputs. So I insert before I run the tests inside this describe
        before(async function(){

            const checkMaxVal = await runQuery("INSERT INTO event (event_id) VALUES (?)",["9999999"])
            .then((result) => {
                console.log("Created 9999999 for Test")
            }).catch((err) => {
                console.log(err)
            });
        })
    
        /**
         * Bad Input 1 is skipped because with Delete and Get there is no possible way to send wrong type of data or wrong variable names
         * If you send a /deleteUser or /deleteUser/ ther server will automatically give back a 404 error because these are totally different resources
         */
        it("Deleting Event API - Bad Input 1 - Good Data but Database does not have", (done) => {
            chai.request('http://localhost:5000')
            .delete("/deleteEvent/888888888")
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                response.status.should.eq(410);
                Object.keys(response.body).length.should.eq(0); 
                done();
            })
        })

        it("Deleting Event API - Good Input ", (done) => {
            chai.request('http://localhost:5000')
            .delete("/deleteEvent/9999999")
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                response.status.should.eq(204);
                Object.keys(response.body).length.should.eq(0); // way to check the json body {} is empty since it is 204 it should return nothing
                done();
            })
        });
        
    })
})

describe('Server Unit Test', () => {

    describe("app.delete('/deleteEvent/:event_id')", () => {
        //reset database
        before(async function(){
            const checkMaxVal = await runQuery("INSERT INTO event (event_id) VALUES (?)",["777777777"])
            .then((result) => {
                console.log("Created 777777777 for Test")
            }).catch((err) => {
                console.log(err)
            });
        })


        it("Deleting Event - Bad Input 1 - Good Data but Database does not have", (done) => {
            //how get and delete are formatted
            let req = {params: {event_id: '888888888'}}; // input from Client

            try{
                const event_id = req.params.event_id; // Code
                event_id.should.be.eq('888888888'); // Test 

                con.query(
                    "DELETE FROM event WHERE event_id = ?",
                    event_id,
                    (err, result) => {
                        //Error checking
                        if (err) {
                        //500 Internal Server Error. Which means database is giving error.
                        // res.status(500).send();

                        done(new Error("Database Error"));
                        }
                        else if(result.affectedRows === 0)
                        {
                        //Resource already deleted
                        // res.status(410).send();

                        done();
                        }
                        else
                        {
                        //Server did deleted event
                        // res.status(204).send();

                        done(new Error("Server deleted an event it shouldn't have"));
                        }
                    }
                );
            }
            catch(err)
            {
                //Other Error
                // res.status(500).send();
                done(new Error("Database Error"));
            }
        })

        it("Deleting Event - Good Input", (done) => {
            //how get and delete are formatted
            let req = {params: {event_id: '777777777'}}; // input from Client
                    
            try{
                const event_id = req.params.event_id; // Code
                event_id.should.be.eq('777777777'); // Test 

                con.query(
                    "DELETE FROM event WHERE event_id = ?",
                    event_id,
                    (err, result) => {
                        //Error checking
                        if (err) {
                        //500 Internal Server Error. Which means database is giving error.
                        // res.status(500).send();

                        done(new Error("Database Error"));
                        }
                        else if(result.affectedRows === 0)
                        {
                        //Resource already deleted
                        // res.status(410).send();

                        done(new Error("Event has already been deleted or never existed at all"));
                        }
                        else
                        {
                        //Server did delete event
                        // res.status(204).send();

                        done();
                        }
                    }
                );
            }
            catch(err)
            {
                //Other Error
                // res.status(500).send();
                done(new Error("Database Error"));
            }
        })
    })
})