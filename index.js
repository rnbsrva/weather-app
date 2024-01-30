require('dotenv').config();
const express = require('express');
var request = require('request');

const app = express();

app.use('/static', express.static('public'));

const apiKey = process.env.WEATHER_OPEN_API_KEY;

const CITY_API_URL = process.env.CITY_API_URL
const JOKE_API_URL = process.env.JOKE_API_URL
const NEXT_PUBLIC_UNSPLASH_CLIENT_ID = process.env.NEXT_PUBLIC_UNSPLASH_CLIENT_ID

app.get('/weather', (httpReq, httpRes) => {
    const city = httpReq.query.city
    request(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`, { method: 'GET' }, (err, res) => {
        if (err != null) {
            console.log('err', err)

            httpRes.json({ err })
        } else {
            httpRes.json(JSON.parse(res.body))
        }
    })
})


app.get('/cities', async (req, httpRes) => {
    const cityName = req.query.city;

    if (!cityName) {
        httpRes.status(400).json({ error: 'Missing city parameter' });
        return;
    }

    try {
        const response = await fetch(CITY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city: cityName }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        httpRes.json(data);
    } catch (error) {
        console.error('Error:', error.message);
        httpRes.status(500).json({ error: 'Error fetching cities' });
    }
});


app.get("/image", async (req, httpRes)  => {
    let city = req.query.city;

    fetch(
        `https://api.unsplash.com/photos/random?query=${city}&client_id=${NEXT_PUBLIC_UNSPLASH_CLIENT_ID}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const photoUrl = data.urls.regular;
          httpRes.json(photoUrl);
        })
        .catch((error) => {
          console.error("Error fetching photo from Unsplash:", error);
        });

})




app.listen(3000, () => console.log(`app running on port 3000`))