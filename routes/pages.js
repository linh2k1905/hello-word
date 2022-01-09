const express= require('express')
var router= express.Router()

var Page= require('../models/page')

//get home 
router.get('/',function(req,res){ 
    Page.findOne({slug:'trang-chủ'},function(err,page){
        if (err) console.log(err)
        
        res.render('index',{
                
                title: page.title,
                content:page.content
                
            })
        
    })
   
})



// get page content
router.get('/:slug',function(req,res){

var slug=req.params.slug

Page.findOne({slug:slug},function(err,page){
    if (err) console.log(err)
    if(!page)
        res.redirect('/')
    else {
        res.render('index',{
            
            title: page.title,
            content:page.content
            
        })
    }
})
})
module.exports= router