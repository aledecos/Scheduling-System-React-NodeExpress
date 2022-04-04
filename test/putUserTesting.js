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

    describe("app.put('/users')", () => {

        //reset database 
        before(async function(){
          const query = await runQuery("INSERT INTO users (username) VALUES (?)",["editUser1"])
          .then((result) => {
              console.log("Created editUser1 for Test")
          }).catch((err) => {
              console.log(err)
          });
            
        })


        after(async function() {
            // runs once after the last test in this block
            const query = await runQuery("DELETE FROM users WHERE username = ?",["editUser1"])
            .then((result) => {
                console.log("Deleted editUser1")
            }).catch((err) => {
                console.log(err)
            });  
        });

        it("Edit User - Bad Input 1 - Wrong Username", (done) => {
            const article ={
              name: "Joseph",
              phone_number: "44444444",
              username: "notexistdfsdf",
              email: 'info@email.com',
              user_type: "System Admin",
            };
            chai.request('http://localhost:5000')
            .put("/users")
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


        it("Edit User - Good Input - Right Username and Right json variables", (done) => {
          const article ={
            name: "Joseph",
            phone_number: "44444444",
            username: "editUser1",
            email: 'info@email.com',
            user_type: "System Admin",
          };
          chai.request('http://localhost:5000')
          .put("/users")
          .send(article)
          .end((err, response) => {
              if (err) {
                  console.log(err);
              }
              //check that user returned has correct username
              response.body.should.be.a('Object');
              response.status.should.be.eq(200);
              Object.keys(response.body).length.should.eq(5); // way to check the json body {} is empty since it is 204 it should return nothing
              done();
          })
      })
    })
    
})


describe('Server Unit Test', () => {
// describe('Server Unit Test', () => {

    //reset database 
    before(async function(){
      const query = await runQuery("INSERT INTO users (username) VALUES (?)",["editUser2"])
      .then((result) => {
          console.log("Created editUser2 for Test")
      }).catch((err) => {
          console.log(err)
      });
        
    })


    after(async function() {
        // runs once after the last test in this block
        const query = await runQuery("DELETE FROM users WHERE username = ?",["editUser2"])
        .then((result) => {
            console.log("Deleted editUser2")
        }).catch((err) => {
            console.log(err)
        });  
    });

    describe("app.put('/users')", () => {

        it("Edit User - Bad Input 1 - Wrong Username", (done) => {
          //how get and delete are formatted
          let req = {body: {
            name: "Joseph",
            phone_number: "44444444",
            username: "putUserTestServer1",
            email: 'info@email.com',
            user_type: "User",
            trainer: "1"
          }}; // input from Client

          try{
            let info = req.body;

            let name = info.name;
            name.should.be.eq("Joseph"); // Test 

            let phone_number = info.phone_number;
            phone_number.should.be.eq("44444444"); // Test 

            let username = info.username;
            username.should.be.eq("putUserTestServer1"); // Test 

            let email = info.email;
            email.should.be.eq('info@email.com'); // Test 

            let user_type = info.user_type;
            user_type.should.be.eq("User"); // Test 

            let trainer = info.trainer;
            trainer.should.be.eq("1"); // Test 

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

                let databaseError = (err === null); // Test helper
                databaseError.should.be.eq(true); // Test
                
                let databaseResult = (result === undefined); // Test helper
                databaseResult.should.be.eq(false); // Test

                //Error checking
                if (err) {
                  //500 Internal Server Error. Which means database is giving error.
                  done(new Error("Database Error"));
                  //res.status(500).send();
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
                    user_type: user_type
                  };
                  //Resource already deleted
                  //res.status(200).send(article);
                  done(new Error("Affected Rows should not be Affected"));
                  return;
                }
                else
                {
                  //Resource not available
                  //done(new Error("No Rows updated"));

                  done(); // Correct response
                  //res.status(404).send();
                  return; // Not override previous status
                }
        
              }
            );
          }
          catch(err)
          {
            //Other Error
            //res.status(500).send();
            done(new Error("Error Thrown"));
            return;
          }
        })


        it("Edit User - Good Input - Right Username and Right json variables", (done) => {
          //how get and delete are formatted
          let req = {body: {
            name: "Joseph",
            phone_number: "44444444",
            username: "editUser2",
            email: 1,
            user_type: "User",
            trainer: "1",
          }}; // input from Client

          try{
            let info = req.body;
            let name = info.name;
            name.should.be.eq("Joseph"); // Test 

            let phone_number = info.phone_number;
            phone_number.should.be.eq("44444444"); // Test 

            let username = info.username;
            username.should.be.eq("editUser2"); // Test 

            let email = info.email;
            email.should.be.eq(1); // Test 

            let user_type = info.user_type;
            user_type.should.be.eq("User"); // Test 

            let trainer = info.trainer;
            trainer.should.be.eq("1"); // Test 

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

                let databaseError = (err === null); // Test helper
                databaseError.should.be.eq(true); // Test
                
                let databaseResult = (result === undefined); // Test helper
                databaseResult.should.be.eq(false); // Test


                //Error checking
                if (err) {
                  //500 Internal Server Error. Which means database is giving error.
                  //done(new Error("Database Error"));
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
                    user_type: user_type
                  };
                  //Resource already deleted
                  //res.status(200).send(article);
                  //done(new Error("Affected Rows should not be Affected"));
                  done(); // Correct response
                  return;
                }
                else
                {
                  //Resource not available
                  done(new Error("No Rows updated"));
                  //res.status(404).send();
                  return; // Not override previous status
                }
        
              }
            );
          }
          catch(err)
          {
            console.log(err)
            //Other Error
            //res.status(500).send();
            done(new Error("Error Thrown"));
            return;
          }
        })

    })

})

