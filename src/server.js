import http from 'http';

import app from './app.js';
import { ConnectMongodb } from './dataAccessLayer/connect.database.js';

class Application {
	constructor() {
		this.setupDatabase();
		this.setupExpressServer();
	}

	setupDatabase() {
		new ConnectMongodb();
	}

	setupExpressServer() {
		const PORT = process.env.PORT || 3000;
		const server = http.createServer(app);

		server.listen(PORT, () => console.log(`Server is running on:  http://localhost:${PORT}`));
	}
}

export default Application;
