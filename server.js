const express = require("express");
const buyerRouter = require('./routes/buyer')
const app  = express();
const cors = require("cors")
const bodyParser = require('body-parser')
const {connectMysql}  = require("./connection")


const port = 8000;
// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded
app.use(cors({credentials:true,origin:"*"}));
//Routes
app.use(express.json())
app.use("/buyer",buyerRouter);

connectMysql();


app.listen(port,()=>{
    console.log(` port ${port} is listening.......`)
})