const path = require('path');
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const { encodeVideo } = require('../utils/ffmpeg')

exports.upload = async (req, res) => {
    const { video, thumbnail } = req.files;
    const videoFileName = "video-" + Date.now() + path.extname(video.name);
    const thumbnailFileName = "thumbnail-" + Date.now() + path.extname(thumbnail.name);
    const { title, description, tags, category, privacy } = req.body;

    const targetDir = path.dirname(__dirname);

    const videoDir = path.join(targetDir, 'input', videoFileName);
    const thumbnailDir = path.join(targetDir, 'input', thumbnailFileName);
    const outputDir = path.join(__dirname, '../output');
    video.mv(videoDir);
    thumbnail.mv(thumbnailDir);
    console.log('39', videoDir, outputDir);
    //encoding
    encodeVideo(videoDir, outputDir)
        .then(() => {
            console.log('HLS files generated successfully!');
        })
        .catch((err) => {
            console.error('Error generating HLS files:', err);
        });
    //encoding

    const videoUrl = `http://localhost:5000/${videoFileName}`;
    const thumbnailUrl = `http://localhost:5000/${thumbnailFileName}`;
    const videoInfo = {
        title,
        description,
        thumbnail: thumbnailUrl,
        videoUrl: videoUrl,
        duration: 0,
        views: 0,
        likes: 0,
        dislikes: 0,
        uploadDate: new Date(),
        channel: {
            _id: '64f8e4b1c9b1b8f8f8f8f8f9', // Replace with actual channel ID
            name: 'CodeWithAhsan',
            profilePicture: 'https://via.placeholder.com/150',
            subscribers: 50000,
        },
        comments: [],
        tags: tags.split(','),
        category,
        privacy,
    };

    try {
        const token = req?.headers?.authorization;
        const accessToken = token?.split(" ")[1];
        const user = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        const db_user = await User.findOne({ email: user?.email });
        videoInfo.channel = {
            _id: db_user?._id, // Replace with actual channel ID
            name: db_user?.username,
            profilePicture: db_user?.profilePicture,
            subscribers: db_user?.subscribers,
        }
        //console.log(videoInfo);
        // console.log("Set-Cookie header:", res.getHeaders()["set-cookie"]);
        res.status(200).json({
            message: "Video Uploader Successfuly",

        });

    } catch (error) {
        console.error("Upload failed:", error.message);
        res.status(404).json({ message: "Invalid token", error: error.message });
    }
};