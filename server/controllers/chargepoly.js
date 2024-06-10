/* global WIKI */

const express = require('express')
const router = express.Router()

const Joi = require('joi')
const requiresApiKey = require('../chargepoly/guards/requires-api-key')
const validateBody = require('../chargepoly/middlewares/validate-body')
const validateQuery = require('../chargepoly/middlewares/validate-query')

const addUserAdminsSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

const deleteUserAdminSchema = Joi.object({
  email: Joi.string().email().required()
})

const changeUserAdminPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required()
})

/**
 * Add a user with encrypted-password.
 * {
 *    email : 'john.doe@easiware.fr,
 *    password : 'encrypted-password',
 * }
 */
router.post('/users', validateBody(addUserAdminsSchema), requiresApiKey, async (req, res) => {
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

/**
 * Delete a user with his email
 * /users?email=
 */
router.delete('/users', validateQuery(deleteUserAdminSchema), requiresApiKey, async(req, res) => {
  const user = await WIKI.models.users.findOne({
    email: req.query.email
  }).select('id')

  if (!user) {
    return res.status(404).json({error: 'Unknown user'})
  }

  const id = user.id

  await WIKI.models.users.deleteUser(id, 1)

  WIKI.auth.revokeUserTokens({ id, kind: 'u' })
  WIKI.events.outbound.emit('addAuthRevoke', { id, kind: 'u' })

  return res.status(200).json(user)
})

/**
 * Change user password
 */
router.patch('/users/change-password', validateBody(changeUserAdminPasswordSchema), requiresApiKey, async(req, res) => {
  const user = await WIKI.models.users.findOne({
    email: req.body.email
  }).select('id')

  if (!user) {
    return res.status(404).json({error: 'Unknown user'})
  }

  await WIKI.models.users.update({
    id: user.id,
    password: req.body.password
  })

  return res.status(200).json(user)
})

router.get('/status', (req, res) => {
  return res.status(200).json({
    'status': 'ok'
  })
})

module.exports = router
