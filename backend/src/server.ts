import express from 'express';
import routes from './routes';
import routesStatic from './routesStatic';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());
app.use('/v1', routes);
app.use('/static', routesStatic);

app.listen(8080);