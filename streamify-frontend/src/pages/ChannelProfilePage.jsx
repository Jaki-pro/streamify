import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ChannelProfilePage = ({ channelId }) => {
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);

  // Fetch channel and videos data
  useEffect(() => {
    const fetchChannel = async () => {
      const token = JSON.parse(localStorage.getItem("userToken"));
      console.log(token);
      if (token) {

        try {
          const res = await axios.get("http://127.0.0.1:5000/api/user/me", {
            headers: {
              "Authorization": `Bearer ${token?.accessToken}`,
            }
          });
          setChannel(res.data.user);
          console.log(res);
        } catch (error) {
          console.log("User not authenticated");
        }
      }
      //console.log(user);
    } 
    // const fetchVideos = async () => {
    //   const response = await fetch(`http://localhost:5000/api/videos?channelId=${channelId}`);
    //   const data = await response.json();
    //   setVideos(data);
    // };

    fetchChannel();
    // fetchVideos();
  }, [channelId]);

  //if (!channel) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Channel Header */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={channel?.profilePicture}
            alt={channel?.name}
            className="w-32 h-32 rounded-full border-4 border-blue-500"
          />
          <h1 className="text-3xl font-bold">{channel?.name}</h1>
          <p className="text-gray-400">{channel?.subscribers} subscribers</p>
          <p className="text-gray-300 text-center max-w-2xl">{channel?.description}</p>
          <div className="flex space-x-4">
            <button className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300">
              Subscribe
            </button>
            <button className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition duration-300">
              Message
            </button>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      {/* <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Uploaded Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{video.title}</h3>
                <p className="text-sm text-gray-400">{video.views} views • {new Date(video.uploadDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* About Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">About</h2>
        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-300">{channel?.description}</p>
          <div className="mt-4">
            <h3 className="text-lg font-bold">Stats</h3>
            <p className="text-gray-400">Joined: {new Date(channel?.joinDate).toLocaleDateString()}</p>
            <p className="text-gray-400">Total Views: {channel?.totalViews}</p>
            <p className="text-gray-400">Total Videos: {channel?.totalVideos}</p>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold">Social Links</h3>
            {/* <div className="flex space-x-4">
              <a href={channel.socialLinks?.website} className="text-blue-500 hover:underline">
                Website
              </a>
              <a href={channel.socialLinks?.twitter} className="text-blue-500 hover:underline">
                Twitter
              </a>
              <a href={channel.socialLinks?.instagram} className="text-blue-500 hover:underline">
                Instagram
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelProfilePage;