const { Router }          = require('express');

const controller          = require('./accountController');
const { isAuthenticated } = require('../services/passport');

const router = Router();


router.route('/login')
  .get(controller.getLogin)
  .post(controller.postLogin);

router.route('/logout')
  .get(controller.logout);

router.route('/signup')
  .get(controller.getSignup)
  .post(controller.postSignup);

router.route('/password')
  .get(isAuthenticated, controller.getUpdatePassword)
  .post(isAuthenticated, controller.postUpdatePassword);

router.route('/password/reset')
  .get(controller.getReset)
  .post(controller.postReset);

router.route('/delete')
  .post(isAuthenticated, controller.postDeleteAccount);

module.exports = router;
