import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [movieName, setMovieName] = useState('');
  const [review, setReview] = useState('');
  const [movieReviewList, setMovieReviewList] = useState([]);
  const [newReview, setNewReview] = useState('');

  const updateReviewRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/get')
    .then(res => {
      console.log(res.data);
      setMovieReviewList(res.data);
    })
    .catch(err => {
      console.error(err); 
    })
  }, [])

  const submitReview = () => {
    axios.post('http://localhost:3001/api/insert',{movieName: movieName, movieReview: review});
    
    setMovieReviewList([...movieReviewList, {movieName: movieName, movieReview: review}]);

    document.getElementById('movieNameInput').value = '';
    document.getElementById('reviewInput').value = '';
  };

  const deleteReview = movieName => {
    axios.delete(`http://localhost:3001/api/delete/${movieName}`);

      setMovieReviewList(movieReviewList.filter((movieReview) => {
        return movieReview.movieName !== movieName;
      }))
  };

    const updateReview = movieName => {
    axios.put(`http://localhost:3001/api/update`, {movieName: movieName, movieReview: newReview});

    setMovieReviewList(movieReviewList.map((filmObj) => {
      return filmObj.movieName === movieName ? {movieName: movieName, movieReview: newReview} : filmObj;
    }))
    updateReviewRef.current.value = '';
  };

  return (
    <div className="App">
      <div className="form">
        <h1>CRUD APPLICATION</h1>
        <label>Movie Name:</label>
        <input 
        id="movieNameInput"
        type="text" 
        name="movieName"
        onChange={(e) => setMovieName(e.target.value)} 
        />
        <label>Review:</label>
        <input 
        id="reviewInput"
        type="text" 
        name="review"
        onChange={(e) => setReview(e.target.value)}
        />
        <button onClick={() => submitReview()}>Submit</button>

        {movieReviewList.map((val, idx) => {
          return (
            <div className="card" key={idx}>
              <h1>{val.movieName}</h1>
              <p>{val.movieReview}</p>

              <button
              onClick={() => deleteReview(val.movieName)}
              >
                Delete
              </button>

              <input 
              id="updateInput"
              type="text" 
              onChange={(e) => setNewReview(e.target.value)}
              ref={updateReviewRef}
              />

              <button 
              onClick={() => updateReview(val.movieName)}
              >
                Update
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
