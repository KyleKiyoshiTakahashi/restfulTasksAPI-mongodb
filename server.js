var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static( __dirname + '/public/dist/public' ));
mongoose.connect('mongodb://localhost/taskDB');


var TaskSchema = new mongoose.Schema({
    title: { 
        type: String, 
       
    },
    description: { 
        type: String, 
        default: ""
    },
    completed: { 
        type: Boolean, 
        default: false
    }
    
},{timestamps: true});

mongoose.model('Task', TaskSchema); 
var Task = mongoose.model('Task')
// retrieve all tasks
app.get('/tasks', function(req, res){
    Task.find(function(err, tasks){
        res.json(tasks)
    })
})
// retrieve task by id
app.get('/tasks/:id', function(req, res){
    Task.findOne({_id: req.params.id}, function(err, task){
        if(err){}
        else{
            res.json(task)
        }
    })
})
// create a new task
app.post('/tasks/create', function(req, res){
    const task_inst = new Task();
    task_inst.title= req.body.name;
    task_inst.description = req.body.description;
    task_inst.completed = req.body.completed;
    task_inst.save(function(err){
        if(err){}
        else{
            res.json(task_inst);
            // res.redirect('/')
        }
    })
})
// update a task by id
app.put('/tasks/edit/:id', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var completed = req.body.completed;
    Task.update({_id: req.params.id }, {$set:{title: title, description: description, completed: completed}}, function(err, task){
        if (err){}
        else{
            res.json(task)
        }
    } )
})
// delete a task by id
app.delete('/tasks/delete/:id', function(req,res){
    Task.remove({_id: req.params.id}, function(err, result){
        res.json(result)
    })
})

app.listen(8000, function() {
    console.log("listening on port 8000");
})