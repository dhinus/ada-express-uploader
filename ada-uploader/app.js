var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Database
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/ada-uploader", {native_parser:true});

var routes = require('./routes/index');
var users = require('./routes/users');
var submit = require('./routes/submit');
var entries = require('./routes/entries');

var exphbs = require('express-handlebars');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('env', 'development');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

//app.use('/', routes);
//app.use('/users', users);
app.use('/submit', submit);
app.use('/entries', entries);

app.get('/', function(req, res) {
    res.render('home', {
        title: 'BBC Audio Drama Awards Uploader',
        showForm: true
    });
});

app.post('/', function(req, res) {
    var templateVars = {
        title: 'BBC Audio Drama Awards Uploader',
        error: false,
        showForm: true,
        success: false,

        category: req.param('category'),
        entrant: req.param('entrant'),
        progtitle: req.param('title')
    }
    console.log('POST: '+ templateVars.category + '/' + templateVars.entrant + '/' + templateVars.progtitle);
    var valid = formValidation(req);

    if (!valid) {
        templateVars.error = "There was an error";
        templateVars.showForm = true;
    } else {
        templateVars.error = null;
        templateVars.showForm = false;
        templateVars.success = true;
    }

    //add to db
    //res.render('home', templateVars);    
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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

function formValidation(req) {
    //Basic validation - increase errorCount varable if any fields are blank
    var errorCount = 0;
    Object.keys(req.body).forEach(function(field) {
        var fieldContents = req.param(field);
        if (fieldContents instanceof Array) {
            fieldContents.forEach(function(value) {
                if (value === '') {
                   errorCount++;
                }
            });
        } else {
            if (fieldContents === '') {
                   errorCount++;
            }
        }
    });
    console.log("Error count: " + errorCount);
    if (errorCount === 0) {
        return true;
    } else {
        return false;
    }
}

module.exports = app;
