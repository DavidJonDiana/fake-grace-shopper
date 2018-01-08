const router = require('express').Router();


router.use('/users', require('./users'));
router.use('/products', require('./products'));



router.use(function (req, res, next) {
    const err = new Error('Not found.');
    err.status = 404;
    next(err);
});

module.exports = router;