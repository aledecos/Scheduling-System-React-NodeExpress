//Need for all tests
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server.js");

//need for this test
const bcrypt = require("bcrypt");
const saltRounds = 10;

//Needed for Some tests
const mysql = require("mysql");

//user that will be added
const usernameOfTest1 = 'addUser1-1';
const usernameOfTest2 = 'addUser2-1';

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

    //reset database 
    before(async function(){
        const query = await runQuery("INSERT INTO users (username) VALUES (?)",["addUser1"])
        .then((result) => {
            console.log("Created addUser1 for Test")
        }).catch((err) => {
            console.log(err)
        });
            
    })
    
    
    after(async function() {
        // runs once after the last test in this block
        const query = await runQuery("DELETE FROM users WHERE username = ?",["addUser1"])
        .then((result) => {
            console.log("Deleted addUser1")
        }).catch((err) => {
            console.log(err)
        }); 
        
        
        const query2 = await runQuery("DELETE FROM users WHERE username = ?",[usernameOfTest1])
        .then((result) => {
            console.log("Deleted addUser1-1")
        }).catch((err) => {
            console.log(err)
        });  
    });

    describe("app.put('/users')", () => {
        it("Add User - Bad Input 1 - Username not sent", (done) => {
            const article ={
                name: "Joseph",
                phone_number: "44444444",
                //username: "",
                password: "3",
                email: 'info@email.com',
                user_type: "Admin",
            };
            chai.request('http://localhost:5000')
            .put("/addUser")
            .send(article)
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                //check that user returned has correct username
                //response.body.should.be.a('Object');
                response.status.should.be.eq(500);
                Object.keys(response.body).length.should.eq(0); // way to check the json body {} is empty since it is 204 it should return nothing
                done();
            })
        })

        it("Add User - Bad Input 2 - Password not sent", (done) => {
            const article ={
                name: "Joseph",
                phone_number: "44444444",
                username: "",
                //password: "3",
                email: 'info@email.com',
                user_type: "Admin",
            };
            chai.request('http://localhost:5000')
            .put("/addUser")
            .send(article)
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                //check that user returned has correct username
                //response.body.should.be.a('Object');
                response.status.should.be.eq(500);
                Object.keys(response.body).length.should.eq(0); // way to check the json body {} is empty since it is 204 it should return nothing
                done();
            })
        })

        it("Add User - Bad Input 3 - User exists", (done) => {
            const article ={
                name: "Joseph",
                phone_number: "44444444",
                username: "user",
                password: "3",
                email: 'info@email.com',
                user_type: "Admin",
            };
            chai.request('http://localhost:5000')
            .put("/addUser")
            .send(article)
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                //check that user returned has correct username
                //response.body.should.be.a('Object');
                response.status.should.be.eq(500);
                Object.keys(response.body).length.should.eq(0); // way to check the json body {} is empty since it is 204 it should return nothing
                done();
            })
        })

        it("Add User - Good Input - ", (done) => {
            const article ={
                name: "Joseph",
                phone_number: "44444444",
                username: usernameOfTest1,
                password: "password",
                email: 'info@email.com',
                user_type: "System Admin",
                trainer: "1",
            };


            chai.request('http://localhost:5000')
            .put("/addUser")
            .send(article)
            .end((err, response) => {
                if (err) {
                    console.log(err);
                }
                //check that user returned has correct username
                //response.body.should.be.a('Object');
                response.status.should.be.eq(204);
                Object.keys(response.body).length.should.eq(0); // way to check the json body {} is empty since it is 204 it should return nothing
                done();
            })
        })

    })
    
})


