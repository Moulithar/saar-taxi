// React component for displaying real-time todos with SSE
import React, { useEffect, useState } from 'react';

function About() {
    const [todos, setTodos] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:4000/events');

        eventSource.onopen = () => {
            console.log('SSE connection opened');
            setConnectionStatus('Connected');
        };

        eventSource.onmessage = (event) => {
            try {
                // Parse the JSON data from the SSE event
                const todosData = JSON.parse(event.data);
                setTodos(todosData);
            } catch (error) {
                console.error('Error parsing SSE data:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE error:', error);
            setConnectionStatus('Connection error - reconnecting...');
            // The browser will automatically try to reconnect
        };

        // Clean up on component unmount
        return () => {
            eventSource.close();
            console.log('SSE connection closed');
        };
    }, []);

    return (
        <div className="todos-container">
            <h1>Real-time Todo Updates</h1>
            <p className="connection-status">Status: {connectionStatus}</p>
            
            {todos.length === 0 ? (
                <p>No todos available yet</p>
            ) : (
                <ul className="todos-list">
                    {todos.map(todo => (
                        <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                            <span className="todo-text">{todo.text}</span>
                            <span className="todo-status">
                                {todo.completed ? '✓ Completed' : '◯ Pending'}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default About;