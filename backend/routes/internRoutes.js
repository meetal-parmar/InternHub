const express = require("express");
const routes = express.Router();

const internController = require("../controllers/intern/internController");
const {requireAuth,requireRole} = require('../middleware/requireAuth')
routes.post('/timelog',
    requireAuth,
    requireRole("INTERN"),
    internController.createTimelog
);

routes.get('/timelog', 
    requireAuth, 
    requireRole("INTERN"), 
    internController.getTimelogs
);

routes.put("/timelog/:id", internController.updateTimelog);
routes.delete("/timelog/:id", requireAuth, requireRole("INTERN"), internController.deleteTimelog);
routes.get('/monthlySummary', 
    requireAuth, 
    internController.getMonthlyAnalysis
);

module.exports = routes;