const app = require("../app");
const middlewares = require("../config")();
const productValidation = require("../middleware/productValidationMiddleware");
const categoryValidation = require("../middleware/categoryValidationMiddleware");
const categoryMiddlewares = middlewares.concat(categoryValidation());
const productMiddlewares = middlewares.concat(productValidation());
const productService = require("../services/productService");

module.exports = {
  /**
   * Gets a list of products
   */
  getProductList: app.use(middlewares, (context) => {
    const products = productService.getList();
    context.send({ values: products }, 200);
  }),

  /**
   * Get a list of products filtered by category
   */
  getProductListByCategory: app.use(categoryMiddlewares, (context) => {
    const products = productService.getList().filter((product) => product.categoryId === context.category.id);
    context.send({ values: products }, 200);
  }),

  /**
   * Gets the metadata for the specified product id
   */
  getProduct: app.use(productMiddlewares, (context) => {
    context.send({ value: context.product }, 200);
  }),

  /**
   * Creates a new product
   */
  postProduct: app.use(middlewares, (context) => {
    let product = context.req.body;

    if (!product) {
      return context.send({ message: "Product is required" }, 400);
    }

    try {
      delete product.id;
      product = productService.save(product);
    } catch (err) {
      return context.send({ message: err.message }, 409);
    }

    return context.send({ value: product }, 201);
  }),

  /**
   * Updates a product with the specified id
   */
  putProduct: app.use(productMiddlewares, (context) => {
    const product = context.req.body;
    if (!product) {
      return context.send({ message: "Product is required" }, 400);
    }

    const updatedProduct = {
      ...context.req.body,
      id: context.req.pathParams.get("productId")
    }

    productService.save(updatedProduct);

    return context.send(null, 204);
  }),

  /**
   * Merges an update with the product at the specified id
   */
  patchProduct: app.use(productMiddlewares, (context) => {
    const udpatedProduct = {
      ...context.product,
      ...context.req.body,
      id: context.req.pathParams.get("productId")
    };

    productService.save(udpatedProduct);

    return context.send(null, 204);
  }),

  /**
   * Delete a product with the specified id
   */
  deleteProduct: app.use(productMiddlewares, (context) => {
    productService.remove(context.req.pathParams.get("productId"));
    context.send(null, 204);
  })
};
