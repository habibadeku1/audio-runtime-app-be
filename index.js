const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');

// Configure multer to store uploaded files in the 'uploads' directory
const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(cors());

// Set up a route to handle file uploads
app.post('/upload', upload.single('audio'), (req, res) => {
  // Get the uploaded file path
  const filePath = req.file.path;

  // Execute FFmpeg to get the audio duration
  exec(`ffmpeg -i ${filePath} 2>&1 | grep Duration`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error occurred during FFmpeg execution:', error);
      return res.status(500).send('An error occurred during file processing.');
    }

    // Extract the duration information from the FFmpeg output
    const durationRegex = /Duration: ([\d:.]+)/;
    const durationMatch = stdout.match(durationRegex);

    if (!durationMatch || durationMatch.length < 2) {
      console.error('Unable to determine audio duration.');
      return res.status(400).send('Unable to determine audio duration.');
    }

    const duration = durationMatch[1]; // e.g., 00:02:34.56

    // Convert duration to seconds
    const [hours, minutes, seconds] = duration.split(':');
    const totalSeconds = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseFloat(seconds);

    res.send(`Audio duration: ${totalSeconds} seconds.`);
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
