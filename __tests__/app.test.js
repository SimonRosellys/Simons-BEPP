const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const app = require("../app");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("GET /api/topics", () => {
  test("200: responds with an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Array);
        console.log(res.body);
        expect(
          res.body.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          })
        );
      });
  });
});
