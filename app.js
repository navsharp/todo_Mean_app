const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const passport = require('passport');

const app = express();

const port = process.env.PORT || 9000;

app.use(cors());

app.use(bodyparser.json());

app.use(express.static(__dirname + '/dist/todoApp/'));
app.use(passport.initialize());
app.use(passport.session());


require('./config/passport')(passport);
require('./startup/router')(app);
require('./startup/db')();

app.listen(port, ()=>{
    console.log(`Server started at port ${port}`);
})