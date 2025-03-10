import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';
import { Outlet, useNavigate } from 'react-router-dom';
const SingleVideoPage = ({ videoId }) => {
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
   
  // Fetch video data
  useEffect(() => {
    const fetchVideo = async () => {
      const response = await fetch(`http://localhost:5000/api/videos/${videoId}`);
      const data = await response.json();
      setVideo(data);
      setComments(data.comments);
    };
    fetchVideo();
  }, [videoId]);
  const navigate = useNavigate();
  // WebSocket for real-time comments
  //   useEffect(() => {
  //     const socket = io('http://localhost:5000');

  //     // Join the video room
  //     socket.emit('joinVideoRoom', videoId);

  //     // Listen for new comments
  //     socket.on('newComment', (comment) => {
  //       setComments((prevComments) => [comment, ...prevComments]);
  //     });

  //     // Cleanup on unmount
  //     return () => {
  //       socket.disconnect();
  //     };
  //   }, [videoId]);

  // Handle new comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const socket = io('http://localhost:5000');
    socket.emit('postComment', { videoId, text: newComment });
    setNewComment('');
  };

  // Handle like/dislike
  const handleLike = async () => {
    if (isLiked) return; // Prevent multiple likes
    const response = await fetch(`http://localhost:5000/api/videos/${videoId}/like`, {
      method: 'POST',
    });
    if (response.ok) {
      setIsLiked(true);
      setIsDisliked(false);
      setVideo((prevVideo) => ({ ...prevVideo, likes: prevVideo.likes + 1 }));
    }
  };

  const handleDislike = async () => {
    if (isDisliked) return; // Prevent multiple dislikes
    const response = await fetch(`http://localhost:5000/api/videos/${videoId}/dislike`, {
      method: 'POST',
    });
    if (response.ok) {
      setIsDisliked(true);
      setIsLiked(false);
      setVideo((prevVideo) => ({ ...prevVideo, dislikes: prevVideo.dislikes + 1 }));
    }
  };

  // Handle subscribe
  const handleSubscribe = async () => {
    const response = await fetch(`http://localhost:5000/api/channels/${video.channel._id}/subscribe`, {
      method: 'POST',
    });
    if (response.ok) {
      setIsSubscribed(true);
      setVideo((prevVideo) => ({
        ...prevVideo,
        channel: { ...prevVideo.channel, subscribers: prevVideo.channel.subscribers + 1 },
      }));
    }
  };

  // if (!video) return <div>Loading...</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      {/* Video Player */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4">
          <div className="bg-black rounded-lg overflow-hidden" onClick={()=>navigate('/single-video/1')}>
            <video
              autoplay
              muted
              controls
              className="w-full h-full"
              src="http://localhost:5000/videos/video-1741459393229.mp4"
              poster="https://res.cloudinary.com/cloudinary-marketing/images/c_fill,w_1324/f_auto,q_auto/v1647045700/36_video_thumbnails/36_video_thumbnails-jpg?_i=AA"
            >
              Your browser does not support the video tag.
            </video>


          </div>

          {/* Video Details */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold">Kurulus Usman Season-6 Episode 184</h1>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-4">
                <span> views</span>
                <span>•</span>
                {/* <span>{new Date(video.uploadDate).toLocaleDateString()}</span> */}
                <span>08 March, 2025</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 ${isLiked ? 'text-blue-500' : 'text-gray-400'}`}
                >
                  <span>1.2k</span>
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
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleDislike}
                  className={`flex items-center space-x-2 ${isDisliked ? 'text-red-500' : 'text-gray-400'}`}
                >
                  <span>420</span>
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
                      d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m7-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Channel Information */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src='"https://lh3.googleusercontent.com/a/ACg8ocJGASwsB14z-srK1hfs4M0ZuRo5Oz4y5-eLQmzngAFvFDUJbFoQ=s96-c"'
                alt="Jakaria Hossain"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="font-bold">Jakria </h2>
                <p className="text-gray-400">2.5k subscribers</p>
              </div>
            </div>
            <button
              onClick={handleSubscribe}
              className={`px-4 py-2 rounded-lg ${isSubscribed ? 'bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Video Description */}
          <div className="mt-6 bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-300">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore eos dicta,  praesentium sunt facilis!</p>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">Comments</h3>
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>
            {/* <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex items-start space-x-4">
                  <img
                    src={comment.user.profilePicture}
                    alt={comment.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold">{comment.user.name}</h4>
                      <span className="text-gray-400 text-sm">
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        </div>

        {/* Related Videos */}
        <div className="lg:w-1/4">
          <h3 className="text-xl font-bold mb-4">Related Videos</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((video) => (
              <div key={video} className="flex space-x-4">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Related Video"
                  className="w-24 h-16 rounded-lg"
                />
                <div>
                  <h4 className="font-bold">Related Video {video}</h4>
                  <p className="text-gray-400">Channel Name</p>
                  <p className="text-gray-400">100K views • 1 day ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleVideoPage;