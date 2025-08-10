import express from "express";
import cors from "cors";
import type { RowDataPacket } from 'mysql2';
import type { ResultSetHeader } from 'mysql2';
import connection from "./db.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

interface Todo extends RowDataPacket {
    id: number;
    text: string;
    completed: boolean;
    created_at: Date;
}


app.get("/todos", async (req, res) => {
    try {
        const [todos] = await connection.execute<Todo[]>("SELECT * FROM todos");
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

        const [result] = await connection.execute<ResultSetHeader>(
            "INSERT INTO todos (text) VALUES (?)",
            [text]
        );

        const [newTodo] = await connection.execute<Todo[]>(
            "SELECT * FROM todos WHERE id = ?",
            [result.insertId]
        );

        res.status(201).json(newTodo[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
