
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

//below two lines are used to generate new ids..we can provide id explicitely while inserting document
const ObjectID = mongodb.ObjectID
// const id = new ObjectID()

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log('Unable to connect to database')
    }
    console.log('connected correctly')
    const db = client.db(databaseName)

    //Delete Data

    // db.collection('users').deleteOne({
    //     name:'Samik'
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    db.collection('users').deleteMany({
        age:25
    }).then((result)=>{
        console.log(error)
    }).catch((error)=>{
        console.log(error)
    })
    //update data
    
    // updateOne example using promise
    // const updatePromise = db.collection('users').updateOne({
    //     _id:new ObjectID("5e128754c04c536f448bd775")
    // },{
    //     // $set:{
    //     //     name:'Samik'
    //     // }
    //     $inc:{
    //         age:1
    //     }
    // })
    // updatePromise.then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({completed:false},
    //     {
    //         $set:{
    //             completed:true
    //         }   
    //     }).then((result)=>{
    //         console.log(result)
    //     }).catch((error)=>{
    //         console.log(error)
    //     })

    //update example with call back
    // db.collection('users').updateOne({
    //     _id:new ObjectID("5e128754c04c536f448bd775")
    // },{
    //     $set:{
    //         name:'Samik'
    //     }
    // },(error,result)=>{
    //     if(error){
    //         return console.log(error)
    //     }
    //     console.log(result)
    // })

    //fetch Data
    // to search by id ...we need to use new ObjectID("id from robo 3t") to convert id to binary as ids are stored in binary format and 
    //we see them in string format
    // db.collection('users').findOne({_id:new ObjectID("5e128754c04c536f448bd775")},(error,user)=>{
    //     if(error){
    //         return console.log('Unable to fetch user')
    //     }
    //     console.log(user)
    // })

    // db.collection('users').find({age:25}).toArray((error,users)=>{
    //     if(error){
    //         return console.log('error')
    //     }
    //     console.log(users)
    // })

    // db.collection('tasks').findOne({_id: new ObjectID("5e128868bd791c5d388e2655")},(error,task)=>{
    //     if(error){
    //         return console.log('Unable to fetch task')
    //     }
    //     console.log(task)
    // })

    // db.collection('tasks').find({completed:false}).toArray((error,tasks)=>{
    //     if(error){
    //         return console.log('error')
    //     }
    //     console.log(tasks)
    // })

    //Insert
    // db.collection('users').insertOne({
    //     name:'Kaustubh',
    //     age:25
    // },(error,result)=>{
    //     if(error){
    //         return console.log('Unable to insert user')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name:'Bissu',
    //         age:24
    //     },{
    //         name:'kartik',
    //         age:25
    //     }
    // ],(error,result)=>{
    //     if(error){
    //         return console.log('Unable to insert users')
    //     }
    //     console.log(result.ops)
    //     console.log(result.insertedCount)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description:'Task1',
    //         completed:true
    //     },{
    //         description:'Task2',
    //         completed:true
    //     },{
    //         description:'Task3',
    //         completed:false
    //     }
    // ],(error,result)=>{
    //     if(error){
    //         return console.log('unable to insert tasks')
    //     }
    //     console.log(result.ops)
    //     console.log(result.insertedCount)
    // })



})