const express = require('express');
const botControllers = require('./controllers/botControllers');
const cors = require('cors')

const app = express();

app.use(cors());
app.use(express.json());

app.post('/', botControllers.fingerprint);
app.post('/frista', botControllers.frista);

app.listen(3000, () => {
    console.log("Listening on port 3000")
})