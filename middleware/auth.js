const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  const bearer = token.split(" ");
    const bearerToken = bearer[1];
  if (bearerToken) {
    jwt.verify(bearerToken, 'secret', (err, decodedToken) => {
      if (err) {
        console.log(err)
        return res.status(401).json({ message: 'Invalid token' });
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { requireAuth };
