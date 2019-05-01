'use strict'

const Readline = require('readline');
require('dotenv').config();

const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false    
});

const matcher = require('./matcher');
const weather = require('./weather');
const {currentWeather} = require("./parser");

rl.setPrompt('> ');
rl.prompt();
rl.on('line',reply=>{
    matcher(reply,data=>{
        switch(data.intent) {
            case 'Hello':
                console.log("Hello!");
                rl.prompt();
                break;
            case 'Exit':
                console.log('Bye!');
                process.exit(0);

            case 'CurrentWeather':
                console.log(`Checking for weather in ${data.entities.city}`);
                
                weather(data.entities.city)
                    .then(response=>{
                        // let parseResult = currentWeather(response);
                        let parseResult = currentWeather(response);
                        console.log(parseResult);
                        rl.prompt();
                    })
                    .catch(error=>{
                        console.log(error);
                    });
                
                break;
                
            default:
                console.log("I'm sorry, come again?");
                rl.prompt();
        }
    });
});