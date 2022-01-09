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
var Product= require('../models/product')

// get Category Model
var Category= require('../models/category')
const category = require('../models/category')
const { pipeline } = require('stream')
const { globalAgent } = require('http')


//get product index 

router.get('/', isAdmin,function(req, res){
    var count;
    Product.count(function(err,c){
        count=c
 })
    Product.find(function(err,products){
        res.render('admin/products',{
            products:products,
            count:count
        })
    })
})

// GET  add product 

router.get('/add-product',isAdmin,function(req, res){
    
       var title=""
       var desc=""
       var price=""
       var image=""
       Category.find(function(err,categories){
            res.render('admin/add_product',{
                title:title,
                desc:desc,
                price:price,               
                categories:categories,
                image:image
            })
        })
     })




// Post add product 

router.post('/add-product',isAdmin, urlencode,[
    
    check('title','Tên sản phẩm không được để trống')
    .notEmpty(),
    check('desc','Phải nhập công dụng sản phẩm')
    .notEmpty(),
    check('price','Giá sản phẩm phải là số dương')
    .isDecimal()
    
],(req,res)=>{
    var title=req.body.title
    var price=req.body.price
    var slug=title.replace(/\s+/g,'-').toLowerCase()
    var desc=req.body.desc
    var category=req.body.category
  
    
    const errors= validationResult(req)

    if(!errors.isEmpty()){
        const alert= errors.array()
        Category.find(function(err,categories){
            res.render('admin/add_product',{
                alert,
                title:title,
                slug:slug,
                desc:desc,
                price:price,
                category:p.category.replace(/\s+/g,'-').toLowerCase(),
                categories:categories
            })
        }
            )}

            else{
                Product.findOne({slug:slug},function(product,err){
                    if(product){
                        req.flash('danger','Page slug exist.Choose another')
                        Category.find(function(err,categories){
                            res.render('admin/add_product',{
                                title:title,
                                slug:slug,
                                desc:desc,
                                price:price,
                                categories:categories
                            })
                        })
                    }
                else {
                   
                
                    
                    if(req.files.mFile===null)
                        res.redirect('/admin/products')

                    var image=req.files.mFile.name
                    var price2=parseFloat(price).toFixed(2)
                    var product =new Product({
                        title:title,
                        slug:slug,
                        desc:desc,
                        category:category,
                        price:price2,
                        image:image
                        
                    })
                    product.save(function(err){
                        if(err)
                            console.log(err)
                    fs.mkdirp("public/product_images/"+product._id,function(err){
                                if(err)
                                 return console.log(err)
                            })
                    fs.mkdirp("public/product_images/"+product._id+"/gallery",function(err){
                                if(err)
                                 return console.log(err)
                            })
                    fs.mkdirp("public/product_images/"+product._id+"/gallery/thumb",function(err){
                                if(err)
                                    return console.log(err)
                            })
                        var file = req.files.mFile
                        var savePath='public/product_images/'+product._id+'/'+file.name
                        file.mv(savePath)
                        req.flash('success',' Page added!')
                        res.redirect('/admin/products')
    
                    
                    })
                }
                })
    
            }
})



//GET edit product
     router.get('/edit-product/:id',isAdmin,function(req, res){
        var errors
        if(req.session.errors){
            errors=req.session.errors
        }
        req.session.errors=null
        Category.find(function(err,categories){
            Product.findById(req.params.id,function(err,p){

                if(err){
                    console.log(err)
                    res.redirect('/admin/products')
                }
                
                else{
                    var  galleryDir='public/product_images/'+p._id+"/gallery/"
                    var  galleryimg=null
                    fs.readdir(galleryDir,function(err,files){

                        if(err)
                            console.log(err)
                        else {
                            
                            galleryimg=files
                            res.render('admin/edit_product',{
                                errors:errors,
                                title:p.title,
                                desc:p.desc,
                                price:parseFloat(p.price).toFixed(2),
                                categories:categories,
                                category:p.category.replace(/\s+/g,'-').toLowerCase(),
                                image:p.image,
                                galleryimg:galleryimg,
                                id:p._id
                                
                            })}


                    })
                }

            
             } )
           
        })
       
      })
//post edit product
 router.post('/edit-product/:id',isAdmin,function
    
(req,res){
    var title=req.body.title
    var price=req.body.price
    var slug=title.replace(/\s+/g,'-').toLowerCase()
    var desc=req.body.desc
    var category=req.body.category
    var pimage=req.body.pimage
    var id= req.params.id
    var file = req.files.mFile
   
        Product.findOne({slug: slug, _id:{'$ne':id}},function(err){
           if(err) 
                console.log(err)
           else {
                Product.findById(id,function(err,p){
                    if(err) 
                       console.log(err)
                    p.title=title
                    p.slug=slug
                    p.desc=desc
                    p.category=category.replace(/\s+/g,'-').toLowerCase()
                    p.price=parseFloat(price).toFixed(2)
                 
                    if(file!="undefined"){
                        p.image=file.name
                    }
                    else p.image="noimage.jpg"
                    p.save(function(err){
                      if(err) console.log(err)
                      if(file.name!=""){

                      if(pimage!=""){
                        fs.remove("public/product_images/" +id + "/"+pimage,function(err){
                            if(err) console.log(err)
                        })
                      }
    
                      var savePath='public/product_images/'+id+'/'+file.name
                      file.mv(savePath)
            
                    
                    }
                    req.flash('success',' Product edit!')
                    res.redirect('/admin/products/edit-product/'+id)
                    })
                   
                  

                })
               
            }
        })
    }

      
     )




//post add gallery
router.post('/product-gallery/:id', isAdmin,function(req, res){
   var productImage=req.files.file
   var id=req.params.id
   var path="public/product_images/"+id+"/gallery/"+productImage.name
   var thumbspath="public/product_images/"+id+"/gallery/thumb/"+productImage.name
   productImage.mv(path,function(err){
       if(err)
            console.log(err)
        resizeImg(fs.readFileSync(path),{height:100,width:100}).then(function(buf){
            fs.writeFileSync(thumbspath,buf)
        })
   })
   res.sendStatus(200)

})

//get delete  image
router.get('/delete-image/:image',isAdmin, function(req, res){
    var orginalImage="public/product_images/"+req.query.id+"/gallery/"+req.params.image
    var thumbimage="public/product_images/"+req.query.id+"/gallery/thumb/"+req.params.image
    fs.remove(orginalImage,function(err){
        if(err){
            console.log(err)
        }
        else{
            fs.remove(thumbimage,function(err){
                if(err){
                    console.log(err)
                }
                else{
                    req.flash('success',' Product image delete!')
                    res.redirect('/admin/products/edit-product/'+req.query.id)
                }

            })
        }
    })
})


//get delete  product
router.get('/delete-product/:id', isAdmin, function(req, res){
    var id=req.params.id
    var path="public/product_images"+id
    fs.remove(path,function(err){
            if(err){
                console.log(err)
            }
            else{
                Product.findByIdAndRemove(id,function(err){

                    console.log(err)
                })
                req.flash('success',' Product  delete!')
                res.redirect('/admin/products/')
                }
        })
})

module.exports = router