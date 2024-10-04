const express = require('express');
const User = require('../Model/user');
const Project = require('../Model/project');
const router = express.Router();



router.post("/sendMessage", async(req,res)=>{

    try{
        const{username, message} = req.body;

        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        user.message = message;
        await user.save();
        res.status(200).json({message:"Message sent successfully"});
    }catch(error){
        res.status(500).json({message:error.message});
    }
})


module.exports = router;