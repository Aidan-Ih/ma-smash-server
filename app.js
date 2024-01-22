import express from 'express';
import cors from "cors";
import StartggWorker from './Startgg/StartggWorker.js';

console.log("starting")
  
const app = express();

console.log("created app")
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('NE Smash Website Start.gg Server')
})

console.log("starting app")
StartggWorker(app);
app.listen(4000);
console.log("listening on port 4000")