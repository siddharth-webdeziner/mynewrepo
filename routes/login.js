var express = require('express');
var router = express.Router();

/* login page. */
router.get('/', function(req, res) {
    //res.render('login', { title: 'Login page' });
    var userObj = [];
    console.log('>>>>>>>>>>>>>>>', req.session.user);
    userObj.push(req.session.user)
    if(req.session.user != undefined){
        console.log("in");
        var db = req.db;
        var collection = db.get('usercomments');
        collection.find({id : req.session.user._id},{},function(e,docs){
            docs = docs.reverse();
            console.log("docs>>>>>>>>>>>>>>>>>", docs);
            res.render('dashboard', { title: 'Dashboard page', "userProfile": userObj, "comments": docs  });
        });
    } else {
        console.log("out");
        res.render('login', { title: 'Login page' });
    }
});


/*-------maintaining session-----------*/


    // Authentication and Authorization Middleware
    var auth = function(req, res, next) {
      if (req.session && req.session.username === "testuser1" && req.session.admin){
        console.log("alert nxt")
        return next();
      }
      else
        return res.sendStatus(401);
    };



router.post('/', function(req, res) {
  var db = req.db;
  // Get our form values. These rely on the "name" attributes
  var userName = req.body.username;
  var userPassword = (req.body.password);
  var collection = db.get('usercollection');
  collection.findOne({ username: userName }, function(err, user) {
    if (!user) {
        //res.render('login', { title: 'Login page', error: 'Invalid email or password.' });
        res.json({"userlist" : "No such user!!"})
    } else {
      if (userPassword === user.password) {
        // sets a cookie with the user's info
        var jsonObj = [];
        jsonObj.push(user);
        req.session.user = user;
        //res.render('dashboard',{  title: 'Dashboard page' , "userProfile": jsonObj });
        return res.redirect("/dashboard");
        //res.json({"userlist" : user})
      } else {
        //res.render('login', { error: 'Invalid email or password.' });
        res.json({"userlist" : user})
      }
    }
  });
});

module.exports = router;