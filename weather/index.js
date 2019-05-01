"use strict"

const axios = require("axios");
const apiKey = process.env.APIKEY;

const formatData = data => {
    return {
        location:`${data.location.name},${data.location.country}`,
        temperature: data.current.temp_c,
        condition:data.current.condition.text,
        code:data.current.condition.code
    }
}

const getWeather = location => {
    return new Promise(async (resolve,reject) => {
        try {
            const weatherConditions = await axios.get(
                "http://api.apixu.com/v1/current.json",
                {
                  params: {
                    key:apiKey,
                    q:location,
                    days:3
                  }
                });

                //send a request and get a response

                resolve(formatData(weatherConditions.data));
            } catch (error) {
              reject(error);
            }
    });
}

module.exports = getWeather;