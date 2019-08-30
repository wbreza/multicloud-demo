const productService = require("../services/productService");

module.exports = () => async (context, next) => {
  if (!context.req.pathParams.has("productId")) {
    return context.send({ message: "Product ID is required" }, 400);
  }

  const product = productService.get(context.req.pathParams.get("productId"));
  if (!product) {
    return context.send({ message: "Product not found" }, 404);
  }

  context.product = product;

  await next();
}