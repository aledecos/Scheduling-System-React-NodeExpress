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
  console.log("Connected for Request Sub Test");

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

    describe("app.put('/requestSub')", () => {

        let eventId1 = '';

        //reset database 
        before(async function(){
            const query = await runQuery("INSERT INTO users (username) VALUES (?)",["reqSubUser1"])
            .then((result) => {
                console.log("Created reqSubUser1 for Test")
            }).catch((err) => {
                console.log(err)
            });

            const query2 = await runQuery("INSERT INTO event (event_name) VALUES(?)",["title"])
            .then((result) => {
                eventId1 = result.insertId;
                console.log("Created event with ID " + eventId1 + "  for Test")
            }).catch((err) => {
                console.log(err)
            });

            const query3 = await runQuery("INSERT INTO event_log (event_id, event_name, username) VALUES(?, ?, ?)",[eventId1, 'title', "reqSubUser1"])
            .then((result) => {
                console.log("Inserted EventLog entry for test")
            }).catch((err) => {
                console.log(err)
            });

            
            
        })

        after(async function() {
            // runs once after the last test in this block
            const query = await runQuery("DELETE FROM users WHERE username = ?",["reqSubUser1"])
            .then((result) => {
                console.log("Deleted reqSubUser1")
            }).catch((err) => {
                console.log(err)
            });  

            // runs once after the last test in this block
            const query2 = await runQuery("DELETE FROM event WHERE event_id = ?",[eventId1])
            .then((result) => {
                console.log("Deleted event with ID " + eventId1)
            }).catch((err) => {
                console.log(err)
            }); 


        });

        it("Request Sub - Bad Input 1 - Wrong Username", (done) => {
            const article = {
                event_id: eventId1,
                username: "fgdfhgfsgjhjdhghj",
                role: "Rostered",
                action_user: "fgdfhgfsgjhjdhghj",
            };

            chai.request('http://localhost:5000')
            .put("/requestSub")
            .send(article)
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                //check that user returned has correct username
                response.body.should.be.a('Object');
                response.status.should.be.eq(404);
                Object.keys(response.body).length.should.eq(0); // way to check the json body {} is empty since it is 204 it should return nothing
                done();
            })
        
            
        })

        it("Request Sub - Bad Input 2 - Wrong Event ID", (done) => {
            const article = {
                event_id: 13456756867989878,
                username: "reqSubUser1",
                role: "Rostered",
                action_user: "reqSubUser1",
            };

            chai.request('http://localhost:5000')
            .put("/requestSub")
            .send(article)
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                //check that user returned has correct username
                response.body.should.be.a('Object');
                response.status.should.be.eq(404);
                Object.keys(response.body).length.should.eq(0); // way to check the json body {} is empty since it is 204 it should return nothing
                done();
            })
        
            
        })

        it("Request Sub - Good Input", (done) => {
            const article = {
                event_id: eventId1,
                username: "reqSubUser1",
                role: "Rostered",
                action_user: "reqSubUser1",
            };

            chai.request('http://localhost:5000')
            .put("/requestSub")
            .send(article)
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                //check that user returned has correct username
                response.body.should.be.a('Object');
                response.status.should.be.eq(204);
                Object.keys(response.body).length.should.eq(0); // way to check the json body {} is empty since it is 204 it should return nothing
                done();
            }) 
        })  
    })
    
})


describe.skip('Server Unit Test', () => {
// describe('Server Unit Test', () => {

    let eventId2 = '';
    //reset database 
    before(async function(){
        const query = await runQuery("INSERT INTO users (username) VALUES (?)",["reqSubUser2"])
        .then((result) => {
            console.log("Created reqSubUser2 for Test")
        }).catch((err) => {
            console.log(err)
        });

        const query2 = await runQuery("INSERT INTO event (event_name) VALUES(?)",["title"])
        .then((result) => {
            eventId2 = result.insertId;
            console.log("Created event with ID " + eventId2 + "  for Test")
        }).catch((err) => {
            console.log(err)
        });

        const query3 = await runQuery("INSERT INTO event_log (event_id, event_name, username) VALUES(?, ?, ?)",[eventId2, 'title', "reqSubUser1"])
        .then((result) => {
            console.log("Inserted EventLog entry for test")
        }).catch((err) => {
            console.log(err)
        });
        
    })


    after(async function() {
        // runs once after the last test in this block
        const query = await runQuery("DELETE FROM users WHERE username = ?",["reqSubUser2"])
        .then((result) => {
            console.log("Deleted reqSubUser2")
        }).catch((err) => {
            console.log(err)
        });  

        // runs once after the last test in this block
        const query2 = await runQuery("DELETE FROM event WHERE event_id = ?",[eventId2])
        .then((result) => {
            console.log("Deleted event with ID " + eventId2)
        }).catch((err) => {
            console.log(err)
        }); 
    });

    describe("app.put('/requestSub')",  () => {

        it("Edit User - Bad Input 1 - Wrong Username", async (done) => {
          //how get and delete are formatted
          let req = {body: {
            event_id: eventId2,
            username: "44444444444444",
            role: "System Admin",
            action_user: '44444444444444',
          }}; // input from Client

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
            // res.locals.event_id = event_id;
            // res.locals.username = username;
            // res.locals.action_user = action_user;
            // res.locals.result = "";
        
            let users = null;
        
            //check if user exists and await result
            const checkingExistPromise = await runQuery(exist,[event_id,username])
            .then((result) => {
                users = result;
            }).catch((err) => {
                console.log(err)
            });

        
            let databaseError1 = (err === null); // Test helper
            databaseError1.should.be.eq(false); // Test

            if(users === null)
            {
                //   res.status(500).send(); // database error
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

                    //success.should.be.eq(true); // Test

                    if(success)
                    {
                        // res.locals.result = "Unrequest Sub by " + action_user;
                        // next();
                        // res.status(204).send();
                        return;
                    }
                    else{
                        // res.status(500).send();
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
                                
                                //people in waitlist
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
                                        // res.locals.result = "Sub Requested by " + action_user +". Repalaced from Waitlist: " + transfer.username;
                                        // next();
                                        // res.status(204).send();

                                        
                                        return;
                                    }
                                    else{
                                        // res.status(500).send();
                                        
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
                                        // res.locals.result = "Sub Requested by " + action_user;
                                        // next();
                                        // res.status(204).send();
                                        
                                        return;
                                    }
                                    else{
                                        // res.status(500).send();
                                        
                                        return;
                                    }
                    
                                }
                            }
                        }
                
                        // res.locals.result = "Sub Requested by Shadow or Waitlist: Not supported";
                        // next();
                        // //They are in shadow or waitlist
                        // res.sendStatus(204);
                        
                        return;
                    }
                    else{
                        //error with database
                        // res.status(500).send();
                        
                        return;
                    }
                }
        
            }
            else
            {
                // User does not exist
                
                return;
            }
        
        
          }
          catch(err)
          {
                // console.log(err)
                return;
          }
        })


       

    })

})

