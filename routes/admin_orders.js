const express= require('express')
var fs= require('fs-extra')
var resizeImg=require('resize-img')
var router=express.Router()
const urlencode=express.urlencoded({extended:false})
const path= require('path')
const {check, validationResult}=require('express-validator')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });
var auth=require('../config/auth')
var isAdmin=auth.isAdmin
// get Product Model
var Order= require('../models/order')

// get user Model
var Shipper= require('../models/shipper')



//get order index 

router.get('/', isAdmin,function(req, res){
    var count;
    Order.count(function(err,c){
        count=c
 })
    Order.find(function(err,orders){
        res.render('admin/orders',{
            orders:orders,
            count:count
        })
    })
})


// nhan don
  router.get('/recieve', isAdmin,function(req, res){
    var count;
    Order.find({status:"Đã nhận đơn"}).count(function(err,c){
        count=c
 })
    Order.find({status:"Đã nhận đơn"},function(err,orders){
      if(err) console.log(err)
        res.render('admin/orders_recieve',{
          orders:orders,
          count:count
      })

      })

       
    })
// xem 
router.get('/shipping', isAdmin,function(req, res){
  var count;
  Order.find({status:"Đang giao"}).count(function(err,c){
      count=c
})
  Order.find({status:"Đang giao"},function(err,orders){
    if(err) console.log(err)
    Shipper.find(function(err,sp){
      if(err) console.log(err)
      res.render('admin/orders_shipping',{
        orders:orders,
        count:count,
        sp:sp
    })

    })

     
  })
})
// get nhan don 
  router.get('/recieve/:id',function(req,res){
  
    Order.findByIdAndUpdate(req.params.id,{status:"Đã nhận đơn"},function(err,order){
      if (err) 
         console.log(err)   
        
        })
    res.redirect('/admin/orders_recieve')
  
  })

// GET   xem chi tiết
router.get('/detail/:id',function(req,res){
     var id=req.params.id

      Order.findById(id,function(err,order){
        if (err) console.log(err)  
          var idshipper=order.shipper
          if(idshipper=="Chua co"){
            res.render('admin/detail_orderkhongcoshipper',{
                order:order
            })
          }
          else{
          Shipper.findById(idshipper,function(err,shippers){
            if (err) console.log(err)   
            res.render('admin/detail_order',{
            order:order,
            shippers:shippers
        })
      })}
      
    })
  
  })
    
  

  
  

  
// xóa

router.get('/remove', isAdmin,function(req, res){
  var count;
  Order.find({status:"Đang yêu cầu hủy"}).count(function(err,c){
    if(err) console.log(err)
      count=c
})
  Order.find({status:"Đang yêu cầu hủy"},function(err,orders){
      res.render('admin/orders_remove',{
          orders:orders,
          count:count
      })
  })
})
router.get('/remove/:id', isAdmin,function(req, res){
  var count;
  Order.count(function(err,c){
      count=c
})
  Order.findByIdAndRemove(req.params.id,function(err){
    if(err) console.log(err)
     
  })
  res.redirect('/admin/orders/remove')
})

router.get('/proccess', isAdmin,function(req, res){
  var count
  Order.find({status:"Đang xử lý"}).count(function(err,c){
      count=c
})
  Order.find({status:"Đang xử lý"},function(err,orders){
      res.render('admin/orders_accept',{
          orders:orders,
          count:count
      })
  })
})

// GET  edit dang xu ly
router.get('/proccess/:id',function(req,res){
  
  Order.findByIdAndUpdate(req.params.id,{status:"Đã nhận đơn"},function(err,order){
    if (err) 
        return console.log(err)   
      
      })
  res.redirect('/admin/orders/recieve')

})
// Thanh toan

router.get('/pay', isAdmin,function(req, res){
  var count;
  Order.find({status:"Đã thanh toán"}).count(function(err,c){
      count=c
})
  Order.find({status:"Đã thanh toán"},function(err,orders){
      res.render('admin/orders_pay',{
          orders:orders,
          count:count
      })
  })
})
// cap nhat thanh toan

router.get('/pay/:id', isAdmin,function(req, res){
  var count;
  Order.find({status:"Đã thanh toán"}).count(function(err,c){
      count=c
})
  Order.findByIdAndUpdate(req.params.id,{status:"Đã thanh toán"},function(err,orders){
      if(err) console.log(err)
  }) 
 //res.redirect('/admin/orders/pay')
})

//ghi no
router.get('/loan', isAdmin,function(req, res){
  var count;
  Order.find({status:"Ghi nợ"}).count(function(err,c){
      count=c
})
  Order.find({status:"Ghi nợ"},function(err,orders){
      res.render('admin/orders_loan',{
          orders:orders,
          count:count
      })
  })
})

router.get('/loan/:id', isAdmin,function(req, res){
  var count;
  Order.find({status:"Ghi nợ"}).count(function(err,c){
      count=c
})
  Order.findByIdAndUpdate(req.params.id,{status:"Ghi nợ"},function(err,orders){
      if(err) console.log(err)
  })
 res.redirect('/admin/orders/loan')
})


 
  

  



module.exports = router