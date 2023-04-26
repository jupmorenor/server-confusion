const express = require('express');
const http = require('http');
const morgan = require('morgan');

const HOST = 'localhost';
const PORT = 3000;

const app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname+'/public'));

app.use((request, response, next) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    response.end('<html><body><h1>Express Server</h1></body></html>')
});

const server = http.createServer(app);

server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`)
});
