const express = require('express');
const routes = express.Router();

const mentorController = require('../controllers/mentorController');
const {requireAuth,requireRole} = require('../middleware/requireAuth')
routes.post('/create-intern',
    requireAuth,
    requireRole("MENTOR"),
    mentorController.createIntern
);

module.exports = routes;


