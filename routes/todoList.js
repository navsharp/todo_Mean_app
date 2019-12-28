const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authentication');
const ToDoList = require('../models/todolist');


router.get('/getTodo/:todoId',auth,(req,res)=>{
    ToDoList.findById(req.params.todoId)
        .then(
            (result)=>{
                res.status(200).json({flag:true,msg:result});
            }
        )
        .catch(
            (err)=>{
                res.status(400).json({flag:false,msg:err.message});
            }
        )
})

router.put('/edit/:todoId',auth,(req,res)=>{
    ToDoList.findByIdAndUpdate(req.params.todoId,{ $set: {name: req.body.name, description: req.body.description}})
    .then((data)=>{
        if(data){
            res.status(200).json({flag:'success',msg:'Successfully updated'})
        } else {
            res.status(400).json({flag:'failed',msg:"Error in Updating"})
        }
    })
    .catch((err)=>{
        res.status(400).send({flag:'failed',msg:err.message});
    });
})

router.post('/create',auth,(req,res)=>{
    let todolist = new ToDoList(req.body);
    todolist.createdby = req.user._id;
    todolist.save()
    .then((data)=>{
        if(!data){
            throw new Error("Data cannot be saved")
        } 
        res.status(200).json({flag: 'success',msg:'Data created successfully'})
    })
    .catch((err)=>{
        res.status(400).json({flag:'failed',msg:err.message});
    });
})

router.get('/all',auth,(req,res)=>{
    let page = req.query.page;
    let limit = 10;
    let todoCount = ToDoList.countDocuments({createdby:req.user._id});
    let findToDo = ToDoList.find({createdby:req.user._id})
    .skip(page * limit)
    .limit(limit)
    
    return Promise.all([todoCount, findToDo])
    .then((data)=>{
        let totalCount = data[0];
        let nextPage = false;
        if (totalCount > ((page + 1) * 10)) {
            nextPage = true;
        }
        if(data[1].length === 0){
            throw new Error("Data not available")
        } 
        res.status(200).json({flag: 'success',msg:data[1],next:nextPage})
    })
    .catch((err)=>{
        res.status(400).json({flag:'failed',msg:err.message});
    });
})

router.delete('/remove/:todoId',auth,(req,res)=>{
    ToDoList.findByIdAndDelete(req.params.todoId)
        .then((data)=>{
            if(!data){
                throw new Error("Not able to delete");
            }
            res.status(200).json({flag:'success',msg:data});
        })
        .catch((err)=>{
            res.status(400).json({flag:'failed',msg:err.message})
        })
})

module.exports = router;