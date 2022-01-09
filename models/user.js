var mongoose= require('mongoose')
//Page schema
var UserSchema= mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    tel:{
        type: String,
        required: true
    },
    address:{
        type: String,
       
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    admin:{
        type: Number
    }
    ,
    status:{
        type: String,
        default:"Active"
    }
})
var User =module.exports=mongoose.model('User',UserSchema)