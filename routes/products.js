const express = require("express");
const router = express.Router();
const products = require("../controllers/products.js")
const authMiddleware = require("../middlewares/auth.js")

router.get("/data", authMiddleware.auth, products.getProducts)
router.get("/stock-products", authMiddleware.auth, products.getTotalStocks)
router.get("/production-process/:date", authMiddleware.auth, products.getProductionProcessReport)
router.get("/report/:warehouse/:date", authMiddleware.auth, products.getTotalStockPerWarehouse)
router.get("/:warehouse/:date", authMiddleware.auth, products.query_data)
router.get("/:date", authMiddleware.auth, products.reports)
router.post("/", authMiddleware.auth, products.create)
router.post("/add-stock", authMiddleware.auth, products.add_stock)
router.post("/move", authMiddleware.auth, products.move)
router.delete("/:id", authMiddleware.auth, products.delete)
module.exports = router