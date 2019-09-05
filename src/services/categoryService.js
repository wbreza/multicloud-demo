const shortid = require("shortid");
const model = require("../categories.json");
const cache = new Map(model.categories.map((category) => [category.id, category]));

module.exports = {
  getList: () => {
    return Array.from(cache.values());
  },

  get: (id) => {
    return cache.get(id);
  },

  save: (category) => {
    if (!category.id) {
      category.id = shortid.generate();
      category.created = Date.now();

      const allCategories = Array.from(cache.values());
      const existing = allCategories.find((p) => p.name === category.name);
      if (existing) {
        throw new Error("Category with same name already exists");
      }
    }

    category.modified = Date.now();
    cache.set(category.id, category);

    return category;
  },

  remove: (id) => {
    cache.delete(id);
  }
}
