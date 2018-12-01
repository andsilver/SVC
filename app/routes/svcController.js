const request   = require('request-promise');

const debug     = require('debug')('app:svcController');
const { blue }  = require('chalk');



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

  const requestOptions = {
    method: 'GET',
    uri: `${process.env.UKVD_API_URL_VdiCheckFull}`,
    qs: {
      v: 2,
      api_nullitems: 1,
      auth_apikey: process.env.UKVD_API_KEY,
      key_VRM: req.params.registration.toLowerCase()
    },
    json: true,
    resolveWithFullResponse: true
  };

  request(requestOptions)
    .then((result) => {
      const { StatusMessage } = result.body.Response.StatusInformation.Lookup;
      const { StatusCode } = result.body.Response;
      const { DataItems } = result.body.Response;
      const status = result.statusCode;
      debug(`${blue('UKVD:')} ${StatusMessage}`);

      return {
        status,
        response: { msg: StatusCode, data: DataItems }
      };
    })
    .then(result => res.status(result.status).json(result.response))
    .catch(err => next(err));
};
