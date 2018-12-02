const request         = require('request-promise');

const debug           = require('debug')('app:svcController');
const { blue, green } = require('chalk');

const Report          = require('../models/reportModel');
const data            = require('../data/VdiCheckFull_Success');


const requestOptions = {
  method: 'GET',
  uri: process.env.UKVD_API_URL_VdiCheckFull,
  qs: {
    v: 2,
    api_nullitems: 1,
    auth_apikey: process.env.UKVD_API_KEY,
    key_VRM: ''
  },
  json: true,
  resolveWithFullResponse: true
};

const env = process.env.NODE_ENV;



/**
 * GET /full/:registration
 * VdiFullCheck by VRM.
 */
exports.getVdiFullCheck = (req, res, next) => {
  req.assert('registration', 'Registration is not valid').isAlphanumeric();

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({ msg: errors[0].msg });
  }

  requestOptions.qs.key_VRM = req.params.registration;

  request(requestOptions)
    .then((result) => {
      const { StatusMessage } = result.body.Response.StatusInformation.Lookup;
      let { StatusCode } = result.body.Response;
      let { DataItems } = result.body.Response;

      debug(`${blue('UKVD:')} ${StatusMessage}`);
      if (StatusCode !== 'Success' && env === 'production') {
        throw new Error(StatusCode);
      } else {
        debug(blue('Mocking UKVD API...'));
        StatusCode = 'Success';
        // eslint-disable-next-line prefer-destructuring
        DataItems = data.Response.DataItems;
      }

      return { msg: StatusCode, data: DataItems };
    })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({ msg: err.message, data: {} }));
};


/**
 * VdiFullCheck by VRM
 * return report
 */
exports.generateReport = (reportType, registration) => {
  requestOptions.qs.key_VRM = registration;

  return request(requestOptions)
    .then((result) => {
      const { StatusMessage } = result.body.Response.StatusInformation.Lookup;
      let { StatusCode } = result.body.Response;
      let { DataItems } = result.body.Response;

      debug(`${blue('UKVD:')} ${StatusMessage}`);
      if (StatusCode !== 'Success' && env === 'production') {
        throw new Error(StatusMessage);
      } else {
        debug(blue('Mocking UKVD API...'));
        StatusCode = 'Success';
        // eslint-disable-next-line prefer-destructuring
        DataItems = data.Response.DataItems;
      }

      const report = new Report({
        reportType,
        registration,
        data: DataItems
      });

      debug(`${green('Report:')} ${JSON.stringify(report)}`);
      return report;
    })
    .catch(err => err);
};
