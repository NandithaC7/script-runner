const { jwtVerify, createRemoteJWKSet } = require('jose')

const JWKS = createRemoteJWKSet(
  new URL(
    'http://localhost:8080/realms/rpa-launcher/protocol/openid-connect/certs'
  )
)

async function authMiddleware(req, res, next) {

  try {

    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }

    const token = authHeader.split(' ')[1]

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: 'http://localhost:8080/realms/rpa-launcher'
    })

    req.user = payload

    next()

  } catch (err) {

    console.error('TOKEN ERROR:', err)

    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }
}

module.exports = authMiddleware