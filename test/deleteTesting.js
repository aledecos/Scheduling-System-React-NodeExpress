//Need for all tests
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server.js");

//Needed for Some tests
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const { timeout } = require("async");
const { before } = require("mocha");
const saltRounds = 10;

//Password
const mySqlPassword = 'kanye';

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
    console.log("Connected for Login Test");
  
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

    

    describe("Delete /deleteUser", () => {
        //reset database Problem by deleting same user twice in rapid succession I don't get correct outputs. So I insert before I run the tests inside this describe
        before(async function(){

            const checkMaxVal = await runQuery("INSERT INTO users (username) VALUES (?)",["deleteUser1"])
            .then((result) => {
                console.log("Created deleteUser1 for Test")
            }).catch((err) => {
                console.log(err)
            });
        })
    
        /**
         * Bad Input 1 is skipped because with Delete and Get there is no possible way to send wrong type of data or wrong variable names
         * If you send a /deleteUser or /deleteUser/ ther server will automatically give back a 404 error because these are totally different resources
         */
        it("Deleting User API - Bad Input 2 - Right Data but Database is not not have", (done) => {
            chai.request('http://localhost:5000')
            .delete("/deleteUser/sdfsdfdsfd")
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                response.status.should.eq(410);
                Object.keys(response.body).length.should.eq(0); // way to check the json body {} is empty since it is 204 it should return nothing
                done();
            })
        })

        it("Deleting User API - Good Input ", (done) => {
            chai.request('http://localhost:5000')
            .delete("/deleteUser/deleteUser1")
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

    describe("app.delete('/deleteUser/:username')", () => {
        //reset database
        before(async function(){
            const checkMaxVal = await runQuery("INSERT INTO users (username) VALUES (?)",["deleteUser2"])
            .then((result) => {
                console.log("Created deleteUser1 for Test")
            }).catch((err) => {
                console.log(err)
            });
        })


        it("Deleting User - Bad Input 1 - Right Data but Database is not not have", (done) => {
            //how get and delete are formatted
            let req = {params: {username: 'sdfsdfsdfsdf'}}; // input from Client
            
            const username = req.params.username; // Code
            username.should.be.eq('sdfsdfsdfsdf'); // Test 

            con.query(
                "DELETE FROM users WHERE username = ?",
                username,
                (err, result) => {
                    //Error checking
    
                    let databaseError = (err === null); // Test helper
                    databaseError.should.be.eq(true); // Test
                    
                    let databaseResult = (result === null); // Test helper
                    databaseResult.should.be.eq(false); // Test

                    if (err) {
                        //500 Internal Server Error. Which means database is giving error.
                        //res.status(500).send();

                        //Success
                        done(new Error("Database Error"));
                    }
                    else if(result.affectedRows === 0)
                    {
                        //Resource already delete
                        //res.status(410).send();

                        //Success
                        done();
                    }
                    else
                    {
                        //Server did request but nothing was deleted
                        //res.status(204).send();

                        //Failure
                        done(new Error("Somone deleted"));
                    }
                    //console.log('Deleted Row(s):', result.affectedRows);
                }
            );

        })

        it("Deleting User - Good Input ", (done) => {
            //how get and delete are formatted
            let req = {params: {username: 'deleteUser2'}}; // input from Client
            
            const username = req.params.username; // Code
            username.should.be.eq('deleteUser2'); // Test 

            con.query(
                "DELETE FROM users WHERE username = ?",
                username,
                (err, result) => {
                    //Error checking
    
                    let databaseError = (err === null); // Test helper
                    databaseError.should.be.eq(true); // Test
                    
                    let databaseResult = (result === null); // Test helper
                    databaseResult.should.be.eq(false); // Test

                    if (err) {
                        //500 Internal Server Error. Which means database is giving error.
                        //res.status(500).send();

                        //Success
                        done(new Error("Database Error"));
                    }
                    else if(result.affectedRows === 0)
                    {
                        //Resource already delete
                        //res.status(410).send();

                        //Failure
                        done(new Error("No one deleted"));
                    }
                    else
                    {
                        //Server did request but nothing was deleted
                        //res.status(204).send();

                        //Success
                        done();
                    }
                    //console.log('Deleted Row(s):', result.affectedRows);
                }
            );

        });


        
    })

})
