const express = require('express')
require('./db/mongoose') //file containing database connection details
const User = require('./models/user')
const Task = require('./models/task')

//import routers
const userRouter = require('../src/routers/user')
const taskRouter = require('../src/routers/task')

const app = express()

const port = process.env.port




app.use(express.json()) //this automatically pars incoming json to object
//use the routers defined
app.use(userRouter)
app.use(taskRouter)


//app is listning on port defined above
app.listen(port,()=>{
    console.log('server is up on port '+port)
})

//without express middleware =>  new request -> route handler
//with using express middleware => new request -> do something -> route handler 

//middlewares
// app.use((req,res,next)=>{
//     console.log(req.method,req.path)
//     //call next() to actually call the route handler
//     next()
// })

//middleware for site under maintaince
// app.use((req,res,next)=>{
//     res.status(503).send('Site is under maintaince. Please visit after some time')
// })



//how to use bcrypt
//const bcrypt = require('bcryptjs')
// const myFunction = async () =>{
//     const password = 'Red12345!'
//     const hashedPass = await bcrypt.hash(password,8)
//     console.log(password)
//     console.log(hashedPass)
//     const isMatch = await bcrypt.compare('Red12345',hashedPass)
//     console.log(isMatch)
// }

//how to use json web tokens
// const jwt = require('jsonwebtoken')
// const myFunction = async()=>{
//     const token = jwt.sign({_id:'abc123'},'thisismynewcourse',{expiresIn:'2 seconds'})
//     //token is long series of characters seperated in three parts by character .
//     //first part is header..contains info like type of token, algorithm used to generate the token
//     //second part is body contains data provided
//     //third part is signature used to verify
//     //console.log(token)

//     const data = jwt.verify(token,'thisismynewcourse')
//     //console.log(data)
// }
// myFunction()

//const Task = require('../src/models/task')

// const main = async()=>{
//     // const task = await Task.findById('5e1e6fe61e4d505cecec17d4')
//     // await task.populate('owner').execPopulate()
//     // console.log(task)

//     const user = await User.findById('5e1e6fd91e4d505cecec17d2')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()

//how to use multer
// const multer = require('multer')
// const upload = multer({
//     dest:'images',
//     limits:{
//         fileSize:1000000
//     },
//     fileFilter(req,file,cb){
//         // cb(new Error('File must be PDF'))
//         // cb(undefined,true)
//         // cb(undefined,false)
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('Please upload a word doc'))
//         }
//         cb(undefined,true)
//     }
// })

// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send()
// },(error,req,res,next)=>{
//     res.status(400).send({error:error.message})
// })