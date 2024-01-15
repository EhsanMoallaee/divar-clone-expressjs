import request from 'supertest';

import app from '../../src/app.js';

describe('App health test', () => {
	it('return 200 and ok message for app health test', async () => {
		const response = await request(app).get('/_health');
		expect(response.status).toBe(200);
		expect(response.body.message).toBe('ok');
	});
});
