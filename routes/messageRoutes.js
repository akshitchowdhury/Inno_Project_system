const express = require('express');
const User = require('../Model/user');
const Project = require('../Model/project');
const Admin = require('../Model/adminEmail');
const router = express.Router();
const Employee = require('../Model/emplEmail');


router.post("/sendMessage", async(req,res)=>{

    try{
        const{sender_email, receiver_username, messages} = req.body;

        const emplMessage = new Employee({
            sender_email,
            receiver_username,
            messages
        })
        
        await emplMessage.save();
        res.status(200).json({message:"Message sent successfully"});
    }catch(error){
        res.status(500).json({message:error.message});
    }
})


// router.post("/sendMessage", async(req,res)=>{

//     try{
//         const{username, message} = req.body;

//         const user = await User.findOne({username});
//         if(!user){
//             return res.status(404).json({message:"User not found"});
//         }

//         user.message = message;
//         await user.save();
//         res.status(200).json({message:"Message sent successfully"});
//     }catch(error){
//         res.status(500).json({message:error.message});
//     }
// })

//employee sending to Admin
router.post('/sendAdmin', async (req, res) => {
    const { sender_email, receiver_username, messages } = req.body;

    // Basic validation
    if (!sender_email || !receiver_username || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const adminEmail = new Admin({
            sender_email,
            receiver_username,
            messages
        });

        await adminEmail.save();

        // Send success response
        return res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);

        // Send error response with appropriate status code and message
        return res.status(500).json({ message: 'Failed to send message' });
    }
});

// router.post('/reply', async(req,res)=>{
//     try {
//         const{sender_email, receiver_username, messages} = req.body;
        
//         const adminEmail = new Employee({
//             sender_email,
//             receiver_username,
//             messages
//         });

//         await adminEmail.save();
//         res.status(200).json({message:"Message sent successfully"});
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// })

router.delete('/:id', async(req,res)=>{

    try{
        
        const delMessage = await Admin.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Message deleted successfully"});
    }
    catch{
        res.status(500).json({message:error.message});
    }
})

router.delete('/:id', async(req,res)=>{
    try {
     
    const deleteEmpMessage  =await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"Message deleted successfully"});   
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.delete('/deleteAll', async (req, res) => {
    try {
        await Admin.deleteMany();
        res.status(200).json({ message: 'All messages deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/getMessages', async (req, res) => {
    try {
        const users = await Admin.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
router.get('/getEmployeeMessages', async (req, res) => {
    try {
        const empMail = await Employee.find();
        res.status(200).json(empMail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
module.exports = router;