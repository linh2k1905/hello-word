var mongoose= require('mongoose')
//Page schema
var ShipperSchema= mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    cmnd:{
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
    birthyear:{
        type:Number
    },
    salery:{
        type: Number
    }

})
var Shipper =module.exports=mongoose.model('Shipper',ShipperSchema)