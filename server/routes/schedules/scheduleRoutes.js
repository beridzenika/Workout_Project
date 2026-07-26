const express = require('express');
const router = express.Router();
const ScheduleController = require('../../controllers/schedules/scheduleController');
const authenticate = require('../../middleware/auth/authenticate');


router.get('/', ScheduleController.getAll);
router.get('/:id', ScheduleController.getById);
router.get('/:id/day/:day', ScheduleController.getByDay);

router.post('/', authenticate, ScheduleController.create);

module.exports = router;