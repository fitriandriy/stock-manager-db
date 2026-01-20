const express = require("express")
const router = express.Router()
const Customers = require("../controllers/customers")

router.get("/", Customers.query)

module.exports = router