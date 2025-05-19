const express = require("express");
const router = express.Router();
const material = require("../controllers/materials.js")
const authMiddleware = require("../middlewares/auth.js")

router.get("/rekap", material.getRekapProduksi)

module.exports = router