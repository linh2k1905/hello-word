var LocalStrategy = require('passport-local').Strategy
var bcrypt = require('bcryptjs');
var User= require('../models/user')
module.exports = function (passport){
    passport.use(new LocalStrategy(function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) console.log(err)
        if (!user) {
             
             return done(null, false,{message: 'Người dùng tồn tại'})
        
            }
        
        bcrypt.compare(password,user.password,function(err,isMatch){
            if(err) console.log(err)
            if(isMatch){

                
               
                return done(null,user)
            }
            else{
                return done(null, false,{message: 'Mật khẩu không đúng'})
            }
        })
      
      
      })
    }
  ))


    passport.serializeUser(function(user,done){
        done(null,user.id)
    })
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user)
        })
        
    })

    
}

