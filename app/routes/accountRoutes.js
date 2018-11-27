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
  .post(isAuthenticated, controller.postUpdatePassword);

router.route('/delete')
  .post(isAuthenticated, controller.postDeleteAccount);

module.exports = router;
