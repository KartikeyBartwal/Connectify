const mongoose = require('mongoose')
 
const statusSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    media : [
        {
            url: {
                type: String,
                required: true
            },
            type: {
                type: String, 
                enum: ['image, video'],
                required: tru
            },
            caption:{type: String}
        }
    ],
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => Date.now() + 24 * 60 * 60 * 1000 },
    viewedBy: [
      {
        viewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        viewedAt: { type: Date, default: Date.now }
      }
    ],
    isSeen: { type: Boolean, default: false }
});
module.exports = mongoose.model('Status', statusSchema);