var express = require('express');
var router = express.Router();

/* logout user */

router.get('/', function(req, res) {
    res.render('login', { title: 'Login page', error: 'U r logged out' });
});


router.post('/', function(req, res) {
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }  
        else
        {
            //return res.render('login', { title: 'Login page', error: 'U r logged out' });
            return res.redirect("/login");
        }  
    });
});

module.exports = router;