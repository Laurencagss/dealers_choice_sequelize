const express = require('express');
const app = express();
const { syncAndSeed, models: { Show, Song} } = require('./db');
const path = require('path');

//homepage
app.get('/', async (req, res, next) => {
    try {
        res.send(`
            <head>
            </head>
            <body>
            <h1>Dealers Choice Sequelize!</h1>
            <p>Shows and their songs!</p>
            <div>
                <a href='/shows'>Shows</a>
            </div>
            <div>
                <a href='/songs'>Songs</a>
            </div>
            </body>
        `)
    }
    catch (err) {
        console.log(err)
    }
})

//shows page
app.get('/shows', async (req, res, next) => {
    try {
        const shows = await Show.findAll({ include: Song });
        res.send(`
        <head>
            </head>
        <body>
            <a href='/'>Homepage</a>
            ${shows.map(shows => `
            <h3>${shows.name}</h3>
            `).join('')}
        </body>`);
    } catch(err) {
        next(err)
    }
})

// songs page
app.get('/songs', async (req, res, next) => {
    try {
         const shows = await Show.findAll({ include: Song });
        const songs = await Song.findAll({ include: Show });
        res.send(`
        <head>
            </head>
        <body>
            <h1>Some Songs from Broadway</h1>
            <a href='/'>Homepage</a>
            ${songs.map(songs => `
                <div>
                    <h3>${songs.name}</h3>
                    <h5>Song: ${songs.name}</h5>
                </div>
            `).join('')}
        </body>`);
    } catch(err) {
        next(err);
    }
})


const init = async () => {
    try {
      await syncAndSeed();
  
      const port = process.env.PORT || 3000;
  
      app.listen(port, () => {
        console.log(`Listening on port: ${port}`);
      });
    } catch (ex) {
      console.log(ex);
    }
  };
  
  init();