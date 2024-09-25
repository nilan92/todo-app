import React from 'react';
import Todo from './components/Todo';
import { Container } from '@mui/material';

const App = () => {
  return (
    <Container>
      <h1>Todo App</h1>
      <Todo />
    </Container>
  );
};

export default App;
