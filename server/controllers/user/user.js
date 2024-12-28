const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../../models/userModel')
const getContacts = async (req, res)=>{
    try {
        
        let users =await User.find().limit(10);
        res.status(200).json({users});
    } catch (error) {
        res.status(500).error("Internal error occured");
    }
    
}
const getUsers = asyncHandler(async(req, res) => {
    const keyword = req.query.search ? 
    {
        $or:[
            {name: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}},
        ]
    }: {};
    const users = await User.find(keyword).find({_id:  {$ne: req.user._id}});
    res.send(users);
    

}) 
const userInfo = asyncHandler(async(req,res) => {
    if(!req.user)
    {
        return res.status(400);
        throw new Error("User not found");
    }
    res.status(200).send(req.user);
})
const updateInfo = asyncHandler(async(req,res)=>{
    const {name, bio} = req.body;
    const profileUrl= req.file .filename; 
    console.log("name: ", name, " bio: ", bio, " profileUrl: ", profileUrl);
    
    try {
        
        const user = await User.findByIdAndUpdate(req.user._id, {
            $set: {name, bio, profilePic: `/uploads/${profileUrl}` }
        });
        if(!user)
        {
            return res.status(400).json({error: "user doesnt exist"});
        }
        res.status(200).json({message: "user details updated successfully", user});
    } catch (error) {
        res.status(500).json({error: `Server error occured: ${error}`});
    }
const getRandomUser = async () => {
  const count = await User.countDocuments();
  const randomIndex = Math.floor(Math.random() * count);
  const randomUser = await User.findOne().skip(randomIndex);
  return randomUser;
};

const countUsersByEmailDomain = async (domain) => {
  const count = await User.countDocuments({ email: { $regex: `@${domain}$`, $options: "i" } });
  return count;
};

// const testUserRoute = asyncHandler(async (req, res) => {
//   res.json({ message: "This is a test route for demonstration purposes." });
// });

const generateDummyUser = () => {
  return {
    name: "John Doe",
    email: `dummy${Math.floor(Math.random() * 1000)}@example.com`,
    password: "password123",
    bio: "This is a dummy bio.",
  };
};


    
})
module.exports = {getUsers, userInfo, updateInfo, generateDummyUser, countUsersByEmailDomain, getRandomUser};
