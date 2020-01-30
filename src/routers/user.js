const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail } = require('../emails/account')
const router = new express.Router()


// /users is one endpoint 


//create user with async functionality
router.post('/users', async (req, res) => {
    const user = await new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }

})

//Login method
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        //one method to make sure only public data is sent to user after login
        //res.send({user:user.getPublicProfile(),token:token})
        res.send({ user: user, token: token })

    } catch (error) {
        res.status(400).send(error)
    }
})


//get all users async method
// /users is path of api, auth is middleware function to run and async function consists of actual operations of api(route handler)
router.get('/users', auth, async (req, res) => {

    try {
        const users = await User.find({})
        res.status(200)
        res.send(users)
    } catch (e) {
        req.status(500).send(error)
    }

})

//get logged in user
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


//logout of current session
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

//logout from all sessions
router.post('/users/logoutALL', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.send(500).send()
    }
})


//get single user by id async method
//the below method is just an example on how to get user by id
router.get('/users/:id', async (req, res) => {
    console.log(req.params)
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }

})

//update user async method
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update fields are given' })
    }

    try {
        const _id = req.user._id

        //below method bypasses middleware...
        //const user = await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})

        //below 5 lines will not bypass the middleware and the code written in (Middleware) 
        const user = await User.findById(_id)
        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save()

        if (!user) {
            return res.status(404).send()
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

//delete user who is logged in async method
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }

        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

//upload images

const upload = multer({
    //if following line is commented then the multer does not store data on file system.
    //dest:'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a image'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //req.file contains the file

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


//delete avatar image
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})


//fetch avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router