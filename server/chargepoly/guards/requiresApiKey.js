/* global WIKI */

module.exports = async function requiresApiKey(req, res, next) {
  const authorization = req.headers.authorization

  if (!authorization) {
    return res.status(400).json({error: 'API key required'})
  }

  const key = authorization.split(' ')[1]

  const apiKey = await WIKI.models.apiKeys.query().findOne({
    key,
    isRevoked: false
  })

  if (!apiKey) {
    return res.status(400).json({error: 'API key not valid'})
  }

  next()
}
