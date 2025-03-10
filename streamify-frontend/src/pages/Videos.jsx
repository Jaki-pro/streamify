import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Videos = () => {
  const navigate = useNavigate();
    return (
        <main className={`flex-1 p-6 transition-all duration-300`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((video) => (
              <div  
              key={video} 
              className="group shadow-xl shadow-gray-500/40 bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer" onClick={()=>navigate('/single-video/1')}
            >
              <div className="overflow-hidden">
                <img
                  src="http://localhost:5000/videos/thumbnail-1741459393229.jpg"
                  alt="Video Thumbnail"
                  className="w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">Video Title {video}</h3>
                <p className="text-sm text-gray-400">Channel Name</p>
                <p className="text-sm text-gray-400">100K views • 1 day ago</p>
              </div>
            </div>
            ))}
          </div>
        </main>
    );
}

export default Videos;
