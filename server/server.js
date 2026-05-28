const express = require('express');
const app = express();

const db = require("./models");

// routers
const ExerciseRouter = require('./routes/Exercises');
app.use("/Exercises", ExerciseRouter);

db.sequelize.sync().then(()=> {
    app.listen(4000, () => {
        console.log('server is running on port 4000')
    });
});