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
app.listen(process.env.PORT || 4000);


 