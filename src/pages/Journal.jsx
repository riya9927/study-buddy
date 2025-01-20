import React, { useState, useEffect } from 'react';
import { Save, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Trash2, Edit2, X, Book, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

const Journal = () => {
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  
  const [currentDate, setCurrentDate] = useState(() => {
    const savedDate = localStorage.getItem('currentDate');
    return savedDate ? new Date(savedDate) : new Date();
  });
  
  const [content, setContent] = useState(() => {
    const savedContent = localStorage.getItem('currentContent');
    return savedContent ? JSON.parse(savedContent) : [{ text: '', color: '#374151', font: 'font-sans' }];
  });
  
  const [title, setTitle] = useState(() => {
    return localStorage.getItem('currentTitle') || '';
  });
  
  const [mood, setMood] = useState(() => {
    return localStorage.getItem('currentMood') || 'happy';
  });
  
  const [isEditing, setIsEditing] = useState(() => {
    return localStorage.getItem('isEditing') === 'true';
  });
  
  const [showEntryDetail, setShowEntryDetail] = useState(null);
  const [selectedLineIndex, setSelectedLineIndex] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showAllEntries, setShowAllEntries] = useState(() => {
    return localStorage.getItem('showAllEntries') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('currentDate', currentDate.toISOString());
    localStorage.setItem('currentContent', JSON.stringify(content));
    localStorage.setItem('currentTitle', title);
    localStorage.setItem('currentMood', mood);
    localStorage.setItem('isEditing', isEditing.toString());
    localStorage.setItem('showAllEntries', showAllEntries.toString());
  }, [currentDate, content, title, mood, isEditing, showAllEntries]);

  const formattedDate = format(currentDate, 'yyyy-MM-dd');
  const currentEntry = entries.find(entry => entry.date === formattedDate);

  const fonts = {
    'Sans Serif': 'font-sans',
    'Serif': 'font-serif',
    'Mono': 'font-mono',
  };

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    excited: '🥳',
    neutral: '😐',
    love: '🥰',
    worried: '😟',
    sleepy: '😴',
  };

  const resetForm = () => {
    const defaultContent = [{ text: '', color: '#374151', font: 'font-sans' }];
    setContent(defaultContent);
    setTitle('');
    setMood('happy');
    setSelectedLineIndex(0);
    
    localStorage.setItem('currentContent', JSON.stringify(defaultContent));
    localStorage.setItem('currentTitle', '');
    localStorage.setItem('currentMood', 'happy');
  };

  const handleContentChange = (index, newText) => {
    const newContent = [...content];
    newContent[index].text = newText;
    setContent(newContent);
  };

  const addNewLine = () => {
    const newContent = [...content, { text: '', color: '#374151', font: 'font-sans' }];
    setContent(newContent);
    setSelectedLineIndex(content.length);
  };

  const changeLineColor = (color) => {
    const newContent = [...content];
    newContent[selectedLineIndex].color = color;
    setContent(newContent);
    setShowColorPicker(false);
  };

  const changeLineFont = (font) => {
    const newContent = [...content];
    newContent[selectedLineIndex].font = font;
    setContent(newContent);
  };

  const saveEntry = () => {
    if (title.trim() && content.some(line => line.text.trim())) {
      const newEntry = {
        id: currentEntry?.id || Date.now().toString(),
        date: formattedDate,
        content,
        mood,
        title,
      };

      if (currentEntry) {
        setEntries(prevEntries => 
          prevEntries.map(entry =>
            entry.id === currentEntry.id ? newEntry : entry
          )
        );
      } else {
        setEntries(prevEntries => [...prevEntries, newEntry]);
      }
      setIsEditing(false);
      resetForm();
    }
  };

  const deleteEntry = (id, e) => {
    e.stopPropagation();
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
    if (currentEntry?.id === id) {
      resetForm();
    }
    setShowEntryDetail(null);
  };

  const editEntry = (entry, e) => {
    e.stopPropagation();
    setCurrentDate(new Date(entry.date));
    setContent(entry.content);
    setTitle(entry.title);
    setMood(entry.mood);
    setIsEditing(true);
    setShowEntryDetail(null);
  };

  const changeDate = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);
    setCurrentDate(newDate);

    const entry = entries.find(entry => entry.date === format(newDate, 'yyyy-MM-dd'));
    if (entry) {
      setContent(entry.content);
      setTitle(entry.title);
      setMood(entry.mood);
    } else {
      resetForm();
    }
    setIsEditing(false);
  };
  const ColorPicker = ({ onSelect }) => (
    <div className="absolute z-10 p-2 bg-white rounded-lg shadow-lg border border-purple-100 grid grid-cols-8 gap-1 w-64">
      {['#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef',
        '#f3f3f3', '#ffffff', '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff',
        '#4a86e8', '#0000ff', '#9900ff', '#ff00ff', '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc',
        '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc', '#dd7e6b', '#ea9999',
        '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd']
        .map(color => (
          <button
            key={color}
            onClick={() => onSelect(color)}
            className="w-6 h-6 rounded-full hover:scale-110 transition-transform"
            style={{ backgroundColor: color, border: '1px solid #ddd' }}
          />
        ))}
    </div>
  );

  const EntryDetailModal = ({ entry, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
        <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSI+PHBhdGggc3Ryb2tlPSIjZTVlN2ViIiBkPSJNMCAwaDYwdjYwSDB6Ii8+PC9zdmc+')] opacity-10" />

        <div className="relative">
          <div className="flex justify-between items-center border-b border-purple-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Book className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-700">{entry.title}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-purple-100 rounded-lg">
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <CalendarIcon className="w-4 h-4" />
            {format(new Date(entry.date), 'MMMM d, yyyy')}
            <span className="text-xl">{moodEmojis[entry.mood]}</span>
          </div>

          <div className="space-y-4 px-4">
            {entry.content.map((line, index) => (
              <div key={index} className={`${line.font} leading-relaxed`}>
                <p style={{ color: line.color }}>{line.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const displayedEntries = showAllEntries
    ? entries
    : entries.slice(0, 4);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-purple-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-700 text-center">My Daily Reflections ✨</h1>

      <div className="bg-white rounded-2xl shadow-lg border border-purple-100">
        <div className="flex items-center justify-between p-4 border-b border-purple-100 bg-purple-50 rounded-t-2xl">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2 font-medium text-gray-700">
            <CalendarIcon className="w-5 h-5 text-purple-500" />
            {format(currentDate, 'MMMM d, yyyy')}
          </div>
          <button
            onClick={() => changeDate(1)}
            className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="✨ Entry Title"
            disabled={!isEditing && currentEntry}
            className="w-full p-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 disabled:bg-purple-50 disabled:cursor-not-allowed text-gray-700 placeholder-purple-300"
          />

          <div className="flex gap-4">
            {Object.entries(moodEmojis).map(([moodKey, emoji]) => (
              <button
                key={moodKey}
                onClick={() => setMood(moodKey)}
                disabled={!isEditing && currentEntry}
                className={`flex-1 py-3 rounded-xl border text-center text-xl transition-all ${
                  mood === moodKey
                    ? 'border-purple-400 bg-purple-100 scale-105 transform'
                    : 'border-purple-100 hover:bg-purple-50'
                } ${(!isEditing && currentEntry) ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {content.map((line, index) => (
              <div key={index} className="space-y-2">
                {index === selectedLineIndex && (isEditing || !currentEntry) && (
                  <div className="flex gap-2 items-center">
                    <div className="relative">
                      <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center"
                        style={{ backgroundColor: line.color }}
                      />
                      {showColorPicker && (
                        <ColorPicker onSelect={changeLineColor} />
                      )}
                    </div>
                    <select
                      value={line.font}
                      onChange={(e) => changeLineFont(e.target.value)}
                      className="p-2 border border-gray-200 rounded-lg"
                    >
                      {Object.entries(fonts).map(([name, value]) => (
                        <option key={value} value={value}>{name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <textarea
                  value={line.text}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  onClick={() => setSelectedLineIndex(index)}
                  placeholder="✨ What's on your mind today?"
                  disabled={!isEditing && currentEntry}
                  style={{ color: line.color }}
                  className={`w-full p-4 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 disabled:bg-purple-50 disabled:cursor-not-allowed placeholder-purple-300 ${line.font}`}
                />
              </div>
            ))}
            {(isEditing || !currentEntry) && (
              <button
                onClick={addNewLine}
                className="w-full p-2 border border-dashed border-purple-300 rounded-xl text-purple-500 hover:bg-purple-50"
              >
                + Add new line
              </button>
            )}
          </div>

          <div className="flex justify-end">
            {(!currentEntry || isEditing) && (
              <button
                onClick={saveEntry}
                className="flex items-center gap-2 px-6 py-3 text-white bg-[#916bbf] rounded-full hover:bg-[#7052a3] transition-all transform hover:scale-105 shadow-lg"
              >
                <Save className="w-5 h-5" />
                {currentEntry ? 'Update Entry' : 'Save Entry'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Recent Reflections</h2>
          {entries.length > 4 && (
            <button
              onClick={() => setShowAllEntries(!showAllEntries)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800"
            >
              {showAllEntries ? 'Show Less' : 'View All'}
              <ChevronDown className={`w-4 h-4 transform transition-transform ${showAllEntries ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedEntries
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(entry => (
              <div
                key={entry.id}
                className="bg-white border border-purple-100 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4 space-y-2"
                onClick={() => setShowEntryDetail(entry)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-700">{entry.title}</h3>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      {format(new Date(entry.date), 'MMM d, yyyy')}
                      <span>{moodEmojis[entry.mood]}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => editEntry(entry, e)}
                      className="p-1.5 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-purple-600" />
                    </button>
                    <button
                      onClick={(e) => deleteEntry(entry.id, e)}
                      className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {entry.content[0].text}
                </p>
              </div>
            ))}
        </div>
      </div>

      {showEntryDetail && (
        <EntryDetailModal
          entry={showEntryDetail}
          onClose={() => setShowEntryDetail(null)}
        />
      )}
    </div>
  );
};

export default Journal;