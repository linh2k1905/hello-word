const express= require('express')
const {flash} = require('connect-flash')
const { check, validationResult } = require('express-validator')
var router=express.Router()
const urlencode=express.urlencoded({extended:false})
var auth=require('../config/auth')
var isAdmin=auth.isAdmin
// get CATEGORY  Model

var Category= require('../models/category')
const { render } = require('ejs')
const category = require('../models/category')

// get category index
router.get('/',isAdmin, function(req, res){
    
        Category.find(function(err,categories){
            if(err) return console.log(err)

            res.render('admin/categories',{
                categories: categories
            })
        })
           
           
        
    // })
})

// GET  add Category
router.get('/add-category',isAdmin,function(req, res){
    
       var title=""
        res.render('admin/add_category',{
            title:title
        })
     })


// get edit category
router.get('/edit-category/:id',isAdmin,function(req, res){
      Category.findById(req.params.id,function(err,category){
          if(err) return console.log(err)
          res.render('admin/edit_category',{
            title:category.title,
            id :category._id
        })
      })
       
      })
     
 
//Post category add ok 

router.post('/add-category',isAdmin,urlencode,[
    
    check('title','Tên sản phẩm không được để trống')
    .notEmpty()
],(req,res)=>{
        var title=req.body.title
        var slug=title.replace(/\s+/g,'-').toLowerCase()
        const errors= validationResult(req)
        if(!errors.isEmpty()){
            const alert= errors.array()
            req.flash('danger','error')
            res.render('admin/add_category',{
                            alert,
                            title:title,
            
                        })
        }
        else{
            Category.findOne({slug:slug},function(cat,err){
                if(cat){
                    req.flash('danger','Loại sản phẩm đã tồn tại')
                    res.render('admin/add_category',{
                        title:title,
                        slug:slug
                    })
                }
            else {
                var category =new Category({

                    title:title,
                    slug:slug,
                   
                })
                category.save(function(err){
                    if(err)
                        console.log(err)
                    
                     Category.find(function (err,categories) {
                            if(err){
                              console.log(err)
                            }
                            else {
                              req.app.locals.categories=categories
                            }
                           
                          
                          })
                       
                    res.redirect('/admin/categories')
                    req.flash('f',' Thêm Thành công ')

                
                })
            }
            })

        }
      
    }

    )

//post Edit category
router.post('/edit-category/:id',isAdmin,urlencode,[
    
    check('title','Tên sản phẩm không được để trống')
    .notEmpty()
],(req,res)=>{
        var title=req.body.title
        var slug=title.replace(/\s+/g,'-').toLowerCase()
        var id=req.params.id
        const errors= validationResult(req)
        if(!errors.isEmpty()){
            const alert= errors.array()
            req.flash('danger','Lỗi')
            res.render('admin/edit_category',{
                            alert,
                            title:title,
                            id:id
                        })
        }else{
            Category.findOne({slug:slug,_id:{ '$ne':id}},function(err,cat){
                if(cat){
                    req.flash('danger','Loại sản phẩm đã tồn tại ')
                    res.render('admin/edit_category',{
                        title:title,
                        id:id
                    })
                } else {
                Category.findById(id,function(err,cat){
                    if(err) return console.log(err)
                    cat.title= title
                    cat.slug= slug
                    cat.save(function(err){
                        if(err) return console.log(err)
                        Category.find(function (err,categories) {
                            if(err){
                              console.log(err)
                            }
                            else {
                              req.app.locals.categories=categories
                            }
                           
                          
                          })
                            req.flash('success',' Sửa thành công')
                            res.redirect('/admin/categories/edit-category/'+ id)
    
                    
                    })
                })
                
            }
            })

        }
      
    })

    // get delete category
    router.get('/delete-category/:id',isAdmin, function(req, res){
        Category.findByIdAndRemove(req.params.id,function(err){
            if(err) return console.log(err)
            Category.find(function (err,categories) {
                if(err){
                  console.log(err)
                }
                else {
                  req.app.locals.categories=categories
                }
               
              
              })
            req.flash('success',' Category  deleted!')
            res.redirect('/admin/categories')
    
        })
    })
   

module.exports =router