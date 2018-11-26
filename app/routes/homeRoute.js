const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.send('<h1>Stolen Vehicle Check</h1>');
});

module.exports = router;
