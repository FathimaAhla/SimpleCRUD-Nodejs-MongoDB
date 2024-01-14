const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const exhbs = require('express-handlebars');
const dbo = require('./db');
const ObjectID = dbo.ObjectID;

// register 'hbs' engine
app.engine('hbs',exhbs.engine({layoutsDir:'views/',defaultLayout:"main",extname:"hbs"}))
app.set('view engine','hbs');
app.set('views','views');
// post method url
app.use(bodyparser.urlencoded({extended: true}));

// Create route
app.get('/',async (req,res)=>{
    let database = await dbo.getDatabase();
    const collection = database.collection('book');
    const cursor = collection.find({})
    let book = await cursor.toArray();

    let message = '';
    

    res.render('main',{message })
})



app.listen(8000,()=>{console.log('Listening to 8000 port');})