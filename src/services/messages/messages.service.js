// Initializes the `messages` service on path `/messages`
const createService = require('feathers-nedb');
const createModel = require('../../models/messages.model');
const hooks = require('./messages.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'messages',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  const messages = createService(options);
  // Describe API for swagger
  messages.docs = {
    description: 'A service to send and receive messages',
    definitions: {
      messages: {
        "type": "object",
        "required": [
          "text"
        ],
        "properties": {
          "text": {
            "type": "string",
            "description": "The message text"
          },
          "userId": {
            "type": "string",
            "description": "The id of the user that sent the message"
          }
        }
      },
      'messages list': {
        type: 'array',
        items: {
          $ref: '#/definitions/messages'
        }
      }
    }
  };
  // add service
  app.use('/messages', messages);

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('messages');
  service.hooks(hooks);
};
