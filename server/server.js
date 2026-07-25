const express = require('express');
const app = express();
app.use(express.json());

//database
const db = require("./models");

//cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// routers
app.use("/exercises", require('./routes/Exercises'));
app.use("/plans", require('./routes/schedules/planRoutes'));
app.use("/schedules", require('./routes/schedules/scheduleRoutes'));
app.use("/auth", require('./routes/auth/authRoutes'));

//error handler
app.use((err, req, res, next) => {
    
    if(err.name === 'SequelizeValidationError') {
        const messages = err.errors.map(e => e.message);

        return res.status(400).json({message: 'Validation error', errors: messages});
    }
    if(err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({message: 'Already exists', field: err.errors[0]?.path });
    }

    console.error(err);
    res.status(500).json({
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    });
})

//running server
db.sequelize.sync().then(()=> {
    
    app.listen(process.env.PORT || 4000, () => {
        console.log('server is running on port', process.env.PORT || 4000)
    });
});