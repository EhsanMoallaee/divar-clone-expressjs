import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import mainRouter from './routes/main.routes.js';
import errorController from './modules/errorHandling/error.controller.js';
import swaggerConfig from './swaggerConfig/swagger.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.disable('x-powered-by');

app.use(cookieParser());
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

export default app;
