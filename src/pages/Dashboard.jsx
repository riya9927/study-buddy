import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  ListTodo, 
  ChevronRight,
  BookOpen,
  Book,
  Map,
  User
} from 'lucide-react';

const motivationalQuotes = [
  {
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
  },
  {
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
  },
  {
    text: 'Don\'t watch the clock; do what it does. Keep going.',
    author: 'Sam Levenson',
  },
  {
    text: 'Believe you can and you\'re halfway there.',
    author: 'Theodore Roosevelt',
  },
  {
    text: 'Act as if what you do makes a difference. It does.',
    author: 'William James',
  },
  {
    text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.',
    author: 'Ralph Waldo Emerson',
  },
  {
    text: 'Your time is limited, don\'t waste it living someone else\'s life.',
    author: 'Steve Jobs',
  },
  {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  },
  {
    text: 'Success usually comes to those who are too busy to be looking for it.',
    author: 'Henry David Thoreau',
  },
  {
    text: 'Hard work beats talent when talent doesn\'t work hard.',
    author: 'Tim Notke',
  },
  {
    text: 'The only limit to our realization of tomorrow is our doubts of today.',
    author: 'Franklin D. Roosevelt',
  },
  {
    text: 'Dream big and dare to fail.',
    author: 'Norman Vaughan',
  },
  {
    text: 'It\'s not whether you get knocked down, it\'s whether you get up.',
    author: 'Vince Lombardi',
  },
  {
    text: 'If you\'re going through hell, keep going.',
    author: 'Winston Churchill',
  },
  {
    text: 'The harder you work for something, the greater you\'ll feel when you achieve it.',
    author: 'Anonymous',
  },
  {
    text: 'Success is walking from failure to failure with no loss of enthusiasm.',
    author: 'Winston Churchill',
  },
  {
    text: 'You don\'t have to be great to start, but you have to start to be great.',
    author: 'Zig Ziglar',
  },
  {
    text: 'Go the extra mile. It\'s never crowded there.',
    author: 'Dr. Wayne D. Dyer',
  },
  {
    text: 'Do what you can, with what you have, where you are.',
    author: 'Theodore Roosevelt',
  },
  {
    text: 'Don\'t stop when you\'re tired. Stop when you\'re done.',
    author: 'Wesley Snipes',
  },
  {
    text: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain',
  },
  {
    text: 'The only way to achieve the impossible is to believe it is possible.',
    author: 'Charles Kingsleigh',
  },
  {
    text: 'Opportunities don\'t happen. You create them.',
    author: 'Chris Grosser',
  },
  {
    text: 'Don\'t be pushed around by the fears in your mind. Be led by the dreams in your heart.',
    author: 'Roy T. Bennett',
  },
  {
    text: 'Setting goals is the first step in turning the invisible into the visible.',
    author: 'Tony Robbins',
  },
  {
    text: 'Great things are done by a series of small things brought together.',
    author: 'Vincent Van Gogh',
  },
  {
    text: 'You are never too old to set another goal or to dream a new dream.',
    author: 'C.S. Lewis',
  },
  {
    text: 'It always seems impossible until it\'s done.',
    author: 'Nelson Mandela',
  },
  {
    text: 'Keep your face always toward the sunshine—and shadows will fall behind you.',
    author: 'Walt Whitman',
  },
  {
    text: 'The best time to plant a tree was 20 years ago. The second best time is now.',
    author: 'Chinese Proverb',
  },
  {
    text: 'Don\'t wait. The time will never be just right.',
    author: 'Napoleon Hill',
  },
  {
    text: 'Start where you are. Use what you have. Do what you can.',
    author: 'Arthur Ashe',
  },
  {
    text: 'Happiness is not something ready made. It comes from your own actions.',
    author: 'Dalai Lama',
  },
  {
    text: 'The journey of a thousand miles begins with one step.',
    author: 'Lao Tzu',
  },
  {
    text: 'Don\'t limit your challenges. Challenge your limits.',
    author: 'Jerry Dunn',
  },
  {
    text: 'You miss 100% of the shots you don\'t take.',
    author: 'Wayne Gretzky',
  },
  {
    text: 'Perseverance is not a long race; it is many short races one after the other.',
    author: 'Walter Elliot',
  },
  {
    text: 'Success is how high you bounce when you hit bottom.',
    author: 'George S. Patton',
  },
  {
    text: 'Courage is resistance to fear, mastery of fear—not absence of fear.',
    author: 'Mark Twain',
  },
  {
    text: 'What you get by achieving your goals is not as important as what you become by achieving your goals.',
    author: 'Zig Ziglar',
  },
  {
    text: 'Life is 10% what happens to us and 90% how we react to it.',
    author: 'Charles R. Swindoll',
  },
  {
    text: 'Do not wait to strike till the iron is hot; but make it hot by striking.',
    author: 'William Butler Yeats',
  },
  {
    text: 'Fall seven times and stand up eight.',
    author: 'Japanese Proverb',
  },
  {
    text: 'Success is getting what you want. Happiness is wanting what you get.',
    author: 'Dale Carnegie',
  },
  {
    text: 'Don\'t wish it were easier. Wish you were better.',
    author: 'Jim Rohn',
  },
  {
    text: 'Even if you are on the right track, you\'ll get run over if you just sit there.',
    author: 'Will Rogers',
  },
  {
    text: 'Do one thing every day that scares you.',
    author: 'Eleanor Roosevelt',
  },
  {
    text: 'You are braver than you believe, stronger than you seem, and smarter than you think.',
    author: 'A.A. Milne',
  },
  {
    text: 'Keep your eyes on the stars, and your feet on the ground.',
    author: 'Theodore Roosevelt',
  },
  {
    text: 'Don\'t count the days. Make the days count.',
    author: 'Muhammad Ali',
  },
  {
    text: 'In the middle of every difficulty lies opportunity.',
    author: 'Albert Einstein',
  },
  {
    text: 'A winner is a dreamer who never gives up.',
    author: 'Nelson Mandela',
  },
];

