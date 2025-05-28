import express = require('express');
import { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

let todos: Todo[] = [
    { id: 1, text: 'Buy groceries', completed: false },
    { id: 2, text: 'Finish coding challenge', completed: false },
    { id: 3, text: 'Go for a run', completed: true },
];

app.get('/api/todos', (req: Request, res: Response) => {
    return res.json(todos);
});

app.get('/api/todos/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (todo) {
        return res.json(todo);
    } else {
        return res.status(404).json({ message: 'Todo item not found.' });
    }
});

app.delete('/api/todos', (req: Request, res: Response) => {
    const { id } = req.body;

    if (id === undefined) {
        return res.status(400).json({ message: 'ID is required in the request body.' });
    }

    const initialLength = todos.length;
    todos = todos.filter(todo => todo.id !== id);

    if (todos.length < initialLength) {
        return res.status(200).json({ message: `Todo item with ID ${id} deleted successfully.`, todos });
    } else {
        return res.status(404).json({ message: `Todo item with ID ${id} not found.` });
    }
});

app.put('/api/todos', (req: Request, res: Response) => {
    const { id, newText } = req.body;

    if (id === undefined || newText === undefined) {
        return res.status(400).json({ message: 'ID and newText are required in the request body.' });
    }

    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex !== -1) {
        todos[todoIndex].text = newText;
        return res.status(200).json({ message: `Todo item with ID ${id} updated successfully.`, updatedTodo: todos[todoIndex] });
    } else {
        return res.status(404).json({ message: `Todo item with ID ${id} not found.` });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});