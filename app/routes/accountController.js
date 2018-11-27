const { promisify } = require('util');
const crypto        = require('crypto');
const passport      = require('passport');
const nodemailer    = require('nodemailer');

const debug         = require('debug')('app:userController');

const User          = require('../models/userModel');


const randomBytesAsync = promisify(crypto.randomBytes);



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
 * POST /password/reset
 * Create a random token, then the send user an email with a reset link.
 */
exports.postReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/account/password');
  }
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    return res.json(errors);
  }

  const createRandomToken = randomBytesAsync(16)
    .then(buf => buf.toString('hex'))
    .catch(err => err);

  const setRandomToken = (token) => {
    // eslint-disable-next-line implicit-arrow-linebreak
    User
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          // TODO: handle info msg
          return res.json('Account with that email address does not exist.');
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + (60 * 60 * 1000); // 1 hour

        user.save()
          .then(sendResetPasswordEmail)
          .catch(err => err);
      })
      .catch(err => err);
  };

  const sendResetPasswordEmail = (user) => {
    if (!user) {
      // TODO: handle info msg
      return res.json('Error sending the password reset message. Please try again shortly.');
    }
    const token = user.passwordResetToken;
    let transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'm4076788@nwytg.net', // Set from address e.g reviewingcode@gmail.com
      subject: 'Reset password requested',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/account/password/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        return res.json(`An e-mail has been sent to ${user.email} with further instructions.`);
      })
      .catch((err) => {
        if (err.message === 'self signed certificate in certificate chain') {
          debug('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
          transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
              user: process.env.SENDGRID_USER,
              pass: process.env.SENDGRID_PASSWORD
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          return transporter.sendMail(mailOptions)
            .then(() => {
              return res.json(`An e-mail has been sent to ${user.email} with further instructions.`);
            });
        }
        debug('ERROR: Could not send forgot password email after security downgrade.\n', err);
        return err;
      });
  };

  createRandomToken
    .then(setRandomToken)
    .catch(next);
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
