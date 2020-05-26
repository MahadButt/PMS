var createError = require('http-errors');
var express = require('express');
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');

var login = require('./routes/index');
var signup = require('./routes/signup');
var dashboard=require('./routes/dashboard');
var passwordCategory=require('./routes/passwordCategory');
var viewAllPassword=require('./routes/viewAllPassword');
var logout=require('./routes/logout');
var usersRouter = require('./routes/users');

var addNewCategory=require('./routes/addNewCategory');
var addNewPassword=require('./routes/addNewPassword');
var app = express();
var server = http.createServer(app);
var PORT = process.env.PORT || 2610;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    key: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    httpOnly: true,
    secure: true,
    ephemeral: true,
    resave: false,
    saveUninitialized: true
})
        );

app.use('/', login);
app.use('/signup', signup);
app.use('/dashboard',dashboard);
app.use('/passwordCategory',passwordCategory);
app.use('/viewAllPassword',viewAllPassword);
app.use('/logout',logout);
app.use('/users', usersRouter);

app.use('/addNewCategory',addNewCategory);
app.use('/addNewPassword',addNewPassword);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

server.listen(PORT, () => {
    console.log('Server Listen on Port: ' + PORT);
});
module.exports = app;
