import mongoose from 'mongoose';
import chalk from 'chalk';

export class ConnectMongodb {
	DB_URL = process.env.DB_URL;
	constructor() {
		if (!ConnectMongodb.instance) {
			mongoose.connect(this.DB_URL);
			this.connection = mongoose.connection;
			this.connection.on('open', () =>
				console.log(`Connected to < ${process.env.NODE_ENV} > mongodb database successfully`)
			);
			this.connection.on('error', (err) => {
				console.log(chalk.red(`Mongodb connection error : ${err?.message}`));
				process.exit(1);
			});
		}
	}
}

export async function disconnectMongodb() {
	await mongoose.disconnect();
}
