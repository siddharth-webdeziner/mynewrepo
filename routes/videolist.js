var express = require('express');
var router = express.Router();

/* GET Userlist page. */
router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('addedvideoscode');
    collection.find({},{},function(e,docs){
        docs = docs.reverse();
        console.log("docs", docs);
        //res.render('userlist', {"userlist" : docs});
        res.json({"videolist" : docs})
    });
});

/* GET Userlist page. */
router.post('/', function(req, res) {
    var db = req.db;
    var catId = req.params.id;
    var collection = db.get('addedvideoscode');
    collection.find({"_id":uid},{},function(e,docs){
        console.log("docs", docs);
        //res.render('userlist', {"userlist" : docs});
        res.json({"videolist" : docs})
    });
});

module.exports = router;