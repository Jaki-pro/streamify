import React, { useState } from 'react';
import { GoogleLogin } from "@react-oauth/google";
const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [user, setUser] = useState(null);
  // Handle successful login
  const handleLoginSuccess = (credentialResponse) => {
    const { credential } = credentialResponse;
    console.log(credential);
    // const decoded = jwt_decode(credential);
    // console.log("Google User:", decoded);
    // setUser(decoded); // Store user info
  };

  // Handle login error
  const handleLoginError = () => {
    console.error("Login Failed");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 flex flex-col sm:flex-row justify-between items-center fixed w-full z-50">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          {/* Sidebar Toggle Button (Visible on small screens) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="text-xl font-bold">Streamify</div>
        </div>
        {/* Search Bar (Full Width on Small Screens) */}
        <div className="md:w-1/3 w-full mt-4 sm:mt-0 sm:ml-4 relative">
          <input
            type="text"
            placeholder="Search videos..."
            className="w-full pl-4 pr-10 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Search Icon Button */}
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center bg-transparent hover:bg-gray-600 rounded-r-lg transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
        {/* Login Button */}
        {

          !user ?
            (<div className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4">
              <GoogleLogin
                
                onSuccess={handleLoginSuccess}
                onError={() => console.log("Login Failed")}
              />
            </div>) : (<div></div>)
        }

        {/* <div className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4">
          <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300">
            Login
          </button>
        </div> */}
      </nav>

      {/* Main Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } h-screen lg:translate-x-0 transform fixed lg:static w-64 bg-gray-800 p-4 h-full z-40 transition-transform duration-300 ease-in-out h-[calc(100vh-4rem)] lg:h-auto lg:min-h-screen`}
        >
          <ul className="space-y-2">
            <li>
              <a href="#" className="block p-2 hover:bg-gray-700 rounded-lg transition duration-300">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 hover:bg-gray-700 rounded-lg transition duration-300">
                Trending
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 hover:bg-gray-700 rounded-lg transition duration-300">
                Subscriptions
              </a>
            </li>
            <li>
              <a href="#" className="block p-2 hover:bg-gray-700 rounded-lg transition duration-300">
                Library
              </a>
            </li>
          </ul>
        </aside>

        {/* Overlay for Sidebar (Visible on small screens) */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          ></div>
        )}

        {/* Video Content Area */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Video Card */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((video) => (
              <div key={video} className="shadow-xl shadow-gray-500/40 bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src="https://via.placeholder.com/400x225"
                  alt="Video Thumbnail"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg">Video Title {video}</h3>
                  <p className="text-sm text-gray-400">Channel Name</p>
                  <p className="text-sm text-gray-400">100K views • 1 day ago</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;