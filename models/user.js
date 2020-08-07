const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

//Create a schema
const userSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        required: true
    },
    local:{
        email:  {
            type: String,
            lowercase: true
        },
        password: {
            type: String
        }
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    }

});

userSchema.pre('save',async function(next){
   try{
       if( this.method!== 'local' ){
           next();
       }
       // Generate a salt
       const salt = await bcrypt.genSalt(10);
       // generate hash
       const hashedPassword = await bcrypt.hash(this.local.password,salt);
       console.log('salt',salt);
       console.log('normal password',this.local.password);
       console.log('hashed password',hashedPassword);
       this.local.password = hashedPassword;
       next();
   } catch (error){
       next(error);
   }
});

userSchema.methods.isValidPassword = async function (newPassword){
    try{
        return bcrypt.compare(newPassword,this.local.password);
    } catch (error){
        throw new Error(error);
    }
}
// create a model
const User = mongoose.model('user',userSchema);
//export the model

module.exports = User;