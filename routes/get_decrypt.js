var express = require('express');
var router  = express.Router();
var bigInt = require("big-integer");
var createHash = require('create-hash');

var apiFactory = require('../encoder/index');

"use strict";   


router.post('/', async (req, res, next) => {   

    let {add} = req.body; 

    function decode_to_rawX(encoded){ 
    
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

        // It returns Array<Number> 
        var decoded = api.decodeSeed(encoded);   
        decoded = Buffer.from(decoded, 'hex'); 
        return Promise.resolve(decoded);
    }

    // rawY_hex creator
    function pad_with_zeroes(number, length) { 
        var retval = '' + number; 
        while (retval.length < length) retval = '0' + retval; 
        return retval; 
    }
    
    rawX_hex = await decode_to_rawX(add); 
    
    // Private key
    if(rawX_hex.toString(16).length != 64 ) return res.json({privKey: rawX_hex})
    
    // Public key
    const rawX_bigInt = new bigInt(rawX_hex, 16);  
    const prime = new bigInt('fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f', 16), 
          pIdent = prime.add(1).divide(4); 
    var rawY_bigInt = rawX_bigInt.modPow(3, prime).add(7).mod(prime).modPow( pIdent, prime );
    var rwaY_hex = pad_with_zeroes(rawY_bigInt.toString(16), 64); 


    res.json({rawKey: `04${rawX_hex}${rwaY_hex}`}); 
});


module.exports = router;