import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { format, startOfWeek, addDays } from 'date-fns';

const HabitTracker = () => {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habits');
    return savedHabits ? JSON.parse(savedHabits) : [];
  });
  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeek(new Date()), i);
    return {
      date,
      dayName: format(date, 'EEE'),
      fullDate: format(date, 'yyyy-MM-dd'),
    };
  });

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([
        ...habits,
        {
          id: Date.now().toString(),
          name: newHabit.trim(),
          streak: 0,
          completedDates: [],
        },
      ]);
      setNewHabit('');
    }
  };

  const toggleHabitCompletion = (habitId, date) => {
    setHabits(habits.map((habit) => {
      if (habit.id === habitId) {
        const completedDates = habit.completedDates.includes(date)
          ? habit.completedDates.filter((d) => d !== date)
          : [...habit.completedDates, date];

        return {
          ...habit,
          completedDates,
          streak: calculateStreak(completedDates),
        };
      }
      return habit;
    }));
  };

  const calculateStreak = (dates) => {
    return dates.length;
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter((habit) => habit.id !== habitId));
  };

  return (
    <div className="min-h-screen bg-[#f9f4ff] p-6">
      <h1 className="text-4xl font-bold text-[#574b90] mb-8 text-center">
      🌟 <span className="text-gray-700">Habit Tracker</span> 🌟
      </h1>

      <div className="flex gap-4 items-center justify-center mb-8">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Enter a new habit 📝..."
          className="flex-1 max-w-md px-4 py-3 rounded-xl border border-[#b9a2d8] text-black bg-white focus:ring-4 focus:ring-[#c9a9f7] transition-all"
          onKeyPress={(e) => e.key === 'Enter' && addHabit()}
        />
        <button
          onClick={addHabit}
          className="flex items-center gap-2 px-6 py-3 text-white bg-[#916bbf] rounded-full hover:bg-[#7052a3] transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Habit
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-[2fr,repeat(7,1fr),1fr] gap-4 p-4 bg-[#916bbf] text-white text-center font-semibold">
          <div className="text-left">Habit</div>
          {weekDays.map(({ dayName }) => (
            <div key={dayName} className="uppercase">{dayName}</div>
          ))}
          <div>🔥 Streak</div>
        </div>

        {habits.map((habit) => (
          <div
            key={habit.id}
            className="grid grid-cols-[2fr,repeat(7,1fr),1fr] gap-4 p-4 border-b border-[#d7d2e9] items-center bg-[#f4f0ff] hover:bg-[#efe9ff] transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-[#574b90]">{habit.name} </span>
              <button
                onClick={() => deleteHabit(habit.id)}
                className="text-gray-400 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            {weekDays.map(({ fullDate }) => (
              <div key={fullDate} className="flex justify-center">
                <button
                  onClick={() => toggleHabitCompletion(habit.id, fullDate)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transform transition-all ${
                    habit.completedDates.includes(fullDate)
                      ? 'bg-[#916bbf] text-white scale-105'
                      : 'bg-gray-200 text-gray-400 hover:bg-gray-300 hover:scale-105'
                  }`}
                >
                  <Check className="w-6 h-6" />
                </button>
              </div>
            ))}
            <div className="text-center text-xl font-bold text-[#916bbf] animate-pulse">
              {habit.streak}
            </div>
          </div>
        ))}
      </div>

      {habits.length === 0 && (
        <div className="text-center text-lg mt-8 text-gray-600">
          No habits yet... Start tracking now! 🌟
        </div>
      )}
    </div>
  );
};

export default HabitTracker;