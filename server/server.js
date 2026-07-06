const express = require('express');
const app = express();

//database
const db = require("./models");

// routers
app.use(express.json());

app.use("/exercises", require('./routes/Exercises'));
app.use("/plans", require('./routes/Plans'));
app.use("/auth", require('./routes/auth/authRoutes'));

db.sequelize.sync().then(()=> {
    
    app.listen(4000, () => {
        console.log('server is running on port 4000')
    });
});