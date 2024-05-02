const REQUIRED_ENV_KEYS = [
  'API_KEY',
  'API_KEY_NAME',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'DEFAULT_USER_EMAIL',
  'DEFAULT_USER_PASSWORD',
  'HOST'
]

/**
 * @description Verify if required env variable are set to run setup function
 *
*/
function verifyEnvironmentForSetup() {
  const missingKeys = []
  REQUIRED_ENV_KEYS.forEach((key) => {
    if (!process.env.hasOwnProperty(key)) {
      missingKeys.push(key)
    }
  })
  if (missingKeys.length) {
    throw new Error(`Missing keys in env: ${missingKeys}`)
  }
}

module.exports = {verifyEnvironmentForSetup}
