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
    console.log("Connected for Events Altered Test");
  
});


describe('Server.js API', () => {

  describe("Events Altered /eventsAltered", () => {

    it("Check Events Altered API - Bad Input 1 - bad dates", (done) => {

      chai.request('http://localhost:5000')
      .get("/eventsAltered/999-9999-9999$00000-000-0")
      .end((err, response) => {
        if (err) {
          console.log(err);
        }
        response.status.should.eq(204);
        Object.keys(response.body).length.should.eq(0); // way to check the json body {} is empty since it is 204 it should return nothing
        done();
      })
    })

    it("Check Events Altered API - Good Input 1 - valid dates", (done) => {

      chai.request('http://localhost:5000')
      .get("/eventsAltered/2021-02-19$2021-02-20")
      .end((err, response) => {
        if (err) {
          console.log(err);
        }
        response.status.should.eq(200);
        Object.keys(response.body).length.should.eq(1); // way to check the json body {} is empty since it is 204 it should return nothing
        done();
      })
    })

  })

})

describe('Server Unit Test', () => {

  describe("Events Altered /eventsAltered", () => {

    it("Check Events Altered API - Bad Input 1 - bad dates", (done) => {

      let req = {params: {startAndEnd: '999-9999-9999$00000-000-0'}}

      const info = req.params.startAndEnd;
      let query = "SELECT * FROM event WHERE start_date >= ? AND start_date <= ?";
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

          let databaseError = (err === null); // Test helper
          databaseError.should.be.eq(true); // Test
          
          let databaseResult = (result === undefined); // Test helper
          databaseResult.should.be.eq(false); // Test

          //Error checking
          if (err) {
            //500 Internal Server Error. Which means database is giving error.
            done(new Error("Database Error"));
            return; // Not override previous status
          }
          else if(result.length === 0)
          {
            //Resource not found
            done(); // Success
            return; // Not override previous status
          }
          else
          {
            done(new Error("Row found that should not have been found"));
            return; // Not override previous status
          }
        }
      );

    })

    it("Check Events Altered API - Good Input 1 - valid dates", (done) => {

      let req = {params: {startAndEnd: '2021-02-19$2021-02-20'}}

      const info = req.params.startAndEnd;
      let query = "SELECT * FROM event WHERE start_date >= ? AND start_date <= ?";
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

          let databaseError = (err === null); // Test helper
          databaseError.should.be.eq(true); // Test
          
          let databaseResult = (result === undefined); // Test helper
          databaseResult.should.be.eq(false); // Test

          //Error checking
          if (err) {
            //500 Internal Server Error. Which means database is giving error.
            done(new Error("Database Error"));
            return; // Not override previous status
          }
          else if(result.length === 0)
          {
            //Resource not found
            done(new Error("Resource not found, rows should not be affected"));
            return; // Not override previous status
          }
          else
          {
            done(); // Success
            return; // Not override previous status
          }
        }
      );

    })
  })
})