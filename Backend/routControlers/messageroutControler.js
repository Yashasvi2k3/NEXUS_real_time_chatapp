import Conversation from "../Models/conversationModels.js";
import Message from "../Models/messageSchema.js";
import { getReciverSocketId, io } from "../Socket/socket.js";

// ✅ Send Message Controller
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: reciverId } = req.params;
    const senderId = req.user._id;

    console.log('SendMessage - Request body:', req.body);
    console.log('SendMessage - Receiver ID:', reciverId);
    console.log('SendMessage - Sender ID:', senderId);

    if (!message || !reciverId) {
      return res.status(400).send({
        success: false,
        message: "Message and receiver ID are required"
      });
    }

    // check if conversation exists
    let chats = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] }
    });

    if (!chats) {
      chats = await Conversation.create({
        participants: [senderId, reciverId],
      });
    }

    // create new message
    const newMessage = new Message({
      senderId,
      reciverId,
      message,
      conversationId: chats._id
    });

    chats.messages.push(newMessage._id);

    // save both
    await Promise.all([chats.save(), newMessage.save()]);

    // SOCKET.IO function 
    const reciverSocketId = getReciverSocketId(reciverId);
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).send(newMessage);

  } catch (error) {
    console.log(`error in sendMessage: ${error.message}`);
    console.log(`error stack: ${error.stack}`);
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
};

// ✅ Get Messages Controller
export const getMessages = async (req, res) => {
  try {
    const { id: reciverId } = req.params;
    const senderId = req.user._id;

    console.log('GetMessages - Receiver ID:', reciverId);
    console.log('GetMessages - Sender ID:', senderId);

    const chats = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] }
    }).populate("messages");

    if (!chats) {
      console.log('No conversation found');
      return res.status(200).send([]);
    }

    console.log('Found messages:', chats.messages.length);
    console.log('Messages data:', chats.messages);

    res.status(200).send(chats.messages);

  } catch (error) {
    console.log(`error in getMessage: ${error.message}`);
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
};
