const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'CRUDDB'
});

const PORT = 3001;

app.use(cors());
app.use(express.json());
// deprecated:
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/get', (req, res) => {
    const sqlSelect = `SELECT * FROM movie_reviews;`;
    db.query(sqlSelect, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
        });
});

app.post('/api/insert', (req, res) => {
    const movieName = req.body.movieName;
    const movieReview = req.body.movieReview;

    const sqlInsert = `INSERT INTO movie_reviews (movieName, movieReview) VALUES (?,?);`
    db.query(sqlInsert, [movieName, movieReview], (err, result) => {
        res.send(result);
    });
});

app.put('/api/update', (req, res) => {
  const name = req.body.movieName;
  const review = req.body.movieReview;
  const sqlUpdate = `UPDATE movie_reviews SET movieReview = ? WHERE movieName = ?;`;
  db.query(sqlUpdate, [review, name], (err, result) => {
    if (err) {
        console.log(err);
    } else {
        res.send(result);
    }
  });
});

app.delete('/api/delete/:movieName', (req, res) => {
  const name = req.params.movieName;
  const sqlDelete = `DELETE FROM movie_reviews WHERE movieName = ?;`;
  db.query(sqlDelete, name, (err, result) => {
    if (err) {
        console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});