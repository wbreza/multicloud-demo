const { CloudContextBuilder } = require("@multicloud/sls-core");
const { getCategoryList, getCategory, postCategory, putCategory, patchCategory, deleteCategory } = require("../handlers/categories");
const categoryService = require("../services/categoryService");
const categoriesModel = require("../categories.json");

describe("Categorys REST API", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe("GET List", () => {
    it("responds with list of categories", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .invokeHandler(getCategoryList);

      expect(context.res).toMatchObject({
        body: { values: categoriesModel.categories },
        status: 200
      });
    });
  });

  describe("GET Category By Id", () => {
    it("responds with 404 when category is not found", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ categoryId: "unknown" })
        .invokeHandler(getCategory);

      expect(context.res).toMatchObject({
        body: { message: "Category not found" },
        status: 404
      });
    });

    it("responds with category when found", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ categoryId: categoriesModel.categories[0].id })
        .invokeHandler(getCategory);

      expect(context.res).toMatchObject({
        body: { value: categoriesModel.categories[0] },
        status: 200
      });
    });
  });

  describe("POST Category", () => {
    it("responds with 400 when body is empty", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("POST")
        .invokeHandler(postCategory);

      expect(context.res).toMatchObject({
        body: { message: "Category is required" },
        status: 400
      });
    });

    it("responds with 409 when category already exists", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("POST")
        .withRequestBody(categoriesModel.categories[0])
        .invokeHandler(postCategory);

      expect(context.res).toMatchObject({
        body: { message: "Category with same name already exists" },
        status: 409
      });
    });

    it("responds with 201 when category was successfully created", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("POST")
        .withRequestBody({ name: "New Category" })
        .invokeHandler(postCategory);

      expect(context.res).toMatchObject({
        body: expect.anything(),
        status: 201
      });
    });
  });

  describe("PUT Category", () => {
    it("responds with 404 when category is not found", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ categoryId: "unknown" })
        .invokeHandler(putCategory);

      expect(context.res).toMatchObject({
        body: { message: "Category not found" },
        status: 404
      });
    });

    it("responds with 204 and updates category successfully", async () => {
      categoryService.get = jest.fn(() => categoriesModel.categories[0]);
      jest.spyOn(categoryService, "save");

      const categoryToUpdate = {
        ...categoriesModel.categories[0],
        name: categoriesModel.categories[0] + ' (Updated)',
      };

      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ categoryId: categoryToUpdate.id })
        .withRequestBody(categoryToUpdate)
        .invokeHandler(putCategory);

      expect(categoryService.save).toBeCalledWith(expect.objectContaining(categoryToUpdate));
      expect(context.res.status).toEqual(204);
    });
  });

  describe("PATCH Category", () => {
    it("responds with 404 when category is not found", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ categoryId: "unknown" })
        .invokeHandler(patchCategory);

      expect(context.res).toMatchObject({
        body: { message: "Category not found" },
        status: 404
      });
    });

    it("responds with 204 and updates category successfully", async () => {
      categoryService.get = jest.fn(() => categoriesModel.categories[0]);
      jest.spyOn(categoryService, "save");

      const partialUpdate = {
        name: "(Updated)",
      };

      const expectedCategory = {
        ...categoriesModel.categories[0],
        name: partialUpdate.name,
      };

      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ categoryId: expectedCategory.id })
        .withRequestBody(partialUpdate)
        .invokeHandler(patchCategory);

      expect(categoryService.save).toBeCalledWith(expect.objectContaining(expectedCategory));
      expect(context.res.status).toEqual(204);
    });
  });

  describe("DELETE Category", () => {
    it("responds with 404 when category is not found", async () => {
      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ categoryId: "unknown" })
        .invokeHandler(deleteCategory);

      expect(context.res).toMatchObject({
        body: { message: "Category not found" },
        status: 404
      });
    });

    it("responds with 204 and updates category successfully", async () => {
      categoryService.get = jest.fn(() => categoriesModel.categories[0]);
      jest.spyOn(categoryService, "remove");

      const builder = new CloudContextBuilder();
      const context = await builder
        .asHttpRequest()
        .withRequestMethod("GET")
        .withRequestPathParams({ categoryId: categoriesModel.categories[0].id })
        .invokeHandler(deleteCategory);

      expect(categoryService.remove).toBeCalledWith(categoriesModel.categories[0].id);
      expect(context.res.status).toEqual(204);
    });
  });
});
