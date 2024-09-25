import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    TextField,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Snackbar,
    CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

const Todo = () => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Fetch tasks from the API
    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/tasks');
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // Add a new task
    const addTask = async () => {
        if (!task) return; // Prevent adding empty tasks
        try {
            const response = await axios.post('http://localhost:5000/api/tasks', { task });
            setTasks([...tasks, response.data]); // Update state with the new task
            setTask(''); // Clear input field
            setSnackbarMessage('Task added successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    // Remove a task
    const removeTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`);
            setTasks(tasks.filter(t => t.id !== id)); // Update state to remove the task
            setSnackbarMessage('Task removed successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error removing task:', error);
        }
    };

    // Toggle task completion
    const toggleTask = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:5000/api/tasks/${id}`);
            setTasks(tasks.map(t => (t.id === id ? response.data : t))); // Update state with the toggled task
            setSnackbarMessage('Task toggled successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Todo App</Typography>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2} style={{ padding: '20px' }}>
                <Grid item xs={12} md={6}>
                    <TextField
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        label="Add a new task"
                        variant="outlined"
                        fullWidth
                        style={{ marginBottom: '10px' }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Button
                        onClick={addTask}
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        fullWidth
                    >
                        Add Task
                    </Button>
                </Grid>
            </Grid>
            {loading ? (
                <CircularProgress />
            ) : (
                <List>
                    {tasks.map((t) => (
                        <ListItem key={t.id}>
                            <Card style={{ width: '100%', marginBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                <CardContent>
                                    <ListItemText
                                        primary={t.task}
                                        style={{ textDecoration: t.completed ? 'line-through' : 'none' }}
                                    />
                                    <IconButton onClick={() => toggleTask(t.id)} color="primary">
                                        <CheckIcon />
                                    </IconButton>
                                    <IconButton onClick={() => removeTask(t.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        </ListItem>
                    ))}
                </List>
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </div>
    );
};

export default Todo;
