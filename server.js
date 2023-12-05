const express = require("express");
const customerRouter = require("./routes/users/route.customer");
const agentRouter = require("./routes/users/route.agent");
const staffRouter = require("./routes/users/route.staff");
const superAdminRouter = require("./routes/users/route.superAdmin");
const houseRouter = require("./routes/property/route.house");
const landRouter = require("./routes/property/route.land");
const apartmentRouter = require("./routes/property/route.apartment");
const propertyRouter = require("./routes/property/route.property");
const serviceRouter = require("./routes/services/route.service");
const blogRouter = require("./routes/blogs/route.blog");
const contactRouter = require("./routes/contact/route.contact");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const socketServer = require("./socketConnection");
const db = require("./models/model.index");
const logger = require("./utils/errorLogging/logger");
const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const chatServer = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const port = 8000;

// Allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  

}));
// This is not necessary unless you have specific options for the OPTIONS preflight request
app.options('*', cors());


// init sequlize;
db.sequelize.sync({ force: false }); // alter creates duplicates index every time

//app.use("/api/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/api/uploads", express.static("uploads"));

app.use(express.json());



app.use(cookieParser());

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

//Routes

app.use("/api/customer", customerRouter);
app.use("/api/agent", agentRouter);
app.use("/api/staff", staffRouter);
app.use("/api/admin", superAdminRouter);
app.use("/api/property/house", houseRouter);
app.use("/api/property/land", landRouter);
app.use("/api/property/apartment", apartmentRouter);
// app.use("/property",propertyRouter);
app.use("/api/property", propertyRouter);
app.use("/api/service", serviceRouter);
app.use("/api/blog", blogRouter);
app.use("/api/contact", contactRouter);

//chat running

socketServer.chat(chatServer);

console.log("Logging levels:", logger.levels);
console.log("Logging level configured:", logger.level);

if (process.env.NODE_ENV == "Production") {
  server.listen(() => {
    console.log("Server Started");
    logger.info("NRES Server Started");
  });
} else {
  server.listen(port, () => {
    console.log(` port ${port} is listening.......`);
    logger.info("port is running in 8000: devs");
  });
}
