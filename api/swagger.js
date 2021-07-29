const { createWriteStream } = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');

const specs = swaggerJsdoc({
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
      title: 'Test API',
      version: '1.0.0',
      description: 'Test Express API with autogenerated swagger doc',
    },
  },
  apis: ['./dist/controllers/*.js'],
});

const file = createWriteStream('./swagger-spec.json');

file.on('error', (err) => {
  console.log(err);
});

file.write(JSON.stringify(specs));

file.end();
