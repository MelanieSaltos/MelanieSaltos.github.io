const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const saltRounds=10;

const UserSchema = new mongoose.Schema({
    username : {type: String, require: true, unique: true},
    password : {type: String, require: true}
});

UserSchema.pre('save', function(next){
    if(this.isNew || this.isModified('password')){
        const document= this;
        bcrypt.hash(document.password, saltRounds, (err, hashedPassword)=>{
            if(err){
                next(err);
            }else{
                document.password= hashedPassword;
                next(); 
            }
            
        });
    }else{
        next();
    }
    
});
UserSchema.method.isCorrectPassword=function(candidatepassword, callback){
    bcrypt.compare(candidatepassword, this.password, function(err, same){
        if (err) {
            callback(err);
        }else{
            callback(err, same);
            
        }
    });
}

module.exports= mongoose.model('User', UserSchema);