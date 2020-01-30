const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(validator.contains(value,'password')){
                throw new Error('Password should not contain word password')
            }
        }
    },email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be positive number')
            }
        }
    },tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

//relationship between two entities
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

//find valid login
userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email:email})
    if(!user){
        const error = new Error()
        error.message='Unable to login...No user with email is present'
        error.description='Not Valid Login'
        throw error
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        const error = new Error()
        error.message='User id and password does not match'
        error.description='Not Valid Login'
        throw error
        
    }
    return user
}
//generate public profile 1st method(manual)
// userSchema.methods.getPublicProfile = function(){
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens

//     return userObject

// }

//simple method to generate public profile
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject

}



//generate jwt token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id:user.id.toString()},process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token:token})
    await user.save()
    return token

}

//(Middleware)pre block to execute code before saving (hash plain text password before saving)
userSchema.pre('save',async function(next){
    const user = this
    //console.log('just before save!')

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()//this signifies the code execution is over which is supposed to execute before saving event
})

//Delete user tasks when user is removed
userSchema.pre('remove',async function (next){
    const user = this

    await Task.deleteMany({owner:user._id})

    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User