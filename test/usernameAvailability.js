//Need for all tests
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server.js");

//Needed for Some tests
const mysql = require("mysql");
const bcrypt = require("bcrypt");


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
    console.log("Connected for Username Availability Test");
  
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
    
    //reset database Problem by deleting same user twice in rapid succession I don't get correct outputs. So I insert before I run the tests inside this describe
    before(async function(){

        const query = await runQuery("INSERT INTO users (username) VALUES (?)",["availUser1"])
        .then((result) => {
            console.log("Created availUser1 for Test")
        }).catch((err) => {
            console.log(err)
        });
        
    })


    after(async function() {
        // runs once after the last test in this block
        const query = await runQuery("DELETE FROM users WHERE username = ?",["availUser1"])
        .then((result) => {
            console.log("Deleted availUser1")
        }).catch((err) => {
            console.log(err)
        });  
    });


    describe("Check Availability /checkAvailability", () => {
    
        it("Check User API - Bad Input 1 - user exists", (done) => {

            chai.request('http://localhost:5000')
            .get("/checkAvailability/availUser1")
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                response.status.should.eq(200);
                Object.keys(response.body).length.should.eq(0); // way to check the json body {} is empty since it is 204 it should return nothing
                done();
            })
        })

        it("Check User API - Good Input - User does not exist", (done) => {

            chai.request('http://localhost:5000')
            .get("/checkAvailability/213412341234123412342134")
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                response.status.should.eq(204);
                Object.keys(response.body).length.should.eq(0); // way to check the json body {} is empty since it is 204 it should return nothing
                done();
            })
        })



    })

})

describe('Server Unit Test', () => {

    //reset database Problem by deleting same user twice in rapid succession I don't get correct outputs. So I insert before I run the tests inside this describe
    before(async function(){

        const query = await runQuery("INSERT INTO users (username) VALUES (?)",["availUser2"])
        .then((result) => {
            console.log("Created availUser2 for Test")
        }).catch((err) => {
            console.log(err)
        });
        
    })


    after(async function() {
        // runs once after the last test in this block
        const query = await runQuery("DELETE FROM users WHERE username = ?",["availUser2"])
        .then((result) => {
            console.log("Deleted availUser2")
        }).catch((err) => {
            console.log(err)
        });  
    });
    
    
    describe("Check Availability /checkAvailability", () => {
        
        it("Check User API - Bad Input 1 - user exists", (done) => {

            //how get and delete are formatted
            let req = {params: {username: 'availUser2'}}; // input from Client
            
            try
            {
                const username = req.params.username; // code
                username.should.be.eq('availUser2'); // Test 

                con.query(
                "SELECT * FROM users WHERE username = ?",
                username,
                (err, result) => {

                    let databaseError = (err === null); // Test helper
                    databaseError.should.be.eq(true); // Test
                    
                    let databaseResult = (result === undefined); // Test helper
                    databaseResult.should.be.eq(false); // Test

                    //Error checking
                    if (err && (result === undefined)) {
                        //500 Internal Server Error. Which means database is giving error.
                        done(new Error("Database Error"));
                        return;
                    }
                    //Checking result of database
                    if(result.length === 0){

                        done(new Error("Affected Rows should not be Affected"));
                        return;

                    }
                    //this occurs if user does not exist
                    else{
                        //User found
                        done(); // Success
                        return;
                    }
                });
            }
            catch(err){
                //client did not send correct API Request
                done(new Error("Error Thrown"));
                return;
            }
        })

        
        it("Check User API - Good Input - user does not exist", (done) => {
            //how get and delete are formatted
            let req = {params: {username: '34234334234234234234234'}}; // input from Client
            
            try
            {
                const username = req.params.username; // code
                username.should.be.eq('34234334234234234234234'); // Test 

                con.query(
                "SELECT * FROM users WHERE username = ?",
                username,
                (err, result) => {

                    let databaseError = (err === null); // Test helper
                    databaseError.should.be.eq(true); // Test

                    let databaseResult = (result === undefined); // Test helper
                    databaseResult.should.be.eq(false); // Test

                    //Error checking
                    if (err && (result === undefined)) {
                        //500 Internal Server Error. Which means database is giving error.
                        done(new Error("Database Error"));
                        return;
                    }
                    //Checking result of database
                    if(result.length === 0){

                        done();
                        return;

                    }
                    //this occurs if user does not exist
                    else{
                        //User found
                        done(new Error("User Found"));
                        return;
                    }
                });
            }
            catch(err){
                //client did not send correct API Request
                done(new Error("Error Thrown"));
                return;
            }
        })

    })

})
