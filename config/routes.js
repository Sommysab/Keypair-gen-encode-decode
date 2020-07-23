module.exports = function(app) {  
    
    const decrypt = require('../routes/get_decrypt');   
    const encrypt = require('../routes/get_encrypt');   
    const genKeypair = require('../routes/keypair_gen');   
    
    app.use('/', genKeypair); 
    app.use('/decrypt', decrypt);   
    app.use('/encrypt', encrypt);      
}