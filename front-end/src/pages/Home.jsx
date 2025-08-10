import React, { useEffect, useRef, useState } from "react";
import { getGreeting } from "../utils/greetings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";

export default function Home() {
  const greeting = getGreeting("Mouli");

  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  const [todos, setTodos] = useState([]);
  const [editText, setEditText] = useState(null);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}todos`);
      const data = await response.json();
      setTodos(data);
      setMessage("");
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setMessage(`Todo created: ${data.text} (ID: ${data.id})`);
      setText("");
      fetchTodos();
    } catch (error) {
      setMessage("Error creating todo");
      console.error("Error:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}todos/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      setMessage(`Todo deleted: ${data.text} (ID: ${data.id})`);
      fetchTodos();
    } catch (error) {
      setMessage("Error deleting todo");
      console.error("Error:", error);
    }
  };

  const updateTodo = async (id, completed) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}todos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: editText || undefined }),
        }
      );

      const data = await response.json();
      setMessage(`Todo updated: ${data.text} (ID: ${data.id})`);
      fetchTodos();
      setEditTodo(null);
    } catch (error) {
      setMessage("Error updating todo");
      console.error("Error:", error);
    }
  };
  const updateCompleted = async (id, completed) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}todos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: Boolean(completed) ? 1 : 0 }),
        }
      );

      const data = await response.json();
      setMessage(`Todo updated: ${data.text} (ID: ${data.id})`);
      fetchTodos();
      setEditTodo(null);
    } catch (error) {
      setMessage("Error updating todo");
      console.error("Error:", error);
    }
  };

  const [editTodo, setEditTodo] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (editTodo) {
      setEditText(todos.find((todo) => todo.id === editTodo).text);
    }
  }, [editTodo]);

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      {/* ...rest of your home page */}

      <div style={{ padding: "20px" }} className="flex justify-center">
        <div>
          <form
            onSubmit={handleSubmit}
            className="w-[60vw]"
            style={{ display: "flex", gap: "10px", padding: "20px 0px" }}
          >
            <Input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter todo text"
              style={{ padding: "8px", marginRight: "10px" }}
            />
            <Button type="submit">Add Todo</Button>
          </form>

          <ul className="w-[60vw]">
            {((Array.isArray(todos) && todos) || []).map((todo) => (
              <li
                key={todo.id}
                className="flex justify-between mb-2 gap-[24px]"
              >
                <div className="flex items-center gap-[24px]">

                <Button
                    variant="ghost"
                 onMouseDown={(e) => {
                   e.preventDefault();
                   updateCompleted(todo.id, !todo.completed);
                 }}
                  >
                    <CheckCircle2 color={
                      todo.completed ? "green" : "gray"
                    } />
                  </Button>
                {editTodo == todo.id ? (
                  <Input
                    value={editTodo === todo.id ? editText : todo.text}
                    disabled={editTodo !== todo.id}
                    autoFocus
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={(e) => {
                      setEditTodo(null);
                    }}
                  />
                ) : (
                  <h1 style={{ textDecoration: todo.completed ? "line-through" : "none" }}>{todo.text}</h1>
                )}
                </div>

                <div className="flex gap-2 todo-actions">
                  {editTodo === todo.id && (
                    <Button
                      variant="primary"
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent input blur
                        updateTodo(todo.id);
                      }}
                    >
                      Update
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input blur
                      if (editTodo === todo.id) {
                        setEditTodo(null);
                      } else {
                        setEditTodo(todo.id);
                      }
                    }}
                  >
                    {editTodo === todo.id ? "Cancel" : "Edit"}
                  </Button>
                  <Button
                    variant="destructive"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input blur
                      deleteTodo(todo.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
