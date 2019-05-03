'use strict';

const express = require("express");
const bodyParser =require('body-parser');
const config = require('./config');
const FBeamer = require('./fBeamer');

const server = express();
const PORT = process.env.PORT || 3000;
console.log(config.fb);
const f = new FBeamer(config.fb);




server.get('/',(req,res) => {
    f.registerHook(req,res);
});



// Step 1: verification
server.post('/',bodyParser.json({
    verify: f.verifySignature.call(f)
}));

// 2. Listen for incoming
server.post('/',(req,res,next)=>{
    return f.incoming(req,res, async data => {
        try {
            if(data.content === 'hi there') {
                await f.txt(data.sender,'hey from vanilla!');
                await f.img(data.sender,'https://pbs.twimg.com/profile_images/902271591978905601/TIlVXGPw.jpg');
            }
        } catch(e) {
            console.log(e);
        }
    });
});




server.listen(PORT, ()=>console.log(`Running on port ${PORT}`));