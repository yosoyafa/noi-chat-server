const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('server up');
});

module.exports = router;