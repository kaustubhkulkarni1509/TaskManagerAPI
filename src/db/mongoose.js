const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,//this is uesed just to avoid deprecation error,
    useUnifiedTopology: true
})



