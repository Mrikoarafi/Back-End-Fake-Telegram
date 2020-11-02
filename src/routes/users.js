const express = require('express');
const router = express.Router();
const users = require('../controller/users');

router
	.post('/register', users.register)
	.get('/verify/:token', users.verify)
	.post('/login', users.login)
	.get('/getAll', users.getAll)
	.get('/getDetail/:id', users.getDetails)
	.put('/update/:id', users.updateUsers)
	.delete('/deleteMessage/:id', users.deleteMessage);

module.exports = router;
