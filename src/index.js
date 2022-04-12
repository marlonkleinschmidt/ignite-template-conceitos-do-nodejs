const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
 
  const user = users.find(user => user.username === username);

  if(!user){
    return response.status(404).json({ error: "User not found"});
  }

  request.user = user;

  return next();

}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userExists = users.find((user) => user.username === username);

  if (userExists){
    return response.status(400).json({error: "Username already exists"})
  }
  
  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  users.push(user);
  
  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  const userTodo = {
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  user.todos.push(userTodo);

  return response.status(201).json(userTodo);
  

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;
  const { title, deadline } = request.body;

  const todoSearch = user.todos.find(todo=> todo.id === id );
  
  if (!todoSearch){
    return response.status(404).json({error: 'Todo not found'});
  }

  todoSearch.title = title;
  todoSearch.deadline = new Date(deadline);
  
  return response.json(todoSearch);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const todoSearch = user.todos.find(todo=> todo.id === id );

  if (!todoSearch){
    return response.status(404).json({error: 'Todo not found'});
  }

  todoSearch.done = true;

  return response.json(todoSearch);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const todoId = user.todos.findIndex(todo=> todo.id === id);
  
  if (todoId < 0){
    return response.status(404).json({error: 'Todo not found'});
  }

  user.todos.splice(todoId, 1);

  return response.status(204).json();

});

module.exports = app;