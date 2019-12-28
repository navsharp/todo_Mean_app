const user = require('../routes/user');
const todo = require('../routes/todoList');

module.exports = function(app){
    app.use('/api/user',user);
    app.use('/api/todo',todo);
}