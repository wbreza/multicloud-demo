const shortid = require("shortid");
const model = require("../products.json");
const cache = new Map(model.products);

module.exports = {
  getList: () => {
    return cache.entries;
  },

  get: (id) => {
    return cache.get(id);
  },

  save: (product) => {
    const existing = this.get(product.id);
    if (!existing) {
      existing = product;
      existing.id = shortid.generate();
    }

    cache.set(existing.id, existing);

    return existing;
  },

  remove: (id) => {
    cache.delete(id);
  }
}