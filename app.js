//App Set Up
const express = require('express');
const app = express();
const port = process.env.PORT ||  3000;

const morgan = require('morgan');

app.use(express.static('public'));
app.use(morgan('dev'));

app.get('/', function(req, res){
  res.sendFile('index.html')
});

app.listen(port, console.log(`Listening on Port: ${port}`));
