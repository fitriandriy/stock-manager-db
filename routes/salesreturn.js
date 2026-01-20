const express = require("express")
const router = express.Router()
const retur = require("../controllers/salesreturns")

router.get("/:startDate/:endDate/:status", retur.queryData)
router.post("/", retur.add)
router.put("/", retur.edit)
router.delete("/:id", retur.delete)

module.exports = router