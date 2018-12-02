const debug  = require('debug')('app:creditController');

const SVC    = require('./svc');

const User   = require('../models/userModel');
const Credit = require('../models/creditModel');



/**
 * Create report
 * @param {Object} user         user to update
 * @param {Object} credit       credit being used
 * @param {String} registration VRM
 */
const createReport = (user, credit, registration) => SVC.generateReport(credit.creditType, registration)
  .then(report => new Promise((resolve, reject) => {
    if (report instanceof Error) return reject(report);

    user.reports.push(report);

    const index = user.credits.findIndex(c => c._id.toString() === credit._id.toString());
    user.credits[index].hasReport = true;
    user.credits[index].reportId  = report._id;

    resolve(index);
  }))
  .then(index => new Promise((resolve, reject) => {
    user.save((err) => {
      if (err) { return reject(err); }

      resolve({
        credit: user.credits[index],
        report: user.reports[user.reports.length - 1]
      });
    });
  }));


/**
 * GET /credits
 * Get all credits.
 */
exports.getCredits = (req, res, next) => {
  User.findOne({ email: req.user }, (err, user) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(400).json({ msg: `Email ${req.user} not found` });
    }

    res.status(200).json({ credits: user.credits });
  });
};


/**
 * POST /credits
 * Save new credit/s with/without report/s.
 */
exports.postCredits = (req, res, next) => {
  User.findOne({ email: req.user }, (err, user) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(400).json({ msg: `Email ${req.user} not found` });
    }

    const { credits } = req.body;
    if (!credits || !Array.isArray(credits)) {
      return res.status(400).json({ msg: 'credits is not valid' });
    }

    // TODO:
    // Loop through credits and check all fields are there
    // save credits without reports
    // create reports using saved credits

    const expiry = Date.now() + (2 * 365 * 24 * 60 * 60 * 1000); // 2 years
    const results = {
      credits: [],
      reports: []
    };

    try {
      credits.forEach(async (credit, i) => {
        let hasReport;
        let reportId;

        // Use credit to generate report.
        if (credit.generateReport && credit.creditType && credit.registration) {
          const report = await SVC.generateReport(credit.creditType, credit.registration);
          if (report instanceof Error) throw report;

          user.reports.push(report);
          results.reports.push(user.reports[user.reports.length - 1]);
          hasReport = true;
          reportId = report._id;
        }

        const newCredit = new Credit({
          creditType: credit.creditType,
          expiresAt: expiry,
          hasReport,
          reportId
        });
        user.credits.push(newCredit);
        results.credits.push(user.credits[user.credits.length - 1]);

        if (i === credits.length - 1) {
          user.save((err) => {
            if (err) { return next(err); }
            res.status(200).json(results);
          });
        }
      });
    } catch (error) {
      return next(error);
    }
  });
};


/**
 * GET /credit/:creditId
 * Get credit by creditId.
 */
exports.getCreditById = (req, res, next) => {
  req.assert('creditId', 'creditId is not valid').isMongoId();

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({ msg: errors[0].msg });
  }

  User.findOne({ email: req.user }, (err, user) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(400).json({ msg: `Email ${req.user} not found` });
    }

    const credit = user.credits.find(credit => credit._id.toString() === req.params.creditId);

    res.status(200).json({ credit });
  });
};


/**
 * PUT /credit
 * Use credit to generate report.
 */
exports.putCredit = (req, res, next) => {
  req.assert('creditId', 'CreditId is not valid').isMongoId();
  req.assert('registration', 'Registration is not valid').isAlphanumeric();

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({ msg: errors[0].msg });
  }
  req.body.registration = req.body.registration.toUpperCase();

  User.findOne({ email: req.user }, (err, user) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(400).json({ msg: `Email ${req.user} not found` });
    }

    const { creditId, registration } = req.body;

    const credit = user.credits.find(credit => credit._id.toString() === creditId);
    if (!credit) {
      return res.status(400).json({ msg: `CreditId ${creditId} not found` });
    } else if (credit.hasReport || credit.expiresAt < Date.now()) {
      return res.status(400).json({ msg: 'Used or expired credit' });
    }

    createReport(user, credit, registration)
      .then(response => res.status(200).json(response))
      .catch(err => next(err));
  });
};
