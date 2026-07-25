const express = require('express');
const router = express.Router();
const ScheduleController = require('../../controllers/schedules/scheduleController');
const authenticate = require('../../middleware/auth/authenticate');


router.get('/', authenticate,  ScheduleController.getAll);
router.post('/', authenticate, ScheduleController.create);

module.exports = router;