const { Router }          = require('express');

const controller          = require('../controllers/report');
const { isAuthenticated } = require('../config/passport');

const router = Router();


router.route('/reports')
  .get(isAuthenticated, controller.getReports);

router.route('/reports/type/:reportType')
  .get(isAuthenticated, controller.getReportsByType);

router.route('/reports/vrm/:registration')
  .get(isAuthenticated, controller.getReportsByRegistration);

router.route('/report/:reportId')
  .get(isAuthenticated, controller.getReportById);

module.exports = router;
