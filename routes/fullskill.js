const express = require("express")
const router = express.Router()
const fullskill = require("../controllers/fullskill")
const authMiddleware = require("../middlewares/auth.js")

router.post("/", fullskill.add)
router.get("/", fullskill.getFullskillByMonth)

module.exports = router