const express = require('express');
const router = express.Router();
const User = require("../../models/Mongoousers")
const secretID = process.env.secret_ID_JWT
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//User login 
router.post('/login', async (req, res) => {
    try {
        const { email, password, } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Invalid Feilds" });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No User Found" });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(isPasswordValid)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Incorrect Password" });
        }
        
        jwt.sign({ id: user._id }, secretID, { expiresIn: '30d' }, async (err, UserToken) => {
            user.sessionExpiration = new Date().getTime() + (1000 * 60 * 60 * 24 * 30); 
            user.jwttoken = UserToken;
            user.lastLogin = new Date();
            await user.save();
            res.status(200).json({ message: 'Successfully Sign In', user });
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to login User", error: error.message });
    }

});


// user singup
router.post('/sing-up', async (req, res) => {

    try {
        const {username,email,password,ProfileImageUrl} = req.body;
        console.log(req.body)
        if (!email || !password || !username|| !ProfileImageUrl) {
            return res.status(400).json({ message: "Invalid Feilds" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.findOne({ email });

        if (user) {
            return res.status(404).json({ message: "User Already Exist" });
        }

        const newuser = new User({username,email, password: hashedPassword,ProfileImageUrl:ProfileImageUrl })
        newuser.status = true;
        jwt.sign({ id: newuser._id }, secretID, { expiresIn: '30d' }, async (err, UserToken) => {
            newuser.sessionExpiration = new Date().getTime() + (1000 * 60 * 60 * 24 * 30); // 30 days in milliseconds
            newuser.jwttoken = UserToken;
            await newuser.save();
            res.status(200).json({ message: 'Successfully Sign In', newuser });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Sign Up, try Again Later', error: error.message });
    }
});




module.exports = router;
