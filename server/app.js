import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import routes from './routes';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));

const apiDocsUrl =
 'https://app.swaggerhub.com/apis/omobosteven/maintenance-tracker/1.0.0';

app.get('/', (request, response) =>
  response.redirect(apiDocsUrl));
app.use(routes);

const port = parseInt(process.env.PORT, 10) || 3000;

app.listen(port);

export default app;
