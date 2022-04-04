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
    console.log("Connected for Remove User Test");
  
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
    

    let eventId1 = '';
    //reset database 
    before(async function(){
        const query = await runQuery("INSERT INTO users (username, user_type) VALUES (?, ?)",["removeUser", "System Admin"])
        .then((result) => {
            console.log("Created removeUser for Test")
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

        const query3 = await runQuery("INSERT INTO event_log (event_id, event_name, username) VALUES(?, ?, ?)",[eventId1, 'title', "removeUser"])
        .then((result) => {
            console.log("Inserted EventLog entry for test")
        }).catch((err) => {
            console.log(err)
        });

    })

    after(async function() {
        // runs once after the last test in this block
        const query = await runQuery("DELETE FROM users WHERE username = ?",["removeUser"])
        .then((result) => {
            console.log("Deleted removeUser")
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



    describe("Remove User /removeUser", () => {
    

        it("Remove User API - Bad Input 1 - User Does not Exist", (done) => {

            const article ={
                event_id: eventId1,
                username: "444444444444444",
                role: "System Admin",
                action_user: "444444444444444",
            };
            chai.request('http://localhost:5000')
            .put("/removeUser")
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

        it("Remove User - Bad Input 2 - Wrong Event ID", (done) => {
            const article ={
                event_id: 12335432534564534534534,
                username: "removeUser",
                role: "System Admin",
                action_user: "removeUser",
            };

            chai.request('http://localhost:5000')
            .put("/removeUser")
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

        it("Remove User - Good Input", (done) => {
            const article = {
                event_id: eventId1,
                username: "removeUser",
                role: "System Admin",
                action_user: "removeUser",
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

describe('Server Unit Test', () => {

})
