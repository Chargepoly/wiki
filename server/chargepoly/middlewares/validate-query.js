
module.exports = function validateQuery(joiSchema) {
  return function(req, res, next) {
    const { error } = joiSchema.validate(req.query)

    if (error) {
      return res.status(400).json(error)
    }

    next()
  }
}
