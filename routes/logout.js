var express = require('express');
var router = express.Router();

/* logout user */

router.get('/', function(req, res) {
    console.log("out")
    res.render('login', { title: 'Login page', error: 'U r logged out' });
});


router.post('/', function(req, res) {
    console.log("req.session.user")
    console.log(req.session.user)
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }  
        else
        {
            //res.redirect('/');
            res.render('login', { title: 'Login page', error: 'U r logged out' });
        }  
    });
});

module.exports = router;