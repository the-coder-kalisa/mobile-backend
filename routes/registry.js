const router = require('express').Router();
const {signup, login, permision} = require('../controllers/registry.js')
router.post('/signup', signup);
router.post('/login', login)
router.get('/:token', permision);

module.exports = router;