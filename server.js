const express = require("express");
const buyerRouter = require('./routes/users/route.buyer')
const agentRouter = require("./routes/users/route.agent")
const rentalRouter = require("./routes/users/route.rental");
const sellerRouter = require("./routes/users/route.seller");
const staffRouter = require("./routes/users/route.staff");
const superAdminRouter = require("./routes/users/route.superAdmin")
const houseRouter = require("./routes/property/route.house");
const landRouter = require("./routes/property/route.land");
const apartmentRouter = require("./routes/property/route.apartment");
const propertyRouter = require("./routes/property/route.property");
const app  = express();
const cors = require("cors")
const bodyParser = require('body-parser')
const {connectMysql}  = require("./connection")
const cookieParser = require('cookie-parser');
const {excuteSQLFile}  = require("./connection");

const port = 8000;
app.use(cookieParser());

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded
app.use(cors({credentials:true,origin:"*"}));

// excute all sql file for create db , schema and tables;
excuteSQLFile();


// Error handling middleware for Multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during file upload
      res.status(400).json({ error: 'Multer Error: ' + err.message });
    } else {
      // Handle other errors
      next(err);
    }
  });

//Routes
app.use(express.json())
app.use("/buyer",buyerRouter);
app.use("/agent",agentRouter);
app.use("/rental",rentalRouter);
app.use("/seller",sellerRouter);
app.use("/staff",staffRouter);
app.use("/superAdmin",superAdminRouter);
app.use("/house",houseRouter);
app.use("/land",landRouter)
app.use ("/apartment",apartmentRouter);
app.use("/property",propertyRouter);

<<<<<<< HEAD
=======




>>>>>>> 729af75cee4ba65a727d5f26144ee0cee5cfcdee
//connectMysql();
app.listen(port,()=>{
    console.log(` port ${port} is listening.......`)
})