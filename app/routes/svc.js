const { Router } = require('express');

const controller = require('../controllers/svc');


const router = Router();



router.route('/full/:registration')
  .get(controller.getVdiFullCheck);

module.exports = router;
