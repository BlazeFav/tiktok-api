const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

async function getMp3Link(url, locale = 'id') {
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
    const mp3Url = $$('a[href*=".mp3"]').attr('href');
    return mp3Url || null;
  } catch (err) {
    console.error('MP3 error:', err.message);
    return null;
  }
}

router.post('/tiktok/mp3', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  let mp3 = await getMp3Link(url, 'id');
  if (!mp3) mp3 = await getMp3Link(url, 'en');

  if (mp3) return res.json({ mp3_url: mp3 });
  return res.status(500).json({ error: "Failed to fetch MP3" });
});

module.exports = router;
