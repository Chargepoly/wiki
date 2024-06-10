
module.exports = function validateBody(joiSchema) {
  return function(req, res, next) {
    const { error } = joiSchema.validate(req.body)

    if (error) {
      return res.status(400).json(error)
    }

    next()
  }
}
