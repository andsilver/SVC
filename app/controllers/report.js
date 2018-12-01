const User = require('../models/userModel');


/**
 * GET /reports
 * Get all reports.
 */
exports.getReports = (req, res, next) => {
  User.findOne({ email: req.user }, (err, user) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(400).json({ msg: `Email ${req.user} not found` });
    }

    res.status(200).json({ reports: user.reports });
  });
};


/**
 * GET /reports/type/:reportType
 * Get reports by reportType.
 */
exports.getReportsByType = (req, res, next) => {
  req.assert('reportType', 'reportType is not valid').isIn(['Basic', 'Full']);

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({ msg: errors[0].msg });
  }

  User.findOne({ email: req.user }, (err, user) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(400).json({ msg: `Email ${req.user} not found` });
    }

    const reports = user.reports.filter(report => report.reportType === req.params.reportType);

    res.status(200).json({ reports });
  });
};


/**
 * GET /reports/vrm/:registration
 * Get reports by registration.
 */
exports.getReportsByRegistration = (req, res, next) => {
  req.assert('registration', 'registration is not valid').isAlphanumeric();

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({ msg: errors[0].msg });
  }

  User.findOne({ email: req.user }, (err, user) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(400).json({ msg: `Email ${req.user} not found` });
    }

    const reports = user.reports.filter(report => report.registration === req.params.registration);

    res.status(200).json({ reports });
  });
};


/**
 * GET /report/:reportId
 * Get report by reportId.
 */
exports.getReportById = (req, res, next) => {
  req.assert('reportId', 'reportId is not valid').isMongoId();

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({ msg: errors[0].msg });
  }

  User.findOne({ email: req.user }, (err, user) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(400).json({ msg: `Email ${req.user} not found` });
    }

    const report = user.reports.find(report => report._id.toString() === req.params.reportId);

    res.status(200).json({ report });
  });
};
