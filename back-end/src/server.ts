import express from "express";
import cors from "cors";
import type { RowDataPacket } from 'mysql2';
import type { ResultSetHeader } from 'mysql2';
import pool from "./db.js";

const app = express();
const PORT = 4000;

// Replace line 10 with this:
// Replace line 10 with this:
app.use(cors({
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Allowed headers
}));

interface Todo extends RowDataPacket {
    id: number;
    text: string;
    completed: boolean;
    created_at: Date;
}


app.get("/", async (req, res) => {
    res.json({ message: "Hello World!" });
});


app.get("/todos", async (req, res) => {
    try {
        const [todos] = await pool.execute<Todo[]>("SELECT * FROM todos");
        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/todos", async (req, res) => {
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

        res.status(201).json(newTodo[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
app.delete("/todos/:id", async (req, res) => {
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

        res.status(200).json({
            message: "Todo deleted successfully",
            deletedTodo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


export default app;