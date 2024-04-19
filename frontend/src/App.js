import './App.css';
import React, { useEffect, useState } from'react';
import axios from 'axios';

function App() {

  const [todoList, setTodoList] = useState([]);
  const [EnterText, setEnterText] = useState('');
  const [editmode,setEditmode] = useState('');

  useEffect(()=>{
    axios.get("http://localhost:8001/api/gettodos").then((responce)=>{
      console.log(responce.data)
      setTodoList(responce.data);
    })
  },[])

  const addTodoData = async() =>{
const data = {
  title:EnterText,
}
const responce = await axios.post("http://localhost:8001/api/addtodos",data,{headers:{
  "Content-Type":'application/json'
}});

console.log(responce)


  const todo_data = [...todoList];
  todo_data.push(responce.data);
  console.log(todo_data)
  setTodoList(todo_data);
    setEnterText('');
  }

  const DeleteTodo = async(index,ids)=>{
    const responce = await axios.post(`http://localhost:8001/api/deletetodos`,{id:ids},{headers:{
      "Content-Type":'application/json'
    }});
    console.log(responce)
    const todo_data = [...todoList];
    todo_data.splice(index,1);
    setTodoList(todo_data);
  }

  const changestatus = async(index,ids)=>{
    const todo_data = [...todoList];
if(!todo_data[index].completed){
  const responce = await axios.post(`http://localhost:8001/api/changestatus`,{id:ids},{headers:{
    "Content-Type":'application/json'
  }});
  console.log(responce)
  todo_data[index].completed =!todo_data[index].completed;
  setTodoList(todo_data);
}
  }

const changestatustitle = async(dataId)=>{
  const dataIds = dataId.split('@');
  console.log(dataIds)
  const todo_data = [...todoList];
const responce = await axios.post(`http://localhost:8001/api/changestatustitle`,{id:dataIds[1],title:EnterText},{headers:{
  "Content-Type":'application/json'
}});
console.log(responce)
todo_data[dataIds[0]].title = EnterText
setTodoList(todo_data);
setEnterText('')
setEditmode('');

    
  }

  return (
    <div className="App">
   <div>TodoList</div>
   <input type="text" value={EnterText} onChange={(e)=>setEnterText(e.target.value)}/>
   <button onClick={()=>{editmode !== '' ? changestatustitle(editmode) : addTodoData()}}> {editmode !== '' ?'Edit':'Add'}</button>
   <div style={{backgroundColor:'#ebe7e7',width:'50%',margin:'auto'}}>
   {
    todoList.map((item, index) => {
      return (
      
      <div key={index} style={{display:'flex',flexDirection:'row',marginTop:'5%',padding:'2%',boxShadow:'0 4px 8px rgba(0,0,0,0.1)',borderRadius:'50px'}}>
        <div style={{width:'10%'}}>{index +1}</div>
        <div style={{width:'30%'}}>{item.title}</div>
        <div style={{width:'60%'}}>
        <button style={{marginLeft:'10%',padding:'1%',borderRadius:'20px',backgroundColor: item.completed ? 'grey':'blue',color:'white',cursor:'pointer',border:'none'}} onClick={()=>{setEditmode(index+'@'+item._id);setEnterText(item.title)}} disabled = {item.completed}>Edit</button>

<button style={{marginLeft:'10%',padding:'1%',borderRadius:'20px',backgroundColor:item.completed ? 'grey' : 'green',color:'white',cursor:'pointer',border:'none'}} onClick={()=>changestatus(index,item._id)} disabled = {item.completed}>Complete</button>

<button style={{marginLeft:'10%',padding:'1%',borderRadius:'20px',backgroundColor:'red',color:'white',cursor:'pointer',border:'none'}} onClick={()=>DeleteTodo(index,item._id)}>Delete</button>
          </div>
       
        </div>
    
    )
    })
   }
   </div>
  
    </div>
  );
}

export default App;
