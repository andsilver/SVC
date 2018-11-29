const { Router }          = require('express');

const controller          = require('./accountController');
const { isAuthenticated } = require('../services/passport');

const router = Router();


router.route('/credits')
  .get(isAuthenticated, controller.getCredits)
  .post(isAuthenticated, controller.postCredits)
  .put(isAuthenticated, controller.putCredits);

module.exports = router;
