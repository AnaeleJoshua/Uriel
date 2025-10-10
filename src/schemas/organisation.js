module.exports = {
    type: 'object',
    properties: {
      orgName: {
        type: 'string'
      },
      description: {
        type: 'string'
      }
    },
    required: [
      'orgName','description'
      
    ],
    additionalProperties: false
}