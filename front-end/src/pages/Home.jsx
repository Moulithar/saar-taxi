import React, { useEffect, useState } from "react";
import { getGreeting } from "../utils/greetings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const greeting = getGreeting("Mouli");

  const [text, setText] = useState('');
  const [message, setMessage] = useState('');

const [todos, setTodos] = useState([]);
const [editText, setEditText] = useState(null);

const fetchTodos = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}todos`);
    const data = await response.json();
    setTodos(data);
    setMessage('');
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      setMessage(`Todo created: ${data.text} (ID: ${data.id})`);
      setText('');
      fetchTodos();
    } catch (error) {
      setMessage('Error creating todo');
      console.error('Error:', error);
    }
  };


  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}todos/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      setMessage(`Todo deleted: ${data.text} (ID: ${data.id})`);
      fetchTodos();
    } catch (error) {
      setMessage('Error deleting todo');
      console.error('Error:', error);
    }
  };

  const updateTodo = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({text: editText }),
      });
      
      const data = await response.json();
      setMessage(`Todo updated: ${data.text} (ID: ${data.id})`);
      fetchTodos();
    } catch (error) {
      setMessage('Error updating todo');
      console.error('Error:', error);
    }
  };

const [editTodo, setEditTodo] = useState(null);


useEffect(() => {
  if (editTodo) {
    setEditText(todos.find(todo => todo.id === editTodo).text);
  }
}, [editTodo]);

  useEffect(() => {
 
    fetchTodos();
  }, []);
    
  

  return (
    <div>
     
      {/* ...rest of your home page */}

      <div style={{ padding: '20px' }}>
      <h2>Test Todo API</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter todo text"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button type="submit">Add Todo</button>
      </form>

      <ul>
        {(Array.isArray(todos) && todos || []).map((todo) => (
          <li key={todo.id} className="flex justify-between mb-2 gap-[24px]">
            <Input value={editTodo === todo.id ? editText : todo.text} disabled={editTodo != todo.id} onChange={(e) => setEditText(e.target.value)} />
            <div className="flex gap-2">

<h1>{todo.id}</h1> <h1>{todo.id}</h1>
            {editTodo === todo.id && (
            <Button  variant="primary" onClick={() => updateTodo(todo.id)}>Update</Button>
            )}
            <Button  variant="outline" onClick={() => setEditTodo(todo.id)}>Edit</Button>
            <Button  variant="destructive" onClick={() => deleteTodo(todo.id)}>Delete</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}

