//Need for all tests
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server.js");

//Needed for Some tests
const mysql = require("mysql");
const bcrypt = require("bcrypt")
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
    
    //reset database Problem by deleting same user twice in rapid succession I don't get correct outputs. So I insert before I run the tests inside this describe
    before(async function(){

        const query = await runQuery("INSERT INTO users (username, password) VALUES (?,?)",["loginUser1", "$2b$10$/yEyecl492YR.K0.1.fQBOmBLRHJPnmV450L8i.CqfkYALrdaDQvm"])
        .then((result) => {
            console.log("Created deleteUser1 for Test")
        }).catch((err) => {
            console.log(err)
        });
        
    })


    after(async function() {
        // runs once after the last test in this block
        const query = await runQuery("DELETE FROM users WHERE username = ?",["loginUser1"])
        .then((result) => {
            console.log("Deleted loginUser1")
        }).catch((err) => {
            console.log(err)
        });  
    });


    describe("Login /login", () => {
    
        it("Login User API - Bad Input 1 - Wrong JSON Objects", (done) => {
            let article = {
                Happy: "user",
                sad: "password"
            }
            chai.request('http://localhost:5000')
            .post("/login")
            .send(article)
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                response.status.should.eq(500);
                Object.keys(response.body).length.should.eq(0); // way to check the json body {} is empty since it is 204 it should return nothing
                done();
            })
        })

        it("Login User API - Bad Input 2 - Wrong credentials", (done) => {
            let article = {
                username: "loginUser1",
                password: "wrong"
            }
            chai.request('http://localhost:5000')
            .post("/login")
            .send(article)
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                response.status.should.eq(401);
                Object.keys(response.body).length.should.eq(0); // way to check the json body {} is empty since it is 204 it should return nothing
                done();
            })
        })

        it("Login User API - Bad Input 3 - User Does not exist", (done) => {
            let article = {
                username: "zxcsgjhgghjgfhjghf",
                password: "wrong"
            }
            chai.request('http://localhost:5000')
            .post("/login")
            .send(article)
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                response.status.should.eq(404);
                Object.keys(response.body).length.should.eq(0); // way to check the json body {} is empty since it is 204 it should return nothing
                done();
            })
        })

        it("Login User API - Good Input - Right credentials", (done) => {
            let article = {
                username: "loginUser1",
                password: "password"
            }
            chai.request('http://localhost:5000')
            .post("/login")
            .send(article)
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                response.status.should.eq(200);
                Object.keys(response.body).length.should.eq(5); // should have both username and password as {} keys
                done();
            })
        })
    })

})

