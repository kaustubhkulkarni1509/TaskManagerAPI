const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

/////////////////////////////T A S K S//////////////////////////////////////////////////////////////////////////////////////


//create task by async method
router.post('/tasks',auth,async(req,res)=>{
    //console.log(req.body)
    //const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        owner:req.user._id
    })

    try{
        await task.save()
        res.status(201)
        res.send(task)
    }catch(error){
        res.status(400).send(error)
    }
})




//get all tasks created by logged in user async method
// /tasks?completed=false
// /tasks?limit=10&skip=10 show 10 after skipping first 10
// /tasks?sortBy=createdAt:asc(desc)
router.get('/tasks', auth,async (req,res)=>{
    try{
        //1st method to populate tasks created by logged in user
        // const owner = req.user._id
        // const task = await Task.find({owner})

        //2nd method to populate tasks created by logged in user
        const match={}
        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }

        const sort={}
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1]==='desc' ? -1 : 1
        }

        await req.user.populate({
            path:'tasks',
            match:match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.status(200).send(req.user.tasks)
    }catch(error){
        res.status(500)
        res.send(error)
    }
    
})


//get task by logged in user by task id async method
router.get('/tasks/:id',auth,async(req,res)=>{
    //console.log('inside get task by id')
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send() 
        }
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }

})

//update task async method

router.patch('/tasks/:id',auth,async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error:'Invalid update fields are given'})
    }

    try{

        const _id = req.params.id
        //below method bypasses middleware...
        //const task = await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})

        //below 5 lines will not bypass the middleware and the code written in (Middleware) 
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        //const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        await task.save()
        res.status(200).send(task)
    }catch(error){
        res.status(400).send(error)
    }

})


//delete task by id created by logged in user async method
router.delete('/tasks/:id',auth,async(req,res)=>{
    
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }
})

module.exports = router