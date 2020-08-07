const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../configuration/index');
signToken = user =>{
    return JWT.sign({
        iss: "Onushilon",
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate( new Date().getDate() + 30 )
    }, JWT_SECRET  );
}
module.exports = {
    signUp: async (req,res,next) => {

        const email = req.value.body.email;
        const password = req.value.body.password;

        // Check for same email...
        const foundUser = await User.findOne({"local.email" : email});
        if( foundUser ){
            return res.status(403).json({ error: "Email already in use" });
        }

        // Create new user
        const newUser = new User({
            method: 'local',
            local:{
                email: email,
                password: password
            }
        });
        await newUser.save();
        // Create token
        //res.json({user:'created'});

        //Respond with token
        const token = signToken(newUser);
        res.status(200).json({token: token});
    },
    signIn: async (req,res,next) => {
        // Generate Tokens by passport.js
        const token = signToken(req.user);
        console.log("Successful signIn activity for",req.user.local.email);
        res.status(200).json({
            token: token
        });
    },

    googleOAuth: async (req,res,next) => {
        // Generate token
        const token = signToken(req.user);
        res.status(200).json({token: token});
    },

    secret: async (req,res,next) => {
        console.log(req.user.method,"Finally came to my secret activity");
        res.json({
            secret:"You have found my secret"
        });
    }
}