describe('Server Unit Test', () => {

    //reset database Problem by deleting same user twice in rapid succession I don't get correct outputs. So I insert before I run the tests inside this describe
    before(async function(){

        const query = await runQuery("INSERT INTO users (username, password) VALUES (?,?)",["loginUser2", "$2b$10$/yEyecl492YR.K0.1.fQBOmBLRHJPnmV450L8i.CqfkYALrdaDQvm"])
        .then((result) => {
            console.log("Created loginUser2 for Test")
        }).catch((err) => {
            console.log(err)
        });
        
    })


    after(async function() {
        // runs once after the last test in this block
        const query = await runQuery("DELETE FROM users WHERE username = ?",["loginUser2"])
        .then((result) => {
            console.log("Deleted loginUser2")
        }).catch((err) => {
            console.log(err)
        });  
    });
    
    
    describe("app.post('/login')", () => {
        
        it("Login User - Bad Input 1 - Send wrong JSON Objects test - Database accepts strings so type does not matter", (done) => {
            //user input formatted
            let req = {body: {happy: 1, sad: 2}}; // input from Client
            
            try
            {
                const username = req.body.username; // code
                //username.should.eq(1);// test 

                const password = req.body.password;//code
                //password.should.eq(2);// test 

                var return_data =  {};

                con.query(
                "SELECT * FROM users WHERE username = ?",
                username,
                (err, result) => {
                    //Error checking
                    if (err) {
                        //500 Internal Server Error. Which means database is giving error.
                        done(); // Failure should not reach here
                        return;
                    }

                    //Checking result of login
                    if(result.length > 0){
                        bcrypt.compare(password, result[0].password, (error, response) =>
                        {
                            if(response)
                            {
                                return_data.username = username;
                                return_data.userType = result[0].user_type;

                                done(new Error("Person should not be authenticated")); // Failure should not reach here
                                return
                            }
                            else
                            {
                                //Cannot login is not authenticated
                                done(new Error("Person is not authenticated")); // Failure should not reach here
                                return
                            }
                        })
                    }
                    //this occurs if user does not exist
                    else{
                        //User not found so resource not found
                        done(new Error("User not found")); // Failure should not reach here
                        return
                    }
                });
            }
            catch(err){
                //client did not send correct json objects
                done(new Error("Error")); // Sucess Should go here
                return
            }
        })

        it("Login User - Bad Input 2 - Correct JSON wrong credentials", (done) => {
            //user input formatted
            let req = {body: {username: "loginUser2", password: "wrong"}}; // input from Client
            
            try
            {
                const username = req.body.username; // code
                username.should.eq("loginUser2");// test

                const password = req.body.password;//code
                password.should.eq("wrong");// test

                var return_data =  {};

                con.query(
                "SELECT * FROM users WHERE username = ?",
                username,
                (err, result) => {

                    let errorCheck = (err === null);
                    errorCheck.should.eq(true);

                    let resultCheck = (result === null);
                    resultCheck.should.eq(false);

                    //Error checking
                    if (err) {
                        //500 Internal Server Error. Which means database is giving error.

                        done(new Error("Database Error")); // Failure should not reach here
                        return;
                    }
                    //Checking result of login
                    if(result.length > 0){
                        bcrypt.compare(password, result[0].password, (error, response) =>
                        {
                            if(response)
                            {
                                return_data.username = username;
                                return_data.userType = result[0].user_type;

                                done(new Error("Person should not be authenticated")); // Failure should not reach here
                                return;

                            }
                            else
                            {
                                done(); // Success should go here
                                return;
                            }
                        })
                    }
                    //this occurs if user does not exist
                    else{
                        //User not found so resource not found
                        done(new Error("User not found")); // Failure should not reach here
                        return;
                    }
                });
            }
            catch(err){
                //client did not send correct json objects
                done(new Error("Error")); // Failure should not even go here since json objects exist
                return;
            }
        })

        it("Login User - Bad Input 3 - Correct JSON no User found", (done) => {
            //user input formatted
            let req = {body: {username: "zxczxczxbhdfghdfgafdsafd", password: "wrong"}}; // input from Client
            
            try
            {
                const username = req.body.username; // code
                username.should.eq("zxczxczxbhdfghdfgafdsafd");// test

                const password = req.body.password;//code
                password.should.eq("wrong");// test

                var return_data =  {};

                con.query(
                "SELECT * FROM users WHERE username = ?",
                username,
                (err, result) => {

                    //No Error
                    let errorCheck = (err === null);
                    errorCheck.should.eq(true);

                    //Result ok but nothing in it
                    let resultCheck = (result === null);
                    resultCheck.should.eq(false);

                    //Error checking
                    if (err) {
                        //500 Internal Server Error. Which means database is giving error.

                        done(new Error("Database Error")); // Failure should not reach here
                    }
                    //Checking result of login
                    if(result.length > 0){
                        bcrypt.compare(password, result[0].password, (error, response) =>
                        {
                            if(response)
                            {
                                return_data.username = username;
                                return_data.userType = result[0].user_type;

                                done(new Error("Person should not be authenticated")); // Failure should not reach here
                            }
                            else
                            {
                                //Cannot login is not authenticated
                                done(new Error("Person is not authenticated")); // Failure should not reach here
                            }
                        })
                    }

                    else{
                        //User not found so resource not found
                        done(); // Success should not reach here
                    }
                });
            }
            catch(err){
                //client did not send correct json objects
                done(new Error("Error")); // Failure should not even go here since json objects exist
                //res.status(400).send();
            }
        })

        it("Login User - Good Input ", (done) => {
            //user input formatted
            let req = {body: {username: "loginUser2", password: "password"}}; // input from Client
            
            try
            {
                const username = req.body.username; // code
                username.should.eq("loginUser2");// test

                const password = req.body.password;//code
                password.should.eq("password");// test

                var return_data =  {};

                con.query(
                "SELECT * FROM users WHERE username = ?",
                username,
                (err, result) => {

                    //No Error
                    let errorCheck = (err === null);
                    errorCheck.should.eq(true);

                    //Result ok and something in it
                    let resultCheck = (result === null);
                    resultCheck.should.eq(false);

                    //Error checking
                    if (err) {
                        //500 Internal Server Error. Which means database is giving error.

                        done(new Error("Database Error")); // Failure should not reach here
                    }
                    //Checking result of login
                    if(result.length > 0){
                        bcrypt.compare(password, result[0].password, (error, response) =>
                        {
                            if(response)
                            {
                                return_data.username = username;
                                return_data.userType = result[0].user_type;

                                done(); // Success should go here
                            }
                            else
                            {
                                //Cannot login is not authenticated
                                done(new Error("Person is not authenticated")); // Failure should not reach here
                            }
                        })
                    }
                    //this occurs if user does not exist
                    else{
                        //User not found so resource not found
                        
                        done(new Error("User not found")); // Failure should not reach here
                    }
                });
            }
            catch(err){
                //client did not send correct json objects
                done(new Error("Error")); // Failure should not even go here since json objects exist
            }
        })

    })

})
