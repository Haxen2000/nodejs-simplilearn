const express = require('express');
const jwt = require('jsonwebtoken');

var app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended:false }));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/movies', require('./routes/api/movies'));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Posts created...',
        authData
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  const user = {
    id: 1,
    username: "John",
    email: "john@email.com"
  };

  jwt.sign({user: user}, 'secretkey', (err, token) => {
    res.json({token});
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}