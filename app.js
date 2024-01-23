const express = require('express');
const axios = require('axios');
const { GeocodingClient } = require('opencage-api-client');
const NewsAPI = require('newsapi');

const app = express();
const PORT = 3000;

const openWeatherApiKey = '1b9ec28bb846a144242890e96c8eb32d';
const opencageApiKey = '7eda0e0f53c547c4832b4f01e0b457b4';
const newsApiKey = 'ad2bb1c02a024a2c88fcfeb33e17480c';

const newsapi = new NewsAPI(newsApiKey);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Welcome to the Weather and News App!');
});

app.get('/weather', async (req, res) => {
    const city = req.query.city || 'New York'; 
  
    try {
      const geoResponse = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          q: city,
          key: opencageApiKey,
        },
      });
  
      const location = geoResponse.data.results[0].geometry;
  
      const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          lat: location.lat,
          lon: location.lng,
          appid: openWeatherApiKey,
        },
      });
  
      const weatherData = weatherResponse.data;
  
      res.json({ location, weather: weatherData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/news', async (req, res) => {
    const query = req.query.query || 'latest'; 
  
    try {
      const newsResponse = await newsapi.v2.everything({
        q: query,
        language: 'en',
        sortBy: 'publishedAt', 
        pageSize: 5
      });
  
      console.log('News API Response:', newsResponse);
  
      const articles = newsResponse.articles;
  
      res.json({ articles });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
