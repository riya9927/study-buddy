import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { 
  Home, 
  Timer, 
  CheckSquare, 
  ListTodo, 
  BookOpen, 
  Book, 
  Calendar as CalendarIcon, 
  Map,
  User
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/pomodoro', icon: Timer, label: 'Pomodoro' },
    { path: '/habits', icon: CheckSquare, label: 'Habits' },
    { path: '/todos', icon: ListTodo, label: 'Todo List' },
    { path: '/resources', icon: BookOpen, label: 'Resources' },
    { path: '/journal', icon: Book, label: 'Journal' },
    { path: '/calendar', icon: CalendarIcon, label: 'Calendar' },
    { path: '/roadmaps', icon: Map, label: 'Roadmaps' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside className="w-64 bg-[#9B7EBD] border-r border-gray-300 p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
      <div className="flex justify-center mb-8">
        <img src={assets.logo} alt="Study Buddy Logo" className="w-32 h-32 object-contain" />
      </div>
      <nav className="space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 transform hover:translate-y-[-5px] ${
                isActive
                  ? 'bg-[#BFA7DB] text-black shadow-md'
                  : 'text-black hover:bg-[#C9B8E6] hover:shadow-lg'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
