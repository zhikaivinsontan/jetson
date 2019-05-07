'use strict';

const express = require("express");
const bodyParser =require('body-parser');
const config = require('./config');
const FBeamer = require('./fBeamer');
// require('dotenv').config();

// what vanilla needs
const matcher = require('./matcher');
const weather = require('./weather');
const {currentWeather} = require("./parser");


const server = express();
const PORT = process.env.PORT || 3000;
const f = new FBeamer(config.fb);

server.get('/',(req,res) => {
    f.registerHook(req,res);
});



// Step 1: verification
server.post('/',bodyParser.json({
    verify: f.verifySignature.call(f)
}));

// 2. Listen for incoming

server.post("/", (req, res, next) => {
  // Messages will be received here if the signature goes through
  // we will pass the messages to FBeamer for parsing
  return f.incoming(req, res, data => {
    try {
      if (data.type === "text") {
        matcher(data.content, async resp => {
          switch (resp.intent) {
            case "Hello":
              await f.txt(data.sender, `${resp.entities.greeting} to you too!`);
              break;
            case "CurrentWeather":
              await f.txt(data.sender, "Let me check...");
              let cwData = await weather(resp.entities.city);
              let cwResult = currentWeather(cwData);
              await f.txt(data.sender, cwResult);
              break;
            case "WeatherForecast":
              await f.txt(data.sender, "Let me check...");
              let wfData = await weather(resp.entities.city);
              let wfResult = forecastWeather(wfData, resp.entities);
              await f.txt(data.sender, wfResult);
              break;
            default: {
              await f.txt(data.sender, "I don't know what you mean :(");
            }
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  });
});

// server.post('/',(req,res,next)=>{
//     return f.incoming(req,res, data => {
//         try {
//             if (data.type === "text") {
//               matcher(data.content, async resp => {
//                 switch (resp.intent) {
//                   case "Hello":
//                     await f.txt(data.sender, `${resp.entities.greeting} to you too!`);
//                     break;
//                   case "CurrentWeather":
//                     await f.txt(data.sender, "Let me check...");
//                     let cwData = await weather(resp.entities.city);
//                     let cwResult = currentWeather(cwData);
//                     await f.txt(data.sender, cwResult);
//                     break;
//                   default: {
//                     await f.txt(data.sender, "I don't know what you mean :(");
//                   }
//                 }
//               });
//             }
//           } catch (e) {
//             console.log(e);
//           }
//     });
// });
// server.post('/',(req,res,next)=>{
//     return f.incoming(req,res, async data => {
//         try {
//             if(data.content === 'hi there') {
//                 await f.txt(data.sender,'hey from vanilla!');
//                 await f.img(data.sender,'https://pbs.twimg.com/profile_images/902271591978905601/TIlVXGPw.jpg');
//             }
//         } catch(e) {
//             console.log(e);
//         }
//     });
// });




server.listen(PORT, ()=>console.log(`Running on port ${PORT}`));