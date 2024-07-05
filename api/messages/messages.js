const express = require('express');
const router = express.Router();
const Conversation = require("../../models/conversationModel")
const Message =require("../../models/messageModel")
const {getReceiverSocketId,io}=require("../../socket/socket")

router.post('/sendmessage/:receiverId',async(req,res)=>{
    try {
        const { message } = req.body;
        const { receiverId } = req.params;
        const senderId = req.body.senderid;
        console.log(senderId,message,receiverId )
        let conversation = await Conversation.findOne({
          participants: {
            $all: [senderId, receiverId],
          },
        });
    
        if (!conversation) {
          conversation = await Conversation.create({
            participants: [senderId, receiverId],
          });
        }
    
        const newMessage = new Message({
          senderId: senderId,
          receiverId: receiverId,
          message: message,
        });
    
        if (newMessage) {
          conversation.messages.push(newMessage._id);
        }
        await Promise.all([conversation.save(), newMessage.save()]);
        console.log(receiverId)
        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log("soketid",senderId);
        console.log(newMessage);
        if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
      } catch (error) {
        console.log("Error in sendMesage : ", error);
        res.status(500).json({ error: " internal server error" });
      } 
})

router.get('/getmessages/:userToChatId',async (req,res)=>{
    try {
        const { userToChatId } = req.params;
        const senderId = req.query.senderId
        console.log(senderId,userToChatId);
        const conversation = await Conversation.findOne({
          participants: { $all: [senderId, userToChatId] },
        }).populate("messages");
    
        if (!conversation) {
          return res.status(200).json([]);
        }
        const messages = conversation.messages;
    
        res.status(200).json(messages);
      } catch (error) {
        console.log("Error in sendMesage : ", error.message);
        res.status(500).json({ error: " internal server error" });
      }
})

module.exports = router;