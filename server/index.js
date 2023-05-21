const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const multer = require('multer')
const Queue = require('bull')
const bodyParser = require('body-parser');
const connectDB = require('./db/db');
const cors = require('cors')
const app = express()
app.use(cors())
const PORT = process.env.PORT || 8000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const Video = mongoose.model('Video', {
    url: String,
    downloadUrl: String,
    status: String,
});
const upload = multer({ dest: 'uploads/' })
const videoQueue = new Queue('videoQueue')




app.post('/upload', async (req, res) => {
    try {
      const { videoUrl } = req.body;
      const video = new Video({
        url: videoUrl,
        status: 'processing',
      });
      await video.save();
      res.json({ message: 'Video uploaded successfully.', videoId: video._id });
      videoQueue.add({ videoId: video._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while uploading the video.' });
    }
  });

function processVideo(videoId) {
    Video.findById(videoId, async (error, video) => {
        if (error || !video) {
            console.error(error);
            return;
        }

        try {
            exec(`ffmpeg -i ${video.url} -vf "hqdn3d" ${video.url}-processed.mp4`, (error) => {
                if (error) {
                    console.error(error);
                    video.status = 'error';
                    video.save();
                } else {
                    video.downloadUrl = `${video.url}-processed.mp4`;
                    video.status = 'processed';
                    video.save();
                }
            });
        } catch (error) {
            console.error(error);
            video.status = 'error';
            video.save();
        }
    });
}
videoQueue.process(({ data }, done) => {
    processVideo(data.videoId);
    done();
});
app.get('/download/:videoId', (req, res) => {
    const { videoId } = req.params;
    Video.findById(videoId)
    .then((video) => {
      if (!video) {
        res.status(404).json({ error: 'Video not found.' });
      } else if (video.status === 'processed' && video.downloadUrl) {
        res.download(video.downloadUrl);
      } else {
        res.status(404).json({ error: 'Video is still processing.' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching the video.' });
    });
  });




dotenv.config()



app.listen(PORT, () => {
    console.log(`Backend Server is running on port ${PORT}`)
})
connectDB()