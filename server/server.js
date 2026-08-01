const app = require('./app');
const db = require("./models");


//running server
db.sequelize.sync().then(()=> {
    
    app.listen(process.env.PORT || 4000, () => {
        console.log('server is running on port', process.env.PORT || 4000)
    });
});