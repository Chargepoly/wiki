/* global WIKI */

const FLAG = '[API]'

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
    WIKI.logger.info(`${FLAG} Request to create WIKI user. Email = ${req.body.email}`)

    // Search if user with email already exists
    const userWithSameEmail = await WIKI.models.users.query().findOne({
      email: req.body.email
    })

    if (userWithSameEmail) {
      WIKI.logger.warn(`${FLAG} Cannot create WIKI user with email ${req.body.email}. Email already used`)
      return res.status(409).json({error: 'Email already used'})
    }

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
      WIKI.logger.error(`${FLAG} Request to create WIKI user. Cannot find group with name Users`)
      return res.status(404).json({error: 'Unknown group Users'})
    }
    await user.$relatedQuery('groups').relate(usersGroup.id)

    // eslint-disable-next-line no-undef
    WIKI.logger.info(`${FLAG} WIKI user created with email: ${req.body.email}, id : ${user.id}`)
    return res.status(201).json(user)
  } catch (error) {
    WIKI.logger.error(`${FLAG} Error during WIKI user creation with email: ${req.body.email}`)
    WIKI.logger.error(error)
    return res.status(500).json(error)
  }
})

/**
 * Delete a user with his email
 * /users?email=
 */
router.delete('/users', validateQuery(deleteUserAdminSchema), requiresApiKey, async(req, res) => {
  try {
    WIKI.logger.info(`${FLAG} Request to delete WIKI user. Email = ${req.query.email}`)
    const user = await WIKI.models.users.query().findOne({
      email: req.query.email
    }).select('id')

    if (!user) {
      WIKI.logger.warn(`${FLAG} Cannot delete WIKI user with email = ${req.query.email} cause he does not exist.`)
      return res.status(404).json({error: 'Unknown user'})
    }

    const id = user.id

    // Protect users created by finalize script
    if (id <= 4) {
      WIKI.logger.warn(`${FLAG} Cannot delete WIKI user with email = ${req.query.email} cause he is protected.`)
      return res.status(400).json({error: 'Protected user'})
    }

    await WIKI.models.users.deleteUser(id, 1)

    WIKI.auth.revokeUserTokens({ id, kind: 'u' })
    WIKI.events.outbound.emit('addAuthRevoke', { id, kind: 'u' })

    WIKI.logger.info(`${FLAG} Wiki user deleted with email: ${req.query.email} and tokens revoked.`)
    return res.status(200).json(user)
  } catch (error) {
    WIKI.logger.error(`${FLAG} Error during WIKI user deletion with email : ${req.query.email}`)
    WIKI.logger.error(error)
    return res.status(500).json(error)
  }
})

/**
 * Change user password
 */
router.patch('/users/change-password', validateBody(changeUserAdminPasswordSchema), requiresApiKey, async(req, res) => {
  try {
    console.log(req.body)

    WIKI.logger.info(`${FLAG} Request to change WIKI user password. Email = ${req.body.email}`)
    const user = await WIKI.models.users.query().findOne({
      email: req.body.email
    })

    if (!user) {
      WIKI.logger.warn(`${FLAG} Cannot change password of WIKI user with email = ${req.body.email} cause he does not exist.`)
      return res.status(404).json({error: 'Unknown user'})
    }

    user.password = req.body.password

    await WIKI.models.users.query().update(user).where('id', user.id)

    WIKI.logger.info(`${FLAG} Wiki user password changed with email: ${req.body.email}`)
    return res.status(200).json(user)
  } catch (error) {
    WIKI.logger.error(`${FLAG} Error during WIKI user password change.`)
    WIKI.logger.error(error)
    return res.status(500).json(error)
  }
})

router.get('/status', (req, res) => {
  WIKI.logger.info(`${FLAG} Request to get WIKI API status.`)
  return res.status(200).json({
    'status': 'ok'
  })
})

module.exports = router
