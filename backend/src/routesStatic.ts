import path from "path";
import express from 'express';

import { AuthFiles } from "./middlewares/Auth";
import { playRingDing } from "./Controllers/RingDings";

const routesStatic = express.Router();
routesStatic.use('/public', express.static(path.join(__dirname, '..', 'public')));
routesStatic.get('/private/playback', AuthFiles, playRingDing);

export default routesStatic;