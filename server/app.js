
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import routes from './routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));

const apiDocsUrl =
 'https://app.swaggerhub.com/apis/omobosteven/maintenance-tracker/1.0.0';

app.get('/apidocs', (request, response) =>
  response.status(200).redirect(apiDocsUrl));

app.get('/', (request, response) => response.status(200).json({
  status: 'success',
  message: 'Welcome to maintenanc tracker app',
}));
app.use(routes);

const port = parseInt(process.env.PORT, 10) || 3000;

app.listen(port);

export default app;
