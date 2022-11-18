const express = require('express')
const app = express()
const http = require('http')
require('dotenv').config()
const body_parser = require('body-parser');
const port = process.env.PORT || 3080;
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
const server = http.createServer((req, res) => {
  console.log('hellow world')
})

// mogoose config
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

// item modal
var item_details = new mongoose.Schema({
    username:String,
    password:String,
    Categories:[{
      category_name:String,
      category_image:String,
      category_items:[{
        item_image:String,
        in_stock:Boolean
      }]
    }]
  },{ typeKey: '$type' })

// item
var items = mongoose.model('shop_stock', item_details);

const authToken = async(req,res,next)=>{
  try {
    const authHeader = req.headers['x-auth-token']
    const verified = jwt.verify(authHeader, process.env.ACCESS_TOKEN);
    next()
    
  } catch (err) {
    res.json({message:'wrong JWT',status:400});
    console.log('not authorized')
  }
}

app.post('/verify_route' , authToken,(req,res) =>{
  res.json({message:'authorized',status:201});
})

app.post('/signin', function (req, res) {
  console.log('entered here')
  const {username , password} = req.body
  // console.log(req.body.email)
  items.find({ username:username }, function (err, data) {
    if (data.length == 0) {
      res.status(442).json({message:'invalid username or password',status:442})
      console.log('invalid username')
    }
    else {
      if (password == data[0].password) {
            const token = jwt.sign({id:data[0].id , username:data[0].username},process.env.ACCESS_TOKEN)
            res.status(201).json({message:'you are verified',status:201 , token:token});
            console.log('you are verified')
      }
      else {
        res.status(442).json({error:'invalid username or password',status:442});
        console.log('invalid username or password')
      }
    }
  })
})

function category_data(id){
  return new Promise((resolve,reject)=>{
    items.find({_id:id},function(err,data){
      if(err) console.log(err)
      else{
        let category_array = []
        var category_path = data[0].Categories
        for (let i = 0; i < data[0].Categories.length; i++) {
            category_array.push({category_name:category_path[i].category_name , category_image:category_path[i].category_image})
        }
        resolve(category_array)
      }
    })
  })
}

app.get('/category_data',authToken ,async(req,res)=>{
  const authHeader = req.headers['x-auth-token']
  const user_id = jwt.verify(authHeader, process.env.ACCESS_TOKEN);
  let response = await category_data(user_id.id)
  res.status(202).json({categories:response})

})

app.post('/save_item' ,authToken ,async(req,res)=>{
  const{item_info , image_urls} = req.body
  const{category_name} = item_info
  const authHeader = req.headers['x-auth-token']
  const user_id = jwt.verify(authHeader, process.env.ACCESS_TOKEN);

  var category_items = []

  for (let index = 0; index < image_urls.length; index++) {
    category_items.push({item_image:image_urls[index] , in_stock:true})
  }


  var edit_customer_details = { $push: {'Categories.$.category_items':category_items}}


  items.updateOne({ _id: user_id.id , "Categories.category_name":category_name},edit_customer_details, function (err, result) {
    if (err){
      throw err;
    } 
    else{
      if(result.modifiedCount>0){
        res.status(202).json({message:'Item Added',status:202})
      }
      else{
        res.status(500).json({message:'Something Went Wrong',status:500})
      }
    }
    });

})

function checking(user_id , category_name){
  return new Promise((resolve,reject)=>{
    items.aggregate([
      {"$match" : {
        "_id": new mongoose.Types.ObjectId(user_id)}} , 

      {"$project":{

        "Categories":{
          
          "$filter":{
            "input":"$Categories",
            "as":"category",
            "cond":{"$eq":["$$category.category_name",category_name]}
      }
    }}}],
    
    function(err,data){
      if(err) console.log(err)
      else{
        if(data[0].Categories[0].category_items.length!=0){
          resolve(data[0].Categories[0].category_items)
        }
        else{
          resolve(true)
        }
      }
    })
  })
}

app.post('/item_data',authToken ,async(req,res)=>{
  category_name = req.body.item
  const authHeader = req.headers['x-auth-token']
  const user_id = jwt.verify(authHeader, process.env.ACCESS_TOKEN);

  let response = await checking(user_id  , category_name)
  res.json(response)
  
})

function updating_item(user_id ,item_id , instock_value){
  return new Promise((resolve,reject)=>{

  
  var edit_customer_details = { $set: {'Categories.$.category_items.$[element].in_stock':instock_value}}

  items.updateOne({ "Categories.category_items._id": new mongoose.Types.ObjectId(item_id)},edit_customer_details, {arrayFilters:[{"element._id" : new mongoose.Types.ObjectId(item_id) }]}, function (err, result) {
    if (err){
      throw err;
    } 
    else{
      if(result.modifiedCount>0){
        resolve({message:'Item Updated' , status:202})
      }
      else{
        console.log('something went wrong')
        resolve({message:'Something Went Wrong' , status:500})
      }
    }
    });
  })
}

app.post('/update_item',authToken ,async(req,res)=>{
  const {item_id , instock_value} = req.body
  const authHeader = req.headers['x-auth-token']
  const user_id = jwt.verify(authHeader, process.env.ACCESS_TOKEN);
  let response = await updating_item(user_id.id ,item_id  , instock_value)
  res.status(202).json({message:response.message,status:response.status})

})


app.listen(port, () => {
  console.log(`listening on port ${port}`)
})