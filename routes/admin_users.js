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


// get Category Model
var User= require('../models/user')
const { useReducer } = require('react')
const user = require('../models/user')



//get order index 

router.get('/', isAdmin,function(req, res){
    var count;
    User.count(function(err,c){
        count=c
 })
    User.find(function(err,users){
        res.render('admin/users',{
            users:users,
            count:count
        })
    })
})
router.get('/detail_user/:id', isAdmin,function(req, res){
    var count;
    User.count(function(err,c){
        count=c
 })
    User.findById(req.params.id,function(err,users){
        res.render('admin/users_detail',{
            users:users,
            count:count
        })
    })
})
//edit 
router.get('/edit/:id', isAdmin,function(req, res){
   
    User.findById(req.params.id,function(err,users){
        if(err) console.log(err)
        res.render('admin/users_edit',{
            users:users
       
        })
    })
})
router.post('/edit/:id', isAdmin,function(req, res){
    var name=req.body.name
    var tel=req.body.tel
    var address=req.body.address
    
    User.findByIdAndUpdate(req.params.id,{name:name,tel:tel,address:address},function(err){
        if(err) console.log(err)
        res.redirect('/admin/users')
       
    
    })
})
//inative user

router.get('/edit_password/:id', isAdmin,function(req, res){
    
    User.findById(req.params.id,function(err,users){
        if(err) console.log(err)
        var pass = users.password+"a12"
        users.status="Inactive"
        users.password=pass
        users.save();
        res.redirect('/admin/users')
    })
})
router.get('/unclock_password/:id',isAdmin,function(req,res){
    User.findById(req.params.id,function(err,users){
        if(err) console.log(err)
        var oldpass=users.password
        var newpass=oldpass.substring(0,oldpass.length-3);
        users.password=newpass
        users.status="Active"
        users.save()
        res.redirect('/admin/users')


 })

})



module.exports = router