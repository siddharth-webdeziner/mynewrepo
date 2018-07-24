var express = require('express');
var router = express.Router();

/* dashboard page. */
router.get('/', function(req, res) {
	var user = [];
    if(req.session.user != undefined){
        var db = req.db;
        var userId = req.session.user._id;
        var collection = db.get('usercomments');
        collection.find({id : req.session.user._id},{},function(e,docs){
            docs = docs.reverse();
            user.push(req.session.user);
            res.render('dashboard', { title: 'Dashboard page', "userProfile": user, "comments": docs });
        });
    } else {
        res.render('login', { title: 'Login page' });
    }
    
});

module.exports = router;