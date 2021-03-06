const info = require('./info/info.service.js')
const check = require('./check/check.service.js')
const users = require('./users/users.service.js')
// const todos = require('./todos/todos.service.js');
// const secure = require('./secure/secure.service.js');
const messages = require('./messages/messages.service.js')

module.exports = function (app) {
  app.configure(info)
  app.configure(check)
  app.configure(users)
  // app.configure(todos);
  // app.configure(secure);
  app.configure(messages)
}
