const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
router.post('/cadastro', auth.cadastro);
router.post('/login', auth.login);
module.exports = router;
