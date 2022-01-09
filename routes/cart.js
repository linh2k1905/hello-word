const express= require('express')
var router= express.Router()

var Product= require('../models/product')

//get add product to cart
router.get('/add/:product/',function(req,res){ 
    var slug=req.params.product
    Product.findOne({slug:slug},function(err,p){
        if (err) console.log(err)
        
        if(typeof req.session.cart === "undefined"){
            req.session.cart=[]
            req.session.cart.push({
                title:slug,
                qty:1,
                price:parseFloat(p.price).toFixed(2),
                image:'/product_images/'+p._id+'/'+p.image
            })
        }
        else{
            var cart=req.session.cart
            var newitem=true
            for(var i=0;i<cart.length;i++){
                if(cart[i].title ===slug){
                    cart[i].qty++
                    newitem=false
                    break
                }
            }
            if(newitem){
                cart.push({
                    title:slug,
                    qty:1,
                    price:parseFloat(p.price).toFixed(2),
                    image:'/product_images/'+p._id+'/'+p.image
                })
            }
        }
        req.flash('success','Product add!')
        res.redirect('back')
        
    })
   
})
//get checkout page
router.get('/checkout',function(req,res){ 
    if(req.session.cart && req.session.cart.length==0){
        delete req.session.cart
        res.redirect('/cart/checkout')

    }
    else{
        res.render('checkout',{

            title:'Thanh toán',
            cart:req.session.cart
        })
    }


})
//get update product 
router.get('/update/:product',function(req,res){ 
    var slug =req.params.product
    var cart= req.session.cart
    var action= req.query.action
    for(var i=0;i<cart.length;i++){
        if(cart[i].title==slug){
            switch(action){
                case "add":
                    cart[i].qty++
                    break
                 case "remove":
                    cart[i].qty--
                    if(cart[i].qty<1){
                        cart.splice(i,1)
                    }
                    break
                case "clear":
                    cart.splice(i,1)
                    if(cart.length==0) delete req.session.cart
                        break
                default: console.log('update problem')
                        break
            }
            break
        }
    }
    req.flash('success','Cart update!')
    res.redirect('/cart/checkout')
    })
 //get clear cart
router.get('/clear',function(req,res){ 
    req.flash('success','Cart clear!')
        delete req.session.cart
        res.redirect('/cart/checkout')

   
    }


)   
router.get('/buynow',function(req,res){ 
    var user=res.locals.user
   if(user!=null&& typeof user!=='undefined'){
       res.redirect('/orders/buynow')
   }
   else{
    res.redirect('/users/login')
   }


}

) 
module.exports= router