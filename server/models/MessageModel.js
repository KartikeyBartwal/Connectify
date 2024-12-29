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

    },
    {
        timestamps: true
    }
);

// Function to mark a message as read
const markMessageAsRead_message_model_js = async (messageId, userId) => {
    const message = await Message.findById(messageId);
    if (!message) {
        throw new Error("Message not found");
    }

    if (!message.readBy.includes(userId)) {
        message.readBy.push(userId);
    }

    await message.save();
    return message;
};

module.exports = { Message, addMessageReaction, deleteMessage, markMessageAsRead_message_model_js };
