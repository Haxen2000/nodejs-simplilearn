const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

/* Create DB connection */
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodemysql'
});

/* Connect to DB */
db.connect(err => queryResponse(err, null, 'MySQL Connected!'));

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

function queryResponse(err, res, message, results) {
  if(err) {
    throw err;
  }
  if (res) {
    res.send(message);
  }
  else {
    console.log(message);
  }
  if (results) {
    console.log(results);
  }
}

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

/* Create DB */
app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE nodemysql';
  db.query(sql, err => queryResponse(err, res, 'Database created!'));
});

/* Create table */
app.get('/createemployee', (req, res) => {
  let sql = 'CREATE TABLE employee(id int AUTO_INCREMENT, name VARCHAR(255), designation VARCHAR(255), PRIMARY KEY(id))';
  db.query(sql, err => queryResponse(err, res, 'Employee table created!'));
});

/* Insert employee */
app.get('/employee1', (req, res) => {
  let post = {
    name: 'John Doe',
    designation: 'CEO',
  };
  let sql = 'INSERT INTO employee SET ?';
  let query = db.query(sql, post, err => queryResponse(err, res, 'Employee added!'));
});

/* Select employee */
app.get('/getemployee', (req, res) => {
  let sql = 'SELECT * FROM employee';
  let query = db.query(sql, (err, results) => queryResponse(err, res, 'Employee details fetched!', results));
});

/* Update employee */
app.get('/updateemployee/:id', (req, res) => {
  let newName = 'Stephen Synowsky';
  let sql = `UPDATE employee SET name = '${newName}' WHERE id = ${req.params.id}`;
  let query = db.query(sql, err => queryResponse(err, res, 'Employee updated!'));
});

/* Delete employee */
app.get('/deleteemployee/:id', (req, res) => {
  let sql = `DELETE FROM employee WHERE id = ${req.params.id}`;
  let query = db.query(sql, err => queryResponse(err, res, 'Employee deleted!'));
});
