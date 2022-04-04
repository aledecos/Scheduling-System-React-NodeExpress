import jsPDF from 'jspdf'
import 'jspdf-autotable'
import axios from 'axios';

export async function printSignInSheet(currentShift, list) {

      if(currentShift) {
        const COVID = true;

        var margin = 10;

        const doc = new jsPDF();

        doc.setFontSize(16);
        const header = "CSPS Sign In " + currentShift.event.startStr;
        doc.text(header, 110, margin, "center")
        margin = margin + 8

        doc.setFontSize(10);
        const generated = "Generated: " + new Date();
        doc.text(generated, 110, margin, "center");
        margin = margin + 6;

        if(COVID) {
          doc.text("*I am NOT required to isolate as per current AHS COVID-19 Guidelines and am fit for patrol duties", 110, margin, "center");
          margin = margin + 6;
        }

        doc.text("Leader: __________", 110, margin, "center");
        margin = margin + 6;

        doc.text("__ Regular Day   __ Special Event    __ Training Day", 110, margin, "center");
        margin = margin + 6;

        var areas = [];
        try{
          await axios.get('/getAreas')
          .then(response => {
              // If request is good...
              for(let i = 0; i < response.data.length; i++){
                areas.push(response.data[i]);
              }
          })
          .catch((error) => {
              console.log('error ' + error);
          });
        }
        catch (error) {
          console.log(error);
        }

        areas.push("");

        var seperatedList = new Array(areas.length);
        for (var i = 0; i < seperatedList.length; i++) {
          seperatedList[i] = new Array();
        }
        for(let i = 0; i < areas.length; i++){
          for(let j = 0; j < list.length; j++){
            if(list[j].area === areas[i].area && (list[j].role === "Trainee" || list[j].role === "Rostered" || list[j].role === "Shadow")) {
              seperatedList[i].unshift(list[j]);
            }
            else if(i === areas.length-1 && list[j].area === null && list[j].username && (list[j].role === "Trainee" || list[j].role === "Rostered" || list[j].role === "Shadow")){
              seperatedList[areas.length-1].unshift(list[j]);
            }
          }
        }

        for(let i = 0; i < areas.length; i++){
          var head = [{}];
          var body = new Array();
          const areaString = areas[i].area;
          head[0].key = ''
          head[0].area = areaString;
          head[0].lift = 'Lift';
          head[0].lunch = 'Lunch';
          head[0].rookie = 'Rookie';
          if(COVID) {
            head[0].covid = 'Covid*';
          }
          else{
            head[0].covid = '';
          }
          head[0].signin = 'Sign In';
          head[0].comment = 'Comment';
          for(let j = 0; j < ((seperatedList[i].length > 5)? seperatedList[i].length: 5); j++){
            body.push(new Object());
            body[j].key = (j + 1);
            if(seperatedList[i][j]) {
               const userString = seperatedList[i][j].name+':'+ seperatedList[i][j].phone_number;
               body[j].area = userString;
               const commentString = seperatedList[i][j].comment+'';
               body[j].comment = commentString;
             }
             else {
               body[j].area = '            ';
               body[j].comment = '            ';
             }
          }
          if(i > 0) {
            margin = doc.lastAutoTable.finalY;
          }
          let covid_column = 0;
          if(COVID) covid_column = 13;
          doc.autoTable({
            head: head,
            body: body,
            startY: margin,
            theme: 'grid',
            columnStyles: {
              0: {cellWidth: 5},
              1: {cellWidth: 40},
              2: {cellWidth: 9},
              3: {cellWidth: 12},
              4: {cellWidth: 13},
              5: {cellWidth: covid_column},
              6: {cellWidth: 45},
              7: {cellWidth: 45},
            },
            headStyles: {
              fontSize: 8,
            },
            bodyStyles: {
              fontSize: 8,
            },
          })
        }
        const pdf_name = "Sign-In-" + currentShift.event.startStr + ".pdf";
        doc.save(pdf_name);
      }
}
