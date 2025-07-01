const express = require('express');

var app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended:false }));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/movies', require('./routes/api/movies'));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});