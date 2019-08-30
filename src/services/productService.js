const shortid = require("shortid");
const model = require("../products.json");
const cache = new Map(model.products.map((product) => [product.id, product]));

module.exports = {
  getList: () => {
    return Array.from(cache.values());
  },

  get: (id) => {
    return cache.get(id);
  },

  save: (product) => {
    if (!product.id) {
      product.id = shortid.generate();
      product.created = Date.now();

      const allProducts = Array.from(cache.values());
      const existing = allProducts.find((p) => p.name === product.name);
      if (existing) {
        throw new Error("Product with same name already exists");
      }
    }

    product.modified = Date.now();
    cache.set(product.id, product);

    return product;
  },

  remove: (id) => {
    cache.delete(id);
  }
}