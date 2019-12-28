const mongoose = require('mongoose');

const ToDOSchema = mongoose.Schema({
    name:{
        type:String,
        require: true
    },
    description:{
        type:String,
        require: true
    },
    createdby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('ToDOList', ToDOSchema);