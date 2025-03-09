const { Users } = require("../db/models")
const jwt = require("jsonwebtoken")
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if ( !username || !password ) {
        return res.status(404).json({
          status: false,
          message: "Email and password are required!",
          data: null
        })
      }

      const findUser = await Users.findOne({ where : { username } })

      if ( !findUser ) {
        return res.status(400).json({
          status: false, 
          message: "Username is not registered!",
          data: null
        })
      }

      if ( findUser.password !== password ) {
        return res.status(400).json({
          status: false,
          message: "Password is incorrect!",
          data: null
        })
      }

      const payload = {
        id: findUser.id,
        role: findUser.role,
      };

      const token = await jwt.sign(payload, JWT_SECRET_KEY);

      return res.status(200).json({
        status: true,
        message: "Login success!",
        data: {
          username: findUser.username,
          token: token,
        },
      });
    } catch (error) {
      console.log(error)
    }
  }
}