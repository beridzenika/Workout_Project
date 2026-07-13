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
app.use("/plans", require('./routes/Plans'));
app.use("/auth", require('./routes/auth/authRoutes'));

db.sequelize.sync().then(()=> {
    
    app.listen(4000, () => {
        console.log('server is running on port 4000')
    });
});