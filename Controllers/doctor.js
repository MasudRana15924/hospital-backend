const doctorModel=require('../models/Doctors')

exports.createDoctor = async (req, res) => {
    const { name, email, password } = req.body;
    const newDoctor = await doctorModel.create({
        name,
        email,
        password,
    });
    res.status(201).json({success:true,newDoctor})
};
exports.getAllDoctors = async (req, res) => {
   const Doctors=await doctorModel.find();
   res.status(200).json({success:true,Doctors})
   
};