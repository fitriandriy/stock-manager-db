const express = require("express");
const router = express.Router();
const stok = require("../controllers/stocks.js")
const authMiddleware = require("../middlewares/auth.js")

router.get("/:warehouse/:date", stok.query_data)
router.get("/:date", stok.reports)
router.post("/", stok.create)
router.post("/move", stok.move)
router.put("/", stok.update)
router.delete("/:id", stok.delete)
// router.get("/:warehouse/:date", authMiddleware.auth, stok.query_data)
// router.get("/:date", authMiddleware.auth, stok.reports)
// router.post("/", authMiddleware.auth, stok.create)
// router.post("/move", authMiddleware.auth, stok.move)
// router.put("/", authMiddleware.auth, stok.update)
// router.delete("/:id", authMiddleware.auth, stok.delete)

module.exports = router