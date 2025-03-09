const express = require("express")
const router = express.Router()
const stocks = require("./stocks")
const users = require("./users")
const suppliers = require("./suppliers")
const customers = require("./customers")

router.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Welcome to DB API!"
  })
})

router.use("/auth", users)
router.use("/stocks", stocks)
router.use("/suppliers", suppliers)
router.use("/customers", customers)

module.exports = router;