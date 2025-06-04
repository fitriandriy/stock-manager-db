const express = require("express")
const router = express.Router()
const purchases = require("../controllers/purchases")

router.get("/", purchases.query)
router.post("/", purchases.create)
router.delete("/:id", purchases.deleteData)

module.exports = router