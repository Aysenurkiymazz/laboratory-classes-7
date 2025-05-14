class Product {
  constructor(name, description, price) {
    this.name = name;
    this.description = description;
    this.price = price;
  }

  save(db) {
    if (!db) throw new Error("❌ Product.save(): db is undefined");
    return db.collection("products").insertOne(this);
  }

  static getAll(db) {
    if (!db) throw new Error("❌ Product.getAll(): db is undefined");
    return db.collection("products").find().toArray();
  }

  static findByName(db, name) {
    if (!db) throw new Error("❌ Product.findByName(): db is undefined");
    return db.collection("products").findOne({ name });
  }

  static deleteByName(db, name) {
    if (!db) throw new Error("❌ Product.deleteByName(): db is undefined");
    return db.collection("products").deleteOne({ name });
  }

  static getLast(db) {
    if (!db) throw new Error("❌ Product.getLast(): db is undefined");
    return db.collection("products")
             .find()
             .sort({ _id: -1 })
             .limit(1)
             .toArray()
             .then(items => items[0]);
  }
}

module.exports = Product;
