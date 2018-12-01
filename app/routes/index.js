module.exports = (app) => {
  app.use('/auth', require('./auth'));
  app.use('/account', require('./credit'));
  app.use('/account', require('./report'));
  app.use('/svc', require('./svc'));
};
