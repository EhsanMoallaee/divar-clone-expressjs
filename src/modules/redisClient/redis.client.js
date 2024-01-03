import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();
const { REDIS_HOST, REDIS_PORT, REDIS_DB, REDIS_USERNAME, REDIS_PASSWORD } = process.env;

class RedisSingleton {
	#redisClient;
	constructor() {
		if (!RedisSingleton.instance) {
			this.#redisClient = new Redis({
				host: REDIS_HOST,
				port: REDIS_PORT,
				username: REDIS_USERNAME,
				password: REDIS_PASSWORD,
				db: REDIS_DB,
			});
			this.#redisClient.on('connect', () => console.log('Singleton Redis client connected successfully'));
			this.#redisClient.on('error', (err) => console.log('Redis client connection error: ', err));
			return (RedisSingleton.instance = this);
		}
		return RedisSingleton.instance;
	}

	async setData(key, value, seconds) {
		await this.#redisClient.set(key, JSON.stringify(value), 'EX', seconds);
	}

	async getData(key) {
		const data = await this.#redisClient.get(key);
		return data;
	}

	// async setExpire(key, seconds) {
	// 	const data = await this.#redisClient.expire(key, seconds);
	// 	return data;
	// }
}

const redisSingletonInstance = new RedisSingleton();

export default redisSingletonInstance;
