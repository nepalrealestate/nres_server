const express = require("express");
const customerRouter = require("./routes/users/route.customer")
const agentRouter = require("./routes/users/route.agent")
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


const cookieParser = require('cookie-parser');


const {logger} = require("./utils/errorLogging/logging")



const {chatServer, socketServer} = require("./socketConnection");



const db = require("./models/model.index");

const port = 8000;

// init sequlize;

db.sequelize.sync({force:false});







app.use(cors({credentials: true, origin: 'http://localhost:3000'}));


app.use(cookieParser());

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

app.use('/uploads', express.static('uploads'));







//Routes
app.use(express.json())
app.use("/customer",customerRouter);
app.use("/agent",agentRouter);
app.use("/staff",staffRouter);
app.use("/superAdmin",superAdminRouter);
app.use("/house",houseRouter);
app.use("/land",landRouter)
app.use ("/apartment",apartmentRouter);
// app.use("/property",propertyRouter);
app.use("/property",propertyRouter);
app.use("/service",serviceRouter)




//chat running
//chatServer().startServer();
//notification running
socketServer.chat()
socketServer.notification();
socketServer.startServer();








if(process.env.NODE_ENV=='production'){
  app.listen();
}else{
  app.listen(port,()=>{
    console.log(` port ${port} is listening.......`)
    logger.info("port is running in 8000: devs")
})

}
