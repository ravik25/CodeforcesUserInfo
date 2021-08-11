const express = require('express');
const fs = require('fs');
const hbs = require('hbs');
var bodyParser = require('body-parser')
const path = require('path');
const PORT = process.env.PORT||3000;
const requests = require('requests');

var app = express();

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set("view engine","hbs");

app.use(express.static(path.join(__dirname,"public")));


app.get('/',(req,res)=>{
  res.render("home");
});

app.post('/userDetails',urlencodedParser,(req,res)=>{
  const User = req.body.UserID;
  requests(`https://codeforces.com/api/user.info?handles=${User}`)
    .on('data', function (chunk) {
      const Data = JSON.parse(chunk);
      if(Data.status == "OK")
      {
        const details = Data.result[0];
        res.render("index",{
          handle:details.handle,
          firstname:details.firstName || "Not Mentioned",
          lastname:details.lastName || "Not Mentioned",
          country:details.country || "Not Mentioned",
          city:details.city || "Not Mentioned",
          org:details.organization || "Not Mentioned",
          currRating:details.rating || "Not Mentioned",
          maxRating:details.maxRating || "Not Mentioned",
          currTitle:details.rank || "Not Mentioned",
          friends:details.friendOfCount || "Not Mentioned",
          contribution:details.contribution || "Not Mentioned",
          maxTitle:details.maxRank || "Not Mentioned"
        })
      }
      else {
        res.send(`User does not exist <a href='/'>Go back</a>`)
      }
      //res.send(JSON.parse(chunk).result);
      //console.log(JSON.parse(chunk).result[0].city);
    })
    .on('end', function (err) {
      if (err) return console.log('connection closed due to errors', err);
      console.log('end');
    });
});
// app.get('/:id',(req,res)=>{
//   var User = req.params.id;
//   requests(`https://codeforces.com/api/user.info?handles=${User}`)
//   .on('data', function (chunk) {
//     const Data = JSON.parse(chunk);
//     res.render("index",{
//       cityName: Data.result[0].city
//     });
//     //res.send(JSON.parse(chunk).result);
//     //console.log(JSON.parse(chunk).result[0].city);
//   })
//   .on('end', function (err) {
//     if (err) return console.log('connection closed due to errors', err);
//
//     console.log('end');
//   });
// });

app.listen(PORT,()=>(console.log(`Success on port : ${PORT}`)));
