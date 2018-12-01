const { Router }          = require('express');

const controller          = require('../controllers/credit');
const { isAuthenticated } = require('../config/passport');

const router = Router();


router.route('/credits')
  .get(isAuthenticated, controller.getCredits)
  .post(isAuthenticated, controller.postCredits)
  .put(isAuthenticated, controller.putCredits);

module.exports = router;
