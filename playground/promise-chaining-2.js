require('../src/db/mongoose')

const Task = require('../src/models/task')

// Task.findByIdAndDelete('5e13db5a2894bd2dd834dedc').then((task)=>{
//     console.log(task)
//     return Task.find({})
// }).then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log(error)
// })

const deleteTastAndCount = async (id, completed) =>{ 

    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed:completed})
    return count
}

deleteTastAndCount('5e13e41a4fc22352d42b785f',false).then((count)=>{
    console.log(count)
}).catch((error)=>{
    console.log(error)
})
