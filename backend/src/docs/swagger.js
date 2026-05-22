import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Srishti Roy Therapy API',
      version: '1.0.0',
      description: 'Booking platform API for Srishti Roy - Counselling Psychologist',
    },
    servers: [
      { url: 'http://localhost:5000/api/v1', description: 'Local' },
      { url: 'https://api.awakenwithsrishti.com/api/v1', description: 'Production' },
    ],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
});
