const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const authenticate = require('../authenticate');
const cors = require('./cors');

const storage = multer.diskStorage({
    destination: (request, file, next) => {
        next(null, 'public/images');
    },
    filename: (request, file, next) => {
        next(null, file.originalname);
    },
});

const imageFileFilter = (request, file, next) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return next(new Error('You can upload only image files'), false);
    }
    next(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter
});

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/').all((request, response, next) => {
    response.statusCode = 200;
    response.setHeader('ContentType', 'application/json');
    next();
}).options(cors.corsWithOptions, (req, res) => { 
    res.sendStatus(200)
}).get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (request, response, next) => {
    response.statusCode = 403;
    response.end('GET no tiene soporte para /imageUpload');
}).post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (request, response) => {
    response.json(request.file);
}).put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (request, response, next) => {
    response.statusCode = 403;
    response.end('PUT no tiene soporte para /imageUpload');
}).delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (request, response, next) => {
    response.statusCode = 403;
    response.end('DELETE no tiene soporte para /imageUpload');
})


module.exports = uploadRouter;
