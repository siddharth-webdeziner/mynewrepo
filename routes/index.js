var express = require('express');
var router = express.Router();
var md5 = require('md5');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        docs = docs.reverse();
        res.render('index', {
            "userlist" : docs,
             title: 'Express' 
        });
    });
});

/* GET Hello World page. */
router.get('/helloworld/:id', function(req, res) {
    //res.render('helloworld', { title: 'Hello, World!' });
    var db = req.db;
    var uid = req.params.id;
    console.log("uid : "+uid)
    var collection = db.get('usercollection');
    console.log(req.session.user);
    if(req.session.user == undefined){
        res.render('login', { title: 'Login page' });
    } else {
        collection.find({"_id":uid},{},function(e,docs){
            console.log("docs");
            console.log(docs);
            res.render('helloworld', { title : "Write your comments", "usercomments": docs });
        });
    }
});


/* GET Userlist page. */
/*router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        docs = docs.reverse();
        res.render('userlist', {"userlist" : docs});
    });
});*/

/* GET User delete page. */
router.get('/delete/:id', function(req, res) {
    console.log("in delete user!!");
    var userDel = [];
    var db = req.db;
    var uid = req.params.id;
    var collection = db.get('usercollection');
    collection.remove({"_id":uid},{},function(e,docs){
        console.log("docs", docs);
        userDel.push(docs)
        res.redirect("/userslist");
    });
});


/* POST to Add a comment */
router.post('/commentsPage/:id', function(req, res, next) {
    //check validation
    var db = req.db;
    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userCommented = req.body.usercomments;
    console.log(req.body);

    // Set our collection
    var collection = db.get('usercomments');

    req.session.success = true;
    // Submit to the DB
    collection.insert({
        "username" : userName,
        "comments" : userCommented
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/dashboard");
            //res.render('userlist', {"userlist" : userDel});
        }
    });
    //


});

/* GET User update page. */
router.get('/updateuser/:id', function(req, res) {
    var db = req.db;
    var uid = req.params.id;
    var collection = db.get('usercollection');
    console.log(">>>>>>>>", req.session.user);
    if(req.session.user == undefined){
        res.render('login', { title: 'Login page' });
    } else {
        collection.find({"_id":uid},{},function(e,docs){
            console.log(docs);
            res.render('updateuser', { title : "Update profile", "userupdate": docs });
        });
    }
});


/* update user. */
router.post('/updateprofile/:id', function(req, res) {
    
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    console.log("req.body");
    console.log(req.body);
    var userImg = req.body.userimg;
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    var userPassword = (req.body.password);
    var userPhone = req.body.phone;
    var uid = req.params.id;
    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.update({"_id":uid},{
        "img" : userImg,
        "username" : userName,
        "email" : userEmail,
        "password" : userPassword,
        "phone" : userPhone
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/userlist");
        }
    });
});

router.get('/uploadfile', function(req, res) {
    res.render('uploadfile', { title: 'Upload Image'});
});

module.exports = router;