const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);
const pagination = require('../middlewares/pagination')

describe("Donation Get Endpoint", () => {
  it("should display list of donations successfully", async done => {
    const res = await request.get("/donations", pagination);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({
        "data": expect.any(Array),
        "perPage": expect.any(Number),
        "offset": expect.any(Number)
    }));
    done();
  });
});
