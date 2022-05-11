const express = require('express');
const router =express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/upload');
router.post('/register',userController.register);
router.post('/login',userController.login);
router.post('/upload-profile',upload.single('image'),
userController.uploadProfileImage);
module.exports =router;