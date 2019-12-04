const supertest = require("supertest");
const app = require("../app");
const login = require("../auth/auth").login;
const passport = require("passport");
const request = supertest(app);

function post(url, body, middleware) {
  const httpRequest = request.post(url);
  httpRequest.send(body);
  return httpRequest;
}

let body = {
  username: "tan@uws.org.sg",
  password: "password123"
};

describe("Login Post Endpoint", () => {
  it("should login successfully", async done => {
    const res = await post("/login", body, login);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    done();
  });
});

module.exports = {
  post,
  body
}