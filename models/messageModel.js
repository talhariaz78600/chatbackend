const mongoose =require("mongoose") ;

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message:{
        type: String,
        required: true,

    }
    //create at updateat
},{timestamps: true})

module.exports = mongoose.model('Conversation', messageSchema);