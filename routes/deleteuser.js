var express = require('express');
var router = express.Router();

/* GET User delete page. */
router.get('/', function(req, res) {
	console.log("::::::::",req.body);
    var db = req.db;
    var uid = req.params.id;
    console.log(uid);
    var collection = db.get('usercollection');
    collection.remove({"_id":uid},{},function(e,docs){
        res.redirect("/userlist");
    });
});

module.exports = router;