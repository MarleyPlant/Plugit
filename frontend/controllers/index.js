var router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/bot', require('./bot'));
router.use('/dashboard', require('./dashboard'));
router.use('/modules', require('./modules'));


module.exports = router;
