const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();
app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 8001

mongoose.connect('mongodb+srv://todolist:TB8BAk6oJKZJshXB@cluster0.ucebadb.mongodb.net/?retryWrites=true&w=majority',{
    useUnifiedTopology:true});
const db = mongoose.connection;
db.once('open', () =>{
    console.log('Connected to MongoDB')
})

const todoSchema = new mongoose.Schema({
    title: String,
    completed: {
        type:Boolean,
        default:false
    }
})

const Todo = mongoose.model('Todo',todoSchema);

app.post('/api/addtodos',async(req,res)=>{
    console.log(req.body);
const newTodo = new Todo({
    title:req.body.title
})
await newTodo.save();
res.status(200).json(newTodo);

})


app.post('/api/deletetodos', async (req, res) => {
    const id = req.body.id;
    await Todo.findByIdAndDelete(id);
    res.status(200).json({
        message: 'Todo deleted successfully'
    })
})


app.post('/api/changestatus', async (req, res) => {
    const id = req.body.id;
    const completed = true;
    await Todo.findByIdAndUpdate(id,{completed:completed});
    res.status(200).json({
        message: 'Status changed successfully'
    })
})

app.get('/api/gettodos', async (req, res) => {
    const todos = await Todo.find();
    res.status(200).json(todos);
})

app.post('/api/changestatustitle', async (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    await Todo.findByIdAndUpdate(id,{title});
    res.status(200).json({
        message: 'Status changed successfully'
    })
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});

