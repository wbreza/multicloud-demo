const app = require("../app");
const middlewares = require("../config")();
const productService = require("../services/productsService");

module.exports = {
  /**
   * Gets a list of products
   */
  getProductList: app.use(middlewares, (context) => {
    const products = productService.getProducts();

    context.send({ values: products }, 200);
  }),

  /**
   * Gets the metadata for the specified product id
   */
  getProduct: app.use(middlewares, (context) => {
    if (!context.pathParams.productId) {
      return context.send({ message: "Product ID is required" }, 400);
    }

    const product = productServicd.get(context.pathParams.producId);
    if (!product) {
      return context.send({ message: "Product not found" }, 404);
    }

    context.send({ value: product }, 200);
  }),

  /**
   * Creates a new product
   */
  postProduct: app.use(middlewares, (context) => {
    const product = context.req.body;
    if (!product) {
      return context.send({ message: "Product is required" }, 400);
    }

    product = productService.save(product);

    return context.send({ value: product }, 201);
  }),

  /**
   * Updates a product with the specified id
   */
  putProduct: app.use(middlewares, (context) => {
    const existing = productService.get(context.req.pathParams.productId);
    if (!existing) {
      return context.send({ message: "Product not found" }, 404);
    }

    const product = context.req.body;
    if (!product) {
      return context.send({ message: "Product is required" }, 400);
    }

    const updatedProduct = {
      ...context.req.body,
      id: context.req.pathParams.productId
    }

    productService.save(updatedProduct);

    return context.send(null, 204);
  }),

  /**
   * Merges an update with the product at the specified id
   */
  patchProduct: app.use(middlewares, (context) => {
    const existing = productService.get(context.req.pathParams.productId);
    if (!existing) {
      return context.send({ message: "Product not found" }, 404);
    }

    const udpatedProduct = {
      ...existing,
      ...context.req.body,
      id: context.req.pathParams.productId
    };

    product = productService.save(udpatedProduct);

    return context.send(null, 204);
  }),

  /**
   * Delete a product with the specified id
   */
  deleteProduct: app.use(middlewares, (context) => {
    const product = productService.get(context.req.pathParams.productId);
    if (!product) {
      return context.send({ message: "Product not found" }, 404);
    }

    productService.remove(context.req.pathParams.productId);
    context.send(null, 204);
  })
};