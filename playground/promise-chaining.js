require('../src/db/mongoose')

const User = require('../src/models/user')
//5e1401ee89db043468d5898b

// User.findByIdAndUpdate('5e1401ee89db043468d5898b',{age:26}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age:26})
// }).then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log(error)
// })


const updateAgeAndCount = async (id,age) => {
    const user = await User.findByIdAndUpdate(id,{age:age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount('5e1401ee89db043468d5898b',26).then((count)=>{
    console.log(count)
}).catch((error)=>{
    console.log(error)
})