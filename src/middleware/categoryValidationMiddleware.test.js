const { CloudContextBuilder } = require("@multicloud/sls-core");
const categoryValidationMiddleware = require("./categoryValidationMiddleware")();
const categoryService = require("../services/categoryService");
const demoModel = require("../categories.json");

describe("Category Validation Middleware", () => {
  it("responds with 400 if categoryId path param is missing", () => {
    const next = jest.fn();
    const builder = new CloudContextBuilder();
    const context = builder
      .asHttpRequest()
      .withRequestMethod("GET")
      .build();

    categoryValidationMiddleware(context, next);

    expect(next).not.toBeCalled();
    expect(context.res).toMatchObject({
      body: { message: "Category ID is required" },
      status: 400
    });
  });

  it("responds with 404 if categoryId is not found", () => {
    categoryService.get = jest.fn(() => null);

    const next = jest.fn();
    const builder = new CloudContextBuilder();
    const context = builder
      .asHttpRequest()
      .withRequestMethod("GET")
      .withRequestPathParams({ categoryId: "ABC123" })
      .build();

    categoryValidationMiddleware(context, next);

    expect(next).not.toBeCalled();
    expect(context.res).toMatchObject({
      body: { message: "Category not found" },
      status: 404
    });
  });

  it("continues next lifecycle when successfull", () => {
    categoryService.get = jest.fn(() => demoModel.categories[0]);

    const next = jest.fn();
    const builder = new CloudContextBuilder();
    const context = builder
      .asHttpRequest()
      .withRequestMethod("GET")
      .withRequestPathParams({ categoryId: "ABC123" })
      .build();

    categoryValidationMiddleware(context, next);

    expect(next).toBeCalled();
    expect(context.category).toEqual(demoModel.categories[0]);
  });
});
