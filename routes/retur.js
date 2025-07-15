const express = require("express")
const router = express.Router()
const retur = require("../controllers/retur")

router.get("/:date", retur.query)
router.put("/", retur.updateRetur)

module.exports = router