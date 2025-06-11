const express = require('express');
const app = express();

const videoRouter = require('./video');
const mp3Router = require('./mp3');

app.use(express.json());
app.use(videoRouter);
app.use(mp3Router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`TikTok API running on port ${PORT}`));
