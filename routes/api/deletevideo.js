var express = require('express');
var router = express.Router();

/* Add video page. */
router.get('/', function(req, res) {
	var user = [];
    console.log("req.session.user")
    console.log(req.session.user)
    if(req.session.user != undefined){
    	console.log("undefined!!");
    	user.push(req.session.user)
        res.render('addvideo', { title: 'Add Video page'});
    } else {
    	console.log("not undefined!!");
        res.render('login', { title: 'Login page' });
    }
    
});


module.exports = router;