describe('Server Unit Test', () => {

    //reset database 
    before(async function(){
        const query = await runQuery("INSERT INTO users (username) VALUES (?)",["addUser2"])
        .then((result) => {
            console.log("Created addUser2 for Test")
        }).catch((err) => {
            console.log(err)
        });
            
    })
    
    
    after(async function() {
        // runs once after the last test in this block
        const query = await runQuery("DELETE FROM users WHERE username = ?",["addUser2"])
        .then((result) => {
            console.log("Deleted addUser2")
        }).catch((err) => {
            console.log(err)
        }); 

        // runs once after the last test in this block
        const query2 = await runQuery("DELETE FROM users WHERE username = ?",[usernameOfTest2])
        .then((result) => {
            console.log("Deleted addUser2")
        }).catch((err) => {
            console.log(err)
        }); 
        
    });

    describe("app.put('/addUser')", () => {

        it("Add User - Bad Input 1 - Username not sent", (done) => {
            let usernama = Math.random;
            //how get and delete are formatted
            let req = {body: {
                name: "Joseph",
                phone_number: "44444444",
                //username: usernama,
                password: "3",
                email: 'info@email.com',
                user_type: "Admin",
            }}; // input from Client
            try {
                let info = req.body;
                let name = info.name;
                name.should.be.eq("Joseph"); // Test 

                let phone_number = info.phone_number;
                phone_number.should.be.eq("44444444"); // Test 

                let username = info.username;
                // phone_number.should.be.eq(usernama); // Test 

                let email = info.email;
                email.should.be.eq("info@email.com"); // Test 

                let user_type = info.user_type;
                user_type.should.be.eq("Admin"); // Test 
            
                bcrypt.hash(info.password, saltRounds, (err, hash) =>{

                    let cryptError = (err === null); // Test helper
                    cryptError.should.be.eq(false); // Test
                    
                    let crpytHash = (hash === undefined); // Test helper
                    crpytHash.should.be.eq(false); // Test

                    if(err)
                    {
                        //500 Internal Server Error. Bcrypt has error
                        //res.status(500).send();
                        done(new Error("Password Encryption Error"));
                        return; // Not override previous status
                    }
                    
                    con.query("INSERT INTO users (name,phone_number,username,password,email,user_type) VALUES (?,?,?,?,?,?)",
                    [
                        name,
                        phone_number,
                        username,
                        hash,
                        email,
                        user_type
                    ],
                    (err, result) => {
                        let databaseError = (err === null); // Test helper
                        databaseError.should.be.eq(false); // Test
                        
                        let databaseResult = (result === undefined); // Test helper
                        databaseResult.should.be.eq(true); // Test

                        //Error checking
                        if (err) {
                            //500 Internal Server Error. Which means database is giving error.
                            done(); // Correct Response
                            //res.status(500).send();
                            return; // Not override previous status
                        }
                
                        if(result.affectedRows !== 0)
                        {
                            //Successfully Added
                            //res.status(204).send();
                            done(new Error("Affected Rows should not be Affected"));
                            return;
                        }
                        else {
                            //Resource already exists
                            //res.status(409).send();
                            done(new Error("Resource Already Exists")); // Correct response
                            return; // Not override previous status
                        }
                    }
                    )
                });
            }
            catch(err)
            {
                //Other Error
                //res.status(500).send();
                done(new Error("Error Thrown"));
                console.log(err)
                return;
            }


        })

        it("Add User - Bad Input 2 - Password not send", (done) => {
            let usernama = Math.random;
            //how get and delete are formatted
            let req = {body: {
                name: "Joseph",
                phone_number: "44444444",
                username: usernama,
                //password: "3",
                email: 'info@email.com',
                user_type: "Admin",
            }}; // input from Client
            try {
                let info = req.body;
                let name = info.name;
                name.should.be.eq("Joseph"); // Test 

                let phone_number = info.phone_number;
                phone_number.should.be.eq("44444444"); // Test 

                let username = info.username;
                username.should.be.eq(usernama); // Test 

                let email = info.email;
                email.should.be.eq("info@email.com"); // Test 

                let user_type = info.user_type;
                user_type.should.be.eq("Admin"); // Test 

                let password = info.password;
                let passError = (password === undefined); // Test helper
                passError.should.be.eq(true); // Test
            
                bcrypt.hash(info.password, saltRounds, (err, hash) =>{

                    let cryptError = (err === null); // Test helper
                    cryptError.should.be.eq(false); // Test
                    
                    let crpytHash = (hash === undefined); // Test helper
                    crpytHash.should.be.eq(true); // Test

                    if(err)
                    {
                        //500 Internal Server Error. Bcrypt has error
                        //res.status(500).send();
                        done(); // Correct Path
                        return; // Not override previous status
                    }
                    
                    con.query("INSERT INTO users (name,phone_number,username,password,email,user_type) VALUES (?,?,?,?,?,?)",
                    [
                        name,
                        phone_number,
                        username,
                        hash,
                        email,
                        user_type
                    ],
                    (err, result) => {
                        let databaseError = (err === null); // Test helper
                        databaseError.should.be.eq(false); // Test
                        
                        let databaseResult = (result === undefined); // Test helper
                        databaseResult.should.be.eq(true); // Test

                        //Error checking
                        if (err) {
                            //500 Internal Server Error. Which means database is giving error.
                            done(new Error("Database Error")); // Correct Response
                            //res.status(500).send();
                            return; // Not override previous status
                        }
                
                        if(result.affectedRows !== 0)
                        {
                            //Successfully Added
                            //res.status(204).send();
                            done(new Error("Affected Rows should not be Affected"));
                            return;
                        }
                        else {
                            //Resource already exists
                            //res.status(409).send();
                            done(new Error("Resource Already Exists")); // Correct response
                            return; // Not override previous status
                        }
                    }
                    )
                });
            }
            catch(err)
            {
                //Other Error
                //res.status(500).send();
                done(new Error("Error Thrown"));
                console.log(err)
                return;
            }


        })  

        it("Add User - Bad Input 3 - User Exists", (done) => {
            //how get and delete are formatted
            let req = {body: {
                name: "Joseph",
                phone_number: "44444444",
                username: "addUser2",
                password: "3",
                email: 'info@email.com',
                user_type: "Admin",
            }}; // input from Client
            try {
                let info = req.body;
                let name = info.name;
                name.should.be.eq("Joseph"); // Test 

                let phone_number = info.phone_number;
                phone_number.should.be.eq("44444444"); // Test 

                let username = info.username;
                username.should.be.eq("addUser2"); // Test 

                let email = info.email;
                email.should.be.eq("info@email.com"); // Test 

                let user_type = info.user_type;
                user_type.should.be.eq("Admin"); // Test 

                let password = info.password;
                password.should.be.eq("3"); // Test 
            
                bcrypt.hash(info.password, saltRounds, (err, hash) =>{

                    let cryptError = (err === null); // Test helper
                    cryptError.should.be.eq(false); // Test
                    
                    let crpytHash = (hash === undefined); // Test helper
                    crpytHash.should.be.eq(false); // Test

                    if(err)
                    {
                        //500 Internal Server Error. Bcrypt has error
                        //res.status(500).send();
                        done(); // Correct Path
                        return; // Not override previous status
                    }
                    
                    con.query("INSERT INTO users (name,phone_number,username,password,email,user_type) VALUES (?,?,?,?,?,?)",
                    [
                        name,
                        phone_number,
                        username,
                        hash,
                        email,
                        user_type
                    ],
                    (err, result) => {
                        let databaseError = (err === null); // Test helper
                        databaseError.should.be.eq(false); // Test
                        
                        let databaseResult = (result === undefined); // Test helper
                        databaseResult.should.be.eq(true); // Test

                        //Error checking
                        if (err) {
                            //500 Internal Server Error. Which means database is giving error.
                            done(); // Correct Response
                            //res.status(500).send();
                            return; // Not override previous status
                        }
                
                        if(result.affectedRows !== 0)
                        {
                            //Successfully Added
                            //res.status(204).send();
                            done(new Error("Affected row should not be Affected"));
                            return;
                        }
                        else {
                            //Resource already exists
                            //res.status(409).send();
                            done(new Error("Resource Already Exists")); // Correct response
                            return; // Not override previous status
                        }
                    }
                    )
                });
            }
            catch(err)
            {
                //Other Error
                //res.status(500).send();
                done(new Error("Error Thrown"));
                console.log(err)
                return;
            }


        }) 

        it("Add User - Good Input - ", (done) => {
            //how get and delete are formatted
            let req = {body: {
                name: "Joseph",
                phone_number: "44444444",
                username: usernameOfTest2,
                password: "3",
                email: 'info@email.com',
                user_type: "Admin",
            }}; // input from Client
            try {
                let info = req.body;
                let name = info.name;
                name.should.be.eq("Joseph"); // Test 

                let phone_number = info.phone_number;
                phone_number.should.be.eq("44444444"); // Test 

                let username = info.username;
                username.should.be.eq(usernameOfTest2); // Test 

                let email = info.email;
                email.should.be.eq("info@email.com"); // Test 

                let user_type = info.user_type;
                user_type.should.be.eq("Admin"); // Test 

                let password = info.password;
                password.should.be.eq("3"); // Test 
            
                bcrypt.hash(info.password, saltRounds, (err, hash) =>{

                    let cryptError = (err === undefined); // Test helper
                    cryptError.should.be.eq(true); // Test
                    
                    let crpytHash = (hash === undefined); // Test helper
                    crpytHash.should.be.eq(false); // Test

                    if(err)
                    {
                        //500 Internal Server Error. Bcrypt has error
                        //res.status(500).send();
                        done(); // Correct Path
                        return; // Not override previous status
                    }
                    
                    con.query("INSERT INTO users (name,phone_number,username,password,email,user_type) VALUES (?,?,?,?,?,?)",
                    [
                        name,
                        phone_number,
                        username,
                        hash,
                        email,
                        user_type
                    ],
                    (err, result) => {

                        let databaseError = (err === null); // Test helper
                        databaseError.should.be.eq(true); // Test
                        
                        let databaseResult = (result === undefined); // Test helper
                        databaseResult.should.be.eq(false); // Test

                        
                        //Error checking
                        if (err) {
                            //500 Internal Server Error. Which means database is giving error.
                            done(new Error("Database Error")); // Correct Response
                            //res.status(500).send();
                            return; // Not override previous status
                        }
                
                        if(result.affectedRows !== 0)
                        {
                            //Successfully Added
                            //res.status(204).send();
                            done();
                            return;
                        }
                        else {
                            //Resource already exists
                            //res.status(409).send();
                            done(new Error("Resource Already Exists")); // Correct response
                            return; // Not override previous status
                        }
                    }
                    )
                });
            }
            catch(err)
            {
                //Other Error
                //res.status(500).send();
                done(new Error("Error Thrown"));
                return;
            }


        })  

        
    })

})
