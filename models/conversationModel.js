const mongoose=require("mongoose")
const conversationSchema = new mongoose.Schema({
    participants:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
        ],
        messages:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Conversation',
                default:[],
            }
        ],
        requeststatus:{
            type:Boolean,
            default:false
        }


},{timestamps: true})
module.exports = mongoose.model('Conversation1', conversationSchema);