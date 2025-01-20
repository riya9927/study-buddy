import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, ChevronRight, Plus, Trash2, Edit, Link } from 'lucide-react';

const Roadmaps = () => {
  const [roadmaps, setRoadmaps] = useState(() => {
    const savedRoadmaps = localStorage.getItem('learningRoadmaps');
    return savedRoadmaps ? JSON.parse(savedRoadmaps) : [];
  });
  
  const [showNewRoadmap, setShowNewRoadmap] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState(null);
  const [newRoadmap, setNewRoadmap] = useState({
    title: '',
    description: '',
    url: '',
  });

  useEffect(() => {
    localStorage.setItem('learningRoadmaps', JSON.stringify(roadmaps));
  }, [roadmaps]);

  const addOrUpdateRoadmap = () => {
    if (!newRoadmap.title.trim()) return;

    if (editingRoadmap) {
      setRoadmaps(
        roadmaps.map((roadmap) =>
          roadmap.id === editingRoadmap.id ? { ...roadmap, ...newRoadmap } : roadmap
        )
      );
      setEditingRoadmap(null);
    } else {
      const roadmap = {
        id: Date.now().toString(),
        title: newRoadmap.title,
        description: newRoadmap.description,
        url: newRoadmap.url,
        steps: [],
      };
      setRoadmaps([...roadmaps, roadmap]);
    }

    setNewRoadmap({ title: '', description: '', url: '' });
    setShowNewRoadmap(false);
  };

  const deleteRoadmap = (id) => {
    setRoadmaps(roadmaps.filter((roadmap) => roadmap.id !== id));
  };

  const startEditingRoadmap = (roadmap) => {
    setEditingRoadmap(roadmap);
    setNewRoadmap({ title: roadmap.title, description: roadmap.description, url: roadmap.url });
    setShowNewRoadmap(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-50 p-6 space-y-6">
      <h1 className="text-4xl font-extrabold text-gray-800">Learning Roadmaps</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6">
        <div className="space-y-4">
          <button
            onClick={() => {
              setShowNewRoadmap(true);
              setEditingRoadmap(null);
              setNewRoadmap({ title: '', description: '', url: '' });
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white bg-[#916bbf] rounded-full hover:bg-[#7052a3] transition-all transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Roadmap
          </button>

          {showNewRoadmap && (
            <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 space-y-4 animate-fade-in">
              <input
                type="text"
                value={newRoadmap.title}
                onChange={(e) => setNewRoadmap({ ...newRoadmap, title: e.target.value })}
                placeholder="Roadmap title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-300 focus:outline-none transition-all"
              />
              <textarea
                value={newRoadmap.description}
                onChange={(e) => setNewRoadmap({ ...newRoadmap, description: e.target.value })}
                placeholder="Description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-300 focus:outline-none resize-none transition-all"
              />
              <div className="relative">
                <input
                  type="url"
                  value={newRoadmap.url}
                  onChange={(e) => setNewRoadmap({ ...newRoadmap, url: e.target.value })}
                  placeholder="Roadmap URL (optional)..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-300 focus:outline-none transition-all"
                />
                <Link className="absolute right-3 top-3 text-gray-400" />
              </div>
              <button
                onClick={addOrUpdateRoadmap}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:brightness-110 transform hover:scale-105 transition-all"
              >
                {editingRoadmap ? 'Update Roadmap' : 'Create Roadmap'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="bg-white rounded-xl shadow-md border-2 border-transparent hover:border-purple-400 hover:shadow-lg p-6 flex flex-col gap-4 transform hover:scale-105 transition-all"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">{roadmap.title}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditingRoadmap(roadmap)}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteRoadmap(roadmap.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600">{roadmap.description}</p>
              {roadmap.url && (
                <a
                  href={roadmap.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 underline text-sm"
                >
                  Open Roadmap
                </a>
              )}
            </div>
          ))}
          {roadmaps.length === 0 && (
              <div className="col-span-full flex items-center justify-center p-10 bg-white rounded-lg border border-gray-300 shadow-sm">
                <p className="text-gray-500 text-lg text-center">No roadmaps yet. Create your first learning roadmap! 🎯</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Roadmaps;