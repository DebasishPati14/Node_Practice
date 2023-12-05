const express = require('express');
const route = express.Router();
const errorController = require('./../controllers/error.controller');

route.get('/500', errorController.get500);

route.get('***', errorController.get404);

module.exports = route;
