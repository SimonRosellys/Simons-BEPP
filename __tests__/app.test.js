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
  test("an invalid endpoint returns error 404 path not found", () => {
    return request(app)
      .get("/api/toppics")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Path not found");
      });
  });
  test("an object with correct keys is returned on a  article ID query", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_id: expect.any(Number),
        });
      });
  });
  test("an object with correct keys is returned on a specific article ID query", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          author: "paul",
          title: "UNCOVERED: catspiracy to bring down democracy",
          article_id: 5,
          body: "Bastet walks amongst us, and the cats are taking arms!",
          topic: "cats",
          created_at: "2020-08-03T13:14:00.000Z",
          votes: 0,
        });
      });
  });
  test("404 article does not exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("article does not exist");
      });
  });
});