const Dashboard = () => {
  const [currentQuote, setCurrentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  const generateNewQuote = () => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(randomQuote);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 px-6 py-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-gray-700">
          Welcome back! 👋
        </h1>

        <div
          className="bg-white p-8 rounded-2xl shadow-lg cursor-pointer relative overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
          onClick={generateNewQuote}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full transform translate-x-16 -translate-y-16 opacity-50" />
          <blockquote className="text-xl text-gray-700 italic relative z-10">
            "{currentQuote.text}"
            {currentQuote.author && (
              <footer className="mt-3 text-base text-purple-600 font-medium">
                — {currentQuote.author}
              </footer>
            )}
          </blockquote>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 relative pt-8">
          <div className="absolute inset-x-0 top-1/2 hidden lg:block">
            <svg className="w-full" height="40" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0,20 C200,20 300,40 400,20 C500,0 600,20 800,20 C1000,20 1100,0 1200,20"
                stroke="rgb(147 51 234 / 0.2)"
                fill="none"
                strokeWidth="2"
              />
            </svg>
          </div>

          <QuickAccessCard
            icon={Clock}
            title="Pomodoro Timer"
            description="Boost focus and productivity with timed sessions."
            link="/pomodoro"
            bgColor="bg-gradient-to-br from-purple-50 to-white"
            accentColor="text-purple-600"
            borderColor="border-purple-100"
            order={1}
          />
          <QuickAccessCard
            icon={CheckSquare}
            title="Habit Tracker"
            description="Build better habits with consistent tracking."
            link="/habits"
            bgColor="bg-gradient-to-br from-purple-100 to-white"
            accentColor="text-purple-600"
            borderColor="border-purple-200"
            order={2}
          />
          <QuickAccessCard
            icon={ListTodo}
            title="To do List"
            description="Stay on track with your tasks and goals."
            link="/todos"
            bgColor="bg-gradient-to-br from-purple-50 to-white"
            accentColor="text-purple-600"
            borderColor="border-purple-100"
            order={3}
          />
          <QuickAccessCard
            icon={CalendarIcon}
            title="Calendar View"
            description="Organize your day with ease and efficiency."
            link="/calendar"
            bgColor="bg-gradient-to-br from-purple-100 to-white"
            accentColor="text-purple-600"
            borderColor="border-purple-200"
            order={4}
          />
          <QuickAccessCard
            icon={BookOpen}
            title="Resources"
            description="Access knowledge and tools to elevate your learning"
            link="/resources"
            bgColor="bg-gradient-to-br from-purple-50 to-white"
            accentColor="text-purple-600"
            borderColor="border-purple-100"
            order={5}
          />
          <QuickAccessCard
            icon={Book}
            title="Journal"
            description="Capture your thoughts and track your journey daily."
            link="/journal"
            bgColor="bg-gradient-to-br from-purple-100 to-white"
            accentColor="text-purple-600"
            borderColor="border-purple-200"
            order={6}
          />
          <QuickAccessCard
            icon={Map}
            title="Roadmaps"
            description="Navigate your path with clear and structured guides."
            link="/roadmaps"
            bgColor="bg-gradient-to-br from-purple-50 to-white"
            accentColor="text-purple-600"
            borderColor="border-purple-100"
            order={7}
          />
          <QuickAccessCard
            icon={User}
            title="Profile"
            description="Manage your account and personal settings."
            link="/profile"
            bgColor="bg-gradient-to-br from-purple-100 to-white"
            accentColor="text-purple-600"
            borderColor="border-purple-200"
            order={8}
          />
        </div>
      </div>
    </div>
  );
};

const QuickAccessCard = ({ 
  icon: Icon, 
  title, 
  description, 
  link, 
  bgColor, 
  accentColor,
  borderColor,
  order 
}) => (
  <Link
    to={link}
    className={`
      group relative p-6 rounded-2xl border ${borderColor} ${bgColor}
      shadow-lg transition-all duration-300
      hover:shadow-xl hover:-translate-y-1
      flex flex-col items-start
      overflow-hidden
    `}
    style={{
      animationDelay: `${order * 150}ms`
    }}
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white to-transparent rounded-full transform translate-x-8 -translate-y-8" />
    
    <div className={`p-3 rounded-xl ${bgColor} ${borderColor} border mb-4 relative z-10`}>
      <Icon className={`w-6 h-6 ${accentColor}`} />
    </div>
    
    <h3 className="text-lg font-semibold text-gray-700 mb-2 relative z-10">{title}</h3>
    <p className="text-gray-700 mb-4 relative z-10">{description}</p>
    
    <div className={`
      mt-auto flex items-center gap-2 text-sm font-medium ${accentColor}
      opacity-0 transform translate-x-4 transition-all duration-300
      group-hover:opacity-100 group-hover:translate-x-0
    `}>
      <span>Get Started</span>
      <ChevronRight className="w-4 h-4" />
    </div>
  </Link>
);

export default Dashboard;
