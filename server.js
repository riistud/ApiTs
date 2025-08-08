import express from 'express';
import fetch from 'node-fetch';

const app = express();

app.get('/transkripsi', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
      return res.status(400).send('Please provide a valid YouTube URL');
    }

    const apiUrl = `https://api.supadata.ai/v1/transcript?url=${encodeURIComponent(url)}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-api-key': 'sd_f157dd66fb75b1d97401637babb4503c',
        'User-Agent': 'RiiCODE-Premium/1.0'
      }
    });

    const data = await response.json();

    // Ambil teks gabungan saja
    let transcriptText = '';
    if (data.content && Array.isArray(data.content)) {
      transcriptText = data.content.map(item => item.text).join(' ');
    } else if (data.transcript) {
      transcriptText = data.transcript;
    } else {
      transcriptText = 'No transcript available';
    }

    res.send(transcriptText); // Hanya kirim teks
  } catch (error) {
    console.error('Transcript error:', error);
    res.status(500).send('Failed to get transcript.');
  }
});

export default app; // Untuk Vercel
