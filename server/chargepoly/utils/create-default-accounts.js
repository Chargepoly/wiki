/* global WIKI */
const bcrypt = require('bcrypt')
const { randomUUID } = require('crypto')

/**
 *
 * Create default accounts. Admin + Guest + Default user (used to test)
 * @param {Number} adminsGroupId
 * @param {Number} guestsGroupId
 * @param {Number} creatorsGroupId
 * @param {Number} usersGroupId
 */
module.exports = async function createDefaultAccounts(adminsGroupId, guestsGroupId, creatorsGroupId, usersGroupId) {
  const adminUser = await WIKI.models.users.query().insert({
    email: process.env.ADMIN_EMAIL,
    provider: 'local',
    password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
    name: 'Administrator',
    locale: 'en',
    defaultEditor: 'markdown',
    tfaIsActive: false,
    isActive: true,
    isVerified: true,
    isSystem: true
  })
  await adminUser.$relatedQuery('groups').relate(adminsGroupId)
  WIKI.logger.info('Default administrator account created.')

  const guestUser = await WIKI.models.users.query().insert({
    provider: 'local',
    email: `${randomUUID()}@${randomUUID()}.fr`,
    name: 'Guest',
    password: await bcrypt.hash(randomUUID(), 10),
    locale: 'en',
    defaultEditor: 'markdown',
    tfaIsActive: false,
    isActive: true,
    isVerified: true,
    isSystem: true
  })
  await guestUser.$relatedQuery('groups').relate(guestsGroupId)
  WIKI.logger.info('Guest account created.')

  if (adminUser.id !== 1 || guestUser.id !== 2) {
    throw new Error('Incorrect users auto-increment configuration! Should start at 0 and increment by 1. Contact your database administrator.')
  }

  const creator = await WIKI.models.users.query().insert({
    provider: 'local',
    email: process.env.DEFAULT_CONTENT_CREATOR_EMAIL,
    name: 'Default creator',
    password: await bcrypt.hash(process.env.DEFAULT_CONTENT_CREATOR_PASSWORD, 10),
    locale: 'en',
    defaultEditor: 'markdown',
    tfaIsActive: false,
    isActive: true,
    isVerified: true,
    isSystem: true
  })
  await creator.$relatedQuery('groups').relate(creatorsGroupId)
  WIKI.logger.info('Creator account created.')

  // Create a default user for tests
  const user = await WIKI.models.users.query().insert({
    provider: 'local',
    email: process.env.DEFAULT_USER_EMAIL,
    name: 'Default user',
    password: await bcrypt.hash(process.env.DEFAULT_USER_PASSWORD, 10),
    locale: 'en',
    defaultEditor: 'markdown',
    tfaIsActive: false,
    isActive: true,
    isVerified: true,
    isSystem: true
  })
  await user.$relatedQuery('groups').relate(usersGroupId)

  WIKI.logger.info('Default user account created.')
}
