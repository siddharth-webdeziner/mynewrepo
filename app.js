var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var fileUpload = require('express-fileupload');
var md5 = require('md5');
var nodemailer = require("nodemailer");
var Nexmo = require('nexmo');
var jwt = require('jsonwebtoken');


// Database
var mongo = require('mongodb');
var monk = require('monk');
const CONNECTION_URI = process.env.MONGODB_URI || 'localhost:27017/videodatabase';
var db = monk(CONNECTION_URI);
var config = require('./config.js');



var routes = require('./routes/index');
var users = require('./routes/api/users');
var userslist = require('./routes/api/userslist');
var videolist = require('./routes/api/videolist');
var login = require('./routes/login');
var newuser = require('./routes/newuser');
var addvideo = require('./routes/api/addvideo');
var savedvideolist = require('./routes/api/savedvideolist');
var dashboard = require('./routes/api/dashboard');
var logout = require('./routes/api/logout');

var app = express();

var nexmo = new Nexmo({
    apiKey: '8c419f5e',
    apiSecret: '55493d81d419a433',
});

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "siddharth.shahi971@gmail.com",
        pass: "Siddharth11sept"
    }
});

var storage =   multer.diskStorage({  
    destination: function (req, file, callback) {  
      callback(null, './public/uploads');  
    },  
    filename: function (req, file, callback) {  
      callback(null, file.originalname);  
    } 
});  

var upload = multer({ storage : storage}).single('uploadFile');

app.post('/uploadjavatpoint',function(req,res){
    upload(req,res,function(err) {
    var path = req.file.filename;
        if(err) {
            res.render('index', { title: 'upload again' });
        }  
        //res.redirect("/dashboard");
        //res.render('newuser', { title: 'dashboard', src: path });
        console.log(path);
        res.render('newuser', { title: 'Add New User', src: path });
    });  
});  

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret: 'max', saveUninitialized: false, resave: false}));


// Make our db accessible to our router
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        //next();
        req.db = db;
        next();
    }
});

//app.use('/routes/api', require('./auth.js'));


app.use('/', routes);
app.use('/users', require('./auth.js'), users);
app.use('/userslist',  require('./auth.js'), userslist);
app.use('/videolist', videolist);
app.use('/login', login);
app.use('/newuser', newuser);
app.use('/dashboard', require('./auth.js'), dashboard);
app.use('/addvideo', require('./auth.js'), addvideo);
app.use('/savedvideolist', savedvideolist);
app.use('/logout', require('./auth.js'), logout);


/* POST to Add User Service */
app.post('/adduser', function(req, res) {
    // Set our internal DB variable
    var db = req.db;
    var userImage = 'dummy_media.png';
    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.email;
    var userPassword = (req.body.password);
    var userPhone = req.body.phone;
    var userAboutme = req.body.aboutme;
    var userImage = req.body.userimg;
    var userAddress = req.body.address;
    var userLat = req.body.lat;
    var userLong = req.body.long;
    if(userImage == 'undefined'){
        console.log('innnnnnnnnn');
        userImage = 'dummy_media.png';
    }
    // Set our collection
    var collection = db.get('usercollection');
    collection.findOne({ email: userEmail }, function(err, user) {
        if (!user) {
            //res.render('login', { title: 'Login page', error: 'Invalid email or password.' });
            // Submit to the DB
            collection.insert({
                "username" : userName,
                "email" : userEmail,
                "password" : userPassword,
                "phone" : userPhone,
                "aboutme": userAboutme,
                "userimg" : userImage,
                "useradd" : userAddress,
                "userlat" : userLat,
                "userlong" : userLong,
            }, function (err, doc) {
                if (err) {
                    // If it failed, return error
                    res.send("There was a problem adding the information to the database.");
                }
                else {
                var mailOptions={
                    to : userEmail,
                    subject : "Greeting from VDO lounge",
                    text : "Hello, "+userName+", you have been successfully registered!!"
                }
        
                console.log(mailOptions);
                // And forward to success page
                smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                    console.log(error);
                    res.end("error");
                    }else{
                    res.end("sent");
                    }
                });
                var from = '918077022653';
                var to = '918077022653';
                var text = 'Hi '+userName+', you have successfully registered. Keep posting!!';
        
                nexmo.message.sendSms(from, to, text);
                //res.send("userlist");
                var jsonObj = [];
                jsonObj.push(doc);
                console.log(jsonObj);
                res.json(200, {
                    'response':'success',
                    'userObj': jsonObj,
                })
                }
            });
        } else{

            var token = jwt.sign({
                user: userName
            },
            config.secret, {
                expiresIn: 24*60*60
            })
    
            // sets a cookie with the user's info
            var jsonObj = [];
            jsonObj.push(user);
            req.session.user = user;
            res.json(200, {
                'responce':'success',
                'token': token,
                'userObj': jsonObj,
            })
        }
      });
});


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

const PORT = process.env.PORT || 5000;
// Listen to port 5000
app.listen(PORT, function () {
    console.log('Dev app listening on port ${PORT}');
});
// module.exports = app;
