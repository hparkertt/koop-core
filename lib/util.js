function stringify (thing, filter, space) {
  var obj = {}
  filter = filter || null
  space = space || '\t'

  Object.getOwnPropertyNames(thing).forEach(function (key) {
    obj[key] = thing[key]
  })

  console.log(obj)

  return JSON.stringify(obj, filter, space)
}

function errorResponse (err) {
  return {
    error: JSON.parse(stringify(err))
  }
}

module.exports = {
  stringify: stringify,
  errorResponse: errorResponse
}
