const { Router }          = require('express');

const controller          = require('./accountController');
const { isAuthenticated } = require('../services/passport');

const router = Router();


router.route('/credits')
  .get(isAuthenticated, controller.getCredits)
  .post(isAuthenticated, controller.postCredits)
  .put(isAuthenticated, controller.putCredits);

router.route('/reports')
  .get(isAuthenticated, controller.getReports);

router.route('/reports/type/:reportType')
  .get(isAuthenticated, controller.getReportsByType);

router.route('/reports/vrm/:registration')
  .get(isAuthenticated, controller.getReportsByRegistration);

router.route('/report/:reportId')
  .get(isAuthenticated, controller.getReportById);

module.exports = router;
