/* global WIKI */

const express = require('express')
const router = express.Router()

const Joi = require('joi')
const requiresApiKey = require('../chargepoly/guards/requiresApiKey')
const validateBody = require('../chargepoly/middlewares/validateBody')

const syncUserAdminsSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

/**
 * Add a user with encrypted-password.
 * {
 *    email : 'john.doe@easiware.fr,
 *    password : 'encrypted-password',
 * }
 */
router.post('/users', validateBody(syncUserAdminsSchema), requiresApiKey, async (req, res, next) => {
  try {
    const user = await WIKI.models.users.query().insert({
      email: req.body.email,
      provider: 'local',
      password: req.body.password,
      name: req.body.email,
      locale: 'en',
      defaultEditor: 'markdown',
      tfaIsActive: false,
      isActive: true,
      isVerified: true
    })

    const usersGroup = await WIKI.models.groups.query().findOne({
      name: 'Users'
    })

    if (!usersGroup) {
      return res.status(404).json({error: 'Unknown group Users'})
    }
    await user.$relatedQuery('groups').relate(usersGroup.id)

    // eslint-disable-next-line no-undef
    return res.status(201).json(user)
  } catch (error) {
    return res.status(400).json(error)
  }
})

router.get('/status', (req, res) => {
  return res.status(200).json({
    'status': 'ok'
  })
})

module.exports = router
