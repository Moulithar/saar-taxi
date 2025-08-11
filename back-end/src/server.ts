import express from "express";
import cors from "cors";
import type { RowDataPacket } from "mysql2";
import type { ResultSetHeader } from "mysql2";
import pool from "./db.js";

const app = express();
const PORT = 4000;

// Replace line 10 with this:
// Replace line 10 with this:
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

app.use(express.json());

interface Todo extends RowDataPacket {
  id: number;
  text: string;
  completed: boolean;
  created_at: Date;
}

app.get("/", async (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/api/todos", async (req, res) => {
  try {
    const [todos] = await pool.execute<Todo[]>("SELECT * FROM todos");
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/todos", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO todos (text) VALUES (?)",
      [text]
    );

    const [newTodo] = await pool.execute<Todo[]>(
      "SELECT * FROM todos WHERE id = ?",
      [result.insertId]
    );

    // Send updated todos to all SSE clients
    await sendTodosToClients();
    
    res.status(201).json(newTodo[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { text, completed } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    if (text === undefined && completed === undefined) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Build dynamic update query based on provided fields
    const updateFields = [];
    const queryParams = [];

    if (text !== undefined) {
      updateFields.push("text = ?");
      queryParams.push(text);
    }

    if (completed !== undefined) {
      updateFields.push("completed = ?");
      queryParams.push(completed);
    }

    queryParams.push(id); // Add id for WHERE clause

    const query = `UPDATE todos SET ${updateFields.join(", ")} WHERE id = ?`;

    const [result] = await pool.execute<ResultSetHeader>(query, queryParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const [updatedTodo] = await pool.execute<Todo[]>(
      "SELECT * FROM todos WHERE id = ?",
      [id]
    );

    // Send updated todos to all SSE clients
    await sendTodosToClients();
    
    res.status(200).json(updatedTodo[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    // First get the todo we're about to delete
    const [todos] = await pool.execute<Todo[]>(
      "SELECT * FROM todos WHERE id = ?",
      [id]
    );

    if (todos.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const deletedTodo = todos[0];

    // Then delete it
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM todos WHERE id = ?",
      [id]
    );

    // Send updated todos to all SSE clients
    await sendTodosToClients();

    res.status(200).json({
      message: "Todo deleted successfully",
      deletedTodo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});



// Store all SSE clients
const clients = new Set<{ id: string; res: express.Response }>();

// Function to send todos to all connected clients
async function sendTodosToClients() {
  try {
    // Fetch current todos
    const [todos] = await pool.execute<Todo[]>("SELECT * FROM todos");
    
    // Send to all connected clients
    clients.forEach(client => {
      client.res.write(`data: ${JSON.stringify(todos)}\n\n`);
    });
  } catch (error) {
    console.error('Error sending todos to clients:', error);
  }
}

app.get('/events', (req, res) => {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Allow CORS for SSE
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Generate a unique client ID
    const clientId = Date.now().toString();
    
    // Add this client to our set
    const client = { id: clientId, res };
    clients.add(client);
    
    // Send initial todos data when client connects
    sendTodosToClients();
    
    // Clean up when the client disconnects
    req.on('close', () => {
        clients.delete(client);
        res.end();
    });
});



app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
