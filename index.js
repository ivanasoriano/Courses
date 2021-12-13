require('dotenv').config();
const axios = require('axios');
const express = require('express');
const path = require('path');

const coursesRoutes =require('./routes/courses');
const coursesUsers =require('./routes/users');

const app = express();

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.get('/auth', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`,
  );
});

app.get('/oauth-callback', ({ query: { code } }, res) => {
  const body = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_SECRET,
    code,
  };
  const opts = { headers: { accept: 'application/json' } };
  axios
    .post('https://github.com/login/oauth/access_token', body, opts)
    .then((_res) => _res.data.access_token)
    .then((token) => {
      // eslint-disable-next-line no-console
      //console.log('My token:', token);
      res.redirect(`/?token=${token}`);
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});

// Middlewares
app.use(express.json());

// Rutas (URLs)
app.use('/courses',coursesRoutes);
app.use('/users',coursesUsers);

app.listen(3000);
// eslint-disable-next-line no-console
console.log('App listening on port 3000');

