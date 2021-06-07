"use strict";
var expressRoutes = require('express');
var route = expressRoutes.Router();
var verifyToken1 = require('../../middlewares/verifyToken');
var user = require('../controllers/userController');
var uploadImage = require('../../middlewares/uploader');
route.patch('/updateUser/:id', verifyToken1, uploadImage.single('image'), user.updateUser);
route.get('/getUser/:id', verifyToken1, user.getUser);
route.delete('/deleteUser/:id', verifyToken1, user.deleteUser);
route.get('/getUsers', user.getAllUsers);
module.exports = route;
