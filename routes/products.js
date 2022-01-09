const express= require('express')
var fs=require('fs-extra')
var router= express.Router()
// product model
var Product= require('../models/product')
// Category model
var Category= require('../models/category')
const { fstat } = require('fs-extra')
var auth=require('../config/auth')
var isUser=auth.isUser



//get all product
router.get('/all_products', function(req,res){ 
    Product.find(function(err,products){
        if (err) console.log(err)
        
        res.render('all_products',{
                
                title: 'Tất cả sản phẩm',
                products:products
                
            })
        
    })
   
})

//get  products by category

router.get('/:category',function(req,res){ 
    var categorySlug=req.params.category;
    Category.findOne({slug:categorySlug},function(err,c){
        Product.find({category:categorySlug},function(err,products){
            if (err) console.log(err)
            
            res.render('cat_products',{
                    
                    title:c.title,
                    products:products
                    
                })
            
        })
       

    })
    
})

//get  products detail is fixing

router.get('/:category/:product',function(req,res){ 
    var galleryImages=null
    Product.findOne({slug:req.params.product},function(err,product){

        if(err){
            console.log(err)
        }
        else{
            var GallerDir="public/product_images/"+product._id+'/gallery'
            fs.readdir(GallerDir,function(err,files){
                if(err){
                    console.log(err)
                }
                else{
                    galleryImages=files
                    res.render('product',{
                        title:product.title,
                        p:product,
                        galleryImages: galleryImages


                    })
                }
            })
        }
    })
    
})




module.exports= router