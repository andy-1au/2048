//create a demo server using express
const express = require('express');
const path = require('path');

let app = express();

let publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));

let currscore = 0;
let scores = [];

app.get('/scores', (req, res) => {
    let score = req.query.score; // get the score from the query string
    scores = score.split(','); // split the scores into an array
    scores.sort((a, b) => b - a); // sort the scores in descending order
    scores = scores.slice(0, 5); // get the top 5 scores
    res.send(scores); // send the scores back to the client
});

app.listen(3000, () => { console.log('Server is running on port 3000') });