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




const {chatServer, socketServer} = require("./socketConnection");



const db = require("./models/model.index");
const logger = require("./utils/errorLogging/logger");

const port = 8000;

// init sequlize;

db.sequelize.sync({force:false}); // alter creates duplicates index every time
// async function synchronizeDatabase() {
//   try {
//     await db.sequelize.sync({ force: true });
//     console.log('Database synchronized successfully.');
//   } catch (error) {
//     console.error('Error synchronizing the database:', error);
//   }
// }

// synchronizeDatabase();






app.use(cors({credentials: true, origin: ['http://localhost:3000', 'PostmanRuntime']}));



app.use(cookieParser());

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

app.use('/api/uploads', express.static('uploads'));







//Routes
app.use(express.json())
app.use("/api/customer",customerRouter);
app.use("/api/agent",agentRouter);
app.use("/api/staff",staffRouter);
app.use("/api/admin",superAdminRouter);
app.use("/api/property/house",houseRouter);
app.use("/api/property/land",landRouter)
app.use ("/api/property/apartment",apartmentRouter);
// app.use("/property",propertyRouter);
app.use("/api/property",propertyRouter);
app.use("/api/service",serviceRouter)




//chat running
//chatServer().startServer();
//notification running
// socketServer.chat()
// socketServer.notification();
// socketServer.startServer();








if(process.env.NODE_ENV=='Production'){
  app.listen(()=>{
   logger.info("Server Started")
  });
}else{
  app.listen(port,()=>{
    console.log(` port ${port} is listening.......`)
    logger.info("port is running in 8000: devs")
})

}
