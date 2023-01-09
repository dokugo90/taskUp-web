//const { response } = require("express");
const express = require("express");
var multer = require('multer');
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
var upload = multer();
//const userPAge = require('client/src/user.js');
const app = express();

app.set('view engine', 'pug')
app.set('views','./views');

app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/taskUp", {
    useNewUrlParser: true
});

const taskModel = mongoose.Schema({
    taskName: String,
    description: String,
    priority: String,
    date: String,
    done: Boolean,
})

//let userTasks = mongoose.model("userTasks", taskModel)
//let currentCol;

app.get("/usersTasks/:email", (req, res) => {
    //const Collection = mongoose.model(`${req.params.email}`, taskModel);
    const Collection = mongoose.model(`${req.params.email}`, taskModel);
    Collection.find(function(request, data) {
            res.json({task: {data}})
    })
})

app.post("/createTask/:email", (req, res) => {
    res.redirect("/")
    const Collection = mongoose.model(`${req.params.email}`, taskModel);
    currentCol = Collection;
    Collection.insertMany([{taskName: req.body.taskName, description: req.body.description, priority: req.body.priority, date: req.body.date, done: false}])
})

app.post("/updateTask/:email/:name", (req, res) => {
    const Collection = mongoose.model(`${req.params.email}`, taskModel);
    Collection.findOneAndUpdate({taskName: req.params.name}, {description: req.body.description, priority: req.body.priority, date: req.body.date}, function(err, docs) {
        if (err) {
            res.send("Error updating task")
        } else {
            res.redirect("/")
        }
    })
})

app.post("/done/:email/:name", (req, res) => {
    const Collection = mongoose.model(`${req.params.email}`, taskModel);
    Collection.findOneAndUpdate({taskName: req.params.name}, {done: true}, function(err, docs) {
        if (err) {
            res.send("Error completing task")
        } else {
            res.redirect("/")
        }
    })
})

app.post("/deleteTask/:email/:name", (req, res) => {
    const Collection = mongoose.model(`${req.params.email}`, taskModel);
    Collection.findOneAndDelete({taskName: req.params.name}, function(err, docs) {
        if (err) {
            res.send("Error Deleting Task");
        } else {
            res.redirect("/");
        }
    })
    
})

app.listen(5000)