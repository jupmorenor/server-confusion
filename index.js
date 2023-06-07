const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser'); 

const HOST = 'localhost';
const PORT = 3000;

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));

app.all('/dishes', (request, response, next) => {
    response.statusCode = 200;
    response.setHeader('ContentType', 'text/plain');
    next();
});

app.get('/dishes', (request, response, next) => {
    response.end('Se enviarán todos los platillos.');
});

app.post('/dishes', (request, response, next) => {
    response.end('Se agregará un nuevo platillo: ' + request.body.name + ' con descripcion: ' + request.body.description);
});

app.put('/dishes', (request, response, next) => {
    response.statusCode = 403;
    response.end('PUT no tiene soporte para los platillos');
});

app.delete('/dishes', (request, response, next) => {
    response.end('Se borrarán todos los platillos.');
});

app.get('/dishes/:dishId', (request, response, next) => {
    response.end('Se enviarán detalles del platillo ' + request.params.dishId);
});

app.post('/dishes/:dishId', (request, response, next) => {
    response.statusCode = 403;
    response.end('POST no tiene soporte para el platillo ' + request.params.dishId);
});

app.put('/dishes/:dishId', (request, response, next) => {
    response.write('Modificando el platillo: ' + request.params.dishId + '\n');
    response.end('Se modificará el platillo: ' + request.body.name + ' con descripcion: ' + request.body.description);
});

app.delete('/dishes/:dishId', (request, response, next) => {
    response.end('Borrando platillo ' + request.params.dishId);
});

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
