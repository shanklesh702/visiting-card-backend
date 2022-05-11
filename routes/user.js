const express = require('express');
const router =express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth');
router.post('/register',userController.register);
router.post('/login',userController.login);
router.post('/upload-profile',auth,
userController.uploadProfileImage);
router.post('/update-profile',auth,userController.updateProfile);
module.exports =router;