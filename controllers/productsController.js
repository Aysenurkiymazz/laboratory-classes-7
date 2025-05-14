const Product = require("../models/Product");
const { MENU_LINKS } = require("../constants/navigation");
const { STATUS_CODE } = require("../constants/statusCode");
const cartController = require("./cartController");

exports.getProductsView = (request, response) => {
  const cartCount = cartController.getProductsCount();
  const db = request.app.locals.db;

  Product.getAll(db)
    .then(products => {
      response.render("products.ejs", {
        headTitle: "Shop - Products",
        path: "/",
        menuLinks: MENU_LINKS,
        activeLinkPath: "/products",
        products,
        cartCount,
      });
    })
    .catch(err => {
      console.error("Error loading products:", err);
      response.status(500).send("Error loading products");
    });
};

exports.getAddProductView = (request, response) => {
  const cartCount = cartController.getProductsCount();

  response.render("add-product.ejs", {
    headTitle: "Shop - Add Product",
    path: "/add",
    menuLinks: MENU_LINKS,
    activeLinkPath: "/products/add",
    cartCount,
  });
};

// Yeni ürün kaydı (form post)
exports.addProduct = (request, response) => {
  const { name, description, price } = request.body;
  const db = request.app.locals.db;

  if (!name || !description || isNaN(price)) {
    return response.status(400).send("Invalid product data");
  }

  const product = new Product(name, description, parseFloat(price));
  product.save(db)
    .then(() => response.redirect("/products"))
    .catch(err => {
      console.error("Error saving product:", err);
      response.status(500).send("Error saving product");
    });
};

// En son eklenen ürünü göster
exports.getNewProductView = (request, response) => {
  const cartCount = cartController.getProductsCount();
  const db = request.app.locals.db;

  Product.getLast(db)
    .then(newestProduct => {
      response.render("new-product.ejs", {
        headTitle: "Shop - New Product",
        path: "/new",
        activeLinkPath: "/products/new",
        menuLinks: MENU_LINKS,
        newestProduct,
        cartCount,
      });
    })
    .catch(err => {
      console.error("Error loading latest product:", err);
      response.status(500).send("Error loading latest product");
    });
};

exports.getProductView = (request, response) => {
  const cartCount = cartController.getProductsCount();
  const name = request.params.name;
  const db = request.app.locals.db;

  Product.findByName(db, name)
    .then(product => {
      if (!product) {
        return response.status(404).send("Product not found");
      }

      response.render("product.ejs", {
        headTitle: "Shop - Product",
        path: `/products/${name}`,
        activeLinkPath: `/products/${name}`,
        menuLinks: MENU_LINKS,
        product,
        cartCount,
      });
    })
    .catch(err => {
      console.error("Error loading product:", err);
      response.status(500).send("Error loading product");
    });
};

exports.deleteProduct = (request, response) => {
  const name = request.params.name;
  const db = request.app.locals.db;

  Product.deleteByName(db, name)
    .then(result => {
      if (result.deletedCount === 0) {
        return response.status(404).json({ success: false, message: "Product not found" });
      }

      response.status(STATUS_CODE.OK).json({ success: true });
    })
    .catch(err => {
      console.error("Error deleting product:", err);
      response.status(500).json({ success: false });
    });
};

