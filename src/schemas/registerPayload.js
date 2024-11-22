module.exports = {
    type: 'object',
  properties: {
    email: {
      type: 'string',
      pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
    },
    password: {
      type: 'string'
    },
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    phone: {
      type: 'string'
    },
  },
  required: [
    'email',
    'password',
    'firstName',
    'lastName'
  ],
  additionalProperties: false
};
