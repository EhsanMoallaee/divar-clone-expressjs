import mongoose from 'mongoose';
import chalk from 'chalk';

export class ConnectMongodb {
	DB_URL =
		process.env.NODE_ENV === 'test'
			? process.env.TEST_DB
			: process.env.NODE_ENV === 'development'
				? process.env.DEV_DB
				: process.env.PROD_DB;

	constructor() {
		if (!ConnectMongodb.instance) {
			mongoose.connect(this.DB_URL);
			this.connection = mongoose.connection;
			this.connection.on('open', () =>
				console.log(`Connected to < ${process.env.NODE_ENV} > database successfully`)
			);
			this.connection.on('error', (err) => {
				console.log(chalk.red(`Database connection error : ${err?.message}`));
				process.exit(1);
			});
		}
	}
}

export async function disconnectMongodb() {
	await mongoose.disconnect();
}
