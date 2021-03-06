const { paths } = require('@netlify/open-api')
const omit = require('omit.js')

// Retrieve all OpenAPI operations
const getOperations = function() {
  return [].concat(
    ...Object.entries(paths).map(([path, pathItem]) => {
      const operations = omit(pathItem, ['parameters'])
      return Object.entries(operations).map(([method, operation]) => {
        const parameters = getParameters(pathItem.parameters, operation.parameters)
        return Object.assign({}, operation, { verb: method, path, parameters })
      })
    })
  )
}

const getParameters = function(pathParameters = [], operationParameters = []) {
  const parameters = [...pathParameters, ...operationParameters]
  return parameters.reduce(addParameter, { path: {}, query: {}, body: {} })
}

const addParameter = function(parameters, param) {
  return Object.assign({}, parameters, {
    [param.in]: Object.assign({}, parameters[param.in], { [param.name]: param })
  })
}

module.exports = { getOperations }
