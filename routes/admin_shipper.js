const express= require('express')
var router= express.Router()
var passport =require('passport')
var bcrypt =require('bcryptjs')
var Shipper= require('../models/shipper')
var Order= require('../models/order')
const { check,validationResult } = require('express-validator')
const { restart } = require('nodemon')
const { lstat } = require('fs-extra')
const urlencode=express.urlencoded({extended:false})
var auth=require('../config/auth')
var isAdmin=auth.isAdmin
//get  shipper
router.get('/',function(req,res){ 
    Shipper.find(function(err,shippers){
        res.render('admin/shipper',{
            title:'Danh sách nhân viên',
            shippers:shippers
            


    })
    


    })
   
})
//get  add shipper
router.get('/add',function(req,res){ 
    res.render('admin/add_shipper',{
        title:'Nhập thông tin shipper',
        


    })
   
})



// post add shipper

router.post('/add',function(req,res){ 
    var name= req.body.name
    var tel=req.body.tel
    var birthyear=req.body.birthyear
    var cmnd=req.body.cmnd
    var address=req.body.address
    var salery=req.body.salery
    
    

        
                var shipper =new Shipper({
                    name:name,
                    tel:tel,
                    birthyear:birthyear,
                    cmnd:cmnd,
                    address:address,
                    salery:salery


                })
                shipper.save(function(err){
                    if(err) console.log(err)
                })
                res.redirect('/admin/shippers')

            })
                    

//get  edit shipper
router.get('/edit/:id', isAdmin,function(req, res){
   
    Shipper.findById(req.params.id,function(err,shippers){
        if(err) console.log(err)
        res.render('admin/edit_shipper',{
            title:" Chỉnh sửa thông tin nhân sự",
           shippers:shippers
       
        })
    })
})
//post  edit shipper
router.post('/edit/:id', isAdmin,function(req, res){
   
    var name=req.body.name
    var tel=req.body.tel
    var address=req.body.address
    var salery=req.body.salery
    var cmnd =req.body.cmnd
    Shipper.findByIdAndUpdate(req.params.id,{name:name,tel:tel,address:address,salery:salery,cmnd:cmnd},function(err){
        if(err) console.log(err)
        res.redirect('/admin/shippers')
    })
  
})



//get  delete shipper
router.get('/delete/:id', isAdmin,function(req, res){
   
    Shipper.findByIdAndRemove(req.params.id,function(err){
        if(err) console.log(err)
        
    })
    res.redirect('/admin/shippers')
})
// them don cho shipper
router.get('/shiping',function(req,res){ 
    Shipper.find(function(err,shippers){
        if (err)console.log(err)
        Order.find({status:"Đã nhận đơn"},function(err,orders){
            res.render('admin/shiping',{
                title:'Phân phối  đơn ship',
                orders:orders,
                shippers: shippers
        
            })
  
    })})

    
   
})



router.get('/shiping/:id',function(req,res){ 
    // var idShipper=req.body.idShipper
    var idOrder= req.params.id
    Shipper.find(function(err,shippers){
        if(err) console.log(err)
        Order.findById(idOrder,function(err,order){
        if(err) console.log(err)
            res.render('admin/add_shiping',{
                order:order,
                shippers: shippers
            })
    })

    })
    
  

})

    
router.post('/add_shiping/:id',function(req,res){ 
        var shipper= req.body.shipper
        var date =new Date(Date.now())
        Order.findByIdAndUpdate(req.params.id,{status:"Đang giao",shipper:shipper,ship_date:date},function(err){
            if(err) console.log(err)
            res.redirect('/admin/shippers')
    })

    
   
})


module.exports= router