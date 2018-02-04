const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

//Connect To DB
mongoose.connect('mongodb://localhost/nodekb');
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
app.use('/articles', articles);

//Start server
app.listen(3000, () => {
    console.log('Server started on port 3000...')
})