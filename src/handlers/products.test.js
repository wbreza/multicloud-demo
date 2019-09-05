const { CloudContextBuilder } = require("@multicloud/sls-core");
const { getProductList, getProductListByCategory, getProduct, postProduct, putProduct, patchProduct, deleteProduct } = require("../handlers/products");
const productService = require("../services/productService");
const productsModel = require("../products.json");
const categoriesModel = require("../categories.json");

describe("Products REST API", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe("GET List", () => {
    it("responds with list of products", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .invokeHandler(getProductList);

      expect(context.res).toMatchObject({
        body: { values: productsModel.products },
        status: 200
      });
    });
  });

  it("responds with a list of products by category", async () => {
    const category = categoriesModel.categories[0];
    const expected = productsModel.products.filter((product) => product.categoryId === category.id);

    const builder = new CloudContextBuilder();
    const context = await builder
      .asHttpRequest()
      .withRequestMethod("GET")
      .withRequestPathParams({ categoryID: category.id })
      .invokeHandler(getProductListByCategory)

    expect(context.res).toMatchObject({
      body: { values: expected },
      status: 200
    });
  });

  describe("GET Product By Id", () => {
    it("responds with 404 when product is not found", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ productId: "unknown" })
        .invokeHandler(getProduct);

      expect(context.res).toMatchObject({
        body: { message: "Product not found" },
        status: 404
      });
    });

    it("responds with product when found", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ productId: productsModel.products[0].id })
        .invokeHandler(getProduct);

      expect(context.res).toMatchObject({
        body: { value: productsModel.products[0] },
        status: 200
      });
    });
  });

  describe("POST Product", () => {
    it("responds with 400 when body is empty", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("POST")
        .invokeHandler(postProduct);

      expect(context.res).toMatchObject({
        body: { message: "Product is required" },
        status: 400
      });
    });

    it("responds with 409 when product already exists", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("POST")
        .withRequestBody(productsModel.products[0])
        .invokeHandler(postProduct);

      expect(context.res).toMatchObject({
        body: { message: "Product with same name already exists" },
        status: 409
      });
    });

    it("responds with 201 when product was successfully created", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("POST")
        .withRequestBody({ name: "New Product" })
        .invokeHandler(postProduct);

      expect(context.res).toMatchObject({
        body: expect.anything(),
        status: 201
      });
    });
  });

  describe("PUT Product", () => {
    it("responds with 404 when product is not found", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ productId: "unknown" })
        .invokeHandler(putProduct);

      expect(context.res).toMatchObject({
        body: { message: "Product not found" },
        status: 404
      });
    });

    it("responds with 204 and updates product successfully", async () => {
      productService.get = jest.fn(() => productsModel.products[0]);
      jest.spyOn(productService, "save");

      const productToUpdate = {
        ...productsModel.products[0],
        name: productsModel.products[0] + ' (Updated)',
      };

      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ productId: productToUpdate.id })
        .withRequestBody(productToUpdate)
        .invokeHandler(putProduct);

      expect(productService.save).toBeCalledWith(expect.objectContaining(productToUpdate));
      expect(context.res.status).toEqual(204);
    });
  });

  describe("PATCH Product", () => {
    it("responds with 404 when product is not found", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ productId: "unknown" })
        .invokeHandler(patchProduct);

      expect(context.res).toMatchObject({
        body: { message: "Product not found" },
        status: 404
      });
    });

    it("responds with 204 and updates product successfully", async () => {
      productService.get = jest.fn(() => productsModel.products[0]);
      jest.spyOn(productService, "save");

      const partialUpdate = {
        name: "(Updated)",
      };

      const expectedProduct = {
        ...productsModel.products[0],
        name: partialUpdate.name,
      };

      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ productId: expectedProduct.id })
        .withRequestBody(partialUpdate)
        .invokeHandler(patchProduct);

      expect(productService.save).toBeCalledWith(expect.objectContaining(expectedProduct));
      expect(context.res.status).toEqual(204);
    });
  });

  describe("DELETE Product", () => {
    it("responds with 404 when product is not found", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ productId: "unknown" })
        .invokeHandler(deleteProduct);

      expect(context.res).toMatchObject({
        body: { message: "Product not found" },
        status: 404
      });
    });

    it("responds with 204 and updates product successfully", async () => {
      productService.get = jest.fn(() => productsModel.products[0]);
      jest.spyOn(productService, "remove");

      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ productId: productsModel.products[0].id })
        .invokeHandler(deleteProduct);

      expect(productService.remove).toBeCalledWith(productsModel.products[0].id);
      expect(context.res.status).toEqual(204);
    });
  });
});
