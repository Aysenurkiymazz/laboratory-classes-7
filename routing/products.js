const express = require("express");

const productsController = require("../controllers/productsController");
const cartController = require("../controllers/cartController");

const router = express.Router();

// Ürün listesini getir
router.get("/", productsController.getProductsView);

// Ürün ekleme sayfasını getir (form)
router.get("/add", productsController.getAddProductView);

// Yeni ürünü veritabanına ekle (POST)
router.post("/add", productsController.addProduct);

// En son eklenen ürünü getir
router.get("/new", productsController.getNewProductView);

// Belirli bir ürünü getir
router.get("/:name", productsController.getProductView);

// Ürünü sil
router.delete("/:name", productsController.deleteProduct);

module.exports = router;

