module.exports = (app) => {
  app.use('/api/auth', require('./auth'));
  app.use('/api/account', require('./credit'));
  app.use('/api/account', require('./report'));
  app.use('/api/svc', require('./svc'));
};
