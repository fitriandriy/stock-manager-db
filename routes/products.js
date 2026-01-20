const express = require("express");
const router = express.Router();
const products = require("../controllers/products.js")
const authMiddleware = require("../middlewares/auth.js")

router.get("/data", products.getProducts)
router.get("/stock-products", products.getTotalStocks)
router.get("/production-process/:date", products.getProductionProcessReport)
router.get("/report/:warehouse/:date", products.getTotalStockPerWarehouse)
router.get("/:warehouse/:date", products.query_data)
router.get("/:date", products.reports)
router.post("/", products.create)
router.post("/add-stock", products.add_stock)
router.post("/move", products.move)
router.delete("/:id", products.delete)
module.exports = router