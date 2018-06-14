var express = require('express');
var router = express.Router();


/* GET New User page. */
router.get('/', function(req, res) {
    res.render('newuser', { title: 'Add New User', error: "", success: req.session.success, errors: req.session.errors });
    req.session.errors = null;
});

/* POST to Add User Service */
/*router.post('/', function(req, res, next) {
    //check validation
    console.log("adduser"); 
    req.check('username','Enter username').isLength({min: 4});
    req.check('useremail','Enter valid email').isEmail();
    req.check('password','Enter valid password or confirm password').equals(req.body.confirmPassword);
    req.check('phone','Enter valid phone no.').isLength({min: 10});

    var errors = req.validationErrors();
    // Set our internal DB variable
    var db = req.db;
    var userPic = 'default.png';
    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    var userPassword = (req.body.password);
    var userPhone = req.body.phone;
    var userPic = req.body.userimg;
    var userAdd = req.body.address;
    console.log(req.body);
    if(userPic == 'undefined'){
        console.log('innnnnnnnnn');
        userPic = 'default.png';
    }

    // Set our collection
    var collection = db.get('usercollection');

    if(errors) {
        console.log(errors);
        req.session.errors = errors;
        req.session.success = false;
        //res.redirect('newuser', { title : "errors"});
        res.render('newuser', { error: errors, title: 'Add New User' });
        return false
    } else {
        req.session.success = true;
        // Submit to the DB
        collection.insert({
            "username" : userName,
            "email" : userEmail,
            "password" : userPassword,
            "phone" : userPhone,
            "img" : userPic,
            "address" : userAdd
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // And forward to success page
                return res.redirect("/userslist");
            }
        });
    }
    //


});*/

module.exports = router;