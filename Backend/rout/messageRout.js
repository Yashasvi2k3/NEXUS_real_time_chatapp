import express from "express";
import { getMessages, sendMessage } from "../routControlers/messageroutControler.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();

// send a message to user by id
router.post("/send/:id", isLogin, sendMessage);

// get all messages with a user
router.get("/:id", isLogin, getMessages);

export default router;
