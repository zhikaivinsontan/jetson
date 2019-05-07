"use strict"

const axios = require("axios");
require('dotenv').config();
const apiKey = process.env.APIKEY;

const formatData = data => {
    return {
        location:`${data.location.name},${data.location.country}`,
        temperature: data.current.temp_c,
        condition:data.current.condition.text,
        code:data.current.condition.code
    }
}

let getWeather = location => {
  console.log("\n\n\n\n",location,"\n",apiKey,"\n\n\n\n");
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("\n\n\n\n",location,"\n",apikey,"\n\n\n\n");
      const weatherConditions = await axios.get(
        "https://api.apixu.com/v1/forecast.json",
        {
          params: {
            key: apiKey,
            q: location,
            days: 3
          }
        }
      );
      resolve(formatData(weatherConditions.data));
    } catch (error) {
      reject(error);
    }
  });
};

// let getWeather = location => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const weatherConditions = await axios.get(
//         "https://api.apixu.com/v1/forecast.json",
//         {
//           params: {
//             key: apiKey,
//             q: location,
//             days: 3
//           }
//         }
//       );
//       resolve(formatData(weatherConditions.data));
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

module.exports = getWeather;