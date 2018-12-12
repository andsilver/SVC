const { Router } = require('express');

const controller = require('../controllers/svc');


const router = Router();



router.route('/full/:registration')
  .get(controller.getVdiFullCheck);

router.route('/:datapackage/:registration')
  .get(controller.getDataByPackage);

router.route('/success')
  .get(controller.getDataSuccess);

router.route('/fail')
  .get(controller.getDataFail);


module.exports = router;
