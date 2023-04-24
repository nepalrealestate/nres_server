const express = require("express");
const buyerRouter = require('./routes/users/buyer')
const agentRouter = require("./routes/users/agent")
const rentalRouter = require("./routes/users/rental");
const sellerRouter = require("./routes/users/seller");
const staffRouter = require("./routes/users/staff");
const superAdminRouter = require("./routes/users/superAdmin")
const houseRouter = require("./routes/property/routes.house");
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
app.use("/agent",agentRouter);
app.use("/rental",rentalRouter);
app.use("/seller",sellerRouter);
app.use("/staff",staffRouter);
app.use("/superAdmin",superAdminRouter);
app.use("/house",houseRouter);

//connectMysql();


app.listen(port,()=>{
    console.log(` port ${port} is listening.......`)
})