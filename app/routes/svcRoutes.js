const { Router } = require('express');

const controller = require('./svcController');


const router = Router();



router.route('/full/:registration')
  .get(controller.getVdiFullCheck);

module.exports = router;
