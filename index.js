const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const cors = require('cors');
const { getAudioDurationInSeconds } = require('get-audio-duration')
import { parseFile } from 'music-metadata';
import { inspect } from 'util';

// Configure multer to store uploaded files in the 'uploads' directory
const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(cors());

// Set up a route to handle file uploads
app.post('/upload', upload.single('audio'), async (req, res) => {
  // Get the uploaded file path
  const filePath = req.file.path;

  try {
    const metadata = await parseFile(filePath);
    console.log(inspect(metadata, { showHidden: false, depth: null }));
    res.send(JSON.stringify(metadata));
    // res.send(`Audio duration: ${duration} seconds.`);
  } catch (error) {
    console.error(error.message);
  }

  // getAudioDurationInSeconds(filePath).then((duration) => {
  //   console.log(duration)
  //   res.send(`Audio duration: ${duration} seconds.`);
  // });

  // Execute FFmpeg to get the audio duration
  // exec(`ffmpeg -i ${filePath} 2>&1 | grep Duration`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error('Error occurred during FFmpeg execution:', error);
  //     return res.status(500).send('An error occurred during file processing.');
  //   }

  //   // Extract the duration information from the FFmpeg output
  //   const durationRegex = /Duration: ([\d:.]+)/;
  //   const durationMatch = stdout.match(durationRegex);

  //   if (!durationMatch || durationMatch.length < 2) {
  //     console.error('Unable to determine audio duration.');
  //     return res.status(400).send('Unable to determine audio duration.');
  //   }

  //   const duration = durationMatch[1]; // e.g., 00:02:34.56

  //   // Convert duration to seconds
  //   const [hours, minutes, seconds] = duration.split(':');
  //   const totalSeconds = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseFloat(seconds);

  //   res.send(`Audio duration: ${totalSeconds} seconds.`);
  // });
});

// Start the server
app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
