import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import { router as playerRoute } from './src/routes/player.js';
import { router as versionRoute } from './src/routes/version.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
const port = 4000;//process.env.PORT || 7000;

app.use('/player', playerRoute);
app.use('/version', versionRoute);

app.listen(port);

console.log(`Server is running on Port: ${port}`);