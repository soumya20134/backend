const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/', controller.getPortfolio);
router.post('/',controller.addPortfolio);
module.exports = router;