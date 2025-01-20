import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Pomodoro from './pages/Pomodoro';
import HabitTracker from './pages/HabitTracker';
import TodoList from './pages/TodoList';
import Resources from './pages/Resources';
import Journal from './pages/Journal';
import Calendar from './pages/Calendar';
import Roadmaps from './pages/Roadmaps';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pomodoro" element={<Pomodoro />} />
            <Route path="/habits" element={<HabitTracker />} />
            <Route path="/todos" element={<TodoList />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/roadmaps" element={<Roadmaps />} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
          
        </main>
      </div>
    </Router>
  );
}

export default App;