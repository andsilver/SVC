const path          = require('path');
const dotenv        = require('dotenv');
const logger        = require('morgan');
const express       = require('express');
const bodyParser    = require('body-parser');
const errorHandler  = require('errorhandler');

const debug         = require('debug')('app');
const { yellow }    = require('chalk');



/**
 * Load environment variables from .env file
 */
dotenv.load({ path: '.env.dev' });


/**
 * Route handlers
 */
const {
  homeRoute
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
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Primary app routes.
 */
app.use('/', homeRoute);


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
