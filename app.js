const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

//Connect To DB
mongoose.connect(config.database);
let db = mongoose.connection;

//Check Connection
db.once('open', () => {
    console.log('Connected to MongoDB');
})
//Check For DB Errors
db.on('error', (err)=>{
    console.log(err);
})
//Init App
const app = express();

//BringIn Models
let Article = require('./models/article');

//Load View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set Static Path
app.use(express.static(path.join(__dirname, 'public')))

//Set Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))

//Set Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Set Express Validator Middleware
app.use(expressValidator());

//Passport Config
require('./config/passport')(passport);

//Set Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//BringIn Models
let User = require('./models/user');

//Global Variables
app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
})

//Home Route
app.get('/', (req, res) => {
    Article.find({}, (err, articles)=>{
        if (err) {
            console.log(err);
        }else{
            res.render('index', {
                title:'Articles',
                articles: articles
            })
        }
    })
})

//Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

//Start server
app.listen(3000, () => {
    console.log('Server started on port 3000...')
})