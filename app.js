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
    let edit_id, edit_book;

    if(req.query.edit_id){
        edit_id = req.query.edit_id
        edit_book = await collection.findOne({_id: new ObjectID(edit_id)})
    }

    if(req.query.delete_id){
        await collection.deleteOne({_id: new ObjectID(req.query.delete_id)});
        return res.redirect('/?status=3');
    }

    switch (req.query.status) {
            case 1:
                message = "Inserted Successfully";
                break;
            
            case 2:
                message = "Updated  Successfully";
                break;

            case 3:
                message = "Deleted  Successfully";
                break;

            default:
                break;
    }

    res.render('main',{message, book, edit_id, edit_book })
})

app.post('/store_book', async(req, res) => {
    let database = await dbo.getDatabase();
    const collection = database.collection('book');
    let book = { title: req.body.title, author: req.body.author };
    await collection.insertOne(book);
    return res.redirect('/?status=1');
})

app.post('/update_book/:edit_id', async(req, res) => {
    let database = await dbo.getDatabase();
    const collection = database.collection('book');
    let book = { title: req.body.title, author: req.body.author };
    let edit_id = req.params.edit_id;
    // Check if edit_id is a valid ObjectId
    if (!ObjectID.isValid(edit_id)) {
        return res.status(400).send('Invalid ObjectId');
    }

    await collection.updateOne({ _id: new ObjectID(edit_id) }, { $set: book });
    return res.redirect('/?status=2');
})

app.listen(8000,()=>{console.log('Listening to 8000 port');})