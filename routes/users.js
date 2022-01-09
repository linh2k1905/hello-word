const express= require('express')
var router= express.Router()
var passport =require('passport')
var bcrypt =require('bcryptjs')
var User= require('../models/user')
const { check,validationResult } = require('express-validator')
const { restart } = require('nodemon')
const { lstat } = require('fs-extra')
const urlencode=express.urlencoded({extended:false})


//get  register
router.get('/register',function(req,res){ 
    res.render('register',{
        title:'Đăng ký',
        


    })
   
})



// post register

router.post('/register',urlencode,[

    check('name','Họ và tên không được để trống').notEmpty(),
    check('username','Tên người dùng không được để trống')
    .notEmpty(),
    check('password','Mật khẩu không được để trống')
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage('Mật khẩu chứa ít nhất 8 ký tự'),
    check('retypepassword',"Mật khẩu nhập phải giống nhau").exists()
    .custom((value, { req }) => value === req.body.password),
   
    
],(req,res)=>{ 
    var name= req.body.name
    var tel=req.body.tel
    var username=req.body.username
    var password=req.body.password
    
    var address=req.body.address
    
    
    const errors= validationResult(req)
    if(!errors.isEmpty()){
        const alert= errors.array()
        res.render('register',{
            alert,
            title:'Đăng ký',
            name:name,
            address:address,
            tel:tel
            
           
            
    
    
        })
       
    }
    else{

        User.findOne({username:username},function(err,user){
            if(err) console.log(err)
            if(user){
                
                res.redirect('/users/register')
                
            }
            else{
                var user =new User({
                    name:name,
                    tel:tel,
                    username:username,
                    password:password,
                    address:address,
                    admin:0


                })

                bcrypt.genSalt(10,function(err,salt){
                    if(err) console.log(err)
                    bcrypt.hash(user.password,salt,function(err,hash){
                        if(err) console.log(err)
                        user.password=hash
                        user.save(function(err){
                            if(err)
                             console.log(err)
                            else{
                                req.flash('danger','Đăng ký thành công')
                                res.redirect('/users/login')
                            }
                        })

                    })
                 })
             }
         })

    
}
})

//get  login
router.get('/login',function(req,res){ 
    if(res.locals.user) res.redirect('/')
    res.render('login',{
        title:'Đăng nhập',
        
        


    })
   
   
})

//post login
router.post('/login', function(req,res,next){
    passport.authenticate('local', { 
      successRedirect:'/',
      failureRedirect: '/users/login',
      failureFlash:true
    })(req,res,next)
   

})


//get  logout
router.get('/logout',function(req,res){ 
   
    req.logout()
    delete req.session.cart
    req.flash('success','Đăng xuất thành công')
    res.redirect('/users/login')
   
})


  
   




module.exports= router