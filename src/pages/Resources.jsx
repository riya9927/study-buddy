import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Link, Folder, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';

const Resources = () => {
  const [resources, setResources] = useState(() => {
    const savedResources = localStorage.getItem('resources');
    return savedResources ? JSON.parse(savedResources) : [];
  });

  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : ['General'];
  });

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [priority, setPriority] = useState('Low');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryValue, setEditCategoryValue] = useState('');

  const startEditingCategory = (category) => {
    setEditingCategory(category);
    setEditCategoryValue(category);
  };

  useEffect(() => {
    localStorage.setItem('resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addResource = () => {
    if (title.trim() && url.trim()) {
      setResources([
        ...resources,
        {
          id: Date.now().toString(),
          title: title.trim(),
          url: url.trim(),
          category: category || 'General',
          dateAdded: new Date().toISOString(),
          priority: priority,
        },
      ]);
      setTitle('');
      setUrl('');
      setPriority('Low');
    }
  };

  const deleteResource = (id) => {
    setResources(resources.filter(resource => resource.id !== id));
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const saveEditedCategory = (oldCategory) => {
    if (!editCategoryValue.trim() || categories.includes(editCategoryValue.trim())) {
      setEditingCategory(null);
      return;
    }

    const updatedCategories = categories.map((cat) =>
      cat === oldCategory ? editCategoryValue.trim() : cat
    );
    setCategories(updatedCategories);

    const updatedResources = resources.map((resource) => ({
      ...resource,
      category: resource.category === oldCategory ? editCategoryValue.trim() : resource.category,
    }));
    setResources(updatedResources);

    setEditingCategory(null);
  };

  const deleteCategory = (categoryToDelete) => {
    if (categoryToDelete === 'General') {
      return;
    }
    const updatedResources = resources.map(resource => {
      if (resource.category === categoryToDelete) {
        return { ...resource, category: 'General' };
      }
      return resource;
    });

    if (selectedFilter === categoryToDelete) {
      setSelectedFilter('All');
    }

    setCategories(categories.filter(cat => cat !== categoryToDelete));
    setResources(updatedResources);

    if (category === categoryToDelete) {
      setCategory('');
    }
  };

  const filteredResources = selectedFilter === 'All'
    ? resources
    : resources.filter(resource => resource.category === selectedFilter);

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'General': '📚'
    };
    return emojiMap[category] || '📖';
  };

  const priorityColors = {
    Low: 'bg-green-200 text-green-800',
    Medium: 'bg-yellow-200 text-yellow-800',
    High: 'bg-red-200 text-red-800',
  };

  return (
    <div className="min-h-screen bg-[#f9f4ff] p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-700 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          Study Resources
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-6 mt-8">
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
                Add Resource 🌟
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="✍️ Resource title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-off-white placeholder-gray-400"
                />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="🔗 URL..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-off-white placeholder-gray-400"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-off-white"
                >
                  <option value="">📑 Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{getCategoryEmoji(cat)} {cat}</option>
                  ))}
                </select>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-off-white"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>

                <button
                  onClick={addResource}
                  className="flex items-center gap-2 px-6 py-3 text-white bg-[#916bbf] rounded-full hover:bg-[#7052a3] transition-all transform hover:scale-105 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Resource
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
                Categories 📚
              </h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="✨ New category..."
                    className="flex-1 px-0 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-off-white placeholder-gray-400"
                  />
                  <button
                    onClick={addCategory}
                    className="flex items-center gap-2 px-6 py-3 text-white bg-[#916bbf] rounded-full hover:bg-[#7052a3] transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat} className="flex items-center justify-between gap-2 text-gray-700 p-2 rounded-lg hover:bg-purple-50 transition-colors">
                      {editingCategory === cat ? (
                        <>
                          <input
                            type="text"
                            value={editCategoryValue}
                            onChange={(e) => setEditCategoryValue(e.target.value)}
                            className="flex-1 py-1 px-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                          />
                          <button
                            onClick={() => saveEditedCategory(cat)}
                            className="text-green-500 hover:text-green-700 transform hover:scale-110 transition-all"
                            title="Save Changes"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCategory(null)}
                            className="text-gray-400 hover:text-gray-600 transform hover:scale-110 transition-all"
                            title="Cancel Edit"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <Folder className="w-4 h-4 text-gray-700" />
                            {getCategoryEmoji(cat)} {cat}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditingCategory(cat)}
                              className="text-blue-400 hover:text-blue-600 transform hover:scale-110 transition-all"
                              title={`Edit ${cat} category`}
                            >
                              Edit
                            </button>
                            {cat !== 'General' && (
                              <button
                                onClick={() => deleteCategory(cat)}
                                className="text-purple-400 hover:text-red-500 transform hover:scale-110 transition-all"
                                title={`Delete ${cat} category`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-off-white"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{getCategoryEmoji(cat)} {cat}</option>
                ))}
              </select>
              <span className="text-sm text-gray-700">
                ✨ Showing {filteredResources.length} resources
              </span>
            </div>

            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-101 resource-card shadow-lg"
              >
                <Link className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-purple-900">{resource.title}</h3>
                  <p className="text-sm text-purple-500">{resource.url}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${priorityColors[resource.priority]}`}>
                  {resource.priority}
                </span>
                <div className="flex gap-2">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-600 transform hover:scale-110 transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => deleteResource(resource.id)}
                    className="text-purple-400 hover:text-red-500 transform hover:scale-110 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {filteredResources.length === 0 && (
              <div className="text-center py-12 text-gray-700 bg-white rounded-xl border border-gray-200">
                {resources.length === 0
                  ? "No resources added yet. Let's add your first study resource! 📚"
                  : "🔍 No resources found in this category. Try another one!"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;