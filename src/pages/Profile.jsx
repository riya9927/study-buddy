import React, { useState, useRef, useEffect } from 'react';

const Profile = () => {
  const fileInputRef = useRef(null);
  const [profilePicture, setProfilePicture] = useState(() => {
    return localStorage.getItem('profilePicture') || "/api/placeholder/100/100"
  });
  
  const [additionalLinks, setAdditionalLinks] = useState(() => {
    return JSON.parse(localStorage.getItem('additionalLinks')) || []
  });
  
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(() => {
    return JSON.parse(localStorage.getItem('profileFormData')) || {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      address: '',
      country: '',
      state: '',
      city: '',
      zipCode: '',
      dob: {
        month: '',
        day: '',
        year: ''
      },
      gender: '',
      linkedin: '',
      github: '',
      leetcode: '',
      bio: ''
    }
  });

  useEffect(() => {
    localStorage.setItem('profileFormData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('additionalLinks', JSON.stringify(additionalLinks));
  }, [additionalLinks]);

  useEffect(() => {
    localStorage.setItem('profilePicture', profilePicture);
  }, [profilePicture]);

  const countries = [
    'Select Country',
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Japan', 'China', 'Brazil'
  ];
  
  const statesByCountry = {
    'India': [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry',
      'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep',
      'Andaman and Nicobar Islands', 'Ladakh', 'Jammu and Kashmir'
    ],
    'United States': ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia'],
    'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    'Canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick'],
    'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania', 'Northern Territory'],
    'Germany': ['Bavaria', 'Baden-Württemberg', 'North Rhine-Westphalia', 'Hesse', 'Saxony', 'Berlin', 'Brandenburg', 'Hamburg'],
    'France': ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Occitanie', 'Nouvelle-Aquitaine', 'Auvergne-Rhône-Alpes', 'Hauts-de-France', 'Normandy'],
    'Japan': ['Hokkaido', 'Tohoku', 'Kanto', 'Chubu', 'Kinki', 'Chugoku', 'Shikoku', 'Kyushu'],
    'China': ['Guangdong', 'Shandong', 'Henan', 'Sichuan', 'Jiangsu', 'Hebei', 'Hunan', 'Anhui'],
    'Brazil': ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná', 'Pernambuco', 'Ceará', 'Amazonas']
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 100 }, (_, i) => (2024 - i).toString());

  const codingPlatforms = [
    'HackerRank', 'LeetCode', 'CodeChef', 'GeeksforGeeks',
    'TopCoder', 'Codeforces', 'Kaggle', 'Hackerearth', 'Other'
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone Number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.country === 'Select Country') newErrors.country = 'Please select a country';
    if (!formData.state) newErrors.state = 'Please select a state';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e, field, subfield = null) => {
    if (subfield) {
      setFormData(prev => ({
        ...prev,
        [field]: { ...prev[field], [subfield]: e.target.value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setMessage({ type: 'error', text: 'File size should be less than 5MB' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target.result);
        setMessage({ type: 'success', text: 'Profile picture updated successfully' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture("/api/placeholder/100/100");
    setMessage({ type: 'success', text: 'Profile picture removed successfully' });
  };

  const addNewLink = () => {
    setAdditionalLinks(prev => [
      ...prev,
      { platform: 'HackerRank', url: '' }
    ]);
  };

  const updateAdditionalLink = (index, field, value) => {
    setAdditionalLinks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeAdditionalLink = (index) => {
    setAdditionalLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields correctly' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      localStorage.setItem('profileFormData', JSON.stringify(formData));
      localStorage.setItem('additionalLinks', JSON.stringify(additionalLinks));
      localStorage.setItem('profilePicture', profilePicture);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName = (error) => `
    w-full p-2 border rounded 
    ${error ? 'border-red-500 bg-red-50' : 'border-purple-200'} 
    focus:ring-2 focus:ring-purple-500 focus:border-purple-500
    bg-white text-gray-700 transition-all duration-300
  `;

  const buttonClassName = `
    bg-purple-600 text-white px-6 py-2 rounded
    transform hover:scale-105 hover:bg-purple-700
    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
    transition-all duration-300 ease-in-out
  `;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-6 text-purple-800">Edit Profile</h1>

      {message.text && (
        <div className={`mb-4 p-3 rounded transform transition-all duration-300 ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="mb-6 flex items-center">
        <div className="relative">
          <img
            src={profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
          />
        </div>
        <div className="ml-4 space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePictureUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className={`${buttonClassName} bg-purple-600`}
          >
            Upload New Profile Picture
          </button>
          <button
            type="button"
            onClick={handleRemoveProfilePicture}
            className="text-purple-600 px-4 py-2 hover:text-purple-800 transition-colors duration-300"
          >
            Remove Profile Picture
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange(e, 'username')}
              className={inputClassName(errors.username)}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange(e, 'password')}
              className={inputClassName(errors.password)}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange(e, 'firstName')}
              className={inputClassName(errors.firstName)}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange(e, 'lastName')}
              className={inputClassName(errors.lastName)}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <select className="p-2 border rounded-l w-20 border-purple-200 bg-white text-gray-700">
                <option>IN</option>
              </select>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange(e, 'phoneNumber')}
                className={`w-full p-2 border border-l-0 rounded-r 
                  ${errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-purple-200'}
                  focus:ring-2 focus:ring-purple-500 focus:border-purplebg-white text-gray-700 transition-all duration-300`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange(e, 'email')}
              className={inputClassName(errors.email)}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange(e, 'address')}
            className={`w-full p-2 border rounded border-purple-200 
              focus:ring-2 focus:ring-purple-500 focus:border-purple-500
              bg-white text-gray-700 transition-all duration-300`}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleInputChange(e, 'country')}
              className={inputClassName(errors.country)}
            >
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-500">{errors.country}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              State <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.state}
              onChange={(e) => handleInputChange(e, 'state')}
              className={inputClassName(errors.state)}
              disabled={!formData.country || formData.country === 'Select Country'}
            >
              <option value="">Select State</option>
              {(statesByCountry[formData.country] || []).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && (
              <p className="mt-1 text-sm text-red-500">{errors.state}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange(e, 'city')}
              className={`w-full p-2 border rounded border-purple-200 
                focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                bg-white text-gray-700 transition-all duration-300`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Zip Code</label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleInputChange(e, 'zipCode')}
              className={`w-full p-2 border rounded border-purple-200 
                focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                bg-white text-gray-700 transition-all duration-300`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">DOB (Date of Birth)</label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={formData.dob.month}
                onChange={(e) => handleInputChange(e, 'dob', 'month')}
                className="p-2 border rounded border-purple-200 bg-white text-gray-700
                  focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
              >
                <option value="">Month</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select
                value={formData.dob.day}
                onChange={(e) => handleInputChange(e, 'dob', 'day')}
                className="p-2 border rounded border-purple-200 bg-white text-gray-700
                  focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
              >
                <option value="">Day</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <select
                value={formData.dob.year}
                onChange={(e) => handleInputChange(e, 'dob', 'year')}
                className="p-2 border rounded border-purple-200 bg-white text-gray-700
                  focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
              >
                <option value="">Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange(e, 'gender')}
              className={`w-full p-2 border rounded border-purple-200 
                focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                bg-white text-gray-700 transition-all duration-300`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">LinkedIn</label>
            <input
              type="text"
              value={formData.linkedin}
              onChange={(e) => handleInputChange(e, 'linkedin')}
              className={`w-full p-2 border rounded border-purple-200 
                focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                bg-white text-gray-700 transition-all duration-300`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Github</label>
            <input
              type="text"
              value={formData.github}
              onChange={(e) => handleInputChange(e, 'github')}
              className={`w-full p-2 border rounded border-purple-200 
                focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                bg-white text-gray-700 transition-all duration-300`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Leetcode</label>
            <input
              type="text"
              value={formData.leetcode}
              onChange={(e) => handleInputChange(e, 'leetcode')}
              className={`w-full p-2 border rounded border-purple-200 
                focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                bg-white text-gray-700 transition-all duration-300`}
            />
          </div>
        </div>

        {additionalLinks.map((link, index) => (
          <div key={index} className="grid grid-cols-3 gap-6 relative">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Platform</label>
              <select
                value={link.platform}
                onChange={(e) => updateAdditionalLink(index, 'platform', e.target.value)}
                className={`w-full p-2 border rounded border-purple-200 
                  focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                  bg-white text-gray-700 transition-all duration-300`}
              >
                {codingPlatforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700">URL</label>
              <div className="flex">
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateAdditionalLink(index, 'url', e.target.value)}
                  className={`w-full p-2 border rounded-l border-purple-200 
                    focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                    bg-white text-gray-700 transition-all duration-300`}
                  placeholder="Enter profile URL"
                />
                <button
                  type="button"
                  onClick={() => removeAdditionalLink(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-r
                    hover:bg-red-600 transform hover:scale-105
                    transition-all duration-300 ease-in-out"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        <div>
          <button
            type="button"
            onClick={addNewLink}
            className="text-purple-600 hover:text-purple-800 transition-colors duration-300
              flex items-center gap-2 transform hover:scale-105"
          >
            <span className="text-xl">+</span> Add More Link
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange(e, 'bio')}
            placeholder="add bio here..."
            className={`w-full p-2 border rounded border-purple-200 
              focus:ring-2 focus:ring-purple-500 focus:border-purple-500
              bg-white text-gray-700 transition-all duration-300 h-32`}
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`${buttonClassName} ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
            }`}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;