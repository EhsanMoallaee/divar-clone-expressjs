import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import path from 'path';
import useragent from 'express-useragent';

import errorController from './modules/errorHandling/error.controller.js';
import mainRouter from './routes/main.routes.js';
import swaggerConfig from './common/swaggerConfig/swagger.config.js';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(helmet());
app.use(cors());
app.disable('x-powered-by');
app.use(useragent.express());
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '..', 'static')));

swaggerConfig(app);

// App health check route
app.get('/_health', (req, res) => {
	return res.status(200).json({ message: 'ok' });
});

app.use('/api', mainRouter);

app.use(errorController);
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
	res.status(404).json({ message: 'Page not found' });
});

export default app;
