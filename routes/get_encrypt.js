var express = require('express'); 
var router = express.Router(); 
var createHash = require('create-hash');

var apiFactory = require('../encoder/index');

"use strict";


router.post('/', async (req, res, next) => {   
 
    let x = req.body.add;
    
    // public key
    if(x.toString(16).length >= 128){
      x = x.replace(/^04/, '').substring(0, 63);
      // Or with "keypair" generated with private key:
      // var x = keypair.getPublic().getX().toString('hex');  
    }
        
    function encode(x){ 
      var api = apiFactory({
        defaultAlphabet: 'tipple', 
        sha256: function(bytes) { 
          return createHash('sha256').update(Buffer.from(bytes)).digest(); 
        },
        codecMethods : {
          AccountID : {version: 0x00},
          Seed: {version: 0x21}
        },
      }); 

      var buf = Buffer.from(x, 'hex');  
      var encoded = api.encodeSeed(buf);  
      return Promise.resolve(encoded); 
    } 
        
    const pub_encode = await encode(x); 

    res.json({pub_encode}); 
});


module.exports = router;