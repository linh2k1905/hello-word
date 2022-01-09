var mongoose= require('mongoose')
//Product schema
var ProductSchema= mongoose.Schema({
    title:{
        type: String,
       },
    slug:{
        type: String,
    },
    desc:{
        type: String
    },
    category:{
        type: String
    },
    price:{
        type: Number
    },
    
    image:{
        type: String
    }
})
var Product =module.exports=mongoose.model('Product',ProductSchema)