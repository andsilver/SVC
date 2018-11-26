const path              = require('path');
const logger            = require('morgan');
const dotenv            = require('dotenv');
const express           = require('express');
const mongoose          = require('mongoose');
const passport          = require('passport');
const bodyParser        = require('body-parser');
const errorHandler      = require('errorhandler');
const flash             = require('express-flash');
const session           = require('express-session');
const expressValidator  = require('express-validator');
const MongoStore        = require('connect-mongo')(session);

const debug             = require('debug')('app');
const { red, yellow }   = require('chalk');



/**
 * Load environment variables from .env file.
 */
dotenv.load({ path: '.env.dev' });


/**
 * Route handlers.
 */
const {
  homeRoute,
  accountRoutes
} = require('./routes');


/**
 * Create Express server.
 */
const app = express();

const port = process.env.PORT || 3000;


/**
 * Connect to MongoDB.
 */
mongoose.set('useNewUrlParser', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  debug(err);
  debug('%s MongoDB connection error. Please make sure MongoDB is running.', red('✗'));
  process.exit();
});


/**
 * Express configuration.
 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(expressValidator());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Session and Passport configuration.
 */
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hrs
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());
require('./services/passport');


/**
 * Primary app routes.
 */
app.use('/', homeRoute);
app.use('/account', accountRoutes);


/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    debug(err);
    res.status(500).send('Internal Server Error');
  });
}


/**
 * Start Express server.
 */
app.listen(port, () => {
  debug(`App running at port ${yellow(port)}`);
});
