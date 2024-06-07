const NEEDED_VARIABLES = [
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'DEFAULT_CONTENT_CREATOR_EMAIL',
  'DEFAULT_CONTENT_CREATOR_PASSWORD',
  'DEFAULT_USER_EMAIL',
  'DEFAULT_USER_PASSWORD',
  'API_KEY',
  'API_KEY_NAME',
  'HOST'
]

module.exports = function verifyEnv() {
  NEEDED_VARIABLES.forEach(key => {
    if (!process.env[key]) {
      throw new Error(`Missing env variable: ${key}`)
    }
  })
}
