const express = require('express')
const app = express();
var bodyParser = require('body-parser');
const http = require('http');
app.use(bodyParser.json());
require('./config/index')();

const hostname = 'localhost';
const msgApp = require('./routes.js');
app.get('/', function (req, res) {
  res.send('Hello World');
});

app.use('/api/message', msgApp);



app.use(function(req,res){
  res.status(404).json({msg:'Resource Not Found'});
});

const port = 4004;
http.createServer(app).listen(port,()=>{
    console.log(`Cart is listening at ${port}`);
});

//listen for request on port 3000, and as a callback function have the port listened on logged
// app.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
