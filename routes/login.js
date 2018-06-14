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
        res.render('dashboard', { title: 'Dashboard page', "userProfile": userObj  });
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
  console.log(userName + " : " + userPassword)
  var collection = db.get('usercollection');
  collection.findOne({ username: userName }, function(err, user) {
    console.log(user);
    if (!user) {
        console.log("in")
        res.render('login', { title: 'Login page', error: 'Invalid email or password.' });
    } else {
        console.log("in else!!")
      if (userPassword === user.password) {
        console.log("in email");
        // sets a cookie with the user's info
        console.log(user);
        var jsonObj = [];
        jsonObj.push(user);
        req.session.user = user;
        console.log("user");
        //res.render('dashboard',{  title: 'Dashboard page' , "userProfile": jsonObj });
        return res.redirect("/dashboard");
      } else {
        console.log("in else else");
        res.render('login', { error: 'Invalid email or password.' });
      }
    }
  });
});

module.exports = router;