const User = require('../../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const generateToken = require('../../utils/jwtToken')
// const bcrypt = require('bcrypt')

const signup = async (req, res) => {
  let token;
  const { name, email, password } = req.body;
  

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    const savedUser = await newUser.save();
    const token = generateToken(savedUser._id);
    console.log(token);
    
    res.status(201).json({ message: "User saved successfully",id:savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      isAdmin: savedUser.isAdmin,
      token: token, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Error Occurred" });
  }
};
const login = asyncHandler(async(req,res)=>{
    let token;
      const {email, password} = req.body;
      const user = await User.findOne({email});
   
      
      
      if(user && ( user.password === password))
      {
        const token = generateToken(user._id) ;
        res.json({
          id: user._id,
          name: user.name,
          email: user.email,
          token
        })
      }
      else{
        res.status(401);
        throw new Error("Invalid Email or Password");
      }
})

const checkPasswordStrength = (password) => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongPasswordRegex.test(password);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const generateDummyToken = () => {
  return jwt.sign({ dummy: true }, 'dummy_secret_key', { expiresIn: '1h' });
};

// const dummyRoute = asyncHandler(async (req, res) => {
//   res.json({ message: "This is a dummy route for demonstration." });
// });


module.exports = {signup, login};
