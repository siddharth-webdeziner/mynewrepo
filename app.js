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


// Database
var mongo = require('mongodb');
var monk = require('monk');
const CONNECTION_URI = process.env.MONGODB_URI || 'localhost:27017/videodatabase';
var db = monk(CONNECTION_URI);

var routes = require('./routes/index');
var users = require('./routes/users');
var userslist = require('./routes/userslist');
var videolist = require('./routes/videolist');
var login = require('./routes/login');
var newuser = require('./routes/newuser');
var addvideo = require('./routes/addvideo');
var dashboard = require('./routes/dashboard');
var logout = require('./routes/logout');

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
        pass: "siddharth@12!"
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
    req.db = db;
    next();
});


app.use('/', routes);
app.use('/users', users);
app.use('/userslist', userslist);
app.use('/videolist', videolist);
app.use('/login', login);
app.use('/newuser', newuser);
app.use('/dashboard', dashboard);
app.use('/addvideo', addvideo);
app.use('/logout', logout);



/* POST to Add User Service */
app.post('/adduser', function(req, res) {
    // Set our internal DB variable
    var db = req.db;
    var userImage = 'dummy_media.png';
    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    var userPassword = (req.body.password);
    var userPhone = req.body.userphone;
    console.log(req.body);
    console.log(userPassword);
    var userImage = req.body.userimg;
    var userAddress = req.body.address;
    var userLat = req.body.lat;
    var userLong = req.body.long;
    console.log("userImage : "+userImage)
    if(userImage == 'undefined'){
        console.log('innnnnnnnnn');
        userImage = 'dummy_media.png';
    }
    // Set our collection
    var collection = db.get('usercollection');
  
    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail,
        "password" : userPassword,
        "phone" : userPhone,
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
             subject : "Greeting from XYZ",
             text : "U have been successfully registered!!"
          }
  
          console.log(mailOptions);
          // And forward to success page
          smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
              console.log(error);
              res.end("error");
            }else{
              console.log("Message sent: " + response.message);
              res.end("sent");
            }
          });
          var from = '918077022653';
          var to = '918077022653';
          var text = 'Hi '+userName+' u have successfully registered. Keep posting!!';
  
          nexmo.message.sendSms(from, to, text);
          res.send("userlist");
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
