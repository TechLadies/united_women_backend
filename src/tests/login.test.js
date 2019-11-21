const supertest = require("supertest");
const app = require("../app");
const login = require("../auth/auth").login;
const passport = require("passport");
const request = supertest(app);

describe("Login Post Endpoint", () => {
  it("should login successfully", async done => {
    const res = await request.post("/login", login).send({
      username: "tan@uws.org.sg",
      password: "password123"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    done();
  });
});
