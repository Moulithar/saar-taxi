import React, { useEffect, useState } from "react";
import { getGreeting } from "../utils/greetings";

export default function Home() {
  const greeting = getGreeting("Mouli");

  const [text, setText] = useState('');
  const [message, setMessage] = useState('');

const [todos, setTodos] = useState([]);

const fetchTodos = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`);
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
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


  useEffect(() => {
 
    fetchTodos();
  }, []);
    
  

  return (
    <div>
      <h1>Sigma sigma boy</h1>
      <p>Forget the safety, be where you fear to live, destroy reputation, be notorious</p>
      <h1>{greeting}</h1>
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
      {message && <p>{message}</p>}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
    </div>
  );
}

