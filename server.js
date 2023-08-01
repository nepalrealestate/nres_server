const express = require("express");
const customerRouter = require("./routes/users/route.customer")
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
const serviceRouter = require("./routes/services/route.service")
const app  = express();
const cors = require("cors")
const bodyParser = require('body-parser')
const {connectMysql}  = require("./connection")
const cookieParser = require('cookie-parser');
const {excuteSQLFile}  = require("./connection");
const {logger} = require("./utils/errorLogging/logging")

const {ChatServer, chatServer} = require("./chat/chatConnection");
const { checkProperties } = require("./controllers/requiredObjectProperties");

const port = 8000;

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));


app.use(cookieParser());

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

app.use('/uploads', express.static('uploads'));

// excute all sql file for create db , schema and tables;
//excuteSQLFile();

function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError ) {
    // Handle Multer error
    console.log('Multer error:', err);
    return res.status(400).json({ error: 'Multer error occurred' });
  } else if (err) {
    // Handle other errors
    console.log('Other error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
  next();
}

app.use(handleMulterError);


//Routes
app.use(express.json())
app.use("/customer",customerRouter);
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
app.use("/service",serviceRouter)




// chat running
chatServer().startServer();



if(process.env.NODE_ENV=='production'){
  app.listen();
}else{
  app.listen(port,()=>{
    console.log(` port ${port} is listening.......`)
    logger.info("port is running in 8000: devs")
})
}