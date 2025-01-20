import React, { useState, useEffect } from 'react';
import { Check, X, Info, Plus, Trash2 } from 'lucide-react';

const TodoList = () => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  
  const [newTodo, setNewTodo] = useState(() => {
    const savedNewTodo = localStorage.getItem('newTodo');
    return savedNewTodo || '';
  });
  
  const [description, setDescription] = useState(() => {
    const savedDescription = localStorage.getItem('description');
    return savedDescription || '';
  });
  
  const [priority, setPriority] = useState(() => {
    const savedPriority = localStorage.getItem('priority');
    return savedPriority || 'low';
  });
  
  const [dueDate, setDueDate] = useState(() => {
    const savedDueDate = localStorage.getItem('dueDate');
    return savedDueDate || '';
  });
  
  const [selectedTodo, setSelectedTodo] = useState(null);

  const priorityColors = {
    low: 'border-purple-200',
    medium: 'border-purple-400',
    high: 'border-purple-600',
    completed: 'bg-green-100 border-green-500',
  };

  useEffect(() => {
    localStorage.setItem('newTodo', newTodo);
  }, [newTodo]);

  useEffect(() => {
    localStorage.setItem('description', description);
  }, [description]);

  useEffect(() => {
    localStorage.setItem('priority', priority);
  }, [priority]);

  useEffect(() => {
    localStorage.setItem('dueDate', dueDate);
  }, [dueDate]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() && dueDate) {
      const newTodoItem = {
        id: Date.now().toString(),
        title: newTodo.trim(),
        description: description.trim(),
        completed: false,
        priority,
        dueDate,
      };
      
      setTodos(prevTodos => [...prevTodos, newTodoItem]);
      
      setNewTodo('');
      setDescription('');
      setPriority('low');
      setDueDate('');
      localStorage.removeItem('newTodo');
      localStorage.removeItem('description');
      localStorage.removeItem('priority');
      localStorage.removeItem('dueDate');
    } else {
      alert('Please provide both a task title and a due date. ⚠️');
    }
  };

  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter((todo) => todo.id !== id));
  };

  const showDetails = (todo) => {
    setSelectedTodo(todo);
    localStorage.setItem('selectedTodo', JSON.stringify(todo));
  };

  const closeDetails = () => {
    setSelectedTodo(null);
    localStorage.removeItem('selectedTodo');
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return a.completed ? 1 : -1;
  });

  return (
    <section className="min-h-screen bg-[#f9f4ff] p-8">
      <div className="max-w-3xl mx-auto bg-[#f9f4ff] p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-700 mb-6 flex items-center gap-2">
          📝 <span>Your To-Do List</span>
        </h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Task Title ✨"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 bg-white transition"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description 📝"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 bg-white transition"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 bg-white transition"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 bg-white transition"
          />
          <button
            onClick={addTodo}
            className="flex items-center gap-2 px-6 py-3 text-white bg-[#916bbf] rounded-full hover:bg-[#7052a3] transition-all transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Task 
          </button>
        </div>

        <div className="bg-[#ffffff] p-4 rounded-lg border shadow-sm">
          {sortedTodos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center justify-between p-3 rounded mb-3 shadow border-2 ${
                todo.completed
                  ? priorityColors.completed
                  : priorityColors[todo.priority]
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="text-green-500 hover:text-green-700 transition"
                >
                  {todo.completed ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                </button>
                <span
                  className={`text-gray-700 font-medium ${
                    todo.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {todo.title} {todo.completed ? '✅' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showDetails(todo)}
                  className="text-purple-500 hover:text-purple-700 transition"
                >
                  <Info className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedTodo && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-[#f8f6fa] p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4 text-gray-700">
                📋 {selectedTodo.title}
              </h2>
              <p className="mb-2">
                <strong className="text-gray-600">Description:</strong>{' '}
                {selectedTodo.description || 'No description provided.'}
              </p>
              <p className="mb-2">
                <strong className="text-gray-600">Priority:</strong> {selectedTodo.priority} 🔥
              </p>
              <p className="mb-2">
                <strong className="text-gray-600">Due Date:</strong>{' '}
                {selectedTodo.dueDate || 'No due date set.'}
              </p>
              <button
                onClick={closeDetails}
                className="mt-4 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition"
              >
                Close ✖️
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TodoList;