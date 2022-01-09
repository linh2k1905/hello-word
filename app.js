var express =require('express')
var path = require('path')
const mongoose = require('mongoose')
var config= require('./config/database')
var session = require('express-session')
var messages= require('express-message')
var flash = require('connect-flash');
var fileUpload = require('express-fileupload')
var passport= require('passport')

//const formidable = require('formidable')
//connect to database
mongoose.connect(config.database)
var db=mongoose.connection
db.on('error', console.error.bind(console,'connection error:'))
db.once('open',function(){
    console.log('Connected to MongoDB')
})

var app=express()
// views engine
app.set('views', path.join( __dirname,'views'))
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')))


// set errors globle avaible
app.locals.errors= null

// Get  page model
var Page=require('./models/page')

// Get all page into pass header.ejs

Page.find(function (err,pages) {
  if(err){
    console.log(err)
  }
  else {
    app.locals.pages=pages
  }
 

})
// Get  category  model
var Category=require('./models/category')

// Get all page into pass header.ejs

Category.find(function (err,categories) {
  if(err){
    console.log(err)
  }
  else {
    app.locals.categories=categories
  }
 

})


// express url encode
const urlencode=express.urlencoded({extended:false})
app.use(urlencode)
app.use(express.json())

// add middleware session

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
  }))


//add middleware message
app.use(flash())
app.use(function (req, res, next) {
  res.locals.messages = messages(req, res);
  next();
})

//add  middleware  express fileupload
app.use(fileUpload())
require('./config/passport')(passport)

// passport middle  passport


app.use(passport.initialize())
app.use(passport.session())
app.get('*',function(req,res,next){
  res.locals.user=req.user||null
  res.locals.cart=req.session.cart
  
  //console.log(req.user)
  next()
})



//passport config



//set routes
var pages=require('./routes/pages.js')
var products=require('./routes/products.js')
var cart=require('./routes/cart.js')
var users=require('./routes/users.js')
var orders=require('./routes/orders.js')
var adminPages=require('./routes/admin_pages.js')
var adminCategories=require('./routes/admin_categories.js')
var adminOrder=require('./routes/admin_orders.js')
var adminProduct=require('./routes/admin_products.js')
var adminUser=require('./routes/admin_users.js')
var adminShipper=require('./routes/admin_shipper.js')
var statistics=require('./routes/admin_statistic.js')
const { O_APPEND } = require('constants')
const { use } = require('passport')

app.use('/',pages)
app.use('/admin/shippers',adminShipper)
app.use('/admin/pages',adminPages)
app.use('/admin/categories',adminCategories)
app.use('/admin/products',adminProduct)
app.use('/admin/orders',adminOrder)
app.use('/products',products)
app.use('/cart',cart)
app.use('/orders',orders)
app.use('/users',users)
app.use('/admin/users',adminUser)
app.use('/admin/statistics',statistics)

var port = 3000
app.listen(port,function(){
    console.log("Server started at port "+ port)
})

