var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var con=require('./Database/conn')
var loginRouter = require('./routes/login');
const sql = require('mssql')
var session = require('express-session')
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', './views');
app.use('/', loginRouter);

app.use(session({
  secret : 'ABCDefg',
  resave : false,
  saveUninitialized : true
}));

//fazendo a conexão global
sql.connect(con)
   .then(conn => global.conn = conn)
   .catch(err => console.log(err));

module.exports = app;
