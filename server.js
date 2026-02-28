const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let fitnessData = [];

app.post('/addFitness', (req, res) => {
    fitnessData.push(req.body);
    res.json({success: true});
});

app.get('/getFitness', (req, res) => {
    res.json(fitnessData);
});

app.listen(8080, () => console.log('Server running on http://localhost:8080'));
