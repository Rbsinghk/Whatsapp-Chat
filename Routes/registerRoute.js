const express = require('express');
const router = new express.Router();
const registerController = require('../controllers/register');

router.post('/register', registerController.register);
router.post('/login', registerController.login);
router.get('/getUser', registerController.getUser);
router.post('/getChatData', registerController.getChatData);
router.get('/register', (req, res) => {
    res.render('register')
})
router.get('/chat', (req, res) => {
    res.render("whatschat", { name: req.session.name });
})

module.exports = router;