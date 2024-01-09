import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

function swaggerConfig(app) {
	const swaggerDocument = swaggerJSDoc({
		swaggerDefinition: {
			openapi: '3.1.0',
			info: {
				title: 'Divar Clone',
				description: 'Expressjs & Mongodb',
				version: '1.0.0',
			},
			servers: [
				{
					url: `http://localhost:3000`,
				},
			],
		},
		apis: ['./src/**/*.swagger.js', './src/**/*.schemas.js', './src/**/*.definitions.js'],
	});

	const swagger = swaggerUi.setup(swaggerDocument, {});
	app.use('/swagger', swaggerUi.serve, swagger);
}

export default swaggerConfig;
