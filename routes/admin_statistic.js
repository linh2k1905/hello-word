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
var User= require('../models/user')
var Shipper= require('../models/shipper')
const user = require('../models/user')



//get order index 

router.get('/', isAdmin,function(req, res){
    var countGhino;
    var countUser;
    var countThanhtoan;
    Order.find({status:"Ghi nợ"}).count(function(err,c){
         if(err)  console.log(err)
        countGhino=c
 })
 Order.find({status:"Đã thanh toán"}).count(function(err,c){
  if(err)  console.log(err)
 countThanhtoan=c
})
      Shipper.count(function(err,c){
        if(err)  console.log(err)
         countUser=c
      })
    Order.find({status:"Ghi nợ"},function(err,orders){
      if (err) console.log(err)
      Shipper.find(function(err,users){

        if (err) console.log(err)
        Order.find({status:"Đã thanh toán"},function(err,ordersThanhtoan){
        res.render('admin/statistics',{
          orders:orders,
          users:users,
          countGhino:countGhino,
          countUser:countUser,
          ordersThanhtoan: ordersThanhtoan,
          countThanhtoan:countThanhtoan
          
      })
      })
    })
    })
})



// thanh toan ghi no
router.get('/khachhangno', isAdmin,function(req, res){
  var countGhino;
  Order.find({status:"Ghi nợ"}).count(function(err,c){
     if(err)  console.log(err)
     countGhino=c
})
  Order.find({status:"Ghi nợ"},function(err,orders){
    if(err)  console.log(err)
    User.find({admin:0},function(err,users){
      if(err)  console.log(err)
      res.render('admin/khachhangno',{
        orders:orders,
        count:countGhino,
        users: users
    })
    })
      
  })
})

//post xem khach ghi no
router.post('/khachhangno', isAdmin,function(req, res){
  var countGhino;
  var username=req.body.user
  var user=req.user
  Order.find({status:"Ghi nợ",username:username}).count(function(err,c){
     if(err)  console.log(err)
     countGhino=c
})

  Order.find({status:"Ghi nợ",username:username},function(err,orders){
    if(err)  console.log(err)
    User.findOne({username:username},function(err,khachhangno){

      if(err)  console.log(err)
      res.render('admin/khachhangno_detail',{
        orders:orders,
        count:countGhino,
        user:user,
        khachhangno: khachhangno
  
    
    })
    })
      
     
      
  })
})
// Giao hang

router.get('/nhanviengiao', isAdmin,function(req, res){
  var countThanhtoan;
  Order.find({status:"Đã thanh toán"}).count(function(err,c){
     if(err)  console.log(err)
     countThanhtoan=c
})
  Order.find({status:"Đã thanh toán"},function(err,orders){
    if(err)  console.log(err)
    Shipper.find(function(err,shippers){
      if(err)  console.log(err)
      res.render('admin/nhanviengiao',{
        orders:orders,
        count:countThanhtoan,
        shippers:shippers
    })
    })
      
  })
})

router.post('/nhanviengiao', isAdmin,function(req, res){
  var countThanhtoan;
  var shipper=req.body.shipper
  var user=req.user
  Order.find({status:"Đã thanh toán",shipper:shipper}).count(function(err,c){
     if(err)  console.log(err)
     countThanhtoan=c
})

  Order.find({status:"Đã thanh toán",shipper:shipper},function(err,orders){
    if(err)  console.log(err)
    Shipper.findOne({shipper:shipper},function(err,nhanviengiao){

      if(err)  console.log(err)
      res.render('admin/nhanviengiao_detail',{
        orders:orders,
        count:countThanhtoan,
        shipper:nhanviengiao,
        user:user
      
    })
    })
      
     
      
  })
})
module.exports = router