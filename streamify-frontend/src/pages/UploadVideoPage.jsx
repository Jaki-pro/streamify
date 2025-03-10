import React, { useState } from 'react';

const UploadVideoPage = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!videoFile || !thumbnailFile || !title || !description || !tags || !category || !privacy) {
      setError('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('thumbnail', thumbnailFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('category', category);
    formData.append('privacy', privacy);
    const token = JSON.parse(localStorage.getItem("userToken"));
    try {
      const response = await fetch('http://127.0.0.1:5000/api/videos/upload', {
        method: 'POST',
        body: formData,
        headers: {
          "Authorization": `Bearer ${token?.accessToken}`,
        }
        // onUploadProgress: (progressEvent) => {
        //   const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        //   setUploadProgress(progress);
        // },
      });

      if (response.ok) {
        alert('Video uploaded successfully!');
        // Reset form
        setVideoFile(null);
        setThumbnailFile(null);
        setTitle('');
        setDescription('');
        setTags('');
        setCategory('');
        setPrivacy('public');
        setUploadProgress(0);
        setError('');
      } else {
        setError('Failed to upload video. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 lg:w-2/3 w-full mx-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Upload Video</h1>
        {error && <div className="bg-red-500 text-white p-3 rounded-lg mb-6">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Video File</label>
            <div className="flex items-center justify-center w-full p-6 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700 hover:border-blue-500 transition-all duration-200">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                className="hidden"
                id="video-upload"
                required
              />
              <label htmlFor="video-upload" className="cursor-pointer text-center">
                {videoFile ? (
                  <span className="text-blue-500">{videoFile.name}</span>
                ) : (
                  <span className="text-gray-400">Drag & drop or click to upload a video</span>
                )}
              </label>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Thumbnail</label>
            <div className="flex items-center justify-center w-full p-6 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700 hover:border-blue-500 transition-all duration-200">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
                className="hidden"
                id="thumbnail-upload"
                required
              />
              <label htmlFor="thumbnail-upload" className="cursor-pointer text-center">
                {thumbnailFile ? (
                  <span className="text-blue-500">{thumbnailFile.name}</span>
                ) : (
                  <span className="text-gray-400">Drag & drop or click to upload a thumbnail</span>
                )}
              </label>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className="w-full p-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              className="w-full p-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags (comma separated)"
              className="w-full p-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select a category</option>
              <option value="Programming">Programming</option>
              <option value="Gaming">Gaming</option>
              <option value="Music">Music</option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>

          {/* Privacy Settings */}
          <div>
            <label className="block text-sm font-medium mb-2">Privacy</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="public"
                  checked={privacy === 'public'}
                  onChange={() => setPrivacy('public')}
                  className="form-radio text-blue-500"
                />
                <span>Public</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="private"
                  checked={privacy === 'private'}
                  onChange={() => setPrivacy('private')}
                  className="form-radio text-blue-500"
                />
                <span>Private</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="unlisted"
                  checked={privacy === 'unlisted'}
                  onChange={() => setPrivacy('unlisted')}
                  className="form-radio text-blue-500"
                />
                <span>Unlisted</span>
              </label>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-800 rounded-lg overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-lg"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {/* Upload Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
            >
              Upload Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadVideoPage;