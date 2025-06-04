const express = require("express")
const router = express.Router()
const stocks = require("./stocks")
const products = require("./products")
const users = require("./users")
const suppliers = require("./suppliers")
const customers = require("./customers")
const materials = require("./materials")
const warehouse = require("../controllers/warehouses")
const fullskill = require("./fullskill")
const purchases = require("./purchases")

router.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Welcome to DB API!"
  })
})

router.use("/auth", users)
router.use("/stocks", stocks)
router.use("/products", products)
router.use("/suppliers", suppliers)
router.use("/customers", customers)
router.use("/fullskill", fullskill)
router.use("/purchases", purchases)
router.get("/warehouses", warehouse.query)
router.use("/material", materials)

module.exports = router;