const express = require("express")
const router = express.Router()
const fullskill = require("../controllers/fullskill")
const authMiddleware = require("../middlewares/auth.js")

router.post("/", authMiddleware.auth, fullskill.add)
router.get("/", authMiddleware.auth, fullskill.getFullskillByMonth)

module.exports = router