const { Router }          = require('express');

const controller          = require('./authController');
const { isAuthenticated } = require('../services/passport');

const router = Router();


router.route('/signup')
  .get(controller.getSignup)
  .post(controller.postSignup);

router.route('/login')
  .get(controller.getLogin)
  .post(controller.postLogin);

router.route('/logout')
  .get(controller.logout);

router.route('/password')
  .get(isAuthenticated, controller.getUpdatePassword)
  .post(isAuthenticated, controller.postUpdatePassword);

router.route('/password/reset')
  .get(controller.getReset)
  .post(controller.postReset);

router.route('/password/reset/:token')
  .get(controller.getResetToken)
  .post(controller.postResetToken);

router.route('/delete')
  .post(isAuthenticated, controller.postDeleteAccount);

module.exports = router;
