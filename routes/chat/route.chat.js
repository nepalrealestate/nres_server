

const express = require("express");
const { handleChatConnection } = require("../../controllers/chat/controller.chat");

const router = express.Router();




router.post("/connection",handleChatConnection)