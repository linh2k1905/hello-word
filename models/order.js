var mongoose= require('mongoose')
//order  schema is 
var OrderSchema= mongoose.Schema({
    username:{
        type: String,
        require: true
       },
    name:{
        type: String,
        require: true
       },
    tel:{
        type: String,
        require: true
       },
    
    product:[],
    order_date:{
        type: Date,
        require: true
    },
    ship_date:{
        type: Date,
        require: true
    },
    address:{
        type: String,
       
    },
    status:{
        type:String
    },
    total:{
        type: Number,
       
    },
    shipper:{
        type: String,
        default :"Chua co"
    }
    
    
})
var Order =module.exports=mongoose.model('Order',OrderSchema)