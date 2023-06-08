const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser'); 

const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const HOST = 'localhost';
const PORT = 3000;

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use(express.static(__dirname+'/public'));


// borrar este use para que funcione
app.use((request, response, next) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    response.end('<html><body><h1>Express Server</h1></body></html>')
});

const server = http.createServer(app);

server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`)
});
