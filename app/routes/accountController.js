const passport  = require('passport');

const debug     = require('debug')('app:userController');

const User      = require('../models/userModel');



/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    // TODO: handle info msg
    return res.json('Already Logged In.');
  }
  res.json('Login Page.');
};


/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    // TODO: handle errors
    return res.json(errors);
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      // TODO: handle info msg
      return res.json(info);
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      // TODO: handle info msg
      res.json('Success! You are logged in.');
    });
  })(req, res, next);
};


/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) debug('Error : Failed to destroy the session during logout.', err);
    req.user = null;
    res.redirect('/');
  });
};


/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    // TODO: handle info msg
    return res.json('Already Signed up.');
  }
  // TODO: handle info msg
  res.json('Signup Page.');
};


/**
 * POST /signup
 * Create a new account.
 */
exports.postSignup = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    // TODO: handle errors
    return res.json(errors);
  }

  const user = new User({ email: req.body.email });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      // TODO: handle info msg
      return res.json('Account with that email address already exists.');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        // TODO: redirect to create password
        res.json('Success!');
      });
    });
  });
};


/**
 * GET /password
 * Update/Create password page.
 */
exports.getUpdatePassword = (req, res) => res.json('Update/Create Password page.');


/**
 * POST /password
 * Update current password or Create.
 */
exports.postUpdatePassword = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    // TODO: handle errors
    return res.json(errors);
  }

  User.findOne({ email: req.user }, (err, user) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err) => {
      if (err) { return next(err); }
      res.json('Password updated.');
    });
  });
};


/**
 * GET /password/reset
 * Reset Password page.
 */
exports.getReset = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/account/password');
  }
  res.json('Reset Password page.');
};


/**
 * POST /delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
  User.deleteOne({ email: req.user }, (err) => {
    if (err) { return next(err); }
    req.logout();
    // TODO: handle info msg
    res.json('Your account has been deleted.');
  });
};
