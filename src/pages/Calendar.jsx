import React, { useState, useEffect } from 'react';
import ReactCalendar from 'react-calendar';
import { Plus, Clock, BookOpen, ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

const Calendar = () => {
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [view, setView] = useState(() => {
    return localStorage.getItem('calendarView') || 'month';
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'study',
    description: '',
    date: new Date(),
    time: '12:00'
  });

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('calendarView', view);
  }, [view]);

  const addEvent = () => {
    if (newEvent.title.trim()) {
      const eventDateTime = new Date(newEvent.date);
      const [hours, minutes] = newEvent.time.split(':');
      eventDateTime.setHours(parseInt(hours), parseInt(minutes));

      if (editingEvent) {
        const updatedEvents = events.map(event =>
          event.id === editingEvent.id
            ? { ...event, ...newEvent, date: eventDateTime }
            : event
        );
        setEvents(updatedEvents);
        setEditingEvent(null);
      } else {
        const eventToAdd = {
          id: Date.now().toString(),
          ...newEvent,
          date: eventDateTime,
        };
        setEvents([...events, eventToAdd]);
      }
      setNewEvent({
        title: '',
        type: 'study',
        description: '',
        date: new Date(),
        time: '12:00'
      });
      setShowAddEvent(false);
    }
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const editEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      type: event.type,
      description: event.description,
      date: new Date(event.date),
      time: new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    });
    setSelectedDate(new Date(event.date));
    setShowAddEvent(true);
  };

  const getEventsForDate = (date) => {
    return events.filter(
      event =>
        new Date(event.date).getDate() === date.getDate() &&
        new Date(event.date).getMonth() === date.getMonth() &&
        new Date(event.date).getFullYear() === date.getFullYear()
    );
  };

  const getLatestEvent = () => {
    if (events.length === 0) return null;
    return events.reduce((latest, current) =>
      new Date(current.date) > new Date(latest.date) ? current : latest
    );
  };

  const getEventTypeColor = (type) => {
    const colors = {
      exam: 'bg-red-100 text-red-800 border-red-200',
      assignment: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      study: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[type] || colors.study;
  };

  const formatEventDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWeekDates = () => {
    const curr = new Date(selectedDate);
    const week = [];
    curr.setDate(curr.getDate() - curr.getDay());
    for (let i = 0; i < 7; i++) {
      week.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
    return week;
  };

  const renderCalendarView = () => {
    switch (view) {
      case 'week':
        return (
          <div className="grid grid-cols-7 gap-4">
            {getWeekDates().map((date, index) => (
              <div
                key={index}
                className="p-4 bg-purple-50 rounded-lg min-h-[200px]"
              >
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-lg font-bold text-gray-900 mb-4">
                  {date.getDate()}
                </div>
                {getEventsForDate(date).map(event => (
                  <div
                    key={event.id}
                    className={`p-2 rounded-lg mb-2 ${getEventTypeColor(event.type)}`}
                  >
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      case 'day':
        return (
          <div className="p-6 bg-purple-50 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            <div className="space-y-4">
              {getEventsForDate(selectedDate).map(event => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg ${getEventTypeColor(event.type)}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm">{event.description}</p>
                      <div className="text-sm mt-2">
                        {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editEvent(event)}
                        className="p-1 hover:bg-white rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="p-1 hover:bg-white rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <ReactCalendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={({ date }) => {
              const dayEvents = getEventsForDate(date);
              return dayEvents.length > 0 ? (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              ) : null;
            }}
            className="border-0 w-full"
            prevLabel={<ChevronLeft className="w-4 h-4 text-gray-500" />}
            nextLabel={<ChevronRight className="w-4 h-4 text-gray-500" />}
            tileClassName={({ date }) => `
              rounded-lg hover:bg-purple-50 text-gray-700
              ${getEventsForDate(date).length > 0 ? 'font-bold' : ''}
            `}
            navigationLabel={({ date }) => (
              <span className="text-gray-700 font-medium">
                {date.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
              </span>
            )}
          />
        );
    }
  };

  const renderAllEvents = () => {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">All Events</h2>
          <p className="text-sm text-gray-500">{events.length} total events</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map(event => (
              <div
                key={event.id}
                className={`p-4 rounded-xl border ${event.type === 'exam'
                    ? 'border-red-200'
                    : event.type === 'assignment'
                      ? 'border-yellow-200'
                      : 'border-green-200'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${event.type === 'exam'
                          ? 'bg-red-400'
                          : event.type === 'assignment'
                            ? 'bg-yellow-400'
                            : 'bg-green-400'
                        }`}
                    />
                    <h3 className="font-medium text-gray-700">{event.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editEvent(event)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-4 h-4" />
                  {formatEventDate(event.date)}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getEventTypeColor(event.type)
                    }`}
                >
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f7fd] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-700">Calendar</h1>
              <p className="text-sm text-gray-500">Manage your schedule</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-gray-500">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Add upcoming events</h2>
            <div className="space-y-4">
              

              <button
                onClick={() => {
                  setEditingEvent(null);
                  setNewEvent({
                    title: '',
                    type: 'study',
                    description: '',
                    date: new Date(),
                    time: '12:00'
                  });
                  setShowAddEvent(true);
                }}
                className="w-full p-4 rounded-xl border border-dashed border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add new event
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => setView('month')}
                    className={`px-4 py-2 ${view === 'month'
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-500 hover:bg-purple-50'
                      } rounded-lg text-sm font-medium`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setView('week')}
                    className={`px-4 py-2 ${view === 'week'
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-500 hover:bg-purple-50'
                      } rounded-lg text-sm`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setView('day')}
                    className={`px-4 py-2 ${view === 'day'
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-500 hover:bg-purple-50'
                      } rounded-lg text-sm`}
                  >
                    Day
                  </button>
                </div>
              </div>

              {renderCalendarView()}
            </div>

            {getLatestEvent() && (
              <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">Latest Added Event</h2>
                  <p className="text-sm text-gray-500">{formatEventDate(getLatestEvent().date)}</p>
                </div>
                <div className={`p-4 rounded-lg ${getEventTypeColor(getLatestEvent().type)}`}>
                  <h4 className="font-medium text-gray-700">{getLatestEvent().title}</h4>
                  <p className="text-sm">{getLatestEvent().description}</p>
                  <p className="text-sm mt-2 text-gray-600">
                    {new Date(getLatestEvent().date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )}

            {renderAllEvents()}
          </div>
        </div>
      </div>

      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                  placeholder="Event title"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  id="type"
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                >
                  <option value="study">Study</option>
                  <option value="exam">Exam</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={newEvent.date.toISOString().split('T')[0]}
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    date: new Date(e.target.value)
                  })}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  id="time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                  placeholder="Event description"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowAddEvent(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addEvent}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingEvent ? 'Save Changes' : 'Add Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;