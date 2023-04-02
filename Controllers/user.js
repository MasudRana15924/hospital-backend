const userModel = require('../models/User')

exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const newUser = await userModel.userCreate({
        name,
        email,
        password,
    });
    if(newUser){
        res.status(201).json({success:true,newUser})
    } 
};
exports.getAllUsers = async (req, res) => {
   const users=await userModel.find();
   res.status(200).json({success:true,users})
   
};
