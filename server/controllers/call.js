const AsyncHandler = require('express-async-handler');
const Call = require('../models/callSchema');

const updateCallHistory = AsyncHandler(async(roomId, participants, duration)=>{
    try {
        
        const callHistory = new Call({roomId, participants, duration});
        await callHistory.save();
    } catch (error) {
        console.error('Error saving call history:', error);
    }
})
const updateCallStatus =AsyncHandler( async (roomId, status, user) => {
    try {
      await Call.updateOne(
        { roomId, participants: user.id },
        { $set: { callStatus: status } }
      );
    } catch (error) {
      console.error('Error updating call status:', error);
    }
});
const getCallHistory =AsyncHandler (async (req, res) => {
    const { roomId } = req.params;
  
    try {
      const callHistory = await Call.find({ roomId });
      res.status(200).json(callHistory);
    } catch (error) {
      console.error('Error fetching call history:', error);
      res.status(500).send('Error fetching call history');
    }
});

const calculateAverageCallDuration = async () => {
  const calls = await Call.aggregate([{ $group: { _id: null, avgDuration: { $avg: "$duration" } } }]);
  return calls[0]?.avgDuration || 0;
};

const getCallsByParticipant = async (userId) => {
  return await Call.find({ participants: userId });
};

const generateDummyCall = () => {
  return {
    roomId: `room-${Math.random().toString(36).substring(7)}`,
    participants: [`user${Math.floor(Math.random() * 100)}`],
    duration: Math.floor(Math.random() * 120),
    callStatus: "completed",
  };
};



module.exports = {updateCallHistory, updateCallStatus, getCallHistory};
