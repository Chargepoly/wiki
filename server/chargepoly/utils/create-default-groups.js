/* global WIKI */

const ADMINS_PERMISSIONS = [
  'manage:system' // Can manage and access everything
]

const GUESTS_PERMISSIONS = ['read:assets']

const CREATORS_PERMISSIONS = [
  'read:pages',
  'write:pages',
  'manage:pages',
  'delete:pages',
  'read:source',
  'read:history',
  'read:assets',
  'write:assets',
  'manage:assets',
  'read:comments',
  'write:comments',
  'manage:comments',
  'write:styles',
  'write:scripts'
]

const USERS_PERMISSIONS = ['read:pages', 'read:assets']

/**
 * 4 groups are created.
 * Administrators : Can manage and access everything.
 * Guests : Group required by WIKI JS (not used)
 * Creators : Group of user that can create documentation
 * Users: Group of users with read only permission. All users from API are in this group.
 *
 * When a user is send from OSLO-API he is saved in the Users group.
 * Only an admin can convert this user to a creator
 *
 */
module.exports = async function createDefaultGroups() {
  // Admins (admin in not create by API but oin the /finalize route) // Cannot be deleted
  const adminsGroup = await WIKI.models.groups.query().insert({
    name: 'Administrators',
    permissions: JSON.stringify(ADMINS_PERMISSIONS),
    pageRules: JSON.stringify([]),
    isSystem: true
  })
  WIKI.logger.info('"Administrators" group created.')

  // Guest (WIKI user by default) // Cannot be deleted
  const guestsGroup = await WIKI.models.groups.query().insert({
    name: 'Guests',
    permissions: JSON.stringify(GUESTS_PERMISSIONS),
    pageRules: JSON.stringify([]),
    isSystem: true
  })
  WIKI.logger.info('"Guests" group created.')

  if (adminsGroup.id !== 1 || guestsGroup.id !== 2) {
    throw new Error(
      'Incorrect groups auto-increment configuration! Should start at 0 and increment by 1. Contact your database administrator.'
    )
  }

  // Content creator (created in the dashboard)
  const creatorsGroup = await WIKI.models.groups.query().insert({
    name: 'Creators',
    permissions: JSON.stringify(CREATORS_PERMISSIONS),
    pageRules: JSON.stringify(
      [{id: 'default', deny: false, match: 'START', roles: ['read:pages', 'read:assets', 'read:comments', 'write:comments', 'write:pages'], path: '', locales: []}]
    ),
    isSystem: true
  })
  WIKI.logger.info('"Creators" group created.')

  // Users (all users from API are in this group). Admin can transform a User to a ContentCreateor
  const usersGroup = await WIKI.models.groups.query().insert({
    name: 'Users',
    permissions: JSON.stringify(USERS_PERMISSIONS),
    pageRules: JSON.stringify(WIKI.data.groups.defaultPageRules),
    isSystem: true
  })
  WIKI.logger.info('"Users" group created.')

  return {
    adminsGroupId: adminsGroup.id,
    guestsGroupId: guestsGroup.id,
    creatorsGroupId: creatorsGroup.id,
    usersGroupId: usersGroup.id
  }
}
