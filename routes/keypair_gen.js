const elliptic = require('elliptic');

var EC = elliptic.elliptic().ec;
var ec = new EC('secp256k1');


router.post('/', (req, res) => {
    var keypair = ec.genKeyPair(); 
    var pivateKey_raw = keypair.getPrivate('hex').toString();    
    var public_raw = keypair.getPublic('hex').toString(); 

    res.json({ 
        pivateKey: pivateKey_raw, 
        publicKey: public_raw 
    })
})

module.exports = router;