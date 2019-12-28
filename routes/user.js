const express = require('express');
const router = express.Router();
const _ = require('lodash');

const User = require('../models/user');



// Register new user
router.post('/new', (req, res) => {
    let newUser;
    User.find({email:req.body.email})
    .then(
        (usr)=>{
            if(usr.length === 0){
                newUser = new User(_.pick(req.body, ['name', 'email', 'password']));
                return User.encryptPassword(newUser.password);
            } else {
                throw new Error("Email ID already exists");
            }
        }
    )
    .then(
        (data)=>{
            newUser.salt = data.salt;
            newUser.password = data.hash;
            return User.generateToken(_.pick(newUser, ['_id', 'name', 'email']));
        }
    )
    .then(
        (token) => {
            newUser.token = token;
            return newUser.save();
        }
    )
    .then(
        (data)=>{
            if(data){
                res.status(200).json({'flag':'success',msg:'User registered successfully'})
            }
        }
    )
    .catch(
        (err)=>{
            res.status(400).json({'flag':'failed',msg:err.message});
    })
});


//Login post
router.post('/login',(req,res)=>{
    const {email, password} = req.body;
    let token;
    User.findOne({email:email})
    .then(
        (user)=>{
            if(!user){
                throw new Error('Email Id not registered')
            } else {
                token = user.token;
                return User.comparePassword(password,user.password)
            }
        }
    )
    .then((result)=>{
        if(!result){
            throw new Error("Wrong password");
        } else {
            res.status(200).json({'flag':'success', msg: token});
        }
    })
    .catch((err)=>{
        res.status(400).json({'flag':'failed',msg:err.message});
    })
})

module.exports = router;