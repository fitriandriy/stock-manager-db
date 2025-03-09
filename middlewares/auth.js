const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  auth: async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      console.log(`JWT NYA NIH : ${authorization}`)
      const token = authorization.split(" ")[1];

      if (!authorization) {
        return res.sendStatus(401);
      }
      console.log(`TOKEN: ${authorization}`) 
      const data = jwt.verify(token, JWT_SECRET_KEY);
      req.user = {
        id: data.id,
        role: data.role,
      };
      next();
    } catch (error) {
      throw error;
    }
  },

  is_admin: async (req, res, next) => {
    const { role } = req.user;
    if (role != "admin") {
      return res.sendStatus(403);
    }
    next();
  },
};