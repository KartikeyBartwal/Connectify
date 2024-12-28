const Message = require('../models/MessageModel');
// router.post('/', sendMessage);
// router.get('/:chatId', allMessages);
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const asyncHandler = require('express-async-handler');

const sendMessage = asyncHandler(async(req,res) =>{
    const {content, chatId,  mediaType} = req.body;
    if((!content || !chatId) && (!req.file || !mediaType))
    {
        console.log("Invalid data passed into request");
        return res.status(400).json({error: "Invalid data passed into request"});
    }
    try {
        const newMessage = {
            sender: req.user._id,
            content: content || "",
            chat : chatId,

        };
        if(req.file)
        {
            console.log(mediaType);
            
            newMessage.media = `/uploads/${req.file.filename}`;
            newMessage.mediaType = mediaType;
        }
        const message = await Message.create(newMessage);
        const populatedMessage = await Message.findById(message._id)
        .populate("sender", "-password")
        .populate({
            path: "chat",
            populate: {
            path: "users",
            select: "-password",
            },
        })
        const messageObj = await User.populate(populatedMessage, {
            path: 'chat.users',
            select:  'name profilePic email'
        })
        await Chat.findByIdAndUpdate(req.body.chatId, 
            {
                latestMessage: messageObj
            }
        )
        res.status(200).send(messageObj)
        
    } catch (error) {
        
        res.status(500).json({error:`Server error occured. ${error.message}`});
    }
    
}) 
const allMessages = asyncHandler(async(req,res)=>{
    try {
        const messages = await Message.find({chat: req.params.chatId}).populate("sender","-password").populate("chat");
        res.status(200).send(messages);        
    } catch (error) {
        res.status(500).json({error: "Server error occured."});
    }
})

const validateFields = (fields, res) => {
    for (const field in fields) {
        if (!fields[field]) {
            res.status(400).json({ error: `${field} is required` });
            return false;
        }
    }
    return true;
};


module.exports = {sendMessage, allMessages, validateFiels}
