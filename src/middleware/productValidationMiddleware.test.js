const { CloudContextBuilder } = require("@multicloud/sls-core");
const productValidationMiddleware = require("./productValidationMiddleware")();
const productService = require("../services/productService");
const demoModel = require("../products.json");

describe("Product Validation Middleware", () => {
  it("responds with 400 if productId path param is missing", () => {
    const next = jest.fn();
    const builder = new CloudContextBuilder();
    const context = builder
      .asHttpRequest()
      .withRequestMethod("GET")
      .build();

    productValidationMiddleware(context, next);

    expect(next).not.toBeCalled();
    expect(context.res).toMatchObject({
      body: { message: "Product ID is required" },
      status: 400
    });
  });

  it("responds with 404 if productId is not found", () => {
    productService.get = jest.fn(() => null);

    const next = jest.fn();
    const builder = new CloudContextBuilder();
    const context = builder
      .asHttpRequest()
      .withRequestMethod("GET")
      .withRequestPathParams({ productId: "ABC123" })
      .build();

    productValidationMiddleware(context, next);

    expect(next).not.toBeCalled();
    expect(context.res).toMatchObject({
      body: { message: "Product not found" },
      status: 404
    });
  });

  it("continues next lifecycle when successfull", () => {
    productService.get = jest.fn(() => demoModel.products[0]);

    const next = jest.fn();
    const builder = new CloudContextBuilder();
    const context = builder
      .asHttpRequest()
      .withRequestMethod("GET")
      .withRequestPathParams({ productId: "ABC123" })
      .build();

    productValidationMiddleware(context, next);

    expect(next).toBeCalled();
    expect(context.product).toEqual(demoModel.products[0]);
  });
});
