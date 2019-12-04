const path = require("path");
const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);
const auth = require(path.resolve("src/auth/auth"));
const pagination = require("../middlewares/pagination");
const login = require("../tests/login.test");

describe("Donation Get Endpoint", () => {
  // When valid token is supplied
  it("should display list of donations successfully", async done => {
    let res = await login.post("/login", login.body, auth.login);
    const token = res.body.token;
    res = await request
      .get("/donations", auth.required, pagination)
      .set("Authorization", "Bearer " + token);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
        perPage: expect.any(Number),
        offset: expect.any(Number)
      })
    );
    done();
  });

  // When valid token is not supplied
  it("should return an error message", async done => {
    const res = await request.get("/donations", auth.required, pagination);
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("403 forbidden");
    done();
  });
});
