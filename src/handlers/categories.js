const app = require("../app");
const middlewares = require("../config")();
const categoryValidation = require("../middleware/categoryValidationMiddleware");
const categoryMiddlewares = middlewares.concat(categoryValidation());
const categoriesService = require("../services/categoryService");

module.exports = {
  /**
   * Gets a list of categories
   */
  getCategoryList: app.use(middlewares, (context) => {
    const categories = categoriesService.getList();
    context.send({ values: categories }, 200);
  }),

  /**
   * Gets the metadata for the specified category id
   */
  getCategory: app.use(categoryMiddlewares, (context) => {
    context.send({ value: context.category }, 200);
  }),

  /**
   * Creates a new category
   */
  postCategory: app.use(middlewares, (context) => {
    let category = context.req.body;

    if (!category) {
      return context.send({ message: "Category is required" }, 400);
    }

    try {
      delete category.id;
      category = categoriesService.save(category);
    } catch (err) {
      return context.send({ message: err.message }, 409);
    }

    return context.send({ value: category }, 201);
  }),

  /**
   * Updates a category with the specified id
   */
  putCategory: app.use(categoryMiddlewares, (context) => {
    const category = context.req.body;
    if (!category) {
      return context.send({ message: "Category is required" }, 400);
    }

    const updatedCategory = {
      ...context.req.body,
      id: context.req.pathParams.get("categoryId")
    }

    categoriesService.save(updatedCategory);

    return context.send(null, 204);
  }),

  /**
   * Merges an update with the category at the specified id
   */
  patchCategory: app.use(categoryMiddlewares, (context) => {
    const udpatedCategory = {
      ...context.category,
      ...context.req.body,
      id: context.req.pathParams.get("categoryId")
    };

    categoriesService.save(udpatedCategory);

    return context.send(null, 204);
  }),

  /**
   * Delete a category with the specified id
   */
  deleteCategory: app.use(categoryMiddlewares, (context) => {
    categoriesService.remove(context.req.pathParams.get("categoryId"));
    context.send(null, 204);
  })
};
