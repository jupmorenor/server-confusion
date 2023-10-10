const express = require('express');
const cors = require('cors');
const app = express();

const whilelist = ['http://localhost:3000', 'https://localhost:3443'];

const corsOptionsDelegate = (request, callback) => {
    var corsOptions;
    if (whilelist.indexOf(request.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
}

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
