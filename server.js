const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { MongoClient } = require("mongodb");

const { PORT, MONGO_URL } = require("./config");
const logger = require("./utils/logger");
const productsRoutes = require("./routing/products");
const logoutRoutes = require("./routing/logout");
const killRoutes = require("./routing/kill");
const homeRoutes = require("./routing/home");
const { STATUS_CODE } = require("./constants/statusCode");
const { MENU_LINKS } = require("./constants/navigation");
const cartController = require("./controllers/cartController");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((request, _response, next) => {
  const { url, method } = request;
  logger.getInfoLog(url, method);
  next();
});

// 🔌 MongoDB bağlantısı kurulduktan sonra rotaları yükle
MongoClient.connect(MONGO_URL)
  .then((client) => {
    console.log("✅ Successfully connected to MongoDB");

    const db = client.db("testdb");
    app.locals.db = db;

    // ✅ Rotalar artık db hazırken tanımlanıyor
    app.use("/products", productsRoutes);
    app.use("/logout", logoutRoutes);
    app.use("/kill", killRoutes);
    app.use(homeRoutes);

    app.use((request, response) => {
      const { url } = request;
      const cartCount = cartController.getProductsCount();

      response.status(STATUS_CODE.NOT_FOUND).render("404", {
        headTitle: "404",
        menuLinks: MENU_LINKS,
        activeLinkPath: "",
        cartCount,
      });
      logger.getErrorLog(url);
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });
