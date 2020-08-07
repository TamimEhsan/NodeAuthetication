const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const { JWT_SECRET } = require('./configuration/index');
const User = require('./models/user');

// JSON web tokens strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload,done) =>{
    try{
        //find a user specified in token
        const user = await User.findById(payload.sub);
        // if doesn,t exist handle it
        if( !user ){
            return done(null,false);
        }
        // if exists then return the user
        done(null,user);
    } catch (error){
        done(error,false);
    }
}));

// Local strategy

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email,password,done) =>{
    try{
        // find the user
        const user = await User.findOne({"local.email": email});
        // if not handle it
        if(!user){
            return done(null,false);
        }
        // check if password is correct
        console.log('signed in user ',user);
        const isMatch = await user.isValidPassword(password);
        // if not handle it
        if(!isMatch){
            return done(null,false);
        }
        //so, return the user
        done(null,user);
    } catch(error){
        done(error,false);
    }

}));

// Google OAuth strategy
passport.use('googleToken',new GooglePlusTokenStrategy({
    clientID: '36798690225-1qt73khdoup6iv7vlcs79p07ltjfmg76.apps.googleusercontent.com',
    clientSecret: 'kNnwqfVMi2BBjIDyIj87Zf6p'
},async (accessToken,refreshToken,profile,done)=>{
    try{
        //console.log("Access token",accessToken);
        //console.log("Refresh token",refreshToken);
        console.log("Email ",profile.emails[0].value);
        //Check if our current user exists
        const existingUser = await User.findOne({"google.id":profile.id});
        if( existingUser ){
            console.log("google user exists");
            return done(null,existingUser);
        }
        const newUser = new User({
            method: 'google',
            google: {
                id:profile.id,
                email:profile.emails[0].value
            }
        });
        await newUser.save();
        console.log("new USer");
        done(null,newUser);
    } catch(error){
        console.log("error in google auth");
        done(error,false,error.message);
    }

}));