import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint GET transkripsi
app.get('/transkripsi', async (req, res) => {
  try {
    const { url } = req.query;
    
    // Validasi URL YouTube
    if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid YouTube URL'
      });
    }
    
    // API Supadata
    const apiUrl = `https://api.supadata.ai/v1/transcript?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-api-key': 'sd_f157dd66fb75b1d97401637babb4503c',
        'User-Agent': 'RiiCODE-Premium/1.0'
      }
    });
    
    const data = await response.json();
    
    if (data.success || data.transcript) {
      let transcriptText = '';
      if (data.content && Array.isArray(data.content)) {
        transcriptText = data.content.map(item => item.text).join(' ');
      } else {
        transcriptText = data.transcript || data.text || 'No transcript available';
      }
      
      res.json({
        success: true,
        transcript: transcriptText,
        videoInfo: {
          title: data.title || 'YouTube Video Transcript',
          duration: data.duration || 'Unknown',
          language: data.language || 'en',
          wordCount: transcriptText.split(' ').length
        }
      });
    } else {
      throw new Error(data.error || 'Failed to get transcript from Supadata API');
    }
    
  } catch (error) {
    console.error('Transcript error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get transcript. Please check the URL and ensure the video has captions available.'
    });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
