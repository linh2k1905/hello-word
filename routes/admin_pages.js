const express= require('express')
const {flash} = require('connect-flash')
const { check, validationResult } = require('express-validator')
const { render } = require('ejs')
var router=express.Router()
const urlencode=express.urlencoded({extended:false})
var auth=require('../config/auth')
var isAdmin=auth.isAdmin
// get Page Model
var Page= require('../models/page')



//get page index 
router.get('/', isAdmin,function(req, res){
    Page.find({}).sort({sorting:1}).exec(function (err,pages) {
            res.render('admin/pages',{
                pages:pages
            })
           
        
    })
})

// GET  add page 
router.get('/add-page',isAdmin,function(req, res){
    
       var title=""
       var slug=""
       var content=""
        res.render('admin/add_page',{
            title:title,
            slug:slug,
            content:content
        })
     })


//GET edit page
     router.get('/edit-page/:id',isAdmin,function(req, res){
    
      Page.findById(req.params.id,function(err,page){
          if(err) return console.log(err)
          res.render('admin/edit_page',{
            title:page.title,
            slug:page.slug,
            content:page.content,
            id : page.id
        })
      })
       
      })


// sort-page function

function sortPages(ids,callback){
    var count=0
    for(var i=0;i<ids.length;i++){
         var id= ids[i]
         count++
         (function (count) {
             
         
         Page.findById(id,function (err,page) {
             page.sorting=count
             page.save(function (err) {
                 if(err){
                     return console.log(err)
                 }
                 ++count
                 if(count>=ids.length)
                    callback()
             })
         })
     })(count)
     
 }

}
//post reorder page index 
router.post('/reorder-pages', function(req, res){
    var ids=req.body['id[]']
    sortPages(ids,function(){
        Page.find({}).sort({sorting:1}).exec(function (err,pages) {
            if(err){
              console.log(err)
            }
            else {
              req.app.locals.pages=pages
            }
           
          
          })

    })
   
 
 })   
 
//Post page add 

router.post('/add-page',isAdmin,urlencode,[
    
    check('title','Title must have a value')
    .notEmpty(),
    check('content','Content must have a value')
    .notEmpty()
],(req,res)=>{
        var title=req.body.title
        var content=req.body.content
        var slug=req.body.slug.replace(/\s+/g,'-').toLowerCase()
        if(slug==""){
            slug=title.replace(/\s+/g,'-').toLowerCase()
        }
        const errors= validationResult(req)
        if(!errors.isEmpty()){
            const alert= errors.array()
            req.flash('danger','error')
            res.render('admin/add_page',{
                            alert,
                            title:title,
                            slug:slug,
                            content:content
                        }
                        )
        }
        else{
            Page.findOne({slug:slug},function(page,err){
                if(page){
                    req.flash('danger','Page slug exist.Choose another')
                    res.render('admin/add_page',{
                        title:title,
                        slug:slug,
                        content:content
                    })
                }
            else {
                var page =new Page({

                    title:title,
                    slug:slug,
                    content:content,
                    sorting:100
                })
                page.save(function(err){
                    if(err)
                        console.log(err)
                    Page.find({}).sort({sorting:1}).exec(function (err,pages) {
                        if(err){
                              console.log(err)
                            }
                            else {
                              req.app.locals.pages=pages
                            }
                           
                          
                          })
                    
                    
                        req.flash('success',' Page added!')
                        res.redirect('/admin/pages')

                
                })
            }
            })

        }
      
    }

    )
//post Edit page
router.post('/edit-page/:id',isAdmin,urlencode,[
    
    check('title','Title must have a value')
    .notEmpty(),
    check('content','Content must have a value')
    .notEmpty()
],(req,res)=>{
        var title=req.body.title
        var content=req.body.content
        var slug=req.body.slug.replace(/\s+/g,'-').toLowerCase()
        if(slug=="") slug=title.replace(/\s+/g,'-').toLowerCase()
        
        var content=req.body.content
        var id=req.params.id
        const errors= validationResult(req)
        if(!errors.isEmpty()){
            const alert= errors.array()
            req.flash('danger','error')
            res.render('admin/edit_page',{
                            alert,
                            title:title,
                            slug:slug,
                            content:content,
                            id:id
                        })
        }else{
            Page.findOne({slug:slug,_id:{ '$ne':id}},function(err,page){
                if(page){
                    req.flash('danger','Page slug exist.Choose another')
                    res.render('admin/edit_page',{
                        title:title,
                        slug:slug,
                        content:content,
                        id:id
                    })
                } else {
                Page.findById(id,function(err,page){
                    if(err) return console.log(err)
                    page.title= title
                    page.slug= slug
                    page.content= content
                    page.save(function(err){
                        if(err)
                            console.log(err)
                            Page.find({}).sort({sorting:1}).exec(function (err,pages) {
                                if(err){
                                  console.log(err)
                                }
                                else {
                                  req.app.locals.pages=pages
                                }
                               
                              
                              })
                         
                            req.flash('success',' Sửa thành công!')
                            res.redirect('/admin/pages/edit-page/'+id)
    
                    
                    })
                })
                
            }
            })

        }
      
    })


//get delete  page
router.get('/delete-page/:id', isAdmin,function(req, res){
    Page.findByIdAndRemove(req.params.id,function(err){
    if (err) 
        return console.log(err)

    Page.find({}).sort({sorting:1}).exec(function (err,pages) {
        if(err){
          console.log(err)
        }
        else {
          req.app.locals.pages=pages
        }
       
      
      })
    req.flash('success',' Xóa thành công!')
    res.redirect('/admin/pages/')
    })
})

module.exports =router