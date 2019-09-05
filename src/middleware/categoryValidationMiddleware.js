const categoryService = require("../services/categoryService");

module.exports = () => async (context, next) => {
  if (!context.req.pathParams.has("categoryId")) {
    return context.send({ message: "Category ID is required" }, 400);
  }

  const category = categoryService.get(context.req.pathParams.get("categoryId"));
  if (!category) {
    return context.send({ message: "Category not found" }, 404);
  }

  context.category = category;

  await next();
}
