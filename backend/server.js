const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = 5000;

// Set up SQLite database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite', // This will create a file named database.sqlite
});

// Define Task model
const Task = sequelize.define('Task', {
    task: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sync the database
sequelize.sync().then(() => {
    console.log('Database & tables created!');
});

// Get all tasks
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.findAll();
    res.json(tasks);
});

// Add a new task
app.post('/api/tasks', async (req, res) => {
    const newTask = await Task.create({ task: req.body.task });
    res.status(201).json(newTask);
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    await Task.destroy({ where: { id: req.params.id } });
    res.status(204).send();
});

// Toggle task completion
app.patch('/api/tasks/:id', async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    if (task) {
        task.completed = !task.completed;
        await task.save();
        res.json(task);
    } else {
        res.status(404).send();
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
