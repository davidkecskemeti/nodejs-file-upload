const express = require('express')
const fileUpload = require("express-fileupload")
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const _ = require('lodash')

const app = express()

//Add libs
app.use(fileUpload({//enable file upload
    createParentPath: true,
    limits: {
        filesSize: 2 * 1024 * 1024 * 1024//2MB max file size
    }
}))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(morgan('dev'))

app.get('/hello',async (req,res)=>{
    res.send({
        status:true,
        message:'Hello'
    })
})

//Defining the paths and its functionality
app.post('/upload-avatar', async (req, res) => {
    try {
        if (req.files) {
            let avatar = req.files.avatar
            avatar.mv('./uploads/' + avatar.name)

            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            })
        } else {
            res.send({
                status: false,
                message: 'No file uploaded'
            })
        }
    } catch (err) {
        res.status(500).send(err);
    }
})

// upload multiple files
app.post('/upload-photos', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            })
        } else {
            let data = [];

            //loop all files
            _.forEach(_.keysIn(req.files.photos), (key) => {
                let photo = req.files.photos[key];

                //move photo to upload directory
                photo.mv('./uploads/' + photo.name);

                //push file details
                data.push({
                    name: photo.name,
                    mimetype: photo.mimetype,
                    size: photo.size
                })
            })

            //return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            })
        }
    } catch (err) {
        res.status(500).send(err)
    }
})


//Start app
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App is running on port ${port}.`))


