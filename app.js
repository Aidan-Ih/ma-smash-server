import express from 'express';
import cors from "cors";
import StartggWorker from './Startgg/StartggWorker.js';

const app = express();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('NE Smash Website Start.gg Server')
})

StartggWorker(app);
app.listen(4000);
console.log("start.gg worker listening on port 4000")