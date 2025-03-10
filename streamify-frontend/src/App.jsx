import React, { useEffect, useRef, useState } from 'react';
import { GoogleLogin } from "@react-oauth/google";
import axios from 'axios';
import { Outlet, useNavigate } from 'react-router-dom';
import { FaVideo } from "react-icons/fa"; // Import the video icon
import { FaPlus } from "react-icons/fa";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [localUser, setLocalUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      const token = JSON.parse(localStorage.getItem("userToken"));
      console.log(token);
      if (token) {

        try {
          const res = await axios.get("http://127.0.0.1:5000/api/user/me", {
            headers: {
              "Authorization": `Bearer ${token?.accessToken}`,
            }
          });
          setUser(res.data.user);
          console.log(res);
        } catch (error) {
          console.log("User not authenticated");
        }
      }
      //console.log(user);
    }
    fetchUser();

    // setLocalUser(storedUser);

  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/auth/google", { token: credential });
      setUser(res?.data?.user);
      console.log(res);
      const userToken = { accessToken: res?.data?.accessToken };
      localStorage.setItem("userToken", JSON.stringify(userToken));
      setLocalUser(res?.data?.user)

    } catch (error) {
      console.error("Axios Error:", error.response?.status, error.response?.data);
    }

  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken"); // Removes only the "user" key
    setLocalUser(null);
    setUser(null);
  }
  const handleLoginError = () => {
    console.error("Login Failed");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4 flex flex-col sm:flex-row justify-between items-center fixed w-full z-50">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
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
        <div className="md:w-1/3 sm:w-2/3 w-full mt-4 sm:mt-0 sm:ml-4 relative">
          <input
            type="text"
            placeholder="Search videos..."
            className="w-full pl-4 pr-10 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
        {!user ? (
          <div className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.log("Login Failed")}
            />
          </div>
        ) : (
          <div className="relative flex items-center gap-4" ref={dropdownRef}>
            {/* Upload Video Icon */}
            <div className="relative group">
              <FaVideo
                className="w-12 h-8 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={() => navigate('/go-live')}
              />
              {/* Tooltip Below */}
              <span className="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-sm px-1 py-1 rounded-md transition-opacity duration-200 shadow-lg min-w-[70px] text-center">
                Go Live
              </span>
            </div>
            <div className="relative group">
              <FaPlus
                className="w-12 h-8 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={() => navigate('/upload-video')}
              />
              {/* Tooltip Below */}
              <span className="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-sm px-1 py-1 rounded-md transition-opacity duration-200 shadow-lg min-w-[100px] text-center">
                Upload Video
              </span>
            </div>

            {/* User Profile Image */}
            <img
              src={user.profilePicture}
              alt="User Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-700 hover:border-blue-500 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
              onClick={() => setIsOpenDropdown(!isOpenDropdown)}
            />

            {/* Dropdown Menu */}
            {isOpenDropdown && (
              <div className="absolute right-0 top-12 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden animate-fadeIn">
                <ul className="py-1">
                  <li className="px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer transition-colors duration-200">
                    Profile
                  </li>
                  <li className="px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer transition-colors duration-200">
                    Settings
                  </li>
                  <li
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-200"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </nav>

      <div className="flex pt-16 ">
        <aside
          className={` ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } ${isSidebarCollapsed ? 'w-20' : 'w-64'} h-[calc(100vh-4rem)] lg:h-auto lg:min-h-screen lg:translate-x-0 transform fixed lg:static bg-gray-800 p-4 z-40 transition-all duration-300 ease-in-out`}
        >
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full p-2 mb-4 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            {isSidebarCollapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            )}
          </button>
          <ul className="space-y-2">
            <li>
              <a href="/" className="flex items-center p-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200">
                {isSidebarCollapsed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                ) : (
                  "Home"
                )}
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200">
                {isSidebarCollapsed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ) : (
                  "Trending"
                )}
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200">
                {isSidebarCollapsed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  "Subscriptions"
                )}
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200">
                {isSidebarCollapsed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    />
                  </svg>
                ) : (
                  "Library"
                )}
              </a>
            </li>
          </ul>
        </aside>

        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          ></div>
        )}
        <Outlet />
        {/* <main className={`flex-1 p-6 transition-all duration-300 `}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((video) => (
              <div  key={video} className="shadow-xl shadow-gray-500/40 bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
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
        </main> */}
      </div>
    </div>
  );
};

export default App;