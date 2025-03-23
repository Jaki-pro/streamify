const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

/**
 * Encodes the input video into multiple resolutions and generates HLS files.
 * @param {string} inputFile Path to the input video file.
 * @param {string} outputDir Path to the output directory.
 */
const encodeVideo = (inputFile, outputDir) => {
  return new Promise(async (resolve, reject) => {
    const resolutions = [
      { name: '720p', videoBitrate: '1000k', audioBitrate: '128k' },
      { name: '480p', videoBitrate: '600k', audioBitrate: '96k' },
      { name: '360p', videoBitrate: '300k', audioBitrate: '64k' },
    ];

    // Ensure output directories exist
    resolutions.forEach((res) => {
      const resPath = path.join(outputDir, res.name);
      if (!fs.existsSync(resPath)) fs.mkdirSync(resPath, { recursive: true });
    });

    try {
      // Encode each resolution sequentially
      for (const res of resolutions) {
        await processResolution(inputFile, outputDir, res);
      }

      // Generate master playlist
      generateMasterPlaylist(outputDir, resolutions);

      console.log('✅ Encoding finished successfully!');
      resolve();
    } catch (error) {
      console.error('❌ Error during encoding:', error);
      reject(error);
    }
  });
};

// Helper function to process each resolution
const processResolution = (inputFile, outputDir, res) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(outputDir, `${res.name}/playlist.m3u8`);
    const segmentPath = path.join(outputDir, `${res.name}/segment_%03d.ts`);

    // Ensure the input and output paths are correctly quoted for spaces in Windows
    const inputFilePath = `"${inputFile}"`;
    const outputFilePath = `"${outputPath}"`;
    const segmentFilePath = `"${segmentPath}"`;

    // Building the ffmpeg command with proper quotes around paths
    ffmpeg(inputFilePath)
      .outputOptions([
        '-c:v libx264',
        '-c:a aac',
        '-hls_time 10', // Segment duration
        '-hls_list_size 0', // Keep all segments
        '-f hls',
        `-b:v ${res.videoBitrate}`, // Video bitrate
        `-b:a ${res.audioBitrate}`, // Audio bitrate
        `-hls_segment_filename ${segmentFilePath}`, // Segment filename
        '-map 0:v:0',
        '-map 0:a:0',
      ])
      .output(outputFilePath)
      .on('start', (cmd) => console.log(`▶️ Started: ${res.name} - ${cmd}`))
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`📊 ${res.name}: ${progress.percent.toFixed(2)}% done`);
        }
      })
      .on('end', () => {
        console.log(`✅ Completed: ${res.name}`);
        resolve();
      })
      .on('error', (err) => reject(err))
      .run();
  });
};

// Helper function to generate the master playlist
const generateMasterPlaylist = (outputDir, resolutions) => {
  const masterPath = path.join(outputDir, 'master.m3u8');
  const content = resolutions
    .map(
      (res) =>
        `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(res.videoBitrate) * 1000},RESOLUTION=${
          res.name === '720p' ? '1280x720' : res.name === '480p' ? '854x480' : '640x360'
        }\n${res.name}/playlist.m3u8`
    )
    .join('\n');

  fs.writeFileSync(masterPath, `#EXTM3U\n${content}`);
  console.log('🎯 Master playlist created!');
};

module.exports = { encodeVideo };
