var express = require('express');
var router = express.Router();

/* GET Userlist page. */
router.get('/', function(req, res) {
    console.log("in userlist");
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        docs = docs.reverse();
        res.render('userlist', {"userlist" : docs});
        //res.json({"userlist" : docs})
    });
});


module.exports = router;