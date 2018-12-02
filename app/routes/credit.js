const { Router }          = require('express');

const controller          = require('../controllers/credit');
const { isAuthenticated } = require('../config/passport');

const router = Router();


router.route('/credits')
  .get(isAuthenticated, controller.getCredits)
  .post(isAuthenticated, controller.postCredits);

router.route('/credit/:creditId')
  .get(isAuthenticated, controller.getCreditById);

router.route('/credit')
  .put(isAuthenticated, controller.putCredit);

module.exports = router;
