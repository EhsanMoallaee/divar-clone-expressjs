import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

function swaggerConfig(app) {
	const swaggerDocument = swaggerJSDoc({
		swaggerDefinition: {
			info: {
				title: 'Divar Clone',
				description: 'Express & Mongodb',
				version: '1.0.0',
			},
		},
		apis: [],
	});

	const swagger = swaggerUi.setup(swaggerDocument, {});
	app.use('/swagger', swaggerUi.serve, swagger);
}

export default swaggerConfig;
