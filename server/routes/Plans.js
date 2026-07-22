// const express = require('express');
// const router = express.Router();

// const { Plans, Exercises } = require("../models");

// // GET
// router.get('/', async (req, res) => {
//     try {
//         const plans = await Plans.findAll({
//             include: [
//                 {
//                     model: Exercises,
//                     through: {
//                         attributes: [
//                             "order_index",
//                             "rest",
//                         ],
//                     }
//                 }
//             ],
//         });

//         res.status(200).json(plans);
//     }
//     catch(err) {
//         res.status(500).json(err);
//     }
// });

// // POST

// //plan
// router.post('/', async (req, res) => {
//     try {
//         const {
//             schedule_id,
//             name,
//             plan_type,
//         } = req.body;
        
//         const plan = await Plans.create({
//             schedule_id,
//             name,
//             plan_type,
//         });

//         // if (exercises && exercises.length > 0){

//         //     const plan = await Plans.create({
//         //         schedule_id,
//         //         name,
//         //         plan_type,
//         //     });

//         //     const exerciseInstances = await Promise.all(
//         //         exercises.map(async (ex) => {
//         //             const exercise = await PlanExercises.create({
//         //                 plan_id: ex.plan_id,
//         //                 order_index: ex.order_index,
//         //                 exercise_id: ex.exercise_id,
//         //                 rest: ex.rest,
//         //             });
//         //             return exercise;
//         //         })
//         //     );
//         //     await plan.addPlanExercises(exerciseInstances);
//         // }

//         // const result = await Plans.findByPk(plan.id, {
//         //     include: {
//         //         model: PlanExercises,
//         //     }
//         // })
        
//         res.status(200).json(plan);
//     }
//     catch(err) {
//         res.status(500).json(err);
//     }
// });

// //plan exercise
// router.post('/exercise/', async (req, res) => {
//     try {
//         const {
//             plan_id,
//             order_index,
//             exercise_id,
//             rest,
//         } = req.body;
        
//         const planExercise = await PlanExercises.create({
//             plan_id,
//             order_index,
//             exercise_id,
//             rest,
//         });
        
//         res.status(200).json(planExercise);
//     }
//     catch(err) {
//         res.status(500).json(err);
//     }
// });

// module.exports = router;