const express= require('express')
var router= express.Router()
// order model
var Order= require('../models/order')
var User= require('../models/user')
const product = require('../models/product')


router.get('/buynow',function(req,res){ 
    var user=res.locals.user
   if(user!=null&& typeof user!==
    'undefined'){
      res.render('review_order',{
          title:'Đơn hàng của bạn',
          user:user
          
      })
   }
   else{
    
    res.redirect('/users/login')
   }


}
)

//post buy now
router.post('/buynow',function(req,res){ 
        var user=req.user
        var username=user.username
        var name=user.name
        var tel=user.tel
        var cart=req.session.cart
        var date =new Date(Date.now())
        var dc=req.body.diachi
        var tong =0
        cart.forEach(function(product){

          var sub =product.qty * product.price
          tong += +sub
        })
       if(user!=null&& typeof user!== 'undefined'){
          var order= new Order({
            username:username,
            name:name,
            tel:tel,
            product:cart,
            order_date:date,
            address:dc,
            status:'Đang xử lý',
            total:tong
          })
          order.save(function(err){
            if(err) console.log(err)
          })
          User.findByIdAndUpdate(user._id,{address:dc},function(err,order){
            if(err) console.log(err)
          })
        delete req.session.cart
         res.redirect('/')
       }

   
    }


)

router.get('/show',function(req,res){
  if(res.locals.user!="undefined"&&res.locals.user!= null){
    var user=res.locals.user
  
  Order.find({username:user.username},function(err,orders){
    if(err) console.log(err)
    res.render('order',{
      title:'Danh  sách đơn đặt hàng ',
      orders:orders,
     

    })

  })
  

  }
  else res.redirect('/users/login')
  


})

// get remove the order
router.get('/remove/:id',function(req,res){
  
  Order.findByIdAndUpdate(req.params.id,{status:"Đang yêu cầu hủy"},function(err){
    if (err) 
        return console.log(err)    
      
      })
  res.redirect('/orders/show')

})





module.exports= router