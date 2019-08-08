//Tetris App
const express = require('express');
const app = express();
const port = process.env.PORT ||  3000;
const path= require('path');

const morgan = require('morgan');

app.use(express.static('public'));
app.use(morgan('dev'));

app.get('/', function(req, res){
  res.sendFile('index.html')
});

app.listen(port, function(){
  console.log(`Listening on Port: ${port}`)});
