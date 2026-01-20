const { Customers } = require("../db/models")

module.exports = {
  query : async (req, res) => {
    try {
      const customer = await Customers.findAll()

      if (!customer) {
        return res.status(404).json({
          status: false,
          message: "data not found.",
          data: null
        })
      }

      return res.status(200).json({
        status: true,
        message: "success",
        data: customer
      })
      
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error,
        data: null
      })
    }
  }
}