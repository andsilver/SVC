const request         = require('request-promise');

const debug           = require('debug')('app:svcController');
const { blue, green } = require('chalk');

const Report          = require('../models/reportModel');

const {
  dataPackages,
  VdiCheckFull_Success
} = require('../data');


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
 * VdiCheckFull by VRM.
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
      const {
        StatusMessage,
        StatusCode,
        DataItems
      } = result.body.Response;

      debug(`${blue('UKVD:')} ${StatusMessage}`);
      if (StatusCode !== 'Success') throw new Error(StatusCode);

      return { msg: StatusCode, data: DataItems };
    })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({ msg: err.message, data: {} }));
};


/**
 * GET /:datapackage/:registration
 * Get data by package param and VRM.
 */
exports.getDataByPackage = (req, res, next) => {
  req.params.datapackage = req.params.datapackage.toLowerCase();

  req.assert('datapackage', 'Data Package is not valid').isIn(dataPackages);
  req.assert('registration', 'Registration is not valid').isAlphanumeric();

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({ msg: errors[0].msg });
  }

  requestOptions.qs.key_VRM = req.params.registration;
  requestOptions.uri = `${process.env.UKVD_API_URL_datapackage}/${req.params.datapackage}`;

  request(requestOptions)
    .then((result) => {
      const {
        StatusMessage,
        StatusCode,
        DataItems
      } = result.body.Response;

      debug(`${blue('UKVD:')} ${req.params.datapackage} ${StatusMessage}`);
      if (StatusCode !== 'Success') throw new Error(StatusCode);

      return { msg: StatusCode, data: DataItems };
    })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({ msg: err.message, data: {} }));
};


/**
 * GET /success
 * Mock UKVD success response.
 */
exports.getDataSuccess = (req, res, next) => res.status(200).json({ msg: 'Success', data: VdiCheckFull_Success.Response.DataItems });


/**
 * GET /fail
 * Mock UKVD fail response.
 */
exports.getDataFail = (req, res, next) => res.status(500).json({ msg: 'ServiceUnavailable', data: {} });


/**
 * VdiFullCheck by VRM
 * return report
 */
exports.generateReport = (reportType, registration) => {
  requestOptions.qs.key_VRM = registration;

  return request(requestOptions)
    .then((result) => {
      const {
        StatusMessage,
        StatusCode,
        DataItems
      } = result.body.Response;

      debug(`${blue('UKVD:')} ${StatusMessage}`);
      if (StatusCode !== 'Success') throw new Error(StatusCode);

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
