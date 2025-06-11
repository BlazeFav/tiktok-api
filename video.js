const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

async function getDownloadLink(url, locale = 'id') {
  try {
    const instance = axios.create({ headers: { 'User-Agent': 'Mozilla/5.0' } });

    const homepage = await instance.get(`https://ssstik.io/${locale}`);
    const $ = cheerio.load(homepage.data);
    const token = $('input[name="tt"]').val();

    const form = new URLSearchParams({
      id: url,
      locale,
      tt: token
    });

    const response = await instance.post('https://ssstik.io/abc', form.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      maxRedirects: 0
    });

    const $$ = cheerio.load(response.data);
    const videoUrl = $$('a[href*=".mp4"]').attr('href');
    return videoUrl || null;
  } catch (err) {
    console.error('Video error:', err.message);
    return null;
  }
}

router.post('/tiktok', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  let video = await getDownloadLink(url, 'id');
  if (!video) video = await getDownloadLink(url, 'en');

  if (video) return res.json({ video_url: video });
  return res.status(500).json({ error: "Failed to fetch video" });
});

module.exports = router;
