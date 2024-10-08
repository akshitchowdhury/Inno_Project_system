const express = require('express');
const User = require('../Model/user');
const Project = require('../Model/project');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = "helloInno@123";
// GET all users and their projects
router.get('/', async (req, res) => {
    try {
        const users = await User.find().populate('projectIds');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('projectIds');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Create a user and assign a project
router.post('/addUsers', async (req, res) => {
    const { username, email, password, department } = req.body;

    try {
        const newUser = new User({ username, email, password, department });
        await newUser.save();
        res.status(201).json({ user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// router.put('/login', async (req, res) => {
//     const { email } = req.body;
//     try {
//         // Find the user by email
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Update the user details
        
//         user.isLoggedIn = true;

//         // Save the updated user to the database
//         await user.save();

//         res.status(200).json({ user });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });



router.put('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if(!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '10h' });

        user.isLoggedIn = true;
        await user.save();

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// router.put('/logout', async (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1]; // Get token from Bearer token

//     if (!token) {
//         return res.status(400).json({ message: 'Token is required' });
//     }

//     try {
//         // Decode the token to get user info
//         const decoded = jwt.verify(token, JWT_SECRET);
//         const user = await User.findById(decoded.id);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Set isLoggedIn to false in the user document
//         user.isLoggedIn = false;
//         await user.save();

//         res.status(200).json({ message: 'User successfully logged out' });
//     } catch (error) {
//         return res.status(500).json({ message: 'Failed to log out', error: error.message });
//     }
// });


router.put('/logout', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({ message: 'Authorization header is missing or malformed' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from Bearer token

    try {
        // Verify the token to decode user information
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find the user by ID extracted from the token
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Set user's logged in status to false
        user.isLoggedIn = false;
        await user.save();

        return res.status(200).json({ message: 'User successfully logged out' });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token has expired, please log in again' });
        }

        return res.status(500).json({ message: 'Failed to log out', error: error.message });
    }
});


router.post('/validate-token', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      // Verify the token using the secret key
      const decoded = jwt.verify(token, JWT_SECRET); // Use the same secret you used to sign the token
  
      // Find the user based on the decoded token's payload (usually the user ID)
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // If valid, return the user data
      res.status(200).json({ user });
    } catch (error) {
      // If token is invalid or expired, send an error response
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  });

router.put("/updatePassword/:id", async(req,res)=>{

    const {password} = req.body

    try {
        const updatedPassword = await User.findByIdAndUpdate(req.params.id,
            {password},
            {new: true},
        )
        if(!updatedPassword){
            return res.status(404).json({ message: 'Password unable to set' });
        }
        res.status(200).json({ message: 'Passsword  updated successfully', password: password });
    } catch (error) {
        res.status(500).json({ message: error.message });   
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Delete all projects associated with the user
        await Project.deleteMany({ ownerId: user._id });

        // Delete the user
        await user.deleteOne();

        res.status(200).json({ message: 'User and associated projects deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
