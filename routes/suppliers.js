const express = require("express")
const router = express.Router()
const Suppliers = require("../controllers/suppliers")

router.get("/", Suppliers.query)

module.exports = router