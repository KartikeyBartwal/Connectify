const mongoose = require('mongoose');

const messageModel = mongoose.Schema(
    {
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        content:{
            type: String,
            trim: true,
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        },
        media: {  
            type: String, 
            default: null
        },
        mediaType: { 
            type: String, 
            enum: ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4', 'audio/mp3'],
            default: null
        },
        readStatus: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);
const Message = mongoose.model('Message', messageModel);
module.exports = Message;
