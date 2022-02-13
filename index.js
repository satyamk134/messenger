const express = require('express')
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
require('dotenv').config();
const port = 4004;
const hostname = 'localhost';
const controllers = require('./controllers');
app.get('/', function (req, res) {
  res.send('Hello World');
})

app.post('/send', controllers.sendToQueue);
app.post('/receive', controllers.consumeFromQueue);

app.post('/push-order', controllers.sendToQueue);
app.post('/receive-order', controllers.consumeFromQueue);

app.get('/getWishmasters',controllers.getConsumers);
app.post('/createOrder',controllers.createOrder);

app.post('/ack',controllers.ack);
app.post('/ackmsg',controllers.ackMsg);




//listen for request on port 3000, and as a callback function have the port listened on logged
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
