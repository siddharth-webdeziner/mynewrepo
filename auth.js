var jwt = require('jsonwebtoken');
var config = require('./config.js');

module.exports = function(req, res, next){
    var token  = req.body.token || req.headers['x-access-token'];

    if(token) {
        jwt.verify(token, config.secret, function(error, decoded){
            if(error){
                console.log('Error');
                return res.status(401).send(error);
            } else {
                req.decoded = decoded;
                console.log("in auth");
                return next();
            }
        })
    } else {
        res.redirect(401, '/')
    }
}