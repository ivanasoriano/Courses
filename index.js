require('dotenv').config();
const axios = require('axios');
const express = require('express');
const path = require('path');
const rateLimit = require("express-rate-limit");

const coursesRoutes =require('./routes/courses');
const coursesUsers =require('./routes/users');

const app = express();

const session = require("express-session");
const nosniff = require('dont-sniff-mimetype');
const helmet = require("helmet");
const fs = require("fs");
const https = require("https");
const httpsOptions = {
    key: fs.readFileSync(path.resolve(__dirname, "./cert/server.key")),
    cert: fs.readFileSync(path.resolve(__dirname, "./cert/server.crt"))
};

app.use(helmet());
    
// Evite la apertura de la página en un frame para protegerse del secuestro de clics
app.use(helmet.frameguard()); 

// Permite cargar recursos solo desde dominios incluidos en la lista blanca
app.use(helmet.contentSecurityPolicy()); 

// Permite la comunicación solo en HTTPS
app.use(helmet.hsts());

// Obliga al navegador a usar solo el tipo de contenido establecido en el encabezado de respuesta en lugar de adivinarlo
app.use(nosniff());

app.use(express.static('static'));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5
});

app.use(apiLimiter);

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

app.use(session({
  secret: "session_cookie_secret_key_here",
  saveUninitialized: true,
  resave: true,
  key: "sessionId",
  cookie: {
      httpOnly: true,
       secure: true
  }

}));

// Rutas (URLs)
app.use('/courses',coursesRoutes);
app.use('/users',coursesUsers);

const port = process.env.PORT || 3000;
// eslint-disable-next-line no-console

//app.listen(3000);
//console.log('App listening on port 3000');

// Inicializa servidor
//app.listen(app.get('port'), () => {
//    console.log('Server en puerto ',app.get('port'))
//});

https.createServer(httpsOptions, app).listen(port, () => {
  console.log(`Server en puerto ${port}`);
});

